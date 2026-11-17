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
   ============================================================ */
// La sesión se abre antes que nada: sin ella no hay carrito.
session_start();
// Funciones de la base: productos por ids y registro de ventas.
require_once __DIR__ . '/backend/bd.php';

// El carrito se crea vacío la primera vez que se entra aquí.
if (!isset($_SESSION['carrito'])) {
    $_SESSION['carrito'] = array();
}

// ===== AYUDAS DEL CARRITO =====
/* Emoji de respaldo de un producto, el mismo criterio de la
   vitrina: se usa si no tiene foto o el archivo no aparece. */
function carrito_emoji($prod) {
    // Mapa archivo de foto => emoji que lo representa.
    $porImagen = array(
        'ram.jpg'     => '💾',
        'ssd.jpg'     => '💽',
        'mouse.jpg'   => '🖱️',
        'teclado.jpg' => '⌨️',
        'router.jpg'  => '📶',
        'cable.jpg'   => '🔌',
        'monitor.jpg' => '🖥️',
        'diadema.jpg' => '🎧',
        'disco.jpg'   => '💿',
        'fuente.jpg'  => '⚡'
    );
    // basename() deja solo el nombre del archivo de la ruta.
    $archivo = basename((string)($prod['imagen'] ?? ''));
    // Si ese archivo tiene emoji asignado, ese se usa.
    if (isset($porImagen[$archivo])) {
        return $porImagen[$archivo];
    }
    // Sin imagen conocida: una caja de producto genérica.
    return '📦';
}

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
        $ventaId = bd_venta_registrar($items, $total);
        // null significa que la transacción se deshizo (por
        // ejemplo, el stock cambió en el último segundo).
        if ($ventaId === null) {
            header('Location: carrito.php?sinstock=1');
            exit;
        }
        // Compra hecha: el carrito queda vacío…
        $_SESSION['carrito'] = array();
        // …y el comprobante (número de venta y total pagado) se
        // guarda en la sesión un momento, para mostrarlo tras la
        // redirección sin exponerlo en la URL.
        $_SESSION['compra_ok'] = array('venta' => $ventaId, 'total' => $total);
        // Patrón PRG: se recarga la página con ?compra=1.
        header('Location: carrito.php?compra=1');
        exit;
    }
}

// ===== CONSULTAR: datos para la vista =====
// El comprobante de la compra recién hecha (si se viene de pagar).
$compraOk = null;
// Solo se muestra si la URL trae ?compra=1 Y el comprobante
// sigue guardado en la sesión (al mostrarlo se borra).
if (isset($_GET['compra']) && !empty($_SESSION['compra_ok'])) {
    // Se toma el comprobante para pintarlo en la vista…
    $compraOk = $_SESSION['compra_ok'];
    // …y se borra de la sesión: al recargar ya no se repite.
    unset($_SESSION['compra_ok']);
}

// Los ítems del carrito con sus datos frescos de la base.
// Cada renglón: la fila del producto + la cantidad del carrito.
$renglones = array();
// El total general de la compra que se está armando.
$totalGeneral = 0;
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
        // El renglón completo que pinta la tabla de abajo.
        $renglones[] = array(
            'producto' => $prod,
            'cantidad' => (int)$cant,
            'subtotal' => $subtotal
        );
        // El subtotal se suma al total general.
        $totalGeneral += $subtotal;
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
  <link rel="stylesheet" href="frontend/css/tienda.css?v=1">
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
    <h1>🛒 Tu carrito de compras</h1>
    <p class="topo-sub">Revisa los productos, ajusta las cantidades y finaliza tu compra. El stock se descuenta del inventario en el momento de pagar.</p>
  </section>

  <section class="mejora-wrap">
<!-- Comprobante de la compra recién finalizada: número de
     venta y total pagado, leídos del aviso de la sesión -->
<?php if ($compraOk): ?>
    <div class="mejora-card carrito-compra-ok">
      <h2>¡Compra realizada! 🎉</h2>
      <p class="mejora-msg">Tu número de venta es <strong>#<?php echo (int)$compraOk['venta']; ?></strong> y el total pagado fue <strong><?php echo e(precio_cop($compraOk['total'])); ?></strong>. El stock ya se descontó del inventario. ¡Gracias por comprar en NVISION!</p>
      <p><a class="tool-btn" href="tienda.php">Seguir comprando</a></p>
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

<?php if (!$renglones): ?>
    <!-- Carrito vacío: se invita a volver a la vitrina -->
    <div class="mejora-card">
      <h2>Tu carrito está vacío</h2>
      <p>Todavía no agregaste ningún producto. Pásate por la vitrina y agrega lo que necesites.</p>
      <p><a class="tool-btn" href="tienda.php">Ir a la tienda</a></p>
    </div>
