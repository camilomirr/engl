/* NVISION · Ranking del sitio.
   Lee la tabla pública site_ranking de Supabase (puntaje = mejores notas de
   exámenes + pasos de la ruta x10 + logros x15). Los estudiantes publican su
   puntaje desde Mi cuenta. Si la tabla aún no existe en el proyecto, la
   página muestra un aviso de "muy pronto" en vez de romperse. */
(function () {
  'use strict';
  // Cliente de Supabase: vive en js/main.js (window.NVISION_sb). Antes esta
  // página usaba una llave publicable sb_publishable_... que el servidor
  // rechazaba con 401: el ranking nunca cargaba datos reales.
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';

  var T = {
    es: { loading: 'Cargando el ranking…', pending: 'El ranking está casi listo: falta activarlo en la base de datos del equipo. Mientras tanto, publica tu puntaje desde Mi cuenta y aparecerás en cuanto se active.', empty: 'Todavía no hay puntajes publicados. Sé la primera persona en publicar el tuyo desde Mi cuenta.', error: 'No se pudo cargar el ranking. Revisa tu conexión e inténtalo de nuevo.', points: 'puntos', you: 'Tú', formula: 'Puntaje = suma de tus mejores notas de examen + 10 por cada paso de la ruta + 15 por cada logro.' },
    en: { loading: 'Loading the ranking…', pending: 'The ranking is almost ready: the team still needs to enable it in the database. Meanwhile, publish your score from My account and you will appear as soon as it is on.', empty: 'No scores published yet. Be the first to publish yours from My account.', error: 'The ranking could not be loaded. Check your connection and try again.', points: 'points', you: 'You', formula: 'Score = sum of your best exam grades + 10 per learning-path step + 15 per achievement.' }
  }[lang];

  var body = document.getElementById('rank-body');
  var state = document.getElementById('rank-state');
  var formula = document.getElementById('rank-formula');
  if (formula) formula.textContent = T.formula;
  if (!body || !state) return;

  function myId() {
    try { var s = JSON.parse(localStorage.getItem('nvision_session_v1') || 'null'); return s && s.userId; } catch (e) { return null; }
  }

  function showState(msg) { state.hidden = false; state.textContent = msg; body.innerHTML = ''; }

  showState(T.loading);
  window.NVISION_sb.get('/rest/v1/site_ranking?select=user_id,name,avatar,avatar_image,points&order=points.desc,updated_at.asc&limit=20')
    .then(function (data) {
      if (!Array.isArray(data) || !data.length) { showState(T.empty); return; }
      state.hidden = true;
      var uid = myId();
      body.innerHTML = '';
      data.forEach(function (row, i) {
        var tr = document.createElement('tr');
        if (uid && row.user_id === uid) tr.className = 'rank-me';
        var chip = '';
        if (window.NVISION_avatarChip) {
          var tmp = document.createElement('span');
          tmp.innerHTML = window.NVISION_avatarChip(row.avatar, row.name || '?', row.avatar_image);
          chip = tmp.innerHTML;
        }
        tr.innerHTML =
          '<td class="rank-pos">' + (i + 1) + '</td>' +
          '<td><span class="rank-who">' + chip + '<b></b>' + (uid && row.user_id === uid ? ' <span class="rank-you">' + T.you + '</span>' : '') + '</span></td>' +
          '<td class="rank-pts">' + row.points + ' <span>' + T.points + '</span></td>';
        tr.querySelector('b').textContent = row.name || '—';
        body.appendChild(tr);
      });
    }).catch(function (e) {
      // 404 / tabla inexistente: queda pendiente de activación por el equipo.
      if (e && e.message === 'http 404') { showState(T.pending); return; }
      showState(T.error);
    });
})();
