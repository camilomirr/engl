// Chat del equipo NVISION con Muse (Supabase, tabla team_tasks)
// Pantalla 1: escoger el nombre. Pantalla 2: chat libre con Muse.
// Los mensajes se quedan guardados en Supabase y nunca se borran.
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
const TEAM = ['Duay', 'Santiago', 'Samuel', 'Yurlei', 'Andres', 'Abraham', 'Juan', 'Deivison', 'Camilo'];
let selectedName = null;
let lastRows = [];

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function fmtHora(iso) {
  try {
    return new Date(iso).toLocaleString('es-CO', { timeZone: 'America/Bogota', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch (e) { return iso || ''; }
}
function initials(name) {
  const parts = String(name || '?').trim().split(/\s+/);
  return (parts[0][0] || '?').toUpperCase() + (parts.length > 1 ? (parts[parts.length - 1][0] || '').toUpperCase() : '');
}
function seenKey(name) { return 'eq_seen_' + name; }
function getSeen(name) { return localStorage.getItem(seenKey(name)) || '1970-01-01'; }
function markSeen(name) { localStorage.setItem(seenKey(name), new Date().toISOString()); }
function unreadCount(name) {
  const seen = getSeen(name);
  return lastRows.filter((t) => t.name === name && t.status === 'listo' && (t.updated_at || t.created_at) > seen).length;
}

function renderPicker() {
  const listEl = $('chatList');
  listEl.innerHTML = TEAM.map((n) => {
    const rows = lastRows.filter((t) => t.name === n);
    const last = rows[0];
    const unread = unreadCount(n);
    const preview = last
      ? (last.status === 'listo' && (last.result || '').trim() ? 'Muse: ' + last.result.trim() : last.task)
      : 'Sin mensajes todavía. Toca para escribirle a Muse.';
    const time = last ? fmtHora(last.status === 'listo' ? (last.updated_at || last.created_at) : last.created_at) : '';
    return '<button type="button" class="eq-chat-row" data-name="' + esc(n) + '">' +
      '<span class="eq-avatar">' + esc(initials(n)) + '</span>' +
      '<span class="eq-row-main"><strong>' + esc(n) + '</strong>' +
      '<span class="eq-row-preview">' + esc(preview) + '</span></span>' +
      '<span class="eq-row-side"><span class="eq-row-time">' + esc(time) + '</span>' +
      (unread ? '<span class="eq-badge">' + unread + '</span>' : '') + '</span></button>';
  }).join('');
  listEl.querySelectorAll('.eq-chat-row').forEach((b) => {
    b.addEventListener('click', () => openChat(b.getAttribute('data-name')));
  });
}

function renderChat() {
  const listEl = $('taskList');
  const rows = lastRows.filter((t) => t.name === selectedName).slice().reverse();
  if (!rows.length) {
    listEl.innerHTML = '<p class="equipo-loading">Este chat está vacío. Escríbele algo a Muse abajo.</p>';
    return;
  }
  listEl.innerHTML = rows.map((t) => {
    const done = t.status === 'listo';
    const result = (t.result || '').trim();
    const commit = (t.commit_sha || '').trim();
    const museBubble = done
      ? '<div class="eq-msg eq-msg-muse eq-msg-done"><strong>Muse ✓ Listo</strong><p>' + esc(result || 'Listo.') + '</p>' + (commit ? '<span class="eq-commit">Cambio: ' + esc(commit) + '</span>' : '') + '</div>'
      : (t.status === 'proceso'
        ? '<div class="eq-msg eq-msg-muse eq-typing"><strong>Muse</strong><p>Estoy trabajando en esto…</p></div>'
        : '<div class="eq-msg eq-msg-muse eq-typing"><strong>Muse</strong><p>Recibido. Muse lo revisa en unos minutos y te responde aquí mismo.</p></div>');
    return '<div class="eq-chat-thread">' +
      '<div class="eq-msg eq-msg-user"><p>' + esc(t.task) + '</p>' +
      '<span class="eq-meta">' + esc(fmtHora(t.created_at)) + (done ? ' · ✓✓' : '') + '</span></div>' +
      museBubble + '</div>';
  }).join('');
  listEl.scrollTop = listEl.scrollHeight;
}

function openChat(name) {
  selectedName = name;
  $('fName').value = name;
  $('chatName').textContent = name;
  $('pickerView').hidden = true;
  $('chatView').hidden = false;
  markSeen(name);
  renderChat();
  $('fTask').focus();
}

function showPicker() {
  if (selectedName) markSeen(selectedName);
  selectedName = null;
  $('chatView').hidden = true;
  $('pickerView').hidden = false;
  renderPicker();
}

async function loadTasks() {
  try {
    lastRows = (await sbGet('/rest/v1/team_tasks?select=*&order=created_at.desc&limit=100')) || [];
    if (selectedName) renderChat();
    else renderPicker();
  } catch (e) {
    // Sin conexión: se reintenta en el próximo ciclo, no se borra nada.
  }
}

document.addEventListener('DOMContentLoaded', () => {
  $('btnBack').addEventListener('click', showPicker);
  $('taskForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const name = $('fName').value;
    const task = $('fTask').value.trim();
    if (!name || !task) return;
    const btn = $('btnSend');
    btn.disabled = true;
    $('formStatus').textContent = 'Enviando…';
    try {
      await sbPost('/rest/v1/team_tasks', { name, page: 'Chat', task }, 'return=representation');
      $('fTask').value = '';
      $('formStatus').textContent = '';
      loadTasks();
    } catch (e) {
      $('formStatus').textContent = 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.';
    }
    btn.disabled = false;
  });
  loadTasks();
  setInterval(loadTasks, 5000);
});
