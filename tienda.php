<?php
/* ============================================================
   NVISION — Tienda · Inventario de productos (PHP + MySQL)
   ------------------------------------------------------------
   Este es el CRUD PRINCIPAL del proyecto (sistema de
   inventario de una tienda de tecnología):
     CREAR      registrar un producto con el formulario
     CONSULTAR  el catálogo en tarjetas, con precio y stock
     ACTUALIZAR editar un producto (tienda.php?editar=ID)
     ELIMINAR   borrar un producto (botón con confirmación)
   Todo llega por POST, se guarda en MySQL y la página se
   recarga (patrón Post/Redirect/Get). Las funciones de la
   base están en backend/bd.php.
   ============================================================ */
require_once __DIR__ . '/backend/bd.php';

// ===== AYUDAS DE VALIDACIÓN =====
/* Las categorías válidas son las mismas de la columna
   «categoria» de la tabla productos. */
function producto_categoria_valida($categoria) {
    return in_array($categoria, array('Componentes', 'Periféricos', 'Redes', 'Accesorios'), true);
}

/* Lee y valida los datos del formulario de producto.
   Devuelve el arreglo listo para guardar, o null si algo
   está mal: el nombre es obligatorio y el precio y la
   cantidad deben ser números enteros de cero en adelante. */
function producto_datos_formulario() {
    $nombre      = trim($_POST['nombre'] ?? '');
    $categoria   = $_POST['categoria'] ?? 'Componentes';
    $descripcion = trim($_POST['descripcion'] ?? '');
    $precioTxt   = trim($_POST['precio'] ?? '');
    $cantidadTxt = trim($_POST['cantidad'] ?? '');
    $precio   = filter_var($precioTxt, FILTER_VALIDATE_INT);
    $cantidad = filter_var($cantidadTxt, FILTER_VALIDATE_INT);
    if (mb_strlen($nombre) < 2 || !producto_categoria_valida($categoria)
        || $precio === false || $precio < 0
        || $cantidad === false || $cantidad < 0) {
        return null;
    }
    return array(
        'nombre'      => $nombre,
        'categoria'   => $categoria,
        'descripcion' => $descripcion,
        'precio'      => $precio,
        'cantidad'    => $cantidad
    );
}

// ===== ACCIONES QUE LLEGAN POR POST =====
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = $_POST['accion'] ?? '';

    // ----- CREAR: registrar un producto -----
    if ($accion === 'crear') {
        $d = producto_datos_formulario();
        if ($d !== null) {
            bd_producto_crear($d['nombre'], $d['categoria'], $d['descripcion'], $d['precio'], $d['cantidad']);
            header('Location: tienda.php?creado=1');
        } else {
            header('Location: tienda.php?error=1');
        }
        exit;
    }

    // ----- ACTUALIZAR: guardar el producto editado -----
    if ($accion === 'actualizar') {
        $pid = (int)($_POST['id'] ?? 0);
        $d = producto_datos_formulario();
        if ($pid > 0 && $d !== null) {
            bd_producto_actualizar($pid, $d['nombre'], $d['categoria'], $d['descripcion'], $d['precio'], $d['cantidad']);
            header('Location: tienda.php?actualizado=1');
        } else {
            header('Location: tienda.php?editar=' . $pid . '&error=1');
        }
        exit;
    }

    // ----- ELIMINAR: borrar un producto -----
    if ($accion === 'eliminar') {
        $pid = (int)($_POST['id'] ?? 0);
        if ($pid > 0) {
            bd_producto_eliminar($pid);
        }
        header('Location: tienda.php?eliminado=1');
        exit;
    }
}

// ===== CONSULTAR: datos para la vista =====
// Producto cargado en el formulario cuando se va a editar
// (tienda.php?editar=ID); si no hay edición, es null.
$editarProducto = null;
if (isset($_GET['editar'])) {
    $editarProducto = bd_producto((int)$_GET['editar']);
}
// El catálogo completo del inventario.
$productos = bd_productos();
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
  <title>NVISION - Tienda: inventario de productos</title>
  <!-- Hojas de estilo modular -->
  <link rel="stylesheet" href="frontend/css/styles.css?v=129">
  <!-- SEO, iconos y vista previa al compartir (Open Graph / Twitter) -->
  <meta name="description" content="Tienda NVISION: inventario de productos de tecnología (componentes, periféricos, redes y accesorios) con precios en pesos y stock en vivo desde la base de datos.">
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
  <meta property="og:title" content="NVISION - Tienda: inventario de productos">
  <meta property="og:description" content="Tienda NVISION: inventario de productos de tecnología con precios en pesos y stock en vivo desde la base de datos.">
  <meta property="og:url" content="https://nvision.social/tienda.php">
  <meta property="og:image" content="https://nvision.social/assets/og-image.jpg">
</head>
<body>

  <!-- Encabezado y Barra de Navegación Adaptativa -->
  <?php include __DIR__ . '/includes/header.php'; ?>
<main>
  <section class="topo-hero">
    <p class="ruta-kicker">Tienda</p>
    <h1>Tienda NVISION · Inventario de productos</h1>
    <p class="topo-sub">Componentes, periféricos, redes y accesorios: este catálogo sale en vivo de la base de datos y desde aquí mismo se registran, editan y eliminan los productos.</p>
  </section>

  <section class="mejora-wrap">
<?php if (isset($_GET['creado'])): ?>
    <div class="mejora-card"><p class="mejora-msg">¡Producto registrado! Ya aparece en el catálogo.</p></div>
