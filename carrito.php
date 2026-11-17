<?php
/* ============================================================
   NVISION — Carrito de compras (PHP + sesiones + MySQL)
   ------------------------------------------------------------
   El carrito vive en la SESIÓN del visitante:
   $_SESSION['carrito'] es un arreglo id => cantidad con los
   productos que agregó desde la vitrina de tienda.php.

   Desde esta página se puede:
     - cambiar la cantidad de un ítem (mínimo 1, máximo el
       stock que haya en la base en ese momento),
     - quitar un ítem o vaciar todo el carrito,
     - FINALIZAR LA COMPRA: se valida el stock con datos
       frescos de la base y la venta se guarda con
       bd_venta_registrar(), que trabaja en transacción:
       guarda la venta, sus detalles y descuenta el stock,
       todo o nada.

   Los precios y el stock NUNCA se toman de la sesión: se
   leen de la base de datos al mostrar la página y otra vez
   al pagar, por si el inventario cambió mientras tanto.

   La vista está rediseñada: los ítems van como TARJETAS en
   una columna y el resumen de la compra en una tarjeta fija
   a la derecha; los símbolos son SVG de includes/iconos.php
   (la tienda no usa emojis).
   ============================================================ */
// La sesión se abre antes que nada: sin ella no hay carrito.
session_start();
// Funciones de la base: productos por ids y registro de ventas.
require_once __DIR__ . '/backend/bd.php';
// Los símbolos SVG de la tienda (carrito, productos, listo…).
require_once __DIR__ . '/includes/iconos.php';

// El carrito se crea vacío la primera vez que se entra aquí.
if (!isset($_SESSION['carrito'])) {
    $_SESSION['carrito'] = array();
}

// ===== AYUDAS DEL CARRITO =====
/* El símbolo de respaldo de un producto (cuando no tiene foto)
   lo dibuja icono_producto() de includes/iconos.php: un SVG
   de trazo según el producto, nada de emojis. */

/* ¿La foto del producto se puede mostrar? Ruta escrita Y
   archivo existente, igual que en la vitrina de tienda.php. */
function carrito_tiene_foto($prod) {
    // Sin ruta no hay foto que buscar.
    if (empty($prod['imagen'])) {
        return false;
    }
    // file_exists revisa la ruta contra el disco del servidor.
    return file_exists(__DIR__ . '/' . $prod['imagen']);
}

