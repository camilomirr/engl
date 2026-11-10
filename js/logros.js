/* NVISION · Logros y medallas.
   Motor compartido: calcula los logros a partir del progreso que ya guardan
   la ruta, los exámenes y el taller (sin duplicar datos), recuerda cuándo se
   desbloqueó cada uno (nvision_logros_v1, sincronizable con la cuenta) y
   expone el puntaje total que usa el ranking. En logros.html pinta la
   vitrina completa; en Mi cuenta pinta una franja resumen. */
(function () {
  'use strict';
  var KEY = 'nvision_logros_v1';
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var EXAM_IDS = ['hardware', 'redes', 'mantenimiento', 'wifi', 'seguridad'];

  var A = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var IC = {
    cuenta: '<svg ' + A + '><circle cx="10" cy="8" r="3.6"/><path d="M4.5 19.5c.6-3 2.8-4.5 5.5-4.5 1.2 0 2.3.3 3.2.9"/><polyline points="15.5 18.5 17.3 20.3 20.5 16.8"/></svg>',
    examen: '<svg ' + A + '><rect x="5" y="4" width="14" height="17" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="13" y2="13"/></svg>',
    aprobado: '<svg ' + A + '><circle cx="12" cy="12" r="8.5"/><polyline points="8.5 12.2 11 14.7 15.5 9.8"/></svg>',
    estrella: '<svg ' + A + '><polygon points="12 3.5 14.7 9 20.7 9.8 16.4 14 17.6 20 12 17 6.4 20 7.6 14 3.3 9.8 9.3 9"/></svg>',
    trofeo: '<svg ' + A + '><path d="M8 21h8"/><path d="M12 17.5V21"/><path d="M7 4h10v5.2a5 5 0 0 1-10 0z"/><path d="M7 5.5H4.2A1.2 1.2 0 0 0 3 6.7C3 8.9 4.6 10.2 7 10.2"/><path d="M17 5.5h2.8A1.2 1.2 0 0 1 21 6.7c0 2.2-1.6 3.5-4 3.5"/></svg>',
    certificado: '<svg ' + A + '><circle cx="12" cy="9.5" r="5.5"/><path d="M8.8 14 7.5 21l4.5-2.4L16.5 21 15.2 14"/></svg>',
    bandera: '<svg ' + A + '><path d="M5 21.5v-17"/><path d="M5 4.8c4-2.3 7 2 12 .2v9.3c-5 1.8-8-2.5-12-.2"/></svg>',
    brujula: '<svg ' + A + '><circle cx="12" cy="12" r="8.5"/><polygon points="15.5 8.5 13.8 13.8 8.5 15.5 10.2 10.2"/></svg>',
    corona: '<svg ' + A + '><path d="M4 17.5 3 8l5.5 4L12 5.5 15.5 12 21 8l-1 9.5z"/><line x1="4" y1="20.5" x2="20" y2="20.5"/></svg>',
    llave: '<svg ' + A + '><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    paquete: '<svg ' + A + '><path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="M4 7l8 4 8-4"/><path d="M12 11v10"/></svg>',
    nivel: '<svg ' + A + '><path d="M4 19.5h16"/><polyline points="5 15 10 9.5 13 12.5 19 5.5"/><polyline points="14.5 5.5 19 5.5 19 10"/></svg>',
    libro: '<svg ' + A + '><path d="M12 6c-2-1.5-4.5-2-8-2v14c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2V4c-3.5 0-6 .5-8 2z"/><line x1="12" y1="6" x2="12" y2="20"/></svg>',
    terminal: '<svg ' + A + '><rect x="2" y="3" width="20" height="18" rx="2"/><polyline points="6 9 10 12 6 15"/><line x1="12.5" y1="17" x2="17.5" y2="17"/></svg>',
    meta: '<svg ' + A + '><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.1" fill="currentColor"/></svg>'
  };

  var DEFS = [
    { id: 'cuenta', icon: IC.cuenta, n: { es: 'Cuenta creada', en: 'Account created' }, d: { es: 'Crea tu cuenta NVISION para guardar tu progreso en la nube.', en: 'Create your NVISION account to save your progress in the cloud.' }, ok: function (c) { return c.hasAccount; } },
    { id: 'primer-examen', icon: IC.examen, n: { es: 'Primer examen', en: 'First exam' }, d: { es: 'Presenta tu primer examen de certificación.', en: 'Take your first certification exam.' }, ok: function (c) { return c.attempted >= 1; } },
    { id: 'aprobado', icon: IC.aprobado, n: { es: 'Primer aprobado', en: 'First pass' }, d: { es: 'Aprueba un examen con 70% o más.', en: 'Pass an exam with 70% or more.' }, ok: function (c) { return c.passed >= 1; } },
    { id: 'perfeccion', icon: IC.estrella, n: { es: 'Perfección', en: 'Perfection' }, d: { es: 'Saca 100% en cualquier examen.', en: 'Score 100% on any exam.' }, ok: function (c) { return c.perfect; } },
    { id: 'maestro', icon: IC.trofeo, n: { es: 'Maestro NVISION', en: 'NVISION Master' }, d: { es: 'Aprueba los cinco exámenes.', en: 'Pass all five exams.' }, ok: function (c) { return c.passed >= c.examsTotal; } },
    { id: 'certificado', icon: IC.certificado, n: { es: 'Certificado en mano', en: 'Certified' }, d: { es: 'Genera y descarga tu primer certificado.', en: 'Generate and download your first certificate.' }, ok: function (c) { return c.certs >= 1; } },
    { id: 'ruta-inicio', icon: IC.bandera, n: { es: 'En ruta', en: 'On the path' }, d: { es: 'Completa el primer paso de la ruta de aprendizaje.', en: 'Complete the first step of the learning path.' }, ok: function (c) { return c.rutaDone >= 1; } },
    { id: 'ruta-mitad', icon: IC.brujula, n: { es: 'Mitad del camino', en: 'Halfway there' }, d: { es: 'Completa 6 pasos de la ruta.', en: 'Complete 6 steps of the path.' }, ok: function (c) { return c.rutaDone >= 6; } },
    { id: 'ruta-completa', icon: IC.corona, n: { es: 'Ruta completa', en: 'Path completed' }, d: { es: 'Termina los 11 pasos de la ruta de aprendizaje.', en: 'Finish all 11 steps of the learning path.' }, ok: function (c) { return c.rutaDone >= c.rutaTotal; } },
    { id: 'taller', icon: IC.llave, n: { es: 'Manos a la obra', en: 'Hands on' }, d: { es: 'Abre el Taller PC y guarda tu primera partida.', en: 'Open the PC Workshop and save your first game.' }, ok: function (c) { return c.wsStarted; } },
    { id: 'entrega', icon: IC.paquete, n: { es: 'Primera entrega', en: 'First delivery' }, d: { es: 'Entrega el primer equipo a un cliente del taller.', en: 'Deliver your first build to a workshop client.' }, ok: function (c) { return c.delivered >= 1; } },
    { id: 'tecnico', icon: IC.nivel, n: { es: 'Técnico en ascenso', en: 'Rising technician' }, d: { es: 'Llega al nivel 3 en el modo carrera del taller.', en: 'Reach level 3 in workshop career mode.' }, ok: function (c) { return c.wsLevel >= 3; } },
    { id: 'racha7', icon: IC.estrella, n: { es: 'Racha de 7 días', en: '7-day streak' }, d: { es: 'Responde la pregunta del día 7 días seguidos.', en: 'Answer the question of the day 7 days in a row.' }, ok: function (c) { return (c.streak || 0) >= 7; } },
    { id: 'racha3', icon: IC.estrella, n: { es: 'Racha de 3 días', en: '3-day streak' }, d: { es: 'Responde la pregunta del día 3 días seguidos.', en: 'Answer the question of the day 3 days in a row.' }, ok: function (c) { return (c.streak || 0) >= 3; } },
    { id: 'respondedor', icon: IC.examen, n: { es: 'Respondedor', en: 'Answerer' }, d: { es: 'Responde 10 preguntas del día en total.', en: 'Answer 10 questions of the day in total.' }, ok: function (c) { return (c.rachaTotal || 0) >= 10; } },
    { id: 'primer-apunte', icon: IC.libro, n: { es: 'Primer apunte', en: 'First note' }, d: { es: 'Escribe tu primer apunte en Mis apuntes.', en: 'Write your first note in My notes.' }, ok: function (c) { return (c.notesTopics || 0) >= 1; } },
    { id: 'diario', icon: IC.libro, n: { es: 'Diario de estudio', en: 'Study journal' }, d: { es: 'Ten apuntes guardados en 3 temas distintos.', en: 'Keep saved notes in 3 different topics.' }, ok: function (c) { return (c.notesTopics || 0) >= 3; } },
    { id: 'consola', icon: IC.terminal, n: { es: 'Operador de consola', en: 'Console operator' }, d: { es: 'Completa las 3 misiones de la terminal simulada.', en: 'Complete all 3 missions of the simulated terminal.' }, ok: function (c) { return (c.termMissions || 0) >= 3; } },
    { id: 'polivalente', icon: IC.nivel, n: { es: 'Polivalente', en: 'Versatile' }, d: { es: 'Presenta exámenes de 3 temas distintos.', en: 'Take exams on 3 different topics.' }, ok: function (c) { return c.attempted >= 3; } },
    { id: 'reto-semana', icon: IC.meta, n: { es: 'Reto cumplido', en: 'Challenge cleared' }, d: { es: 'Completa el reto de la semana de la página principal.', en: 'Complete the weekly challenge from the home page.' }, ok: function (c) { return (c.retoCount || 0) >= 1; } },
    { id: 'primer-diagnostico', icon: IC.terminal, n: { es: 'Primer diagnóstico', en: 'First diagnosis' }, d: { es: 'Resuelve tu primer caso en el minijuego Pantalla Azul.', en: 'Solve your first case in the Blue Screen mini-game.' }, ok: function (c) { return (c.bsodSolved || 0) >= 1; } },
    { id: 'detective-errores', icon: IC.nivel, n: { es: 'Detective de errores', en: 'Error detective' }, d: { es: 'Resuelve 5 casos de Pantalla Azul.', en: 'Solve 5 Blue Screen cases.' }, ok: function (c) { return (c.bsodSolved || 0) >= 5; } },
    { id: 'buen-vecino', icon: IC.libro, n: { es: 'Buen vecino del Taller', en: 'Helpful neighbour' }, d: { es: 'Responde 3 preguntas de la comunidad en el foro El Taller.', en: 'Answer 3 community questions in The Workshop forum.' }, ok: function (c) { return (c.foroAnswers || 0) >= 3; } },
    { id: 'comprador-inteligente', icon: IC.paquete, n: { es: 'Comprador inteligente', en: 'Smart buyer' }, d: { es: 'Supera un reto en el simulador de Presupuestos reales.', en: 'Clear a challenge in the Real budgets simulator.' }, ok: function (c) { return (c.presuWins || 0) >= 1; } },
    { id: 'salvador-red', icon: IC.estrella, n: { es: 'Salvador de la red', en: 'Network saviour' }, d: { es: 'Gana una misión cooperativa en el Redes Challenge.', en: 'Win a cooperative mission in the Networks Challenge.' }, ok: function (c) { return (c.coopWins || 0) >= 1; } }
  ];

  function read(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; } }

  function gather() {
    var ruta = read('nvision_ruta_v1');
    var ex = read('nvision_examenes_v1');
    var ws = read('nvision_workshop_v2');
    var ses = read('nvision_session_v1');
    var rachaDoc = read('nvision_racha_v1');
    var streak = 0;
    if (rachaDoc && rachaDoc.days) {
      var d = new Date();
      var key = function (x) { return x.toISOString().slice(0, 10); };
      if (!rachaDoc.days[key(d)]) d.setDate(d.getDate() - 1);
      while (rachaDoc.days[key(d)]) { streak++; d.setDate(d.getDate() - 1); }
    }
    var notes = read('nvision_apuntes_v1');
    var notesTopics = 0;
    if (notes && notes.topics) Object.keys(notes.topics).forEach(function (k) { if (String(notes.topics[k] || '').trim()) notesTopics++; });
    var retoDoc = read('nvision_reto_v1');
    var retoCount = 0;
    if (retoDoc && retoDoc.done) Object.keys(retoDoc.done).forEach(function (k) { if (retoDoc.done[k]) retoCount++; });
    // Reinicio de Pantalla Azul (2026-11-10, una sola vez por navegador):
    // se elimina el puntaje guardado de ese minijuego y solo ese, para
    // que su aporte a los puntos del sitio arranque en cero.
    try {
      if (localStorage.getItem('nvision_bsod_reset') !== '2026-11-10-v1') {
        localStorage.removeItem('nvision_bsod_v1');
        localStorage.setItem('nvision_bsod_reset', '2026-11-10-v1');
      }
    } catch (e) {}
    var bsod = read('nvision_bsod_v1');
    var bsodSolved = 0, bsodTotal = 0;
    if (bsod && bsod.solved) Object.keys(bsod.solved).forEach(function (k) { if (bsod.solved[k] != null) { bsodSolved++; bsodTotal += bsod.solved[k] || 0; } });
    var foro = read('nvision_foro_v1');
    var presu = read('nvision_presupuestos_v1');
    var coop = read('nvision_coop_v1');
    var term = read('nvision_terminal_v1');
    var termMissions = 0;
    if (term && term.done) term.done.forEach(function (d) { if (d) termMissions++; });
    var results = (ex && ex.results) || {};
    var bestSum = 0;
    EXAM_IDS.forEach(function (id) { if (results[id]) bestSum += results[id].best || 0; });
    var done = 0;
    if (ruta && ruta.done) Object.keys(ruta.done).forEach(function (k) { if (ruta.done[k]) done++; });
    // Los pasos AUTO de la ruta no se guardan en el mapa: se resuelven igual
    // que en ruta.js (taller guardado / algún examen aprobado).
    var anyPassed = EXAM_IDS.some(function (id) { return results[id] && results[id].passed; });
    if (ws && !(ruta && ruta.done && ruta.done.workshop)) done++;
    if (anyPassed && !(ruta && ruta.done && ruta.done.examen)) done++;
    return {
      hasAccount: !!ses, streak: streak, rachaTotal: (rachaDoc && rachaDoc.total) || 0, notesTopics: notesTopics, termMissions: termMissions,
      rutaDone: done, rutaTotal: 11,
      attempted: EXAM_IDS.filter(function (id) { return !!results[id]; }).length,
      passed: EXAM_IDS.filter(function (id) { return results[id] && results[id].passed; }).length,
      examsTotal: EXAM_IDS.length,
      perfect: EXAM_IDS.some(function (id) { return results[id] && results[id].best === 100; }),
      certs: (ex && ex.certs) || 0,
      bestSum: bestSum,
      wsStarted: !!ws,
      delivered: (ws && ws.career && ws.career.delivered) || 0,
      wsLevel: (ws && ws.career && ws.career.level) || 0, retoCount: retoCount,
      bsodSolved: bsodSolved, bsodTotal: bsodTotal, foroAnswers: (foro && foro.answers) || 0, foroSolved: (foro && foro.solvedMine) || 0, presuWins: presu && presu.wins || 0, coopWins: (coop && coop.wins) || 0
    };
  }

  function compute() {
    var ctx = gather();
    var store = read(KEY) || { unlocked: {}, updatedAt: null };
    if (!store.unlocked) store.unlocked = {};
    var fresh = [];
    var list = DEFS.map(function (def) {
      var unlocked = !!def.ok(ctx);
      var isNew = false;
      if (unlocked && !store.unlocked[def.id]) {
        store.unlocked[def.id] = new Date().toISOString();
        fresh.push(def.id);
        isNew = true;
      }
      return { id: def.id, icon: def.icon, name: def.n[lang], desc: def.d[lang], unlocked: unlocked, isNew: isNew, date: store.unlocked[def.id] || null };
    });
    if (fresh.length) {
      store.updatedAt = new Date().toISOString();
      try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
    }
    var count = list.filter(function (a) { return a.unlocked; }).length;
    // El minijuego Pantalla Azul también suma: la cuarta parte de la
    // suma de tus mejores puntajes por caso (máx. 600/4 = 150 pts).
    var bsodBonus = Math.min(150, Math.round((ctx.bsodTotal || 0) / 4));
    var points = ctx.bestSum + ctx.rutaDone * 10 + count * 15 + bsodBonus;
    return { ctx: ctx, list: list, count: count, total: DEFS.length, points: points, fresh: fresh, bsodBonus: bsodBonus };
  }

  var T = {
    es: { of: 'de', seeAll: 'Ver todos', title: 'Logros', sub: 'Medallas por aprender, aprobar y construir en NVISION.', progress: 'Tu progreso de logros', locked: 'Por desbloquear', newBadge: '¡Nuevo!', syncNote: 'Tus logros se calculan con tu progreso de la ruta, los exámenes y el taller. Con una cuenta, también se sincronizan a la nube.', emptyNext: 'Presenta un examen, avanza en la ruta o abre el taller para ganar tu primera medalla.' },
    en: { of: 'of', seeAll: 'See all', title: 'Achievements', sub: 'Badges for learning, passing and building on NVISION.', progress: 'Your achievement progress', locked: 'Locked', newBadge: 'New!', syncNote: 'Your achievements are computed from your learning path, exam and workshop progress. With an account they also sync to the cloud.', emptyNext: 'Take an exam, advance on the path or open the workshop to earn your first badge.' }
  }[lang];

  function renderStrip(el) {
    var r = compute();
    var last = r.list.filter(function (a) { return a.unlocked; }).slice(-3).reverse();
    var chips = last.map(function (a) {
      return '<span class="strip-chip" title="' + a.name + '"><span class="strip-chip-icon">' + a.icon + '</span>' + a.name + '</span>';
    }).join('');
    el.innerHTML =
      '<div class="strip-head"><span class="strip-trophy">' + IC.trofeo + '</span>' +
      '<b>' + r.count + ' ' + T.of + ' ' + r.total + ' ' + T.title.toLowerCase() + '</b>' +
      '<a href="logros.html">' + T.seeAll + '</a></div>' +
      (chips ? '<div class="strip-chips">' + chips + '</div>' : '<p class="strip-empty">' + T.emptyNext + '</p>');
  }

  function renderPage() {
    var grid = document.getElementById('logros-grid');
    if (!grid) return;
    var r = compute();
    var bar = document.getElementById('logros-bar-fill');
    var count = document.getElementById('logros-count');
    var pts = document.getElementById('logros-points');
    if (bar) bar.style.width = Math.round((r.count / r.total) * 100) + '%';
    if (count) count.textContent = r.count + ' ' + T.of + ' ' + r.total;
    if (pts) pts.textContent = r.points;
    grid.innerHTML = '';
    r.list.forEach(function (a) {
      var card = document.createElement('article');
      card.className = 'logro-card' + (a.unlocked ? ' unlocked' : ' locked') + (a.isNew ? ' fresh' : '');
      card.innerHTML =
        '<div class="logro-icon">' + a.icon + '</div>' +
        '<h3>' + a.name + '</h3>' +
        '<p>' + a.desc + '</p>' +
        (a.isNew ? '<span class="logro-new">' + T.newBadge + '</span>'
          : a.unlocked ? '<span class="logro-date">' + new Date(a.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-CO', { year: 'numeric', month: 'short', day: 'numeric' }) + '</span>'
          : '<span class="logro-lock">' + T.locked + '</span>');
      grid.appendChild(card);
    });
  }

  window.NVISION_LOGROS = { compute: compute, renderStrip: renderStrip, T: T };
  document.addEventListener('DOMContentLoaded', renderPage);
})();
