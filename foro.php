<?php
/* ============================================================
   NVISION — Foro «El Taller» (PHP + MySQL)
   ------------------------------------------------------------
   CRUD completo del foro:
     CREAR      publicar una pregunta y responder preguntas
     CONSULTAR  la lista de preguntas y el detalle de cada una
     ACTUALIZAR editar una pregunta (foro.php?editar=ID)
     ELIMINAR   borrar una pregunta (con sus respuestas) o
                borrar una respuesta suelta
   Todo llega por POST, se guarda en MySQL y la página se
   recarga (patrón Post/Redirect/Get). El detalle de una
   pregunta se abre con foro.php?ver=ID.
   Las funciones de la base están en backend/bd.php.
   ============================================================ */
// Se cargan las funciones del foro: bd_foro_preguntas,
// bd_foro_crear_pregunta, bd_foro_eliminar_respuesta, etc.
require_once __DIR__ . '/backend/bd.php';

// ===== AYUDAS DE VALIDACIÓN =====
/* Los temas válidos son los mismos de la columna «tema». */
function foro_tema_valido($tema) {
    // Comparación estricta contra los cuatro valores del ENUM
    // «tema»: cualquier otro texto que llegue se rechaza.
    return in_array($tema, array('Hardware', 'Redes', 'Mantenimiento', 'Otro'), true);
}

// ===== ACCIONES QUE LLEGAN POR POST =====
// Este bloque solo corre cuando un formulario del foro se envió.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // El campo oculto «accion» distingue publicar, responder,
    // actualizar y los dos tipos de eliminar.
    $accion = $_POST['accion'] ?? '';

    // ----- CREAR: publicar una pregunta -----
    if ($accion === 'publicar') {
        // Autor de la pregunta, limpio de espacios en las puntas.
        $nombre    = trim($_POST['nombre'] ?? '');
        // Título que se verá en la lista de preguntas.
        $titulo    = trim($_POST['titulo'] ?? '');
        // Tema elegido en el <select>; si no llega, queda «Otro».
        $tema      = $_POST['tema'] ?? 'Otro';
        // La explicación completa del problema.
        $contenido = trim($_POST['contenido'] ?? '');
        // Validación en PHP: ningún campo obligatorio puede faltar.
        // Mínimos: nombre 2, título 4 y contenido 4 caracteres.
        if (mb_strlen($nombre) >= 2 && mb_strlen($titulo) >= 4
            && foro_tema_valido($tema) && mb_strlen($contenido) >= 4) {
            // Se inserta la fila en foro_preguntas.
            bd_foro_crear_pregunta($nombre, $titulo, $tema, $contenido);
            // Recarga con el aviso verde de «pregunta publicada».
            header('Location: foro.php?publicada=1');
        } else {
            // Algo venía corto o inválido: vuelta con aviso de error.
            header('Location: foro.php?error=1');
        }
        exit;
    }

    // ----- CREAR: responder una pregunta -----
    if ($accion === 'responder') {
        // Id de la pregunta que se está respondiendo (campo oculto).
        $pid       = (int)($_POST['pregunta_id'] ?? 0);
        // Nombre de quien ayuda con la respuesta.
        $nombre    = trim($_POST['nombre'] ?? '');
        // Texto de la ayuda que se va a guardar.
        $contenido = trim($_POST['contenido'] ?? '');
        // Además de los mínimos de texto, se comprueba que la
        // pregunta exista de verdad: no se puede responder a un
        // id inventado (bd_foro_pregunta devuelve null si no está).
        if ($pid > 0 && bd_foro_pregunta($pid) !== null
            && mb_strlen($nombre) >= 2 && mb_strlen($contenido) >= 2) {
            // La respuesta queda guardada con el pregunta_id de su pregunta.
            bd_foro_crear_respuesta($pid, $nombre, $contenido);
            // Se regresa al detalle de la misma pregunta, donde la
            // respuesta nueva aparece al final de la conversación.
            header('Location: foro.php?ver=' . $pid);
        } else {
            // Mismo detalle, pero con el aviso de que no se guardó.
            header('Location: foro.php?ver=' . $pid . '&error=1');
        }
        exit;
    }

    // ----- ACTUALIZAR: guardar la pregunta editada -----
    if ($accion === 'actualizar') {
        // Id de la pregunta editada (el nombre del autor no se edita).
        $pid       = (int)($_POST['id'] ?? 0);
        // Nuevos valores de título, tema y contenido.
        $titulo    = trim($_POST['titulo'] ?? '');
        $tema      = $_POST['tema'] ?? 'Otro';
        $contenido = trim($_POST['contenido'] ?? '');
        // Se exigen los mismos mínimos que al publicar la pregunta.
        if ($pid > 0 && mb_strlen($titulo) >= 4
            && foro_tema_valido($tema) && mb_strlen($contenido) >= 4) {
            // UPDATE sobre la fila de foro_preguntas con ese id.
            bd_foro_actualizar_pregunta($pid, $titulo, $tema, $contenido);
            // Al detalle, para ver la pregunta ya con los cambios.
            header('Location: foro.php?ver=' . $pid . '&actualizada=1');
        } else {
            // Falla la validación: de vuelta al formulario de edición.
            header('Location: foro.php?editar=' . $pid . '&error=1');
        }
        exit;
    }

    // ----- ELIMINAR: borrar una pregunta (y sus respuestas) -----
    if ($accion === 'eliminar_pregunta') {
        // Id de la pregunta a borrar, desde su formulario de eliminar.
        $pid = (int)($_POST['pregunta_id'] ?? 0);
        if ($pid > 0) {
            // Al borrar la pregunta, sus respuestas caen solas
            // por el ON DELETE CASCADE de foro_respuestas.
            bd_foro_eliminar_pregunta($pid);
        }
        // A la lista general, con el aviso de «pregunta eliminada».
        header('Location: foro.php?eliminada=1');
        exit;
    }

    // ----- ELIMINAR: borrar una respuesta -----
    if ($accion === 'eliminar_respuesta') {
        // $rid es la respuesta a borrar y $pid la pregunta dueña:
        // se necesitan los dos, uno para borrar y otro para volver.
        $rid = (int)($_POST['respuesta_id'] ?? 0);
        $pid = (int)($_POST['pregunta_id'] ?? 0);
        if ($rid > 0) {
            bd_foro_eliminar_respuesta($rid);
        }
        // Se regresa al detalle de la pregunta, ya sin esa respuesta.
        header('Location: foro.php?ver=' . $pid);
        exit;
    }
}

