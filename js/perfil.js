// NVISION - Perfil público de un estudiante (desde site_ranking).
(function () {
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var T = {
    es: { loading: 'Cargando…', notFound: 'Este perfil no existe o aún no publica su puntaje.', pending: 'El ranking aún no está activado.', points: 'puntos', rank: 'del ranking', since: 'Última actualización' },
    en: { loading: 'Loading…', notFound: 'This profile does not exist or has not published a score yet.', pending: 'The ranking is not active yet.', points: 'points', rank: 'in the ranking', since: 'Last updated' }
  }[lang];
  var card = document.getElementById('profile-card');
  var msg = document.getElementById('profile-msg');
  var uid = new URLSearchParams(location.search).get('u') || '';
  if (!/^[0-9a-fA-F-]{36}$/.test(uid)) { msg.textContent = T.notFound; return; }

  var key = window.NVISION_SUPABASE_ANON_KEY;
  fetch('https://xiuztrujrwdgcpjrruxu.supabase.co/rest/v1/site_ranking?select=user_id,name,avatar,avatar_image,points,updated_at&order=points.desc,updated_at.asc&limit=500', {
    headers: { apikey: key, Authorization: 'Bearer ' + key }
  }).then(function (r) {
    if (!r.ok) throw new Error('pending');
    return r.json();
  }).then(function (rows) {
    var idx = -1, row = null;
    rows.forEach(function (r, i) { if (r.user_id === uid) { idx = i; row = r; } });
    if (!row) { msg.textContent = T.notFound; return; }
    card.innerHTML = '';
    var chip = document.createElement('div');
    chip.className = 'profile-chip';
    if (window.NVISION_avatarChip) chip.innerHTML = window.NVISION_avatarChip(row.avatar, row.name || '?', row.avatar_image);
    var name = document.createElement('h2'); name.textContent = row.name || '—';
    var pts = document.createElement('p'); pts.className = 'profile-points';
    pts.textContent = row.points + ' ' + T.points;
    var rank = document.createElement('p'); rank.className = 'profile-rank';
    rank.textContent = '#' + (idx + 1) + ' ' + T.rank + ' · ' + T.since + ': ' + new Date(row.updated_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-CO');
    card.append(chip, name, pts, rank);
  }).catch(function () { msg.textContent = T.pending; });
})();
