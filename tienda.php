<?php
/* ============================================================
   NVISION — Tienda · Vitrina, carrito y panel de inventario
   ------------------------------------------------------------
   Esta página es la tienda completa y tiene dos zonas:

   1) LA VITRINA (lo que ve el cliente): tarjetas con la foto
      de cada producto, su precio en pesos y su stock, con
      buscador por nombre, filtro por categoría y orden. Desde
      cada tarjeta se agrega el producto al CARRITO de compras
      (el carrito vive en la sesión y se paga en carrito.php).

   2) EL PANEL DE INVENTARIO (el CRUD principal del proyecto):
      registrar, consultar, editar y eliminar productos. La
      foto de cada producto NO se escribe a mano en el panel:
      los productos la traen de su registro y los nuevos se
      muestran con su símbolo SVG por categoría.

   Todo llega por POST, se guarda en MySQL y la página se
   recarga (patrón Post/Redirect/Get). Las funciones de la
   base están en backend/bd.php.
   ============================================================ */
// La sesión se abre antes que nada: el carrito de compras
// vive en $_SESSION y sin sesión no habría dónde guardarlo.
session_start();
// Se cargan las funciones de productos, búsqueda y ventas.
require_once __DIR__ . '/backend/bd.php';
// Y los símbolos SVG de la tienda (includes/iconos.php): la
// tienda no usa emojis, dibuja sus íconos en SVG de trazo.
require_once __DIR__ . '/includes/iconos.php';

// ===== AYUDAS DE LA TIENDA =====
/* Las categorías válidas son las mismas de la columna
   «categoria» de la tabla productos. */
function producto_categoria_valida($categoria) {
    // in_array con el tercer parámetro en true compara también el
    // tipo: solo pasa si el texto es EXACTAMENTE una de las cuatro
    // categorías del ENUM, ni «redes» en minúscula ni otra inventada.
    return in_array($categoria, array('Componentes', 'Periféricos', 'Redes', 'Accesorios'), true);
}

/* Lee y valida los datos del formulario de producto del panel.
   Devuelve el arreglo listo para guardar, o null si algo está
   mal: el nombre es obligatorio y el precio y la cantidad
   deben ser enteros de cero en adelante. La foto NO viene del
   formulario: al crear queda «sin foto» (la tarjeta muestra el
   símbolo SVG de su categoría) y al editar se conserva la que
   el producto ya tenga guardada. */
function producto_datos_formulario() {
    // Nombre del producto, sin espacios sobrantes de las puntas.
    $nombre      = trim($_POST['nombre'] ?? '');
    // Si el formulario no manda categoría, se asume «Componentes».
    $categoria   = $_POST['categoria'] ?? 'Componentes';
    // La descripción es opcional, pero igual se lee limpia.
    $descripcion = trim($_POST['descripcion'] ?? '');
    // Precio y cantidad llegan como texto del formulario…
    $precioTxt   = trim($_POST['precio'] ?? '');
    $cantidadTxt = trim($_POST['cantidad'] ?? '');
    // …y aquí se comprueba que sí sean enteros: FILTER_VALIDATE_INT
    // devuelve el número o false si traía letras o decimales.
    $precio   = filter_var($precioTxt, FILTER_VALIDATE_INT);
    $cantidad = filter_var($cantidadTxt, FILTER_VALIDATE_INT);
    // Cualquier falla devuelve null: nombre muy corto, categoría
    // fuera del ENUM, o precio/cantidad que no sean enteros de
    // cero en adelante.
    if (mb_strlen($nombre) < 2 || !producto_categoria_valida($categoria)
        || $precio === false || $precio < 0
        || $cantidad === false || $cantidad < 0) {
        return null;
    }
    // Todo válido: se entrega el paquete listo para bd.php.
    // La imagen va en null: al crear es «sin foto» y al editar
    // el controlador la reemplaza por la foto ya guardada.
    return array(
        'nombre'      => $nombre,
        'categoria'   => $categoria,
        'descripcion' => $descripcion,
        'precio'      => $precio,
        'cantidad'    => $cantidad,
        'imagen'      => null
    );
}

/* Cuántos productos lleva el carrito de la sesión, sumando las
   cantidades de todos los ítems (para el enlace «Carrito (n)»). */
