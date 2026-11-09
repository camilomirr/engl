/* =========================================================
   BUSCADOR DE NVISION
   Índice curado de los temas del sitio: al escribir, muestra
   resultados en vivo y cada uno lleva directo a su sección.
   Vive en el encabezado de TODAS las páginas (botón lupa) y
   también en la página principal, debajo de los botones.
   Bilingüe ES/EN: busca en los dos idiomas a la vez.
   ========================================================= */
(function () {
  'use strict';

  // t: [es, en] — título; d: [es, en] — descripción corta;
  // k: palabras clave (en los dos idiomas); u: enlace; p: [es, en] — página.
  var INDEX = [
    { t: ['Historia de los computadores', 'History of computers'], d: ['De ENIAC al Apple II y al Altair: cómo nació la computación.', 'From ENIAC to the Apple II and the Altair: how computing began.'], k: 'historia eniac apple altair ibm pioneros línea tiempo evolution history pioneers timeline', u: 'hardware.html#historia', p: ['Hardware', 'Hardware'] },
    { t: ['Componentes del computador', 'Computer components'], d: ['CPU, RAM, placa base, GPU, fuente, disco y más: qué hace cada pieza.', 'CPU, RAM, motherboard, GPU, PSU, storage and more: what each part does.'], k: 'componentes piezas cpu ram gpu placa fuente disco tarjeta red refrigeración parts components motherboard psu storage nic cooling', u: 'hardware.html#componentes', p: ['Hardware', 'Hardware'] },
    { t: ['Procesador (CPU)', 'Processor (CPU)'], d: ['El cerebro del equipo: núcleos, velocidad y qué hace el procesador.', 'The brain of the machine: cores, speed, and what the processor does.'], k: 'procesador cpu núcleos cores ghz processor', u: 'hardware.html#card-cpu', p: ['Hardware', 'Hardware'] },
    { t: ['Memoria RAM', 'RAM memory'], d: ['La memoria de trabajo: qué es la RAM, los módulos DIMM y cuánta necesitas.', 'The working memory: what RAM is, DIMM modules, and how much you need.'], k: 'ram memoria memory ddr módulos dimm', u: 'hardware.html#card-ram', p: ['Hardware', 'Hardware'] },
    { t: ['Tarjeta gráfica (GPU)', 'Graphics card (GPU)'], d: ['La encargada de los gráficos y los videojuegos.', 'The part in charge of graphics and video games.'], k: 'gpu gráfica graphics video juegos tarjeta', u: 'hardware.html#card-gpu', p: ['Hardware', 'Hardware'] },
    { t: ['Placa base', 'Motherboard'], d: ['Donde se conecta todo: socket, chipset y ranuras de la placa.', 'Where everything connects: socket, chipset, and board slots.'], k: 'placa base motherboard socket chipset bios', u: 'hardware.html#card-mb', p: ['Hardware', 'Hardware'] },
    { t: ['Fuente de poder', 'Power supply'], d: ['Convierte la corriente de la pared en energía segura para las piezas.', 'Turns wall power into safe energy for the parts.'], k: 'fuente poder psu power watts energía vatios', u: 'hardware.html#card-psu', p: ['Hardware', 'Hardware'] },
    { t: ['Almacenamiento (SSD / HDD)', 'Storage (SSD / HDD)'], d: ['Dónde vive el sistema y tus archivos: SSD, HDD y NVMe.', 'Where the system and your files live: SSD, HDD, and NVMe.'], k: 'disco ssd hdd almacenamiento storage nvme duro', u: 'hardware.html#card-storage', p: ['Hardware', 'Hardware'] },
    { t: ['Tarjeta de red', 'Network card'], d: ['La pieza que conecta tu PC a la red por cable o WiFi.', 'The part that connects your PC to the network, wired or wireless.'], k: 'tarjeta red nic ethernet adaptador network card', u: 'hardware.html#card-nic', p: ['Hardware', 'Hardware'] },
    { t: ['Refrigeración', 'Cooling'], d: ['Ventiladores y disipadores: cómo se mantiene frío el equipo.', 'Fans and heatsinks: how the machine stays cool.'], k: 'ventilador refrigeración cooling fan disipador aire', u: 'hardware.html#card-cooling', p: ['Hardware', 'Hardware'] },
    { t: ['Del hardware a la red', 'From hardware to the network'], d: ['Cómo los computadores se conectan entre sí para formar una red.', 'How computers connect to each other to form a network.'], k: 'redes networks conexión internet conexión', u: 'redes.html#redes', p: ['Redes', 'Networks'] },
    { t: ['Clasificación de redes: LAN, WAN, MAN…', 'Network types: LAN, WAN, MAN…'], d: ['PAN, LAN, CAN, MAN, WAN y GAN según su cobertura.', 'PAN, LAN, CAN, MAN, WAN, and GAN by their coverage.'], k: 'lan wan man pan can gan clasificación tipos cobertura types scope', u: 'redes.html#alcance-redes', p: ['Redes', 'Networks'] },
    { t: ['Topologías de red', 'Network topologies'], d: ['Estrella, bus, anillo, malla, árbol e híbrida: cómo se organiza una red.', 'Star, bus, ring, mesh, tree, and hybrid: how a network is organized.'], k: 'topología topologías estrella bus anillo malla árbol híbrida topologies star ring mesh tree hybrid', u: 'redes.html#topologias', p: ['Redes', 'Networks'] },
    { t: ['Simulador de ping', 'Ping simulator'], d: ['Mira cómo viaja un paquete de un equipo a otro en tiempo real.', 'Watch a packet travel from one machine to another in real time.'], k: 'ping simulador paquetes icmp simulator packets', u: 'redes.html#simulador-red', p: ['Redes', 'Networks'] },
    { t: ['El switch por dentro', 'Inside the switch'], d: ['Cómo el switch aprende las MAC y reenvía las tramas solo a su destino.', 'How the switch learns MAC addresses and forwards frames only to their destination.'], k: 'switch conmutador mac tabla tramas frames hub', u: 'redes.html#switch-3d', p: ['Redes', 'Networks'] },
    { t: ['Reto de Redes (juego)', 'Networks Challenge (game)'], d: ['Juega estilo Kahoot: responde contra el tiempo y entra al TOP 5.', 'Play Kahoot-style: answer against the clock and reach the TOP 5.'], k: 'juego reto kahoot quiz puntos top game challenge', u: 'redes_challenge/index.html', p: ['Reto de Redes', 'Networks Challenge'] },
    { t: ['WiFi avanzado', 'Advanced WiFi'], d: ['El router, la señal inalámbrica y cómo funciona el WiFi paso a paso.', 'The router, the wireless signal, and how WiFi works step by step.'], k: 'wifi router señal inalámbrica wireless signal', u: 'wifi.html', p: ['WiFi', 'WiFi'] },
    { t: ['Cómo instalar el módem', 'How to install the modem'], d: ['Guía paso a paso para instalar y configurar tu módem.', 'Step-by-step guide to install and set up your modem.'], k: 'módem modem instalar instalación router install setup configurar', u: 'wifi.html#instalar-modem', p: ['WiFi', 'WiFi'] },
    { t: ['Glosario técnico', 'Technical glossary'], d: ['Los términos de hardware y redes explicados en pocas palabras.', 'Hardware and networking terms explained in a few words.'], k: 'glosario términos definiciones glossary terms dictionary', u: 'recursos.html#glosario', p: ['Recursos', 'Resources'] },
    { t: ['Laboratorio de códigos', 'Code lab'], d: ['Comandos de red para practicar: ping, ipconfig, arp y más.', 'Networking commands to practice: ping, ipconfig, arp, and more.'], k: 'laboratorio códigos ping ip comandos laboratory code commands consola', u: 'recursos.html#laboratorio', p: ['Recursos', 'Resources'] },
    { t: ['Mantenimiento por software', 'Software maintenance'], d: ['Actualizaciones, antivirus, limpieza y copias de seguridad.', 'Updates, antivirus, cleanup, and backups.'], k: 'mantenimiento software actualizaciones antivirus limpieza copias seguridad maintenance updates antivirus cleanup backup', u: 'mantenimiento-software.html', p: ['Recursos', 'Resources'] },
    { t: ['Rutina de mantenimiento', 'Maintenance routine'], d: ['La rutina diaria, semanal y mensual para que tu equipo no falle.', 'The daily, weekly, and monthly routine to keep your machine healthy.'], k: 'rutina mantenimiento diaria semanal mensual maintenance routine', u: 'mantenimiento-software.html#rutina', p: ['Recursos', 'Resources'] },
    { t: ['Programas y actualizaciones', 'Programs and updates'], d: ['Qué programas instalar y cómo mantenerlos al día.', 'Which programs to install and how to keep them up to date.'], k: 'programas aplicaciones actualizaciones drivers software programs apps', u: 'mantenimiento-software.html#programas', p: ['Recursos', 'Resources'] },
    { t: ['Visor 3D del PC', '3D PC viewer'], d: ['Arma y desarma un computador pieza por pieza en 3D.', 'Build and take apart a computer piece by piece in 3D.'], k: 'visor 3d armar desarmar piezas interactivo viewer build take apart', u: 'pc3d.html#visor-3d', p: ['PC 3D', '3D PC'] },
    { t: ['Componentes en 3D', 'Components in 3D'], d: ['Cada pieza del PC explicada con sus tipos y su función.', 'Each PC part explained with its types and function.'], k: 'componentes tipos 3d parts types', u: 'pc3d.html#componentes-3d', p: ['PC 3D', '3D PC'] },
    { t: ['Mantenimiento del PC', 'PC maintenance'], d: ['Limpieza, polvo y aire comprimido: cómo cuidar tu equipo por dentro.', 'Cleaning, dust, and compressed air: how to care for your machine inside.'], k: 'mantenimiento limpieza polvo aire comprimido maintenance cleaning dust', u: 'pc3d.html#mantenimiento', p: ['PC 3D', '3D PC'] },
    { t: ['Seguridad digital y malware', 'Digital security and malware'], d: ['Virus, ransomware y phishing: cómo entran y cómo protegerte.', 'Viruses, ransomware, and phishing: how they get in and how to protect yourself.'], k: 'malware virus ransomware seguridad troyano phishing seguridad digital security trojan', u: 'pc3d.html#malware', p: ['PC 3D', '3D PC'] },
    { t: ['Taller de PC (simulador)', 'PC Workshop (simulator)'], d: ['Compra piezas, atiende pedidos de clientes y enciende el equipo.', 'Buy parts, serve customer orders, and power the machine on.'], k: 'taller simulador armar pedidos clientes tienda workshop simulator orders shop', u: 'workshop/index.html', p: ['Taller', 'Workshop'] },
    { t: ['Herramientas de redes', 'Network tools'], d: ['Calculadora de subredes y conversor entre binario, decimal y hexadecimal.', 'Subnet calculator and converter between binary, decimal and hexadecimal.'], k: 'subred subnet calculadora cidr mascara mask broadcast conversor binario hexadecimal binary hex converter ip', u: 'redes.html#herramientas', p: ['Redes', 'Networks'] },
    { t: ['Ruta de aprendizaje', 'Learning path'], d: ['El camino paso a paso para recorrer todo NVISION, con tu progreso guardado.', 'The step-by-step path through all of NVISION, with your progress saved.'], k: 'ruta aprendizaje camino pasos progreso guia learning path steps progress guide empezar start', u: 'ruta.html', p: ['Recursos', 'Resources'] },
    { t: ['Exámenes y certificados', 'Exams & certificates'], d: ['Exámenes de hardware, redes, mantenimiento y WiFi, con certificado al aprobar.', 'Hardware, networks, maintenance and WiFi exams, with a certificate when you pass.'], k: 'examen examenes quiz prueba certificado diploma test exam certificate', u: 'examenes.html', p: ['Recursos', 'Resources'] },
    { t: ['Mi cuenta', 'My account'], d: ['Guarda tu progreso en la nube y recupéralo en cualquier equipo.', 'Save your progress to the cloud and get it back on any device.'], k: 'cuenta usuario login registro sesion account user sign register sync sincronizar nube cloud', u: 'cuenta.html', p: ['Cuenta', 'Account'] },
  ];

  var MAX_RESULTS = 8;

  // Los enlaces del índice son relativos a la raíz del sitio. Desde las
  // subcarpetas (workshop/, redes_challenge/) hay que subir un nivel para
  // que los resultados no apunten a workshop/hardware.html y similares.
  var IN_SUBFOLDER = window.location.pathname.indexOf('/workshop/') !== -1 ||
    window.location.pathname.indexOf('/redes_challenge/') !== -1;
  var LINK_PREFIX = IN_SUBFOLDER ? '../' : '';
  function resolveLink(u) { return LINK_PREFIX + u; }

  function langIndex() {
    return document.documentElement.lang === 'en' ? 1 : 0;
  }

  function t(key) {
    try {
      if (typeof translations !== 'undefined' && translations) {
        var l = langIndex() === 1 ? 'en' : 'es';
        if (translations[l] && translations[l][key]) return translations[l][key];
        if (translations.es && translations.es[key]) return translations.es[key];
      }
    } catch (e) { /* cae al respaldo */ }
    var fallback = {
      search_no_results: 'No encontré nada sobre eso. Prueba con otra palabra o pregúntale al Asistente NVISION.',
      search_placeholder: 'Busca en todo NVISION: RAM, topologías, WiFi, malware…'
    };
    return fallback[key] || key;
  }

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function tokens(s) {
    return norm(s).split(/[^a-z0-9]+/).filter(Boolean);
  }

  // La palabra coincide si es igual a una palabra del texto o es su inicio
  // ("red" encuentra "redes", pero "ram" no encuentra "programas").
  function wordMatches(toks, w) {
    for (var i = 0; i < toks.length; i++) {
      if (toks[i] === w || toks[i].indexOf(w) === 0) return true;
    }
    return false;
  }

  function search(query) {
    var words = norm(query).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    var scored = [];
    INDEX.forEach(function (item) {
      var titleToks = tokens(item.t[0] + ' ' + item.t[1]);
      var descToks = tokens(item.d[0] + ' ' + item.d[1]);
      var keysToks = tokens(item.k);
      var pageToks = tokens(item.p[0] + ' ' + item.p[1]);
      var allToks = titleToks.concat(descToks, keysToks, pageToks);
      var score = 0;
      for (var i = 0; i < words.length; i++) {
        var w = words[i];
        if (!wordMatches(allToks, w)) return; // todas las palabras deben aparecer
        if (wordMatches(titleToks, w)) score += 3;
        else if (wordMatches(keysToks, w)) score += 2;
        else if (wordMatches(descToks, w)) score += 1;
        if (wordMatches(pageToks, w)) score += 1;
      }
      scored.push({ item: item, score: score });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, MAX_RESULTS).map(function (s) { return s.item; });
  }

  // Conecta un bloque de búsqueda (formulario + campo + resultados + limpiar).
  // Se usa para el buscador del inicio y para el del encabezado: los dos
  // comparten el mismo índice y los mismos resultados.
  var wiredInputs = [];

  function wireSearch(form, input, resultsBox, clearBtn) {
    if (!input || !resultsBox || !form) return;

    var activeIndex = -1;

    function closeResults() {
      resultsBox.classList.remove('open');
      resultsBox.innerHTML = '';
      activeIndex = -1;
    }

    function render(results, query) {
      var li = langIndex();
      resultsBox.innerHTML = '';
      if (!results.length) {
        var empty = document.createElement('div');
        empty.className = 'site-search-empty';
        empty.textContent = t('search_no_results');
        resultsBox.appendChild(empty);
      } else {
        results.forEach(function (item) {
          var a = document.createElement('a');
          a.className = 'site-search-result';
          a.href = resolveLink(item.u);
          var top = document.createElement('span');
          top.className = 'site-search-result-top';
          var title = document.createElement('span');
          title.className = 'site-search-result-title';
          title.textContent = item.t[li];
          var page = document.createElement('span');
          page.className = 'site-search-result-page';
          page.textContent = item.p[li];
          top.appendChild(title);
          top.appendChild(page);
          var desc = document.createElement('span');
          desc.className = 'site-search-result-desc';
          desc.textContent = item.d[li];
          a.appendChild(top);
          a.appendChild(desc);
          resultsBox.appendChild(a);
        });
      }
      resultsBox.classList.add('open');
      activeIndex = -1;
    }

    function run() {
      var q = input.value.trim();
      if (clearBtn) clearBtn.classList.toggle('visible', q.length > 0);
      if (q.length < 2) { closeResults(); return; }
      render(search(q), q);
    }

    function moveActive(delta) {
      var items = resultsBox.querySelectorAll('.site-search-result');
      if (!items.length) return;
      activeIndex = (activeIndex + delta + items.length) % items.length;
      items.forEach(function (el, i) {
        el.classList.toggle('active', i === activeIndex);
      });
      if (items[activeIndex] && items[activeIndex].scrollIntoView) {
        items[activeIndex].scrollIntoView({ block: 'nearest' });
      }
    }

    input.addEventListener('input', run);

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1); }
      else if (e.key === 'Enter') {
        var items = resultsBox.querySelectorAll('.site-search-result');
        var target = activeIndex >= 0 ? items[activeIndex] : items[0];
        if (target) { e.preventDefault(); window.location.href = target.getAttribute('href'); }
      } else if (e.key === 'Escape') { closeResults(); input.blur(); }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var items = resultsBox.querySelectorAll('.site-search-result');
      if (items.length) window.location.href = items[0].getAttribute('href');
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        input.value = '';
        run();
        input.focus();
      });
    }

    document.addEventListener('click', function (e) {
      if (!e.target.closest || !e.target.closest('.site-search, .header-search')) closeResults();
    });

    wiredInputs.push({ input: input, run: run });
  }

  function init() {
    // Buscador del inicio (debajo de los botones del hero)
    wireSearch(
      document.getElementById('site-search-form'),
      document.getElementById('site-search-input'),
      document.getElementById('site-search-results'),
      document.getElementById('site-search-clear')
    );
    // Buscador desplegable del encabezado (botón lupa)
    wireSearch(
      document.getElementById('header-search-form'),
      document.getElementById('header-search-input'),
      document.getElementById('header-search-results'),
      document.getElementById('header-search-clear')
    );

    // Las sugerencias populares llenan el buscador de su propio bloque.
    document.querySelectorAll('.site-search-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var scope = chip.closest('.site-search') || chip.closest('.header-search') || document;
        var target = scope.querySelector('input[type="search"]');
        if (!target) return;
        target.value = chip.getAttribute('data-q') || chip.textContent;
        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.focus();
      });
    });

    // Botón lupa del encabezado: despliega / cierra la barra de búsqueda.
    var toggleBtn = document.getElementById('header-search-toggle');
    var panel = document.getElementById('header-search-panel');
    var headerInput = document.getElementById('header-search-input');
    if (toggleBtn && panel) {
      function closePanel() {
        panel.classList.remove('open');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
      function openPanel() {
        panel.classList.add('open');
        toggleBtn.classList.add('active');
        toggleBtn.setAttribute('aria-expanded', 'true');
        if (headerInput) headerInput.focus();
      }
      toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (panel.classList.contains('open')) closePanel();
        else openPanel();
      });
      document.addEventListener('click', function (e) {
        if (!panel.classList.contains('open')) return;
        if (e.target.closest && (e.target.closest('#header-search-panel') || e.target.closest('#header-search-toggle'))) return;
        closePanel();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && panel.classList.contains('open')) {
          closePanel();
          if (headerInput) headerInput.blur();
          toggleBtn.focus();
        }
      });
    }

    // Si cambia el idioma, se re-renderizan los resultados con ese idioma.
    if (window.MutationObserver) {
      new MutationObserver(function () {
        wiredInputs.forEach(function (w) {
          if (w.input.value.trim().length >= 2) w.run();
        });
      }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
