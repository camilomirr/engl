// NVISION - Comparador de componentes del catálogo del Workshop.
import { FALLBACK_COMPONENTS } from '../workshop/js/data/catalog.js';

var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
var T = {
  es: { price: 'Precio', watts: 'Consumo', level: 'Nivel en el Workshop', perf: 'Rendimiento', brand: 'Marca', desc: 'Descripción', spec: 'Dato', winsPerf: 'gana en rendimiento', winsValue: 'gana en precio/rendimiento', tie: 'Quedan muy parejos: elige por precio o por la descripción.', err: 'No se pudo cargar el catálogo.' },
  en: { price: 'Price', watts: 'Power draw', level: 'Workshop level', perf: 'Performance', brand: 'Brand', desc: 'Description', spec: 'Spec', winsPerf: 'wins on performance', winsValue: 'wins on value', tie: 'Very close: choose by price or the description.', err: 'The catalog could not be loaded.' }
}[lang];
var CATS = {
  es: { cpu: 'Procesadores', gpu: 'Tarjetas gráficas', board: 'Placas base', ram: 'Memoria RAM', storage: 'Almacenamiento', psu: 'Fuentes de poder', case: 'Gabinetes', cooler: 'Refrigeración' },
  en: { cpu: 'Processors', gpu: 'Graphics cards', board: 'Motherboards', ram: 'RAM memory', storage: 'Storage', psu: 'Power supplies', case: 'Cases', cooler: 'Coolers' }
}[lang];
var SPEC_LABELS = {
  socket: 'Socket', cores: lang === 'es' ? 'Núcleos' : 'Cores', threads: lang === 'es' ? 'Hilos' : 'Threads',
  boostGHz: 'Boost (GHz)', baseGHz: 'Base (GHz)', tdp: 'TDP (W)', igpu: 'iGPU', vramGb: 'VRAM (GB)',
  lenMm: lang === 'es' ? 'Largo (mm)' : 'Length (mm)', slots: 'Slots', chipset: 'Chipset', ramType: 'RAM',
  formFactor: lang === 'es' ? 'Formato' : 'Form factor', type: lang === 'es' ? 'Tipo' : 'Type', gb: 'GB',
  modules: lang === 'es' ? 'Módulos' : 'Modules', speed: lang === 'es' ? 'Velocidad' : 'Speed', cl: 'CL', rgb: 'RGB',
  capacityGb: lang === 'es' ? 'Capacidad (GB)' : 'Capacity (GB)', wattsRated: lang === 'es' ? 'Potencia (W)' : 'Wattage (W)',
  cert: lang === 'es' ? 'Certificación' : 'Certification', maxGpuMm: lang === 'es' ? 'GPU máx (mm)' : 'Max GPU (mm)'
};

var catSel = document.getElementById('cmp-cat');
var aSel = document.getElementById('cmp-a');
var bSel = document.getElementById('cmp-b');
var table = document.getElementById('cmp-table');
var verdict = document.getElementById('cmp-verdict');
var ITEMS = FALLBACK_COMPONENTS || [];

function perfScore(it) {
  if (!it.perf) return 0;
  if (typeof it.perf.score === 'number') return it.perf.score;
  var vals = ['gaming', 'work', 'fps'].map(function (k) { return it.perf[k] || 0; });
  return Math.round((vals[0] + vals[1] + vals[2]) / 3);
}
function fillItems() {
  var cat = catSel.value;
  var list = ITEMS.filter(function (i) { return i.category === cat; });
  [aSel, bSel].forEach(function (sel, idx) {
    sel.innerHTML = '';
    list.forEach(function (it) {
      var o = document.createElement('option');
      o.value = it.id; o.textContent = it.name + ' — $' + it.price;
      sel.appendChild(o);
    });
    if (list.length > 1) sel.selectedIndex = idx === 0 ? 0 : 1;
    else if (list.length) sel.selectedIndex = 0;
  });
  render();
}
function fmtVal(v) {
  if (v === true) return '✓';
  if (v === false) return '—';
  if (v === undefined || v === null) return '—';
  return String(v);
}
function render() {
  var a = ITEMS.find(function (i) { return i.id === aSel.value; });
  var b = ITEMS.find(function (i) { return i.id === bSel.value; });
  if (!a || !b) { table.innerHTML = ''; verdict.textContent = T.err; return; }
  var rows = [];
  function row(label, va, vb, better) {
    var ca = '', cb = '';
    if (better === 'a') ca = ' class="win"'; else if (better === 'b') cb = ' class="win"';
    rows.push('<tr><th>' + label + '</th><td' + ca + '>' + va + '</td><td' + cb + '>' + vb + '</td></tr>');
  }
  var pa = perfScore(a), pb = perfScore(b);
  rows.push('<tr><th></th><th class="cmp-name">' + a.name + '</th><th class="cmp-name">' + b.name + '</th></tr>');
  row(T.brand, a.brand, b.brand);
  row(T.desc, a.blurb[lang], b.blurb[lang]);
  row(T.price, '$' + a.price, '$' + b.price, a.price === b.price ? '' : (a.price < b.price ? 'a' : 'b'));
  row(T.perf, pa + '/100', pb + '/100', pa === pb ? '' : (pa > pb ? 'a' : 'b'));
  row(T.watts, a.watts + ' W', b.watts + ' W', a.watts === b.watts ? '' : (a.watts < b.watts ? 'a' : 'b'));
  row(T.level, a.unlockLevel, b.unlockLevel);
  var keys = [];
  [a.specs, b.specs].forEach(function (sp) { Object.keys(sp || {}).forEach(function (k) { if (keys.indexOf(k) === -1) keys.push(k); }); });
  keys.forEach(function (k) {
    row(SPEC_LABELS[k] || k, fmtVal((a.specs || {})[k]), fmtVal((b.specs || {})[k]));
  });
  table.innerHTML = rows.join('');

  if (pa !== pb) {
    var winner = pa > pb ? a : b;
    var loser = pa > pb ? b : a;
    var wPerf = Math.max(pa, pb), lPerf = Math.min(pa, pb);
    var valW = winner.price > 0 ? wPerf / winner.price : 0;
    var valL = loser.price > 0 ? lPerf / loser.price : 0;
    verdict.textContent = '★ ' + winner.name + ' ' + T.winsPerf + ' (' + wPerf + ' vs ' + lPerf + ')' +
      (valL > valW && loser.price > 0 ? ' · ' + loser.name + ' ' + T.winsValue : '') + '.';
  } else verdict.textContent = T.tie;
}

if (!ITEMS.length) { verdict.textContent = T.err; }
else {
  Object.keys(CATS).forEach(function (c) {
    if (!ITEMS.some(function (i) { return i.category === c; })) return;
    var o = document.createElement('option');
    o.value = c; o.textContent = CATS[c];
    catSel.appendChild(o);
  });
  catSel.addEventListener('change', fillItems);
  aSel.addEventListener('change', render);
  bSel.addEventListener('change', render);
  fillItems();
}