function carrito_total_items() {
    // Si el carrito ni siquiera existe, la cuenta es cero.
    if (empty($_SESSION['carrito'])) {
        return 0;
    }
    // array_sum suma las cantidades: id => cantidad, id => cantidad…
    return (int)array_sum($_SESSION['carrito']);
}

/* El símbolo de respaldo de una tarjeta (cuando el producto
   no tiene foto) lo dibuja icono_producto() de
   includes/iconos.php: un SVG de trazo según el producto,
   nada de emojis. */

/* ¿La foto del producto se puede mostrar? Solo si trae ruta
   escrita Y el archivo existe de verdad en el proyecto: así
   una ruta mal escrita no rompe la vitrina: simplemente
   cae al símbolo SVG de respaldo. */
function producto_tiene_foto($prod) {
    // Sin ruta no hay foto que buscar.
    if (empty($prod['imagen'])) {
        return false;
    }
    // file_exists revisa la ruta contra el disco del servidor.
    return file_exists(__DIR__ . '/' . $prod['imagen']);
}

/* Reconstruye la parte de la URL con los filtros actuales
   (buscador, categoría y orden) para que al agregar un producto
   al carrito la vitrina vuelva tal como estaba, con el aviso. */
function tienda_url_filtros($extra) {
    // Los filtros viajan en campos ocultos del formulario de
    // «Agregar al carrito», porque la acción llega por POST.
    $params = array(
        'q'         => $_POST['filtro_q'] ?? '',
        'categoria' => $_POST['filtro_categoria'] ?? '',
        'orden'     => $_POST['filtro_orden'] ?? ''
    );
    // Se quitan los filtros vacíos para no ensuciar la URL.
    $params = array_filter($params, function ($v) { return $v !== ''; });
    // Se suma el parámetro extra (ej: agregado=1) y se arma la URL.
    $params[$extra] = '1';
    return 'tienda.php?' . http_build_query($params);
}

// ===== ACCIONES QUE LLEGAN POR POST =====
// Solo se procesa algo cuando la petición llegó enviando un formulario.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // El campo oculto «accion» dice qué se está pidiendo.
    $accion = $_POST['accion'] ?? '';

    // ----- AGREGAR AL CARRITO: un producto de la vitrina -----
    if ($accion === 'agregar') {
        // El botón de la tarjeta manda el id del producto.
        $pid = (int)($_POST['id'] ?? 0);
        // Se consulta el producto fresco: puede ya no existir o
        // haberse agotado desde que se pintó la vitrina.
        $prod = $pid > 0 ? bd_producto($pid) : null;
        if ($prod !== null) {
            // El carrito se crea vacío la primera vez que se usa.
            if (!isset($_SESSION['carrito'])) {
                $_SESSION['carrito'] = array();
            }
            // Cuántas unidades de este producto ya van en el carrito.
            $lleva = (int)($_SESSION['carrito'][$pid] ?? 0);
            // Solo se agrega si todavía queda stock para una más:
            // no se puede vender lo que no hay en el inventario.
            if ($lleva < (int)$prod['cantidad']) {
                // Se suma 1 a la cantidad de ese id en la sesión.
                $_SESSION['carrito'][$pid] = $lleva + 1;
                // De vuelta a la vitrina (con sus filtros) y aviso.
                header('Location: ' . tienda_url_filtros('agregado'));
            } else {
                // Sin stock suficiente: aviso de error y sin cambios.
                header('Location: ' . tienda_url_filtros('sinstock'));
            }
        } else {
            // El producto ya no existe: aviso genérico de error.
            header('Location: tienda.php?error=1');
        }
        // Después de redirigir no se sigue ejecutando la página.
        exit;
    }

    // ----- CREAR: registrar un producto (panel de inventario) -----
    if ($accion === 'crear') {
        // Primero se validan los datos con la ayuda de arriba.
        $d = producto_datos_formulario();
        if ($d !== null) {
            // Datos buenos: se inserta la fila en la tabla productos.
            bd_producto_crear($d['nombre'], $d['categoria'], $d['descripcion'], $d['precio'], $d['cantidad'], $d['imagen']);
            // Se recarga la tienda con el aviso de «registrado».
            header('Location: tienda.php?creado=1');
        } else {
            // Datos malos: se vuelve a la tienda con el aviso de error.
            header('Location: tienda.php?error=1');
        }
        exit;
    }

    // ----- ACTUALIZAR: guardar el producto editado -----
    if ($accion === 'actualizar') {
        // El id del producto que se está editando viene oculto en el form.
        $pid = (int)($_POST['id'] ?? 0);
        // Los datos nuevos pasan por la misma validación del crear.
        $d = producto_datos_formulario();
        if ($pid > 0 && $d !== null) {
            // La foto NO se edita desde el formulario: se lee la
            // fila actual y se conserva la foto que ya tiene.
            $actual = bd_producto($pid);
            // Se sobrescribe la fila de ese id en productos.
            bd_producto_actualizar($pid, $d['nombre'], $d['categoria'], $d['descripcion'], $d['precio'], $d['cantidad'], $actual['imagen'] ?? null);
            // De vuelta a la tienda, con el aviso de «actualizado».
            header('Location: tienda.php?actualizado=1');
        } else {
            // Si algo falló se regresa AL MISMO formulario de
            // edición (con su ?editar=) para corregir sin perder el producto.
            header('Location: tienda.php?editar=' . $pid . '&error=1');
        }
        exit;
    }

    // ----- ELIMINAR: borrar un producto -----
    if ($accion === 'eliminar') {
        // El botón Eliminar del panel manda el id en oculto.
        $pid = (int)($_POST['id'] ?? 0);
        // Solo se borra si el id es un número positivo real.
        if ($pid > 0) {
            bd_producto_eliminar($pid);
        }
        // Tienda recargada, ya sin el producto, con su aviso.
        header('Location: tienda.php?eliminado=1');
        exit;
    }
}