<?php endif; ?>
<?php if (isset($_GET['actualizado'])): ?>
    <div class="mejora-card"><p class="mejora-msg">¡Producto actualizado!</p></div>
<?php endif; ?>
<?php if (isset($_GET['eliminado'])): ?>
    <div class="mejora-card"><p class="mejora-msg">Producto eliminado del inventario.</p></div>
<?php endif; ?>
<?php if (isset($_GET['error']) && !$editarProducto): ?>
    <div class="mejora-card"><p class="mejora-msg">No se pudo guardar. Revisa el nombre y que el precio y la cantidad sean números de cero en adelante.</p></div>
<?php endif; ?>

    <!-- ===== CREAR / ACTUALIZAR: formulario de producto =====
         El mismo formulario sirve para registrar un producto
         nuevo y para editar uno existente: si $editarProducto
         trae datos, el formulario se carga con ellos y al
         guardar ACTUALIZA en vez de crear. -->
    <div class="mejora-card">
      <h2><?php echo $editarProducto ? 'Editar producto' : 'Registrar producto'; ?></h2>
<?php if ($editarProducto && isset($_GET['error'])): ?>
      <p class="mejora-msg">No se pudo guardar. Revisa el nombre y que el precio y la cantidad sean números de cero en adelante.</p>
<?php endif; ?>
      <form method="post" action="tienda.php" id="form-producto">
        <input type="hidden" name="accion" value="<?php echo $editarProducto ? 'actualizar' : 'crear'; ?>">
<?php if ($editarProducto): ?>
        <input type="hidden" name="id" value="<?php echo e($editarProducto['id']); ?>">
<?php endif; ?>
        <label class="mejora-label" for="prod-nombre">Nombre del producto</label>
        <input class="mejora-input" id="prod-nombre" name="nombre" type="text" maxlength="120" required value="<?php echo e($editarProducto['nombre'] ?? ''); ?>">
        <label class="mejora-label" for="prod-categoria">Categoría</label>
        <select class="mejora-select" id="prod-categoria" name="categoria">
<?php foreach (array('Componentes', 'Periféricos', 'Redes', 'Accesorios') as $cat): ?>
          <option value="<?php echo $cat; ?>"<?php echo ($editarProducto['categoria'] ?? 'Componentes') === $cat ? ' selected' : ''; ?>><?php echo $cat; ?></option>
<?php endforeach; ?>
        </select>
        <label class="mejora-label" for="prod-descripcion">Descripción</label>
        <textarea class="mejora-textarea" id="prod-descripcion" name="descripcion" maxlength="300"><?php echo e($editarProducto['descripcion'] ?? ''); ?></textarea>
        <label class="mejora-label" for="prod-precio">Precio (pesos)</label>
        <input class="mejora-input" id="prod-precio" name="precio" type="number" min="0" step="1" required value="<?php echo e($editarProducto['precio'] ?? ''); ?>">
        <label class="mejora-label" for="prod-cantidad">Cantidad en inventario</label>
        <input class="mejora-input" id="prod-cantidad" name="cantidad" type="number" min="0" step="1" required value="<?php echo e($editarProducto['cantidad'] ?? ''); ?>">
        <button type="submit" class="tool-btn"><?php echo $editarProducto ? 'Guardar cambios' : 'Registrar producto'; ?></button>
<?php if ($editarProducto): ?>
        <a class="tool-btn tool-btn-ghost" href="tienda.php">Cancelar edición</a>
<?php endif; ?>
      </form>
    </div>

    <!-- ===== CONSULTAR: catálogo de productos en tarjetas ===== -->
    <div class="mejora-card">
      <h2>Catálogo de productos</h2>
      <div id="tienda-catalogo">
<?php if (!$productos): ?>
        <p>Todavía no hay productos. ¡Registra el primero con el formulario!</p>
<?php else: ?>
<?php foreach ($productos as $prod): ?>
        <article class="foro-item">
          <span class="foro-tag mejora-chip"><?php echo e($prod['categoria']); ?></span>
          <h3 class="foro-q-title"><?php echo e($prod['nombre']); ?></h3>
          <p><?php echo e($prod['descripcion']); ?></p>
          <p class="foro-meta">Precio: <strong><?php echo e(precio_cop($prod['precio'])); ?></strong> · <?php echo (int)$prod['cantidad'] > 0 ? 'Stock: ' . (int)$prod['cantidad'] . ' unidades' : '<strong>Agotado</strong>'; ?></p>
          <!-- ACTUALIZAR / ELIMINAR este producto -->
          <a class="tool-btn tool-btn-ghost" href="tienda.php?editar=<?php echo e($prod['id']); ?>">Editar</a>
          <form method="post" action="tienda.php" class="form-confirmar" data-confirm="¿Seguro que quieres eliminar «<?php echo e($prod['nombre']); ?>» del inventario?">
            <input type="hidden" name="accion" value="eliminar">
            <input type="hidden" name="id" value="<?php echo e($prod['id']); ?>">
            <button type="submit" class="tool-btn tool-btn-ghost">Eliminar</button>
          </form>
        </article>
<?php endforeach; ?>
<?php endif; ?>
      </div>
    </div>
  </section>
</main>

  <?php include __DIR__ . '/includes/footer.php'; ?>

  <!-- Script interactivo bilingüe y menú móvil -->
  <script src="frontend/js/interfaz.js"></script>
</body>
</html>
