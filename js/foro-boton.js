// NVISION · Acceso flotante al Foro «El Taller» (2026-11-10)
// Botón en la esquina inferior izquierda de todas las páginas, con el
// loguito del foro (globo de conversación + llave de taller): un toque
// y el estudiante está en el foro de soporte de la comunidad.
// Se apila encima del Tutor NVI-Bot en las páginas que lo tienen
// (regla CSS body:has(.tutor-wrap) en css/modules/mejoras.css).
// En la propia página del foro no se muestra (ya estás ahí).
(function () {
  'use strict';
  if (/\/foro\.html$/.test(location.pathname) || location.pathname.endsWith('foro.html')) return;
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var inSub = /\/(redes_challenge|workshop)\//.test(location.pathname);
  var a = document.createElement('a');
  a.className = 'foro-fab';
  a.href = (inSub ? '../' : '') + 'foro.html';
  a.title = lang === 'en' ? 'The Workshop · Community support forum' : 'El Taller · Foro de soporte de la comunidad';
  a.setAttribute('aria-label', a.title);
  a.innerHTML =
    '<span class="foro-fab-logo" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>' +
    '<path d="M14.7 6.3a3.5 3.5 0 0 0-4.6 4L7 13.4V17h3.6l3.1-3.1a3.5 3.5 0 0 0 4-4.6l-2.3 2.3-2.1-.7-.7-2.1z" fill="#fff" stroke="none"/>' +
    '</svg></span>' +
    '<span>' + (lang === 'en' ? 'The Workshop' : 'El Taller') + '</span>';
  document.body.appendChild(a);
})();
