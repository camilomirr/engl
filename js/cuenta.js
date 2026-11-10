// NVISION - Mi cuenta: registro e inicio de sesión con Supabase Auth y
// sincronización del progreso (ruta, exámenes y Workshop) en la tabla user_progress.
// La llave anon es pública por diseño (la misma que ya usa el widget de equipo).
(function () {
  'use strict';

  // URL de Supabase: vive en js/main.js (NVISION_SUPABASE_URL). Se usa
  // aquí para la URL de autorización de Google; el cliente de auth es
  // window.NVISION_sbAuth, compartido con examenes.js (ver main.js).
  var SUPABASE_URL = window.NVISION_SUPABASE_URL;
  var GOOGLE_CLIENT_ID = '855201454498-es9vkd7vqq2eli18g1rtprtvguqimn71.apps.googleusercontent.com';
  var META_KEY = 'nvision_sync_meta_v1';
  var SYNC_KEYS = ['nvision_ruta_v1', 'nvision_examenes_v1', 'nvision_workshop_v2', 'nvision_logros_v1', 'nvision_racha_v1', 'nvision_apuntes_v1', 'nvision_terminal_v1', 'nvision_historial_v1', 'nvision_reto_v1', 'nvision_srs_v1'];
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';

  var T = {
    es: {
      loginT: 'Iniciar sesión', registerT: 'Crear cuenta', loginB: 'Entrar', registerB: 'Registrarme',
      switchReg: '¿No tienes cuenta? Regístrate', switchLogin: '¿Ya tienes cuenta? Inicia sesión',
      working: 'Un momento…', needFields: 'Escribe tu correo y una contraseña de al menos 6 caracteres.',
      confirmEmail: 'Cuenta creada. Revisa tu correo y confirma el enlace que te enviamos; después inicia sesión aquí.',
      badLogin: 'Correo o contraseña incorrectos, o la cuenta aún no está confirmada por correo.',
      userExists: 'Ese correo ya tiene una cuenta. Inicia sesión.',
      netErr: 'Sin conexión con el servidor. Revisa tu internet e inténtalo otra vez.',
      loggedAs: 'Sesión iniciada como',
      avatarSaved: 'Avatar guardado. Se verá en el botón de Mi cuenta en todo el sitio.', avatarErr: 'No se pudo guardar el avatar. Inténtalo otra vez.', avatarInitial: 'Inicial',
      avatarPhoto: 'Foto', avatarRemove: 'Quitar foto', avatarImgErr: 'Esa imagen no se pudo usar. Prueba con otra.',
      googleOff: 'El ingreso con Google aún no está activado por el equipo. Por ahora entra con tu correo y contraseña.',
      forgotNeedEmail: 'Escribe tu correo arriba para enviarte el enlace.',
      forgotSent: 'Te enviamos un correo con el enlace para crear una nueva contraseña. Revisa también el correo no deseado.',
      forgotErr: 'No se pudo enviar el correo. Inténtalo otra vez.',
      passMismatch: 'Las contraseñas no coinciden.',
      resetOk: 'Contraseña actualizada. Ya puedes entrar.',
      resetErr: 'No se pudo cambiar la contraseña. Pide otro enlace.',
      resetShort: 'Escribe una contraseña nueva de al menos 6 caracteres.',
      syncing: 'Sincronizando…',
      showPass: 'Mostrar contraseña',
      hidePass: 'Ocultar contraseña',
      rankOk: '¡Puntaje publicado en el ranking con', rankPts: 'puntos!',
      rankOff: 'El ranking aún no está activado por el equipo (falta crear su tabla en Supabase). Tu puntaje ya quedó calculado y podrás publicarlo en cuanto se active.',
      rankErr: 'No se pudo publicar el puntaje ahora. Inténtalo otra vez.',
      rankRemoved: 'Ya no apareces en el ranking.',
      rankRemoveErr: 'No se pudo quitarte del ranking ahora. Inténtalo otra vez.',
      nextMissing: 'Te faltan', nextRuta: 'pasos de la ruta', nextExams: 'exámenes por aprobar', nextJoin: 'y',
      nextDone: 'Ya completaste la ruta y aprobaste todos los exámenes. ¡Nivel máximo!',
      statRuta: 'Ruta', statExams: 'Exámenes', statPoints: 'Puntos',
      needName: 'Escribe tu nombre y apellido.',
      profileSaved: 'Datos actualizados.',
      profileErr: 'No se pudieron guardar los datos. Inténtalo otra vez.'
    },
    en: {
      loginT: 'Log in', registerT: 'Create account', loginB: 'Log in', registerB: 'Sign up',
      switchReg: "Don't have an account? Sign up", switchLogin: 'Already have an account? Log in',
      working: 'One moment…', needFields: 'Enter your email and a password of at least 6 characters.',
      confirmEmail: 'Account created. Check your email and confirm the link we sent you; then log in here.',
      badLogin: 'Wrong email or password, or the account is not email-confirmed yet.',
      userExists: 'That email already has an account. Log in instead.',
      netErr: 'No connection to the server. Check your internet and try again.',
      loggedAs: 'Logged in as',
      avatarSaved: 'Avatar saved. It will show on the My account button across the site.', avatarErr: 'Could not save the avatar. Try again.', avatarInitial: 'Initial',
      avatarPhoto: 'Photo', avatarRemove: 'Remove photo', avatarImgErr: 'That image could not be used. Try another one.',
      googleOff: 'Google sign-in is not enabled by the team yet. For now, log in with your email and password.',
      forgotNeedEmail: 'Type your email above so we can send you the link.',
      forgotSent: 'We sent you an email with the link to create a new password. Check your spam folder too.',
      forgotErr: 'Could not send the email. Try again.',
      passMismatch: 'The passwords do not match.',
      resetOk: 'Password updated. You can log in now.',
      resetErr: 'Could not change the password. Request another link.',
      resetShort: 'Enter a new password of at least 6 characters.',
      syncing: 'Syncing…',
      showPass: 'Show password',
      hidePass: 'Hide password',
      rankOk: 'Score published to the ranking with', rankPts: 'points!',
      rankOff: 'The ranking is not enabled by the team yet (its Supabase table still needs to be created). Your score is already computed and you will be able to publish it as soon as it is on.',
      rankErr: 'Could not publish the score right now. Try again.',
      rankRemoved: 'You no longer appear in the ranking.',
      rankRemoveErr: 'Could not remove you from the ranking right now. Try again.',
      nextMissing: 'You still need', nextRuta: 'path steps', nextExams: 'exams to pass', nextJoin: 'and',
      nextDone: 'You completed the path and passed every exam. Max level!',
      statRuta: 'Path', statExams: 'Exams', statPoints: 'Points',
      needName: 'Enter your first and last name.',
      profileSaved: 'Details updated.',
      profileErr: 'Could not save your details. Try again.'
    }
  }[lang];

  function $(id) { return document.getElementById(id); }
  function msg(kind, text) {
    var el = $('cuenta-msg');
    el.className = 'cuenta-msg on cuenta-msg--' + kind;
    el.textContent = text;
  }
  function clearMsg() { $('cuenta-msg').className = 'cuenta-msg'; }

  // Sesión: vive en js/main.js (window.NVISION_session, compartida con
  // examenes.js); aquí solo se usan sus funciones.
  function getSession() { return window.NVISION_session.get(); }
  function setSession(s) { window.NVISION_session.set(s); }
  function clearSession() { window.NVISION_session.clear(); }

  // Regreso opcional tras iniciar sesión: cuenta.html?next=examenes.html
  // (solo destinos internos de la lista, nada externo).
  function nextTarget() {
    try {
      var n = new URLSearchParams(location.search).get('next');
      return ['examenes.html', 'ruta.html', 'index.html'].indexOf(n) >= 0 ? n : null;
    } catch (e) { return null; }
  }
  function goNext() { var n = nextTarget(); if (n) { location.href = n; return true; } return false; }

  function saveSessionFromAuth(data, email, fallbackPicture) {
    var s = window.NVISION_session.saveFromAuth(data, email, fallbackPicture);
    // Guardar la foto en la cuenta (ver persistGoogleAvatar): así queda
    // guardada de verdad y no solo en este aparato.
    persistGoogleAvatar(s);
    return s;
  }

  // Foto de Google desde el token de identidad: Google la entrega en el
  // propio token (campo picture), así que si Supabase no la trae en los
  // metadatos, se lee de aquí sin depender de nada más.
  function pictureFromIdToken(token) {
    try {
      var parts = (token || '').split('.');
      if (parts.length < 2) return null;
      var json = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return (json && json.picture) || null;
    } catch (e) { return null; }
  }
  // Foto de Google guardada en la cuenta: se descarga la foto, se recorta
  // a cuadrada 256px (igual que la foto subida) y se guarda como
  // avatar_image en Supabase, para que quede guardada en la cuenta y se
  // vea en cualquier aparato sin depender de la URL remota. Solo si el
  // usuario no eligió otra foto o avatar, y solo una vez por URL (si
  // cambia su foto de Google, la URL cambia y se vuelve a guardar).
  // Si la descarga falla, no pasa nada: queda la URL remota de respaldo
  // y el chip ya no muestra el icono roto (ver js/main.js).
  var GOOGLE_AVATAR_SAVED_KEY = 'nvision_google_avatar_saved_v1';
  var googleAvatarPersisting = null;
  function persistGoogleAvatar(s) {
    if (!s || !s.googleAvatar || !s.access) return;
    if ((s.avatar && s.avatar !== 'initial') || s.avatarImg) return;
    try { if (localStorage.getItem(GOOGLE_AVATAR_SAVED_KEY) === s.googleAvatar) return; } catch (e) {}
    if (googleAvatarPersisting === s.googleAvatar) return;
    googleAvatarPersisting = s.googleAvatar;
    var done = function () { googleAvatarPersisting = null; };
    fetch(s.googleAvatar, { mode: 'cors' }).then(function (r) {
      if (!r.ok) throw new Error('no-photo');
      return r.blob();
    }).then(function (blob) {
      if (!blob || blob.size > 500000 || blob.type.indexOf('image/') !== 0) throw new Error('no-photo');
      return new Promise(function (resolve, reject) {
        var url = URL.createObjectURL(blob);
        var img = new Image();
        img.onload = function () {
          try {
            var size = 256, canvas = document.createElement('canvas');
            canvas.width = size; canvas.height = size;
            var side = Math.min(img.width, img.height);
            canvas.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
            var out = canvas.toDataURL('image/jpeg', 0.82);
            if (out.length > 90000) out = canvas.toDataURL('image/jpeg', 0.55);
            URL.revokeObjectURL(url);
            resolve(out);
          } catch (e) { URL.revokeObjectURL(url); reject(e); }
        };
        img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('no-photo')); };
        img.src = url;
      });
    }).then(function (out) {
      if (!window.NVISION_validAvatarImg || !window.NVISION_validAvatarImg(out)) throw new Error('bad-img');
      // Se guarda también avatar: 'custom': es la marca que hace que el
      // ranking (y el perfil público) pinten la foto. Sin ella la fila
      // del ranking quedaba con avatar 'initial'/null y el chip mostraba
      // solo la inicial aunque la foto sí estuviera guardada.
      return window.NVISION_sbAuth('/auth/v1/user', { method: 'PUT', token: s.access, body: { data: { avatar: 'custom', avatar_image: out } } })
        .then(function (r) { if (r.status !== 200) throw new Error('no-save'); return out; });
    }).then(function (out) {
      try { localStorage.setItem(GOOGLE_AVATAR_SAVED_KEY, s.googleAvatar); } catch (e) {}
      s.avatar = 'custom'; s.avatarImg = out; setSession(s);
      renderProfilePhoto();
      if (window.NVISION_renderAccountChip) window.NVISION_renderAccountChip();
      // La foto ya está guardada en la cuenta: si el puntaje ya estaba
      // publicado, la fila del ranking se actualiza sola con la foto.
      syncRankingPhoto(s);
      done();
    }).catch(function () { done(); });
  }

  // Foto que debe verse de esta persona en el ranking: la foto guardada
  // (subida o de Google) o, si la de Google aún no se ha guardado en la
  // cuenta, su URL oficial (válida en la base) para que se vea desde ya.
  // Con avatar SVG elegido no hay foto que publicar. Si el usuario quitó
  // su foto (avatar 'initial'), no se vuelve a poner la de Google.
  function rankingPhoto(s) {
    if (!s) return null;
    var isSvg = s.avatar && s.avatar !== 'custom' && s.avatar !== 'initial';
    if (isSvg) return null;
    var V = window.NVISION_validAvatarImg;
    if (s.avatarImg && (!V || V(s.avatarImg))) return { avatar: 'custom', avatar_image: s.avatarImg };
    if (s.avatar !== 'initial' && s.googleAvatar && (!V || V(s.googleAvatar))) return { avatar: 'custom', avatar_image: s.googleAvatar };
    return null;
  }
  // Sincroniza la foto con la fila del ranking ya publicada (si existe):
  // así las fotos aparecen aunque el puntaje se haya publicado antes de
  // que la foto se guardara. Solo escribe cuando la fila existe y la foto
  // cambió; la marca local evita repetir la consulta en cada visita.
  var RANKING_PHOTO_SYNC_KEY = 'nvision_ranking_photo_synced_v1';
  function rankingPhotoKey(img) { return img.length + ':' + img.slice(0, 48); }
  function syncRankingPhoto(s) {
    var photo = rankingPhoto(s);
    if (!photo || !s.access || !s.userId || !window.NVISION_sbAuth) return;
    try { if (localStorage.getItem(RANKING_PHOTO_SYNC_KEY) === rankingPhotoKey(photo.avatar_image)) return; } catch (e) {}
    window.NVISION_sbAuth('/rest/v1/site_ranking?user_id=eq.' + encodeURIComponent(s.userId) + '&select=user_id,avatar,avatar_image', { token: s.access })
      .then(function (res) {
        if (res.status !== 200 || !Array.isArray(res.data) || !res.data.length) return;
        var row = res.data[0];
        if (row.avatar === 'custom' && row.avatar_image === photo.avatar_image) {
          try { localStorage.setItem(RANKING_PHOTO_SYNC_KEY, rankingPhotoKey(photo.avatar_image)); } catch (e) {}
          return;
        }
        return window.NVISION_sbAuth('/rest/v1/site_ranking?user_id=eq.' + encodeURIComponent(s.userId), { method: 'PATCH', token: s.access, body: { avatar: 'custom', avatar_image: photo.avatar_image } })
          .then(function (r2) {
            if (r2.status === 200 || r2.status === 204) { try { localStorage.setItem(RANKING_PHOTO_SYNC_KEY, rankingPhotoKey(photo.avatar_image)); } catch (e) {} }
          });
      }).catch(function () {});
  }

  // Nombre a mostrar: nombre completo de Google o del registro; si no hay,
  // nombre + apellido; si tampoco, la parte del correo antes de la @.
  function displayName(s) {
    var full = ((s && s.fullName) || '').trim();
    if (full) return full;
    var fn = (((s && s.firstName) || '') + ' ' + ((s && s.lastName) || '')).trim();
    if (fn) return fn;
    return ((s && s.email) || '').split('@')[0] || '';
  }
  // Foto de perfil: la subida por el usuario manda; si no hay, la foto de
  // Google; si tampoco, el avatar SVG elegido o la inicial del correo.
  function profilePhotoHtml(s) {
    if (!s || !window.NVISION_avatarChip) return '';
    var isSvg = s.avatar && s.avatar !== 'custom' && s.avatar !== 'initial';
    // Foto guardada en el aparato manda sobre la URL remota de Google.
    var cached = (!isSvg && s.googleAvatar && window.NVISION_cachedGoogleAvatar) ? window.NVISION_cachedGoogleAvatar(s.googleAvatar) : null;
    var img = isSvg ? s.avatarImg : (s.avatarImg || cached || s.googleAvatar);
    var id = isSvg ? s.avatar : (img ? 'custom' : 'initial');
    return window.NVISION_avatarChip(id, s.email, img);
  }
  function renderProfilePhoto() {
    var el = $('cuenta-profile-photo');
    if (!el) return;
    var s = getSession();
    if (s && s.googleAvatar && window.NVISION_cacheGoogleAvatar) window.NVISION_cacheGoogleAvatar(s.googleAvatar);
    // Si ya hay sesión iniciada (sin pasar por el inicio), también se
    // intenta guardar la foto en la cuenta; el candado de persistencia
    // evita repetirlo.
    if (s) persistGoogleAvatar(s);
    // Si la foto ya está guardada en la cuenta y el puntaje ya estaba
    // publicado, la fila del ranking se actualiza sola con la foto.
    if (s) syncRankingPhoto(s);
    el.innerHTML = profilePhotoHtml(s);
  }

  function refreshSession(s) {
    return window.NVISION_sbAuth('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: s.refresh } })
      .then(function (r) {
        if (r.status === 200 && r.data && r.data.access_token) return saveSessionFromAuth(r.data, s.email);
        throw new Error('refresh');
      });
  }

  function ensureSession() {
    var s = getSession();
    if (!s) return Promise.resolve(null);
    if (s.exp > Date.now() + 30000) return Promise.resolve(s);
    return refreshSession(s).catch(function () { clearSession(); return null; });
  }

  // ---------- Sincronización ----------
  function localItems() {
    var items = {};
    SYNC_KEYS.forEach(function (k) { var v = localStorage.getItem(k); if (v !== null) items[k] = v; });
    return items;
  }
  function hashItems(items) {
    var str = SYNC_KEYS.map(function (k) { return k + '=' + (items[k] || ''); }).join('|');
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = ((h << 5) - h + str.charCodeAt(i)) | 0; }
    return String(h);
  }
  function getMeta() { try { return JSON.parse(localStorage.getItem(META_KEY) || '{}'); } catch (e) { return {}; } }
  function setMeta(m) { try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch (e) {} }
  function docTime(raw) {
    try { var p = JSON.parse(raw || 'null'); return p && p.updatedAt ? Date.parse(p.updatedAt) || 0 : 0; } catch (e) { return 0; }
  }

  // La sincronización es silenciosa: corre sola al entrar y al pulsar
  // "Sincronizar ahora", sin anunciar nada en la página.
  function syncNow(session) {
    return window.NVISION_sbAuth('/rest/v1/user_progress?select=data,updated_at&user_id=eq.' + session.userId, { token: session.access })
      .then(function (r) {
        if (r.status === 404 || (r.data && (r.data.code === 'PGRST205' || r.data.code === '42P01'))) {
          return 'pending';
        }
        if (r.status !== 200) throw new Error('rest ' + r.status);
        var cloud = Array.isArray(r.data) && r.data.length ? r.data[0] : null;
        var cloudItems = (cloud && cloud.data && cloud.data.items) || {};
        var local = localItems();
        var merged = {};
        var changedLocal = false, changedCloud = false;
        SYNC_KEYS.forEach(function (k) {
          var lv = local[k], cv = cloudItems[k];
          if (lv == null && cv == null) return;
          if (cv == null) { merged[k] = lv; changedCloud = true; return; }
          if (lv == null) { merged[k] = cv; return; }
          if (lv === cv) { merged[k] = lv; return; }
          // Conflicto: gana el documento con updatedAt más reciente (ruta/exámenes lo guardan).
          if (docTime(cv) >= docTime(lv)) { merged[k] = cv; } else { merged[k] = lv; changedCloud = true; }
        });
        SYNC_KEYS.forEach(function (k) {
          if (merged[k] != null && merged[k] !== local[k]) { try { localStorage.setItem(k, merged[k]); } catch (e) {} changedLocal = true; }
        });
        var meta = getMeta();
        meta.lastSyncAt = new Date().toISOString();
        var finish = function (resultWord) {
          meta.hashAtSync = hashItems(localItems());
          setMeta(meta);
          return resultWord;
        };
        if (!changedCloud) return finish(changedLocal ? 'down' : 'same');
        return window.NVISION_sbAuth('/rest/v1/user_progress', {
          method: 'POST', token: session.access,
          headers: { 'Prefer': 'resolution=merge-duplicates' },
          body: { user_id: session.userId, data: { items: merged }, updated_at: new Date().toISOString() }
        }).then(function (r2) {
          if (r2.status !== 200 && r2.status !== 201) throw new Error('upsert ' + r2.status);
          return finish(changedLocal ? 'down' : 'up');
        });
      })
      .catch(function () {
        return 'fail';
      });
  }

  // ---------- UI ----------
  var mode = 'login';
  function renderMode() {
    $('cuenta-auth-title').textContent = mode === 'login' ? T.loginT : T.registerT;
    $('cuenta-submit').textContent = mode === 'login' ? T.loginB : T.registerB;
    $('cuenta-switch').textContent = mode === 'login' ? T.switchReg : T.switchLogin;
    $('cuenta-pass').setAttribute('autocomplete', mode === 'login' ? 'current-password' : 'new-password');
    $('cuenta-avatar-field').hidden = mode !== 'register';
    $('cuenta-name-fields').hidden = mode !== 'register';
    if ($('cuenta-forgot')) $('cuenta-forgot').hidden = mode !== 'login';
    if ($('cuenta-pass2-field')) $('cuenta-pass2-field').hidden = mode !== 'register';
  }
  function showPanel(session) {
    $('cuenta-auth').hidden = true;
    $('cuenta-panel').hidden = false;
    $('cuenta-user-email').textContent = session.email || '';
    $('cuenta-user-name').textContent = displayName(session);
    renderProfilePhoto();
    buildAvatarGrid($('avatar-grid-panel'), session.avatar || 'initial', saveAvatar, session.avatarImg);
    refreshRemoveBtn();
    var strip = $('cuenta-logros');
    if (strip && window.NVISION_LOGROS) window.NVISION_LOGROS.renderStrip(strip);
    var statsEl = $('cuenta-stats');
    if (statsEl && window.NVISION_LOGROS) {
      var comp = window.NVISION_LOGROS.compute();
      var cx = comp.ctx;
      statsEl.innerHTML =
        '<div class="cuenta-stat"><b>' + cx.rutaDone + '/' + cx.rutaTotal + '</b><span>' + T.statRuta + '</span></div>' +
        '<div class="cuenta-stat"><b>' + cx.passed + '/' + cx.examsTotal + '</b><span>' + T.statExams + '</span></div>' +
        '<div class="cuenta-stat"><b>' + comp.points + '</b><span>' + T.statPoints + '</span></div>';
    }
    var nextEl = $('cuenta-next');
    if (nextEl && window.NVISION_LOGROS) {
      var ctx = window.NVISION_LOGROS.compute().ctx;
      var missingRuta = ctx.rutaTotal - ctx.rutaDone;
      var missingExams = ctx.examsTotal - ctx.passed;
      if (!missingRuta && !missingExams) nextEl.innerHTML = '<b>' + T.nextDone + '</b>';
      else {
        var parts = [];
        if (missingRuta) parts.push('<b>' + missingRuta + '</b> ' + T.nextRuta);
        if (missingExams) parts.push('<b>' + missingExams + '</b> ' + T.nextExams);
        nextEl.innerHTML = T.nextMissing + ' ' + parts.join(' ' + T.nextJoin + ' ') + '.';
      }
    }
  }
  function showAuth() {
    $('cuenta-panel').hidden = true;
    $('cuenta-auth').hidden = false;
  }
  // ---- Restablecer contraseña: muestra el formulario de clave nueva
  // y esconde el de inicio (o lo devuelve). gisRendered recuerda si el
  // botón propio de Google llegó a dibujarse, para no revivir el botón
  // viejo al volver.
  var gisRendered = false;
  function showReset(on) {
    if ($('cuenta-reset')) $('cuenta-reset').hidden = !on;
    if ($('cuenta-form')) $('cuenta-form').hidden = on;
    if ($('cuenta-switch')) $('cuenta-switch').hidden = on;
    var div = document.querySelector('.cuenta-divider');
    if (div) div.hidden = on;
    var g = $('cuenta-google');
    if (g) g.style.display = on ? 'none' : (gisRendered ? 'none' : '');
    var gis = $('cuenta-google-gis');
    if (gis) gis.hidden = on ? true : !gisRendered;
  }

  $('cuenta-switch').addEventListener('click', function () {
    mode = mode === 'login' ? 'register' : 'login';
    clearMsg();
    renderMode();
  });

  // ---- ¿Olvidaste tu contraseña? Envía el enlace de restablecimiento ----
  if ($('cuenta-forgot')) $('cuenta-forgot').addEventListener('click', function () {
    var email = String(($('cuenta-email') && $('cuenta-email').value) || '').trim();
    if (!email) { msg('err', T.forgotNeedEmail); return; }
    var btn = $('cuenta-forgot');
    btn.disabled = true;
    window.NVISION_sbAuth('/auth/v1/recover', { method: 'POST', body: { email: email, redirect_to: location.origin + '/cuenta.html' } })
      .then(function (r) { btn.disabled = false; msg(r.status === 200 ? 'ok' : 'err', r.status === 200 ? T.forgotSent : T.forgotErr); })
      .catch(function () { btn.disabled = false; msg('err', T.forgotErr); });
  });

  // ---- Ver / ocultar la contraseña ----
  if ($('cuenta-pass-toggle')) $('cuenta-pass-toggle').addEventListener('click', function () {
    var inp = $('cuenta-pass');
    var isPass = inp.type === 'password';
    inp.type = isPass ? 'text' : 'password';
    var open = this.querySelector('.cuenta-eye-open');
    var off = this.querySelector('.cuenta-eye-off');
    if (open) open.hidden = isPass;
    if (off) off.hidden = !isPass;
    this.setAttribute('aria-label', isPass ? T.hidePass : T.showPass);
  });

  // ---- Actualizar datos (nombre y apellido) ----
  if ($('cuenta-edit')) $('cuenta-edit').addEventListener('click', function () {
    var s = getSession();
    if (!s) return;
    if ($('cuenta-edit-first')) $('cuenta-edit-first').value = s.firstName || '';
    if ($('cuenta-edit-last')) $('cuenta-edit-last').value = s.lastName || '';
    if ($('cuenta-edit-form')) $('cuenta-edit-form').hidden = false;
    if ($('cuenta-edit')) $('cuenta-edit').hidden = true;
    clearMsg();
  });
  if ($('cuenta-edit-cancel')) $('cuenta-edit-cancel').addEventListener('click', function () {
    if ($('cuenta-edit-form')) $('cuenta-edit-form').hidden = true;
    if ($('cuenta-edit')) $('cuenta-edit').hidden = false;
  });
  if ($('cuenta-edit-save')) $('cuenta-edit-save').addEventListener('click', function () {
    var first = String(($('cuenta-edit-first') && $('cuenta-edit-first').value) || '').trim();
    var last = String(($('cuenta-edit-last') && $('cuenta-edit-last').value) || '').trim();
    // Capa de validación: mismo saneado que en el registro.
    var V = window.NVISION_validate;
    if (V) { first = V.cleanName(first, 60); last = V.cleanName(last, 60); }
    if (!first || !last) { msg('err', T.needName); return; }
    var btn = $('cuenta-edit-save');
    btn.disabled = true;
    ensureSession().then(function (s) {
      if (!s) { btn.disabled = false; return; }
      window.NVISION_sbAuth('/auth/v1/user', { method: 'PUT', token: s.access, body: { data: { first_name: first, last_name: last, full_name: first + ' ' + last } } })
        .then(function (r) {
          btn.disabled = false;
          if (r.status === 200) {
            s.firstName = first; s.lastName = last; s.fullName = first + ' ' + last; setSession(s);
            $('cuenta-user-name').textContent = displayName(s);
            if ($('cuenta-edit-form')) $('cuenta-edit-form').hidden = true;
            if ($('cuenta-edit')) $('cuenta-edit').hidden = false;
            msg('ok', T.profileSaved);
          } else msg('err', T.profileErr);
        })
        .catch(function () { btn.disabled = false; msg('err', T.profileErr); });
    });
  });

  $('cuenta-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var email = String($('cuenta-email').value || '').trim();
    var pass = String($('cuenta-pass').value || '');
    // Capa de validación (js/validation.js): el correo debe tener
    // formato válido antes de enviarse a Supabase; antes solo se
    // comprobaba que no estuviera vacío.
    var V = window.NVISION_validate;
    if (V && !V.isEmail(email)) { msg('err', T.needFields); return; }
    if (!email || pass.length < 6) { msg('err', T.needFields); return; }
    var first = '', last = '';
    if (mode === 'register') {
      first = String(($('cuenta-firstname') && $('cuenta-firstname').value) || '').trim();
      last = String(($('cuenta-lastname') && $('cuenta-lastname').value) || '').trim();
      if (V) { first = V.cleanName(first, 60); last = V.cleanName(last, 60); }
      if (!first || !last) { msg('err', T.needName); return; }
      var pass2 = String(($('cuenta-pass2') && $('cuenta-pass2').value) || '');
      if (pass !== pass2) { msg('err', T.passMismatch); return; }
    }
    var btn = $('cuenta-submit');
    btn.disabled = true; btn.textContent = T.working;
    clearMsg();
    var done = function () { btn.disabled = false; renderMode(); };
    if (mode === 'register') {
      window.NVISION_sbAuth('/auth/v1/signup', { method: 'POST', body: { email: email, password: pass, data: { first_name: first, last_name: last, full_name: first + ' ' + last, avatar: regAvatar, avatar_image: regAvatar === 'custom' ? regAvatarImg : null } } })
        .then(function (r) {
          done();
          if (r.status === 200 && r.data) {
            if (r.data.access_token) {
              var s = saveSessionFromAuth(r.data, email);
              showPanel(s); if (!goNext()) syncNow(s);
            } else { msg('ok', T.confirmEmail); mode = 'login'; renderMode(); }
          } else if (r.data && /already|registered/i.test(r.data.msg || r.data.error_description || '')) msg('err', T.userExists);
          else msg('err', T.netErr);
        })
        .catch(function () { done(); msg('err', T.netErr); });
    } else {
      window.NVISION_sbAuth('/auth/v1/token?grant_type=password', { method: 'POST', body: { email: email, password: pass } })
        .then(function (r) {
          done();
          if (r.status === 200 && r.data && r.data.access_token) {
            var s = saveSessionFromAuth(r.data, email);
            showPanel(s);
            if (!goNext()) syncNow(s);
          } else msg('err', T.badLogin);
        })
        .catch(function () { done(); msg('err', T.netErr); });
    }
  });

  $('cuenta-sync').addEventListener('click', function () {
    var btn = $('cuenta-sync');
    if (btn.disabled) return;
    btn.disabled = true;
    var old = btn.textContent;
    btn.textContent = T.syncing;
    var doneBtn = function () { btn.disabled = false; btn.textContent = old; };
    ensureSession().then(function (s) {
      if (!s) { showAuth(); return null; }
      return syncNow(s);
    }).then(doneBtn, doneBtn);
  });
  $('cuenta-logout').addEventListener('click', function () {
    var s = getSession();
    var bye = function () { clearSession(); clearMsg(); showAuth(); };
    if (s && s.access) window.NVISION_sbAuth('/auth/v1/logout', { method: 'POST', token: s.access }).then(bye).catch(bye);
    else bye();
  });

  // ---------- Avatares ----------
  var regAvatar = 'initial';
  var regAvatarImg = null;
  var fileTarget = 'reg';
  var PHOTO_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>';
  function avatarOptions() { return ['initial'].concat((window.NVISION_AVATARS || []).map(function (a) { return a.id; })); }
  function avatarName(id) {
    if (id === 'initial') return T.avatarInitial;
    if (id === 'custom') return T.avatarPhoto;
    var list = window.NVISION_AVATARS || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i][lang] || list[i].es;
    return id;
  }
  function buildAvatarGrid(container, currentId, onPick, customImg) {
    if (!container || !window.NVISION_avatarChip) return;
    container.innerHTML = '';
    var sess = getSession();
    var email = (sess && sess.email) || ($('cuenta-email') ? $('cuenta-email').value : '') || '';
    avatarOptions().forEach(function (id) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'avatar-opt' + (id === currentId ? ' sel' : '');
      b.setAttribute('aria-label', avatarName(id));
      b.innerHTML = window.NVISION_avatarChip(id, email) + '<span>' + avatarName(id) + '</span>';
      b.addEventListener('click', function () { onPick(id); });
      container.appendChild(b);
    });
    var pb = document.createElement('button');
    pb.type = 'button';
    pb.className = 'avatar-opt avatar-opt--photo' + (currentId === 'custom' ? ' sel' : '');
    pb.setAttribute('aria-label', T.avatarPhoto);
    pb.innerHTML = (customImg ? window.NVISION_avatarChip('custom', email, customImg) : '<span class="nv-avatar nv-avatar--photo-empty">' + PHOTO_SVG + '</span>') + '<span>' + T.avatarPhoto + '</span>';
    pb.addEventListener('click', function () { onPick('custom'); });
    container.appendChild(pb);
    updateAvatarPreview(container, currentId, customImg);
  }
  function updateAvatarPreview(container, currentId, customImg) {
    if (!container || !container.closest) return;
    var box = container.closest('.cuenta-field, .cuenta-avatar-box');
    if (!box) return;
    var pv = box.querySelector('.avatar-preview');
    if (!pv || !window.NVISION_avatarChip) return;
    var chip = pv.querySelector('.avatar-preview-chip');
    var nm = pv.querySelector('.avatar-preview-name');
    var sess = getSession();
    var email = (sess && sess.email) || ($('cuenta-email') ? $('cuenta-email').value : '') || '';
    if (chip) chip.innerHTML = window.NVISION_avatarChip(currentId, email, customImg);
    if (nm) nm.textContent = avatarName(currentId);
  }
  function refreshRemoveBtn() {
    var btn = $('cuenta-avatar-remove');
    if (!btn) return;
    var s = getSession();
    btn.hidden = !(s && s.avatarImg);
  }
  function pickRegAvatar(id) {
    if (id === 'custom') { openAvatarFile('reg'); return; }
    regAvatar = id;
    buildAvatarGrid($('avatar-grid-reg'), regAvatar, pickRegAvatar, regAvatarImg);
  }
  function saveAvatar(id) {
    if (id === 'custom') { openAvatarFile('panel'); return; }
    ensureSession().then(function (s) {
      if (!s) return;
      window.NVISION_sbAuth('/auth/v1/user', { method: 'PUT', token: s.access, body: { data: { avatar: id } } })
        .then(function (r) {
          if (r.status === 200) {
            s.avatar = id; setSession(s);
            buildAvatarGrid($('avatar-grid-panel'), id, saveAvatar, s.avatarImg);
            renderProfilePhoto();
            if (window.NVISION_renderAccountChip) window.NVISION_renderAccountChip();
            msg('ok', T.avatarSaved);
          } else msg('err', T.avatarErr);
        })
        .catch(function () { msg('err', T.avatarErr); });
    });
  }
  function openAvatarFile(target) {
    fileTarget = target;
    var inp = $('cuenta-avatar-file');
    if (inp) { inp.value = ''; inp.click(); }
  }
  function processAvatarFile(file, done) {
    if (!file || !/^image\//.test(file.type)) { msg('err', T.avatarImgErr); return; }
    // Capa de validación: sin límite, un archivo gigante se leía entero
    // como data: y podía colgar el navegador; 8 MB sobra para una foto.
    if (file.size > 8 * 1024 * 1024) { msg('err', T.avatarImgErr); return; }
    // Se lee como data: URL (no blob:) porque la CSP del sitio permite data: en img-src.
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        try {
          var size = 256, canvas = document.createElement('canvas');
          canvas.width = size; canvas.height = size;
          var side = Math.min(img.width, img.height);
          canvas.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
          var out = canvas.toDataURL('image/jpeg', 0.82);
          if (out.length > 90000) out = canvas.toDataURL('image/jpeg', 0.55);
          done(out);
        } catch (e) { msg('err', T.avatarImgErr); }
      };
      img.onerror = function () { msg('err', T.avatarImgErr); };
      img.src = reader.result;
    };
    reader.onerror = function () { msg('err', T.avatarImgErr); };
    reader.readAsDataURL(file);
  }
  function saveAvatarImage(dataUrl) {
    // Capa extra: solo se guarda una imagen data: válida (ver main.js).
    if (window.NVISION_validAvatarImg && !window.NVISION_validAvatarImg(dataUrl)) { msg('err', T.avatarImgErr); return; }
    ensureSession().then(function (s) {
      if (!s) return;
      window.NVISION_sbAuth('/auth/v1/user', { method: 'PUT', token: s.access, body: { data: { avatar: 'custom', avatar_image: dataUrl } } })
        .then(function (r) {
          if (r.status === 200) {
            s.avatar = 'custom'; s.avatarImg = dataUrl; setSession(s);
            buildAvatarGrid($('avatar-grid-panel'), 'custom', saveAvatar, dataUrl);
            renderProfilePhoto();
            refreshRemoveBtn();
            if (window.NVISION_renderAccountChip) window.NVISION_renderAccountChip();
            msg('ok', T.avatarSaved);
          } else msg('err', T.avatarErr);
        })
        .catch(function () { msg('err', T.avatarErr); });
    });
  }
  function removeAvatarImage() {
    ensureSession().then(function (s) {
      if (!s) return;
      window.NVISION_sbAuth('/auth/v1/user', { method: 'PUT', token: s.access, body: { data: { avatar: 'initial', avatar_image: null } } })
        .then(function (r) {
          if (r.status === 200) {
            s.avatar = 'initial'; s.avatarImg = null; setSession(s);
            buildAvatarGrid($('avatar-grid-panel'), 'initial', saveAvatar, null);
            renderProfilePhoto();
            refreshRemoveBtn();
            if (window.NVISION_renderAccountChip) window.NVISION_renderAccountChip();
            msg('ok', T.avatarSaved);
          } else msg('err', T.avatarErr);
        })
        .catch(function () { msg('err', T.avatarErr); });
    });
  }
  // ---- Publicar el puntaje en el ranking del sitio ----
  if ($('cuenta-rank')) $('cuenta-rank').addEventListener('click', function () {
    var st = $('cuenta-rank-state');
    ensureSession().then(function (s) {
      if (!s) { showAuth(); return; }
      if (!window.NVISION_LOGROS) return;
      var r = window.NVISION_LOGROS.compute();
      // El nombre publicado respeta el CHECK de la base (máx. 60):
      // un correo con la parte local más larga hacía fallar el envío.
      var V2 = window.NVISION_validate;
      var name = V2 ? V2.cleanName(String(s.email || 'NVISION').split('@')[0], 60) : String(s.email || 'NVISION').split('@')[0].slice(0, 60);
      // La foto se publica con rankingPhoto (la misma que usa el
      // auto-sincronizado): foto guardada o URL de Google validada;
      // con SVG elegido o foto quitada, no hay foto que publicar.
      // El avatar se publica como 'custom' cuando hay foto, igual
      // que en la sincronización, para que la fila quede coherente.
      var photo = rankingPhoto(s);
      window.NVISION_sbAuth('/rest/v1/site_ranking?on_conflict=user_id', {
        method: 'POST', token: s.access,
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: { user_id: s.userId, name: name, avatar: photo ? 'custom' : (s.avatar || null), avatar_image: photo ? photo.avatar_image : null, points: r.points, updated_at: new Date().toISOString() }
      }).then(function (res) {
        if (res.status === 200 || res.status === 201 || res.status === 204) st.textContent = T.rankOk + ' ' + r.points + ' ' + T.rankPts;
        else if (res.status === 404 || (res.data && (res.data.code === 'PGRST205' || res.data.code === '42P01'))) st.textContent = T.rankOff;
        else st.textContent = T.rankErr;
      }).catch(function () { st.textContent = T.rankErr; });
    });
  });

  // ---- Quitarse del ranking del sitio ----
  // Borra SOLO la fila propia (la política "ranking borrar propio" de
  // supabase/site_ranking.sql lo permite con la sesión del usuario).
  if ($('cuenta-unrank')) $('cuenta-unrank').addEventListener('click', function () {
    var st = $('cuenta-rank-state');
    ensureSession().then(function (s) {
      if (!s) { showAuth(); return; }
      window.NVISION_sbAuth('/rest/v1/site_ranking?user_id=eq.' + encodeURIComponent(s.userId), {
        method: 'DELETE', token: s.access
      }).then(function (res) {
        if (res.status === 200 || res.status === 204) st.textContent = T.rankRemoved;
        else if (res.status === 404 || (res.data && (res.data.code === 'PGRST205' || res.data.code === '42P01'))) st.textContent = T.rankOff;
        else st.textContent = T.rankRemoveErr;
      }).catch(function () { st.textContent = T.rankRemoveErr; });
    });
  });

  // ---- Enlace al perfil público propio ----
  if ($('cuenta-profile-link')) $('cuenta-profile-link').addEventListener('click', function (ev) {
    ev.preventDefault();
    ensureSession().then(function (s) {
      if (s && s.userId) location.href = 'perfil.html?u=' + encodeURIComponent(s.userId);
    });
  });

  // ---- Guardar la nueva contraseña (tras el enlace del correo) ----
  var recoveryTokens = null;
  if ($('cuenta-reset-save')) $('cuenta-reset-save').addEventListener('click', function () {
    var p1 = String(($('cuenta-reset-pass') && $('cuenta-reset-pass').value) || '');
    var p2 = String(($('cuenta-reset-pass2') && $('cuenta-reset-pass2').value) || '');
    if (p1.length < 6) { msg('err', T.resetShort); return; }
    if (p1 !== p2) { msg('err', T.passMismatch); return; }
    if (!recoveryTokens || !recoveryTokens.at) { msg('err', T.resetErr); return; }
    var btn = $('cuenta-reset-save');
    btn.disabled = true;
    var tk = recoveryTokens;
    window.NVISION_sbAuth('/auth/v1/user', { method: 'PUT', token: tk.at, body: { password: p1 } })
      .then(function (r) {
        btn.disabled = false;
        if (r.status !== 200) { msg('err', T.resetErr); return; }
        // La clave ya cambió: entrar con la sesión del enlace.
        window.NVISION_sbAuth('/auth/v1/user', { token: tk.at }).then(function (ru) {
          if (ru.status === 200 && ru.data && ru.data.id) {
            var s = saveSessionFromAuth({ access_token: tk.at, refresh_token: tk.rt, expires_in: tk.exp, user: ru.data }, ru.data.email);
            showReset(false);
            showPanel(s);
            msg('ok', T.resetOk);
            if (!goNext()) syncNow(s);
          } else {
            showReset(false);
            msg('ok', T.resetOk);
          }
        }).catch(function () { showReset(false); msg('ok', T.resetOk); });
      })
      .catch(function () { btn.disabled = false; msg('err', T.resetErr); });
  });
  if ($('cuenta-reset-cancel')) $('cuenta-reset-cancel').addEventListener('click', function () {
    recoveryTokens = null;
    showReset(false);
    clearMsg();
  });

  // ---- Ingreso con Google ----
  // Antes de salir de la página comprobamos si el proveedor está activo:
  // con Google desactivado en Supabase, la URL de autorización devuelve un
  // 400 y el usuario terminaba en una página en blanco con un JSON de error,
  // sin explicación y sin forma de volver. Ahora, en ese caso, nos quedamos
  // en cuenta.html y mostramos el aviso amable. En cuanto el equipo active
  // Google en Supabase, el botón empieza a funcionar solo, sin tocar el código.
  var googleBtn = $('cuenta-google');
  function googleAuthorizeUrl() {
    return SUPABASE_URL + '/auth/v1/authorize?provider=google&redirect_to=' + encodeURIComponent(location.origin + location.pathname);
  }
  if (googleBtn) googleBtn.addEventListener('click', function () {
    googleBtn.disabled = true;
    fetch(googleAuthorizeUrl(), { redirect: 'manual' })
      .then(function (r) {
        // Proveedor activo: Supabase redirige a Google (respuesta opaca, status 0).
        if (r.status === 0 || (r.status >= 300 && r.status < 400)) {
          location.href = googleAuthorizeUrl();
        } else {
          // 400 u otro error: el proveedor no está activado.
          googleBtn.disabled = false;
          msg('err', T.googleOff);
        }
      })
      .catch(function () {
        googleBtn.disabled = false;
        msg('err', T.netErr);
      });
  });

  // Botón propio de Google (GIS): el inicio ocurre en la página, sin pasar
  // por la dirección de Supabase, así que Google muestra NVISION y
  // nvision.social en vez de xiuztrujrwdgcpjrruxu.supabase.co. Google
  // entrega un token de identidad y se lo pasamos a Supabase, que crea la
  // sesión igual que con el inicio por correo. Si la librería de Google no
  // carga o no deja dibujar el botón, queda el botón anterior como respaldo.
  function handleGoogleCredential(resp) {
    var idToken = resp && resp.credential;
    if (!idToken) { msg('err', T.googleOff); return; }
    // OJO: Supabase exige el campo "id_token" (no "token"): con "token"
    // solo devolvía 400 "invalid request: id_token required". Se mandan
    // los dos nombres con el mismo valor por compatibilidad.
    window.NVISION_sbAuth('/auth/v1/token?grant_type=id_token', { method: 'POST', body: { provider: 'google', id_token: idToken, token: idToken } })
      .then(function (r) {
        if (r.status === 200 && r.data && r.data.access_token) {
          var s = saveSessionFromAuth(r.data, (r.data.user && r.data.user.email) || '', pictureFromIdToken(idToken));
          showPanel(s);
          if (!goNext()) syncNow(s);
        } else msg('err', T.googleOff);
      })
      .catch(function () { msg('err', T.netErr); });
  }
  function initGoogleGIS() {
    var wrap = $('cuenta-google-gis');
    if (!wrap || !window.google || !google.accounts || !google.accounts.id) return false;
    try {
      google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleCredential });
      var w = Math.min(400, Math.max(200, wrap.clientWidth || 320));
      google.accounts.id.renderButton(wrap, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular', width: w });
      wrap.hidden = false;
      // OJO: .cuenta-google tiene display:flex en el CSS, que vence al
      // atributo hidden; hay que esconderlo por estilo para que no queden
      // los dos botones de Google a la vez.
      if (googleBtn) { googleBtn.hidden = true; googleBtn.style.display = 'none'; }
      gisRendered = true;
      return true;
    } catch (e) { return false; }
  }
  if (!initGoogleGIS()) {
    var gisTries = 0;
    var gisTimer = setInterval(function () {
      gisTries++;
      if (initGoogleGIS() || gisTries >= 10) clearInterval(gisTimer);
    }, 500);
  }
  (function handleAuthRedirect() {
    var hashParams = null;
    if (location.hash && location.hash.length >= 3) hashParams = new URLSearchParams(location.hash.slice(1));
    var searchParams = new URLSearchParams(location.search);
    // Supabase puede devolver el error en el fragmento (#) o en la consulta (?).
    var err = (hashParams && hashParams.get('error')) || searchParams.get('error');
    var errDesc = (hashParams && hashParams.get('error_description')) || searchParams.get('error_description');
    var clean = function () {
      try {
        var sp = new URLSearchParams(location.search);
        sp.delete('error'); sp.delete('error_description'); sp.delete('error_code');
        var qs = sp.toString();
        history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
      } catch (e) {}
    };
    if (err || errDesc) { clean(); msg('err', T.googleOff); return; }
    if (!hashParams) return;
    var at = hashParams.get('access_token');
    if (!at) return;
    var rt = hashParams.get('refresh_token');
    var exp = parseInt(hashParams.get('expires_in') || '3600', 10);
    clean();
    // Enlace de restablecer contraseña: no entrar directo, pedir la clave nueva.
    if (hashParams.get('type') === 'recovery') {
      recoveryTokens = { at: at, rt: rt, exp: exp };
      showReset(true);
      return;
    }
    window.NVISION_sbAuth('/auth/v1/user', { token: at }).then(function (r) {
      if (r.status === 200 && r.data && r.data.id) {
        var s = saveSessionFromAuth({ access_token: at, refresh_token: rt, expires_in: exp, user: r.data }, r.data.email);
        showPanel(s);
        if (!goNext()) syncNow(s);
      } else msg('err', T.googleOff);
    }).catch(function () { msg('err', T.netErr); });
  })();

  if ($('cuenta-email')) $('cuenta-email').addEventListener('input', function () { if (mode === 'register') buildAvatarGrid($('avatar-grid-reg'), regAvatar, pickRegAvatar, regAvatarImg); });
  if ($('cuenta-avatar-file')) $('cuenta-avatar-file').addEventListener('change', function () {
    var f = this.files && this.files[0];
    if (!f) return;
    processAvatarFile(f, function (dataUrl) {
      if (fileTarget === 'reg') {
        regAvatar = 'custom'; regAvatarImg = dataUrl;
        buildAvatarGrid($('avatar-grid-reg'), 'custom', pickRegAvatar, regAvatarImg);
      } else saveAvatarImage(dataUrl);
    });
  });
  if ($('cuenta-avatar-remove')) $('cuenta-avatar-remove').addEventListener('click', removeAvatarImage);
  buildAvatarGrid($('avatar-grid-reg'), regAvatar, pickRegAvatar, null);

  renderMode();
  ensureSession().then(function (s) {
    if (s) { showPanel(s); if (!goNext()) syncNow(s); }
    else showAuth();
  });
})();