// ===== CONSULTAR: datos para la vista =====
// Detalle de una pregunta (foro.php?ver=ID) con sus respuestas.
// Sin ?ver en la URL, $detalle queda en null y no se pinta el detalle.
$detalle = null;
// Las respuestas del detalle arrancan como arreglo vacío.
$respuestasDetalle = array();
if (isset($_GET['ver'])) {
    // Se busca la pregunta pedida por la URL.
    $detalle = bd_foro_pregunta((int)$_GET['ver']);
    if ($detalle !== null) {
        // Solo si existe se consultan sus respuestas en orden.
        $respuestasDetalle = bd_foro_respuestas((int)$detalle['id']);
    }
}
// Pregunta cargada en el formulario de edición (foro.php?editar=ID).
$editar = null;
if (isset($_GET['editar'])) {
    // Misma consulta que el detalle: la vista la usa para
    // rellenar los campos del formulario de edición.
    $editar = bd_foro_pregunta((int)$_GET['editar']);
}
// Lista de preguntas (cada fila ya trae su conteo de respuestas).
// Se consulta siempre: la lista se muestra en todos los casos.
$preguntas = bd_foro_preguntas();
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
<?php if (isset($_GET['eliminada'])): ?>
    <div class="mejora-card"><p class="mejora-msg">Pregunta eliminada.</p></div>
<?php endif; ?>
<?php if (isset($_GET['error']) && !$detalle && !$editar): ?>
    <div class="mejora-card"><p class="mejora-msg">No se pudo guardar. Revisa que todos los campos estén completos e inténtalo de nuevo.</p></div>
