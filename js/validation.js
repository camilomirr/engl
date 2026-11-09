/* NVISION · Capa de validación compartida (auditoría 2026-11-09).
   ---------------------------------------------------------------
   Un solo lugar para sanitizar y validar TODO lo que viene de fuera
   del código propio del sitio antes de pintarlo o enviarlo:
   · texto que se inserta con innerHTML (nombres, puntajes, mensajes
     del equipo, respuestas enseñadas al asistente),
   · datos que se publican en Supabase (ranking, leaderboard,
     jugadores en vivo, certificados),
   · entradas de formularios (correo, nombres, contraseñas),
   · valores que se leen de la URL o de localStorage.
   Sin dependencias. Se carga ANTES que los scripts de cada página
   que la usan (cuenta.js, ranking.js, redes_challenge/juego.js).
   Si por algún motivo no carga, cada uso hace fallback seguro
   (los scripts comprueban `window.NVISION_validate` antes de usarlo).
   Uso: window.NVISION_validate.escapeHtml(s), .toInt(v, min, max),
   .cleanName(s, max), .isEmail(s), .isUuid(s), .validAvatarImg(s). */
(function () {
  'use strict';

  /* Escape HTML completo: & < > " ' ` — cubre contexto de texto y de
     atributo (el esc() local de main.js no escapaba ' ni `). */
  var HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' };
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"'`]/g, function (c) { return HTML_ESCAPES[c]; });
  }
  /* Escape para dentro de un atributo entre comillas dobles. */
  function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, '&quot;');
  }

  /* Entero saneado dentro de un rango. Todo lo que no sea un número
     finito cae al valor por defecto: así un puntaje o una nota que
     llegue como texto (o como HTML) desde la base nunca se pinta
     tal cual en la página ni se publica fuera de rango. */
  function toInt(v, min, max, fallback) {
    var n = (typeof v === 'number') ? v : parseInt(String(v == null ? '' : v).trim(), 10);
    if (!isFinite(n)) return (typeof fallback === 'number') ? fallback : 0;
    n = Math.trunc(n);
    if (typeof min === 'number' && n < min) n = min;
    if (typeof max === 'number' && n > max) n = max;
    return n;
  }

  /* Nombre de persona saneado: sin < > & " ' ` ni caracteres de
     control, espacios colapsados, longitud acotada. El nombre se
     publica en el ranking / leaderboard y lo ven otros visitantes,
     así que nunca debe llevar marcado ni saltos de línea. */
  function cleanName(s, max) {
    var t = String(s == null ? '' : s).replace(/[<>&"'`\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim();
    var m = (typeof max === 'number' && max > 0) ? max : 60;
    return t.slice(0, m);
  }

  /* Texto libre (mensaje, tarea, resultado): quita caracteres de
     control y acota la longitud; el pintado posterior sigue usando
     escapeHtml/textContent, esto solo evita valores absurdos. */
  function cleanText(s, max) {
    var t = String(s == null ? '' : s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
    var m = (typeof max === 'number' && max > 0) ? max : 4000;
    return t.slice(0, m);
  }

  function isEmail(s) {
    return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim()) && s.trim().length <= 254;
  }

  function isUuid(s) {
    return typeof s === 'string' && /^[0-9a-fA-F-]{36}$/.test(s);
  }

  /* Puntaje / nota: entero 0..100000 (mismo rango que los CHECK de
     la base en supabase/site_ranking.sql y endurecimiento.sql). */
  function safePoints(v) { return toInt(v, 0, 100000, 0); }
  function safeScore(v) { return toInt(v, 0, 100, 0); }

  /* Foto de avatar: SOLO data: base64 (jpeg/png/webp) o foto oficial
     de Google. Cualquier otra cosa (javascript:, URL arbitraria,
     svg con scripts) se descarta. Mismo criterio que el validAvatarImg
     de main.js y que los CHECK de la base. */
  var AVATAR_IMG_RE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
  var AVATAR_GOOGLE_RE = /^https:\/\/lh3\.googleusercontent\.com\/[A-Za-z0-9\-_=/]+$/;
  function validAvatarImg(img) {
    if (typeof img !== 'string' || img.length > 130000) return false;
    return AVATAR_IMG_RE.test(img) || AVATAR_GOOGLE_RE.test(img);
  }

  /* Código de certificado: formato NV-XXXXX-XXXXX. */
  function isCertCode(s) {
    return typeof s === 'string' && /^NV-[0-9A-Z]{5}-[0-9A-Z]{5}$/.test(s.trim().toUpperCase());
  }

  /* URL de redirección interna tras iniciar sesión: solo destinos de
     la lista (mismo criterio que nextTarget() en cuenta.js). */
  var SAFE_NEXT = ['examenes.html', 'ruta.html', 'index.html'];
  function safeNext(n) {
    return (typeof n === 'string' && SAFE_NEXT.indexOf(n) >= 0) ? n : null;
  }

  window.NVISION_validate = {
    escapeHtml: escapeHtml,
    escapeAttr: escapeAttr,
    toInt: toInt,
    cleanName: cleanName,
    cleanText: cleanText,
    isEmail: isEmail,
    isUuid: isUuid,
    safePoints: safePoints,
    safeScore: safeScore,
    validAvatarImg: validAvatarImg,
    isCertCode: isCertCode,
    safeNext: safeNext
  };
})();