// ===== CONSULTAR: datos para la vista =====
// ----- Filtros de la vitrina (llegan por GET) -----
// Lo que la persona escribió en el buscador (sin espacios de más).
$buscar = trim($_GET['q'] ?? '');
// La categoría del filtro: si no es una de las cuatro válidas,
// bd_producto_buscar() la ignora y muestra todas.
$filtroCategoria = $_GET['categoria'] ?? '';
// La clave del orden elegido; la lista blanca está en bd.php.
$filtroOrden = $_GET['orden'] ?? 'recientes';
// La vitrina se llena con la búsqueda filtrada y ordenada.
$productos = bd_producto_buscar($buscar, $filtroCategoria, $filtroOrden);
// El panel de inventario, en cambio, lista TODO sin filtros,
// porque ahí se administra el inventario completo.
$inventario = bd_productos();
// Cuántos ítems lleva el carrito, para el enlace «Carrito (n)».
$itemsCarrito = carrito_total_items();

// Producto cargado en el formulario del panel cuando se va a
// editar (tienda.php?editar=ID); si no hay edición, es null.
// Por defecto el formulario va en modo «registrar», vacío.
$editarProducto = null;
// Si la URL trae ?editar=ID (el enlace Editar del panel)…
if (isset($_GET['editar'])) {
    // …se busca ese producto y el formulario se carga con sus datos.
    $editarProducto = bd_producto((int)$_GET['editar']);
}
?>
<!DOCTYPE html>
<html lang="es" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content">
  <!-- Sistema de seguridad del código fuente: Política de Seguridad de Contenido (CSP).
       Solo se pueden cargar recursos del propio sitio y de los CDN que la página usa.
       Se bloquean scripts inyectados o externos no autorizados, objetos, iframes y
       envíos de formularios a sitios ajenos. -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com https://encrypted-tbn0.gstatic.com https://acf.geeknetic.es https://jensa.vtexassets.com https://www.esmero.com.co https://pisces.bbystatic.com https://placaschinas.com https://th.bing.com https://www.cyberpuerta.mx https://www.legionmac.com https://www.ntcompatible.com https://*.googleusercontent.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://xiuztrujrwdgcpjrruxu.supabase.co https://*.googleusercontent.com; media-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self'">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <title>NVISION - Tienda: compra tecnología</title>
  <!-- Hojas de estilo modular -->
  <link rel="stylesheet" href="frontend/css/styles.css?v=129">
  <!-- Estilos propios de la tienda y el carrito: como cada página
       arma su propio <head> (includes/header.php es solo la barra
       de navegación), esta hoja se enlaza aquí y en carrito.php,
       que son las únicas dos páginas que la necesitan. -->
  <link rel="stylesheet" href="frontend/css/tienda.css?v=1">
  <!-- SEO, iconos y vista previa al compartir (Open Graph / Twitter) -->
  <meta name="description" content="Tienda NVISION: compra componentes, periféricos, redes y accesorios de tecnología con precios en pesos, fotos de los productos y carrito de compras.">
  <meta name="theme-color" content="#f8fafc">
  <link rel="canonical" href="https://nvision.social/tienda.php">
  <link rel="icon" href="/favicon.ico?v=4" sizes="any">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=4">
  <link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png?v=4">
  <link rel="manifest" href="/manifest.webmanifest">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="NVISION">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="NVISION">
  <meta property="og:locale" content="es_CO">
  <meta property="og:title" content="NVISION - Tienda: compra tecnología">
  <meta property="og:description" content="Tienda NVISION: compra tecnología con precios en pesos y stock en vivo desde la base de datos.">
  <meta property="og:url" content="https://nvision.social/tienda.php">
  <meta property="og:image" content="https://nvision.social/assets/og-image.jpg">
