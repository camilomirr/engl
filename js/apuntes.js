// NVISION - Apuntes personales por tema (nvision_apuntes_v1, sincronizado).
(function () {
  var area = document.getElementById('notes-area');
  if (!area) return;
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var TOPICS = [
    { id: 'hardware', es: 'Hardware', en: 'Hardware' },
    { id: 'redes', es: 'Redes', en: 'Networks' },
    { id: 'mantenimiento', es: 'Mantenimiento', en: 'Maintenance' },
    { id: 'wifi', es: 'WiFi', en: 'WiFi' },
    { id: 'general', es: 'General', en: 'General' }
  ];
  var T = {
    es: { saved: 'Guardado ✓', saving: 'Guardando…', chars: 'caracteres', file: 'apuntes' },
    en: { saved: 'Saved ✓', saving: 'Saving…', chars: 'characters', file: 'notes' }
  }[lang];
  var KEY = 'nvision_apuntes_v1';
  function load() { try { var p = JSON.parse(localStorage.getItem(KEY) || 'null'); if (p && p.topics) return p; } catch (e) {} return { topics: {}, updatedAt: null }; }
  var st = load();
  var current = 'hardware';
  var state = document.getElementById('notes-state');
  var count = document.getElementById('notes-count');
  var tabs = document.getElementById('notes-tabs');
  var timer = null;

  TOPICS.forEach(function (t) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'notes-tab' + (t.id === current ? ' is-on' : '');
    b.textContent = t[lang];
    b.addEventListener('click', function () {
      st.topics[current] = area.value;
      persist();
      current = t.id;
      tabs.querySelectorAll('.notes-tab').forEach(function (x) { x.classList.toggle('is-on', x === b); });
      area.value = st.topics[current] || '';
      paintCount();
    });
    tabs.appendChild(b);
  });

  function persist() {
    st.updatedAt = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
    state.textContent = T.saved;
  }
  function paintCount() { count.textContent = area.value.length + ' ' + T.chars; }

  area.value = st.topics[current] || '';
  paintCount();
  area.addEventListener('input', function () {
    state.textContent = T.saving;
    paintCount();
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () { st.topics[current] = area.value; persist(); }, 500);
  });

  document.getElementById('notes-download').addEventListener('click', function () {
    st.topics[current] = area.value; persist();
    var topic = TOPICS.find(function (t) { return t.id === current; });
    var blob = new Blob(['NVISION — ' + topic[lang] + '\n\n' + (st.topics[current] || '')], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = T.file + '-' + current + '.txt';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  });
})();
