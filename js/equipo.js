// Equipo NVISION — puente de tareas con Muse (Supabase, tabla team_tasks)
const SUPABASE_URL = 'https://xiuztrujrwdgcpjrruxu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdXp0cnVqcndkZ2NwanJydXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNTk2ODcsImV4cCI6MjEwOTYzNTY4N30.CBBQpCqHxuOtCaMcdUfIrKTa4vt0QJRqvivskHnt5g0';

function sbHeaders(extra) {
  return Object.assign({ apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY, 'Content-Type': 'application/json' }, extra || {});
}
async function sbGet(path) {
  const r = await fetch(SUPABASE_URL + path, { headers: sbHeaders() });
  if (!r.ok) throw new Error('http ' + r.status);
  return r.json();
}
async function sbPost(path, body, prefer) {
  const r = await fetch(SUPABASE_URL + path, { method: 'POST', headers: sbHeaders(prefer ? { Prefer: prefer } : {}), body: JSON.stringify(body) });
  if (!r.ok) throw new Error('http ' + r.status);
  try { return await r.json(); } catch (e) { return null; }
}

const $ = (id) => document.getElementById(id);
const listEl = $('taskList');
const formStatus = $('formStatus');
const chatListEl = $('chatList');
const listTitleEl = $('listTitle');

// Cada persona del equipo tiene su propio chat. Muse lee TODOS los chats.
const TEAM = ['Duay', 'Santiago', 'Samuel', 'Yurlei', 'Andres', 'Abraham', 'Juan', 'Deivison', 'Camilo'];
let selectedName = localStorage.getItem('eq_chat') || 'Todos';
let lastRows = [];

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function fmtHora(iso) {
  try {
    return new Date(iso).toLocaleString('es-CO', { timeZone: 'America/Bogota', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) { return iso || ''; }
}
function initials(name) {
  const parts = String(name || '?').trim().split(/\s+/);
  return (parts[0][0] || '?').toUpperCase() + (parts.length > 1 ? (parts[parts.length - 1][0] || '').toUpperCase() : '');
}
function statusPill(status) {
  if (status === 'listo') return '<span class="eq-pill eq-done">✓ Listo</span>';
  if (status === 'proceso') return '<span class="eq-pill eq-doing">Haciéndolo…</span>';
  return '<span class="eq-pill eq-pending">Pendiente</span>';
}

function renderChatList() {
  const counts = {};
  lastRows.forEach((t) => { if (t.status !== 'listo') counts[t.name] = (counts[t.name] || 0) + 1; });
  const names = ['Todos'].concat(TEAM);
  chatListEl.innerHTML = names.map((n) => {
    const badge = n !== 'Todos' && counts[n] ? ' <span class="eq-badge">' + counts[n] + '</span>' : '';
    return '<button type="button" class="eq-chat' + (selectedName === n ? ' eq-chat-active' : '') + '" data-name="' + esc(n) + '">' +
      '<span class="eq-avatar eq-avatar-sm">' + esc(initials(n === 'Todos' ? 'NV' : n)) + '</span>' +
      '<span>' + esc(n === 'Todos' ? 'Todos' : n) + '</span>' + badge + '</button>';
  }).join('');
  chatListEl.querySelectorAll('.eq-chat').forEach((b) => {
    b.addEventListener('click', () => {
      selectedName = b.getAttribute('data-name');
      localStorage.setItem('eq_chat', selectedName);
      if (selectedName !== 'Todos') $('fName').value = selectedName;
      renderTasks();
    });
  });
}

function renderTasks() {
  renderChatList();
  const rows = selectedName === 'Todos' ? lastRows : lastRows.filter((t) => t.name === selectedName);
  listTitleEl.textContent = selectedName === 'Todos' ? 'Tareas del equipo' : 'Chat de ' + selectedName;
  if (!rows.length) {
    listEl.innerHTML = '<p class="equipo-loading">' + (selectedName === 'Todos' ? 'Todavía no hay tareas. ¡Sé la primera persona en pedirle algo a Muse!' : 'Todavía no hay tareas en el chat de ' + esc(selectedName) + '.') + '</p>';
    return;
  }
  listEl.innerHTML = rows.map((t) => {
    const done = t.status === 'listo';
    const result = (t.result || '').trim();
    const commit = (t.commit_sha || '').trim();
    if (selectedName !== 'Todos') {
      // Vista de chat en vivo: burbuja de la persona y burbuja de Muse.
      const museBubble = done
        ? '<div class="eq-msg eq-msg-muse"><strong>Muse</strong><p>' + esc(result || 'Listo.') + '</p>' + (commit ? '<span class="eq-commit">Cambio: ' + esc(commit) + '</span>' : '') + '</div>'
        : (t.status === 'proceso'
          ? '<div class="eq-msg eq-msg-muse eq-typing"><strong>Muse</strong><p>Estoy trabajando en esto…</p></div>'
          : '<div class="eq-msg eq-msg-muse eq-typing"><strong>Muse</strong><p>Recibido. Muse lo revisa en unos minutos y te responde aquí mismo.</p></div>');
      return '<div class="eq-chat-thread">' +
        '<div class="eq-msg eq-msg-user"><strong>' + esc(t.name) + '</strong><p>' + esc(t.task) + '</p>' +
        '<span class="eq-meta">' + esc(t.page || 'Otra') + ' · ' + esc(fmtHora(t.created_at)) + (done ? ' · ✓' : '') + '</span></div>' +
        museBubble + '</div>';
    }
    return '<article class="eq-card' + (done ? ' eq-card-done' : '') + '">' +
      '<div class="eq-head"><span class="eq-avatar">' + esc(initials(t.name)) + '</span>' +
      '<div class="eq-who"><strong>' + esc(t.name) + '</strong>' +
      '<span class="eq-meta">' + esc(t.page || 'Otra') + ' · ' + esc(fmtHora(t.created_at)) + '</span></div>' +
      statusPill(t.status) + '</div>' +
      '<p class="eq-task">' + esc(t.task) + '</p>' +
      (done ? '<div class="eq-result"><strong>Muse:</strong> ' + esc(result || 'Listo.') + (commit ? '<br><span class="eq-commit">Cambio: ' + esc(commit) + '</span>' : '') + '</div>' : '') +
      '</article>';
  }).join('');
}

async function loadTasks() {
  try {
    const rows = await sbGet('/rest/v1/team_tasks?select=*&order=created_at.desc&limit=100');
    lastRows = rows || [];
    renderTasks();
  } catch (e) {
    listEl.innerHTML = '<p class="equipo-loading">No se pudieron cargar las tareas. Revisa tu conexión y recarga la página.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('eq_name') || '';
  if (selectedName !== 'Todos') $('fName').value = selectedName;
  else if (savedName) $('fName').value = savedName;

  $('taskForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const name = $('fName').value.trim();
    const page = $('fPage').value;
    const task = $('fTask').value.trim();
    if (!name || !task) return;
    const btn = $('btnSend');
    btn.disabled = true;
    formStatus.textContent = 'Enviando…';
    try {
      localStorage.setItem('eq_name', name);
      await sbPost('/rest/v1/team_tasks', { name, page, task }, 'return=representation');
      $('fTask').value = '';
      formStatus.textContent = '¡Enviado! Muse lo verá en unos minutos y te responderá aquí mismo.';
      loadTasks();
    } catch (e) {
      formStatus.textContent = 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.';
    }
    btn.disabled = false;
  });

  loadTasks();
  setInterval(loadTasks, 5000);
});