</head>
<body>

  <!-- Encabezado y Barra de Navegación Adaptativa -->
  <?php include __DIR__ . '/includes/header.php'; ?>
<main>
  <section class="topo-hero">
    <p class="ruta-kicker">Tienda</p>
    <h1>Tienda NVISION · Compra tecnología</h1>
    <p class="topo-sub">Componentes, periféricos, redes y accesorios con foto, precio en pesos y stock en vivo. Agrega lo que necesites al carrito y finaliza tu compra en un solo paso.</p>
    <!-- Acciones del encabezado: la misma fila de botones del
         hero de la portada (hero-buttons con btn-primary y
         btn-secondary), para que la tienda se vea parte del
         sitio y no una página aparte. -->
    <div class="hero-buttons tienda-hero-acciones">
      <!-- El carrito como botón principal: el total de ítems que
           la sesión ya lleva va en la pastilla blanca del botón. -->
      <a class="btn-primary" href="carrito.php"><?php echo icono_svg('carrito', 'icono-btn'); ?> Carrito <span class="tienda-carrito-badge"><?php echo $itemsCarrito; ?></span></a>
      <!-- Salto directo al panel de inventario de más abajo. -->
      <a class="btn-secondary" href="#inventario">Ver inventario</a>
    </div>
  </section>

  <section class="mejora-wrap">
<!-- Avisos según el parámetro que traiga la URL después de cada
     redirección: ?agregado, ?sinstock, ?creado, ?actualizado,
     ?eliminado o ?error -->
<?php if (isset($_GET['agregado'])): ?>
    <div class="mejora-card"><p class="mejora-msg">¡Producto agregado al carrito! Sigue comprando o <a href="carrito.php">ve al carrito a pagar</a>.</p></div>
<?php endif; ?>
<?php if (isset($_GET['sinstock'])): ?>
    <div class="mejora-card"><p class="mejora-msg">Ya llevas en el carrito todo el stock disponible de ese producto.</p></div>
<?php endif; ?>
<?php if (isset($_GET['creado'])): ?>
    <div class="mejora-card"><p class="mejora-msg">¡Producto registrado! Ya aparece en la vitrina y en el inventario.</p></div>
<?php endif; ?>
<?php if (isset($_GET['actualizado'])): ?>
    <div class="mejora-card"><p class="mejora-msg">¡Producto actualizado!</p></div>
<?php endif; ?>
<?php if (isset($_GET['eliminado'])): ?>
    <div class="mejora-card"><p class="mejora-msg">Producto eliminado del inventario.</p></div>
<?php endif; ?>
<?php if (isset($_GET['error']) && !$editarProducto): ?>
    <div class="mejora-card"><p class="mejora-msg">No se pudo completar la acción. Revisa los datos e inténtalo de nuevo.</p></div>
