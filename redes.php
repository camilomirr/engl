<?php
/* NVISION — versión PHP para XAMPP: comentarios de esta página. */
/* Página de Redes y Simulación: contenido educativo (tipos de
   red y topologías); el PHP solo interviene en los comentarios,
   que en la tabla «comentarios» se guardan con pagina 'redes'. */
// Marca de esta página para filtrar sus comentarios en la base.
$PAGINA_COMENTARIOS = 'redes';
// Controlador de comentarios: atiende el POST y prepara la lista.
require __DIR__ . '/includes/comentarios_ctrl.php';
?>
<!DOCTYPE html>
<html lang="es" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com https://encrypted-tbn0.gstatic.com https://acf.geeknetic.es https://jensa.vtexassets.com https://www.esmero.com.co https://pisces.bbystatic.com https://placaschinas.com https://th.bing.com https://www.cyberpuerta.mx https://www.legionmac.com https://www.ntcompatible.com https://*.googleusercontent.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://xiuztrujrwdgcpjrruxu.supabase.co https://*.googleusercontent.com; media-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self'">
  <title data-i18n="page_title_redes">NVISION - Redes y Simulación</title>
  <!-- Hojas de estilo modular -->
  <link rel="stylesheet" href="frontend/css/styles.css?v=129">
  <!-- SEO, iconos y vista previa al compartir (Open Graph / Twitter) -->
  <meta name="description" content="Redes en NVISION: clasificación, topologías, simulador de ping, laboratorio de switch, WiFi avanzado y el reto Redes Challenge.">
  <meta name="theme-color" content="#f8fafc">
  <link rel="canonical" href="https://nvision.social/redes.php">
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
  <meta property="og:title" content="NVISION - Redes y Simulación">
  <meta property="og:description" content="Redes en NVISION: clasificación, topologías, simulador de ping, laboratorio de switch, WiFi avanzado y el reto Redes Challenge.">
  <meta property="og:url" content="https://nvision.social/redes.php">
  <meta property="og:image" content="https://nvision.social/assets/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="NVISION - Redes y Simulación">
  <meta name="twitter:description" content="Redes en NVISION: clasificación, topologías, simulador de ping, laboratorio de switch, WiFi avanzado y el reto Redes Challenge.">
  <meta name="twitter:image" content="https://nvision.social/assets/og-image.jpg">
</head>
<body>

  <!-- Encabezado y Barra de Navegación Adaptativa -->
    <!-- Encabezado y Barra de Navegación Adaptativa -->
  <?php include __DIR__ . '/includes/header.php'; ?>

  <!-- Hero Section -->
  <main>
  <section class="container">
      <h1 class="section-title"><span data-i18n="page_h1_redes">Redes y Simulación</span></h1>
    </section>
<!-- Sección puente: cómo el hardware se enlaza con la red (dirección MAC, IP y los conceptos de enlace) -->
<section id="redes" class="container">
      <h2 class="section-title">
        <span class="mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></span> <span data-i18n="net_title">Del Hardware a la Red</span>
      </h2>
      <p class="section-desc" data-i18n="net_desc">
        Cómo el equipo físico se enlaza e interactúa en una infraestructura de red local (LAN).
      </p>

      <div class="network-bridge-grid">
        <div class="network-bridge-card">
          <span class="network-badge" data-i18n="red_badge_link">Capa de Enlace</span>
          <h3 data-i18n="mac_title">Dirección MAC (Hardware Address)</h3>
          <p data-i18n="mac_desc">
            Identificador físico único de 48 bits grabado directamente en la memoria ROM de cada tarjeta de red (NIC) para la capa de enlace de datos.
          </p>
        </div>

        <div class="network-bridge-card">
          <span class="network-badge" data-i18n="red_badge_media">Medio Físico</span>
          <h3 data-i18n="eth_title">Puertos Físicos y Conectividad</h3>
          <p data-i18n="eth_desc">
            Interfaces RJ-45 para cable de par trenzado (Ethernet) e interfaces de radiofrecuencia (Wi-Fi) conectadas mediante el bus PCIe.
          </p>
        </div>

        <div class="network-bridge-card">
          <span class="network-badge" data-i18n="red_badge_host">Arquitectura Host</span>
          <h3 data-i18n="flow_title">Flujo de Datos en el Host</h3>
          <p data-i18n="flow_desc">
            Los paquetes viajan desde la memoria RAM, son procesados por la CPU y enviados al controlador NIC para su modulación y transmisión en el medio físico.
          </p>
        </div>
      </div>
    </section>