<?php else: ?>
    <!-- ===== TABLA DEL CARRITO =====
         Un renglón por ítem: foto, nombre, precio unitario,
         cantidad editable, subtotal y botón de quitar. -->
    <div class="mejora-card">
      <h2>Productos en tu carrito</h2>
      <div class="tienda-tabla-wrap">
        <table class="tienda-tabla carrito-tabla">
          <thead>
            <tr><th>Foto</th><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr>
          </thead>
          <tbody>
<?php foreach ($renglones as $renglon): ?>
<?php $prod = $renglon['producto']; ?>
            <!-- Renglón de UN ítem del carrito -->
            <tr>
              <td>
<?php if (carrito_tiene_foto($prod)): ?>
                <!-- Foto pequeña del producto en su renglón -->
                <img class="tienda-thumb" src="<?php echo e($prod['imagen']); ?>" alt="<?php echo e($prod['nombre']); ?>">
<?php else: ?>
                <!-- Sin foto: el emoji ocupa el lugar de la miniatura -->
                <span class="tienda-thumb-emoji" aria-hidden="true"><?php echo carrito_emoji($prod); ?></span>
<?php endif; ?>
              </td>
              <td>
                <?php echo e($prod['nombre']); ?>
                <!-- El stock disponible, para saber el tope de la cantidad -->
                <br><small>Stock disponible: <?php echo (int)$prod['cantidad']; ?></small>
              </td>
              <!-- Precio unitario fresco de la base, en pesos -->
              <td><?php echo e(precio_cop($prod['precio'])); ?></td>
              <td>
                <!-- CAMBIAR CANTIDAD: mini formulario por renglón;
                     validaciones.js revisa que sea un entero de 1
                     en adelante (clase form-carrito-cantidad) y el
                     máximo permitido es el stock del producto -->
                <form method="post" action="carrito.php" class="form-carrito-cantidad carrito-cantidad-form">
                  <input type="hidden" name="accion" value="cantidad">
                  <input type="hidden" name="id" value="<?php echo e($prod['id']); ?>">
                  <input class="mejora-input carrito-cantidad-input" name="cantidad" type="number" min="1" max="<?php echo (int)$prod['cantidad']; ?>" step="1" required value="<?php echo $renglon['cantidad']; ?>">
                  <button type="submit" class="tool-btn tool-btn-ghost">Actualizar</button>
                </form>
              </td>
              <!-- Subtotal del renglón: precio × cantidad -->
              <td><strong><?php echo e(precio_cop($renglon['subtotal'])); ?></strong></td>
              <td>
                <!-- QUITAR: saca solo este ítem del carrito -->
                <form method="post" action="carrito.php">
                  <input type="hidden" name="accion" value="quitar">
                  <input type="hidden" name="id" value="<?php echo e($prod['id']); ?>">
                  <button type="submit" class="tool-btn tool-btn-ghost">Quitar</button>
                </form>
              </td>
            </tr>
<?php endforeach; ?>
          </tbody>
          <tfoot>
            <!-- Total general: la suma de todos los subtotales -->
            <tr>
              <td colspan="4" class="carrito-total-label">Total a pagar</td>
              <td colspan="2" class="carrito-total-valor"><?php echo e(precio_cop($totalGeneral)); ?></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- ===== ACCIONES FINALES DEL CARRITO ===== -->
      <div class="carrito-acciones">
        <!-- Seguir comprando: vuelve a la vitrina sin perder el carrito -->
        <a class="tool-btn tool-btn-ghost" href="tienda.php">Seguir comprando</a>
        <!-- VACIAR: deja el carrito en cero; la clase form-confirmar
             hace que validaciones.js pida confirmación antes -->
        <form method="post" action="carrito.php" class="form-confirmar" data-confirm="¿Seguro que quieres vaciar todo el carrito?">
          <input type="hidden" name="accion" value="vaciar">
          <button type="submit" class="tool-btn tool-btn-ghost">Vaciar carrito</button>
        </form>
        <!-- FINALIZAR COMPRA: guarda la venta en la base con
             transacción y descuenta el stock (id form-comprar) -->
        <form method="post" action="carrito.php" id="form-comprar">
          <input type="hidden" name="accion" value="comprar">
          <button type="submit" class="tool-btn carrito-btn-comprar">Finalizar compra · <?php echo e(precio_cop($totalGeneral)); ?></button>
        </form>
      </div>
    </div>
<?php endif; ?>
  </section>
</main>

  <?php include __DIR__ . '/includes/footer.php'; ?>

  <!-- Script interactivo bilingüe y menú móvil -->
  <script src="frontend/js/interfaz.js"></script>
</body>
</html>