<?php endif; ?>

    <!-- ===== BUSCADOR Y FILTROS DE LA VITRINA =====
         Viaja por GET: así la búsqueda queda en la URL y se
         puede recargar o compartir tal como está filtrada. -->
    <form method="get" action="tienda.php" class="tienda-filtros">
      <div class="tienda-filtros-grupo">
        <label class="mejora-label" for="filtro-q">Buscar por nombre</label>
        <!-- El valor se rellena con lo buscado para no perderlo al filtrar -->
        <input class="mejora-input" id="filtro-q" name="q" type="search" maxlength="60" placeholder="Ej: SSD, mouse, router…" value="<?php echo e($buscar); ?>">
      </div>
      <div class="tienda-filtros-grupo">
        <label class="mejora-label" for="filtro-categoria">Categoría</label>
        <select class="mejora-select" id="filtro-categoria" name="categoria">
          <!-- «Todas» manda el valor vacío: bd_producto_buscar no filtra -->
          <option value=""<?php echo $filtroCategoria === '' ? ' selected' : ''; ?>>Todas</option>
<?php foreach (array('Componentes', 'Periféricos', 'Redes', 'Accesorios') as $cat): ?>
          <!-- Una opción por categoría del ENUM; queda marcada la elegida -->
          <option value="<?php echo $cat; ?>"<?php echo $filtroCategoria === $cat ? ' selected' : ''; ?>><?php echo $cat; ?></option>
<?php endforeach; ?>
        </select>
      </div>
      <div class="tienda-filtros-grupo">
        <label class="mejora-label" for="filtro-orden">Ordenar por</label>
        <select class="mejora-select" id="filtro-orden" name="orden">
          <!-- Las claves de este select son las de la lista blanca de bd_producto_buscar() -->
          <option value="recientes"<?php echo $filtroOrden === 'recientes' ? ' selected' : ''; ?>>Más recientes</option>
          <option value="precio-menor"<?php echo $filtroOrden === 'precio-menor' ? ' selected' : ''; ?>>Precio: menor a mayor</option>
          <option value="precio-mayor"<?php echo $filtroOrden === 'precio-mayor' ? ' selected' : ''; ?>>Precio: mayor a menor</option>
          <option value="nombre"<?php echo $filtroOrden === 'nombre' ? ' selected' : ''; ?>>Nombre (A-Z)</option>
        </select>
      </div>
      <button type="submit" class="tool-btn">Buscar</button>
      <!-- Limpiar vuelve a la tienda sin ningún parámetro -->
      <a class="tool-btn tool-btn-ghost" href="tienda.php">Limpiar</a>
    </form>

    <!-- ===== VITRINA: tarjetas de productos en cuadrícula ===== -->
    <div class="tienda-grid">
<?php if (!$productos): ?>
      <!-- La búsqueda no encontró nada con esos filtros -->
      <div class="mejora-card tienda-sin-resultados">
        <p>No se encontraron productos con ese nombre o categoría. Prueba con otra búsqueda o <a href="tienda.php">limpia los filtros</a>.</p>
      </div>
<?php else: ?>
<?php foreach ($productos as $prod): ?>
      <!-- Tarjeta de UN producto de la vitrina -->
      <article class="tienda-card">
        <!-- Zona visual: la foto del producto o su emoji de respaldo -->
        <div class="tienda-card-img">
<?php if (producto_tiene_foto($prod)): ?>
          <!-- La foto sale de la ruta guardada en la columna imagen -->
          <img src="<?php echo e($prod['imagen']); ?>" alt="<?php echo e($prod['nombre']); ?>" loading="lazy">
<?php else: ?>
          <!-- Sin foto válida: recuadro con el símbolo SVG del producto -->
          <div class="tienda-card-icono" aria-hidden="true"><?php echo icono_producto($prod); ?></div>
<?php endif; ?>
<?php if ((int)$prod['cantidad'] === 0): ?>
          <!-- Sello de agotado cruzado sobre la imagen -->
          <span class="tienda-agotado">Agotado</span>
