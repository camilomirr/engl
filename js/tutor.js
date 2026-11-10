// NVISION · NVI-Bot Tutor (2026-11-10)
// Tutor con pistas progresivas: conoce el glosario y la ruta del sitio y
// detecta en qué simulador está el usuario (Ping, El switch por dentro,
// Terminal, Topologías). NUNCA da la respuesta directa de una actividad:
// da pistas por niveles (1 suave, 2 guía, 3 concepto del glosario) para
// que el estudiante llegue solo a la solución.
// Se carga solo en las páginas con simuladores (redes, terminal,
// topologia, ruta). Botón propio, abajo a la izquierda, para no tapar
// el asistente general del sitio.
(function () {
  'use strict';
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';

  var T = {
    es: {
      open: 'Tutor NVI-Bot', title: 'NVI-Bot · Tu tutor',
      welcome: 'Hola, soy NVI-Bot. No te doy respuestas: te doy pistas para que lo resuelvas tú. Pregúntame un término del glosario o pide una pista del simulador en el que estás.',
      ctxPing: 'Estás en el Simulador Ping', ctxSwitch: 'Estás en El switch por dentro',
      ctxTerminal: 'Estás en la Terminal de redes', ctxTopo: 'Estás en el Simulador de topologías',
      ctxRuta: 'Estás en la Ruta de aprendizaje', ctxGeneric: 'Estoy para darte pistas',
      hintBtn: 'Dame una pista', hintNext: 'Otra pista (nivel %n)',
      hintDone: 'Ya tienes el concepto clave. ¡Aplícalo en el simulador!',
      askPh: 'Pregunta un término: ping, MAC, RAM…',
      askBtn: 'Preguntar',
      notFound: 'Ese término no está en mi glosario. Prueba con: ping, switch, router, IP, MAC, DNS, DHCP, RAM, SSD, driver, latencia o topología.',
      fromGlossary: 'Del glosario NVISION:',
      seeRoute: 'Refuerzo en la ruta: ',
      examWarn: 'Eso suena a pregunta de examen: no te doy la respuesta, pero sí el concepto. ',
      levels: 'Nivel de pista'
    },
    en: {
      open: 'NVI-Bot Tutor', title: 'NVI-Bot · Your tutor',
      welcome: 'Hi, I am NVI-Bot. I do not give answers: I give hints so you can solve it yourself. Ask me a glossary term or request a hint for the simulator you are in.',
      ctxPing: 'You are in the Ping Simulator', ctxSwitch: 'You are in Inside the switch',
      ctxTerminal: 'You are in the Network terminal', ctxTopo: 'You are in the Topology simulator',
      ctxRuta: 'You are in the Learning path', ctxGeneric: 'I am here to give you hints',
      hintBtn: 'Give me a hint', hintNext: 'Another hint (level %n)',
      askPh: 'Ask a term: ping, MAC, RAM…',
      askBtn: 'Ask',
      notFound: 'That term is not in my glossary. Try: ping, switch, router, IP, MAC, DNS, DHCP, RAM, SSD, driver, latency or topology.',
      fromGlossary: 'From the NVISION glossary:',
      seeRoute: 'Reinforce on the path: ',
      examWarn: 'That sounds like an exam question: I will not give the answer, but here is the concept. ',
      levels: 'Hint level'
    }
  }[lang];

  // ---- Contexto: qué simulador está viendo el usuario ----
  function context() {
    var p = location.pathname;
    var h = location.hash || '';
    if (p.indexOf('redes.html') >= 0) {
      if (h.indexOf('switch') >= 0) return 'switch';
      return 'ping';
    }
    if (p.indexOf('terminal.html') >= 0) return 'terminal';
    if (p.indexOf('topologia.html') >= 0) return 'topo';
    if (p.indexOf('ruta.html') >= 0) return 'ruta';
    return 'generic';
  }

  // ---- Pistas por niveles, escritas desde el contenido del sitio ----
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

  // ---- Glosario del tutor (alineado con recursos.html#glosario) ----
  var GLOSSARY = [
    { k: ['ping', 'icmp'], es: 'Comando que envía paquetes ICMP para probar si otro equipo responde y cuánto tarda (latencia).', en: 'Command that sends ICMP packets to test whether another host replies and how long it takes (latency).', r: 'Redes · Simulador Ping' },
    { k: ['switch', 'conmutador'], es: 'Dispositivo que conecta equipos de una misma red y reenvía tramas según la dirección MAC, aprendiendo en qué puerto está cada equipo.', en: 'Device that connects hosts on the same network and forwards frames by MAC address, learning which port each host is on.', r: 'Redes · El switch por dentro' },
    { k: ['router', 'enrutador', 'gateway', 'puerta de enlace'], es: 'Equipo que une redes distintas y decide el camino de los paquetes. La puerta de enlace es su dirección dentro de tu red.', en: 'Device that joins different networks and decides packet paths. The gateway is its address inside your network.', r: 'Redes' },
    { k: ['ip', 'dirección ip', 'direccion ip'], es: 'Dirección lógica que identifica a cada equipo en la red, por ejemplo 192.168.1.10. La 127.0.0.1 siempre es el propio equipo (loopback).', en: 'Logical address that identifies each host on the network, e.g. 192.168.1.10. 127.0.0.1 is always the host itself (loopback).', r: 'Redes' },
    { k: ['mac'], es: 'Dirección física única de cada tarjeta de red. El switch la usa para entregar tramas dentro de la red local.', en: 'Unique physical address of each network card. The switch uses it to deliver frames inside the local network.', r: 'Redes · El switch por dentro' },
    { k: ['dns'], es: 'Sistema que traduce nombres como nvision.social a la dirección IP del servidor. Sin DNS, el navegador no encuentra las páginas por nombre.', en: 'System that translates names like nvision.social into the server IP address. Without DNS, the browser cannot find pages by name.', r: 'Redes' },
    { k: ['dhcp'], es: 'Servicio que reparte direcciones IP automáticamente a los equipos que se conectan a la red.', en: 'Service that automatically hands out IP addresses to devices joining the network.', r: 'Redes' },
    { k: ['ram', 'memoria'], es: 'Memoria volátil donde se cargan los programas en uso. Si falla, el equipo muestra pantallas azules, se reinicia o ni siquiera arranca.', en: 'Volatile memory where running programs are loaded. If it fails, the PC shows blue screens, reboots, or does not start at all.', r: 'Hardware · Pantalla Azul' },
    { k: ['ssd', 'disco', 'hdd'], es: 'Almacenamiento permanente del equipo. Un disco dañado produce lentitud extrema, archivos corruptos y errores de lectura.', en: 'Permanent storage of the PC. A damaged disk causes extreme slowness, corrupt files and read errors.', r: 'Hardware' },
    { k: ['driver', 'controlador'], es: 'Programa que permite al sistema operativo usar un hardware. Un driver corrupto o incompatible es causa clásica de pantallas azules.', en: 'Program that lets the operating system use a piece of hardware. A corrupt or incompatible driver is a classic blue-screen cause.', r: 'Mantenimiento por software · Pantalla Azul' },
    { k: ['latencia'], es: 'Tiempo que tarda un paquete en ir y volver. Se mide en milisegundos con el ping: a menor latencia, respuesta más rápida.', en: 'Time a packet takes to go and return. Measured in milliseconds with ping: lower latency means faster response.', r: 'Redes' },
    { k: ['topología', 'topologia'], es: 'La forma en que se conectan los equipos de una red: estrella, bus, anillo, árbol o malla.', en: 'The shape in which network devices connect: star, bus, ring, tree or mesh.', r: 'Redes · Topologías' },
    { k: ['bios', 'uefi'], es: 'Firmware que arranca el equipo y hace la primera revisión del hardware (POST) antes de cargar el sistema operativo.', en: 'Firmware that starts the PC and runs the first hardware check (POST) before loading the operating system.', r: 'Hardware' },
    { k: ['cpu', 'procesador'], es: 'El cerebro del equipo: ejecuta las instrucciones de todos los programas. Su temperatura alta sostenida causa apagones de protección.', en: 'The brain of the PC: it runs every program instruction. Sustained high temperature causes protective shutdowns.', r: 'Hardware' }
  ];

  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  function answer(q) {
    var nq = ' ' + norm(q) + ' ';
    var examLike = /(respuesta|answer|examen|exam|certificad)/.test(nq);
    for (var i = 0; i < GLOSSARY.length; i++) {
      var g = GLOSSARY[i];
      for (var j = 0; j < g.k.length; j++) {
        if (nq.indexOf(norm(g.k[j])) >= 0) {
          return (examLike ? T.examWarn : '') + T.fromGlossary + ' ' + g[lang] + ' ' + T.seeRoute + g.r + '.';
        }
      }
    }
    return T.notFound;
  }

  // ---- Interfaz ----
  var ctx = context();
  var hintLevel = 0;
  var wrap = document.createElement('div');
  wrap.className = 'tutor-wrap';
  wrap.innerHTML =
    '<button type="button" class="tutor-fab" id="tutor-fab" aria-expanded="false" aria-controls="tutor-panel">' +
    '<span class="tutor-fab-dot" aria-hidden="true"></span>' + T.open + '</button>' +
    '<section class="tutor-panel" id="tutor-panel" hidden aria-label="' + T.title + '">' +
    '<header class="tutor-head"><strong>' + T.title + '</strong>' +
    '<button type="button" class="tutor-close" id="tutor-close" aria-label="Cerrar">×</button></header>' +
    '<p class="tutor-ctx" id="tutor-ctx"></p>' +
    '<div class="tutor-log" id="tutor-log" aria-live="polite"></div>' +
    '<div class="tutor-actions"><button type="button" class="tool-btn" id="tutor-hint">' + T.hintBtn + '</button></div>' +
    '<form class="tutor-form" id="tutor-form"><input type="text" id="tutor-input" maxlength="90" autocomplete="off" placeholder="' + T.askPh + '" aria-label="' + T.askPh + '">' +
    '<button type="submit" class="tool-btn">' + T.askBtn + '</button></form>' +
    '</section>';
  document.body.appendChild(wrap);

  var panel = document.getElementById('tutor-panel');
  var log = document.getElementById('tutor-log');
  var ctxEl = document.getElementById('tutor-ctx');
  var ctxNames = { ping: T.ctxPing, switch: T.ctxSwitch, terminal: T.ctxTerminal, topo: T.ctxTopo, ruta: T.ctxRuta, generic: T.ctxGeneric };
  ctxEl.textContent = ctxNames[ctx] || T.ctxGeneric;

  function say(text, mine) {
    var p = document.createElement('p');
    p.className = mine ? 'tutor-msg mine' : 'tutor-msg bot';
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }
  say(T.welcome, false);

  var fab = document.getElementById('tutor-fab');
  fab.addEventListener('click', function () {
    var open = panel.hidden;
    panel.hidden = !open;
    fab.setAttribute('aria-expanded', String(open));
    if (open) { var inp = document.getElementById('tutor-input'); if (inp) inp.focus(); }
  });
  document.getElementById('tutor-close').addEventListener('click', function () {
    panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); fab.focus();
  });

  var hintBtn = document.getElementById('tutor-hint');
  hintBtn.addEventListener('click', function () {
    var list = HINTS[ctx] || HINTS.generic;
    if (hintLevel >= list.length) { say(T.hintDone, false); return; }
    say('💡 ' + T.levels + ' ' + (hintLevel + 1) + ': ' + list[hintLevel][lang], false);
    hintLevel++;
    if (hintLevel < list.length) hintBtn.textContent = T.hintNext.replace('%n', String(hintLevel + 1));
    else hintBtn.textContent = T.hintBtn;
  });

  document.getElementById('tutor-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var inp = document.getElementById('tutor-input');
    var q = (inp.value || '').trim();
    if (!q) return;
    say(q, true);
    inp.value = '';
    say(answer(q), false);
  });

  // Si el usuario salta entre secciones de redes (ping ↔ switch), el
  // contexto se actualiza y las pistas vuelven a empezar.
  window.addEventListener('hashchange', function () {
    var c2 = context();
    if (c2 !== ctx) { ctx = c2; hintLevel = 0; hintBtn.textContent = T.hintBtn; ctxEl.textContent = ctxNames[ctx] || T.ctxGeneric; }
  });
})();
