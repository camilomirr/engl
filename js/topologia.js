// NVISION · Simulador de topologías de red.
// Lienzo libre: se agregan equipos (PC, switch, router, servidor, nube),
// se arrastran, se conectan con cables y se prueba la comunicación con
// un ping que busca camino (BFS) y lo anima. Dos retos guiados. El
// diseño se guarda en nvision_topologia_v1.
(function () {
  'use strict';
  var stage = document.getElementById('topo-stage');
  if (!stage) return;
  var wires = document.getElementById('topo-wires');
  var out = document.getElementById('ping-out');
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var T = {
    es: { names: { pc: 'PC', switch: 'Switch', router: 'Router', server: 'Servidor', cloud: 'Internet' }, linked: 'Cable conectado: ', pickFirst: 'Toca el primer equipo…', pickSecond: 'Ahora toca el segundo equipo para conectar el cable.', need2: 'Necesitas al menos 2 equipos para enviar un ping.', same: 'El origen y el destino son el mismo equipo.', ok: '¡Ping exitoso! ', hops: 'saltos', via: 'Camino', fail: 'Sin respuesta: no hay camino de cables entre ', and: ' y ', deleted: 'Equipo borrado (y sus cables).', r1: 'Reto 1: haz ping entre dos PCs conectadas a un mismo switch', r2: 'Reto 2: haz ping entre dos PCs de redes distintas unidas por un router', doneTag: 'Completado', resetRetos: 'Reiniciar retos', retosReset: 'Retos reiniciados: son los mismos retos, ahora sin resolver. Haz ping de nuevo para completarlos.' },
    en: { names: { pc: 'PC', switch: 'Switch', router: 'Router', server: 'Server', cloud: 'Internet' }, linked: 'Cable connected: ', pickFirst: 'Tap the first device…', pickSecond: 'Now tap the second device to run the cable.', need2: 'You need at least 2 devices to send a ping.', same: 'Source and destination are the same device.', ok: 'Ping successful! ', hops: 'hops', via: 'Path', fail: 'No reply: there is no cable path between ', and: ' and ', deleted: 'Device deleted (and its cables).', r1: 'Challenge 1: ping between two PCs plugged into the same switch', r2: 'Challenge 2: ping between two PCs on different networks joined by a router', doneTag: 'Done', resetRetos: 'Reset challenges', retosReset: 'Challenges reset: the same challenges, now unsolved. Ping again to complete them.' }
  }[lang];
  var ICONS = {
    pc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M9 20h6M12 16v4"/></svg>',
    switch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="7" width="19" height="10" rx="2"/><path d="M6.5 10.5h.01M10 10.5h.01M13.5 10.5h.01M17 10.5h.01M6.5 13.5h11"/></svg>',
    router: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="14" r="5"/><path d="M12 9V4M8.5 6.5a5 5 0 0 1 7 0M5.8 4a9.5 9.5 0 0 1 12.4 0"/></svg>',
    server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3.5" width="16" height="7" rx="1.6"/><rect x="4" y="13.5" width="16" height="7" rx="1.6"/><path d="M7.5 7h.01M7.5 17h.01"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.5 18.5a4.5 4.5 0 0 0 .9-8.85A6 6 0 0 0 6.7 8.6 4.8 4.8 0 0 0 7 18.5z"/></svg>'
  };
  var KEY = 'nvision_topologia_v1';
  var RESET_KEY = 'nvision_topo_retos_reset', RESET_TOKEN = '2026-11-10-v1';
  var state = null;
  function load() {
    try { state = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { state = null; }
    if (!state || !Array.isArray(state.nodes)) {
      state = { seq: 4, retos: {},
        nodes: [ { id: 'n1', type: 'pc', x: 0.16, y: 0.42 }, { id: 'n2', type: 'switch', x: 0.47, y: 0.42 }, { id: 'n3', type: 'pc', x: 0.78, y: 0.42 } ],
        links: [ ['n1', 'n2'], ['n2', 'n3'] ] };
    }
    if (!state.retos) state.retos = {};
    // Reinicio de retos pedido el 2026-11-10 (una sola vez por navegador):
    // los retos quedan iguales, pero SIN resolver. Solo se limpia
    // state.retos; el diseño (equipos y cables) se conserva tal cual.
    try {
      if (localStorage.getItem(RESET_KEY) !== RESET_TOKEN) {
        state.retos = {};
        localStorage.setItem(RESET_KEY, RESET_TOKEN);
        save();
      }
    } catch (e) {}
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function byId(id) { return state.nodes.filter(function (n) { return n.id === id; })[0]; }
  function label(n) {
    var same = state.nodes.filter(function (x) { return x.type === n.type; });
    return T.names[n.type] + ' ' + (same.indexOf(n) + 1);
  }
  var mode = 'move', linkFrom = null;

  function render() {
    stage.querySelectorAll('.topo-node').forEach(function (el) { el.remove(); });
    var W = stage.clientWidth, H = stage.clientHeight;
    wires.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    wires.innerHTML = '';
    state.links.forEach(function (l, i) {
      var a = byId(l[0]), b = byId(l[1]); if (!a || !b) return;
      [[10, 'transparent'], [2.5, '']].forEach(function (cfg) {
        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', a.x * W); line.setAttribute('y1', a.y * H);
        line.setAttribute('x2', b.x * W); line.setAttribute('y2', b.y * H);
        line.setAttribute('class', 'topo-wire' + (cfg[1] === 'transparent' ? ' hit' : ''));
        line.dataset.i = i;
        wires.appendChild(line);
      });
    });
    state.nodes.forEach(function (n) {
      var el = document.createElement('div');
      el.className = 'topo-node' + (linkFrom === n.id ? ' sel' : '');
      el.style.left = (n.x * 100) + '%'; el.style.top = (n.y * 100) + '%';
      el.dataset.id = n.id;
      el.innerHTML = '<span class="topo-ico">' + ICONS[n.type] + '</span><span class="topo-name">' + label(n) + '</span>';
      el.addEventListener('pointerdown', function (ev) { onNodeDown(ev, n, el); });
      stage.appendChild(el);
    });
    // Selects del ping
    [['ping-from'], ['ping-to']].forEach(function (pair) {
      var sel = document.getElementById(pair[0]); if (!sel) return;
      var prev = sel.value;
      sel.innerHTML = '';
      state.nodes.forEach(function (n) { var o = document.createElement('option'); o.value = n.id; o.textContent = label(n); sel.appendChild(o); });
      if (byId(prev)) sel.value = prev;
    });
    var to = document.getElementById('ping-to');
    if (to && state.nodes.length > 1 && to.value === document.getElementById('ping-from').value) to.selectedIndex = 1;
    renderRetos();
  }

  function renderRetos() {
    var box = document.getElementById('topo-retos');
    if (!box) return;
    box.innerHTML = '';
    [['r1', T.r1], ['r2', T.r2]].forEach(function (r) {
      var p = document.createElement('p');
      p.className = 'topo-reto' + (state.retos[r[0]] ? ' done' : '');
      p.textContent = (state.retos[r[0]] ? '✓ ' : '○ ') + r[1] + (state.retos[r[0]] ? ' — ' + T.doneTag : '');
      box.appendChild(p);
    });
  }

  function onNodeDown(ev, n, el) {
    ev.preventDefault();
    if (mode === 'del') {
      state.nodes = state.nodes.filter(function (x) { return x.id !== n.id; });
      state.links = state.links.filter(function (l) { return l[0] !== n.id && l[1] !== n.id; });
      out.textContent = T.deleted; save(); render(); return;
    }
    if (mode === 'link') {
      if (!linkFrom) { linkFrom = n.id; out.textContent = T.pickSecond; render(); return; }
      if (linkFrom === n.id) { linkFrom = null; render(); return; }
      var a = linkFrom, b = n.id; linkFrom = null;
      var exists = state.links.some(function (l) { return (l[0] === a && l[1] === b) || (l[0] === b && l[1] === a); });
      if (!exists) { state.links.push([a, b]); out.textContent = T.linked + label(byId(a)) + ' ↔ ' + label(byId(b)); }
      save(); render(); return;
    }
    // Mover: arrastrar con el puntero
    var rect = stage.getBoundingClientRect();
    var sx = ev.clientX, sy = ev.clientY, ox = n.x, oy = n.y;
    function mv(e) {
      n.x = Math.min(0.96, Math.max(0.04, ox + (e.clientX - sx) / rect.width));
      n.y = Math.min(0.92, Math.max(0.1, oy + (e.clientY - sy) / rect.height));
      render();
    }
    function up() { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); save(); }
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  }

  wires.addEventListener('click', function (ev) {
    if (mode !== 'del') return;
    var t = ev.target;
    if (t && t.dataset && t.dataset.i !== undefined) {
      state.links.splice(parseInt(t.dataset.i, 10), 1); save(); render();
    }
  });

  document.querySelectorAll('#topo-add [data-add]').forEach(function (b) {
    b.addEventListener('click', function () {
      state.seq++;
      state.nodes.push({ id: 'n' + state.seq, type: b.dataset.add, x: 0.2 + Math.random() * 0.55, y: 0.25 + Math.random() * 0.45 });
      save(); render();
    });
  });
  document.querySelectorAll('#topo-modes [data-mode]').forEach(function (b) {
    b.addEventListener('click', function () {
      mode = b.dataset.mode; linkFrom = null;
      document.querySelectorAll('#topo-modes [data-mode]').forEach(function (x) { x.classList.toggle('on', x === b); });
      if (mode === 'link') out.textContent = T.pickFirst;
      render();
    });
  });
  document.getElementById('topo-clear-wires').addEventListener('click', function () { state.links = []; save(); render(); });
  document.getElementById('topo-clear-all').addEventListener('click', function () { state = { seq: 0, nodes: [], links: [], retos: state.retos }; save(); render(); });
  // Reiniciar retos: los mismos retos, sin resolver. No borra el diseño.
  var resetRetosBtn = document.getElementById('topo-reset-retos');
  if (resetRetosBtn) {
    resetRetosBtn.textContent = T.resetRetos;
    resetRetosBtn.addEventListener('click', function () {
      state.retos = {};
      save(); renderRetos();
      out.textContent = T.retosReset; out.className = 'topo-out';
    });
  }

  function path(from, to) {
    var prev = {}, q = [from]; prev[from] = null;
    while (q.length) {
      var cur = q.shift();
      if (cur === to) break;
      state.links.forEach(function (l) {
        var nb = l[0] === cur ? l[1] : l[1] === cur ? l[0] : null;
        if (nb && !(nb in prev)) { prev[nb] = cur; q.push(nb); }
      });
    }
    if (!(to in prev)) return null;
    var p = [], c = to;
    while (c) { p.unshift(c); c = prev[c]; }
    return p;
  }

  document.getElementById('ping-go').addEventListener('click', function () {
    var a = document.getElementById('ping-from').value, b = document.getElementById('ping-to').value;
    if (state.nodes.length < 2) { out.textContent = T.need2; return; }
    if (a === b) { out.textContent = T.same; return; }
    var p = path(a, b);
    if (!p) { out.textContent = '✗ ' + T.fail + label(byId(a)) + T.and + label(byId(b)) + '.'; out.className = 'topo-out bad'; return; }
    // Animar el camino paso a paso
    out.className = 'topo-out';
    stage.querySelectorAll('.topo-node').forEach(function (el) { el.classList.remove('ping'); });
    p.forEach(function (id, i) {
      setTimeout(function () {
        var el = stage.querySelector('.topo-node[data-id="' + id + '"]');
        if (el) el.classList.add('ping');
      }, i * 260);
    });
    setTimeout(function () {
      out.textContent = '✓ ' + T.ok + label(byId(a)) + ' → ' + label(byId(b)) + ' · ' + (p.length - 1) + ' ' + T.hops + ' · ' + T.via + ': ' + p.map(function (id) { return label(byId(id)); }).join(' → ');
      out.className = 'topo-out ok';
      // Retos
      var types = p.map(function (id) { return byId(id).type; });
      if (byId(a).type === 'pc' && byId(b).type === 'pc') {
        if (types.indexOf('switch') !== -1 && types.indexOf('router') === -1 && !state.retos.r1) { state.retos.r1 = 1; save(); }
        if (types.indexOf('router') !== -1 && types.filter(function (t) { return t === 'switch'; }).length >= 2 && !state.retos.r2) { state.retos.r2 = 1; save(); }
        renderRetos();
      }
    }, p.length * 260 + 60);
  });

  var rsz; window.addEventListener('resize', function () { clearTimeout(rsz); rsz = setTimeout(render, 120); });
  load(); render();
})();
