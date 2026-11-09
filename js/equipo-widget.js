// Widget flotante del chat del equipo NVISION con Muse.
// Vive ENCIMA del botón del chatbot del sitio (el asistente local) y
// PERSISTE entre páginas: el nombre elegido, la vista y si el panel estaba
// abierto se guardan en localStorage y se restauran al cambiar de página.
(function () {
  'use strict';

  var SUPABASE_URL = 'https://xiuztrujrwdgcpjrruxu.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdXp0cnVqcndkZ2NwanJydXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNTk2ODcsImV4cCI6MjEwOTYzNTY4N30.CBBQpCqHxuOtCaMcdUfIrKTa4vt0QJRqvivskHnt5g0';
  var TEAM = ['Duay', 'Santiago', 'Samuel', 'Yurlei', 'Andres', 'Abraham', 'Juan', 'Deivison', 'Camilo'];

  // Ruta base del sitio, deducida de la URL del propio script: el logo carga
  // igual desde la raíz (index.html) que desde subcarpetas (workshop/).
  var EQW_SCRIPT = (document.currentScript && document.currentScript.src) ||
    (function () { var s = document.querySelectorAll('script[src*="equipo-widget.js"]'); return s.length ? s[s.length - 1].src : ''; })();
  var SITE_BASE = EQW_SCRIPT ? EQW_SCRIPT.replace(/js\/[^/?]*(\?.*)?$/, '') : '';
  var LOGO_URL = SITE_BASE + 'assets/muse-logo.webp';

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
  // Hora en la zona horaria del aparato que abre la página (la del PC
  // o el celular): sin timeZone fijo, toLocaleString usa la zona local
  // del navegador. Así en Colombia se ve hora de Colombia y fuera del
  // país se ve la hora local de quien mira.
  function fmtHora(iso) {
    try { return new Date(iso).toLocaleString('es-CO', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); }
    catch (e) { return iso || ''; }
  }
  function fmtHoraCorta(iso) {
    try { return new Date(iso).toLocaleString('es-CO', { hour: '2-digit', minute: '2-digit' }); }
    catch (e) { return ''; }
  }

  var lastRows = [];
  var view = 'picker'; // 'picker' | 'chat'
  var name = localStorage.getItem('eq_name') || '';
  var open = localStorage.getItem('eqw_open') === '1';

  // Modo del mensaje: 'ask' (solo preguntar) o 'edit' (hacer el cambio).
  // El lápiz (Editar) viene encendido por defecto: se toca un botón y listo.
  var eqMode = 'edit';
  function stripMode(s) {
    return String(s == null ? '' : s).replace(/^\[(PREGUNTA|EDITAR)\]\s*/, '');
  }

  var root = document.createElement('div');
  root.className = 'eqw';
  root.innerHTML =
    '<button type="button" class="eqw-fab" id="eqwFab" aria-label="Chat del equipo con Muse">' +
      '<img src="' + LOGO_URL + '" alt="Muse">' +
      '<span class="eqw-fab-badge" id="eqwFabBadge" hidden></span>' +
    '</button>' +
    '<div class="eqw-panel" id="eqwPanel" hidden>' +
      '<div class="eqw-head">' +
        '<button type="button" class="eqw-head-back" id="eqwHeadBack" aria-label="Volver a los chats" hidden>←</button>' +
        '<img src="' + LOGO_URL + '" alt="Muse" class="eqw-head-logo" id="eqwHeadLogo">' +
        '<span class="eqw-head-avatar" id="eqwHeadAvatar" hidden></span>' +
        '<div class="eqw-head-who"><strong id="eqwTitle">Chat del equipo</strong><span id="eqwSub">Elige tu nombre</span></div>' +
        '<button type="button" class="eqw-close" id="eqwClose" aria-label="Cerrar">×</button>' +
      '</div>' +
      '<div class="eqw-body" id="eqwBody"><p class="equipo-loading">Cargando…</p></div>' +
      '<form class="eqw-inputbar" id="eqwForm" hidden>' +
        '<input id="eqwInput" type="text" maxlength="2000" required placeholder="Escribe un mensaje..." autocomplete="off">' +
        '<button type="button" class="eqw-mode eqw-mode-edit" id="eqwEditBtn" title="Editar: haz el cambio en la página" aria-label="Editar"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></button>' +
        '<button class="btn-primary eqw-send" type="submit">Enviar</button>' +
      '</form>' +
      '<p class="eqw-status" id="eqwStatus"></p>' +
    '</div>';
  document.body.appendChild(root);

  var fab = document.getElementById('eqwFab');
  var fabBadge = document.getElementById('eqwFabBadge');
  var panel = document.getElementById('eqwPanel');
  var body = document.getElementById('eqwBody');
  var form = document.getElementById('eqwForm');
  var input = document.getElementById('eqwInput');

  // Botones de modo: se activan para un solo mensaje (tocar de nuevo apaga).
  var editBtn = document.getElementById('eqwEditBtn');
  function renderMode() {
    var on = eqMode === 'edit';
    editBtn.classList.toggle('is-on', on);
    editBtn.setAttribute('aria-pressed', String(on));
    editBtn.title = on
      ? 'Editar encendido: lo que escribas se hace como cambio. Toca para solo preguntar.'
      : 'Editar apagado: solo responde, sin hacer cambios. Toca para hacer cambios.';
    input.placeholder = on ? 'Escribe el cambio...' : 'Escribe tu pregunta...';
  }
  // Un solo botón: el lápiz prende y apaga el modo Editar.
  function setMode(m) { eqMode = m; renderMode(); }
  editBtn.addEventListener('click', function () { setMode(eqMode === 'edit' ? 'ask' : 'edit'); input.focus(); });
  renderMode();

  function seenKey(n) { return 'eq_seen_' + n; }
  function getSeen(n) { return localStorage.getItem(seenKey(n)) || '1970-01-01'; }
  function markSeen(n) {
    // Guardar la fecha del mensaje más reciente, NO la hora del aparato:
    // si el reloj del aparato va atrasado frente al servidor, el "visto"
    // quedaba antes que el mensaje y el 1 no se quitaba nunca.
    var latest = '1970-01-01';
    lastRows.forEach(function (t) {
      if (t.name === n) { var u = t.updated_at || t.created_at || ''; if (u > latest) latest = u; }
    });
    localStorage.setItem(seenKey(n), latest === '1970-01-01' ? new Date().toISOString() : latest);
  }
  function unreadCount(n) {
    var seen = Date.parse(getSeen(n)) || 0;
    return lastRows.filter(function (t) { return t.name === n && t.status === 'listo' && Date.parse(t.updated_at || t.created_at || '') > seen; }).length;
  }

  function renderFabBadge() {
    var n = name ? unreadCount(name) : 0;
    fabBadge.hidden = !n;
    fabBadge.textContent = n;
  }

  function renderPicker() {
    view = 'picker';
    localStorage.setItem('eqw_view', 'picker');
    document.getElementById('eqwHeadBack').hidden = true;
    document.getElementById('eqwHeadLogo').hidden = false;
    document.getElementById('eqwHeadAvatar').hidden = true;
    document.getElementById('eqwTitle').textContent = 'Chat del equipo';
    document.getElementById('eqwSub').textContent = 'Elige tu nombre';
    form.hidden = true;
    body.innerHTML = TEAM.map(function (n) {
      var rows = lastRows.filter(function (t) { return t.name === n; });
      var last = rows[0];
      var unread = unreadCount(n);
      var when = last ? fmtHoraCorta(last.updated_at || last.created_at) : '';
      var preview = last
        ? (last.status === 'listo' && (last.result || '').trim() ? 'Muse: ' + last.result.trim() : stripMode(last.task))
        : 'Sin mensajes todavía.';
      var mine = n === name;
      return '<button type="button" class="eq-chat-row eqw-row' + (mine ? ' eqw-row-current' : '') + '" data-name="' + esc(n) + '">' +
        '<img src="' + LOGO_URL + '" alt="" class="eqw-row-logo">' +
        '<span class="eq-row-main"><strong>' + esc(n) + (mine ? ' <span class="eqw-you">· Tu chat</span>' : '') + '</strong>' +
        '<span class="eq-row-preview">' + esc(preview) + '</span></span>' +
        '<span class="eq-row-side">' + (when ? '<span class="eq-row-time">' + esc(when) + '</span>' : '') +
        (unread ? '<span class="eq-badge">' + unread + '</span>' : '') + '</span></button>';
    }).join('');
    body.querySelectorAll('.eqw-row').forEach(function (b) {
      b.addEventListener('click', function () { openChat(b.getAttribute('data-name')); });
    });
  }

  function renderChat(forceBottom) {
    view = 'chat';
    localStorage.setItem('eqw_view', 'chat');
    document.getElementById('eqwHeadBack').hidden = false;
    document.getElementById('eqwHeadLogo').hidden = false;
    document.getElementById('eqwHeadAvatar').hidden = true;
    document.getElementById('eqwTitle').textContent = name;
    document.getElementById('eqwSub').textContent = 'Chat del equipo';
    form.hidden = false;
    var rows = lastRows.filter(function (t) { return t.name === name; }).slice().reverse();
    if (!rows.length) {
      body.innerHTML = '<div class="eqw-empty"><img src="' + LOGO_URL + '" alt="Muse" class="eqw-empty-logo">' +
        '<strong>Hola, ' + esc(name) + '</strong>' +
        '<p>Este chat está vacío. Escríbele algo a Muse abajo, por ejemplo pedir un cambio en el sitio.</p>' +
        '<div class="eqw-chips">' +
        '<button type="button" class="eqw-chip" data-mode="edit" data-text="Quiero pedir un cambio en el sitio">Pedir un cambio</button>' +
        '<button type="button" class="eqw-chip" data-mode="ask" data-text="¿Qué puedes hacer por el equipo?">¿Qué puedes hacer?</button>' +
        '</div></div>';
      body.querySelectorAll('.eqw-chip').forEach(function (c) {
        c.addEventListener('click', function () {
          var m = c.getAttribute('data-mode');
          if (m) setMode(m);
          input.value = c.getAttribute('data-text'); input.focus();
        });
      });
      return;
    }
    // No bajar a la fuerza si está leyendo mensajes de arriba: solo baja
    // si ya estaba abajo (o si acaba de abrir el chat / enviar un mensaje).
    var atBottom = body.scrollHeight - body.scrollTop - body.clientHeight < 80;
    var prevTop = body.scrollTop;
    body.innerHTML = rows.map(function (t) {
        var done = t.status === 'listo';
        var result = (t.result || '').trim();
        var commit = (t.commit_sha || '').trim();
        var museBubble = done
          ? '<div class="eq-msg eq-msg-muse eq-msg-done"><strong>Muse ✓ Listo</strong><p>' + esc(result || 'Listo.') + '</p>' + (commit ? '<span class="eq-commit">Cambio: ' + esc(commit) + '</span><span class="eq-reload">Recarga la página con Ctrl+Shift+R para ver los cambios aplicados.</span>' : '') + '</div>'
          : (t.status === 'proceso'
            ? '<div class="eq-msg eq-msg-muse eq-typing"><strong>Muse</strong><p>Estoy trabajando en esto<span class="eq-dots"><i></i><i></i><i></i></span></p></div>'
            : '<div class="eq-msg eq-msg-muse eq-typing"><strong>Muse</strong><p>Recibido. Muse lo revisa en unos minutos y te responde aquí mismo.</p></div>');
        return '<div class="eq-chat-thread">' +
          '<div class="eq-msg eq-msg-user"><p>' + esc(stripMode(t.task)) + '</p>' +
          '<span class="eq-meta">' + esc(fmtHora(t.created_at)) + (done ? ' · ✓✓' : '') + '</span></div>' +
          museBubble + '</div>';
      }).join('');
    if (forceBottom || atBottom) body.scrollTop = body.scrollHeight;
    else body.scrollTop = prevTop;
  }

  function openChat(n) {
    name = n;
    localStorage.setItem('eq_name', n);
    markSeen(n);
    renderChat(true);
    renderFabBadge();
  }

  // Si se abre el asistente del sitio, este chatbot se cierra (y viceversa).
  window.addEventListener('nvision-chat-open', function (e) {
    if (e.detail && e.detail.which === 'assistant' && open) setOpen(false);
  });

  function setOpen(v) {
    open = v;
    localStorage.setItem('eqw_open', v ? '1' : '0');
    panel.hidden = !v;
    if (v) {
      window.dispatchEvent(new CustomEvent('nvision-chat-open', { detail: { which: 'equipo' } }));
      // Al abrir ya se ven los mensajes (vista previa en la lista), así que
      // el 1 se quita de inmediato, sin esperar al chequeo de 5 s.
      if (name) markSeen(name);
      // Al abrir el botón, SIEMPRE salen primero los nombres.
      renderPicker();
      renderFabBadge();
    }
  }

  fab.addEventListener('click', function () { setOpen(!open); });
  document.getElementById('eqwClose').addEventListener('click', function () { setOpen(false); });
  document.getElementById('eqwHeadBack').addEventListener('click', function () { renderPicker(); });
  form.addEventListener('submit', async function (ev) {
    ev.preventDefault();
    var task = input.value.trim();
    var status = document.getElementById('eqwStatus');
    var sendBtn = form.querySelector('.eqw-send');
    if (!name || !task) return;
    status.textContent = 'Enviando…';
    sendBtn.disabled = true;
    input.disabled = true;
    var sendTask = task;
    if (eqMode === 'ask') sendTask = '[PREGUNTA] ' + task.slice(0, 1990);
    else if (eqMode === 'edit') sendTask = '[EDITAR] ' + task.slice(0, 1990);
    try {
      await sbPost('/rest/v1/team_tasks', { name: name, page: 'Chat', task: sendTask }, 'return=representation');
      input.value = '';
      eqMode = 'edit';
      renderMode();
      status.textContent = '';
      loadTasks();
    } catch (e) {
      // No tragarse el error: el mensaje se queda en la caja y se avisa.
      input.value = task;
      status.textContent = 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.';
    } finally {
      sendBtn.disabled = false;
      input.disabled = false;
      input.focus();
    }
  });

  var lastSig = '';
  function rowsSig(rows) {
    return rows.map(function (t) { return t.id + ':' + t.status + ':' + (t.updated_at || ''); }).join('|');
  }

  async function loadTasks() {
    try {
      lastRows = (await sbGet('/rest/v1/team_tasks?select=*&order=created_at.desc&limit=100')) || [];
      var sig = rowsSig(lastRows);
      // Si el panel está abierto, los mensajes se están viendo: en el chat se
      // ve el hilo completo y en la lista se ve la vista previa con la
      // respuesta de Muse. En cualquier caso, marcar visto para que el 1
      // se quite al ver los mensajes (antes solo se marcaba en el chat).
      if (open && name) markSeen(name);
      renderFabBadge();
      // Si nada cambió, no se vuelve a dibujar: así el chat no se mueve solo.
      if (open && sig !== lastSig) {
        lastSig = sig;
        if (view === 'chat' && name) renderChat(false);
        else if (view === 'picker') renderPicker();
      } else {
        lastSig = sig;
      }
    } catch (e) { /* sin conexión: reintenta en el próximo ciclo */ }
  }

  // Restaurar el estado al cambiar de página: mismo nombre y misma vista.
  if (open) {
    panel.hidden = false;
    if (name && localStorage.getItem('eqw_view') === 'chat') { renderChat(true); markSeen(name); }
    else renderPicker();
  }
  loadTasks();
  setInterval(loadTasks, 5000);
})();
