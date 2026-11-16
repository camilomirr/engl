<?php
/* ============================================================
   NVISION — Foro «El Taller» (PHP)
   Publicar y responder llegan por POST, se guardan en Supabase
   y la página se recarga (Post/Redirect/Get). El detalle de una
   pregunta se abre con foro.php?ver=ID.
   ============================================================ */
require_once __DIR__ . '/backend/bd.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = $_POST['accion'] ?? '';
    if ($accion === 'publicar') {
        /* El select trae valores en minúscula; la base guarda el nombre bonito. */
        $mapa = array('hardware' => 'Hardware', 'redes' => 'Redes',
                      'software' => 'Mantenimiento', 'wifi' => 'Redes', 'otros' => 'Otro');
        $etq = $mapa[$_POST['etiqueta'] ?? 'otros'] ?? 'Otro';
        $ok = bd_crear('foro_preguntas', array(
            'nombre'   => trim($_POST['nombre'] ?? ''),
            'titulo'   => trim($_POST['titulo'] ?? ''),
            'etiqueta' => $etq,
            'mensaje'  => trim($_POST['mensaje'] ?? '')
        ));
        header('Location: foro.php?' . ($ok ? 'publicada=1' : 'error=1'));
        exit;
    }
    if ($accion === 'responder') {
        $pid = $_POST['pregunta_id'] ?? '';
        bd_crear('foro_respuestas', array(
            'pregunta_id' => $pid,
            'nombre' => trim($_POST['nombre'] ?? ''),
            'mensaje' => trim($_POST['mensaje'] ?? '')
        ));
        header('Location: foro.php?ver=' . urlencode($pid));
        exit;
    }
}

$detalle = null;
$respuestasDetalle = array();
if (isset($_GET['ver'])) {
    $fila = bd_listar('foro_preguntas', array('igual' => array('id' => $_GET['ver'])));
    if ($fila) {
        $detalle = $fila[0];
        $respuestasDetalle = bd_listar('foro_respuestas', array(
            'orden' => 'created_at.asc', 'limite' => 200,
            'igual' => array('pregunta_id' => $detalle['id'])
        ));
    }
}
$preguntas = bd_listar('foro_preguntas', array('orden' => 'created_at.desc', 'limite' => 50));
$conteo = array();
foreach (bd_listar('foro_respuestas', array('limite' => 500)) as $r) {
    $conteo[$r['pregunta_id']] = ($conteo[$r['pregunta_id']] ?? 0) + 1;
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
    <p class="ruta-kicker">Comunidad</p>
    <h1>El Taller · Foro de soporte</h1>
    <p class="topo-sub">¿Tu computadora hace algo raro? Publica el problema tal como te pasa, la comunidad te ayuda a resolverlo.</p>
  </section>

  <section class="mejora-wrap">
<?php if (isset($_GET['publicada'])): ?>
    <div class="mejora-card"><p class="mejora-msg">¡Pregunta publicada! Ya aparece en la lista de abajo.</p></div>
<?php endif; ?>
<?php if (isset($_GET['error'])): ?>
    <div class="mejora-card"><p class="mejora-msg">No se pudo publicar. Revisa los datos e inténtalo de nuevo.</p></div>
<?php endif; ?>

    <div class="mejora-card">
      <h2>Publica tu problema</h2>
      <form method="post" action="foro.php">
        <input type="hidden" name="accion" value="publicar">
        <label class="mejora-label" for="foro-nombre">Tu nombre</label>
        <input class="mejora-input" id="foro-nombre" name="nombre" type="text" maxlength="60" required>
        <label class="mejora-label" for="foro-titulo">Título del problema</label>
        <input class="mejora-input" id="foro-titulo" name="titulo" type="text" maxlength="120" required>
        <label class="mejora-label" for="foro-etiqueta">Tema</label>
        <select class="mejora-select" id="foro-etiqueta" name="etiqueta">
          <option value="hardware">Hardware</option>
          <option value="redes">Redes</option>
          <option value="software">Software</option>
          <option value="wifi">WiFi</option>
          <option value="otros">Otros</option>
        </select>
        <label class="mejora-label" for="foro-cuerpo">Cuéntanos qué pasa (qué hiciste, qué error sale, desde cuándo)</label>
        <textarea class="mejora-textarea" id="foro-cuerpo" name="mensaje" maxlength="2000" required></textarea>
        <button type="submit" class="tool-btn">Publicar pregunta</button>
      </form>
    </div>

    <div class="mejora-card">
      <h2>Preguntas de la comunidad</h2>
      <div id="foro-list">
<?php if (!$preguntas): ?>
        <p>Todavía no hay preguntas. ¡Publica la primera!</p>
<?php else: ?>
<?php foreach ($preguntas as $p): ?>
        <article class="foro-item">
          <span class="foro-tag mejora-chip"><?php echo e($p['etiqueta'] ?? 'Otro'); ?></span>
          <h3 class="foro-q-title"><?php echo e($p['titulo']); ?></h3>
          <p class="foro-meta">por <?php echo e($p['nombre']); ?> · <?php echo e(fecha_corta($p['created_at'])); ?> · <?php echo (int)($conteo[$p['id']] ?? 0); ?> respuestas</p>
          <a class="tool-btn tool-btn-ghost" href="foro.php?ver=<?php echo e($p['id']); ?>">Ver y responder</a>
        </article>
<?php endforeach; ?>
<?php endif; ?>
      </div>
    </div>

<?php if ($detalle): ?>
    <div class="mejora-card" id="foro-detail">
      <a class="tool-btn tool-btn-ghost" href="foro.php">← Volver a las preguntas</a>
      <div id="foro-detail-body">
        <span class="foro-tag mejora-chip"><?php echo e($detalle['etiqueta'] ?? 'Otro'); ?></span>
        <h2><?php echo e($detalle['titulo']); ?></h2>
        <p class="foro-meta">por <?php echo e($detalle['nombre']); ?> · <?php echo e(fecha_corta($detalle['created_at'])); ?></p>
        <p><?php echo e($detalle['mensaje']); ?></p>
      </div>
      <h3>Respuestas</h3>
      <div id="foro-answers">
<?php if (!$respuestasDetalle): ?>
        <p>Sin respuestas todavía. ¡Sé la primera persona en ayudar!</p>
<?php else: ?>
<?php foreach ($respuestasDetalle as $r): ?>
        <div class="foro-answer">
          <p class="foro-meta"><?php echo e($r['nombre']); ?> · <?php echo e(fecha_corta($r['created_at'])); ?></p>
          <p><?php echo e($r['mensaje']); ?></p>
        </div>
<?php endforeach; ?>
<?php endif; ?>
      </div>
      <form method="post" action="foro.php">
        <input type="hidden" name="accion" value="responder">
        <input type="hidden" name="pregunta_id" value="<?php echo e($detalle['id']); ?>">
        <label class="mejora-label" for="foro-answer-nombre">Tu nombre</label>
        <input class="mejora-input" id="foro-answer-nombre" name="nombre" type="text" maxlength="60" required>
        <label class="mejora-label" for="foro-answer-text">Tu respuesta</label>
        <textarea class="mejora-textarea" id="foro-answer-text" name="mensaje" maxlength="2000" required></textarea>
        <button type="submit" class="tool-btn">Enviar respuesta</button>
      </form>
    </div>
<?php endif; ?>
  </section>
</main>

  <?php include __DIR__ . '/includes/footer.php'; ?>

  <!-- Script interactivo bilingüe y menú móvil -->
  
  
  
  
  <script src="frontend/js/interfaz.js"></script>
</body>
</html>
