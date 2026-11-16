<?php
/* NVISION — versión PHP para XAMPP: avisos y comentarios del inicio. */
require_once __DIR__ . '/backend/bd.php';
$listaAvisos = bd_listar('avisos', array('orden' => 'created_at.desc', 'limite' => 5));
$PAGINA_COMENTARIOS = 'inicio';
require __DIR__ . '/includes/comentarios_ctrl.php';
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
  <title data-i18n="page_title_index">NVISION - Hardware y Computadores</title>
  <!-- Hojas de estilo modular -->
  <link rel="stylesheet" href="frontend/css/styles.css?v=129">
  <!-- SEO, iconos y vista previa al compartir (Open Graph / Twitter) -->
  <meta name="description" content="NVISION: aprende hardware, redes y mantenimiento de PC con simuladores interactivos, un taller 3D de armado, glosario con tarjetas y retos. Gratis y en español.">
  <meta name="theme-color" content="#f8fafc">
  <link rel="canonical" href="https://nvision.social/">
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
  <meta property="og:title" content="NVISION - Hardware y Computadores">
  <meta property="og:description" content="NVISION: aprende hardware, redes y mantenimiento de PC con simuladores interactivos, un taller 3D de armado, glosario con tarjetas y retos. Gratis y en español.">
  <meta property="og:url" content="https://nvision.social/">
  <meta property="og:image" content="https://nvision.social/assets/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="NVISION - Hardware y Computadores">
  <meta name="twitter:description" content="NVISION: aprende hardware, redes y mantenimiento de PC con simuladores interactivos, un taller 3D de armado, glosario con tarjetas y retos. Gratis y en español.">
  <meta name="twitter:image" content="https://nvision.social/assets/og-image.jpg">
  
</head>
<body>

  <!-- Encabezado y Barra de Navegación Adaptativa -->
    <!-- Encabezado y Barra de Navegación Adaptativa -->
  <?php include __DIR__ . '/includes/header.php'; ?>

  <!-- Hero Section -->
  <header class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title" data-i18n="hero_title">Arquitectura y Evolución de los Computadores</h1>
      <p class="hero-subtitle" data-i18n="hero_desc">Aprende hardware, redes y mantenimiento de PC desde cero, gratis y en español: módulos claros y directos, el foro de la comunidad y atención de PQR.</p>
      <div class="hero-buttons">
        <a href="hardware.php" class="btn-primary"><span data-i18n="hero_cta_start">Empezar a aprender</span></a>
        <a href="foro.php" class="btn-secondary"><span>Foro El Taller</span></a>
      </div>

    </div>
  </header>

