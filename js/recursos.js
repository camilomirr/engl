// NVISION - Recursos: buscador, filtros y modo tarjetas del glosario.
// Antes vivía como script inline dentro de recursos.html; se movió a este
// archivo para que la página pueda usar CSP sin unsafe-inline (auditoría
// de seguridad 2026-11-09).
(function () {
var list = document.getElementById('glos-list');
if (!list) return;
var cards = Array.prototype.slice.call(list.querySelectorAll('.glossary-card[data-cat]'));
var count = document.getElementById('glos-count');
var input = document.getElementById('glos-q');
var filtro = 'todos', q = '';
function glosLang() { try { return localStorage.getItem('user_lang') || 'es'; } catch (e) { return 'es'; } }
function glosCat(c) { var m = { Redes: { es: 'Redes', en: 'Networks' }, Hardware: { es: 'Hardware', en: 'Hardware' }, Mantenimiento: { es: 'Mantenimiento', en: 'Maintenance' } }; return (m[c] && m[c][glosLang()]) || c; }
function glosCount(v, total) { return glosLang() === 'en' ? v + ' of ' + total + ' terms' : v + ' de ' + total + ' términos'; }
function glosEmpty() { return glosLang() === 'en' ? 'No results. Try another word.' : 'No hay resultados. Prueba otra palabra.'; }
function glosHint() { return glosLang() === 'en' ? 'Tap to see the definition' : 'Toca para ver la definición'; }
function glosPos(i, total, c) { return glosLang() === 'en' ? 'Card ' + i + ' of ' + total + ' \u00b7 ' + glosCat(c) : 'Tarjeta ' + i + ' de ' + total + ' \u00b7 ' + glosCat(c); }
function visibles() {
  return cards.filter(function (c) {
    return (filtro === 'todos' || c.getAttribute('data-cat') === filtro) &&
           (!q || c.textContent.toLowerCase().indexOf(q) !== -1);
  });
}
function render() {
  var v = visibles();
  cards.forEach(function (c) { c.style.display = v.indexOf(c) !== -1 ? '' : 'none'; });
  if (count) count.textContent = glosCount(v.length, cards.length);
  if (!v.length && !document.getElementById('glos-empty')) {
    var p = document.createElement('p');
    p.id = 'glos-empty'; p.className = 'glossary-count';
    p.textContent = glosEmpty();
    list.appendChild(p);
  }
  var e = document.getElementById('glos-empty');
  if (e && v.length) e.remove();
}
if (input) input.addEventListener('input', function () { q = input.value.toLowerCase().trim(); render(); });
document.querySelectorAll('[data-gf]').forEach(function (b) {
  b.addEventListener('click', function () {
    document.querySelectorAll('[data-gf]').forEach(function (x) { x.classList.remove('active'); });
    b.classList.add('active'); filtro = b.getAttribute('data-gf'); render();
  });
});
// Modo tarjetas
var flash = document.getElementById('glos-flash'), fc = document.getElementById('glos-fc'),
    pos = document.getElementById('glos-pos'), orden = [], idx = 0, volteada = false;
function datos(c) {
  return {
    t: c.querySelector('.glossary-term').textContent,
    d: c.querySelector('.glossary-desc').textContent,
    e: c.querySelector('.glossary-ej').textContent,
    c: c.getAttribute('data-cat')
  };
}
function showFlash() {
  if (!orden.length) return;
  var g = orden[idx];
  fc.innerHTML = volteada
    ? '<div class="glossary-fc-back"><strong></strong><p class="d"></p><p class="e"></p></div>'
    : '<div class="glossary-fc-front"></div><p class="glossary-flash-hint">' + glosHint() + '</p>';
  if (volteada) {
    fc.querySelector('strong').textContent = g.t;
    fc.querySelector('.d').textContent = g.d;
    fc.querySelector('.e').textContent = g.e;
  } else {
    fc.querySelector('.glossary-fc-front').textContent = g.t;
  }
  pos.textContent = glosPos(idx + 1, orden.length, g.c);
  var dueEl = document.getElementById('glos-due');
  if (dueEl && window.NVISION_srs) {
    var nd = window.NVISION_srs.dueCount('glosario', cards.map(function (c) { return datos(c).t; }));
    dueEl.textContent = nd > 0 ? 'Repaso inteligente: hoy te tocan ' + nd + ' tarjetas' : 'Repaso inteligente: todo al día';
  }
}
function openFlash() {
  var v = visibles(); orden = (v.length ? v : cards).map(datos);
  // Repetición espaciada: primero las tarjetas vencidas o nuevas.
  if (window.NVISION_srs) {
    var names = window.NVISION_srs.order('glosario', orden.map(function (g) { return g.t; }));
    orden.sort(function (a, b) { return names.indexOf(a.t) - names.indexOf(b.t); });
  }
  idx = 0; volteada = false;
  list.style.display = 'none'; if (count) count.style.display = 'none';
  flash.hidden = false; showFlash();
}
function exitFlash() {
  flash.hidden = true; list.style.display = ''; if (count) count.style.display = '';
}
document.getElementById('glos-mode').addEventListener('click', openFlash);
document.getElementById('glos-exit').addEventListener('click', exitFlash);
function flip() { volteada = !volteada; showFlash(); }
document.getElementById('glos-flip').addEventListener('click', flip);
fc.addEventListener('click', flip);
document.getElementById('glos-next').addEventListener('click', function () { idx = (idx + 1) % orden.length; volteada = false; showFlash(); });
document.getElementById('glos-prev').addEventListener('click', function () { idx = (idx - 1 + orden.length) % orden.length; volteada = false; showFlash(); });
document.getElementById('glos-shuffle').addEventListener('click', function () { orden.sort(function () { return Math.random() - 0.5; }); idx = 0; volteada = false; showFlash(); });
function glosSrs(known) {
  if (!orden.length) return;
  if (window.NVISION_srs) window.NVISION_srs.mark('glosario', orden[idx].t, known);
  idx = (idx + 1) % orden.length; volteada = false; showFlash();
}
var gk = document.getElementById('glos-knew'); if (gk) gk.addEventListener('click', function () { glosSrs(true); });
var gr = document.getElementById('glos-review'); if (gr) gr.addEventListener('click', function () { glosSrs(false); });
render();
  })();