<?php endif; ?>

    <!-- ===== CREAR: formulario para publicar una pregunta ===== -->
    <div class="mejora-card">
      <h2>Publica tu problema</h2>
      <!-- validaciones.js revisa este formulario con el id form-foro-publicar antes de enviarlo -->
      <form method="post" action="foro.php" id="form-foro-publicar">
        <!-- La acción «publicar» es la que el bloque POST de arriba reconoce -->
        <input type="hidden" name="accion" value="publicar">
        <label class="mejora-label" for="foro-nombre">Tu nombre</label>
        <input class="mejora-input" id="foro-nombre" name="nombre" type="text" maxlength="60" required>
        <label class="mejora-label" for="foro-titulo">Título del problema</label>
        <input class="mejora-input" id="foro-titulo" name="titulo" type="text" maxlength="120" required>
        <label class="mejora-label" for="foro-tema">Tema</label>
        <!-- Las cuatro opciones son, una por una, los valores del ENUM «tema» de foro_preguntas -->
        <select class="mejora-select" id="foro-tema" name="tema">
          <option value="Hardware">Hardware</option>
          <option value="Redes">Redes</option>
          <option value="Mantenimiento">Mantenimiento</option>
          <option value="Otro">Otro</option>
        </select>
        <label class="mejora-label" for="foro-cuerpo">Cuéntanos qué pasa (qué hiciste, qué error sale, desde cuándo)</label>
        <textarea class="mejora-textarea" id="foro-cuerpo" name="contenido" maxlength="2000" required></textarea>
        <button type="submit" class="tool-btn">Publicar pregunta</button>
      </form>
    </div>

    <!-- ===== CONSULTAR: lista de preguntas ===== -->
    <div class="mejora-card">
      <h2>Preguntas de la comunidad</h2>
      <div id="foro-list">
<?php if (!$preguntas): ?>
        <!-- Tabla vacía: todavía nadie ha publicado en el foro -->
        <p>Todavía no hay preguntas. ¡Publica la primera!</p>
<?php else: ?>
<?php foreach ($preguntas as $p): ?>
        <!-- Tarjeta de UNA pregunta de la lista: tema, título, autor, fecha corta y su conteo de respuestas -->
        <article class="foro-item">
          <span class="foro-tag mejora-chip"><?php echo e($p['tema'] ?? 'Otro'); ?></span>
          <h3 class="foro-q-title"><?php echo e($p['titulo']); ?></h3>
          <!-- «respuestas» no es una columna: es el COUNT que calculó el LEFT JOIN de bd_foro_preguntas() -->
          <p class="foro-meta">por <?php echo e($p['nombre']); ?> · <?php echo e(fecha_corta($p['fecha'])); ?> · <?php echo (int)$p['respuestas']; ?> respuestas</p>
          <!-- El enlace lleva el id en la URL: así foro.php sabe qué detalle abrir -->
          <a class="tool-btn tool-btn-ghost" href="foro.php?ver=<?php echo e($p['id']); ?>">Ver y responder</a>
        </article>
<?php endforeach; ?>
<?php endif; ?>
      </div>
    </div>

<?php if ($detalle): ?>
    <!-- ===== CONSULTAR: detalle de la pregunta, con sus respuestas ===== -->
    <div class="mejora-card" id="foro-detail">
      <a class="tool-btn tool-btn-ghost" href="foro.php">← Volver a las preguntas</a>
<?php if (isset($_GET['actualizada'])): ?>
      <p class="mejora-msg">¡Pregunta actualizada!</p>
<?php endif; ?>
<?php if (isset($_GET['error'])): ?>
      <p class="mejora-msg">No se pudo guardar la respuesta. Revisa los datos e inténtalo de nuevo.</p>
<?php endif; ?>
      <!-- Cuerpo del detalle: todo sale de la fila $detalle que trajo bd_foro_pregunta(), escapado con e() -->
      <div id="foro-detail-body">
        <span class="foro-tag mejora-chip"><?php echo e($detalle['tema'] ?? 'Otro'); ?></span>
        <h2><?php echo e($detalle['titulo']); ?></h2>
        <p class="foro-meta">por <?php echo e($detalle['nombre']); ?> · <?php echo e(fecha_corta($detalle['fecha'])); ?></p>
        <p><?php echo e($detalle['contenido']); ?></p>
      </div>
      <!-- ACTUALIZAR / ELIMINAR la pregunta -->
      <p>
        <a class="tool-btn tool-btn-ghost" href="foro.php?editar=<?php echo e($detalle['id']); ?>">Editar pregunta</a>
      </p>
      <form method="post" action="foro.php" class="form-confirmar" data-confirm="¿Seguro que quieres eliminar esta pregunta? También se borran sus respuestas.">
        <input type="hidden" name="accion" value="eliminar_pregunta">
        <input type="hidden" name="pregunta_id" value="<?php echo e($detalle['id']); ?>">
        <button type="submit" class="tool-btn tool-btn-ghost">Eliminar pregunta</button>
      </form>
      <h3>Respuestas</h3>
      <div id="foro-answers">
