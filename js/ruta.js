// NVISION - Ruta de aprendizaje: pasos guiados con progreso en localStorage.
// Clave: nvision_ruta_v1 { done: { pasoId: true }, updatedAt: ISO }
(function () {
  'use strict';

  var KEY = 'nvision_ruta_v1';
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';

  var T = {
    es: { step: 'Paso', go: 'Ir a la actividad', done: '✓ Completado', mark: 'Marcar completado', auto: 'AUTO', autoPending: 'Se marca solo al completarlo', of: 'de', nextLabel: 'Tu siguiente paso', resetQ: '¿Reiniciar toda la ruta? Se borran las marcas de este equipo.' },
    en: { step: 'Step', go: 'Go to the activity', done: '✓ Completed', mark: 'Mark as done', auto: 'AUTO', autoPending: 'It checks itself when you complete it', of: 'of', nextLabel: 'Your next step', resetQ: 'Reset the whole path? The checkmarks on this device will be cleared.' }
  }[lang];

  var STEPS = [
    { id: 'hardware', icon: '🖥️', href: 'hardware.html#componentes',
      t: { es: 'Hardware desde cero', en: 'Hardware from scratch' },
      d: { es: 'Conoce las piezas de un computador y para qué sirve cada una: CPU, RAM, placa, fuente y más.', en: 'Meet the parts of a computer and what each one does: CPU, RAM, board, PSU and more.' } },
    { id: 'visor3d', icon: '🧊', href: 'pc3d.html#visor-3d',
      t: { es: 'Explora el visor 3D', en: 'Explore the 3D viewer' },
      d: { es: 'Gira una torre real, desármala por capas y toca cada componente para ver su ficha.', en: 'Spin a real tower, take it apart layer by layer and tap each part to see its card.' } },
    { id: 'workshop', icon: '🔧', href: 'workshop/index.html', auto: 'workshop',
      t: { es: 'Arma tu primer PC en el Workshop', en: 'Build your first PC in the Workshop' },
      d: { es: 'Entra al taller 3D, monta un equipo completo y logra que encienda y pase el POST.', en: 'Enter the 3D workshop, assemble a full build and get it to power on and pass POST.' } },
    { id: 'redes', icon: '🌐', href: 'redes.html#alcance-redes',
      t: { es: 'Clasificación de redes', en: 'Network classification' },
      d: { es: 'LAN, MAN, WAN y las demás: qué tan lejos llega cada tipo de red y dónde se usa.', en: 'LAN, MAN, WAN and the rest: how far each network type reaches and where it is used.' } },
    { id: 'topologias', icon: '🕸️', href: 'redes.html#topologias',
      t: { es: 'Topologías de red', en: 'Network topologies' },
      d: { es: 'Estrella, bus, anillo, malla y árbol: cómo se conectan los equipos y qué pasa si algo falla.', en: 'Star, bus, ring, mesh and tree: how devices connect and what happens when something fails.' } },
    { id: 'ping', icon: '📡', href: 'redes.html#simulador-red',
      t: { es: 'Simulador de ping', en: 'Ping simulator' },
      d: { es: 'Envía paquetes entre equipos y mira cómo viajan los datos por la red paso a paso.', en: 'Send packets between devices and watch data travel across the network step by step.' } },
    { id: 'herramientas', icon: '🧮', href: 'redes.html#herramientas',
      t: { es: 'Herramientas de redes', en: 'Network tools' },
      d: { es: 'Calcula una subred con su máscara y broadcast, y convierte números entre binario, decimal y hexadecimal.', en: 'Calculate a subnet with its mask and broadcast, and convert numbers between binary, decimal and hex.' } },
    { id: 'wifi', icon: '📶', href: 'wifi.html',
      t: { es: 'WiFi avanzado', en: 'Advanced WiFi' },
      d: { es: 'Bandas de 2.4 y 5 GHz, estándares, canales y seguridad: domina tu red inalámbrica.', en: '2.4 and 5 GHz bands, standards, channels and security: master your wireless network.' } },
    { id: 'challenge', icon: '🏆', href: 'redes_challenge/index.html',
      t: { es: 'Reto: Redes Challenge', en: 'Challenge: Redes Challenge' },
      d: { es: 'Pon a prueba lo aprendido de redes contra el reloj y entra al ranking del sitio.', en: 'Test what you learned about networks against the clock and join the site ranking.' } },
    { id: 'mantenimiento', icon: '🛠️', href: 'mantenimiento-software.html',
      t: { es: 'Mantenimiento por software', en: 'Software maintenance' },
      d: { es: 'Limpia, optimiza y protege un PC con las herramientas propias de Windows, sin instalar nada raro.', en: 'Clean, optimize and protect a PC with Windows built-in tools, installing nothing shady.' } },
    { id: 'examen', icon: '🎓', href: 'examenes.html', auto: 'exam',
      t: { es: 'Aprueba un examen y gana tu certificado', en: 'Pass an exam and earn your certificate' },
      d: { es: 'Elige un área, responde el examen y, si llegas al 70%, descarga tu certificado con tu nombre.', en: 'Pick an area, take the exam and, if you reach 70%, download your certificate with your name.' } }
  ];

  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) { var p = JSON.parse(raw); if (p && p.done) return p; } } catch (e) {}
    return { done: {}, updatedAt: null };
  }
  function save(state) {
    state.updatedAt = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function autoDone(kind) {
    try {
      if (kind === 'workshop') return !!localStorage.getItem('nvision_workshop_v2');
      if (kind === 'exam') {
        var raw = localStorage.getItem('nvision_examenes_v1');
        if (!raw) return false;
        var ex = JSON.parse(raw);
        return !!(ex && ex.results && Object.keys(ex.results).some(function (k) { return ex.results[k] && ex.results[k].passed; }));
      }
    } catch (e) {}
    return false;
  }

  var state = load();
  var wrap = document.getElementById('ruta-steps');

  function isDone(step) {
    if (step.auto) return autoDone(step.auto);
    return !!state.done[step.id];
  }

  function render() {
    wrap.innerHTML = '';
    var doneCount = 0;
    STEPS.forEach(function (step, i) {
      var done = isDone(step);
      if (done) doneCount++;
      var el = document.createElement('article');
      el.className = 'ruta-step' + (done ? ' is-done' : '');
      var badge = step.auto ? '<span class="ruta-badge">' + T.auto + '</span>' : '';
      var checkBtn;
      if (step.auto) {
        checkBtn = '<button type="button" class="ruta-btn ruta-btn--check" disabled>' + (done ? T.done : T.autoPending) + '</button>';
      } else {
        checkBtn = '<button type="button" class="ruta-btn ruta-btn--check" data-step="' + step.id + '">' + (done ? T.done : T.mark) + '</button>';
      }
      el.innerHTML =
        '<div class="ruta-step-num">' + (done ? '✓' : (i + 1)) + '</div>' +
        '<div class="ruta-step-body">' +
          '<h3>' + step.icon + ' ' + step.t[lang] + badge + '</h3>' +
          '<p>' + step.d[lang] + '</p>' +
          '<div class="ruta-step-actions">' +
            '<a class="ruta-btn" href="' + step.href + '">' + T.go + '</a>' + checkBtn +
          '</div>' +
        '</div>';
      wrap.appendChild(el);
    });
    wrap.querySelectorAll('[data-step]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-step');
        if (state.done[id]) delete state.done[id]; else state.done[id] = true;
        save(state);
        render();
      });
    });
    var pct = Math.round((doneCount / STEPS.length) * 100);
    document.getElementById('ruta-count').textContent = doneCount + ' ' + T.of + ' ' + STEPS.length + ' · ' + pct + '%';
    document.getElementById('ruta-fill').style.width = pct + '%';
    document.getElementById('ruta-done-msg').classList.toggle('on', doneCount === STEPS.length);
    var nextBox = document.getElementById('ruta-next');
    if (nextBox) {
      var nextStep = null;
      for (var ni = 0; ni < STEPS.length; ni++) { if (!isDone(STEPS[ni])) { nextStep = STEPS[ni]; break; } }
      if (nextStep) {
        nextBox.hidden = false;
        nextBox.innerHTML = '<span class="ruta-next-label">' + T.nextLabel + ':</span> <b></b> <a class="ruta-btn" href="' + nextStep.href + '">' + T.go + '</a>';
        nextBox.querySelector('b').textContent = nextStep.t[lang];
      } else nextBox.hidden = true;
    }
  }

  document.getElementById('ruta-reset').addEventListener('click', function () {
    if (window.confirm(T.resetQ)) { state = { done: {}, updatedAt: null }; save(state); render(); }
  });

  render();
})();
