// NVISION · Acceso flotante al Foro «El Taller» (2026-11-11)
// Botón en la esquina inferior izquierda de todas las páginas. El texto
// dice claro que es el FORO y el ícono es de comunidad (dos personas, al
// estilo de los íconos del sitio), no una burbuja de chat, para que nadie
// lo confunda con el asistente de IA: un toque y el estudiante está en el
// foro de soporte de la comunidad.
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
  a.title = lang === 'en' ? 'The Workshop Forum · Community support forum' : 'Foro El Taller · Foro de soporte de la comunidad';
  a.setAttribute('aria-label', a.title);
  a.innerHTML =
    '<span class="foro-fab-logo" aria-hidden="true">' +
    '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>' +
    '<circle cx="9" cy="7" r="4"/>' +
    '<path d="M23 21v-2a4 4 0 0 0-3-3.87"/>' +
    '<path d="M16 3.13a4 4 0 0 1 0 7.75"/>' +
    '</svg></span>' +
    '<span>' + (lang === 'en' ? 'The Workshop Forum' : 'Foro El Taller') + '</span>';
  document.body.appendChild(a);
})();