<?php if (!$respuestasDetalle): ?>
        <p>Sin respuestas todavía. ¡Sé la primera persona en ayudar!</p>
<?php else: ?>
<?php foreach ($respuestasDetalle as $r): ?>
        <!-- Bloque de UNA respuesta: quién la escribió, cuándo y qué dijo -->
        <div class="foro-answer">
          <p class="foro-meta"><?php echo e($r['nombre']); ?> · <?php echo e(fecha_corta($r['fecha'])); ?></p>
          <p><?php echo e($r['contenido']); ?></p>
          <!-- ELIMINAR esta respuesta -->
          <form method="post" action="foro.php" class="form-confirmar" data-confirm="¿Seguro que quieres eliminar esta respuesta?">
            <input type="hidden" name="accion" value="eliminar_respuesta">
            <input type="hidden" name="respuesta_id" value="<?php echo e($r['id']); ?>">
            <input type="hidden" name="pregunta_id" value="<?php echo e($detalle['id']); ?>">
            <button type="submit" class="tool-btn tool-btn-ghost">Eliminar respuesta</button>
          </form>
        </div>
<?php endforeach; ?>
<?php endif; ?>
      </div>
      <!-- CREAR: formulario para responder -->
      <form method="post" action="foro.php" id="form-foro-responder">
        <input type="hidden" name="accion" value="responder">
        <input type="hidden" name="pregunta_id" value="<?php echo e($detalle['id']); ?>">
        <label class="mejora-label" for="foro-answer-nombre">Tu nombre</label>
        <input class="mejora-input" id="foro-answer-nombre" name="nombre" type="text" maxlength="60" required>
        <label class="mejora-label" for="foro-answer-text">Tu respuesta</label>
        <textarea class="mejora-textarea" id="foro-answer-text" name="contenido" maxlength="2000" required></textarea>
        <button type="submit" class="tool-btn">Enviar respuesta</button>
      </form>
    </div>
<?php endif; ?>

<?php if ($editar): ?>
    <!-- ===== ACTUALIZAR: formulario de edición con los datos cargados ===== -->
    <div class="mejora-card" id="foro-edit">
      <a class="tool-btn tool-btn-ghost" href="foro.php?ver=<?php echo e($editar['id']); ?>">← Volver a la pregunta</a>
      <h2>Editar pregunta</h2>
<?php if (isset($_GET['error'])): ?>
      <p class="mejora-msg">No se pudo guardar. Revisa que todos los campos estén completos e inténtalo de nuevo.</p>
<?php endif; ?>
      <form method="post" action="foro.php" id="form-foro-editar">
        <input type="hidden" name="accion" value="actualizar">
        <input type="hidden" name="id" value="<?php echo e($editar['id']); ?>">
        <p class="foro-meta">Pregunta de <?php echo e($editar['nombre']); ?> · <?php echo e(fecha_corta($editar['fecha'])); ?></p>
        <label class="mejora-label" for="editar-titulo">Título del problema</label>
        <input class="mejora-input" id="editar-titulo" name="titulo" type="text" maxlength="120" required value="<?php echo e($editar['titulo']); ?>">
        <label class="mejora-label" for="editar-tema">Tema</label>
        <select class="mejora-select" id="editar-tema" name="tema">
<?php foreach (array('Hardware', 'Redes', 'Mantenimiento', 'Otro') as $t): ?>
          <!-- Se genera una opción por tema y la que coincide con el tema guardado lleva «selected» -->
          <option value="<?php echo $t; ?>"<?php echo $editar['tema'] === $t ? ' selected' : ''; ?>><?php echo $t; ?></option>
<?php endforeach; ?>
        </select>
        <label class="mejora-label" for="editar-cuerpo">Cuéntanos qué pasa</label>
        <textarea class="mejora-textarea" id="editar-cuerpo" name="contenido" maxlength="2000" required><?php echo e($editar['contenido']); ?></textarea>
        <button type="submit" class="tool-btn">Guardar cambios</button>
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