<?php endif; ?>
        </div>
        <div class="tienda-card-body">
          <!-- Insignia con la categoría del producto -->
          <span class="foro-tag mejora-chip tienda-badge"><?php echo e($prod['categoria']); ?></span>
          <h3 class="tienda-card-title"><?php echo e($prod['nombre']); ?></h3>
          <p class="tienda-card-desc"><?php echo e($prod['descripcion']); ?></p>
          <!-- precio_cop() convierte 85000 en «$ 85.000» -->
          <p class="tienda-precio"><?php echo e(precio_cop($prod['precio'])); ?></p>
          <!-- El stock: si es 0 la tarjeta lo dice en vez de un número -->
          <p class="tienda-stock"><?php echo (int)$prod['cantidad'] > 0 ? 'Stock: ' . (int)$prod['cantidad'] . ' unidades' : 'Sin unidades disponibles'; ?></p>
<?php if ((int)$prod['cantidad'] > 0): ?>
          <!-- AGREGAR AL CARRITO: mini formulario POST por tarjeta.
               Los campos ocultos filtro_* guardan la búsqueda actual
               para volver a la misma vitrina después de agregar. -->
          <form method="post" action="tienda.php" class="tienda-agregar-form">
            <input type="hidden" name="accion" value="agregar">
            <input type="hidden" name="id" value="<?php echo e($prod['id']); ?>">
            <input type="hidden" name="filtro_q" value="<?php echo e($buscar); ?>">
            <input type="hidden" name="filtro_categoria" value="<?php echo e($filtroCategoria); ?>">
            <input type="hidden" name="filtro_orden" value="<?php echo e($filtroOrden); ?>">
            <button type="submit" class="tool-btn tienda-btn-agregar"><?php echo icono_svg('carrito', 'icono-btn'); ?> Agregar al carrito</button>
          </form>
<?php endif; ?>
        </div>
      </article>
<?php endforeach; ?>
<?php endif; ?>
    </div>

    <!-- ===== PANEL DE INVENTARIO (CRUD) =====
         Debajo de la vitrina: aquí se administra el inventario
         completo (registrar, editar y eliminar productos). -->
    <div class="mejora-card tienda-panel" id="inventario">
      <h2>Panel de inventario (CRUD)</h2>
      <p>Administración de la tienda: desde aquí se registran los productos, se corrigen sus datos y se retiran los que ya no se venden.</p>

      <!-- CREAR / ACTUALIZAR: el mismo formulario sirve para
           registrar un producto nuevo y para editar uno
           existente: si $editarProducto trae datos, se carga
           con ellos y al guardar ACTUALIZA en vez de crear. -->
      <h3><?php echo $editarProducto ? 'Editar producto' : 'Registrar producto'; ?></h3>
<?php if ($editarProducto && isset($_GET['error'])): ?>
      <p class="mejora-msg">No se pudo guardar. Revisa el nombre y que el precio y la cantidad sean números de cero en adelante.</p>
<?php endif; ?>
      <!-- El formulario se envía a esta misma página; validaciones.js lo revisa antes (id form-producto) -->
      <form method="post" action="tienda.php" id="form-producto">
        <!-- Campo oculto que le dice al PHP de arriba si debe crear o actualizar -->
        <input type="hidden" name="accion" value="<?php echo $editarProducto ? 'actualizar' : 'crear'; ?>">
<?php if ($editarProducto): ?>
        <!-- Solo en edición: el id del producto que se está modificando -->
        <input type="hidden" name="id" value="<?php echo e($editarProducto['id']); ?>">
<?php endif; ?>
        <label class="mejora-label" for="prod-nombre">Nombre del producto</label>
        <!-- maxlength 120 es el mismo tope de la columna nombre (VARCHAR 120); al editar se rellena con el nombre guardado -->
        <input class="mejora-input" id="prod-nombre" name="nombre" type="text" maxlength="120" required value="<?php echo e($editarProducto['nombre'] ?? ''); ?>">
        <label class="mejora-label" for="prod-categoria">Categoría</label>
        <select class="mejora-select" id="prod-categoria" name="categoria">
<?php foreach (array('Componentes', 'Periféricos', 'Redes', 'Accesorios') as $cat): ?>
          <!-- Una opción por valor del ENUM; al editar queda marcada la categoría que el producto ya tenía -->
          <option value="<?php echo $cat; ?>"<?php echo ($editarProducto['categoria'] ?? 'Componentes') === $cat ? ' selected' : ''; ?>><?php echo $cat; ?></option>
