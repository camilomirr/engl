// NVISION - Mi cuenta: registro e inicio de sesión con Supabase Auth y
// sincronización del progreso (ruta, exámenes y Workshop) en la tabla user_progress.
// La llave anon es pública por diseño (la misma que ya usa el widget de equipo).
(function () {
  'use strict';

  var SUPABASE_URL = 'https://xiuztrujrwdgcpjrruxu.supabase.co';
  var ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdXp0cnVqcndkZ2NwanJydXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNTk2ODcsImV4cCI6MjEwOTYzNTY4N30.CBBQpCqHxuOtCaMcdUfIrKTa4vt0QJRqvivskHnt5g0';
  var SESSION_KEY = 'nvision_session_v1';
  var META_KEY = 'nvision_sync_meta_v1';
  var SYNC_KEYS = ['nvision_ruta_v1', 'nvision_examenes_v1', 'nvision_workshop_v2'];
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
      lastSync: 'Última sincronización'
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
      lastSync: 'Last sync'
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
      email: (data.user && data.user.email) || email
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
  }
  function showPanel(session) {
    $('cuenta-auth').hidden = true;
    $('cuenta-panel').hidden = false;
    $('cuenta-user-email').textContent = session.email || '';
    var meta = getMeta();
    $('cuenta-sync-state').textContent = meta.lastSyncAt ? (T.lastSync + ': ' + new Date(meta.lastSyncAt).toLocaleString(lang === 'en' ? 'en-US' : 'es-CO')) : '';
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
      api('/auth/v1/signup', { method: 'POST', body: { email: email, password: pass } })
        .then(function (r) {
          done();
          if (r.status === 200 && r.data) {
            if (r.data.access_token) {
              var s = saveSessionFromAuth(r.data, email);
              showPanel(s); syncNow(s, true);
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
            syncNow(s, true);
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

  renderMode();
  ensureSession().then(function (s) {
    if (s) { showPanel(s); syncNow(s, true); }
    else showAuth();
  });
})();