// ===== ACCIONES QUE LLEGAN POR POST =====
// Solo se procesa algo cuando la petición llegó enviando un formulario.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // El campo oculto «accion» dice qué se está pidiendo.
    $accion = $_POST['accion'] ?? '';

    // ----- CAMBIAR LA CANTIDAD DE UN ÍTEM -----
    if ($accion === 'cantidad') {
        // El renglón manda su id y la cantidad escrita.
        $pid = (int)($_POST['id'] ?? 0);
        // La cantidad se lee como entero; si trae letras, queda 0
        // y la validación de abajo lo trata como dato inválido.
        $nueva = filter_var(trim($_POST['cantidad'] ?? ''), FILTER_VALIDATE_INT);
        // Solo se toca un ítem que de verdad esté en el carrito.
        if ($pid > 0 && isset($_SESSION['carrito'][$pid])) {
            // El tope es el stock REAL de la base en este momento.
            $prod = bd_producto($pid);
            // Si el producto ya no existe, el ítem se retira.
            if ($prod === null) {
                unset($_SESSION['carrito'][$pid]);
                header('Location: carrito.php?retirado=1');
                exit;
            }
            // Cantidad inválida (no es entero o es menor que 1):
            // no se cambia nada y se avisa el error.
            if ($nueva === false || $nueva < 1) {
                header('Location: carrito.php?error=1');
                exit;
            }
            // Si pidió más de lo que hay, se ajusta al stock máximo
            // en vez de rechazar: el aviso «ajustado» lo explica.
            if ($nueva > (int)$prod['cantidad']) {
                $_SESSION['carrito'][$pid] = (int)$prod['cantidad'];
                header('Location: carrito.php?ajustado=1');
                exit;
            }
            // Cantidad válida: se guarda tal cual en la sesión.
            $_SESSION['carrito'][$pid] = $nueva;
            header('Location: carrito.php?actualizado=1');
            exit;
        }
        // Ítem desconocido: se vuelve sin tocar nada.
        header('Location: carrito.php');
        exit;
    }

    // ----- QUITAR UN ÍTEM DEL CARRITO -----
    if ($accion === 'quitar') {
        // El botón Quitar de cada renglón manda el id en oculto.
        $pid = (int)($_POST['id'] ?? 0);
        // unset borra solo esa casilla del arreglo de la sesión.
        if ($pid > 0) {
            unset($_SESSION['carrito'][$pid]);
        }
        // Carrito recargado, ya sin ese ítem, con su aviso.
        header('Location: carrito.php?quitado=1');
        exit;
    }

    // ----- VACIAR TODO EL CARRITO -----
    if ($accion === 'vaciar') {
        // El carrito vuelve a ser un arreglo vacío.
        $_SESSION['carrito'] = array();
        // De vuelta a la página, que mostrará «carrito vacío».
        header('Location: carrito.php?vaciado=1');
        exit;
    }

    // ----- FINALIZAR LA COMPRA -----
    if ($accion === 'comprar') {
        // Sin ítems no hay compra posible.
        if (empty($_SESSION['carrito'])) {
            header('Location: carrito.php?error=1');
            exit;
        }
        // ----- DATOS DE ENTREGA -----
        // La venta es CONTRA ENTREGA: el formulario pide el
        // nombre de quien recibe y la dirección, y sin esos
        // datos no hay compra (la misma validación que hace
        // validaciones.js, repetida aquí en el servidor).
        $cliente = trim((string)($_POST['cliente'] ?? ''));
        $direccion = trim((string)($_POST['direccion'] ?? ''));
        if (strlen($cliente) < 3 || strlen($direccion) < 5) {
            header('Location: carrito.php?faltan=1');
            exit;
        }
        // Datos FRESCOS de todos los productos del carrito: los
        // precios y el stock se leen de la base en este instante.
        $frescos = bd_productos_por_ids(array_keys($_SESSION['carrito']));
        // Se arma la lista de ítems ya validados para la venta.
        $items = array();
        // El total se va sumando renglón por renglón.
        $total = 0;
        // Bandera: se apaga si algún ítem ya no se puede vender.
        $todoBien = true;
        // Se revisa ítem por ítem contra la base fresca.
        foreach ($_SESSION['carrito'] as $pid => $cant) {
            // ¿El producto sigue existiendo en el inventario?
            if (!isset($frescos[$pid])) {
                $todoBien = false;
                break;
            }
            // La fila fresca de este producto.
            $prod = $frescos[$pid];
            // ¿El stock alcanza para la cantidad del carrito?
            if ((int)$cant > (int)$prod['cantidad']) {
                $todoBien = false;
                break;
            }
            // Ítem válido: se guarda con el nombre y el precio
            // DE LA BASE (los que verá el detalle de la venta).
            $items[] = array(
                'id'       => (int)$pid,
                'nombre'   => $prod['nombre'],
                'precio'   => (int)$prod['precio'],
                'cantidad' => (int)$cant
            );
            // Subtotal del renglón sumado al total de la compra.
            $total += (int)$prod['precio'] * (int)$cant;
        }
        // Algún ítem falló la revisión: no se vende nada y el
        // carrito queda como estaba para que se pueda corregir.
        if (!$todoBien) {
            header('Location: carrito.php?sinstock=1');
            exit;
        }
        // Se registra la venta completa en UNA transacción
        // (venta + detalles + descuento de stock, todo o nada).
        $ventaId = bd_venta_registrar($items, $total, $cliente, $direccion);
        // null significa que la transacción se deshizo (por
        // ejemplo, el stock cambió en el último segundo).
        if ($ventaId === null) {
            header('Location: carrito.php?sinstock=1');
            exit;
        }
        // Compra hecha: el carrito queda vacío…
        $_SESSION['carrito'] = array();
        // …y el RECIBO completo se guarda en la sesión: número
        // de venta, fecha, quién recibe, la dirección, el pago
        // contra entrega, los ítems y el total. La vista lo
        // muestra en vez del aviso de «carrito vacío» mientras
        // no se agregue un producto nuevo.
        $_SESSION['recibo'] = array(
            'venta'     => $ventaId,
            'fecha'     => date('d/m/Y h:i a'),
            'cliente'   => $cliente,
            'direccion' => $direccion,
            'pago'      => 'Contra entrega',
            'items'     => $items,
            'total'     => $total
        );
        // Patrón PRG: se recarga la página con ?compra=1.
        header('Location: carrito.php?compra=1');
        exit;
    }
}

