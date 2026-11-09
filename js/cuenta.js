// NVISION - Mi cuenta: registro e inicio de sesión con Supabase Auth y
// sincronización del progreso (ruta, exámenes y Workshop) en la tabla user_progress.
// La llave anon es pública por diseño (la misma que ya usa el widget de equipo).
(function () {
  'use strict';

  var SUPABASE_URL = 'https://xiuztrujrwdgcpjrruxu.supabase.co';
  var ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdXp0cnVqcndkZ2NwanJydXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNTk2ODcsImV4cCI6MjEwOTYzNTY4N30.CBBQpCqHxuOtCaMcdUfIrKTa4vt0QJRqvivskHnt5g0';
  var SESSION_KEY = 'nvision_session_v1';
  var META_KEY = 'nvision_sync_meta_v1';
  var SYNC_KEYS = ['nvision_ruta_v1', 'nvision_examenes_v1', 'nvision_workshop_v2', 'nvision_logros_v1'];
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';

  var T = {
    es: {
      loginT: 'Iniciar sesión', registerT: 'Crear cuenta', loginB: 'Entrar', registerB: 'Registrarme',
      switchReg: '¿No tienes cuenta? Regístrate', switchLogin: '¿Ya tienes cuenta? Inicia sesión',
      working: 'Un momento…', needFields: 'Escribe tu correo y una contraseña de al menos 6 caracteres.',
      confirmEmail: 'Cuenta creada. Revisa tu correo y confirma el enlace que te enviamos; después inicia sesión aquí.',
      welcomeBack: 'Sesión iniciada. Tu progreso se sincronizó con tu cuenta.',
      badLogin: 'Correo o contraseña incorrectos, o la cuenta aún no está confirmada por correo.',
      userExists: 'Ese correo ya tiene una cuenta. Inicia sesión.',
      netErr: 'Sin conexión con el servidor. Revisa tu internet e inténtalo otra vez.',
      loggedAs: 'Sesión iniciada como', syncing: 'Sincronizando tu progreso…',
      syncOkUp: 'Progreso guardado en la nube.', syncOkDown: 'Progreso actualizado desde la nube.', syncOkSame: 'Tu progreso ya estaba al día.',
      syncPending: 'Tu cuenta funciona, pero la sincronización en la nube aún no está activada por el equipo (falta crear la tabla de progreso en Supabase). Tu progreso sigue guardado en este equipo.',
      syncFail: 'No se pudo sincronizar ahora. Tu progreso sigue guardado en este equipo.',
      lastSync: 'Última sincronización',
      avatarSaved: 'Avatar guardado. Se verá en el botón de Mi cuenta en todo el sitio.', avatarErr: 'No se pudo guardar el avatar. Inténtalo otra vez.', avatarInitial: 'Inicial',
      avatarPhoto: 'Foto', avatarRemove: 'Quitar foto', avatarImgErr: 'Esa imagen no se pudo usar. Prueba con otra.',
      googleOff: 'El ingreso con Google aún no está activado por el equipo. Por ahora entra con tu correo y contraseña.',
      expOk: 'Archivo de progreso descargado. Guárdalo para restaurarlo en otro equipo.',
      impOk: 'Progreso importado. La página se recarga para aplicarlo.',
      impErr: 'Ese archivo no es un respaldo válido de NVISION.',
      rankOk: '¡Puntaje publicado en el ranking con', rankPts: 'puntos!',
      rankOff: 'El ranking aún no está activado por el equipo (falta crear su tabla en Supabase). Tu puntaje ya quedó calculado y podrás publicarlo en cuanto se active.',
      rankErr: 'No se pudo publicar el puntaje ahora. Inténtalo otra vez.',
      nextMissing: 'Te faltan', nextRuta: 'pasos de la ruta', nextExams: 'exámenes por aprobar', nextJoin: 'y',
      nextDone: 'Ya completaste la ruta y aprobaste todos los exámenes. ¡Nivel máximo!'
    },
    en: {
      loginT: 'Log in', registerT: 'Create account', loginB: 'Log in', registerB: 'Sign up',
      switchReg: "Don't have an account? Sign up", switchLogin: 'Already have an account? Log in',
      working: 'One moment…', needFields: 'Enter your email and a password of at least 6 characters.',
      confirmEmail: 'Account created. Check your email and confirm the link we sent you; then log in here.',
      welcomeBack: 'Logged in. Your progress has been synced with your account.',
      badLogin: 'Wrong email or password, or the account is not email-confirmed yet.',
      userExists: 'That email already has an account. Log in instead.',
      netErr: 'No connection to the server. Check your internet and try again.',
      loggedAs: 'Logged in as', syncing: 'Syncing your progress…',
      syncOkUp: 'Progress saved to the cloud.', syncOkDown: 'Progress updated from the cloud.', syncOkSame: 'Your progress was already up to date.',
      syncPending: 'Your account works, but cloud sync is not enabled by the team yet (the progress table still needs to be created in Supabase). Your progress is still saved on this device.',
      syncFail: 'Could not sync right now. Your progress is still saved on this device.',
      lastSync: 'Last sync',
      avatarSaved: 'Avatar saved. It will show on the My account button across the site.', avatarErr: 'Could not save the avatar. Try again.', avatarInitial: 'Initial',
      avatarPhoto: 'Photo', avatarRemove: 'Remove photo', avatarImgErr: 'That image could not be used. Try another one.',
      googleOff: 'Google sign-in is not enabled by the team yet. For now, log in with your email and password.',
      expOk: 'Progress file downloaded. Keep it to restore on another device.',
      impOk: 'Progress imported. The page will reload to apply it.',
      impErr: 'That file is not a valid NVISION backup.',
      rankOk: 'Score published to the ranking with', rankPts: 'points!',
      rankOff: 'The ranking is not enabled by the team yet (its Supabase table still needs to be created). Your score is already computed and you will be able to publish it as soon as it is on.',
      rankErr: 'Could not publish the score right now. Try again.',
      nextMissing: 'You still need', nextRuta: 'path steps', nextExams: 'exams to pass', nextJoin: 'and',
      nextDone: 'You completed the path and passed every exam. Max level!'
    }
  }[lang];

  function $(id) { return document.getElementById(id); }
  function msg(kind, text) {
    var el = $('cuenta-msg');
    el.className = 'cuenta-msg on cuenta-msg--' + kind;
    el.textContent = text;
  }
  function clearMsg() { $('cuenta-msg').className = 'cuenta-msg'; }

  function getSession() {
    try { var s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); if (s && s.access && s.exp > Date.now()) return s; if (s && s.refresh) return s; } catch (e) {}
    return null;
  }
  function setSession(s) { try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch (e) {} }
  function clearSession() { try { localStorage.removeItem(SESSION_KEY); } catch (e) {} }

  // Regreso opcional tras iniciar sesión: cuenta.html?next=examenes.html
  // (solo destinos internos de la lista, nada externo).
  function nextTarget() {
    try {
      var n = new URLSearchParams(location.search).get('next');
      return ['examenes.html', 'ruta.html', 'index.html'].indexOf(n) >= 0 ? n : null;
    } catch (e) { return null; }
  }
  function goNext() { var n = nextTarget(); if (n) { location.href = n; return true; } return false; }

  function api(path, opts) {
    opts = opts || {};
    var headers = { 'apikey': ANON_KEY, 'Content-Type': 'application/json' };
    if (opts.token) headers['Authorization'] = 'Bearer ' + opts.token;
    if (opts.headers) Object.keys(opts.headers).forEach(function (k) { headers[k] = opts.headers[k]; });
    return fetch(SUPABASE_URL + path, { method: opts.method || 'GET', headers: headers, body: opts.body ? JSON.stringify(opts.body) : undefined })
      .then(function (r) {
        return r.text().then(function (txt) {
          var data = null;
          try { data = txt ? JSON.parse(txt) : null; } catch (e) {}
          return { status: r.status, data: data };
        });
      });
  }

  function saveSessionFromAuth(data, email) {
    var s = {
      access: data.access_token,
      refresh: data.refresh_token,
      exp: Date.now() + (data.expires_in || 3600) * 1000,
      userId: data.user && data.user.id,
      email: (data.user && data.user.email) || email,
      avatar: (data.user && data.user.user_metadata && data.user.user_metadata.avatar) || null,
      avatarImg: (data.user && data.user.user_metadata && data.user.user_metadata.avatar_image) || null
    };
    setSession(s);
    return s;
  }

  function refreshSession(s) {
    return api('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: s.refresh } })
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

  function syncNow(session, quiet) {
    var stateEl = $('cuenta-sync-state');
    if (!quiet) stateEl.textContent = T.syncing;
    return api('/rest/v1/user_progress?select=data,updated_at&user_id=eq.' + session.userId, { token: session.access })
      .then(function (r) {
        if (r.status === 404 || (r.data && (r.data.code === 'PGRST205' || r.data.code === '42P01'))) {
          stateEl.textContent = T.syncPending;
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
          stateEl.textContent = resultWord + ' · ' + T.lastSync + ': ' + new Date(meta.lastSyncAt).toLocaleString(lang === 'en' ? 'en-US' : 'es-CO');
          return resultWord;
        };
        if (!changedCloud) return finish(changedLocal ? T.syncOkDown : T.syncOkSame);
        return api('/rest/v1/user_progress', {
          method: 'POST', token: session.access,
          headers: { 'Prefer': 'resolution=merge-duplicates' },
          body: { user_id: session.userId, data: { items: merged }, updated_at: new Date().toISOString() }
        }).then(function (r2) {
          if (r2.status !== 200 && r2.status !== 201) throw new Error('upsert ' + r2.status);
          return finish(changedLocal ? T.syncOkDown : T.syncOkUp);
        });
      })
      .catch(function () {
        stateEl.textContent = T.syncFail;
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
  }
  function showPanel(session) {
    $('cuenta-auth').hidden = true;
    $('cuenta-panel').hidden = false;
    $('cuenta-user-email').textContent = session.email || '';
    buildAvatarGrid($('avatar-grid-panel'), session.avatar || 'initial', saveAvatar, session.avatarImg);
    refreshRemoveBtn();
    var meta = getMeta();
    $('cuenta-sync-state').textContent = meta.lastSyncAt ? (T.lastSync + ': ' + new Date(meta.lastSyncAt).toLocaleString(lang === 'en' ? 'en-US' : 'es-CO')) : '';
    var strip = $('cuenta-logros');
    if (strip && window.NVISION_LOGROS) window.NVISION_LOGROS.renderStrip(strip);
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

  $('cuenta-switch').addEventListener('click', function () {
    mode = mode === 'login' ? 'register' : 'login';
    clearMsg();
    renderMode();
  });

  $('cuenta-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var email = String($('cuenta-email').value || '').trim();
    var pass = String($('cuenta-pass').value || '');
    if (!email || pass.length < 6) { msg('err', T.needFields); return; }
    var btn = $('cuenta-submit');
    btn.disabled = true; btn.textContent = T.working;
    clearMsg();
    var done = function () { btn.disabled = false; renderMode(); };
    if (mode === 'register') {
      api('/auth/v1/signup', { method: 'POST', body: { email: email, password: pass, data: { avatar: regAvatar, avatar_image: regAvatar === 'custom' ? regAvatarImg : null } } })
        .then(function (r) {
          done();
          if (r.status === 200 && r.data) {
            if (r.data.access_token) {
              var s = saveSessionFromAuth(r.data, email);
              showPanel(s); if (!goNext()) syncNow(s, true);
            } else { msg('ok', T.confirmEmail); mode = 'login'; renderMode(); }
          } else if (r.data && /already|registered/i.test(r.data.msg || r.data.error_description || '')) msg('err', T.userExists);
          else msg('err', T.netErr);
        })
        .catch(function () { done(); msg('err', T.netErr); });
    } else {
      api('/auth/v1/token?grant_type=password', { method: 'POST', body: { email: email, password: pass } })
        .then(function (r) {
          done();
          if (r.status === 200 && r.data && r.data.access_token) {
            var s = saveSessionFromAuth(r.data, email);
            msg('ok', T.welcomeBack);
            showPanel(s);
            if (!goNext()) syncNow(s, true);
          } else msg('err', T.badLogin);
        })
        .catch(function () { done(); msg('err', T.netErr); });
    }
  });

  $('cuenta-sync').addEventListener('click', function () {
    ensureSession().then(function (s) { if (s) syncNow(s, false); else showAuth(); });
  });
  $('cuenta-logout').addEventListener('click', function () {
    var s = getSession();
    var bye = function () { clearSession(); clearMsg(); showAuth(); };
    if (s && s.access) api('/auth/v1/logout', { method: 'POST', token: s.access }).then(bye).catch(bye);
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
      api('/auth/v1/user', { method: 'PUT', token: s.access, body: { data: { avatar: id } } })
        .then(function (r) {
          if (r.status === 200) {
            s.avatar = id; setSession(s);
            buildAvatarGrid($('avatar-grid-panel'), id, saveAvatar, s.avatarImg);
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
    ensureSession().then(function (s) {
      if (!s) return;
      api('/auth/v1/user', { method: 'PUT', token: s.access, body: { data: { avatar: 'custom', avatar_image: dataUrl } } })
        .then(function (r) {
          if (r.status === 200) {
            s.avatar = 'custom'; s.avatarImg = dataUrl; setSession(s);
            buildAvatarGrid($('avatar-grid-panel'), 'custom', saveAvatar, dataUrl);
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
      api('/auth/v1/user', { method: 'PUT', token: s.access, body: { data: { avatar: 'initial', avatar_image: null } } })
        .then(function (r) {
          if (r.status === 200) {
            s.avatar = 'initial'; s.avatarImg = null; setSession(s);
            buildAvatarGrid($('avatar-grid-panel'), 'initial', saveAvatar, null);
            refreshRemoveBtn();
            if (window.NVISION_renderAccountChip) window.NVISION_renderAccountChip();
            msg('ok', T.avatarSaved);
          } else msg('err', T.avatarErr);
        })
        .catch(function () { msg('err', T.avatarErr); });
    });
  }
  // ---- Exportar / importar el progreso (respaldo en archivo) ----
  if ($('cuenta-export')) $('cuenta-export').addEventListener('click', function () {
    var data = {};
    SYNC_KEYS.forEach(function (k) { var v = localStorage.getItem(k); if (v !== null) { try { data[k] = JSON.parse(v); } catch (e) { data[k] = v; } } });
    var payload = { app: 'NVISION', version: 1, exportedAt: new Date().toISOString(), data: data };
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    a.download = 'nvision-progreso.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    msg('ok', T.expOk);
  });
  if ($('cuenta-import-btn')) $('cuenta-import-btn').addEventListener('click', function () { $('cuenta-import-file').click(); });
  if ($('cuenta-import-file')) $('cuenta-import-file').addEventListener('change', function () {
    var f = this.files && this.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var obj = JSON.parse(String(reader.result || ''));
        if (!obj || obj.app !== 'NVISION' || !obj.data) throw new Error('formato');
        var applied = 0;
        SYNC_KEYS.forEach(function (k) {
          if (obj.data[k] !== undefined) { localStorage.setItem(k, JSON.stringify(obj.data[k])); applied++; }
        });
        if (!applied) throw new Error('vacio');
        msg('ok', T.impOk);
        ensureSession().then(function (s) { if (s) syncNow(s, true); });
        setTimeout(function () { location.reload(); }, 1200);
      } catch (e) { msg('err', T.impErr); }
    };
    reader.readAsText(f);
    this.value = '';
  });

  // ---- Publicar el puntaje en el ranking del sitio ----
  if ($('cuenta-rank')) $('cuenta-rank').addEventListener('click', function () {
    var st = $('cuenta-rank-state');
    ensureSession().then(function (s) {
      if (!s) { showAuth(); return; }
      if (!window.NVISION_LOGROS) return;
      var r = window.NVISION_LOGROS.compute();
      var name = String(s.email || 'NVISION').split('@')[0];
      api('/rest/v1/site_ranking?on_conflict=user_id', {
        method: 'POST', token: s.access,
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: { user_id: s.userId, name: name, avatar: s.avatar || null, avatar_image: s.avatarImg || null, points: r.points, updated_at: new Date().toISOString() }
      }).then(function (res) {
        if (res.status === 200 || res.status === 201 || res.status === 204) st.textContent = T.rankOk + ' ' + r.points + ' ' + T.rankPts;
        else if (res.status === 404 || (res.data && (res.data.code === 'PGRST205' || res.data.code === '42P01'))) st.textContent = T.rankOff;
        else st.textContent = T.rankErr;
      }).catch(function () { st.textContent = T.rankErr; });
    });
  });

  // ---- Ingreso con Google (el botón funciona en cuanto el equipo active
  // el proveedor en Supabase; si no está activo, Supabase devuelve un error
  // en la URL y mostramos el aviso amable en vez de una pantalla rara). ----
  if ($('cuenta-google')) $('cuenta-google').addEventListener('click', function () {
    location.href = SUPABASE_URL + '/auth/v1/authorize?provider=google&redirect_to=' + encodeURIComponent(location.origin + location.pathname);
  });
  (function handleAuthRedirect() {
    if (!location.hash || location.hash.length < 3) return;
    var params = new URLSearchParams(location.hash.slice(1));
    var clean = function () { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} };
    if (params.get('error') || params.get('error_description')) { clean(); msg('err', T.googleOff); return; }
    var at = params.get('access_token');
    if (!at) return;
    var rt = params.get('refresh_token');
    var exp = parseInt(params.get('expires_in') || '3600', 10);
    clean();
    api('/auth/v1/user', { token: at }).then(function (r) {
      if (r.status === 200 && r.data && r.data.id) {
        var s = saveSessionFromAuth({ access_token: at, refresh_token: rt, expires_in: exp, user: r.data }, r.data.email);
        msg('ok', T.welcomeBack);
        showPanel(s);
        if (!goNext()) syncNow(s, true);
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
    if (s) { showPanel(s); if (!goNext()) syncNow(s, true); }
    else showAuth();
  });
})();
