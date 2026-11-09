// NVISION - Terminal simulada de comandos de red.
// Consola falsa con salidas preparadas y 3 misiones guiadas.
(function () {
  var out = document.getElementById('term-out');
  if (!out) return;
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var ES = lang === 'es';
  var L = function (es, en) { return ES ? es : en; };

  var state = { mission: 0, step: 0, done: [false, false, false] };

  function print(text, cls) {
    var div = document.createElement('div');
    if (cls) div.className = cls;
    div.textContent = text;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  }
  function printBlock(lines, cls) { lines.forEach(function (l) { print(l, cls); }); }

  var HELP = [
    L('Comandos disponibles:', 'Available commands:'),
    '  ayuda / help ........ ' + L('esta lista', 'this list'),
    '  ipconfig ............ ' + L('tu configuración de red', 'your network configuration'),
    '  ping <destino> ...... ' + L('comprueba si un equipo responde', 'check if a host answers'),
    '  tracert <destino> ... ' + L('la ruta que siguen los paquetes', 'the route packets follow'),
    '  nslookup <dominio> .. ' + L('pregunta al DNS por un dominio', 'ask DNS about a domain'),
    '  netstat ............. ' + L('conexiones activas', 'active connections'),
    '  arp -a .............. ' + L('equipos conocidos en tu red local', 'known hosts on your local network'),
    '  hostname ............ ' + L('el nombre de este equipo', 'this host name'),
    '  misiones ............ ' + L('ver las misiones guiadas', 'see the guided missions'),
    '  cls / clear ......... ' + L('limpiar la pantalla', 'clear the screen')
  ];

  var OUT = {
    ipconfig: [
      '', L('Configuración IP de Windows (simulada)', 'Windows IP Configuration (simulated)'), '',
      L('Adaptador Ethernet Ethernet0:', 'Ethernet adapter Ethernet0:'), '',
      '   ' + L('Dirección IPv4', 'IPv4 Address') + ' . . . . . . . : 192.168.1.50',
      '   ' + L('Máscara de subred', 'Subnet Mask') + ' . . . . . . : 255.255.255.0',
      '   ' + L('Puerta de enlace', 'Default Gateway') + ' . . . . : 192.168.1.1',
      '   ' + L('Servidores DNS', 'DNS Servers') + ' . . . . . . . . : 8.8.8.8 / 1.1.1.1'
    ],
    pingOk: function (host) {
      return ['', L('Haciendo ping a ', 'Pinging ') + host + ':',
        L('Respuesta desde ', 'Reply from ') + host + ': bytes=32 ' + L('tiempo', 'time') + '=4ms TTL=117',
        L('Respuesta desde ', 'Reply from ') + host + ': bytes=32 ' + L('tiempo', 'time') + '=5ms TTL=117',
        L('Respuesta desde ', 'Reply from ') + host + ': bytes=32 ' + L('tiempo', 'time') + '=4ms TTL=117',
        '', L('Paquetes: enviados = 3, recibidos = 3, perdidos = 0 (0% perdidos)', 'Packets: sent = 3, received = 3, lost = 0 (0% lost)')];
    },
    pingRouter: ['', L('Haciendo ping a 192.168.1.1:', 'Pinging 192.168.1.1:'),
      L('Respuesta desde 192.168.1.1: bytes=32 tiempo=1ms TTL=64', 'Reply from 192.168.1.1: bytes=32 time=1ms TTL=64'),
      L('Respuesta desde 192.168.1.1: bytes=32 tiempo=1ms TTL=64', 'Reply from 192.168.1.1: bytes=32 time=1ms TTL=64'),
      '', L('El router responde perfecto: el problema NO está en tu red local.', 'The router answers perfectly: the problem is NOT on your local network.')],
    pingFail: function (host) {
      return ['', L('Haciendo ping a ', 'Pinging ') + host + ':',
        L('Tiempo de espera agotado para esta solicitud.', 'Request timed out.'),
        L('Tiempo de espera agotado para esta solicitud.', 'Request timed out.'),
        '', L('Paquetes: enviados = 2, recibidos = 0, perdidos = 2 (100% perdidos)', 'Packets: sent = 2, received = 0, lost = 2 (100% lost)')];
    },
    tracert: function (host) {
      return ['', L('Traza a ', 'Tracing route to ') + host + ':',
        '  1     1 ms     1 ms     1 ms   192.168.1.1  (tu router)',
        '  2     9 ms     8 ms     9 ms   ' + L('red de tu proveedor', 'your ISP network'),
        '  3    18 ms    17 ms    18 ms   ' + L('nodo regional', 'regional node'),
        '  4    24 ms    23 ms    24 ms   ' + host,
        '', L('Traza completa.', 'Trace complete.')];
    },
    nslookup: function (dom) {
      return ['', L('Servidor: dns.google (8.8.8.8)', 'Server: dns.google (8.8.8.8)'), '',
        L('Nombre: ', 'Name: ') + dom, L('Dirección: 142.250.78.46 (ejemplo)', 'Address: 142.250.78.46 (example)')];
    },
    netstat: ['', L('Conexiones activas (extracto)', 'Active connections (excerpt)'), '',
      '  TCP   192.168.1.50:51322   142.250.78.46:443    ESTABLISHED',
      '  TCP   192.168.1.50:51401   151.101.1.69:443     ESTABLISHED',
      '  TCP   192.168.1.50:49670   192.168.1.1:53        TIME_WAIT'],
    arp: ['', '  ' + L('Interfaz: 192.168.1.50', 'Interface: 192.168.1.50'), '',
      '  ' + L('Dirección de Internet   Dirección física      Tipo', 'Internet Address      Physical Address      Type'),
      '  192.168.1.1             a4-b1-c2-d3-e4-f5     ' + L('dinámica (tu router)', 'dynamic (your router)'),
      '  192.168.1.23            5c-8a-91-02-77-10     ' + L('dinámica (otro equipo)', 'dynamic (another host)')]
  };

  var MISSIONS = [
    { title: L('Misión 1: Conoce tu red', 'Mission 1: Know your network'),
      steps: [
        { say: L('Ejecuta ipconfig y fíjate en tu IPv4 y tu puerta de enlace.', 'Run ipconfig and notice your IPv4 and your gateway.'), test: function (c) { return c === 'ipconfig'; } },
        { say: L('Ahora comprueba que tu router responde: ping 192.168.1.1', 'Now check that your router answers: ping 192.168.1.1'), test: function (c) { return c === 'ping 192.168.1.1'; } }
      ] },
    { title: L('Misión 2: ¿Hay internet?', 'Mission 2: Is there internet?'),
      steps: [
        { say: L('Un compañero dice que "no hay internet". Prueba ping 8.8.8.8 (un DNS público).', 'A classmate says "there is no internet". Try ping 8.8.8.8 (a public DNS).'), test: function (c) { return c === 'ping 8.8.8.8'; } },
        { say: L('Responde por IP pero las páginas no abren… sospecha del DNS: nslookup nvision.social', 'It answers by IP but pages do not open… suspect DNS: nslookup nvision.social'), test: function (c) { return c.indexOf('nslookup') === 0; } }
      ] },
    { title: L('Misión 3: La ruta completa', 'Mission 3: The full route'),
      steps: [
        { say: L('Mira por dónde viajan tus paquetes: tracert nvision.social', 'See where your packets travel: tracert nvision.social'), test: function (c) { return c.indexOf('tracert') === 0; } },
        { say: L('Y termina viendo quién más vive en tu red: arp -a', 'And finish by seeing who else lives on your network: arp -a'), test: function (c) { return c === 'arp -a' || c === 'arp'; } }
      ] }
  ];

  var missionsBox = document.getElementById('term-missions');
  function renderMissions() {
    missionsBox.innerHTML = '';
    MISSIONS.forEach(function (m, i) {
      var d = document.createElement('div');
      d.className = 'term-mission' + (state.done[i] ? ' done' : '') + (state.mission === i && !state.done[i] ? ' active' : '');
      var b = document.createElement('strong');
      b.textContent = (state.done[i] ? '✓ ' : '') + m.title;
      d.appendChild(b);
      if (state.mission === i && !state.done[i]) {
        var p = document.createElement('p');
        p.textContent = m.steps[state.step].say;
        d.appendChild(p);
        d.addEventListener('click', function () {});
      } else if (!state.done[i]) {
        d.addEventListener('click', function () { state.mission = i; state.step = 0; renderMissions(); document.getElementById('term-input').focus(); });
        d.style.cursor = 'pointer';
      }
      missionsBox.appendChild(d);
    });
  }

  function missionCheck(cmd) {
    var m = MISSIONS[state.mission];
    if (!m || state.done[state.mission]) return;
    if (m.steps[state.step].test(cmd)) {
      state.step++;
      if (state.step >= m.steps.length) {
        state.done[state.mission] = true;
        print(L('★ Misión completada: ', '★ Mission complete: ') + m.title, 'term-ok');
        var next = state.done.indexOf(false);
        if (next !== -1) state.mission = next; state.step = 0;
      } else {
        print(L('✓ Bien. Siguiente paso de la misión…', '✓ Good. Next mission step…'), 'term-ok');
      }
      renderMissions();
    }
  }

  function run(raw) {
    var cmdLine = raw.trim();
    print('C:\\Users\\estudiante> ' + cmdLine, 'term-cmd');
    if (!cmdLine) return;
    var parts = cmdLine.toLowerCase().split(/\s+/);
    var cmd = parts[0];
    var arg = parts.slice(1).join(' ');
    missionCheck(parts.join(' '));

    if (cmd === 'ayuda' || cmd === 'help') printBlock(HELP);
    else if (cmd === 'cls' || cmd === 'clear') { out.innerHTML = ''; }
    else if (cmd === 'misiones') { state.step = state.step; renderMissions(); print(L('Toca una misión en el panel para activarla.', 'Tap a mission in the panel to activate it.')); }
    else if (cmd === 'ipconfig') printBlock(OUT.ipconfig);
    else if (cmd === 'hostname') print('NVISION-PC-01');
    else if (cmd === 'ping') {
      if (!arg) print(L('Uso: ping <destino>. Ejemplo: ping 192.168.1.1', 'Usage: ping <host>. Example: ping 192.168.1.1'));
      else if (arg === '192.168.1.1') printBlock(OUT.pingRouter);
      else if (arg === '8.8.8.8' || arg === '1.1.1.1') printBlock(OUT.pingOk(arg));
      else if (arg === '192.168.1.99') printBlock(OUT.pingFail(arg));
      else printBlock(OUT.pingOk(arg));
    }
    else if (cmd === 'tracert' || cmd === 'traceroute') printBlock(arg ? OUT.tracert(arg) : [L('Uso: tracert <destino>', 'Usage: tracert <host>')]);
    else if (cmd === 'nslookup') printBlock(arg ? OUT.nslookup(arg) : [L('Uso: nslookup <dominio>', 'Usage: nslookup <domain>')]);
    else if (cmd === 'netstat') printBlock(OUT.netstat);
    else if (cmd === 'arp') printBlock(OUT.arp);
    else print(L('Comando no reconocido en esta simulación. Escribe «ayuda».', 'Command not recognized in this simulation. Type "help".'), 'term-err');
  }

  print('NVISION OS [versión simulada 1.0]', 'term-ok');
  print(L('Consola de práctica: nada de lo que escribas afecta un equipo real.', 'Practice console: nothing you type affects a real machine.'));
  print(L('Escribe «ayuda» para ver los comandos o elige una misión del panel.', 'Type "help" to see the commands or pick a mission from the panel.'));
  print('');
  renderMissions();

  var form = document.getElementById('term-form');
  var input = document.getElementById('term-input');
  form.addEventListener('submit', function (ev) { ev.preventDefault(); run(input.value); input.value = ''; });
  document.querySelector('.term-box').addEventListener('click', function () { input.focus(); });
  input.focus();
})();