// ===== CONSULTAR: datos para la vista =====
// El recibo de la última compra (si lo hay): queda guardado
// en la sesión y la vista lo muestra mientras el carrito
// siga vacío; al agregar un producto nuevo, tienda.php lo
// descarta y el carrito vuelve a su estado normal.
$recibo = !empty($_SESSION['recibo']) ? $_SESSION['recibo'] : null;

// Los ítems del carrito con sus datos frescos de la base.
// Cada renglón: la fila del producto + la cantidad del carrito.
$renglones = array();
// El total general de la compra que se está armando.
$totalGeneral = 0;
// Cuántas unidades en total lleva el carrito (para el resumen).
$numItems = 0;
// Aviso de que algún producto fue retirado por ya no existir.
$huboRetirados = false;
// Solo hay renglones si el carrito tiene algo.
if (!empty($_SESSION['carrito'])) {
    // Una sola consulta trae todos los productos del carrito.
    $frescos = bd_productos_por_ids(array_keys($_SESSION['carrito']));
    // Se recorre el carrito en el orden en que se fue llenando.
    foreach ($_SESSION['carrito'] as $pid => $cant) {
        // Producto borrado del inventario mientras tanto: se
        // saca del carrito y se marca el aviso para la vista.
        if (!isset($frescos[$pid])) {
            unset($_SESSION['carrito'][$pid]);
            $huboRetirados = true;
            continue;
        }
        // La fila fresca (precio y stock de este momento).
        $prod = $frescos[$pid];
        // Subtotal del renglón: precio actual × cantidad pedida.
        $subtotal = (int)$prod['precio'] * (int)$cant;
        // El renglón completo que pinta la lista de abajo.
        $renglones[] = array(
            'producto' => $prod,
            'cantidad' => (int)$cant,
            'subtotal' => $subtotal
        );
        // El subtotal se suma al total general.
        $totalGeneral += $subtotal;
        // Y la cantidad se suma al conteo de unidades del resumen.
        $numItems += (int)$cant;
    }
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
  <title>NVISION - Carrito de compras</title>
  <!-- Hojas de estilo modular -->
  <link rel="stylesheet" href="frontend/css/styles.css?v=129">
  <!-- Estilos propios de la tienda y el carrito: como cada página
       arma su propio <head> (includes/header.php es solo la barra
       de navegación), esta hoja se enlaza aquí y en tienda.php,
       que son las únicas dos páginas que la necesitan. -->
  <link rel="stylesheet" href="frontend/css/tienda.css?v=5">
  <!-- SEO, iconos y vista previa al compartir (Open Graph / Twitter) -->
  <meta name="description" content="Carrito de compras de la Tienda NVISION: revisa tus productos, ajusta las cantidades y finaliza tu compra.">
  <meta name="theme-color" content="#f8fafc">
  <link rel="canonical" href="https://nvision.social/carrito.php">
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
  <meta property="og:title" content="NVISION - Carrito de compras">
  <meta property="og:description" content="Carrito de compras de la Tienda NVISION: revisa tus productos y finaliza tu compra.">
  <meta property="og:url" content="https://nvision.social/carrito.php">
  <meta property="og:image" content="https://nvision.social/assets/og-image.jpg">
</head>
<body>

  <!-- Encabezado y Barra de Navegación Adaptativa -->
  <?php include __DIR__ . '/includes/header.php'; ?>
<main>
  <section class="topo-hero">
    <p class="ruta-kicker">Tienda</p>
    <h1>Tu carrito de compras</h1>
    <p class="topo-sub">Revisa los productos, ajusta las cantidades y finaliza tu compra. El stock se descuenta del inventario en el momento de pagar.</p>
  </section>

  <section class="mejora-wrap">
<!-- RECIBO de la compra recién finalizada: reemplaza al
     aviso de «carrito vacío» (no se muestran las dos cosas).
     Trae el número de venta, la fecha, quién recibe, la
     dirección, el pago contra entrega, los ítems y el total -->
<?php if ($recibo): ?>
    <div class="mejora-card recibo">
      <!-- Símbolo de verificación dentro de un círculo verde -->
      <span class="icono-circulo icono-circulo-ok"><?php echo icono_svg('check'); ?></span>
      <h2>¡Compra realizada!</h2>
      <p class="recibo-sub">Recibo de venta <strong>#<?php echo (int)$recibo['venta']; ?></strong> · <?php echo e($recibo['fecha']); ?></p>
      <!-- Datos de la entrega y del pago -->
      <div class="recibo-datos">
        <div class="recibo-dato"><span>Recibe</span><strong><?php echo e($recibo['cliente']); ?></strong></div>
        <div class="recibo-dato"><span>Dirección de entrega</span><strong><?php echo e($recibo['direccion']); ?></strong></div>
        <div class="recibo-dato"><span>Pago</span><strong><?php echo e($recibo['pago']); ?></strong></div>
      </div>
      <!-- Los productos comprados, renglón por renglón -->
      <div class="recibo-items">
        <?php foreach ($recibo['items'] as $ri): ?>
        <div class="recibo-fila">
          <span><?php echo e($ri['nombre']); ?> × <?php echo (int)$ri['cantidad']; ?></span>
          <strong><?php echo e(precio_cop($ri['precio'] * $ri['cantidad'])); ?></strong>
        </div>
        <?php endforeach; ?>
      </div>
      <!-- El total: se paga en efectivo al recibir -->
      <div class="recibo-fila recibo-total">
        <span>Total a pagar al recibir</span>
        <strong><?php echo e(precio_cop($recibo['total'])); ?></strong>
      </div>
      <p class="recibo-nota">Pagas al recibir tu pedido. El stock ya se descontó del inventario. ¡Gracias por comprar en NVISION!</p>
      <p><a class="btn-primary" href="tienda.php">Seguir comprando</a></p>
    </div>
<?php endif; ?>

<!-- Avisos según el parámetro que traiga la URL después de
     cada redirección: ?actualizado, ?ajustado, ?quitado,
     ?vaciado, ?retirado, ?sinstock o ?error -->
<?php if (isset($_GET['actualizado'])): ?>
    <div class="mejora-card"><p class="mejora-msg">Cantidad actualizada.</p></div>
<?php endif; ?>
<?php if (isset($_GET['ajustado'])): ?>
    <div class="mejora-card"><p class="mejora-msg">La cantidad se ajustó al stock disponible de ese producto.</p></div>
<?php endif; ?>
<?php if (isset($_GET['quitado'])): ?>
    <div class="mejora-card"><p class="mejora-msg">Producto retirado del carrito.</p></div>
<?php endif; ?>
<?php if (isset($_GET['vaciado'])): ?>
    <div class="mejora-card"><p class="mejora-msg">El carrito quedó vacío.</p></div>
<?php endif; ?>
<?php if (isset($_GET['retirado']) || $huboRetirados): ?>
    <div class="mejora-card"><p class="mejora-msg">Un producto del carrito ya no está en el inventario y fue retirado.</p></div>
<?php endif; ?>
<?php if (isset($_GET['sinstock'])): ?>
    <div class="mejora-card"><p class="mejora-msg">No se pudo completar la compra: el stock de algún producto no alcanza. Revisa las cantidades e inténtalo de nuevo.</p></div>
<?php endif; ?>
<?php if (isset($_GET['error'])): ?>
    <div class="mejora-card"><p class="mejora-msg">Revisa los datos: las cantidades deben ser números enteros de 1 en adelante.</p></div>
<?php endif; ?>
<?php if (isset($_GET['faltan'])): ?>
    <div class="mejora-card"><p class="mejora-msg">Faltan los datos de entrega: escribe el nombre de quien recibe y la dirección completa.</p></div>
<?php endif; ?>

<?php if (!$renglones && !$recibo): ?>
    <!-- Carrito vacío: tarjeta de estado centrada con la bolsa
         en un círculo y el botón de vuelta a la vitrina -->
    <div class="mejora-card carrito-estado">
      <!-- Símbolo de bolsa de compras dentro de un círculo suave -->
      <span class="icono-circulo"><?php echo icono_svg('bolsa'); ?></span>
      <h2>Tu carrito está vacío</h2>
      <p class="carrito-estado-texto">Todavía no agregaste ningún producto. Pásate por la vitrina y agrega lo que necesites.</p>
      <p><a class="btn-primary" href="tienda.php">Ir a la tienda</a></p>
    </div>
<?php else: ?>
    <!-- ===== CONTENIDO DEL CARRITO =====
         Dos columnas en pantallas anchas: a la izquierda los
         ítems como tarjetas y a la derecha el resumen fijo con
         el total y el botón de pagar. En celular se apilan. -->
    <div class="carrito-layout">

      <!-- Columna de ítems: una tarjeta por producto -->
      <div class="carrito-items">
<?php foreach ($renglones as $renglon): ?>
<?php $prod = $renglon['producto']; ?>
        <!-- Tarjeta de UN ítem del carrito -->
        <article class="carrito-item">
          <!-- Zona visual: la foto del producto o su símbolo SVG -->
          <div class="carrito-item-media">
<?php if (carrito_tiene_foto($prod)): ?>
            <!-- La foto sale de la ruta guardada en la columna imagen -->
            <img src="<?php echo e($prod['imagen']); ?>" alt="<?php echo e($prod['nombre']); ?>">
<?php else: ?>
            <!-- Sin foto: el símbolo SVG ocupa el recuadro -->
            <span class="carrito-item-icono" aria-hidden="true"><?php echo icono_producto($prod); ?></span>
<?php endif; ?>
          </div>
          <!-- Datos del ítem: nombre, categoría con su stock y
               el precio de cada unidad -->
          <div class="carrito-item-info">
            <h3><?php echo e($prod['nombre']); ?></h3>
            <p class="carrito-item-meta"><?php echo e($prod['categoria']); ?> · Stock disponible: <?php echo (int)$prod['cantidad']; ?></p>
            <p class="carrito-item-precio"><?php echo e(precio_cop($prod['precio'])); ?> <span>cada uno</span></p>
          </div>
          <!-- Controles del ítem: cantidad editable, subtotal
               del renglón y el botón de quitar -->
          <div class="carrito-item-control">
            <!-- CAMBIAR CANTIDAD: mini formulario por ítem;
                 validaciones.js revisa que sea un entero de 1
                 en adelante (clase form-carrito-cantidad) y el
                 máximo permitido es el stock del producto -->
            <form method="post" action="carrito.php" class="form-carrito-cantidad carrito-cantidad-form">
              <input type="hidden" name="accion" value="cantidad">
              <input type="hidden" name="id" value="<?php echo e($prod['id']); ?>">
              <input class="mejora-input carrito-cantidad-input" name="cantidad" type="number" min="1" max="<?php echo (int)$prod['cantidad']; ?>" step="1" required value="<?php echo $renglon['cantidad']; ?>">
              <button type="submit" class="tool-btn tool-btn-ghost">Actualizar</button>
            </form>
            <!-- Subtotal del ítem: precio × cantidad -->
            <p class="carrito-item-subtotal"><?php echo e(precio_cop($renglon['subtotal'])); ?></p>
            <!-- QUITAR: saca solo este ítem del carrito -->
            <form method="post" action="carrito.php">
              <input type="hidden" name="accion" value="quitar">
              <input type="hidden" name="id" value="<?php echo e($prod['id']); ?>">
              <button type="submit" class="carrito-quitar"><?php echo icono_svg('basura', 'icono-btn'); ?> Quitar</button>
            </form>
          </div>
        </article>
<?php endforeach; ?>
      </div>

      <!-- Columna del resumen: tarjeta fija al bajar la página,
           con el conteo, el total y las acciones de cierre -->
      <aside class="mejora-card carrito-resumen">
        <h2>Resumen de la compra</h2>
        <!-- Fila: cuántas unidades van en total -->
        <div class="carrito-resumen-fila">
          <span>Productos</span>
          <strong><?php echo $numItems; ?></strong>
        </div>
        <!-- Fila: el subtotal (la tienda no cobra envío) -->
        <div class="carrito-resumen-fila">
          <span>Subtotal</span>
          <strong><?php echo e(precio_cop($totalGeneral)); ?></strong>
        </div>
        <!-- Fila del total: la más grande del resumen -->
        <div class="carrito-resumen-fila carrito-resumen-total">
          <span>Total a pagar</span>
          <strong><?php echo e(precio_cop($totalGeneral)); ?></strong>
        </div>
        <!-- FINALIZAR COMPRA: guarda la venta en la base con
             transacción y descuenta el stock (id form-comprar) -->
        <form method="post" action="carrito.php" id="form-comprar">
          <input type="hidden" name="accion" value="comprar">
          <!-- DATOS DE ENTREGA: como el pago es contra entrega,
               el formulario pide quién recibe y la dirección;
               validaciones.js los revisa y PHP los repite -->
          <div class="carrito-campo">
            <label class="mejora-label" for="f-cliente">Nombre de quien recibe</label>
            <input class="mejora-input" id="f-cliente" type="text" name="cliente" maxlength="120" required placeholder="Ej.: Camilo Miranda">
          </div>
          <div class="carrito-campo">
            <label class="mejora-label" for="f-direccion">Dirección de entrega</label>
            <input class="mejora-input" id="f-direccion" type="text" name="direccion" maxlength="255" required placeholder="Ej.: Calle 45 # 12-30, Barranquilla">
          </div>
          <!-- La forma de pago, fija: contra entrega -->
          <p class="carrito-pago">Pago: <strong>contra entrega</strong> — pagas cuando recibas tu pedido.</p>
          <button type="submit" class="btn-primary carrito-btn-pagar"><?php echo icono_svg('carrito', 'icono-btn'); ?> Finalizar compra</button>
        </form>
        <!-- VACIAR: deja el carrito en cero; la clase form-confirmar
             hace que validaciones.js pida confirmación antes -->
        <form method="post" action="carrito.php" class="form-confirmar carrito-vaciar" data-confirm="¿Seguro que quieres vaciar todo el carrito?">
          <input type="hidden" name="accion" value="vaciar">
          <button type="submit" class="tool-btn tool-btn-ghost">Vaciar carrito</button>
        </form>
        <!-- Seguir comprando: vuelve a la vitrina sin perder nada -->
        <a class="carrito-seguir" href="tienda.php">← Seguir comprando</a>
        <!-- Nota de cierre: qué pasa con el stock al pagar -->
        <p class="carrito-resumen-nota">Al pagar, la venta queda guardada en la base de datos y el stock se descuenta del inventario.</p>
      </aside>
    </div>
<?php endif; ?>
  </section>
</main>

  <?php include __DIR__ . '/includes/footer.php'; ?>

  <!-- Script interactivo bilingüe y menú móvil -->
  <script src="frontend/js/interfaz.js"></script>
</body>
</html>
