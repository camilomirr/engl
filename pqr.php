<?php
/* ============================================================
   NVISION — PQR (PHP)
   El mensaje se guarda en la tabla pqr (la página solo puede
   crear: por privacidad nadie lee los PQR desde la web) y el
   visitante recibe su radicado.
   ============================================================ */
require_once __DIR__ . '/backend/bd.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $uuid = generar_uuid();
    $ok = bd_crear('pqr', array(
        'id' => $uuid,
        'nombre' => trim($_POST['nombre'] ?? ''),
        'correo' => trim($_POST['correo'] ?? ''),
        'tipo' => $_POST['tipo'] ?? 'Petición',
        'asunto' => trim($_POST['asunto'] ?? ''),
        'mensaje' => trim($_POST['mensaje'] ?? '')
    ), true);
    if ($ok) {
        header('Location: pqr.php?radicado=' . strtoupper(substr($uuid, 0, 8)));
    } else {
        header('Location: pqr.php?error=1');
    }
    exit;
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
    <div class="mejora-card">
      <h2>Envía tu mensaje</h2>
<?php if (isset($_GET['radicado'])): ?>
      <p class="mejora-msg">¡Recibido! Tu número de radicado es <?php echo e($_GET['radicado']); ?>. Guárdalo: con él puedes preguntar por el estado de tu caso en el foro.</p>
<?php endif; ?>
<?php if (isset($_GET['error'])): ?>
      <p class="mejora-msg">No se pudo enviar. Revisa los datos e inténtalo de nuevo.</p>
<?php endif; ?>
      <form method="post" action="pqr.php">
        <label class="mejora-label" for="pqr-nombre">Tu nombre</label>
        <input class="mejora-input" id="pqr-nombre" name="nombre" type="text" maxlength="80" required>
        <label class="mejora-label" for="pqr-correo">Tu correo</label>
        <input class="mejora-input" id="pqr-correo" name="correo" type="email" maxlength="120" placeholder="nombre@correo.com" required>
        <label class="mejora-label" for="pqr-tipo">Tipo de mensaje</label>
        <select class="mejora-select" id="pqr-tipo" name="tipo">
          <option>Petición</option>
          <option>Queja</option>
          <option>Reclamo</option>
          <option>Sugerencia</option>
        </select>
        <label class="mejora-label" for="pqr-asunto">Asunto</label>
        <input class="mejora-input" id="pqr-asunto" name="asunto" type="text" maxlength="120" required>
        <label class="mejora-label" for="pqr-mensaje">Mensaje</label>
        <textarea class="mejora-textarea" id="pqr-mensaje" name="mensaje" maxlength="2000" required></textarea>
        <button type="submit" class="tool-btn">Enviar PQR</button>
      </form>
    </div>

    <div class="mejora-card">
      <h2>¿Cómo se atienden?</h2>
      <p><strong>Recibido:</strong> tu mensaje entró a la base de datos con su radicado.<br>
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