<?php endforeach; ?>
        </select>
        <label class="mejora-label" for="prod-descripcion">Descripción</label>
        <!-- Descripción corta del producto (la columna admite 300 caracteres) -->
        <textarea class="mejora-textarea" id="prod-descripcion" name="descripcion" maxlength="300"><?php echo e($editarProducto['descripcion'] ?? ''); ?></textarea>
        <label class="mejora-label" for="prod-precio">Precio (pesos)</label>
        <!-- type number con min 0 y paso 1: el navegador tampoco deja escribir precios negativos ni con decimales -->
        <input class="mejora-input" id="prod-precio" name="precio" type="number" min="0" step="1" required value="<?php echo e($editarProducto['precio'] ?? ''); ?>">
        <label class="mejora-label" for="prod-cantidad">Cantidad en inventario</label>
        <!-- El stock: 0 es válido y significa que el producto está agotado -->
        <input class="mejora-input" id="prod-cantidad" name="cantidad" type="number" min="0" step="1" required value="<?php echo e($editarProducto['cantidad'] ?? ''); ?>">
        <!-- Sin campo de imagen: la foto no se escribe a mano.
             Un producto nuevo se muestra con el símbolo SVG de
             su categoría y al editar se conserva la foto actual. -->
        <button type="submit" class="tool-btn"><?php echo $editarProducto ? 'Guardar cambios' : 'Registrar producto'; ?></button>
<?php if ($editarProducto): ?>
        <a class="tool-btn tool-btn-ghost" href="tienda.php">Cancelar edición</a>
<?php endif; ?>
      </form>

      <!-- CONSULTAR / ACTUALIZAR / ELIMINAR: la tabla del
           inventario completo, sin los filtros de la vitrina -->
      <h3>Inventario actual</h3>
      <div class="tienda-tabla-wrap">
        <table class="tienda-tabla">
          <thead>
            <tr><th>Foto</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
          </thead>
          <tbody>
<?php if (!$inventario): ?>
            <!-- Inventario vacío: se invita a registrar el primer producto -->
            <tr><td colspan="6">Todavía no hay productos. ¡Registra el primero con el formulario!</td></tr>
<?php else: ?>
<?php foreach ($inventario as $prod): ?>
            <!-- Una fila por producto del inventario -->
            <tr>
              <td>
<?php if (producto_tiene_foto($prod)): ?>
                <!-- Miniatura de la foto en la tabla del panel -->
                <img class="tienda-thumb" src="<?php echo e($prod['imagen']); ?>" alt="<?php echo e($prod['nombre']); ?>">
<?php else: ?>
                <!-- Sin foto: el emoji ocupa el lugar de la miniatura -->
                <span class="tienda-thumb-icono" aria-hidden="true"><?php echo icono_producto($prod); ?></span>
<?php endif; ?>
              </td>
              <td><?php echo e($prod['nombre']); ?></td>
              <td><?php echo e($prod['categoria']); ?></td>
              <td><?php echo e(precio_cop($prod['precio'])); ?></td>
              <td><?php echo (int)$prod['cantidad']; ?></td>
              <td class="tienda-acciones">
                <!-- Editar es un enlace GET: recarga la tienda con el formulario cargado de este producto -->
                <a class="tool-btn tool-btn-ghost" href="tienda.php?editar=<?php echo e($prod['id']); ?>">Editar</a>
                <!-- Eliminar es un mini formulario POST; la clase form-confirmar hace que validaciones.js pregunte antes de borrar -->
                <form method="post" action="tienda.php" class="form-confirmar" data-confirm="¿Seguro que quieres eliminar «<?php echo e($prod['nombre']); ?>» del inventario?">
                  <input type="hidden" name="accion" value="eliminar">
                  <input type="hidden" name="id" value="<?php echo e($prod['id']); ?>">
                  <button type="submit" class="tool-btn tool-btn-ghost">Eliminar</button>
                </form>
              </td>
            </tr>
<?php endforeach; ?>
<?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</main>

  <?php include __DIR__ . '/includes/footer.php'; ?>

  <!-- Script interactivo bilingüe y menú móvil -->
  <script src="frontend/js/interfaz.js"></script>
</body>
</html>
