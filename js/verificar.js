// NVISION - Verificación de certificados.
// El código se recalcula con el MISMO algoritmo de examenes.js
// (FNV-1a sobre nombre|examen|nota|fecha). Si el dueño ya creó la
// tabla `certificados`, también se consulta el registro oficial.
(function () {
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var T = {
    es: { ok: 'Certificado auténtico', okSub: 'Los datos coinciden con el código de verificación.', okReg: 'Además aparece en el registro oficial de NVISION.', bad: 'No se pudo verificar', badSub: 'Algún dato no coincide con el código. Revisa el nombre (tal como está en el certificado), la nota y la fecha del examen aprobado.', checking: 'Consultando el registro…', notReg: 'No consta en el registro oficial', notRegSub: 'El código coincide con el cálculo, pero este certificado NO aparece en el registro oficial de NVISION, así que no se puede confirmar su autenticidad.', noReg: 'Autenticidad no confirmada', noRegSub: 'El código coincide con el cálculo, pero el registro oficial no está activo o no se pudo consultar, así que la autenticidad no queda confirmada. El código por sí solo no basta: cualquiera puede calcularlo.' },
    en: { ok: 'Authentic certificate', okSub: 'The details match the verification code.', okReg: 'It also appears in the official NVISION registry.', bad: 'Could not be verified', badSub: 'Some detail does not match the code. Check the name (exactly as on the certificate), the score and the passing date.', checking: 'Checking the registry…', notReg: 'Not in the official registry', notRegSub: 'The code matches the calculation, but this certificate does NOT appear in the official NVISION registry, so its authenticity cannot be confirmed.', noReg: 'Authenticity not confirmed', noRegSub: 'The code matches the calculation, but the official registry is not active or could not be reached, so authenticity is not confirmed. The code alone is not enough: anyone can compute it.' }
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
    result.className = 'verify-result ' + (ok === 'warn' ? 'warn' : ok ? 'ok' : 'bad');
    result.innerHTML = '';
    var h = document.createElement('strong'); h.textContent = (ok === 'warn' ? '⚠ ' : ok ? '✓ ' : '✕ ') + title;
    var p = document.createElement('p'); p.textContent = sub;
    result.append(h, p);
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var V = window.NVISION_validate;
    var name = document.getElementById('vf-name').value;
    // Mismo saneado del nombre que aplica examenes.js al generar el
    // certificado, para que el código calculado coincida en ambos lados.
    if (V) name = V.cleanName(name, 60);
    var exam = document.getElementById('vf-exam').value;
    var score = V ? V.toInt(document.getElementById('vf-score').value, 0, 100, NaN) : parseInt(document.getElementById('vf-score').value, 10);
    var date = document.getElementById('vf-date').value;
    var code = document.getElementById('vf-code').value.toUpperCase().trim();
    // Capa de validación: formato estricto del código, nota 0..100 y
    // fecha con forma válida antes de cualquier cálculo o consulta.
    var codeOk = V ? V.isCertCode(code) : /^NV-[0-9A-Z]{5}-[0-9A-Z]{5}$/.test(code);
    if (!codeOk || isNaN(score) || !/^\d{4}-\d{2}-\d{2}$/.test(date || '')) { show(false, T.bad, T.badSub); return; }

    var expected = codeFor(name, exam, score, date);
    if (expected !== code) { show(false, T.bad, T.badSub); return; }

    // El código coincide con el cálculo, pero eso NO basta para decir
    // "auténtico": el algoritmo es público (vive en este mismo archivo),
    // así que cualquiera puede fabricar un código válido para cualquier
    // nombre y nota. La confirmación real es el registro oficial:
    //   · aparece en el registro  -> auténtico.
    //   · el registro responde y NO aparece -> no confirmado (rojo).
    //   · el registro no existe o no responde -> no confirmado (ámbar):
    //     antes este caso también se mostraba como auténtico, y por ahí
    //     pasaba cualquier certificado falso (auditoría 2026-11-09: la
    //     tabla certificados aún no existe en Supabase; el equipo la crea
    //     ejecutando supabase/certificados.sql en el panel).
    var key = window.NVISION_SUPABASE_ANON_KEY;
    if (!key) { show('warn', T.noReg, T.noRegSub); return; }
    result.hidden = false; result.className = 'verify-result'; result.textContent = T.checking;
    fetch('https://xiuztrujrwdgcpjrruxu.supabase.co/rest/v1/certificados?select=code&code=eq.' + encodeURIComponent(code), {
      headers: { apikey: key, Authorization: 'Bearer ' + key }
    }).then(function (r) {
      if (!r.ok) throw new Error('sin registro');
      return r.json();
    }).then(function (rows) {
      if (rows && rows.length) show(true, T.ok, T.okSub + ' ' + T.okReg);
      else show(false, T.notReg, T.notRegSub);
    }).catch(function () { show('warn', T.noReg, T.noRegSub); });
  });
})();