<!-- Sección de alcance: los tipos de red ordenados de la más pequeña a la más grande (BAN, PAN, LAN, CAN, MAN, WAN y GAN) -->
<section id="alcance-redes" class="container">
      <h2 class="section-title">
        <span class="mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></span> <span data-i18n="scope_title">Tipos de Redes según su Cobertura Geográfica</span>
      </h2>
      <p class="section-desc" data-i18n="scope_desc">
        Clasificación completa de redes informáticas en orden ascendente según su escala espacial, distancia de transmisión y aplicaciones reales.
      </p>

      <!-- Tarjetas Visuales con Imágenes y Detalles -->
      <div class="network-scope-grid">
        <!-- 1. BAN -->
        <article class="scope-card">
          <div class="scope-img-wrap">
            <img src="assets/external/photo-1576091160399-112ba8d25d1d.jpg" alt="Body Area Network BAN Medical Sensors" class="scope-img" loading="eager" decoding="async">
            <span class="scope-badge ban" data-i18n="red_badge_ban">Cuerpo Humano // &lt; 1 m</span>
          </div>
          <div class="scope-body">
            <div class="scope-header">
              <span class="scope-icon mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4.5 12.5l3.5 3.5 11.5-11.5M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path></svg></span>
              <div>
                <h3 class="scope-name" data-i18n="ban_title">BAN (Body Area Network)</h3>
                <span class="scope-sub" data-i18n="ban_sub">Red de Área Corporal</span>
              </div>
            </div>
            <p class="scope-text" data-i18n="ban_desc">
              <strong>Cobertura:</strong> Menos de 1 metro en torno al cuerpo humano. Comunica biosensores implantables o llevables con monitores de salud.
            </p>
            <div class="scope-example-box">
              <span class="scope-example-label" data-i18n="lbl_example">Caso de uso común:</span>
              <p data-i18n="ban_example">Sensores médicos inalámbricos, marcapasos inteligentes y monitores continuos de glucosa o ritmo cardíaco.</p>
            </div>
            <div class="scope-tech-tags">
              <span>IEEE 802.15.6</span>
              <span>Bluetooth LE</span>
              <span data-i18n="red_tag_biosensors">Bio-sensores</span>
            </div>
          </div>
        </article>

        <!-- 2. PAN -->
        <article class="scope-card">
          <div class="scope-img-wrap">
            <img src="assets/external/photo-1508685096489-7aacd43bd3b1.jpg" alt="Personal Area Network PAN Bluetooth" class="scope-img" loading="eager" decoding="async">
            <span class="scope-badge pan" data-i18n="red_badge_pan">Personal // ~1 a 10 m</span>
          </div>
          <div class="scope-body">
            <div class="scope-header">
              <span class="scope-icon mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="7" width="12" height="10" rx="2"></rect><path d="M9 1v6M15 1v6M9 17v6M15 17v6"></path></svg></span>
              <div>
                <h3 class="scope-name" data-i18n="pan_title">PAN (Personal Area Network)</h3>
                <span class="scope-sub" data-i18n="pan_sub">Red de Área Personal</span>
              </div>
            </div>
            <p class="scope-text" data-i18n="pan_desc">
              <strong>Cobertura:</strong> Alrededor de 1 a 10 metros del usuario. Enlaza dispositivos personales directos de bajo consumo eléctrico.
            </p>
            <div class="scope-example-box">
              <span class="scope-example-label" data-i18n="lbl_example">Caso de uso común:</span>
              <p data-i18n="pan_example">Bluetooth entre móvil, reloj inteligente y auriculares inalámbricos.</p>
            </div>
            <div class="scope-tech-tags">
              <span>Bluetooth 5.3</span>
              <span>NFC</span>
              <span>Zigbee</span>
            </div>
          </div>
        </article>

        <!-- 3. LAN / WLAN -->
        <article class="scope-card">
          <div class="scope-img-wrap">
            <img src="assets/external/photo-1544197150-b99a580bb7a8.jpg" alt="Local Area Network LAN Cables and Switch" class="scope-img" loading="eager" decoding="async">
            <span class="scope-badge lan" data-i18n="red_badge_lan">Hogar / Edificio // ~100 m</span>
          </div>
          <div class="scope-body">
            <div class="scope-header">
              <span class="scope-icon mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></span>
              <div>
                <h3 class="scope-name" data-i18n="lan_title">LAN / WLAN (Local Area Network)</h3>
                <span class="scope-sub" data-i18n="lan_sub">Red de Área Local Cableada / Inalámbrica</span>
              </div>
            </div>
            <p class="scope-text" data-i18n="lan_desc">
              <strong>Cobertura:</strong> Espacio delimitado como una casa, laboratorio u oficina (hasta 100 m por segmento de cable).
            </p>
            <div class="scope-example-box">
              <span class="scope-example-label" data-i18n="lbl_example">Caso de uso común:</span>
              <p data-i18n="lan_example">Red doméstica Wi-Fi o red interna conmutada de oficina para compartir impresoras e Internet.</p>
            </div>
            <div class="scope-tech-tags">
              <span>Ethernet 802.3</span>
              <span>Wi-Fi 6 (802.11ax)</span>
              <span>Switching L2</span>
            </div>
          </div>
        </article>

        <!-- 4. CAN -->
        <article class="scope-card">
          <div class="scope-img-wrap">
            <img src="assets/external/photo-1541339907198-e08756dedf3f.jpg" alt="Campus Area Network CAN University" class="scope-img" loading="eager" decoding="async">
            <span class="scope-badge can" data-i18n="red_badge_can">Campus // 1 a 5 km</span>
          </div>
          <div class="scope-body">
            <div class="scope-header">
              <span class="scope-icon mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg></span>
              <div>
                <h3 class="scope-name" data-i18n="can_title">CAN (Campus Area Network)</h3>
                <span class="scope-sub" data-i18n="can_sub">Red de Área de Campus</span>
              </div>
            </div>
            <p class="scope-text" data-i18n="can_desc">
              <strong>Cobertura:</strong> Conjunto contiguo de edificios dentro de un radio de 1 a 5 km, interconectados mediante troncales de alta velocidad.
            </p>
            <div class="scope-example-box">
              <span class="scope-example-label" data-i18n="lbl_example">Caso de uso común:</span>
              <p data-i18n="can_example">Universidad, complejo hospitalario o parque industrial con múltiples facultades y laboratorios enlazados.</p>
            </div>
            <div class="scope-tech-tags">
              <span data-i18n="red_tag_fiber">Fibra Óptica OM4</span>
              <span>Backbone 10GbE</span>
              <span>VLAN Trunking</span>
            </div>
          </div>
        </article>

        <!-- 5. MAN -->
        <article class="scope-card">
          <div class="scope-img-wrap">
            <img src="assets/external/photo-1519501025264-65ba15a82390.jpg" alt="Metropolitan Area Network MAN City" class="scope-img" loading="eager" decoding="async">
            <span class="scope-badge man" data-i18n="red_badge_man">Metropolitana // Hasta 50 km</span>
          </div>
          <div class="scope-body">
            <div class="scope-header">
              <span class="scope-icon mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="8" width="8" height="14" rx="1"></rect><rect x="13" y="3" width="8" height="19" rx="1"></rect><line x1="7" y1="12" x2="7.01" y2="12"></line><line x1="7" y1="16" x2="7.01" y2="16"></line><line x1="17" y1="7" x2="17.01" y2="7"></line><line x1="17" y1="11" x2="17.01" y2="11"></line><line x1="17" y1="15" x2="17.01" y2="15"></line></svg></span>
              <div>
                <h3 class="scope-name" data-i18n="man_title">MAN (Metropolitan Area Network)</h3>
                <span class="scope-sub" data-i18n="man_sub">Red de Área Metropolitana</span>
              </div>
            </div>
            <p class="scope-text" data-i18n="man_desc">
              <strong>Cobertura:</strong> Una ciudad, municipio o área metropolitana completa (hasta 50 km) mediante anillos ópticos.
            </p>
            <div class="scope-example-box">
              <span class="scope-example-label" data-i18n="lbl_example">Caso de uso común:</span>
              <p data-i18n="man_example">Red municipal de fibra óptica, sistemas de cámaras de seguridad urbana o televisión por cable.</p>
            </div>
            <div class="scope-tech-tags">
              <span>Metro Ethernet</span>
              <span data-i18n="red_tag_sdh">Anillos SDH / SONET</span>
              <span>DWDM</span>
            </div>
          </div>
        </article>

        <!-- 6. WAN -->
        <article class="scope-card">
          <div class="scope-img-wrap">
            <img src="assets/external/photo-1451187580459-43490279c0fa.jpg" alt="Wide Area Network WAN Global Internet" class="scope-img" loading="eager" decoding="async">
            <span class="scope-badge wan" data-i18n="red_badge_wan">País / Continente // Extensa</span>
          </div>
          <div class="scope-body">
            <div class="scope-header">
              <span class="scope-icon mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></span>
              <div>
                <h3 class="scope-name" data-i18n="wan_title">WAN (Wide Area Network)</h3>
                <span class="scope-sub" data-i18n="wan_sub">Red de Área Amplia</span>
              </div>
            </div>
            <p class="scope-text" data-i18n="wan_desc">
              <strong>Cobertura:</strong> Cobertura masiva a nivel de países o continentes mediante telecomunicaciones públicas y privadas.
            </p>
            <div class="scope-example-box">
              <span class="scope-example-label" data-i18n="lbl_example">Caso de uso común:</span>
              <p data-i18n="wan_example">Interconexión de sucursales bancarias nacionales, corporaciones multinacionales y la red Internet.</p>
            </div>
            <div class="scope-tech-tags">
              <span>MPLS</span>
              <span>SD-WAN</span>
              <span data-i18n="red_tag_bgp">Enrutamiento BGP</span>
            </div>
          </div>
        </article>

        <!-- 7. GAN -->
        <article class="scope-card">
          <div class="scope-img-wrap">
            <img src="assets/external/photo-1446776811953-b23d57bd21aa.jpg" alt="Global Area Network GAN Earth from Orbit Satellite" class="scope-img" loading="eager" decoding="async">
            <span class="scope-badge gan" data-i18n="red_badge_gan">Planetario // Global Total</span>
          </div>
          <div class="scope-body">
            <div class="scope-header">
              <span class="scope-icon mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="2" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="22"></line><line x1="2" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="22" y2="12"></line><path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg></span>
              <div>
                <h3 class="scope-name" data-i18n="gan_title">GAN (Global Area Network)</h3>
                <span class="scope-sub" data-i18n="gan_sub">Red de Área Global</span>
              </div>
            </div>
            <p class="scope-text" data-i18n="gan_desc">
              <strong>Cobertura:</strong> Escala planetaria completa. Red global sin límites fronterizos que une todas las redes terrestres y espaciales.
            </p>
            <div class="scope-example-box">
              <span class="scope-example-label" data-i18n="lbl_example">Caso de uso común:</span>
              <p data-i18n="gan_example">Redes de constelaciones satelitales en órbita baja (Starlink, OneWeb), GPS y cables submarinos transoceánicos.</p>
            </div>
            <div class="scope-tech-tags">
              <span data-i18n="red_tag_leo">Satélites LEO</span>
              <span data-i18n="red_tag_submarine">Cables Submarinos</span>
              <span data-i18n="red_tag_laser">Laser Inter-satelital</span>
            </div>
          </div>
        </article>
      </div>
    </section>
