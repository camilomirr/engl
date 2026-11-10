// NVISION · Reto de la semana: una misión que rota cada lunes (clave ISO
// de semana) y se comprueba con el progreso que el sitio ya guarda.
// Al cumplirla queda registrada en nvision_reto_v1 (sincronizable) y
// desbloquea el logro "Reto cumplido" de logros.js.
(function () {
  'use strict';
  var box = document.getElementById('reto-semana');
  if (!box) return;
  // El idioma se lee en cada dibujo: al cambiarlo desde el selector, el
  // evento 'nvision-lang-change' vuelve a dibujar el reto en el idioma
  // nuevo (antes quedaba en español hasta recargar la página).
  function langNow() { return (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es'; }
  function texts(lang) {
    return {
    es: { kicker: 'Reto de la semana', done: '¡Reto completado!', todo: 'En curso', days: 'días para terminar la semana', lastDay: '¡Último día de la semana!', go: 'Ir a cumplirlo', logro: 'Desbloqueaste el logro «Reto cumplido».' },
    en: { kicker: 'Weekly challenge', done: 'Challenge completed!', todo: 'In progress', days: 'days left this week', lastDay: 'Last day of the week!', go: 'Go do it', logro: 'You unlocked the "Challenge cleared" achievement.' }
    }[lang];
  }

  function read(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function weekKey(d) {
    var date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var day = (date.getUTCDay() + 6) % 7;
    date.setUTCDate(date.getUTCDate() - day + 3);
    var first = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
    var fday = (first.getUTCDay() + 6) % 7;
    first.setUTCDate(first.getUTCDate() - fday + 3);
    var wk = 1 + Math.round((date - first) / (7 * 864e5));
    return { key: date.getUTCFullYear() + '-W' + ('0' + wk).slice(-2), num: wk };
  }
  function streak() {
    var doc = read('nvision_racha_v1'); if (!doc || !doc.days) return 0;
    var d = new Date(), n = 0, key = function (x) { return x.toISOString().slice(0, 10); };
    if (!doc.days[key(d)]) d.setDate(d.getDate() - 1);
    while (doc.days[key(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function ex() { return (read('nvision_examenes_v1') || {}).results || {}; }
  function countPassed() { var r = ex(); return Object.keys(r).filter(function (k) { return r[k] && r[k].passed; }).length; }
  function bestAny() { var r = ex(); return Object.keys(r).reduce(function (m, k) { return Math.max(m, (r[k] && r[k].best) || 0); }, 0); }

  var POOL = [
    { id: 'exam90', href: 'examenes.html',
      t: { es: 'Saca 90% o más en cualquier examen', en: 'Score 90% or more on any exam' },
      prog: function () { return bestAny() + '% / 90%'; }, ok: function () { return bestAny() >= 90; } },
    { id: 'aprobados2', href: 'examenes.html',
      t: { es: 'Aprueba 2 exámenes distintos', en: 'Pass 2 different exams' },
      prog: function () { return countPassed() + ' / 2'; }, ok: function () { return countPassed() >= 2; } },
    { id: 'racha3', href: 'index.html#pregunta-dia',
      t: { es: 'Logra una racha de 3 días en la pregunta del día', en: 'Reach a 3-day streak on the daily question' },
      prog: function () { return streak() + ' / 3'; }, ok: function () { return streak() >= 3; } },
    { id: 'terminal3', href: 'terminal.html',
      t: { es: 'Completa las 3 misiones de la terminal simulada', en: 'Complete all 3 missions of the simulated terminal' },
      prog: function () { var d = (read('nvision_terminal_v1') || {}).done || []; return d.filter(Boolean).length + ' / 3'; },
      ok: function () { var d = (read('nvision_terminal_v1') || {}).done || []; return d.filter(Boolean).length >= 3; } },
    { id: 'taller1', href: 'workshop/index.html',
      t: { es: 'Entrega 1 PC armada en el Workshop', en: 'Deliver 1 built PC in the Workshop' },
      prog: function () { var w = read('nvision_workshop_v2') || {}; return (((w.career || {}).delivered) || 0) + ' / 1'; },
      ok: function () { var w = read('nvision_workshop_v2') || {}; return (((w.career || {}).delivered) || 0) >= 1; } },
    { id: 'diario3', href: 'apuntes.html',
      t: { es: 'Ten apuntes guardados en 3 temas distintos', en: 'Keep saved notes in 3 different topics' },
      prog: function () { var n = read('nvision_apuntes_v1') || {}; var c = 0; if (n.topics) Object.keys(n.topics).forEach(function (k) { if (String(n.topics[k] || '').trim()) c++; }); return c + ' / 3'; },
      ok: function () { var n = read('nvision_apuntes_v1') || {}; var c = 0; if (n.topics) Object.keys(n.topics).forEach(function (k) { if (String(n.topics[k] || '').trim()) c++; }); return c >= 3; } }
  ];

  function render() {
    var lang = langNow();
    var T = texts(lang);
    var now = new Date();
    var wk = weekKey(now);
    var reto = POOL[wk.num % POOL.length];
  var done = reto.ok();
  var store = read('nvision_reto_v1') || { done: {} };
  if (!store.done) store.done = {};
  if (done && !store.done[wk.key]) {
    store.done[wk.key] = reto.id;
    try { localStorage.setItem('nvision_reto_v1', JSON.stringify(store)); } catch (e) {}
  }
  var wasDone = !!store.done[wk.key] || done;
  var idx = (now.getDay() + 6) % 7, left = 6 - idx;

  var h = '<p class="pd-kicker">' + T.kicker + '</p>' +
    '<h3 class="reto-title">' + reto.t[lang] + '</h3>' +
    '<p class="reto-state' + (wasDone ? ' ok' : '') + '">' + (wasDone ? '✓ ' + T.done : T.todo + ' · ' + reto.prog()) + '</p>';
  if (wasDone) h += '<p class="reto-meta">' + T.logro + '</p>';
  else h += '<a class="reto-link" href="' + reto.href + '">' + T.go + '</a>';
  h += '<p class="reto-meta">' + (left === 0 ? T.lastDay : (left + 1) + ' ' + T.days) + '</p>';
  box.innerHTML = h;
  }

  render();
  // Al cambiar el idioma desde el selector, volver a dibujar en el idioma nuevo.
  window.addEventListener('nvision-lang-change', render);
})();
