<?php
/* ============================================================
   NVISION — PQR (PHP + MySQL)
   ------------------------------------------------------------
   CREAR:     el visitante envía su petición, queja, reclamo o
              sugerencia; se guarda en la tabla «pqr» de MySQL y
              recibe un radicado (código de 8 caracteres).
   CONSULTAR: con ese radicado puede ver el estado de su caso
              en el bloque «Consultar mi PQR» de esta misma página
              (solo lectura: tipo, estado y fecha).
   Las funciones de la base están en backend/bd.php.
   ============================================================ */
// bd_pqr_crear() y bd_pqr_consultar() son las dos funciones
// que esta página necesita de backend/bd.php.
require_once __DIR__ . '/backend/bd.php';

// ===== CREAR: radicar una PQR nueva =====
// Este bloque corre únicamente cuando se envía el formulario.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Nombre de la persona que escribe, sin espacios sobrantes.
    $nombre  = trim($_POST['nombre'] ?? '');
    // Su correo: es el dato al que luego se le avisa la respuesta.
    $correo  = trim($_POST['correo'] ?? '');
    // Tipo elegido en el <select>; por defecto, «Petición».
    $tipo    = $_POST['tipo'] ?? 'Petición';
    // El texto completo del mensaje.
    $mensaje = trim($_POST['mensaje'] ?? '');
    // Los únicos tipos que acepta la columna ENUM «tipo» de la tabla pqr.
    $tiposValidos = array('Petición', 'Queja', 'Reclamo', 'Sugerencia');
    // Validación en PHP: campos completos y correo con formato válido.
    // Si el correo no pasa FILTER_VALIDATE_EMAIL, la PQR no se
    // guarda y la persona ve el aviso de error de la vista.
    if (mb_strlen($nombre) >= 2
        && filter_var($correo, FILTER_VALIDATE_EMAIL) !== false
        && in_array($tipo, $tiposValidos, true)
        && mb_strlen($mensaje) >= 10) {
        // Se guarda la fila y la función devuelve el radicado creado.
        $radicado = bd_pqr_crear($nombre, $correo, $tipo, $mensaje);
        if ($radicado !== null) {
            // Se vuelve a la página llevando el radicado en la URL
            // para mostrarlo en grande: hay que guardarlo.
            header('Location: pqr.php?radicado=' . $radicado);
            exit;
        }
    }
    // Cualquier validación falló (o no hubo radicado): aviso de error.
    header('Location: pqr.php?error=1');
    exit;
}

