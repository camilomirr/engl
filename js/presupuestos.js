// NVISION · Presupuestos reales (2026-11-10)
// Simulador de armado con mercado simulado: cada componente tiene un
// precio base que fluctúa a diario (semilla = la fecha, igual para
// todo el mundo ese día). El reto: cumplir el rendimiento pedido sin
// pasarse del presupuesto y con una fuente de poder suficiente.
// Las victorias se guardan en nvision_presupuestos_v1 para los logros.
(function () {
  'use strict';
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var KEY = 'nvision_presupuestos_v1';
  var V = window.NVISION_validate;

  var T = {
    es: { market: 'Mercado simulado de hoy', win: '🏆 ¡Reto superado! Puntaje costo-beneficio: ', over: 'Te pasaste del presupuesto por $', lowPerf: 'Falta rendimiento: necesitas ', psuBad: 'La fuente no aguanta: el consumo estimado supera su capacidad.', psuOk: '✓ alcanza', choose: 'Elige una pieza', doneBefore: 'Ya superaste este reto antes (mejor: ', up: '▲', down: '▼', vsBase: 'vs. precio base' },
    en: { market: 'Simulated market today', win: '🏆 Challenge cleared! Cost-benefit score: ', over: 'You went over budget by $', lowPerf: 'Not enough performance: you need ', psuBad: 'The PSU cannot keep up: estimated draw exceeds its capacity.', psuOk: '✓ enough', choose: 'Choose a part', doneBefore: 'You already cleared this challenge (best: ', up: '▲', down: '▼', vsBase: 'vs. base price' }
  }[lang];

  // precio base (USD), rendimiento (0-30 por pieza) y consumo (W).
  var CATS = [
    { id: 'cpu', name: { es: 'Procesador', en: 'Processor' }, parts: [
      { n: 'Ryzen 3 4100', price: 75, perf: 8, w: 65 },
      { n: 'Core i5-12400F', price: 130, perf: 14, w: 65 },
      { n: 'Ryzen 7 5800X', price: 175, perf: 19, w: 105 },
      { n: 'Core i7-13700K', price: 320, perf: 26, w: 125 } ] },
    { id: 'gpu', name: { es: 'Tarjeta de video', en: 'Graphics card' }, parts: [
      { n: 'Sin tarjeta (integrada)', price: 0, perf: 2, w: 0 },
      { n: 'GTX 1660 Super', price: 160, perf: 12, w: 125 },
      { n: 'RTX 4060', price: 300, perf: 22, w: 115 },
      { n: 'RTX 4070 Ti', price: 620, perf: 30, w: 285 } ] },
    { id: 'ram', name: { es: 'Memoria RAM', en: 'RAM' }, parts: [
      { n: '8 GB DDR4 3200', price: 25, perf: 4, w: 4 },
      { n: '16 GB DDR4 3200', price: 45, perf: 8, w: 5 },
      { n: '32 GB DDR5 5600', price: 95, perf: 13, w: 6 } ] },
    { id: 'ssd', name: { es: 'Almacenamiento', en: 'Storage' }, parts: [
      { n: 'SSD SATA 480 GB', price: 32, perf: 4, w: 3 },
      { n: 'NVMe 1 TB Gen3', price: 58, perf: 8, w: 4 },
      { n: 'NVMe 2 TB Gen4', price: 120, perf: 12, w: 5 } ] },
    { id: 'board', name: { es: 'Placa base', en: 'Motherboard' }, parts: [
      { n: 'Placa básica A520/B660', price: 85, perf: 3, w: 45 },
      { n: 'Placa intermedia B550/B760', price: 140, perf: 5, w: 50 },
      { n: 'Placa avanzada X670/Z790', price: 240, perf: 7, w: 55 } ] },
    { id: 'psu', name: { es: 'Fuente de poder', en: 'Power supply' }, parts: [
      { n: '450 W genérica', price: 28, perf: 0, w: 0, cap: 450 },
      { n: '650 W 80+ Bronze', price: 62, perf: 1, w: 0, cap: 650 },
      { n: '850 W 80+ Gold', price: 110, perf: 2, w: 0, cap: 850 } ] },
    { id: 'case', name: { es: 'Gabinete', en: 'Case' }, parts: [
      { n: 'Gabinete sencillo', price: 35, perf: 1, w: 0 },
      { n: 'Gabinete con buen flujo de aire', price: 70, perf: 3, w: 0 },
      { n: 'Gabinete premium con vidrio', price: 130, perf: 4, w: 0 } ] }
  ];

  var CHALLENGES = [
    { id: 'oficina', name: { es: 'PC de oficina', en: 'Office PC' }, budget: 450, perf: 30, desc: { es: 'Para documentos, clases y videollamadas: barata y suficiente.', en: 'For documents, classes and video calls: cheap and enough.' } },
    { id: 'gaming', name: { es: 'Gaming 1080p', en: '1080p gaming' }, budget: 900, perf: 58, desc: { es: 'Juegos actuales en Full HD con buenos FPS, sin tirar la casa por la ventana.', en: 'Current games in Full HD with good FPS, without breaking the bank.' } },
    { id: 'creador', name: { es: 'Estación creadora', en: 'Creator workstation' }, budget: 1500, perf: 82, desc: { es: 'Edición de video y diseño 3D: músculo de sobra, con cabeza.', en: 'Video editing and 3D design: plenty of muscle, spent wisely.' } }
  ];

  // Fluctuación diaria determinista: misma semilla (la fecha) y el id
  // de la pieza producen el mismo factor en cualquier dispositivo.
  function factor(seedStr) {
    var h = 2166136261;
    for (var i = 0; i < seedStr.length; i++) { h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619); }
    var x = (h >>> 0) / 4294967295; // 0..1
    return 0.85 + x * 0.33; // -15% .. +18%
  }
  var today = new Date().toISOString().slice(0, 10);
  function priceToday(catId, part) {
    if (!part.price) return 0;
    return Math.max(1, Math.round(part.price * factor(today + ':' + catId + ':' + part.n)));
  }

  function load() { try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d && d.best) return d; } catch (e) {} return { best: {}, wins: 0 }; }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }

  var store = load();
  var challenge = CHALLENGES[0];
  var picks = {}; // catId -> indice elegido o null

  var body = document.getElementById('presu-body');
  if (!body) return;

  function money(n) { return '$' + n.toLocaleString('en-US'); }

  function renderChallenges() {
    var box = document.getElementById('presu-challenges');
    box.innerHTML = '';
    CHALLENGES.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tool-btn' + (c === challenge ? '' : ' tool-btn-ghost');
      b.textContent = c.name[lang] + ' · ' + money(c.budget);
      if (store.best[c.id] != null) b.textContent += ' ✓ ' + store.best[c.id];
      b.addEventListener('click', function () { challenge = c; picks = {}; renderAll(); });
      box.appendChild(b);
    });
    document.getElementById('presu-challenge-desc').textContent = challenge.desc[lang];
    document.getElementById('presu-market').textContent = T.market + ': ' + today;
  }

  function renderTable() {
    body.innerHTML = '';
    CATS.forEach(function (cat) {
      var tr = document.createElement('tr');
      var tdName = document.createElement('td'); tdName.textContent = cat.name[lang];
      var tdSel = document.createElement('td');
      var sel = document.createElement('select');
      sel.className = 'mejora-select'; sel.style.margin = '0';
      var o0 = document.createElement('option'); o0.value = ''; o0.textContent = '— ' + T.choose + ' —'; sel.appendChild(o0);
      cat.parts.forEach(function (p, i) {
        var o = document.createElement('option');
        o.value = String(i);
        o.textContent = p.n;
        sel.appendChild(o);
      });
      if (picks[cat.id] != null) sel.value = String(picks[cat.id]);
      sel.addEventListener('change', function () {
        picks[cat.id] = sel.value === '' ? null : parseInt(sel.value, 10);
        renderTable(); renderTotals();
      });
      tdSel.appendChild(sel);
      var tdPrice = document.createElement('td');
      var tdPerf = document.createElement('td');
      var pick = picks[cat.id] != null ? cat.parts[picks[cat.id]] : null;
      if (pick) {
        var todayPrice = priceToday(cat.id, pick);
        tdPrice.textContent = pick.price ? money(todayPrice) : money(0);
        if (pick.price) {
          var pct = Math.round((todayPrice / pick.price - 1) * 100);
          var span = document.createElement('span');
          span.className = pct > 0 ? ' presu-up' : ' presu-down';
          span.textContent = ' ' + (pct > 0 ? T.up : T.down) + ' ' + Math.abs(pct) + '%';
          tdPrice.appendChild(span);
        }
        tdPerf.textContent = String(pick.perf);
      } else { tdPrice.textContent = '—'; tdPerf.textContent = '—'; }
      tr.appendChild(tdName); tr.appendChild(tdSel); tr.appendChild(tdPrice); tr.appendChild(tdPerf);
      body.appendChild(tr);
    });
  }

  function totals() {
    var total = 0, perf = 0, watts = 0, cap = 0, complete = true;
    CATS.forEach(function (cat) {
      var pick = picks[cat.id] != null ? cat.parts[picks[cat.id]] : null;
      if (!pick) { complete = false; return; }
      total += priceToday(cat.id, pick);
      perf += pick.perf;
      watts += pick.w || 0;
      if (cat.id === 'psu') cap = pick.cap || 0;
    });
    watts += 60; // placa, ventiladores y periféricos base
    return { total: total, perf: perf, watts: watts, cap: cap, complete: complete, psuOk: cap >= watts };
  }

  function renderTotals() {
    var t = totals();
    document.getElementById('presu-total').textContent = money(t.total);
    document.getElementById('presu-perf').textContent = String(t.perf) + ' / ' + challenge.perf;
    document.getElementById('presu-psu').textContent = t.cap ? (t.watts + ' W / ' + t.cap + ' W ' + (t.psuOk ? T.psuOk : '✗')) : '—';
    var bar = document.getElementById('presu-budget-bar');
    var pct = Math.min(100, Math.round(t.total / challenge.budget * 100));
    bar.style.width = pct + '%';
    bar.className = t.total > challenge.budget ? 'bar-bad' : (pct > 85 ? 'bar-mid' : 'bar-ok');
  }

  function renderAll() { renderChallenges(); renderTable(); renderTotals(); document.getElementById('presu-result').textContent = store.best[challenge.id] != null ? T.doneBefore + store.best[challenge.id] + ')' : ''; }

  document.getElementById('presu-check').addEventListener('click', function () {
    var res = document.getElementById('presu-result');
    var t = totals();
    if (!t.complete) { res.textContent = T.choose + '.'; return; }
    if (!t.psuOk) { res.textContent = T.psuBad; return; }
    if (t.total > challenge.budget) { res.textContent = T.over + (t.total - challenge.budget) + '.'; return; }
    if (t.perf < challenge.perf) { res.textContent = T.lowPerf + challenge.perf + ' (' + t.perf + ').'; return; }
    var score = Math.round((t.perf / challenge.perf) * 55 + (1 - t.total / challenge.budget) * 45);
    if (V) score = V.safeScore(Math.min(100, score));
    if (store.best[challenge.id] == null || score > store.best[challenge.id]) {
      if (store.best[challenge.id] == null) store.wins = (store.wins || 0) + 1;
      store.best[challenge.id] = score;
      save(store);
    }
    res.textContent = T.win + score + '.';
    renderChallenges();
  });
  document.getElementById('presu-reset').addEventListener('click', function () { picks = {}; renderAll(); });

  renderAll();
})();
