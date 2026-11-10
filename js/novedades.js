// NVISION · Novedades: el registro de cambios del sitio, del más
// reciente al más antiguo. Para anunciar algo nuevo, el equipo agrega
// una entrada al principio de ENTRIES (fecha, etiqueta, título, texto).
(function () {
  'use strict';
  var box = document.getElementById('nov-list');
  if (!box) return;
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var ENTRIES = [
    { d: '2026-11-09', tag: { es: 'Funciones', en: 'Features' },
      t: { es: 'Diez mejoras nuevas', en: 'Ten new improvements' },
      x: { es: 'Llegan el simulador de topologías de red, el quiz en vivo con código de sala, certificados con código QR, la gráfica de progreso en Mi cuenta, el repaso inteligente con repetición espaciada, el modo entrevista técnica, el reto de la semana, el ranking semanal, esta página de novedades y los controles de accesibilidad (tamaño de letra y alto contraste).', en: 'Welcome the network topology simulator, the live quiz with room codes, QR-code certificates, the progress chart in My account, smart spaced-repetition review, the technical interview mode, the weekly challenge, the weekly ranking, this news page and the accessibility controls (font size and high contrast).' } },
    { d: '2026-11-09', tag: { es: 'Seguridad', en: 'Security' },
      t: { es: 'Auditoría de seguridad y validación', en: 'Security audit and validation' },
      x: { es: 'Se auditó todo el sitio, se cerró una vía de XSS almacenado en los avatares del ranking y se estrenó una capa de validación compartida que sanea nombres, puntajes y códigos en todo NVISION.', en: 'The whole site was audited, a stored-XSS path in ranking avatars was closed and a shared validation layer now sanitizes names, scores and codes across NVISION.' } },
    { d: '2026-11-09', tag: { es: 'Funciones', en: 'Features' },
      t: { es: 'Diez funciones de aprendizaje', en: 'Ten learning features' },
      x: { es: 'Certificados verificables, pregunta del día con racha, juego de cableado T568A/B, terminal simulada con misiones, comparador de componentes, inglés técnico con audio, asistente con voz, perfil público, modo práctica en exámenes y bloc de apuntes sincronizado.', en: 'Verifiable certificates, daily question with streaks, T568A/B wiring game, simulated terminal with missions, component comparator, technical English with audio, voice assistant, public profiles, exam practice mode and synced notes.' } },
    { d: '2026-11-09', tag: { es: 'Equipo', en: 'Team' },
      t: { es: 'Visor PC 3D', en: 'PC 3D viewer' },
      x: { es: 'El equipo estrenó pc3d.html, un visor tridimensional para explorar los componentes del computador.', en: 'The team launched pc3d.html, a three-dimensional viewer to explore the computer components.' } },
    { d: '2026-11-09', tag: { es: 'Cuentas', en: 'Accounts' },
      t: { es: 'Avatares por roles técnicos', en: 'Technical-role avatars' },
      x: { es: 'Los avatares de cuenta ahora son personas con roles: Programador, Redes, Electricista, Mantenimiento, Seguridad, Innovación, Gamer, Diseño, Sistemas, Líder, Hacker, Creador y Soporte, además de tu foto o tu inicial.', en: 'Account avatars are now people with roles: Programmer, Networks, Electrician, Maintenance, Security, Innovation, Gamer, Design, Systems, Leader, Hacker, Creator and Support, plus your photo or your initial.' } },
    { d: '2026-11-08', tag: { es: 'Plataforma', en: 'Platform' },
      t: { es: 'SEO, app instalable y página 404', en: 'SEO, installable app and 404 page' },
      x: { es: 'NVISION estrenó metadatos para compartir, favicon, mapa del sitio, página 404 propia y PWA: el sitio se puede instalar como app y abre sin conexión.', en: 'NVISION got sharing metadata, a favicon, a sitemap, a custom 404 page and PWA support: the site can be installed as an app and opens offline.' } },
    { d: '2026-11-08', tag: { es: 'Aprendizaje', en: 'Learning' },
      t: { es: 'Ruta, exámenes con certificado y cuentas', en: 'Learning path, certified exams and accounts' },
      x: { es: 'Nace la ruta de aprendizaje de 11 pasos, los exámenes con certificado descargable y las cuentas NVISION con sincronización en la nube. Los exámenes piden cuenta verificada por el servidor.', en: 'The 11-step learning path, exams with downloadable certificates and NVISION accounts with cloud sync were born. Exams require a server-verified account.' } },
    { d: '2026-11-07', tag: { es: 'Juegos', en: 'Games' },
      t: { es: 'Workshop: arma tu PC', en: 'Workshop: build your PC' },
      x: { es: 'El Workshop abrió sus puertas: catálogo de 88 componentes, tienda, armado paso a paso, encendido con POST y BIOS, instalación de NVISION OS, modo carrera y benchmarks.', en: 'The Workshop opened its doors: an 88-part catalog, a shop, step-by-step assembly, POST and BIOS boot, NVISION OS install, career mode and benchmarks.' } }
  ];
  ENTRIES.forEach(function (e) {
    var card = document.createElement('article');
    card.className = 'nov-card';
    var head = document.createElement('p');
    head.className = 'nov-head';
    var date = document.createElement('time'); date.textContent = e.d;
    var tag = document.createElement('span'); tag.className = 'nov-tag'; tag.textContent = e.tag[lang];
    head.append(date, tag);
    var h = document.createElement('h2'); h.textContent = e.t[lang];
    var p = document.createElement('p'); p.textContent = e.x[lang];
    card.append(head, h, p);
    box.appendChild(card);
  });
})();
