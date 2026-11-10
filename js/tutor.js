// NVISION · NVI-Bot Tutor (2026-11-10, estructura v2 con pestañas)
// Tutor con pistas progresivas que conoce el glosario y la ruta del
// sitio. NUNCA da la respuesta directa de una actividad.
//
// Estructura del panel (pestañas):
//   · Pistas    — selector de tema (detecta el simulador actual y
//                 permite cambiarlo), puntos de nivel y botón de
//                 pista progresiva (3 niveles por tema).
//   · Glosario  — lista buscable de términos; tocar uno muestra su
//                 definición y dónde reforzar en la ruta.
//   · Preguntar — conversación libre: responde SOLO desde el
//                 glosario; si huele a pregunta de examen, entrega
//                 el concepto, no la respuesta.
// Se carga solo en páginas con simuladores (redes, terminal,
// topologia, ruta). Botón propio, abajo a la izquierda.
(function () {
  'use strict';
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';

  var T = {
    es: {
      open: 'Tutor NVI-Bot', title: 'NVI-Bot · Tu tutor',
      tagline: 'Pistas, no respuestas. Tú resuelves.',
      tabHints: 'Pistas', tabGloss: 'Glosario', tabAsk: 'Preguntar',
      topic: 'Tema', hintBtn: 'Dame una pista', hintNext: 'Siguiente pista', hintReset: 'Reiniciar pistas',
      hintDone: 'Ya tienes el concepto clave de este tema. ¡Aplícalo en el simulador!',
      seeGloss: 'Ver el término en el Glosario', unlocked: 'Tus pistas de este tema',
      level: 'Nivel', of: 'de',
      glossPh: 'Buscar un término…', glossPick: 'Toca un término para ver su definición.',
      fromGlossary: 'Del glosario NVISION:', seeRoute: 'Refuerzo en la ruta:',
      askPh: 'Pregunta un término: ping, MAC, RAM…', askBtn: 'Preguntar',
      welcome: 'Hola, soy NVI-Bot. Pregúntame un término del glosario y te lo explico con el contenido del sitio.',
      notFound: 'Ese término no está en mi glosario. Prueba con: ping, switch, router, IP, MAC, DNS, DHCP, RAM, SSD, driver, latencia o topología.',
      examWarn: 'Eso suena a pregunta de examen: no te doy la respuesta, pero sí el concepto. ',
      topics: { ping: 'Simulador Ping', switch: 'El switch por dentro', terminal: 'Terminal de redes', topo: 'Topologías', ruta: 'Ruta de aprendizaje', generic: 'General' },
      ctxLine: 'Detecté que estás en: '
    },
    en: {
      open: 'NVI-Bot Tutor', title: 'NVI-Bot · Your tutor',
      tagline: 'Hints, not answers. You solve it.',
      tabHints: 'Hints', tabGloss: 'Glossary', tabAsk: 'Ask',
      topic: 'Topic', hintBtn: 'Give me a hint', hintNext: 'Next hint', hintReset: 'Reset hints',
      hintDone: 'You already have the key concept for this topic. Apply it in the simulator!',
      seeGloss: 'See the term in the Glossary', unlocked: 'Your hints for this topic',
      level: 'Level', of: 'of',
      glossPh: 'Search a term…', glossPick: 'Tap a term to see its definition.',
      fromGlossary: 'From the NVISION glossary:', seeRoute: 'Reinforce on the path:',
      askPh: 'Ask a term: ping, MAC, RAM…', askBtn: 'Ask',
      welcome: 'Hi, I am NVI-Bot. Ask me a glossary term and I will explain it with the site\'s own content.',
      notFound: 'That term is not in my glossary. Try: ping, switch, router, IP, MAC, DNS, DHCP, RAM, SSD, driver, latency or topology.',
      examWarn: 'That sounds like an exam question: I will not give the answer, but here is the concept. ',
      topics: { ping: 'Ping Simulator', switch: 'Inside the switch', terminal: 'Network terminal', topo: 'Topologies', ruta: 'Learning path', generic: 'General' },
      ctxLine: 'I detected you are in: '
    }
  }[lang];

  function detectedContext() {
    var p = location.pathname, h = location.hash || '';
    if (p.indexOf('redes.html') >= 0) return h.indexOf('switch') >= 0 ? 'switch' : 'ping';
    if (p.indexOf('terminal.html') >= 0) return 'terminal';
    if (p.indexOf('topologia.html') >= 0) return 'topo';
    if (p.indexOf('ruta.html') >= 0) return 'ruta';
    return 'generic';
  }

  var HINTS = {
    ping: {
      es: ['Fíjate primero en la dirección destino: ¿está en tu misma red o en otra? Mira los primeros números de la IP.',
        'Si el destino está en otra red, el paquete necesita pasar por la puerta de enlace (gateway). Sin gateway configurado, el ping no sale de tu red.',
        'Concepto: «ping» envía paquetes ICMP de ida y vuelta. Si responde, hay camino; el tiempo que tarda es la latencia y el TTL baja en cada salto.'],
      en: ['Look at the destination address first: is it on your network or another one? Check the first numbers of the IP.',
        'If the destination is on another network, the packet must go through the gateway. With no gateway set, the ping never leaves your network.',
        'Concept: "ping" sends ICMP packets back and forth. A reply means there is a path; the round-trip time is the latency and the TTL drops at each hop.']
    },
    switch: {
      es: ['Observa la tabla MAC del switch antes de enviar: ¿está vacía? Anota qué pasa con la primera trama.',
        'Cuando el switch no conoce la MAC destino, inunda (flood) todos los puertos. Cuando aprende, ya envía solo al puerto correcto.',
        'Concepto: el switch aprende la MAC de origen de cada trama y la asocia a un puerto en su tabla CAM. Por eso la segunda trama ya no se inunda.'],
      en: ['Watch the switch MAC table before sending: is it empty? Note what happens with the first frame.',
        'When the switch does not know the destination MAC, it floods all ports. Once it learns it, it forwards only to the right port.',
        'Concept: the switch learns the source MAC of each frame and maps it to a port in its CAM table. That is why the second frame is not flooded.']
    },
    terminal: {
      es: ['Lee la misión y subraya el dato que te piden: ¿una dirección, un camino o el estado de un equipo?',
        'Cada comando muestra una pista: ipconfig revela tu IP y gateway; ping prueba alcance; tracert dibuja el camino salto a salto.',
        'Concepto: en la terminal, primero identifica tu equipo (ipconfig), luego prueba el destino (ping) y si falla, busca en qué salto se corta (tracert).'],
      en: ['Read the mission and underline the data you need: an address, a path, or a host status?',
        'Each command shows a clue: ipconfig reveals your IP and gateway; ping tests reachability; tracert draws the path hop by hop.',
        'Concept: in the terminal, first identify your host (ipconfig), then test the destination (ping) and if it fails, find the hop where it stops (tracert).']
    },
    topo: {
      es: ['Cuenta los enlaces: ¿cada equipo tiene un cable propio a un centro, o comparten un mismo cable?',
        'Si un solo equipo central concentra todo, es estrella. Si forman un círculo cerrado, es anillo. Si hay muchos caminos alternos, es malla.',
        'Concepto: la topología es la forma de la red. Estrella = centro único; bus = cable troncal; anillo = ciclo; árbol = niveles; malla = rutas redundantes.'],
      en: ['Count the links: does each device have its own cable to a center, or do they share one cable?',
        'If a single central device concentrates everything, it is a star. A closed circle is a ring. Many alternate paths mean mesh.',
        'Concept: topology is the shape of the network. Star = single center; bus = backbone cable; ring = cycle; tree = levels; mesh = redundant paths.']
    },
    ruta: {
      es: ['La ruta está pensada en orden: cada paso prepara el siguiente. Si algo cuesta, vuelve un paso atrás.',
        'Alterna teoría y práctica: lee el tema, entra al simulador y luego responde la pregunta del día.',
        'Concepto: aprender hardware y redes es como armar un PC: pieza por pieza, probando que cada una funciona antes de seguir.'],
      en: ['The path is designed in order: each step prepares the next one. If something is hard, go one step back.',
        'Mix theory and practice: read the topic, open the simulator, then answer the question of the day.',
        'Concept: learning hardware and networks is like building a PC: piece by piece, testing each one before moving on.']
    },
    generic: {
      es: ['Dime en qué tema estás (hardware, redes, wifi…) y te oriento con el glosario.',
        'Las definiciones del glosario están escritas con ejemplos del sitio: úsalas como primera pista.',
        'Concepto: una buena pista vale más que una respuesta copiada: así el examen se aprueba solo.'],
      en: ['Tell me which topic you are on (hardware, networks, wifi…) and I will guide you with the glossary.',
        'Glossary definitions are written with examples from the site: use them as your first hint.',
        'Concept: a good hint is worth more than a copied answer: that is how the exam passes itself.']
    }
  };

  var GLOSSARY = [
    { k: ['ping', 'icmp'], name: 'Ping', es: 'Comando que envía paquetes ICMP para probar si otro equipo responde y cuánto tarda (latencia).', en: 'Command that sends ICMP packets to test whether another host replies and how long it takes (latency).', r: 'Redes · Simulador Ping' },
    { k: ['switch', 'conmutador'], name: 'Switch', es: 'Dispositivo que conecta equipos de una misma red y reenvía tramas según la dirección MAC, aprendiendo en qué puerto está cada equipo.', en: 'Device that connects hosts on the same network and forwards frames by MAC address, learning which port each host is on.', r: 'Redes · El switch por dentro' },
    { k: ['router', 'enrutador', 'gateway', 'puerta de enlace'], name: 'Router / Gateway', es: 'Equipo que une redes distintas y decide el camino de los paquetes. La puerta de enlace es su dirección dentro de tu red.', en: 'Device that joins different networks and decides packet paths. The gateway is its address inside your network.', r: 'Redes' },
    { k: ['ip', 'dirección ip', 'direccion ip'], name: 'Dirección IP', es: 'Dirección lógica que identifica a cada equipo en la red, por ejemplo 192.168.1.10. La 127.0.0.1 siempre es el propio equipo (loopback).', en: 'Logical address that identifies each host on the network, e.g. 192.168.1.10. 127.0.0.1 is always the host itself (loopback).', r: 'Redes' },
    { k: ['mac'], name: 'Dirección MAC', es: 'Dirección física única de cada tarjeta de red. El switch la usa para entregar tramas dentro de la red local.', en: 'Unique physical address of each network card. The switch uses it to deliver frames inside the local network.', r: 'Redes · El switch por dentro' },
    { k: ['dns'], name: 'DNS', es: 'Sistema que traduce nombres como nvision.social a la dirección IP del servidor. Sin DNS, el navegador no encuentra las páginas por nombre.', en: 'System that translates names like nvision.social into the server IP address. Without DNS, the browser cannot find pages by name.', r: 'Redes' },
    { k: ['dhcp'], name: 'DHCP', es: 'Servicio que reparte direcciones IP automáticamente a los equipos que se conectan a la red.', en: 'Service that automatically hands out IP addresses to devices joining the network.', r: 'Redes' },
    { k: ['ram', 'memoria'], name: 'RAM', es: 'Memoria volátil donde se cargan los programas en uso. Si falla, el equipo muestra pantallas azules, se reinicia o ni siquiera arranca.', en: 'Volatile memory where running programs are loaded. If it fails, the PC shows blue screens, reboots, or does not start at all.', r: 'Hardware · Pantalla Azul' },
    { k: ['ssd', 'disco', 'hdd'], name: 'SSD / Disco', es: 'Almacenamiento permanente del equipo. Un disco dañado produce lentitud extrema, archivos corruptos y errores de lectura.', en: 'Permanent storage of the PC. A damaged disk causes extreme slowness, corrupt files and read errors.', r: 'Hardware' },
    { k: ['driver', 'controlador'], name: 'Driver', es: 'Programa que permite al sistema operativo usar un hardware. Un driver corrupto o incompatible es causa clásica de pantallas azules.', en: 'Program that lets the operating system use a piece of hardware. A corrupt or incompatible driver is a classic blue-screen cause.', r: 'Mantenimiento por software · Pantalla Azul' },
    { k: ['latencia'], name: 'Latencia', es: 'Tiempo que tarda un paquete en ir y volver. Se mide en milisegundos con el ping: a menor latencia, respuesta más rápida.', en: 'Time a packet takes to go and return. Measured in milliseconds with ping: lower latency means faster response.', r: 'Redes' },
    { k: ['topología', 'topologia'], name: 'Topología', es: 'La forma en que se conectan los equipos de una red: estrella, bus, anillo, árbol o malla.', en: 'The shape in which network devices connect: star, bus, ring, tree or mesh.', r: 'Redes · Topologías' },
    { k: ['bios', 'uefi'], name: 'BIOS / UEFI', es: 'Firmware que arranca el equipo y hace la primera revisión del hardware (POST) antes de cargar el sistema operativo.', en: 'Firmware that starts the PC and runs the first hardware check (POST) before loading the operating system.', r: 'Hardware' },
    { k: ['cpu', 'procesador'], name: 'CPU', es: 'El cerebro del equipo: ejecuta las instrucciones de todos los programas. Su temperatura alta sostenida causa apagones de protección.', en: 'The brain of the PC: it runs every program instruction. Sustained high temperature causes protective shutdowns.', r: 'Hardware' }
  ];

  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function answerFor(q) {
    var nq = ' ' + norm(q) + ' ';
    var examLike = /(respuesta|answer|examen|exam|certificad)/.test(nq);
    for (var i = 0; i < GLOSSARY.length; i++) {
      var g = GLOSSARY[i];
      for (var j = 0; j < g.k.length; j++) {
        if (nq.indexOf(norm(g.k[j])) >= 0) {
          return (examLike ? T.examWarn : '') + T.fromGlossary + ' ' + g[lang] + ' ' + T.seeRoute + ' ' + g.r + '.';
        }
      }
    }
    return T.notFound;
  }

  // ---------- Construcción del panel ----------
  var topic = detectedContext();
  var hintLevels = {}; // nivel alcanzado por tema
  var wrap = document.createElement('div');
  wrap.className = 'tutor-wrap';
  wrap.innerHTML =
    '<button type="button" class="tutor-fab" id="tutor-fab" aria-expanded="false" aria-controls="tutor-panel">' +
    '<span class="tutor-fab-dot" aria-hidden="true"></span>' + T.open + '</button>' +
    '<section class="tutor-panel" id="tutor-panel" hidden aria-label="' + T.title + '">' +
      '<header class="tutor-head"><span class="tutor-logo" aria-hidden="true">NVI</span>' +
      '<span class="tutor-head-t"><strong>' + T.title + '</strong><small>' + T.tagline + '</small></span>' +
      '<button type="button" class="tutor-close" id="tutor-close" aria-label="Cerrar">×</button></header>' +
      '<p class="tutor-ctx" id="tutor-ctx"></p>' +
      '<nav class="tutor-tabs" role="tablist">' +
        '<button type="button" role="tab" class="tutor-tab on" data-tab="hints">💡 ' + T.tabHints + '</button>' +
        '<button type="button" role="tab" class="tutor-tab" data-tab="gloss">📖 ' + T.tabGloss + '</button>' +
        '<button type="button" role="tab" class="tutor-tab" data-tab="ask">💬 ' + T.tabAsk + '</button>' +
      '</nav>' +
      '<div class="tutor-page" id="tutor-page-hints">' +
        '<p class="tutor-label">' + T.topic + '</p>' +
        '<div class="tutor-chips" id="tutor-chips"></div>' +
        '<div class="tutor-dots" id="tutor-dots" aria-hidden="true"></div>' +
        '<div class="tutor-hintbox" id="tutor-hintbox"></div>' +
        '<div class="tutor-hints-list" id="tutor-hints-list"></div>' +
        '<div class="tutor-actions"><button type="button" class="tool-btn" id="tutor-hint">' + T.hintBtn + '</button>' +
        '<button type="button" class="tool-btn tool-btn-ghost" id="tutor-reset">' + T.hintReset + '</button></div>' +
      '</div>' +
      '<div class="tutor-page" id="tutor-page-gloss" hidden>' +
        '<input type="search" id="tutor-gloss-q" class="tutor-gloss-q" placeholder="' + T.glossPh + '" aria-label="' + T.glossPh + '">' +
        '<div class="tutor-chips" id="tutor-gloss-list"></div>' +
        '<div class="tutor-hintbox" id="tutor-gloss-card">' + T.glossPick + '</div>' +
      '</div>' +
      '<div class="tutor-page" id="tutor-page-ask" hidden>' +
        '<div class="tutor-log" id="tutor-log" aria-live="polite"></div>' +
        '<form class="tutor-form" id="tutor-form"><input type="text" id="tutor-input" maxlength="90" autocomplete="off" placeholder="' + T.askPh + '" aria-label="' + T.askPh + '">' +
        '<button type="submit" class="tool-btn">' + T.askBtn + '</button></form>' +
      '</div>' +
    '</section>';
  document.body.appendChild(wrap);

  var panel = document.getElementById('tutor-panel');
  var fab = document.getElementById('tutor-fab');
  fab.addEventListener('click', function () {
    var open = panel.hidden;
    panel.hidden = !open;
    fab.setAttribute('aria-expanded', String(open));
  });
  document.getElementById('tutor-close').addEventListener('click', function () {
    panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); fab.focus();
  });

  // Pestañas
  Array.prototype.forEach.call(document.querySelectorAll('.tutor-tab'), function (tab) {
    tab.addEventListener('click', function () {
      Array.prototype.forEach.call(document.querySelectorAll('.tutor-tab'), function (x) { x.classList.toggle('on', x === tab); });
      ['hints', 'gloss', 'ask'].forEach(function (name) {
        document.getElementById('tutor-page-' + name).hidden = name !== tab.dataset.tab;
      });
    });
  });

  // ---------- Pestaña Pistas ----------
  var chipsBox = document.getElementById('tutor-chips');
  var dotsBox = document.getElementById('tutor-dots');
  var hintBox = document.getElementById('tutor-hintbox');
  var hintBtn = document.getElementById('tutor-hint');

  function renderChips() {
    chipsBox.innerHTML = '';
    Object.keys(T.topics).forEach(function (key) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tutor-chip' + (key === topic ? ' on' : '');
      b.textContent = T.topics[key];
      b.addEventListener('click', function () { topic = key; renderChips(); renderHintState(); });
      chipsBox.appendChild(b);
    });
    document.getElementById('tutor-ctx').textContent = T.ctxLine + T.topics[detectedContext()] + '.';
  }
  // Las pistas de un tema: HINTS[tema] es {es: [...], en: [...]}; se
  // devuelve SIEMPRE la lista del idioma activo (antes se usaba el
  // objeto entero y la función explotaba: ninguna pista se pintaba).
  function hintsOf(key) { return (HINTS[key] || HINTS.generic)[lang]; }

  function renderHintState() {
    var list = hintsOf(topic);
    var lvl = hintLevels[topic] || 0;
    dotsBox.innerHTML = '';
    list.forEach(function (_, i) {
      var d = document.createElement('span');
      d.className = 'tutor-dot' + (i < lvl ? ' on' : '');
      dotsBox.appendChild(d);
    });
    hintBox.textContent = T.topics[topic] + ' · ' + T.level + ' ' + lvl + ' ' + T.of + ' ' + list.length + (lvl >= list.length ? ' — ' + T.hintDone : '');
    // TODAS las pistas desbloqueadas quedan visibles como tarjetas,
    // la más reciente resaltada: la pista siempre se refleja.
    var box = document.getElementById('tutor-hints-list');
    box.innerHTML = '';
    if (lvl > 0) {
      var h = document.createElement('p');
      h.className = 'tutor-label'; h.textContent = T.unlocked;
      box.appendChild(h);
    }
    for (var i = 0; i < lvl; i++) {
      var card = document.createElement('div');
      card.className = 'tutor-hint-card' + (i === lvl - 1 ? ' fresh' : '');
      var badge = document.createElement('span');
      badge.className = 'tutor-hint-badge';
      badge.textContent = '💡 ' + T.level + ' ' + (i + 1);
      card.appendChild(badge);
      card.appendChild(document.createTextNode(list[i]));
      box.appendChild(card);
    }
    if (lvl >= list.length) {
      var go = document.createElement('button');
      go.type = 'button'; go.className = 'tool-btn tool-btn-ghost';
      go.textContent = '📖 ' + T.seeGloss;
      go.addEventListener('click', function () {
        var tab = document.querySelector('.tutor-tab[data-tab="gloss"]');
        if (tab) tab.click();
      });
      box.appendChild(go);
    }
    hintBtn.textContent = lvl === 0 ? T.hintBtn : (lvl < list.length ? T.hintNext : T.hintBtn);
    hintBtn.disabled = lvl >= list.length;
  }
  hintBtn.addEventListener('click', function () {
    var list = hintsOf(topic);
    var lvl = hintLevels[topic] || 0;
    if (lvl >= list.length) return;
    hintLevels[topic] = lvl + 1;
    renderHintState();
    var box = document.getElementById('tutor-hints-list');
    if (box) box.scrollTop = box.scrollHeight;
  });
  document.getElementById('tutor-reset').addEventListener('click', function () {
    hintLevels[topic] = 0; renderHintState();
  });

  // ---------- Pestaña Glosario ----------
  var glossList = document.getElementById('tutor-gloss-list');
  var glossCard = document.getElementById('tutor-gloss-card');
  function renderGloss(filter) {
    glossList.innerHTML = '';
    var f = norm(filter || '');
    GLOSSARY.forEach(function (g) {
      if (f && norm(g.name + ' ' + g.k.join(' ')).indexOf(f) < 0) return;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tutor-chip';
      b.textContent = g.name;
      b.addEventListener('click', function () {
        glossCard.innerHTML = '';
        var s = document.createElement('strong'); s.textContent = g.name + '. ';
        glossCard.appendChild(s);
        glossCard.appendChild(document.createTextNode(g[lang] + ' ' + T.seeRoute + ' ' + g.r + '.'));
      });
      glossList.appendChild(b);
    });
  }
  document.getElementById('tutor-gloss-q').addEventListener('input', function (ev) { renderGloss(ev.target.value); });

  // ---------- Pestaña Preguntar ----------
  var log = document.getElementById('tutor-log');
  function say(text, mine) {
    var p = document.createElement('p');
    p.className = mine ? 'tutor-msg mine' : 'tutor-msg bot';
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }
  say(T.welcome, false);
  document.getElementById('tutor-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var inp = document.getElementById('tutor-input');
    var q = (inp.value || '').trim();
    if (!q) return;
    say(q, true); inp.value = '';
    say(answerFor(q), false);
  });

  renderChips();
  renderHintState();
  renderGloss('');

  // Si cambia la sección dentro de redes (ping ↔ switch), se actualiza
  // el tema detectado sin perder el avance de los demás temas.
  window.addEventListener('hashchange', function () {
    var d = detectedContext();
    document.getElementById('tutor-ctx').textContent = T.ctxLine + T.topics[d] + '.';
    if (d !== topic && (topic === 'ping' || topic === 'switch')) { topic = d; renderChips(); renderHintState(); }
  });
})();
