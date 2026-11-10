// NVISION - Inglés técnico: vocabulario con pronunciación escrita,
// audio (speechSynthesis), tarjetas y mini-quiz.
(function () {
  var listBox = document.getElementById('eng-list');
  if (!listBox) return;
  var siteLang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';

  // en, es, pronunciación aproximada para hispanohablantes, ejemplo
  var TERMS = [
    ['hardware', 'el hardware (componentes físicos)', 'JÁRD-uer', 'The hardware is inside the case.'],
    ['software', 'el software (programas)', 'SÓFT-uer', 'Install the software first.'],
    ['keyboard', 'el teclado', 'KÍ-bord', 'The keyboard has 104 keys.'],
    ['mouse', 'el ratón', 'MÁUS', 'Click with the mouse.'],
    ['screen', 'la pantalla', 'SCRÍIN', 'The screen is 24 inches.'],
    ['motherboard', 'la placa base', 'MÁ-der-bord', 'The motherboard connects everything.'],
    ['memory', 'la memoria', 'MÉ-mo-ri', 'This PC has 16 GB of memory.'],
    ['storage', 'el almacenamiento', 'STÓ-rich', 'Storage keeps your files.'],
    ['network', 'la red', 'NÉT-uork', 'The network is down today.'],
    ['router', 'el enrutador', 'RÁU-ter', 'Restart the router.'],
    ['switch', 'el conmutador (de red)', 'SUÍCH', 'The switch has 24 ports.'],
    ['wireless', 'inalámbrico', 'UÁIER-les', 'A wireless network uses radio waves.'],
    ['bandwidth', 'el ancho de banda', 'BÁND-uiz', 'More bandwidth, faster downloads.'],
    ['download', 'descargar', 'DÁUN-loud', 'Download the file.'],
    ['upload', 'subir (a internet)', 'AP-loud', 'Upload your homework.'],
    ['password', 'la contraseña', 'PÁS-uord', 'Never share your password.'],
    ['backup', 'la copia de seguridad', 'BÁK-ap', 'Make a backup every week.'],
    ['update', 'actualizar / la actualización', 'AP-déit', 'Update the system tonight.'],
    ['settings', 'los ajustes / la configuración', 'SÉ-tings', 'Open the settings menu.'],
    ['folder', 'la carpeta', 'FÓUL-der', 'Save it in this folder.'],
    ['file', 'el archivo', 'FÁIL', 'The file is too big.'],
    ['browser', 'el navegador', 'BRÁU-ser', 'Open the browser.'],
    ['search', 'buscar', 'SÉRCH', 'Search for the error message.'],
    ['keyboard shortcut', 'el atajo de teclado', 'KÍ-bord SHÓRT-kat', 'Ctrl+C is a keyboard shortcut.'],
    ['troubleshoot', 'diagnosticar y reparar', 'TRÁ-bol-shut', 'We troubleshoot the network.'],
    ['plug in', 'conectar / enchufar', 'PLAG-in', 'Plug in the cable.'],
    ['turn on', 'encender', 'TÉRN-on', 'Turn on the computer.'],
    ['shut down', 'apagar (el equipo)', 'SHAT-dáun', 'Shut down the PC before opening it.'],
    ['wire', 'el cable / hilo', 'UÁIER', 'The blue wire goes on pin 4.'],
    ['speed', 'la velocidad', 'SPÍID', 'Test your internet speed.']
  ];

  function speak(text) {
    try {
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; u.rate = 0.92;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  // Lista
  TERMS.forEach(function (t) {
    var row = document.createElement('div');
    row.className = 'eng-row';
    var main = document.createElement('div');
    var en = document.createElement('strong'); en.textContent = t[0];
    var pron = document.createElement('span'); pron.className = 'eng-pron'; pron.textContent = '/' + t[2] + '/';
    var es = document.createElement('span'); es.className = 'eng-es'; es.textContent = t[1];
    var ex = document.createElement('small'); ex.className = 'eng-ex'; ex.textContent = t[3];
    main.append(en, pron, es, ex);
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'eng-say'; btn.textContent = '🔊';
    btn.setAttribute('aria-label', 'Listen: ' + t[0]);
    btn.addEventListener('click', function () { speak(t[0] + '. ' + t[3]); });
    row.append(main, btn);
    listBox.appendChild(row);
  });

  // Tarjetas
  var idx = 0, flipped = false;
  // Repetición espaciada (js/srs.js): la ronda de tarjetas empieza por
  // las vencidas o nuevas; «La sabía / Repasar» mueven la caja Leitner.
  var srsSeq = TERMS.map(function (t) { return t[0]; });
  if (window.NVISION_srs) srsSeq = window.NVISION_srs.order('ingles', srsSeq);
  srsSeq = srsSeq.map(function (nm) { return TERMS.findIndex(function (t) { return t[0] === nm; }); }).filter(function (i) { return i >= 0; });
  if (!srsSeq.length) srsSeq = TERMS.map(function (_, i) { return i; });
  var seqPos = 0; idx = srsSeq[0];
  var flash = document.getElementById('eng-flash');
  var count = document.getElementById('eng-count');
  function paintCard() {
    var t = TERMS[idx];
    flash.innerHTML = '';
    var w = document.createElement('span'); w.className = 'eng-flash-word'; w.textContent = flipped ? t[1] : t[0];
    var s = document.createElement('small'); s.textContent = flipped ? t[3] : '/' + t[2] + '/';
    flash.append(w, s);
    count.textContent = (seqPos + 1) + ' / ' + TERMS.length;
  }
  flash.addEventListener('click', function () { flipped = !flipped; paintCard(); });
  document.getElementById('eng-prev').addEventListener('click', function () { seqPos = (seqPos + srsSeq.length - 1) % srsSeq.length; idx = srsSeq[seqPos]; flipped = false; paintCard(); });
  document.getElementById('eng-next').addEventListener('click', function () { seqPos = (seqPos + 1) % srsSeq.length; idx = srsSeq[seqPos]; flipped = false; paintCard(); });
  document.getElementById('eng-say').addEventListener('click', function () { speak(TERMS[idx][0] + '. ' + TERMS[idx][3]); });
  paintCard();
  function paintDue() {
    var d = document.getElementById('eng-due');
    if (!d || !window.NVISION_srs) return;
    var n = window.NVISION_srs.dueCount('ingles', TERMS.map(function (t) { return t[0]; }));
    d.textContent = n > 0
      ? (siteLang === 'en' ? 'Smart review: ' + n + ' cards due today' : 'Repaso inteligente: hoy te tocan ' + n + ' tarjetas')
      : (siteLang === 'en' ? 'Smart review: all caught up' : 'Repaso inteligente: todo al día');
  }
  function srsGo(known) {
    if (window.NVISION_srs) window.NVISION_srs.mark('ingles', TERMS[idx][0], known);
    seqPos = (seqPos + 1) % srsSeq.length; idx = srsSeq[seqPos]; flipped = false; paintCard(); paintDue();
  }
  var bk = document.getElementById('eng-knew'); if (bk) bk.addEventListener('click', function () { srsGo(true); });
  var brv = document.getElementById('eng-review'); if (brv) brv.addEventListener('click', function () { srsGo(false); });
  paintDue();

  // Mini-quiz: 8 preguntas, opción múltiple con el significado
  var quizBox = document.getElementById('eng-quiz');
  function shuffle(a) { var x = a.slice(); for (var i = x.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = x[i]; x[i] = x[j]; x[j] = t; } return x; }
  function runQuiz() {
    quizBox.innerHTML = '';
    var qs = shuffle(TERMS).slice(0, 8);
    var score = 0, answered = 0;
    qs.forEach(function (t) {
      var card = document.createElement('div');
      card.className = 'eng-q';
      var h = document.createElement('h4');
      h.textContent = (siteLang === 'en' ? 'What does "' : '¿Qué significa "') + t[0] + '"?';
      card.appendChild(h);
      var opts = shuffle([t[1]].concat(shuffle(TERMS.filter(function (x) { return x !== t; })).slice(0, 3).map(function (x) { return x[1]; })));
      opts.forEach(function (op) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'pd-opt'; b.textContent = op;
        b.addEventListener('click', function () {
          if (b.parentElement.dataset.done) return;
          b.parentElement.dataset.done = '1';
          answered++;
          var good = op === t[1];
          if (good) score++;
          if (window.NVISION_srs) window.NVISION_srs.mark('ingles', t[0], good);
          card.querySelectorAll('.pd-opt').forEach(function (x) {
            x.disabled = true;
            if (x.textContent === t[1]) x.classList.add('is-correct');
            else if (x === b) x.classList.add('is-wrong');
          });
          if (answered === qs.length) {
            var end = document.createElement('p');
            end.className = 'pd-msg';
            end.textContent = (siteLang === 'en' ? 'Score: ' : 'Nota: ') + score + '/' + qs.length;
            var again = document.createElement('button');
            again.type = 'button'; again.className = 'tool-btn'; again.textContent = siteLang === 'en' ? 'Play again' : 'Otra ronda';
            again.addEventListener('click', runQuiz);
            end.appendChild(document.createTextNode(' '));
            end.appendChild(again);
            quizBox.appendChild(end);
          }
        });
        card.appendChild(b);
      });
      quizBox.appendChild(card);
    });
  }
  runQuiz();

  // Modos
  document.querySelectorAll('.eng-mode').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.eng-mode').forEach(function (x) { x.classList.toggle('is-on', x === b); });
      var m = b.dataset.mode;
      document.getElementById('eng-list').hidden = m !== 'list';
      document.getElementById('eng-cards').hidden = m !== 'cards';
      document.getElementById('eng-quiz').hidden = m !== 'quiz';
    });
  });
})();
