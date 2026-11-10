// NVISION · Mi progreso: historial de intentos de examen (nvision_historial_v1)
// con gráfica de barras de los últimos intentos y promedios por tema.
// Vive solo en cuenta.html, dentro del panel de la cuenta.
(function () {
  'use strict';
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var NAMES = {
    hardware: { es: 'Hardware', en: 'Hardware' }, redes: { es: 'Redes', en: 'Networks' },
    mantenimiento: { es: 'Mantenimiento', en: 'Maintenance' }, wifi: { es: 'WiFi', en: 'WiFi' },
    seguridad: { es: 'Seguridad digital', en: 'Digital security' }
  };
  var T = {
    es: { empty: 'Aún no registras intentos de examen. Cuando presentes uno, aquí verás la gráfica de tus notas.', attempts: 'intentos', avg: 'Promedio', last: 'Últimos intentos', best: 'mejor' },
    en: { empty: 'No exam attempts recorded yet. Once you take one, your score chart will appear here.', attempts: 'attempts', avg: 'Average', last: 'Latest attempts', best: 'best' }
  }[lang];
  var canvas = document.getElementById('prog-chart');
  var summary = document.getElementById('prog-summary');
  var list = document.getElementById('prog-list');
  if (!canvas || !summary || !list) return;

  function read() {
    try { var h = JSON.parse(localStorage.getItem('nvision_historial_v1') || '[]'); return Array.isArray(h) ? h : []; }
    catch (e) { return []; }
  }

  function render() {
    var hist = read();
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    list.innerHTML = '';
    if (!hist.length) { summary.textContent = T.empty; canvas.style.display = 'none'; return; }
    canvas.style.display = 'block';
    // Gráfica: últimos 14 intentos como barras (verde ≥70, ámbar 50-69, rojo <50)
    var rows = hist.slice(-14);
    var padL = 34, padB = 22, padT = 16, cw = W - padL - 8, ch = H - padB - padT;
    ctx.strokeStyle = 'rgba(148,163,184,.35)'; ctx.fillStyle = '#94a3b8'; ctx.font = '11px Inter, Arial'; ctx.textAlign = 'right';
    [0, 50, 70, 100].forEach(function (v) {
      var y = padT + ch - (v / 100) * ch;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - 8, y); ctx.stroke();
      ctx.fillText(v + '', padL - 5, y + 4);
    });
    var bw = Math.min(30, (cw / rows.length) * 0.62), gap = cw / rows.length;
    ctx.textAlign = 'center';
    rows.forEach(function (r, i) {
      var h = Math.max(2, (r.p / 100) * ch), x = padL + gap * i + (gap - bw) / 2, y = padT + ch - h;
      ctx.fillStyle = r.p >= 70 ? '#22c55e' : r.p >= 50 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(x, y, bw, h);
      ctx.fillStyle = '#e2e8f0'; ctx.font = '11px Inter, Arial';
      ctx.fillText(r.p + '', x + bw / 2, y - 4);
      ctx.fillStyle = '#94a3b8'; ctx.font = '9px Inter, Arial';
      var nm = (NAMES[r.e] || {})[lang] || r.e;
      ctx.fillText(nm.slice(0, 4) + '.', x + bw / 2, H - 8);
    });
    // Resumen: intentos, promedio y mejor por tema
    var byExam = {};
    hist.forEach(function (r) { (byExam[r.e] = byExam[r.e] || []).push(r.p); });
    var avgAll = Math.round(hist.reduce(function (a, r) { return a + r.p; }, 0) / hist.length);
    summary.textContent = hist.length + ' ' + T.attempts + ' · ' + T.avg + ': ' + avgAll + '%';
    Object.keys(byExam).forEach(function (k) {
      var arr = byExam[k], li = document.createElement('li');
      li.style.cssText = 'padding:5px 0;border-top:1px solid rgba(148,163,184,.18);font-size:.92rem';
      var avg = Math.round(arr.reduce(function (a, b) { return a + b; }, 0) / arr.length);
      li.textContent = ((NAMES[k] || {})[lang] || k) + ' — ' + arr.length + ' ' + T.attempts + ' · ' + T.avg.toLowerCase() + ' ' + avg + '% · ' + T.best + ' ' + Math.max.apply(null, arr) + '%';
      list.appendChild(li);
    });
  }

  render();
  // El panel nace oculto: re-pintar cuando se muestra (al iniciar sesión)
  var panel = document.getElementById('cuenta-panel');
  if (panel && window.MutationObserver) {
    new MutationObserver(function () { if (!panel.hidden) render(); }).observe(panel, { attributes: true, attributeFilter: ['hidden'] });
  }
})();
