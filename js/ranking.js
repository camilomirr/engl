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
    es: { week: 'Esta semana', global: 'Global', emptyWeek: 'Nadie ha publicado o actualizado su puntaje esta semana. Publica el tuyo desde Mi cuenta y estrena el ranking semanal.', loading: 'Cargando el ranking…', pending: 'El ranking está casi listo: falta activarlo en la base de datos del equipo. Mientras tanto, publica tu puntaje desde Mi cuenta y aparecerás en cuanto se active.', empty: 'Todavía no hay puntajes publicados. Sé la primera persona en publicar el tuyo desde Mi cuenta.', error: 'No se pudo cargar el ranking. Revisa tu conexión e inténtalo de nuevo.', points: 'puntos', you: 'Tú', formula: 'Puntaje = suma de tus mejores notas de examen + 10 por cada paso de la ruta + 15 por cada logro.' },
    en: { week: 'This week', global: 'Overall', emptyWeek: 'Nobody has published or updated their score this week yet. Publish yours from My account and open the weekly ranking.', loading: 'Loading the ranking…', pending: 'The ranking is almost ready: the team still needs to enable it in the database. Meanwhile, publish your score from My account and you will appear as soon as it is on.', empty: 'No scores published yet. Be the first to publish yours from My account.', error: 'The ranking could not be loaded. Check your connection and try again.', points: 'points', you: 'You', formula: 'Score = sum of your best exam grades + 10 per learning-path step + 15 per achievement.' }
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

  var btnG = document.getElementById('rank-mode-global');
  var btnW = document.getElementById('rank-mode-week');
  if (btnG) btnG.textContent = T.global;
  if (btnW) btnW.textContent = T.week;
  var allRows = null, mode = 'global';

  function monday() { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; }

  function paint() {
    if (!allRows) return;
    var rows = allRows;
    if (mode === 'week') {
      var m = monday();
      rows = allRows.filter(function (r) { return r.updated_at && new Date(r.updated_at) >= m; });
      if (!rows.length) { showState(T.emptyWeek); return; }
    }
    rows = rows.slice(0, 20);
    state.hidden = true;
    var uid = myId();
    body.innerHTML = '';
    var data = rows;
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
          // Capa de validación: el puntaje viene de la base y se pinta
          // con innerHTML; se fuerza a entero 0..100000 para que un
          // valor texto/HTML nunca llegue al DOM (el nombre ya se pone
          // con textContent más abajo).
          '<td class="rank-pts">' + (window.NVISION_validate ? window.NVISION_validate.safePoints(row.points) : (parseInt(row.points, 10) || 0)) + ' <span>' + T.points + '</span></td>';
        var nameB = tr.querySelector('b');
        nameB.textContent = row.name || '—';
        // El nombre enlaza al perfil público del estudiante.
        var link = document.createElement('a');
        link.href = 'perfil.html?u=' + encodeURIComponent(row.user_id);
        link.className = 'rank-profile-link';
        nameB.parentNode.insertBefore(link, nameB);
        link.appendChild(nameB);
        body.appendChild(tr);
      });
  }

  if (btnG) btnG.addEventListener('click', function () { mode = 'global'; btnG.classList.add('on'); btnW.classList.remove('on'); paint(); });
  if (btnW) btnW.addEventListener('click', function () { mode = 'week'; btnW.classList.add('on'); btnG.classList.remove('on'); paint(); });

  showState(T.loading);
  window.NVISION_sb.get('/rest/v1/site_ranking?select=user_id,name,avatar,avatar_image,points,updated_at&order=points.desc,updated_at.asc&limit=50')
    .then(function (data) {
      if (!Array.isArray(data) || !data.length) { showState(T.empty); return; }
      allRows = data;
      paint();
    }).catch(function (e) {
      // 404 / tabla inexistente: queda pendiente de activación por el equipo.
      if (e && e.message === 'http 404') { showState(T.pending); return; }
      showState(T.error);
    });
})();
