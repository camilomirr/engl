// NVISION - Juego de cableado: ordena los 8 hilos según T568A/T568B.
// Toca un hilo de la bandeja para ponerlo en el siguiente pin libre;
// toca un pin ocupado para devolver el hilo a la bandeja.
(function () {
  var tray = document.getElementById('cb-tray');
  if (!tray) return;
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var T = {
    es: { pin: 'Pin', tries: 'Intentos:', ok: '¡Cable correcto! Así se arma un cable directo con la norma ', wrong: 'Todavía no: revisa los pares. Pines correctos: ', of: ' de 8.', empty: 'Coloca los 8 hilos antes de comprobar.' },
    en: { pin: 'Pin', tries: 'Attempts:', ok: 'Correct cable! That is how a straight-through cable is made with the ', wrong: 'Not yet: check the pairs. Correct pins: ', of: ' of 8.', empty: 'Place all 8 wires before checking.' }
  }[lang];

  // Pares: naranja, verde, azul, marrón (sólido y blanco-raya)
  var WIRES = [
    { id: 'bo', es: 'Blanco-naranja', en: 'White-orange', c1: '#ffffff', c2: '#f97316' },
    { id: 'o', es: 'Naranja', en: 'Orange', c1: '#f97316', c2: '#f97316' },
    { id: 'bv', es: 'Blanco-verde', en: 'White-green', c1: '#ffffff', c2: '#22c55e' },
    { id: 'a', es: 'Azul', en: 'Blue', c1: '#3b82f6', c2: '#3b82f6' },
    { id: 'ba', es: 'Blanco-azul', en: 'White-blue', c1: '#ffffff', c2: '#3b82f6' },
    { id: 'v', es: 'Verde', en: 'Green', c1: '#22c55e', c2: '#22c55e' },
    { id: 'bm', es: 'Blanco-marrón', en: 'White-brown', c1: '#ffffff', c2: '#a16207' },
    { id: 'm', es: 'Marrón', en: 'Brown', c1: '#a16207', c2: '#a16207' }
  ];
  var ORDER = {
    B: ['bo', 'o', 'bv', 'a', 'ba', 'v', 'bm', 'm'],
    A: ['bv', 'v', 'bo', 'a', 'ba', 'o', 'bm', 'm']
  };
  var byId = {}; WIRES.forEach(function (w) { byId[w.id] = w; });

  var slotsEl = document.getElementById('cb-slots');
  var msg = document.getElementById('cb-msg');
  var triesEl = document.getElementById('cb-tries');
  var slots = [null, null, null, null, null, null, null, null];
  var tries = 0;

  function wireChip(w) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'cable-wire';
    b.dataset.wid = w.id;
    var stripe = (w.c1 === w.c2)
      ? 'background:' + w.c1
      : 'background:repeating-linear-gradient(45deg,' + w.c1 + ' 0 6px,' + w.c2 + ' 6px 12px)';
    b.innerHTML = '<span class="cable-wire-color"></span><span></span>';
    // El color es dinámico: se aplica por CSSOM (la CSP bloquea el
    // atributo style dentro del HTML inyectado, no esta vía).
    b.querySelector('.cable-wire-color').style.cssText = stripe;
    b.querySelector('span:last-child').textContent = w[lang];
    return b;
  }

  function shuffle(a) { var x = a.slice(); for (var i = x.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = x[i]; x[i] = x[j]; x[j] = t; } return x; }

  // Render dividido para no re-mezclar la bandeja en cada toque.
  var trayOrder = [];
  function renderSlotsOnly() {
    slotsEl.innerHTML = '';
    slots.forEach(function (wid, i) {
      var s = document.createElement('button');
      s.type = 'button';
      s.className = 'cable-slot' + (wid ? ' filled' : '');
      var label = document.createElement('small');
      label.textContent = T.pin + ' ' + (i + 1);
      s.appendChild(label);
      if (wid) {
        var chip = wireChip(byId[wid]);
        chip.disabled = true;
        s.appendChild(chip);
        s.addEventListener('click', function () { slots[i] = null; trayOrder.push(wid); renderSlotsOnly(); renderTrayOnly(); });
      }
      slotsEl.appendChild(s);
    });
    triesEl.textContent = T.tries + ' ' + tries;
  }
  function renderTrayOnly() {
    tray.innerHTML = '';
    trayOrder.filter(function (id) { return slots.indexOf(id) === -1; }).forEach(function (id) {
      var chip = wireChip(byId[id]);
      chip.addEventListener('click', function () {
        var free = slots.indexOf(null);
        if (free === -1) return;
        slots[free] = id;
        renderSlotsOnly(); renderTrayOnly();
      });
      tray.appendChild(chip);
    });
  }
  function reset() {
    slots = [null, null, null, null, null, null, null, null];
    trayOrder = shuffle(WIRES.map(function (w) { return w.id; }));
    msg.textContent = '';
    renderSlotsOnly(); renderTrayOnly();
  }

  document.getElementById('cb-reset').addEventListener('click', reset);
  document.getElementById('cb-norm').addEventListener('change', function () { msg.textContent = ''; });
  document.getElementById('cb-check').addEventListener('click', function () {
    if (slots.indexOf(null) !== -1) { msg.textContent = T.empty; return; }
    tries++;
    var norm = document.getElementById('cb-norm').value;
    var want = ORDER[norm];
    var good = 0;
    slotsEl.querySelectorAll('.cable-slot').forEach(function (s, i) {
      s.classList.toggle('is-good', slots[i] === want[i]);
      s.classList.toggle('is-bad', slots[i] !== want[i]);
      if (slots[i] === want[i]) good++;
    });
    triesEl.textContent = T.tries + ' ' + tries;
    msg.textContent = good === 8 ? T.ok + 'T568' + norm + '.' : T.wrong + good + T.of;
  });

  reset();
})();
