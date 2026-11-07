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

async function loadTasks() {
  try {
    const rows = await sbGet('/rest/v1/team_tasks?select=*&order=created_at.desc&limit=50');
    if (!rows || !rows.length) {
      listEl.innerHTML = '<p class="equipo-loading">Todavía no hay tareas. ¡Sé la primera persona en pedirle algo a Muse!</p>';
      return;
    }
    listEl.innerHTML = rows.map((t) => {
      const done = t.status === 'listo';
      const result = (t.result || '').trim();
      const commit = (t.commit_sha || '').trim();
      return '<article class="eq-card' + (done ? ' eq-card-done' : '') + '">' +
        '<div class="eq-head"><span class="eq-avatar">' + esc(initials(t.name)) + '</span>' +
        '<div class="eq-who"><strong>' + esc(t.name) + '</strong>' +
        '<span class="eq-meta">' + esc(t.page || 'Otra') + ' · ' + esc(fmtHora(t.created_at)) + '</span></div>' +
        statusPill(t.status) + '</div>' +
        '<p class="eq-task">' + esc(t.task) + '</p>' +
        (done ? '<div class="eq-result"><strong>Muse:</strong> ' + esc(result || 'Listo.') + (commit ? '<br><span class="eq-commit">Cambio: ' + esc(commit) + '</span>' : '') + '</div>' : '') +
        '</article>';
    }).join('');
  } catch (e) {
    listEl.innerHTML = '<p class="equipo-loading">No se pudieron cargar las tareas. Revisa tu conexión y recarga la página.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('eq_name') || '';
  if (savedName) $('fName').value = savedName;

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
  setInterval(loadTasks, 15000);
});