<main>
  <section class="container landing-overview">
    <h2 class="section-title"><span class="mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></span><span data-i18n="idx_explore_title">Explora NVISION</span></h2>
    <p class="section-desc" data-i18n="idx_explore_desc">Selecciona un área para conocer la historia del hardware, entender las redes o practicar con recursos interactivos.</p>
    <div class="nv-cards-grid">

      <!-- Card: Hardware -->
      <a class="nv-card" href="hardware.php#historia">
        <div class="nv-card-media">
          <img src="assets/card-hardware.jpg" alt="Placa base con circuitos y componentes" loading="lazy" decoding="async">
          <span class="nv-card-chip">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="6" y="14" width="36" height="24" rx="2"/>
            <rect x="14" y="8" width="20" height="6" rx="1"/>
            <line x1="24" y1="38" x2="24" y2="44"/>
            <line x1="14" y1="44" x2="34" y2="44"/>
            <rect x="11" y="19" width="6" height="6" rx="1" fill="rgba(56,189,248,0.15)" stroke="#38bdf8"/>
            <rect x="21" y="19" width="6" height="6" rx="1" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" opacity="0.6"/>
            <line x1="17" y1="31" x2="30" y2="31" stroke-width="1.5" opacity="0.5"/>
            <line x1="17" y1="34" x2="26" y2="34" stroke-width="1.5" opacity="0.4"/>
          </svg>
          </span>
        </div>
        <div class="nv-card-body">
          <h3 class="nv-card-title" data-i18n-html="idx_card_hw_title">Hardware<br>y Evolución</h3>
          <p class="nv-card-desc" data-i18n="idx_card_hw_desc">Historia de los computadores y los componentes que forman un equipo de cómputo.</p>
        </div>
        <div class="nv-card-footer">
          <span class="nv-card-cta" data-i18n="idx_card_cta">Explorar</span>
          <span class="nv-card-arrow">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="10" x2="17" y2="10"/>
              <polyline points="11 4 17 10 11 16"/>
            </svg>
          </span>
        </div>
        <div class="nv-card-bar"></div>
      </a>

      <!-- Card: Redes -->
      <a class="nv-card" href="redes.php#redes">
        <div class="nv-card-media">
          <img src="assets/card-redes.jpg" alt="Panel de conexiones de red con cables ethernet azules" loading="lazy" decoding="async">
          <span class="nv-card-chip">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="24" cy="24" r="4" fill="rgba(56,189,248,0.15)" stroke="#38bdf8"/>
            <circle cx="8" cy="14" r="3.5" stroke="currentColor" opacity="0.7"/>
            <circle cx="40" cy="14" r="3.5" stroke="currentColor" opacity="0.7"/>
            <circle cx="8" cy="34" r="3.5" stroke="currentColor" opacity="0.7"/>
            <circle cx="40" cy="34" r="3.5" stroke="currentColor" opacity="0.7"/>
            <line x1="11" y1="15" x2="21" y2="22"/>
            <line x1="37" y1="15" x2="27" y2="22"/>
            <line x1="11" y1="33" x2="21" y2="26"/>
            <line x1="37" y1="33" x2="27" y2="26"/>
          </svg>
          </span>
        </div>
        <div class="nv-card-body">
          <h3 class="nv-card-title" data-i18n-html="idx_card_net_title">Redes<br>y Simulación</h3>
          <p class="nv-card-desc" data-i18n="idx_card_net_desc">Tipos de redes, topologías y un simulador visual de tránsito de datos.</p>
        </div>
        <div class="nv-card-footer">
          <span class="nv-card-cta" data-i18n="idx_card_cta">Explorar</span>
          <span class="nv-card-arrow">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="10" x2="17" y2="10"/>
              <polyline points="11 4 17 10 11 16"/>
            </svg>
          </span>
        </div>
        <div class="nv-card-bar"></div>
      </a>

      <!-- Card: Recursos -->
      

      <!-- Card: Mantenimiento por software -->
      <a class="nv-card" href="mantenimiento.php">
        <div class="nv-card-media">
          <img src="assets/card-mantenimiento.jpg" alt="Torre de computador con ventiladores de luz azul" loading="lazy" decoding="async">
          <span class="nv-card-chip">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="24" cy="24" r="3" fill="rgba(56,189,248,0.15)" stroke="#38bdf8"/>
            <path d="M24 12a12 12 0 0 1 12 12c0 2-1 3-2 4l-2 3h-4l-1-3a12 12 0 0 1-3 0l-1 3h-4l-2-3c-1-1-2-2-2-4a12 12 0 0 1 9-12z"/>
            <path d="M18 24l3 3 7-7" stroke="#38bdf8"/>
          </svg>
          </span>
        </div>
        <div class="nv-card-body">
          <h3 class="nv-card-title" data-i18n-html="idx_card_maint_title">Mantenimiento<br>por software</h3>
          <p class="nv-card-desc" data-i18n="idx_card_maint_desc">Actualizaciones, antivirus, limpieza, copias de seguridad y una rutina para que tu equipo no falle.</p>
        </div>
        <div class="nv-card-footer">
          <span class="nv-card-cta" data-i18n="idx_card_cta">Explorar</span>
          <span class="nv-card-arrow">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="10" x2="17" y2="10"/>
              <polyline points="11 4 17 10 11 16"/>
            </svg>
          </span>
        </div>
        <div class="nv-card-bar"></div>
      </a>

      <!-- Card: WiFi -->
      

      <!-- Card: PC 3D -->
      

      <!-- Card: Reto de Redes -->
      

      <!-- Card: Taller de PC -->
      <a class="nv-card" href="foro.php">
        <div class="nv-card-media">
          <img src="assets/card-taller.jpg" alt="Técnica trabajando con un portátil entre cables y equipos en un taller" loading="lazy" decoding="async">
          <span class="nv-card-chip">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M29.4 12.6a2 2 0 0 0 0 2.8l3.2 3.2a2 2 0 0 0 2.8 0l7.54-7.54a12 12 0 0 1-15.88 15.88l-13.82 13.82a4.24 4.24 0 0 1-6-6l13.82-13.82a12 12 0 0 1 15.88-15.88l-7.52 7.52z"/>
          </svg>
          </span>
        </div>
        <div class="nv-card-body">
          <h3 class="nv-card-title" data-i18n-html="idx_card_taller_title">Foro<br>El Taller</h3>
          <p class="nv-card-desc" data-i18n="idx_card_taller_desc">Pregunta tus dudas de los módulos y ayuda a los demás: la comunidad responde.</p>
        </div>
        <div class="nv-card-footer">
          <span class="nv-card-cta" data-i18n="idx_card_cta">Explorar</span>
          <span class="nv-card-arrow">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="10" x2="17" y2="10"/>
              <polyline points="11 4 17 10 11 16"/>
            </svg>
          </span>
        </div>
        <div class="nv-card-bar"></div>
      </a>

      <!-- Card: Seguridad digital -->
      

    </div>
  </section>

  

  

  <!-- Fondo de pantalla NVISION para PC: la imagen se muestra y el botón solo la descarga -->
  
  <section class="container" aria-label="Novedades">
    <div class="nov-wrap">
      <h2 class="section-title">Novedades</h2>
      <p class="section-desc">Avisos del equipo NVISION.</p>
      <div class="nov-list" id="avisos">
<?php foreach ($listaAvisos as $a): ?>
        <article class="nov-card"><div class="nov-head"><span class="nov-tag">Aviso</span><span><?php echo e(fecha_corta($a['created_at'])); ?></span></div><h2><?php echo e($a['titulo']); ?></h2><p><?php echo e($a['contenido']); ?></p></article>
<?php endforeach; ?>
<?php if (!$listaAvisos): ?><p>No hay avisos por ahora.</p><?php endif; ?>
      </div>
    </div>
  </section>
<section class="container wallpaper-section" aria-label="Fondo de pantalla NVISION">
    <div class="pd-card wallpaper-card">
      <p class="pd-kicker" data-i18n="wp_kicker">Para tu PC</p>
      <h3 data-i18n="wp_title">Fondo de pantalla NVISION</h3>
      <img class="wallpaper-img" src="assets/nvision-wallpaper.jpg" alt="NVISION" width="1672" height="941" loading="lazy">
      <a class="btn-primary wallpaper-btn" href="assets/nvision-wallpaper.jpg" download="fondo-pantalla-nvision.jpg" data-i18n="wp_btn">Descargar fondo de pantalla</a>
    </div>
  </section>

  
  <?php include __DIR__ . '/includes/comentarios.php'; ?>
</main>

  <!-- Footer -->
    <?php include __DIR__ . '/includes/footer.php'; ?>

  <!-- Script interactivo bilingüe y menú móvil -->
  
  
  
  
  
  
  <script src="frontend/js/interfaz.js"></script>
</body>
</html>
