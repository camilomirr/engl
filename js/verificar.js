// NVISION - Verificación de certificados.
// El código se recalcula con el MISMO algoritmo de examenes.js
// (FNV-1a sobre nombre|examen|nota|fecha). Si el dueño ya creó la
// tabla `certificados`, también se consulta el registro oficial.
(function () {
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var T = {
    es: { ok: 'Certificado auténtico', okSub: 'Los datos coinciden con el código de verificación.', okReg: 'Además aparece en el registro oficial de NVISION.', bad: 'No se pudo verificar', badSub: 'Algún dato no coincide con el código. Revisa el nombre (tal como está en el certificado), la nota y la fecha del examen aprobado.', checking: 'Consultando el registro…' },
    en: { ok: 'Authentic certificate', okSub: 'The details match the verification code.', okReg: 'It also appears in the official NVISION registry.', bad: 'Could not be verified', badSub: 'Some detail does not match the code. Check the name (exactly as on the certificate), the score and the passing date.', checking: 'Checking the registry…' }
  }[lang];

  function codeFor(name, examId, pct, dateKey) {
    var s = String(name || '').toUpperCase().trim() + '|' + examId + '|' + pct + '|' + dateKey;
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 0x01000193) >>> 0; }
    var b = h.toString(36).toUpperCase();
    while (b.length < 10) b = '0' + b;
    return 'NV-' + b.slice(0, 5) + '-' + b.slice(5, 10);
  }

  var form = document.getElementById('verify-form');
  var result = document.getElementById('verify-result');
  if (!form) return;

  function show(ok, title, sub) {
    result.hidden = false;
    result.className = 'verify-result ' + (ok ? 'ok' : 'bad');
    result.innerHTML = '';
    var h = document.createElement('strong'); h.textContent = (ok ? '✓ ' : '✕ ') + title;
    var p = document.createElement('p'); p.textContent = sub;
    result.append(h, p);
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var name = document.getElementById('vf-name').value;
    var exam = document.getElementById('vf-exam').value;
    var score = parseInt(document.getElementById('vf-score').value, 10);
    var date = document.getElementById('vf-date').value;
    var code = document.getElementById('vf-code').value.toUpperCase().trim();
    if (isNaN(score) || !date) { show(false, T.bad, T.badSub); return; }

    var expected = codeFor(name, exam, score, date);
    if (expected !== code) { show(false, T.bad, T.badSub); return; }

    // Código válido. Si existe el registro oficial, se confirma ahí.
    var key = window.NVISION_SUPABASE_ANON_KEY;
    if (!key) { show(true, T.ok, T.okSub); return; }
    result.hidden = false; result.className = 'verify-result'; result.textContent = T.checking;
    fetch('https://xiuztrujrwdgcpjrruxu.supabase.co/rest/v1/certificados?select=code&code=eq.' + encodeURIComponent(code), {
      headers: { apikey: key, Authorization: 'Bearer ' + key }
    }).then(function (r) {
      if (!r.ok) throw new Error('sin registro');
      return r.json();
    }).then(function (rows) {
      if (rows && rows.length) show(true, T.ok, T.okSub + ' ' + T.okReg);
      else show(true, T.ok, T.okSub);
    }).catch(function () { show(true, T.ok, T.okSub); });
  });
})();