// ===== CONSULTAR: buscar una PQR por su radicado =====
// $consultaPqr guarda la fila encontrada (o null) y
// $consultaBuscada recuerda si ya se hizo una búsqueda, para
// que la vista sepa si debe mostrar el resultado o el «no existe».
$consultaPqr = null;
$consultaBuscada = false;
// El formulario de consulta manda el radicado por GET.
if (isset($_GET['consultar'])) {
    $consultaBuscada = true;
    // bd_pqr_consultar limpia el código (mayúsculas, sin espacios)
    // y lo busca en la columna «radicado» de la tabla pqr.
    $consultaPqr = bd_pqr_consultar($_GET['consultar']);
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
  <title data-i18n="page_title_foro">NVISION - El Taller: foro de soporte</title>
  <!-- Hojas de estilo modular -->
  <link rel="stylesheet" href="frontend/css/styles.css?v=129">
  <!-- SEO, iconos y vista previa al compartir (Open Graph / Twitter) -->
  <meta name="description" content="Foro de soporte de NVISION: publica el problema real de tu computadora, la comunidad te ayuda a resolverlo y las mejores respuestas ganan puntos y logros.">
  <meta name="theme-color" content="#f8fafc">
  <link rel="canonical" href="https://nvision.social/foro.php">
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
  <meta property="og:title" content="NVISION - El Taller: foro de soporte">
  <meta property="og:description" content="Foro de soporte de NVISION: publica el problema real de tu computadora, la comunidad te ayuda a resolverlo y las mejores respuestas ganan puntos y logros.">
  <meta property="og:url" content="https://nvision.social/foro.php">
  <meta property="og:image" content="https://nvision.social/assets/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="NVISION - El Taller: foro de soporte">
  <meta name="twitter:description" content="Foro de soporte de NVISION: publica el problema real de tu computadora, la comunidad te ayuda a resolverlo y las mejores respuestas ganan puntos y logros.">
  <meta name="twitter:image" content="https://nvision.social/assets/og-image.jpg">
</head>
<body>

  <!-- Encabezado y Barra de Navegación Adaptativa -->
    <!-- Encabezado y Barra de Navegación Adaptativa -->
  <?php include __DIR__ . '/includes/header.php'; ?>
<main>
  <section class="topo-hero">
    <p class="ruta-kicker">Contacto</p>
    <h1>PQR · Peticiones, quejas y reclamos</h1>
    <p class="topo-sub">¿Encontraste un error en un módulo, algo no funciona o tienes una idea para mejorar NVISION? Escríbenos por aquí: tu mensaje llega directo al equipo y al enviarlo recibes un número de radicado para hacerle seguimiento.</p>
  </section>

  <section class="mejora-wrap">
    <!-- ===== CREAR: formulario para radicar una PQR ===== -->
    <div class="mejora-card">
      <h2>Envía tu mensaje</h2>
<?php if (isset($_GET['radicado'])): ?>
      <p class="mejora-msg">¡Recibido! Tu número de radicado es <?php echo e($_GET['radicado']); ?>. Guárdalo: con él puedes consultar el estado de tu caso aquí abajo, en «Consultar mi PQR».</p>
<?php endif; ?>
<?php if (isset($_GET['error'])): ?>
      <p class="mejora-msg">No se pudo enviar. Revisa que todos los campos estén completos y que el correo sea válido.</p>
<?php endif; ?>
      <!-- Formulario de radicar: validaciones.js lo cuida con el id form-pqr -->
      <form method="post" action="pqr.php" id="form-pqr">
        <label class="mejora-label" for="pqr-nombre">Tu nombre</label>
        <!-- El maxlength 80 es el tamaño de la columna «nombre» de la tabla pqr -->
        <input class="mejora-input" id="pqr-nombre" name="nombre" type="text" maxlength="80" required>
        <label class="mejora-label" for="pqr-correo">Tu correo</label>
        <!-- type="email" hace que el propio navegador revise el formato antes de enviar -->
        <input class="mejora-input" id="pqr-correo" name="correo" type="email" maxlength="120" placeholder="nombre@correo.com" required>
        <label class="mejora-label" for="pqr-tipo">Tipo de mensaje</label>
        <!-- Las opciones calcan los valores del ENUM «tipo»: Petición, Queja, Reclamo y Sugerencia -->
        <select class="mejora-select" id="pqr-tipo" name="tipo">
          <option>Petición</option>
          <option>Queja</option>
          <option>Reclamo</option>
          <option>Sugerencia</option>
        </select>
        <label class="mejora-label" for="pqr-mensaje">Mensaje</label>
        <textarea class="mejora-textarea" id="pqr-mensaje" name="mensaje" maxlength="2000" required></textarea>
        <button type="submit" class="tool-btn">Enviar PQR</button>
      </form>
    </div>

    <!-- ===== CONSULTAR: estado de una PQR por su radicado ===== -->
    <div class="mejora-card">
      <h2>Consultar mi PQR</h2>
      <p>Escribe el radicado que recibiste al enviar tu mensaje y mira en qué estado va tu caso.</p>
      <!-- La consulta va por GET: el radicado queda en la URL y la página se puede compartir o recargar -->
      <form method="get" action="pqr.php" id="form-pqr-consulta">
        <label class="mejora-label" for="pqr-radicado">Número de radicado</label>
        <!-- maxlength 8 porque el radicado siempre tiene 8 caracteres; el campo se rellena con lo último consultado -->
        <input class="mejora-input" id="pqr-radicado" name="consultar" type="text" maxlength="8" placeholder="Ej: A3F9C1D2" value="<?php echo e($_GET['consultar'] ?? ''); ?>">
        <button type="submit" class="tool-btn">Consultar</button>
      </form>
<?php if ($consultaBuscada && $consultaPqr !== null): ?>
      <!-- Se encontró: se muestra el estado que el equipo haya puesto en la columna «estado» (Pendiente, En revisión o Resuelto) -->
      <p class="mejora-msg">Radicado <?php echo e($consultaPqr['radicado']); ?> · Tipo: <?php echo e($consultaPqr['tipo']); ?> · Estado: <strong><?php echo e($consultaPqr['estado']); ?></strong> · Radicada el <?php echo e(fecha_corta($consultaPqr['fecha'])); ?>.</p>
<?php elseif ($consultaBuscada): ?>
      <!-- Se buscó pero ningún radicado coincidió en la tabla -->
      <p class="mejora-msg">No encontramos ninguna PQR con ese radicado. Revisa el código e inténtalo de nuevo.</p>
<?php endif; ?>
    </div>

    <!-- Tarjeta informativa: explica qué significa cada estado que puede mostrar la consulta -->
    <div class="mejora-card">
      <h2>¿Cómo se atienden?</h2>
      <p><strong>Pendiente:</strong> tu mensaje entró a la base de datos con su radicado.<br>
      <strong>En revisión:</strong> el equipo lo está mirando.<br>
      <strong>Resuelto:</strong> ya se atendió; si dejaste tu correo, te avisamos ahí.</p>
      <p>Para dudas rápidas de los temas, mejor el <a href="foro.php">foro</a>: ahí responde toda la comunidad.</p>
    </div>
  </section>
</main>

  <?php include __DIR__ . '/includes/footer.php'; ?>

  <!-- Script interactivo bilingüe y menú móvil -->
  
  
  
  
  <script src="frontend/js/interfaz.js"></script>
</body>
</html>
