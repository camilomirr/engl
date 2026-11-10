// NVISION · Foro de Soporte Comunitario «El Taller» (2026-11-10)
// Preguntas y respuestas en Supabase (tablas foro_preguntas /
// foro_respuestas, SQL en supabase/foro.sql). Leer es público; publicar
// exige cuenta y cada fila va atada a su dueño (RLS). El autor de la
// pregunta marca la respuesta que lo solucionó. Todo el texto de los
// usuarios se pinta con textContent y se limpia con NVISION_validate.
// La actividad local (respuestas dadas, soluciones logradas) se guarda
// en nvision_foro_v1 y alimenta los logros del sitio.
(function () {
  'use strict';
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var KEY = 'nvision_foro_v1';
  var V = window.NVISION_validate;
  var SB = window.NVISION_sb;

  var T = {
    es: { needLogin: 'Para publicar necesitas una cuenta NVISION: entra en Mi cuenta y vuelve aquí.', hi: 'Publicas como', loading: 'Cargando preguntas…', empty: 'Todavía no hay preguntas. ¡Sé la primera persona en preguntar!', answers: 'respuestas', solvedTag: 'Solucionada', openTag: 'Abierta', view: 'Ver y responder', markSolved: 'Marcar como solución', solvedBadge: '✓ Solución', by: 'por', publishOk: '¡Pregunta publicada!', publishErr: 'No se pudo publicar. Revisa tu sesión e inténtalo de nuevo.', answerOk: '¡Respuesta enviada! Gracias por ayudar.', answerErr: 'No se pudo enviar. Revisa tu sesión e inténtalo de nuevo.', tooShortQ: 'Cuéntanos un poco más: el título necesita 4+ caracteres y el detalle 10+.', tooShortA: 'La respuesta necesita al menos 2 caracteres.', markedOk: 'Solución marcada. ¡Gracias por cerrar el caso!', netErr: 'Sin conexión con el foro. Inténtalo más tarde.' },
    en: { needLogin: 'You need an NVISION account to post: sign in under My account and come back.', hi: 'Posting as', loading: 'Loading questions…', empty: 'No questions yet. Be the first to ask!', answers: 'answers', solvedTag: 'Solved', openTag: 'Open', view: 'View and answer', markSolved: 'Mark as solution', solvedBadge: '✓ Solution', by: 'by', publishOk: 'Question published!', publishErr: 'Could not publish. Check your session and try again.', answerOk: 'Answer sent! Thanks for helping.', answerErr: 'Could not send. Check your session and try again.', tooShortQ: 'Tell us a bit more: title needs 4+ characters and details 10+.', tooShortA: 'The answer needs at least 2 characters.', markedOk: 'Solution marked. Thanks for closing the case!', netErr: 'Cannot reach the forum. Try again later.' }
  }[lang];

  function $(id) { return document.getElementById(id); }
  function session() { return window.NVISION_session ? window.NVISION_session.get() : null; }
  function myName(s) {
    var raw = (s && (s.fullName || s.firstName)) || (s && s.email ? String(s.email).split('@')[0] : 'NVISION');
    return V ? V.cleanName(raw, 60) : String(raw).slice(0, 60);
  }
  function load() { try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d) return d; } catch (e) {} return { answers: 0, solvedMine: 0 }; }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  function fmtDate(iso) { try { return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-CO', { day: 'numeric', month: 'short' }); } catch (e) { return ''; } }

  var listEl = $('foro-list'), detailEl = $('foro-detail'), current = null, counts = {};

  function authNote() {
    var s = session(), note = $('foro-auth-note');
    if (!note) return;
    note.textContent = s ? T.hi + ' ' + myName(s) + '.' : T.needLogin;
  }

  function showOff() { var off = $('foro-off'); if (off) off.hidden = false; if (listEl) listEl.innerHTML = ''; }

  function loadQuestions() {
    if (!SB) { showOff(); return; }
    SB.get('/rest/v1/foro_preguntas?select=id,user_id,autor,titulo,cuerpo,etiqueta,solucion_id,created_at&order=created_at.desc&limit=50')
      .then(function (qs) {
        if (!Array.isArray(qs)) { showOff(); return; }
        return SB.get('/rest/v1/foro_respuestas?select=pregunta_id&limit=500').then(function (rs) {
          counts = {};
          (rs || []).forEach(function (r) { counts[r.pregunta_id] = (counts[r.pregunta_id] || 0) + 1; });
          renderList(qs);
          syncSolvedMine(qs);
        });
      })
      .catch(function (e) {
        if (String(e && e.message).indexOf('404') >= 0) showOff();
        else if (listEl) listEl.textContent = T.netErr;
      });
  }

  // Si alguna respuesta mía quedó marcada como solución, se cuenta
  // para el logro «Manos que ayudan» la próxima vez que entro al foro.
  function syncSolvedMine(qs) {
    var s = session(); if (!s || !s.userId) return;
    var solvedIds = {};
    qs.forEach(function (q) { if (q.solucion_id) solvedIds[q.solucion_id] = true; });
    if (!Object.keys(solvedIds).length) return;
    SB.get('/rest/v1/foro_respuestas?select=id&user_id=eq.' + encodeURIComponent(s.userId)).then(function (mine) {
      var n = (mine || []).filter(function (a) { return solvedIds[a.id]; }).length;
      var d = load(); if (d.solvedMine !== n) { d.solvedMine = n; save(d); }
    }).catch(function () {});
  }

  function renderList(qs) {
    listEl.innerHTML = '';
    if (!qs.length) { listEl.textContent = T.empty; return; }
    qs.forEach(function (q) {
      var item = document.createElement('article');
      item.className = 'foro-item';
      var tag = document.createElement('span');
      tag.className = 'foro-tag mejora-chip'; tag.textContent = q.etiqueta;
      var solved = document.createElement('span');
      solved.className = 'foro-tag mejora-chip'; solved.textContent = q.solucion_id ? '✓ ' + T.solvedTag : T.openTag;
      var h = document.createElement('h3'); h.className = 'foro-q-title'; h.textContent = q.titulo;
      var meta = document.createElement('p'); meta.className = 'foro-meta';
      meta.textContent = T.by + ' ' + q.autor + ' · ' + fmtDate(q.created_at) + ' · ' + (counts[q.id] || 0) + ' ' + T.answers;
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'tool-btn tool-btn-ghost'; btn.textContent = T.view;
      btn.addEventListener('click', function () { openQuestion(q); });
      item.appendChild(tag); item.appendChild(document.createTextNode(' ')); item.appendChild(solved);
      item.appendChild(h); item.appendChild(meta); item.appendChild(btn);
      listEl.appendChild(item);
    });
  }

  function openQuestion(q) {
    current = q;
    detailEl.hidden = false;
    var body = $('foro-detail-body');
    body.innerHTML = '';
    var tag = document.createElement('span'); tag.className = 'foro-tag mejora-chip'; tag.textContent = q.etiqueta;
    var h = document.createElement('h2'); h.textContent = q.titulo;
    var meta = document.createElement('p'); meta.className = 'foro-meta'; meta.textContent = T.by + ' ' + q.autor + ' · ' + fmtDate(q.created_at);
    var p = document.createElement('p'); p.textContent = q.cuerpo; p.style.whiteSpace = 'pre-wrap';
    body.appendChild(tag); body.appendChild(h); body.appendChild(meta); body.appendChild(p);
    loadAnswers(q);
    detailEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function loadAnswers(q) {
    var box = $('foro-answers');
    box.innerHTML = ''; box.textContent = T.loading;
    SB.get('/rest/v1/foro_respuestas?select=id,user_id,autor,cuerpo,created_at&pregunta_id=eq.' + q.id + '&order=created_at.asc&limit=200')
      .then(function (rs) {
        box.textContent = '';
        var s = session();
        (rs || []).forEach(function (a) {
          var div = document.createElement('div');
          div.className = 'foro-answer' + (q.solucion_id === a.id ? ' solved' : '');
          var meta = document.createElement('p'); meta.className = 'foro-meta';
          meta.textContent = a.autor + ' · ' + fmtDate(a.created_at) + (q.solucion_id === a.id ? ' · ' + T.solvedBadge : '');
          var p = document.createElement('p'); p.textContent = a.cuerpo; p.style.whiteSpace = 'pre-wrap'; p.style.margin = '4px 0';
          div.appendChild(meta); div.appendChild(p);
          if (s && s.userId === q.user_id && q.solucion_id !== a.id) {
            var b = document.createElement('button');
            b.type = 'button'; b.className = 'tool-btn tool-btn-ghost'; b.textContent = T.markSolved;
            b.addEventListener('click', function () { markSolved(q, a.id); });
            div.appendChild(b);
          }
          box.appendChild(div);
        });
        if (!(rs || []).length) box.textContent = T.empty;
      })
      .catch(function () { box.textContent = T.netErr; });
  }

  function markSolved(q, answerId) {
    var s = session(); if (!s) return;
    window.NVISION_sbAuth('/rest/v1/foro_preguntas?id=eq.' + q.id, { method: 'PATCH', token: s.access, body: { solucion_id: answerId } })
      .then(function (res) {
        if (res.status === 200 || res.status === 204) {
          q.solucion_id = answerId;
          $('foro-answer-msg').textContent = T.markedOk;
          loadAnswers(q); loadQuestions();
        } else $('foro-answer-msg').textContent = T.answerErr;
      }).catch(function () { $('foro-answer-msg').textContent = T.answerErr; });
  }

  var form = $('foro-form');
  if (form) form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var msg = $('foro-msg'), s = session();
    if (!s || !s.access) { msg.textContent = T.needLogin; return; }
    var titulo = V ? V.cleanText($('foro-titulo').value, 120) : $('foro-titulo').value.slice(0, 120);
    var cuerpo = V ? V.cleanText($('foro-cuerpo').value, 2000) : $('foro-cuerpo').value.slice(0, 2000);
    if (titulo.length < 4 || cuerpo.length < 10) { msg.textContent = T.tooShortQ; return; }
    window.NVISION_sbAuth('/rest/v1/foro_preguntas', {
      method: 'POST', token: s.access, headers: { 'Prefer': 'return=minimal' },
      body: { user_id: s.userId, autor: myName(s), titulo: titulo, cuerpo: cuerpo, etiqueta: $('foro-etiqueta').value }
    }).then(function (res) {
      if (res.status === 200 || res.status === 201 || res.status === 204) {
        msg.textContent = T.publishOk; form.reset(); loadQuestions();
      } else if (res.status === 404) showOff();
      else msg.textContent = T.publishErr;
    }).catch(function () { msg.textContent = T.publishErr; });
  });

  var aform = $('foro-answer-form');
  if (aform) aform.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var msg = $('foro-answer-msg'), s = session();
    if (!current) return;
    if (!s || !s.access) { msg.textContent = T.needLogin; return; }
    var cuerpo = V ? V.cleanText($('foro-answer-text').value, 2000) : $('foro-answer-text').value.slice(0, 2000);
    if (cuerpo.length < 2) { msg.textContent = T.tooShortA; return; }
    window.NVISION_sbAuth('/rest/v1/foro_respuestas', {
      method: 'POST', token: s.access, headers: { 'Prefer': 'return=minimal' },
      body: { pregunta_id: current.id, user_id: s.userId, autor: myName(s), cuerpo: cuerpo }
    }).then(function (res) {
      if (res.status === 200 || res.status === 201 || res.status === 204) {
        var d = load(); d.answers = (d.answers || 0) + 1; save(d);
        msg.textContent = T.answerOk; aform.reset(); loadAnswers(current); loadQuestions();
      } else if (res.status === 404) showOff();
      else msg.textContent = T.answerErr;
    }).catch(function () { msg.textContent = T.answerErr; });
  });

  var back = $('foro-back');
  if (back) back.addEventListener('click', function () { detailEl.hidden = true; current = null; });
  authNote();
  loadQuestions();
})();
