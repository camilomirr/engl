// NVISION · Repetición espaciada (SRS) compartida.
// Sistema de cajas de Leitner: cada tarjeta vive en una caja 0..4;
// acertarla la sube de caja (vuelve en 1, 3, 7 o 16 días) y fallarla
// la regresa a la caja 0 (vuelve hoy). Estado en nvision_srs_v1,
// sincronizable con la cuenta. Lo usan el glosario y el inglés técnico.
window.NVISION_srs = (function () {
  'use strict';
  var KEY = 'nvision_srs_v1';
  var DAYS = [0, 1, 3, 7, 16];
  function load() { try { var d = JSON.parse(localStorage.getItem(KEY) || '{}'); return d && typeof d === 'object' ? d : {}; } catch (e) { return {}; } }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  function mark(scope, id, known) {
    var d = load(); if (!d[scope]) d[scope] = {};
    var it = d[scope][id] || { box: 0, due: 0 };
    it.box = known ? Math.min(4, (it.box || 0) + 1) : 0;
    it.due = Date.now() + (DAYS[it.box] || 0) * 864e5;
    d[scope][id] = it; save(d);
  }
  function dueCount(scope, ids) {
    var s = load()[scope] || {}, now = Date.now(), n = 0;
    ids.forEach(function (id) { var it = s[id]; if (!it || it.due <= now) n++; });
    return n;
  }
  function order(scope, ids) {
    var s = load()[scope] || {};
    return ids.slice().sort(function (a, b) {
      var ia = s[a], ib = s[b];
      return ((ia ? ia.due : 0) - (ib ? ib.due : 0)) || String(a).localeCompare(String(b));
    });
  }
  return { mark: mark, dueCount: dueCount, order: order };
})();
