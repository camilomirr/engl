// NVISION · Pantalla Azul: el detective (2026-11-10)
// Minijuego de diagnóstico: un equipo muestra una pantalla azul y el
// jugador usa herramientas del laboratorio (MemTest, chkdsk, modo seguro,
// monitor de temperatura…) para reunir evidencia y diagnosticar la causa:
// RAM, disco, driver corrupto o sobrecalentamiento. Los casos resueltos
// se guardan en nvision_bsod_v1 y alimentan los logros del sitio.
(function () {
  'use strict';
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var KEY = 'nvision_bsod_v1';
  var V = window.NVISION_validate;

  var T = {
    es: { solved: 'Resuelto', play: 'Investigar caso', again: 'Reintentar', logStart: 'Registro del técnico: usa una herramienta para empezar a reunir evidencia.', useFirst: 'Usa al menos una herramienta antes de diagnosticar.', correct: '¡Diagnóstico correcto!', wrong: 'Ese no es el origen de la falla. Revisa la evidencia del registro y vuelve a intentarlo.', score: 'Puntaje del caso', best: 'Mejor puntaje total', toolsUsed: 'herramientas usadas', caseWord: 'Caso', done: 'Ya resolviste este caso. Puedes reintentar para mejorar el puntaje.' },
    en: { solved: 'Solved', play: 'Investigate case', again: 'Try again', logStart: 'Technician log: use a tool to start gathering evidence.', useFirst: 'Use at least one tool before diagnosing.', correct: 'Correct diagnosis!', wrong: 'That is not the root cause. Check the evidence in the log and try again.', score: 'Case score', best: 'Best total score', toolsUsed: 'tools used', caseWord: 'Case', done: 'You already solved this case. You can retry to improve the score.' }
  }[lang];

  // tools: resultados por herramienta; cada caso define solo las suyas.
  var CASES = [
    {
      id: 'ram', code: 'MEMORY_MANAGEMENT',
      title: { es: 'Pantallas azules al azar', en: 'Random blue screens' },
      symptom: {
        es: 'El equipo se cae con pantalla azul varias veces al día, sobre todo cuando se abren muchos programas a la vez. Reinicia y vuelve a fallar sin patrón claro.',
        en: 'The PC crashes with a blue screen several times a day, mostly when many programs are open at once. It reboots and fails again with no clear pattern.'
      },
      tools: [
        { id: 'memtest', name: { es: 'MemTest (prueba de RAM)', en: 'MemTest (RAM test)' }, result: { es: 'MemTest: 3.214 errores en el módulo del banco 2. La memoria no retiene bien los datos.', en: 'MemTest: 3,214 errors on the bank 2 module. Memory is not holding data reliably.' } },
        { id: 'chkdsk', name: { es: 'chkdsk (revisar disco)', en: 'chkdsk (check disk)' }, result: { es: 'chkdsk: sistema de archivos limpio, sin sectores defectuosos.', en: 'chkdsk: file system clean, no bad sectors.' } },
        { id: 'safemode', name: { es: 'Modo seguro', en: 'Safe mode' }, result: { es: 'En modo seguro también se cae al abrir varios programas.', en: 'In safe mode it also crashes when opening several programs.' } },
        { id: 'devmgr', name: { es: 'Administrador de dispositivos', en: 'Device manager' }, result: { es: 'Administrador de dispositivos: ningún dispositivo con advertencias.', en: 'Device manager: no device warnings.' } }
      ],
      options: [
        { t: { es: 'RAM defectuosa', en: 'Faulty RAM' }, ok: true },
        { t: { es: 'Disco dañado', en: 'Damaged disk' }, ok: false },
        { t: { es: 'Driver corrupto', en: 'Corrupt driver' }, ok: false }
      ],
      why: { es: 'Los errores de MemTest y el código MEMORY_MANAGEMENT apuntan a la RAM: al llenarse la memoria con muchos programas, los datos se corrompen y Windows se protege con la pantalla azul.', en: 'MemTest errors and the MEMORY_MANAGEMENT code point to RAM: as memory fills with many programs, data corrupts and Windows protects itself with the blue screen.' }
    },
    {
      id: 'driver-prn', code: 'CRITICAL_PROCESS_DIED',
      title: { es: 'Falla justo tras instalar la impresora', en: 'Fails right after installing the printer' },
      symptom: {
        es: 'El equipo funcionaba perfecto hasta ayer, cuando se instaló una impresora nueva. Desde entonces, pantalla azul al iniciar sesión.',
        en: 'The PC worked perfectly until yesterday, when a new printer was installed. Since then, blue screen at sign-in.'
      },
      tools: [
        { id: 'safemode', name: { es: 'Modo seguro', en: 'Safe mode' }, result: { es: 'En modo seguro el equipo arranca y trabaja sin fallas durante horas.', en: 'In safe mode the PC boots and works for hours with no failures.' } },
        { id: 'devmgr', name: { es: 'Administrador de dispositivos', en: 'Device manager' }, result: { es: 'El controlador de la impresora quedó con firma dañada y fecha de ayer.', en: 'The printer driver has a broken signature and yesterday\'s date.' } },
        { id: 'memtest', name: { es: 'MemTest (prueba de RAM)', en: 'MemTest (RAM test)' }, result: { es: 'MemTest: 0 errores tras dos pasadas completas.', en: 'MemTest: 0 errors after two full passes.' } },
        { id: 'chkdsk', name: { es: 'chkdsk (revisar disco)', en: 'chkdsk (check disk)' }, result: { es: 'chkdsk: sin errores.', en: 'chkdsk: no errors.' } }
      ],
      options: [
        { t: { es: 'RAM defectuosa', en: 'Faulty RAM' }, ok: false },
        { t: { es: 'Driver corrupto (impresora)', en: 'Corrupt driver (printer)' }, ok: true },
        { t: { es: 'Disco dañado', en: 'Damaged disk' }, ok: false }
      ],
      why: { es: 'La falla empezó con un cambio de software, el modo seguro (que no carga ese driver) funciona y el controlador quedó con la firma dañada: es un driver corrupto, no hardware.', en: 'The failure started with a software change, safe mode (which skips that driver) works, and the driver signature is broken: it is a corrupt driver, not hardware.' }
    },
    {
      id: 'disco', code: 'INACCESSIBLE_BOOT_DEVICE',
      title: { es: 'No arranca y hace clics raros', en: 'Will not boot and makes clicking sounds' },
      symptom: {
        es: 'El equipo tarda minutos en hacer cualquier cosa, se escuchan clics repetidos desde la torre y hoy ya no pasó del logo de Windows.',
        en: 'The PC takes minutes to do anything, repeated clicks come from the case, and today it no longer gets past the Windows logo.'
      },
      tools: [
        { id: 'smart', name: { es: 'SMART (salud del disco)', en: 'SMART (disk health)' }, result: { es: 'SMART: estado «Riesgo». 1.842 sectores reasignados y subiendo cada día.', en: 'SMART: "Caution" status. 1,842 reallocated sectors and rising daily.' } },
        { id: 'chkdsk', name: { es: 'chkdsk (revisar disco)', en: 'chkdsk (check disk)' }, result: { es: 'chkdsk: encontró sectores defectuosos ilegibles en la zona de arranque.', en: 'chkdsk: found unreadable bad sectors in the boot area.' } },
        { id: 'memtest', name: { es: 'MemTest (prueba de RAM)', en: 'MemTest (RAM test)' }, result: { es: 'MemTest: 0 errores.', en: 'MemTest: 0 errors.' } },
        { id: 'temp', name: { es: 'Monitor de temperatura', en: 'Temperature monitor' }, result: { es: 'Temperaturas normales: CPU 47 °C, disco 39 °C.', en: 'Normal temperatures: CPU 47 °C, disk 39 °C.' } }
      ],
      options: [
        { t: { es: 'Disco dañado', en: 'Damaged disk' }, ok: true },
        { t: { es: 'RAM defectuosa', en: 'Faulty RAM' }, ok: false },
        { t: { es: 'Sobrecalentamiento', en: 'Overheating' }, ok: false }
      ],
      why: { es: 'Los clics, la lentitud extrema, el SMART en riesgo y los sectores defectuosos en la zona de arranque cuentan la misma historia: el disco está muriendo. Primero se rescata la información.', en: 'The clicks, extreme slowness, SMART caution and bad sectors in the boot area all tell the same story: the disk is dying. Back up the data first.' }
    },
    {
      id: 'driver-gpu', code: 'SYSTEM_THREAD_EXCEPTION_NOT_HANDLED',
      title: { es: 'Pantalla azul solo en juegos', en: 'Blue screen only in games' },
      symptom: {
        es: 'En el escritorio todo va bien, pero a los pocos minutos de abrir un juego aparece la pantalla azul. Pasó desde la última actualización de la tarjeta de video.',
        en: 'On the desktop everything is fine, but a few minutes into a game the blue screen appears. It started after the last graphics card update.'
      },
      tools: [
        { id: 'devmgr', name: { es: 'Administrador de dispositivos', en: 'Device manager' }, result: { es: 'El driver de video es de hace 2 días (actualización automática).', en: 'The video driver is 2 days old (automatic update).' } },
        { id: 'rollback', name: { es: 'Revertir el driver', en: 'Roll back the driver' }, result: { es: 'Con el driver anterior, el juego corre 1 hora sin una sola falla.', en: 'With the previous driver, the game runs for 1 hour with zero failures.' } },
        { id: 'temp', name: { es: 'Monitor de temperatura', en: 'Temperature monitor' }, result: { es: 'GPU a 71 °C jugando: dentro de lo normal.', en: 'GPU at 71 °C while gaming: within normal range.' } },
        { id: 'memtest', name: { es: 'MemTest (prueba de RAM)', en: 'MemTest (RAM test)' }, result: { es: 'MemTest: 0 errores.', en: 'MemTest: 0 errors.' } }
      ],
      options: [
        { t: { es: 'Sobrecalentamiento', en: 'Overheating' }, ok: false },
        { t: { es: 'Driver de video defectuoso', en: 'Faulty video driver' }, ok: true },
        { t: { es: 'Disco dañado', en: 'Damaged disk' }, ok: false }
      ],
      why: { es: 'La falla sigue a la actualización y desaparece al revertir el driver, con temperaturas normales: el culpable es el driver de video nuevo, no el hardware.', en: 'The failure follows the update and disappears when rolling back the driver, with normal temperatures: the new video driver is the culprit, not the hardware.' }
    },
    {
      id: 'calor', code: 'WHEA_UNCORRECTABLE_ERROR',
      title: { es: 'Se apaga en lo mejor del juego', en: 'Shuts down mid-game' },
      symptom: {
        es: 'Tras 20 minutos de juego exigente, el equipo se congela con pantalla azul o se apaga de golpe. En tareas livianas nunca falla. La torre está en un mueble cerrado.',
        en: 'After 20 minutes of heavy gaming, the PC freezes with a blue screen or shuts off at once. On light tasks it never fails. The case sits inside a closed cabinet.'
      },
      tools: [
        { id: 'temp', name: { es: 'Monitor de temperatura', en: 'Temperature monitor' }, result: { es: 'CPU sube a 99 °C y ahí se congela. El ventilador gira pero el disipador está tapado de polvo.', en: 'CPU climbs to 99 °C and freezes there. The fan spins but the heatsink is clogged with dust.' } },
        { id: 'memtest', name: { es: 'MemTest (prueba de RAM)', en: 'MemTest (RAM test)' }, result: { es: 'MemTest en prueba corta: 0 errores (y temperaturas bajas en reposo).', en: 'MemTest short run: 0 errors (and low idle temperatures).' } },
        { id: 'smart', name: { es: 'SMART (salud del disco)', en: 'SMART (disk health)' }, result: { es: 'SMART: disco en buen estado.', en: 'SMART: disk in good health.' } },
        { id: 'devmgr', name: { es: 'Administrador de dispositivos', en: 'Device manager' }, result: { es: 'Sin advertencias ni drivers recientes.', en: 'No warnings or recent drivers.' } }
      ],
      options: [
        { t: { es: 'RAM defectuosa', en: 'Faulty RAM' }, ok: false },
        { t: { es: 'Sobrecalentamiento de la CPU', en: 'CPU overheating' }, ok: true },
        { t: { es: 'Driver corrupto', en: 'Corrupt driver' }, ok: false }
      ],
      why: { es: 'El código WHEA habla de hardware bajo estrés y el monitor lo confirma: 99 °C con el disipador tapado de polvo y el mueble cerrado. Limpieza, pasta térmica y ventilación lo resuelven.', en: 'The WHEA code means hardware under stress and the monitor confirms it: 99 °C with a dust-clogged heatsink and a closed cabinet. Cleaning, thermal paste and airflow fix it.' }
    },
    {
      id: 'ntfs', code: 'NTFS_FILE_SYSTEM',
      title: { es: 'Archivos corruptos tras un apagón', en: 'Corrupt files after a blackout' },
      symptom: {
        es: 'Hubo un corte de luz con el equipo encendido. Desde ahí, varios documentos no abren y Windows muestra la pantalla azul NTFS_FILE_SYSTEM al copiar archivos.',
        en: 'There was a power outage with the PC on. Since then, several documents will not open and Windows shows the NTFS_FILE_SYSTEM blue screen when copying files.'
      },
      tools: [
        { id: 'chkdsk', name: { es: 'chkdsk (revisar disco)', en: 'chkdsk (check disk)' }, result: { es: 'chkdsk: errores en la tabla NTFS y 14 archivos con registros dañados. La superficie física está sana.', en: 'chkdsk: errors in the NTFS table and 14 files with damaged records. The physical surface is healthy.' } },
        { id: 'smart', name: { es: 'SMART (salud del disco)', en: 'SMART (disk health)' }, result: { es: 'SMART: sin sectores reasignados; salud física buena.', en: 'SMART: no reallocated sectors; physical health good.' } },
        { id: 'memtest', name: { es: 'MemTest (prueba de RAM)', en: 'MemTest (RAM test)' }, result: { es: 'MemTest: 0 errores.', en: 'MemTest: 0 errors.' } },
        { id: 'safemode', name: { es: 'Modo seguro', en: 'Safe mode' }, result: { es: 'En modo seguro también fallan los mismos archivos: el daño está en los datos, no en un driver.', en: 'In safe mode the same files also fail: the damage is in the data, not a driver.' } }
      ],
      options: [
        { t: { es: 'Sistema de archivos dañado (el disco está sano)', en: 'Damaged file system (disk itself is healthy)' }, ok: true },
        { t: { es: 'Disco físicamente dañado', en: 'Physically damaged disk' }, ok: false },
        { t: { es: 'RAM defectuosa', en: 'Faulty RAM' }, ok: false }
      ],
      why: { es: 'El apagón cortó escrituras a mitad de camino y corrompió la estructura NTFS. El SMART sano descarta daño físico: se repara el sistema de archivos con chkdsk /f y se restauran los archivos desde copia.', en: 'The outage cut writes midway and corrupted the NTFS structure. Healthy SMART rules out physical damage: repair the file system with chkdsk /f and restore files from backup.' }
    }
  ];

  function load() { try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d && d.solved) return d; } catch (e) {} return { solved: {} }; }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }

  var store = load();
  var current = null, used = {}, wrongs = 0;

  var casesEl = document.getElementById('bsod-cases');
  var gameEl = document.getElementById('bsod-game');
  if (!casesEl || !gameEl) return;

  function solvedCount() { return Object.keys(store.solved).length; }
  function totalBest() { return Object.keys(store.solved).reduce(function (a, k) { return a + (store.solved[k] || 0); }, 0); }

  function renderCases() {
    document.getElementById('bsod-progress').textContent = solvedCount() + '/' + CASES.length;
    var best = document.getElementById('bsod-best');
    best.textContent = totalBest() ? T.best + ': ' + totalBest() : '';
    casesEl.innerHTML = '';
    CASES.forEach(function (c, i) {
      var card = document.createElement('div');
      card.className = 'mejora-card';
      var done = store.solved[c.id] != null;
      var h = document.createElement('h3');
      h.textContent = T.caseWord + ' ' + (i + 1) + ': ' + c.title[lang];
      var code = document.createElement('p');
      var chip = document.createElement('span');
      chip.className = 'mejora-chip'; chip.textContent = c.code;
      code.appendChild(chip);
      if (done) { var s = document.createElement('span'); s.className = 'mejora-chip'; s.textContent = ' ✓ ' + T.solved + ' · ' + store.solved[c.id]; code.appendChild(document.createTextNode(' ')); code.appendChild(s); }
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tool-btn bsod-case-btn'; b.textContent = done ? T.again : T.play;
      b.addEventListener('click', function () { openCase(c); });
      card.appendChild(h); card.appendChild(code); card.appendChild(b);
      casesEl.appendChild(card);
    });
  }

  function openCase(c) {
    current = c; used = {}; wrongs = 0;
    gameEl.hidden = false;
    var scr = document.getElementById('bsod-screen');
    scr.innerHTML = '';
    var face = document.createElement('p'); face.className = 'bsod-face'; face.textContent = ':(';
    var txt = document.createElement('p'); txt.textContent = c.symptom[lang];
    var code = document.createElement('p'); code.innerHTML = 'Stop code: <span class="bsod-code"></span>';
    code.querySelector('.bsod-code').textContent = c.code;
    scr.appendChild(face); scr.appendChild(txt); scr.appendChild(code);
    var tools = document.getElementById('bsod-tools');
    tools.innerHTML = '';
    c.tools.forEach(function (tool) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tool-btn tool-btn-ghost bsod-tool'; b.textContent = tool.name[lang];
      b.addEventListener('click', function () {
        if (used[tool.id]) return;
        used[tool.id] = true; b.disabled = true;
        logLine('▸ ' + tool.name[lang] + ' → ' + tool.result[lang]);
      });
      tools.appendChild(b);
    });
    var opts = document.getElementById('bsod-options');
    opts.innerHTML = '';
    c.options.forEach(function (op) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tool-btn'; b.textContent = op.t[lang];
      b.addEventListener('click', function () { diagnose(op, b); });
      opts.appendChild(b);
    });
    document.getElementById('bsod-log').textContent = T.logStart;
    document.getElementById('bsod-result').textContent = '';
    gameEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function logLine(s) {
    var log = document.getElementById('bsod-log');
    if (log.textContent === T.logStart) log.textContent = '';
    log.textContent += (log.textContent ? '\n' : '') + s;
  }

  function diagnose(op, btn) {
    var res = document.getElementById('bsod-result');
    var nUsed = Object.keys(used).length;
    if (!nUsed) { res.textContent = T.useFirst; return; }
    if (!op.ok) {
      wrongs++;
      res.textContent = T.wrong;
      btn.disabled = true;
      return;
    }
    var score = Math.max(30, 100 - 12 * (nUsed - 1) - 25 * wrongs);
    if (V) score = V.safeScore(score);
    if (store.solved[current.id] == null || score > store.solved[current.id]) store.solved[current.id] = score;
    save(store);
    res.textContent = '✓ ' + T.correct + ' ' + current.why[lang] + ' ' + T.score + ': ' + score + ' (' + nUsed + ' ' + T.toolsUsed + ').';
    Array.prototype.forEach.call(document.querySelectorAll('#bsod-options .tool-btn'), function (b) { b.disabled = true; });
    renderCases();
  }

  document.getElementById('bsod-back').addEventListener('click', function () { gameEl.hidden = true; });
  renderCases();
})();
