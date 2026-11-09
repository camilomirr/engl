// NVISION Workshop - Trampa de errores de arranque.
// Antes era un script inline en workshop/index.html; se movió aquí para
// poder quitar unsafe-inline de la CSP (auditoría de seguridad 2026-11-09).
window.__WS_ERRORS = [];
window.addEventListener('error', function (e) { window.__WS_ERRORS.push(String((e && e.message) || 'error')); }, true);
window.addEventListener('unhandledrejection', function (e) { window.__WS_ERRORS.push('promise: ' + String((e.reason && e.reason.message) || e.reason)); });
setTimeout(function () {
  if (!window.__WS_BOOTED) {
    var d = document.createElement('div');
    d.id = 'ws-diag';
    d.style.cssText = 'position:relative;z-index:99;background:#7f1d1d;color:#fff;padding:.7rem 1rem;font:600 .92rem system-ui,sans-serif;';
    d.textContent = 'DIAGNOSTICO: el taller no termino de cargar. Etapa: ' + (window.__WS_STAGE || 'sin iniciar') + '. Error: ' + (window.__WS_ERROR || '(ninguno)') + '. Errores capturados: ' + (window.__WS_ERRORS.join(' | ') || '(ninguno)');
    document.body.prepend(d);
  }
}, 8000);