<!-- Sección de topologías: la forma física/lógica de conectar los nodos (estrella, bus, anillo, malla, árbol e híbrida) -->
<section id="topologias" class="container">
      <h2 class="section-title">
        <span class="mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></span> <span data-i18n="topol_title">Topologías de Redes</span>
      </h2>
      <p class="section-desc" data-i18n="topol_desc">
        La distribución física y lógica que define cómo se interconectan los nodos, hosts y enlaces de transmisión en una infraestructura de comunicaciones.
      </p>

      <div class="topologies-grid">
        <!-- 1. Topología en Estrella -->
        <article class="topology-card">
          <div class="topo-card-header">
            <span class="card-icon mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"></circle><circle cx="12" cy="3" r="2"></circle><circle cx="21" cy="12" r="2"></circle><circle cx="12" cy="21" r="2"></circle><circle cx="3" cy="12" r="2"></circle><line x1="12" y1="5" x2="12" y2="9"></line><line x1="19" y1="12" x2="15" y2="12"></line><line x1="12" y1="19" x2="12" y2="15"></line><line x1="5" y1="12" x2="9" y2="12"></line></svg></span>
            <div>
              <h3 class="topo-card-title" data-i18n="star_title">Topología en Estrella (Star)</h3>
              <span class="topo-badge" data-i18n="star_badge">Punto Centralizado // Estándar LAN</span>
            </div>
          </div>

          <div class="topo-diagram-wrap" aria-label="Diagrama Topología en Estrella" data-i18n-title="red_topo_aria_star">
            <svg width="240" height="130" class="topo-svg" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
              <line x1="120" y1="65" x2="45" y2="35" class="topo-line" />
              <line x1="120" y1="65" x2="195" y2="35" class="topo-line" />
              <line x1="120" y1="65" x2="55" y2="105" class="topo-line" />
              <line x1="120" y1="65" x2="185" y2="105" class="topo-line" />
              <line x1="120" y1="65" x2="120" y2="18" class="topo-line" />
              <circle cx="45" cy="35" r="9" class="topo-node" />
              <circle cx="195" cy="35" r="9" class="topo-node" />
              <circle cx="55" cy="105" r="9" class="topo-node" />
              <circle cx="185" cy="105" r="9" class="topo-node" />
              <circle cx="120" cy="18" r="9" class="topo-node" />
              <circle cx="120" cy="65" r="14" class="topo-node-center" />
              <text x="120" y="69" text-anchor="middle" class="topo-center-label">SW</text>
            </svg>
          </div>

          <p class="topo-card-desc" data-i18n="star_desc">
            Cada nodo se conecta independientemente a un conmutador (Switch) o concentrador central. Si un cable o estación falla, el resto de la red sigue operando sin interrupción.
          </p>

          <div class="topo-points">
            <div class="topo-point-item pro">
              <span class="topo-point-bullet mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
              <span data-i18n="star_pro">Fácil de diagnosticar y agregar nuevos nodos sin detener la red.</span>
            </div>
            <div class="topo-point-item con">
              <span class="topo-point-bullet mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>
              <span data-i18n="star_con">Punto único de fallo: si el switch central falla, toda la red cae.</span>
            </div>
          </div>

          <div class="topo-footer-tag">
            <span class="topo-tag-label" data-i18n="lbl_typical_use">Uso común:</span>
            <span data-i18n="star_use">Redes Ethernet modernas, oficinas corporativas y routers domésticos Wi-Fi.</span>
          </div>
        </article>

        <!-- 2. Topología en Bus -->
        <article class="topology-card">
          <div class="topo-card-header">
            <span class="card-icon mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="2" y1="12" x2="22" y2="12" stroke-width="3"></line><circle cx="5" cy="6" r="2"></circle><circle cx="12" cy="6" r="2"></circle><circle cx="19" cy="6" r="2"></circle><line x1="5" y1="8" x2="5" y2="12"></line><line x1="12" y1="8" x2="12" y2="12"></line><line x1="19" y1="8" x2="19" y2="12"></line></svg></span>
            <div>
              <h3 class="topo-card-title" data-i18n="bus_title">Topología en Bus</h3>
              <span class="topo-badge" data-i18n="bus_badge">Canal Compartido // Troncal</span>
            </div>
          </div>

          <div class="topo-diagram-wrap" aria-label="Diagrama Topología en Bus" data-i18n-title="red_topo_aria_bus">
            <svg width="240" height="130" class="topo-svg" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
              <rect x="18" y="59" width="8" height="12" class="topo-terminator" />
              <rect x="214" y="59" width="8" height="12" class="topo-terminator" />
              <line x1="26" y1="65" x2="214" y2="65" class="topo-line-thick" />
              <line x1="55" y1="65" x2="55" y2="28" class="topo-line" />
              <line x1="100" y1="65" x2="100" y2="102" class="topo-line" />
              <line x1="145" y1="65" x2="145" y2="28" class="topo-line" />
              <line x1="190" y1="65" x2="190" y2="102" class="topo-line" />
              <circle cx="55" cy="24" r="9" class="topo-node" />
              <circle cx="100" cy="106" r="9" class="topo-node" />
              <circle cx="145" cy="24" r="9" class="topo-node" />
              <circle cx="190" cy="106" r="9" class="topo-node" />
            </svg>
          </div>

          <p class="topo-card-desc" data-i18n="bus_desc">
            Todos los dispositivos se conectan a un único cable troncal compartido (backbone). Requiere resistencias terminadoras en ambos extremos para absorber las señales y evitar reflexiones.
          </p>

          <div class="topo-points">
            <div class="topo-point-item pro">
              <span class="topo-point-bullet mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
              <span data-i18n="bus_pro">Bajo costo de instalación y menor consumo de cableado físico.</span>
            </div>
            <div class="topo-point-item con">
              <span class="topo-point-bullet mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>
              <span data-i18n="bus_con">Una rotura en el cable troncal deja inoperativa toda la red (alta probabilidad de colisiones).</span>
            </div>
          </div>

          <div class="topo-footer-tag">
            <span class="topo-tag-label" data-i18n="lbl_typical_use">Uso común:</span>
            <span data-i18n="bus_use">Redes automotrices (CAN bus), instrumentación industrial y Ethernet histórica 10BASE2.</span>
          </div>
        </article>

        <!-- 3. Topología en Anillo -->
        <article class="topology-card">
          <div class="topo-card-header">
            <span class="card-icon mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8" stroke-dasharray="6 3"></circle><circle cx="12" cy="4" r="2"></circle><circle cx="20" cy="12" r="2"></circle><circle cx="12" cy="20" r="2"></circle><circle cx="4" cy="12" r="2"></circle></svg></span>
            <div>
              <h3 class="topo-card-title" data-i18n="ring_title">Topología en Anillo (Ring)</h3>
              <span class="topo-badge" data-i18n="ring_badge">Bucle Cerrado // Paso de Token</span>
            </div>
          </div>

          <div class="topo-diagram-wrap" aria-label="Diagrama Topología en Anillo" data-i18n-title="red_topo_aria_ring">
            <svg width="240" height="130" class="topo-svg" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="120" cy="65" rx="65" ry="42" class="topo-ring-path" />
              <circle cx="120" cy="23" r="9" class="topo-node" />
              <circle cx="180" cy="46" r="9" class="topo-node" />
              <circle cx="165" cy="95" r="9" class="topo-node" />
              <circle cx="75" cy="95" r="9" class="topo-node" />
              <circle cx="60" cy="46" r="9" class="topo-node" />
              <polygon points="126,20 134,23 126,26" fill="#38bdf8" />
            </svg>
          </div>

          <p class="topo-card-desc" data-i18n="ring_desc">
            Cada estación se conecta a dos vecinas formando un circuito cerrado. Los datos viajan secuencialmente en un único sentido mediante un testigo o 'token' lógico para evitar colisiones.
          </p>

          <div class="topo-points">
            <div class="topo-point-item pro">
              <span class="topo-point-bullet mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
              <span data-i18n="ring_pro">Sin colisiones de paquetes; rendimiento regular y predecible bajo alto tráfico.</span>
            </div>
            <div class="topo-point-item con">
              <span class="topo-point-bullet mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>
              <span data-i18n="ring_con">La desconexión o fallo de un equipo interrumpe todo el ciclo de transmisión.</span>
            </div>
          </div>

          <div class="topo-footer-tag">
            <span class="topo-tag-label" data-i18n="lbl_typical_use">Uso común:</span>
            <span data-i18n="ring_use">Redes metropolitanas de fibra óptica (FDDI, SONET/SDH) e histórica Token Ring.</span>
          </div>
        </article>

        <!-- 4. Topología en Malla -->
        <article class="topology-card">
          <div class="topo-card-header">
            <span class="card-icon mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"></polygon><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="8.5" x2="22" y2="15.5"></line><line x1="2" y1="15.5" x2="22" y2="8.5"></line></svg></span>
            <div>
              <h3 class="topo-card-title" data-i18n="mesh_title">Topología en Malla (Mesh)</h3>
              <span class="topo-badge" data-i18n="mesh_badge">Redundancia Total // Alta Disponibilidad</span>
            </div>
          </div>

          <div class="topo-diagram-wrap" aria-label="Diagrama Topología en Malla" data-i18n-title="red_topo_aria_mesh">
            <svg width="240" height="130" class="topo-svg" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
              <polygon points="120,20 185,50 160,110 80,110 55,50" class="topo-line-poly" />
              <line x1="120" y1="20" x2="160" y2="110" class="topo-line" />
              <line x1="120" y1="20" x2="80" y2="110" class="topo-line" />
              <line x1="55" y1="50" x2="185" y2="50" class="topo-line" />
              <line x1="55" y1="50" x2="160" y2="110" class="topo-line" />
              <line x1="185" y1="50" x2="80" y2="110" class="topo-line" />
              <circle cx="120" cy="20" r="9" class="topo-node" />
              <circle cx="185" cy="50" r="9" class="topo-node" />
              <circle cx="160" cy="110" r="9" class="topo-node" />
              <circle cx="80" cy="110" r="9" class="topo-node" />
              <circle cx="55" cy="50" r="9" class="topo-node" />
            </svg>
          </div>

          <p class="topo-card-desc" data-i18n="mesh_desc">
            Cada nodo cuenta con conexiones directas punto a punto con múltiples o todos los demás nodos de la red. Ofrece múltiples rutas dinámicas para transportar cada paquete de información.
          </p>

          <div class="topo-points">
            <div class="topo-point-item pro">
              <span class="topo-point-bullet mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
              <span data-i18n="mesh_pro">Máxima tolerancia a fallos: si un enlace se corta, el tráfico se redirige al instante.</span>
            </div>
            <div class="topo-point-item con">
              <span class="topo-point-bullet mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>
              <span data-i18n="mesh_con">Elevado coste en cableado, interfaces físicas y complejidad de ruteo.</span>
            </div>
          </div>

          <div class="topo-footer-tag">
            <span class="topo-tag-label" data-i18n="lbl_typical_use">Uso común:</span>
            <span data-i18n="mesh_use">Infraestructura troncal de Internet (Backbone Tier-1), centros de datos y redes Wi-Fi Mesh.</span>
          </div>
        </article>

        <!-- 5. Topología en Árbol -->
        <article class="topology-card">
          <div class="topo-card-header">
            <span class="card-icon mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="4" r="2"></circle><circle cx="6" cy="12" r="2"></circle><circle cx="18" cy="12" r="2"></circle><circle cx="3" cy="20" r="2"></circle><circle cx="9" cy="20" r="2"></circle><line x1="12" y1="6" x2="6" y2="10"></line><line x1="12" y1="6" x2="18" y2="10"></line><line x1="6" y1="14" x2="3" y2="18"></line><line x1="6" y1="14" x2="9" y2="18"></line></svg></span>
            <div>
              <h3 class="topo-card-title" data-i18n="tree_title">Topología en Árbol (Tree)</h3>
              <span class="topo-badge" data-i18n="tree_badge">Estructura Jerárquica // Multinivel</span>
            </div>
          </div>

          <div class="topo-diagram-wrap" aria-label="Diagrama Topología en Árbol" data-i18n-title="red_topo_aria_tree">
            <svg width="240" height="130" class="topo-svg" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
              <line x1="120" y1="22" x2="70" y2="65" class="topo-line" />
              <line x1="120" y1="22" x2="170" y2="65" class="topo-line" />
              <line x1="70" y1="65" x2="40" y2="108" class="topo-line" />
              <line x1="70" y1="65" x2="95" y2="108" class="topo-line" />
              <line x1="170" y1="65" x2="145" y2="108" class="topo-line" />
              <line x1="170" y1="65" x2="200" y2="108" class="topo-line" />
              <circle cx="120" cy="22" r="11" class="topo-node-center" />
              <circle cx="70" cy="65" r="9" class="topo-node-accent" />
              <circle cx="170" cy="65" r="9" class="topo-node-accent" />
              <circle cx="40" cy="108" r="7.5" class="topo-node" />
              <circle cx="95" cy="108" r="7.5" class="topo-node" />
              <circle cx="145" cy="108" r="7.5" class="topo-node" />
              <circle cx="200" cy="108" r="7.5" class="topo-node" />
            </svg>
          </div>

          <p class="topo-card-desc" data-i18n="tree_desc">
            Organiza los dispositivos en diferentes niveles jerárquicos (Núcleo, Distribución y Acceso). Es una combinación estructurada de múltiples estrellas conectadas a un conmutador principal.
          </p>

          <div class="topo-points">
            <div class="topo-point-item pro">
              <span class="topo-point-bullet mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
              <span data-i18n="tree_pro">Gran escalabilidad, facilita el aislamiento de subredes y la gestión por departamentos.</span>
            </div>
            <div class="topo-point-item con">
              <span class="topo-point-bullet mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>
              <span data-i18n="tree_con">Si el nodo raíz principal falla, las ramas subordinadas pierden conectividad entre sí.</span>
            </div>
          </div>

          <div class="topo-footer-tag">
            <span class="topo-tag-label" data-i18n="lbl_typical_use">Uso común:</span>
            <span data-i18n="tree_use">Redes de campus universitarios, edificios corporativos y redes de televisión por cable.</span>
          </div>
        </article>

        <!-- 6. Topología Híbrida / Mixta -->
        <article class="topology-card">
          <div class="topo-card-header">
            <span class="card-icon mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg></span>
            <div>
              <h3 class="topo-card-title" data-i18n="hybrid_title">Topología Híbrida (Mixta)</h3>
              <span class="topo-badge" data-i18n="hybrid_badge">Combinación Adaptativa // Flexible</span>
            </div>
          </div>

          <div class="topo-diagram-wrap" aria-label="Diagrama Topología Híbrida" data-i18n-title="red_topo_aria_hybrid">
            <svg width="240" height="130" class="topo-svg" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
              <line x1="75" y1="65" x2="165" y2="65" class="topo-line-dash" />
              <line x1="75" y1="65" x2="40" y2="35" class="topo-line" />
              <line x1="75" y1="65" x2="40" y2="95" class="topo-line" />
              <line x1="75" y1="65" x2="90" y2="25" class="topo-line" />
              <circle cx="40" cy="35" r="7.5" class="topo-node" />
              <circle cx="40" cy="95" r="7.5" class="topo-node" />
              <circle cx="90" cy="25" r="7.5" class="topo-node" />
              <circle cx="75" cy="65" r="11" class="topo-node-center" />
              <ellipse cx="165" cy="65" rx="30" ry="26" class="topo-ring-path" />
              <circle cx="165" cy="39" r="7" class="topo-node" />
              <circle cx="195" cy="65" r="7" class="topo-node" />
              <circle cx="165" cy="91" r="7" class="topo-node" />
              <circle cx="135" cy="65" r="7.5" class="topo-node-accent" />
            </svg>
          </div>

          <p class="topo-card-desc" data-i18n="hybrid_desc">
            Fusión de dos o más topologías distintas (por ejemplo, estrella-anillo o estrella-bus) en una misma red. Permite adaptar la arquitectura física a las necesidades geográficas de cada sector.
          </p>

          <div class="topo-points">
            <div class="topo-point-item pro">
              <span class="topo-point-bullet mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
              <span data-i18n="hybrid_pro">Máxima flexibilidad: aprovecha las virtudes de cada topología según cada área de la empresa.</span>
            </div>
            <div class="topo-point-item con">
              <span class="topo-point-bullet mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>
              <span data-i18n="hybrid_con">Diseño y mantenimiento complejos; requiere dispositivos de interconexión avanzados.</span>
            </div>
          </div>

          <div class="topo-footer-tag">
            <span class="topo-tag-label" data-i18n="lbl_typical_use">Uso común:</span>
            <span data-i18n="hybrid_use">Grandes organizaciones multinacionales, redes bancarias y enlaces nube con sedes locales.</span>
          </div>
        </article>
      </div>
    </section>

    <!-- Redes Challenge: juego de topologías -->
    



  

  
  <!-- Sección de comentarios de Redes: misma vista compartida, filtrada por pagina 'redes' -->
  <?php include __DIR__ . '/includes/comentarios.php'; ?>
</main>

  <!-- Footer -->
    <?php include __DIR__ . '/includes/footer.php'; ?>

  <!-- Script interactivo bilingüe y menú móvil -->
  
  
  
  
  
  
  
  <script src="frontend/js/interfaz.js"></script>
</body>
</html>
