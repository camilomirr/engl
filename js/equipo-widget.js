// Widget flotante del chat del equipo NVISION con Muse.
// Vive ENCIMA del botón del chatbot del sitio (el asistente local) y
// PERSISTE entre páginas: el nombre elegido, la vista y si el panel estaba
// abierto se guardan en localStorage y se restauran al cambiar de página.
(function () {
  'use strict';

  var SUPABASE_URL = 'https://xiuztrujrwdgcpjrruxu.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdXp0cnVqcndkZ2NwanJydXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNTk2ODcsImV4cCI6MjEwOTYzNTY4N30.CBBQpCqHxuOtCaMcdUfIrKTa4vt0QJRqvivskHnt5g0';
  var TEAM = ['Duay', 'Santiago', 'Samuel', 'Yurlei', 'Andres', 'Abraham', 'Juan', 'Deivison', 'Camilo'];

  function sbHeaders(extra) {
    return Object.assign({ apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY, 'Content-Type': 'application/json' }, extra || {});
  }
  async function sbGet(path) {
    var r = await fetch(SUPABASE_URL + path, { headers: sbHeaders() });
    if (!r.ok) throw new Error('http ' + r.status);
    return r.json();
  }
  async function sbPost(path, body, prefer) {
    var r = await fetch(SUPABASE_URL + path, { method: 'POST', headers: sbHeaders(prefer ? { Prefer: prefer } : {}), body: JSON.stringify(body) });
    if (!r.ok) throw new Error('http ' + r.status);
    try { return await r.json(); } catch (e) { return null; }
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmtHora(iso) {
    try { return new Date(iso).toLocaleString('es-CO', { timeZone: 'America/Bogota', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); }
    catch (e) { return iso || ''; }
  }
  function initials(name) {
    var parts = String(name || '?').trim().split(/\s+/);
    return (parts[0][0] || '?').toUpperCase() + (parts.length > 1 ? (parts[parts.length - 1][0] || '').toUpperCase() : '');
  }

  var lastRows = [];
  var view = 'picker'; // 'picker' | 'chat'
  var name = localStorage.getItem('eq_name') || '';
  var open = localStorage.getItem('eqw_open') === '1';

  var root = document.createElement('div');
  root.className = 'eqw';
  root.innerHTML =
    '<button type="button" class="eqw-fab" id="eqwFab" aria-label="Chat del equipo con Muse">' +
      '<img src="assets/muse-logo.webp" alt="Muse">' +
      '<span class="eqw-fab-badge" id="eqwFabBadge" hidden></span>' +
    '</button>' +
    '<div class="eqw-panel" id="eqwPanel" hidden>' +
      '<div class="eqw-head">' +
        '<img src="assets/muse-logo.webp" alt="Muse" class="eqw-head-logo">' +
        '<div class="eqw-head-who"><strong id="eqwTitle">Chat del equipo</strong><span id="eqwSub">Elige tu nombre</span></div>' +
        '<button type="button" class="eqw-close" id="eqwClose" aria-label="Cerrar">×</button>' +
      '</div>' +
      '<div class="eqw-body" id="eqwBody"><p class="equipo-loading">Cargando…</p></div>' +
      '<form class="eqw-inputbar" id="eqwForm" hidden>' +
        '<input id="eqwInput" type="text" maxlength="2000" required placeholder="Escribe un mensaje..." autocomplete="off">' +
        '<button class="btn-primary eqw-send" type="submit">Enviar</button>' +
      '</form>' +
    '</div>';
  document.body.appendChild(root);

  var fab = document.getElementById('eqwFab');
  var fabBadge = document.getElementById('eqwFabBadge');
  var panel = document.getElementById('eqwPanel');
  var body = document.getElementById('eqwBody');
  var form = document.getElementById('eqwForm');
  var input = document.getElementById('eqwInput');

  function seenKey(n) { return 'eq_seen_' + n; }
  function getSeen(n) { return localStorage.getItem(seenKey(n)) || '1970-01-01'; }
  function markSeen(n) { localStorage.setItem(seenKey(n), new Date().toISOString()); }
  function unreadCount(n) {
    var seen = getSeen(n);
    return lastRows.filter(function (t) { return t.name === n && t.status === 'listo' && (t.updated_at || t.created_at) > seen; }).length;
  }

  function renderFabBadge() {
    var n = name ? unreadCount(name) : 0;
    fabBadge.hidden = !n;
    fabBadge.textContent = n;
  }

  function renderPicker() {
    view = 'picker';
    localStorage.setItem('eqw_view', 'picker');
    document.getElementById('eqwTitle').textContent = 'Chat del equipo';
    document.getElementById('eqwSub').textContent = 'Elige tu nombre';
    form.hidden = true;
    body.innerHTML = TEAM.map(function (n) {
      var rows = lastRows.filter(function (t) { return t.name === n; });
      var last = rows[0];
      var unread = unreadCount(n);
      var preview = last
        ? (last.status === 'listo' && (last.result || '').trim() ? 'Muse: ' + last.result.trim() : last.task)
        : 'Sin mensajes todavía.';
      var mine = n === name;
      return '<button type="button" class="eq-chat-row eqw-row' + (mine ? ' eqw-row-current' : '') + '" data-name="' + esc(n) + '">' +
        '<span class="eq-avatar">' + esc(initials(n)) + '</span>' +
        '<span class="eq-row-main"><strong>' + esc(n) + (mine ? ' <span class="eqw-you">· Tu chat</span>' : '') + '</strong>' +
        '<span class="eq-row-preview">' + esc(preview) + '</span></span>' +
        (unread ? '<span class="eq-badge">' + unread + '</span>' : '') + '</button>';
    }).join('');
    body.querySelectorAll('.eqw-row').forEach(function (b) {
      b.addEventListener('click', function () { openChat(b.getAttribute('data-name')); });
    });
  }

  function renderChat() {
    view = 'chat';
    localStorage.setItem('eqw_view', 'chat');
    document.getElementById('eqwTitle').textContent = name;
    document.getElementById('eqwSub').textContent = 'Chat con Muse';
    form.hidden = false;
    var rows = lastRows.filter(function (t) { return t.name === name; }).slice().reverse();
    if (!rows.length) {
      body.innerHTML = '<p class="equipo-loading">Este chat está vacío. Escríbele algo a Muse abajo.</p>';
      return;
    }
    body.innerHTML = '<button type="button" class="eqw-back" id="eqwBack">← Cambiar de nombre</button>' +
      rows.map(function (t) {
        var done = t.status === 'listo';
        var result = (t.result || '').trim();
        var commit = (t.commit_sha || '').trim();
        var museBubble = done
          ? '<div class="eq-msg eq-msg-muse eq-msg-done"><strong>Muse ✓ Listo</strong><p>' + esc(result || 'Listo.') + '</p>' + (commit ? '<span class="eq-commit">Cambio: ' + esc(commit) + '</span>' : '') + '</div>'
          : (t.status === 'proceso'
            ? '<div class="eq-msg eq-msg-muse eq-typing"><strong>Muse</strong><p>Estoy trabajando en esto…</p></div>'
            : '<div class="eq-msg eq-msg-muse eq-typing"><strong>Muse</strong><p>Recibido. Muse lo revisa en unos minutos y te responde aquí mismo.</p></div>');
        return '<div class="eq-chat-thread">' +
          '<div class="eq-msg eq-msg-user"><p>' + esc(t.task) + '</p>' +
          '<span class="eq-meta">' + esc(fmtHora(t.created_at)) + (done ? ' · ✓✓' : '') + '</span></div>' +
          museBubble + '</div>';
      }).join('');
    var back = document.getElementById('eqwBack');
    if (back) back.addEventListener('click', function () { renderPicker(); });
    body.scrollTop = body.scrollHeight;
  }

  function openChat(n) {
    name = n;
    localStorage.setItem('eq_name', n);
    markSeen(n);
    renderChat();
    renderFabBadge();
  }

  function setOpen(v) {
    open = v;
    localStorage.setItem('eqw_open', v ? '1' : '0');
    panel.hidden = !v;
    if (v) {
      // Al abrir el botón, SIEMPRE salen primero los nombres.
      renderPicker();
      renderFabBadge();
    }
  }

  fab.addEventListener('click', function () { setOpen(!open); });
  document.getElementById('eqwClose').addEventListener('click', function () { setOpen(false); });
  form.addEventListener('submit', async function (ev) {
    ev.preventDefault();
    var task = input.value.trim();
    if (!name || !task) return;
    input.value = '';
    try {
      await sbPost('/rest/v1/team_tasks', { name: name, page: 'Chat', task: task }, 'return=representation');
      loadTasks();
    } catch (e) { /* se reintenta al enviar de nuevo */ }
  });

  async function loadTasks() {
    try {
      lastRows = (await sbGet('/rest/v1/team_tasks?select=*&order=created_at.desc&limit=100')) || [];
      renderFabBadge();
      if (open) {
        if (view === 'chat' && name) renderChat();
        else if (view === 'picker') renderPicker();
      }
    } catch (e) { /* sin conexión: reintenta en el próximo ciclo */ }
  }

  // Restaurar el estado al cambiar de página: mismo nombre y misma vista.
  if (open) {
    panel.hidden = false;
    if (name && localStorage.getItem('eqw_view') === 'chat') { renderChat(); markSeen(name); }
    else renderPicker();
  }
  loadTasks();
  setInterval(loadTasks, 5000);
})();
