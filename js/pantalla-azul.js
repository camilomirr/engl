// NVISION · Pantalla Azul: el detective (2026-11-10, estructura v2)
// Minijuego de diagnóstico en 4 fases, como trabaja un técnico:
//   1 · Síntomas      la pantalla azul y la ficha del equipo.
//   2 · Investigación herramientas del laboratorio agrupadas por tipo;
//                     cada una deja evidencia en el registro. Hacen
//                     falta 2+ evidencias para poder diagnosticar.
//   3 · Diagnóstico   elegir la causa raíz (RAM, disco, driver, calor…).
//                     Si fallas, puedes volver a investigar.
//   4 · Resolución    la explicación, los pasos de la reparación y el
//                     desglose del puntaje.
// Los casos resueltos se guardan en nvision_bsod_v1 (mejor puntaje por
// caso) y alimentan los logros del sitio.
// Reinicio pedido el 2026-11-10: eliminar el valor actual del minijuego y
// reiniciar SOLO su puntaje. Se aplica una sola vez por navegador (marca
// nvision_bsod_reset) y también hay un botón «Reiniciar puntaje» en la
// página para repetirlo cuando se quiera. Nada más se toca.
(function () {
  'use strict';
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var KEY = 'nvision_bsod_v1';
  var RESET_KEY = 'nvision_bsod_reset', RESET_TOKEN = '2026-11-10-v1';
  try {
    if (localStorage.getItem(RESET_KEY) !== RESET_TOKEN) {
      localStorage.removeItem(KEY);
      localStorage.setItem(RESET_KEY, RESET_TOKEN);
    }
  } catch (e) {}
  var V = window.NVISION_validate;

  var T = {
    es: { solved: 'Resuelto', play: 'Investigar caso', again: 'Reintentar', caseWord: 'Caso', best: 'Mejor puntaje total',
      pc: 'Equipo', use: 'Uso del dueño', change: 'Cambio reciente',
      catMemoria: 'Memoria', catDisco: 'Disco y archivos', catSoftware: 'Software y drivers', catFisico: 'Inspección física',
      logStart: 'Registro del técnico: usa una herramienta para reunir evidencia.',
      evidence: 'evidencia reunida', need2: 'Reúne al menos 2 piezas de evidencia para diagnosticar.',
      diagIntro: 'Con la evidencia del registro, ¿cuál es la causa raíz de la falla?',
      wrong: 'Esa no es la causa raíz. Puedes marcar otra o volver a investigar (-25 pts).',
      correct: '¡Diagnóstico correcto!',
      fixTitle: 'La reparación, paso a paso',
      breakdown: 'Desglose del puntaje', bBase: 'Puntaje base', bTools: 'Herramientas extra', bWrong: 'Diagnósticos errados', bTotal: 'Total del caso',
      bestMark: 'Tu mejor marca en este caso', rankPts: 'pts sumados a tu puntaje del sitio',
      reset: 'Reiniciar puntaje', resetConfirm: '¿Eliminar el puntaje obtenido en Pantalla Azul? Solo se reinicia este minijuego; todo lo demás queda igual.' },
    en: { solved: 'Solved', play: 'Investigate case', again: 'Try again', caseWord: 'Case', best: 'Best total score',
      pc: 'Machine', use: 'Owner\'s use', change: 'Recent change',
      catMemoria: 'Memory', catDisco: 'Disk & files', catSoftware: 'Software & drivers', catFisico: 'Physical inspection',
      logStart: 'Technician log: use a tool to gather evidence.',
      evidence: 'evidence gathered', need2: 'Gather at least 2 pieces of evidence to diagnose.',
      diagIntro: 'With the evidence in the log, what is the root cause of the failure?',
      wrong: 'That is not the root cause. Pick another or go back to investigating (-25 pts).',
      correct: 'Correct diagnosis!',
      fixTitle: 'The repair, step by step',
      breakdown: 'Score breakdown', bBase: 'Base score', bTools: 'Extra tools', bWrong: 'Wrong diagnoses', bTotal: 'Case total',
      bestMark: 'Your best mark on this case', rankPts: 'pts added to your site score',
      reset: 'Reset score', resetConfirm: 'Delete the score earned in Blue Screen? Only this minigame resets; everything else stays the same.' }
  }[lang];

  var CATS = { memoria: T.catMemoria, disco: T.catDisco, software: T.catSoftware, fisico: T.catFisico };

  var CASES = [
    {
      id: 'ram', code: 'MEMORY_MANAGEMENT',
      title: { es: 'Pantallas azules al azar', en: 'Random blue screens' },
      symptom: { es: 'El equipo se cae con pantalla azul varias veces al día, sobre todo cuando se abren muchos programas a la vez. Reinicia y vuelve a fallar sin patrón claro.', en: 'The PC crashes with a blue screen several times a day, mostly when many programs are open at once. It reboots and fails again with no clear pattern.' },
      brief: { pc: { es: 'PC de escritorio, 16 GB de RAM (2 módulos de 8 GB)', en: 'Desktop PC, 16 GB RAM (2× 8 GB sticks)' }, use: { es: 'Clases virtuales y muchas pestañas abiertas', en: 'Online classes and many open tabs' }, change: { es: 'Se agregó un módulo de RAM hace 2 semanas', en: 'A RAM stick was added 2 weeks ago' } },
      tools: [
        { id: 'memtest', cat: 'memoria', name: { es: 'MemTest (prueba de RAM)', en: 'MemTest (RAM test)' }, result: { es: '3.214 errores en el módulo del banco 2. La memoria no retiene bien los datos.', en: '3,214 errors on the bank 2 module. Memory is not holding data reliably.' } },
        { id: 'chkdsk', cat: 'disco', name: { es: 'chkdsk (revisar disco)', en: 'chkdsk (check disk)' }, result: { es: 'Sistema de archivos limpio, sin sectores defectuosos.', en: 'File system clean, no bad sectors.' } },
        { id: 'safemode', cat: 'software', name: { es: 'Modo seguro', en: 'Safe mode' }, result: { es: 'En modo seguro también se cae al abrir varios programas.', en: 'In safe mode it also crashes when opening several programs.' } },
        { id: 'devmgr', cat: 'software', name: { es: 'Administrador de dispositivos', en: 'Device manager' }, result: { es: 'Ningún dispositivo con advertencias.', en: 'No device warnings.' } }
      ],
      options: [
        { t: { es: 'RAM defectuosa', en: 'Faulty RAM' }, ok: true },
        { t: { es: 'Disco dañado', en: 'Damaged disk' }, ok: false },
        { t: { es: 'Driver corrupto', en: 'Corrupt driver' }, ok: false }
      ],
      why: { es: 'Los errores de MemTest y el código MEMORY_MANAGEMENT apuntan a la RAM: al llenarse la memoria con muchos programas, los datos se corrompen y Windows se protege con la pantalla azul.', en: 'MemTest errors and the MEMORY_MANAGEMENT code point to RAM: as memory fills with many programs, data corrupts and Windows protects itself with the blue screen.' },
      fix: { es: ['Apagar y desconectar el equipo; retirar el módulo del banco 2.', 'Probar solo con el módulo bueno durante un día: si no hay fallas, confirmado.', 'Limpiar los contactos del módulo sospechoso y probarlo solo: si MemTest vuelve a fallar, reemplazarlo por uno igual (misma velocidad y capacidad).'], en: ['Power off and unplug; remove the bank 2 module.', 'Run a day with only the good module: no crashes means confirmed.', 'Clean the suspect module contacts and test it alone: if MemTest fails again, replace it with a matching one (same speed and size).'] }
    },
    {
      id: 'driver-prn', code: 'CRITICAL_PROCESS_DIED',
      title: { es: 'Falla justo tras instalar la impresora', en: 'Fails right after installing the printer' },
      symptom: { es: 'El equipo funcionaba perfecto hasta ayer, cuando se instaló una impresora nueva. Desde entonces, pantalla azul al iniciar sesión.', en: 'The PC worked perfectly until yesterday, when a new printer was installed. Since then, blue screen at sign-in.' },
      brief: { pc: { es: 'Portátil de oficina con Windows actualizado', en: 'Office laptop with up-to-date Windows' }, use: { es: 'Documentos e impresión diaria', en: 'Documents and daily printing' }, change: { es: 'Impresora nueva instalada ayer con su CD', en: 'New printer installed yesterday from its CD' } },
      tools: [
        { id: 'safemode', cat: 'software', name: { es: 'Modo seguro', en: 'Safe mode' }, result: { es: 'En modo seguro el equipo arranca y trabaja sin fallas durante horas.', en: 'In safe mode the PC boots and works for hours with no failures.' } },
        { id: 'devmgr', cat: 'software', name: { es: 'Administrador de dispositivos', en: 'Device manager' }, result: { es: 'El controlador de la impresora quedó con firma dañada y fecha de ayer.', en: 'The printer driver has a broken signature and yesterday\'s date.' } },
        { id: 'memtest', cat: 'memoria', name: { es: 'MemTest (prueba de RAM)', en: 'MemTest (RAM test)' }, result: { es: '0 errores tras dos pasadas completas.', en: '0 errors after two full passes.' } },
        { id: 'chkdsk', cat: 'disco', name: { es: 'chkdsk (revisar disco)', en: 'chkdsk (check disk)' }, result: { es: 'Sin errores.', en: 'No errors.' } }
      ],
      options: [
        { t: { es: 'RAM defectuosa', en: 'Faulty RAM' }, ok: false },
        { t: { es: 'Driver corrupto (impresora)', en: 'Corrupt driver (printer)' }, ok: true },
        { t: { es: 'Disco dañado', en: 'Damaged disk' }, ok: false }
      ],
      why: { es: 'La falla empezó con un cambio de software, el modo seguro (que no carga ese driver) funciona y el controlador quedó con la firma dañada: es un driver corrupto, no hardware.', en: 'The failure started with a software change, safe mode (which skips that driver) works, and the driver signature is broken: it is a corrupt driver, not hardware.' },
      fix: { es: ['Entrar en modo seguro y desinstalar el controlador de la impresora.', 'Reiniciar en modo normal y comprobar que ya no hay pantalla azul.', 'Descargar el driver actual desde la página oficial del fabricante (no el CD) e instalarlo.'], en: ['Boot into safe mode and uninstall the printer driver.', 'Reboot normally and confirm the blue screen is gone.', 'Download the current driver from the manufacturer\'s official site (not the CD) and install it.'] }
    },
    {
      id: 'disco', code: 'INACCESSIBLE_BOOT_DEVICE',
      title: { es: 'No arranca y hace clics raros', en: 'Will not boot and makes clicking sounds' },
      symptom: { es: 'El equipo tarda minutos en hacer cualquier cosa, se escuchan clics repetidos desde la torre y hoy ya no pasó del logo de Windows.', en: 'The PC takes minutes to do anything, repeated clicks come from the case, and today it no longer gets past the Windows logo.' },
      brief: { pc: { es: 'PC de escritorio con disco mecánico (HDD) de 6 años', en: 'Desktop PC with a 6-year-old mechanical drive (HDD)' }, use: { es: 'Fotos familiares y documentos, sin copia de seguridad', en: 'Family photos and documents, no backup' }, change: { es: 'Ninguno: cada semana iba más lento', en: 'None: it got slower every week' } },
      tools: [
        { id: 'smart', cat: 'disco', name: { es: 'SMART (salud del disco)', en: 'SMART (disk health)' }, result: { es: 'Estado «Riesgo». 1.842 sectores reasignados y subiendo cada día.', en: '"Caution" status. 1,842 reallocated sectors and rising daily.' } },
        { id: 'chkdsk', cat: 'disco', name: { es: 'chkdsk (revisar disco)', en: 'chkdsk (check disk)' }, result: { es: 'Sectores defectuosos ilegibles en la zona de arranque.', en: 'Unreadable bad sectors in the boot area.' } },
        { id: 'memtest', cat: 'memoria', name: { es: 'MemTest (prueba de RAM)', en: 'MemTest (RAM test)' }, result: { es: '0 errores.', en: '0 errors.' } },
        { id: 'temp', cat: 'fisico', name: { es: 'Monitor de temperatura', en: 'Temperature monitor' }, result: { es: 'Temperaturas normales: CPU 47 °C, disco 39 °C.', en: 'Normal temperatures: CPU 47 °C, disk 39 °C.' } }
      ],
      options: [
        { t: { es: 'Disco dañado', en: 'Damaged disk' }, ok: true },
        { t: { es: 'RAM defectuosa', en: 'Faulty RAM' }, ok: false },
        { t: { es: 'Sobrecalentamiento', en: 'Overheating' }, ok: false }
      ],
      why: { es: 'Los clics, la lentitud extrema, el SMART en riesgo y los sectores defectuosos en la zona de arranque cuentan la misma historia: el disco está muriendo.', en: 'The clicks, extreme slowness, SMART caution and bad sectors in the boot area all tell the same story: the disk is dying.' },
      fix: { es: ['PRIMERO lo primero: rescatar las fotos y documentos a otro disco o a la nube, antes de seguir probando (cada arranque lo daña más).', 'Reemplazar el disco por un SSD (de paso, el equipo quedará mucho más rápido).', 'Reinstalar el sistema en el SSD, restaurar los datos y activar una copia de seguridad automática.'], en: ['FIRST things first: rescue photos and documents to another disk or the cloud before more testing (every boot hurts it more).', 'Replace the disk with an SSD (the PC will feel much faster, too).', 'Reinstall the system on the SSD, restore the data and turn on automatic backups.'] }
    },
    {
      id: 'driver-gpu', code: 'SYSTEM_THREAD_EXCEPTION_NOT_HANDLED',
      title: { es: 'Pantalla azul solo en juegos', en: 'Blue screen only in games' },
      symptom: { es: 'En el escritorio todo va bien, pero a los pocos minutos de abrir un juego aparece la pantalla azul. Pasó desde la última actualización de la tarjeta de video.', en: 'On the desktop everything is fine, but a few minutes into a game the blue screen appears. It started after the last graphics card update.' },
      brief: { pc: { es: 'PC gamer con tarjeta de video dedicada', en: 'Gaming PC with a dedicated graphics card' }, use: { es: 'Juegos exigentes a diario', en: 'Demanding games daily' }, change: { es: 'Actualización automática del driver de video hace 2 días', en: 'Automatic video driver update 2 days ago' } },
      tools: [
        { id: 'devmgr', cat: 'software', name: { es: 'Administrador de dispositivos', en: 'Device manager' }, result: { es: 'El driver de video es de hace 2 días (actualización automática).', en: 'The video driver is 2 days old (automatic update).' } },
        { id: 'rollback', cat: 'software', name: { es: 'Revertir el driver', en: 'Roll back the driver' }, result: { es: 'Con el driver anterior, el juego corre 1 hora sin una sola falla.', en: 'With the previous driver, the game runs for 1 hour with zero failures.' } },
        { id: 'temp', cat: 'fisico', name: { es: 'Monitor de temperatura', en: 'Temperature monitor' }, result: { es: 'GPU a 71 °C jugando: dentro de lo normal.', en: 'GPU at 71 °C while gaming: within normal range.' } },
        { id: 'memtest', cat: 'memoria', name: { es: 'MemTest (prueba de RAM)', en: 'MemTest (RAM test)' }, result: { es: '0 errores.', en: '0 errors.' } }
      ],
      options: [
        { t: { es: 'Sobrecalentamiento', en: 'Overheating' }, ok: false },
        { t: { es: 'Driver de video defectuoso', en: 'Faulty video driver' }, ok: true },
        { t: { es: 'Disco dañado', en: 'Damaged disk' }, ok: false }
      ],
      why: { es: 'La falla sigue a la actualización y desaparece al revertir el driver, con temperaturas normales: el culpable es el driver de video nuevo, no el hardware.', en: 'The failure follows the update and disappears when rolling back the driver, with normal temperatures: the new video driver is the culprit, not the hardware.' },
      fix: { es: ['Dejar el driver anterior (el que funciona) desde el Administrador de dispositivos → Revertir controlador.', 'Pausar las actualizaciones automáticas de ese driver hasta que salga una versión corregida.', 'Cuando actualices, hazlo desde la página oficial y crea un punto de restauración antes.'], en: ['Keep the previous (working) driver via Device manager → Roll back driver.', 'Pause automatic updates for that driver until a fixed version ships.', 'When you update, use the official site and create a restore point first.'] }
    },
    {
      id: 'calor', code: 'WHEA_UNCORRECTABLE_ERROR',
      title: { es: 'Se apaga en lo mejor del juego', en: 'Shuts down mid-game' },
      symptom: { es: 'Tras 20 minutos de juego exigente, el equipo se congela con pantalla azul o se apaga de golpe. En tareas livianas nunca falla. La torre está en un mueble cerrado.', en: 'After 20 minutes of heavy gaming, the PC freezes with a blue screen or shuts off at once. On light tasks it never fails. The case sits inside a closed cabinet.' },
      brief: { pc: { es: 'PC de escritorio dentro de un mueble cerrado', en: 'Desktop PC inside a closed cabinet' }, use: { es: 'Juegos exigentes por horas', en: 'Demanding games for hours' }, change: { es: 'Ninguno reciente: el polvo lleva años acumulándose', en: 'None lately: dust has been building up for years' } },
      tools: [
        { id: 'temp', cat: 'fisico', name: { es: 'Monitor de temperatura', en: 'Temperature monitor' }, result: { es: 'La CPU sube a 99 °C y ahí se congela. El ventilador gira, pero el disipador está tapado de polvo.', en: 'CPU climbs to 99 °C and freezes there. The fan spins but the heatsink is clogged with dust.' } },
        { id: 'memtest', cat: 'memoria', name: { es: 'MemTest (prueba de RAM)', en: 'MemTest (RAM test)' }, result: { es: 'Prueba corta: 0 errores (y temperaturas bajas en reposo).', en: 'Short run: 0 errors (and low idle temperatures).' } },
        { id: 'smart', cat: 'disco', name: { es: 'SMART (salud del disco)', en: 'SMART (disk health)' }, result: { es: 'Disco en buen estado.', en: 'Disk in good health.' } },
        { id: 'devmgr', cat: 'software', name: { es: 'Administrador de dispositivos', en: 'Device manager' }, result: { es: 'Sin advertencias ni drivers recientes.', en: 'No warnings or recent drivers.' } }
      ],
      options: [
        { t: { es: 'RAM defectuosa', en: 'Faulty RAM' }, ok: false },
        { t: { es: 'Sobrecalentamiento de la CPU', en: 'CPU overheating' }, ok: true },
        { t: { es: 'Driver corrupto', en: 'Corrupt driver' }, ok: false }
      ],
      why: { es: 'El código WHEA habla de hardware bajo estrés y el monitor lo confirma: 99 °C con el disipador tapado de polvo y el mueble cerrado.', en: 'The WHEA code means hardware under stress and the monitor confirms it: 99 °C with a dust-clogged heatsink and a closed cabinet.' },
      fix: { es: ['Sacar la torre del mueble cerrado: necesita aire alrededor.', 'Limpiar el disipador y los ventiladores con aire comprimido (con el equipo apagado y desconectado).', 'Cambiar la pasta térmica de la CPU y comprobar jugando: la temperatura debe bajar de 85 °C.'], en: ['Take the case out of the closed cabinet: it needs air around it.', 'Clean the heatsink and fans with compressed air (PC off and unplugged).', 'Replace the CPU thermal paste and test while gaming: temperature should stay under 85 °C.'] }
    },
    {
      id: 'ntfs', code: 'NTFS_FILE_SYSTEM',
      title: { es: 'Archivos corruptos tras un apagón', en: 'Corrupt files after a blackout' },
      symptom: { es: 'Hubo un corte de luz con el equipo encendido. Desde ahí, varios documentos no abren y Windows muestra la pantalla azul NTFS_FILE_SYSTEM al copiar archivos.', en: 'There was a power outage with the PC on. Since then, several documents will not open and Windows shows the NTFS_FILE_SYSTEM blue screen when copying files.' },
      brief: { pc: { es: 'PC de escritorio con SSD en buen estado', en: 'Desktop PC with a healthy SSD' }, use: { es: 'Trabajo de oficina; justo estaba guardando documentos', en: 'Office work; it was saving documents at that moment' }, change: { es: 'Un corte de luz anoche, con el equipo encendido', en: 'A power outage last night, with the PC on' } },
      tools: [
        { id: 'chkdsk', cat: 'disco', name: { es: 'chkdsk (revisar disco)', en: 'chkdsk (check disk)' }, result: { es: 'Errores en la tabla NTFS y 14 archivos con registros dañados. La superficie física está sana.', en: 'Errors in the NTFS table and 14 files with damaged records. The physical surface is healthy.' } },
        { id: 'smart', cat: 'disco', name: { es: 'SMART (salud del disco)', en: 'SMART (disk health)' }, result: { es: 'Sin sectores reasignados; salud física buena.', en: 'No reallocated sectors; physical health good.' } },
        { id: 'memtest', cat: 'memoria', name: { es: 'MemTest (prueba de RAM)', en: 'MemTest (RAM test)' }, result: { es: '0 errores.', en: '0 errors.' } },
        { id: 'safemode', cat: 'software', name: { es: 'Modo seguro', en: 'Safe mode' }, result: { es: 'En modo seguro también fallan los mismos archivos: el daño está en los datos, no en un driver.', en: 'In safe mode the same files also fail: the damage is in the data, not a driver.' } }
      ],
      options: [
        { t: { es: 'Sistema de archivos dañado (el disco está sano)', en: 'Damaged file system (disk itself is healthy)' }, ok: true },
        { t: { es: 'Disco físicamente dañado', en: 'Physically damaged disk' }, ok: false },
        { t: { es: 'RAM defectuosa', en: 'Faulty RAM' }, ok: false }
      ],
      why: { es: 'El apagón cortó escrituras a mitad de camino y corrompió la estructura NTFS. El SMART sano descarta daño físico.', en: 'The outage cut writes midway and corrupted the NTFS structure. Healthy SMART rules out physical damage.' },
      fix: { es: ['Ejecutar chkdsk /f y dejar que repare la tabla NTFS al reiniciar.', 'Restaurar los 14 archivos dañados desde la copia de seguridad o el historial de archivos.', 'Para la próxima: un regulador o UPS barato protege el equipo de los cortes de luz.'], en: ['Run chkdsk /f and let it repair the NTFS table on reboot.', 'Restore the 14 damaged files from backup or file history.', 'For next time: a cheap regulator or UPS protects the PC from outages.'] }
    }
  ];

  function load() { try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d && d.solved) return d; } catch (e) {} return { solved: {} }; }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  function $(id) { return document.getElementById(id); }

  var store = load();
  var current = null, used = {}, wrongs = 0;

  var casesEl = $('bsod-cases'), gameEl = $('bsod-game');
  if (!casesEl || !gameEl) return;

  function solvedCount() { return Object.keys(store.solved).length; }
  function totalBest() { return Object.keys(store.solved).reduce(function (a, k) { return a + (store.solved[k] || 0); }, 0); }

  function rankBonus() { return Math.min(150, Math.round(totalBest() / 4)); }
  function renderCases() {
    $('bsod-progress').textContent = solvedCount() + '/' + CASES.length;
    $('bsod-best').textContent = totalBest() ? T.best + ': ' + totalBest() + ' · +' + rankBonus() + ' ' + T.rankPts : '';
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
      if (done) {
        var s = document.createElement('span'); s.className = 'mejora-chip';
        s.textContent = ' ✓ ' + T.solved + ' · ' + store.solved[c.id];
        code.appendChild(document.createTextNode(' ')); code.appendChild(s);
      }
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tool-btn bsod-case-btn';
      b.textContent = done ? T.again : T.play;
      b.addEventListener('click', function () { openCase(c); });
      card.appendChild(h); card.appendChild(code); card.appendChild(b);
      casesEl.appendChild(card);
    });
  }

  function setPhase(n) {
    [1, 2, 3, 4].forEach(function (i) {
      var ph = $('bsod-phase' + i);
      if (ph) ph.hidden = i !== n;
      var li = document.querySelector('#bsod-steps li[data-step="' + i + '"]');
      if (li) {
        li.classList.toggle('on', i === n);
        li.classList.toggle('done', i < n);
      }
    });
  }

  function openCase(c) {
    current = c; used = {}; wrongs = 0;
    gameEl.hidden = false;
    // Fase 1: pantalla + ficha
    var scr = $('bsod-screen');
    scr.innerHTML = '';
    var face = document.createElement('p'); face.className = 'bsod-face'; face.textContent = ':(';
    var txt = document.createElement('p'); txt.textContent = c.symptom[lang];
    var code = document.createElement('p');
    var lbl = document.createElement('span'); lbl.textContent = 'Stop code: ';
    var cd = document.createElement('span'); cd.className = 'bsod-code'; cd.textContent = c.code;
    code.appendChild(lbl); code.appendChild(cd);
    scr.appendChild(face); scr.appendChild(txt); scr.appendChild(code);
    var brief = $('bsod-brief');
    brief.innerHTML = '';
    [[T.pc, c.brief.pc[lang]], [T.use, c.brief.use[lang]], [T.change, c.brief.change[lang]]].forEach(function (row) {
      var p = document.createElement('p');
      var k = document.createElement('strong'); k.textContent = row[0] + ': ';
      p.appendChild(k); p.appendChild(document.createTextNode(row[1]));
      brief.appendChild(p);
    });
    buildTools(c);
    buildOptions(c);
    $('bsod-log').textContent = T.logStart;
    $('bsod-diag-msg').textContent = '';
    $('bsod-result-card').innerHTML = '';
    setPhase(1);
    gameEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function buildTools(c) {
    var box = $('bsod-tools');
    box.innerHTML = '';
    var order = ['memoria', 'disco', 'software', 'fisico'];
    order.forEach(function (cat) {
      var tools = c.tools.filter(function (t) { return t.cat === cat; });
      if (!tools.length) return;
      var h = document.createElement('h4');
      h.className = 'bsod-cat'; h.textContent = CATS[cat];
      var wrap = document.createElement('div');
      wrap.className = 'bsod-tools';
      tools.forEach(function (tool) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'tool-btn tool-btn-ghost bsod-tool';
        b.textContent = tool.name[lang];
        if (used[tool.id]) b.disabled = true;
        b.addEventListener('click', function () {
          if (used[tool.id]) return;
          used[tool.id] = true; b.disabled = true;
          logLine('▸ ' + tool.name[lang] + ' → ' + tool.result[lang]);
          updateEvidence();
        });
        wrap.appendChild(b);
      });
      box.appendChild(h); box.appendChild(wrap);
    });
    updateEvidence();
  }

  function updateEvidence() {
    var n = Object.keys(used).length;
    $('bsod-evidence').textContent = n + ' ' + T.evidence;
    $('bsod-todiag').disabled = n < 2;
  }

  function logLine(s) {
    var log = $('bsod-log');
    if (log.textContent === T.logStart) log.textContent = '';
    log.textContent += (log.textContent ? '\n' : '') + s;
  }

  function buildOptions(c) {
    var opts = $('bsod-options');
    opts.innerHTML = '';
    c.options.forEach(function (op) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tool-btn'; b.textContent = op.t[lang];
      b.addEventListener('click', function () { diagnose(op, b); });
      opts.appendChild(b);
    });
    $('bsod-diag-summary').textContent = T.diagIntro;
  }

  function diagnose(op, btn) {
    var msg = $('bsod-diag-msg');
    if (!op.ok) {
      wrongs++;
      msg.textContent = T.wrong;
      btn.disabled = true;
      return;
    }
    var nUsed = Object.keys(used).length;
    var toolPenalty = 12 * Math.max(0, nUsed - 1);
    var wrongPenalty = 25 * wrongs;
    var score = Math.max(30, 100 - toolPenalty - wrongPenalty);
    if (V) score = V.safeScore(score);
    if (store.solved[current.id] == null || score > store.solved[current.id]) store.solved[current.id] = score;
    save(store);
    // Fase 4: tarjeta de resolución con explicación, reparación y desglose
    var card = $('bsod-result-card');
    card.innerHTML = '';
    var h = document.createElement('h3'); h.textContent = '✓ ' + T.correct;
    var why = document.createElement('p'); why.textContent = current.why[lang];
    var fh = document.createElement('h4'); fh.textContent = '🔧 ' + T.fixTitle;
    var ol = document.createElement('ol');
    current.fix[lang].forEach(function (step) {
      var li = document.createElement('li'); li.textContent = step; ol.appendChild(li);
    });
    var bh = document.createElement('h4'); bh.textContent = T.breakdown;
    var table = document.createElement('table');
    table.className = 'presu-table';
    [[T.bBase, '100'], [T.bTools + ' (' + nUsed + ')', '−' + toolPenalty], [T.bWrong + ' (' + wrongs + ')', '−' + wrongPenalty], [T.bTotal, String(score)]].forEach(function (row, i) {
      var tr = document.createElement('tr');
      var a = document.createElement('td'); a.textContent = row[0];
      var b = document.createElement('td'); b.textContent = row[1];
      if (i === 3) { a.style.fontWeight = '800'; b.style.fontWeight = '800'; }
      tr.appendChild(a); tr.appendChild(b); table.appendChild(tr);
    });
    var best = document.createElement('p');
    best.className = 'foro-meta';
    best.textContent = T.bestMark + ': ' + store.solved[current.id];
    card.appendChild(h); card.appendChild(why); card.appendChild(fh); card.appendChild(ol);
    card.appendChild(bh); card.appendChild(table); card.appendChild(best);
    setPhase(4);
    renderCases();
  }

  // Navegación entre fases
  $('bsod-start').addEventListener('click', function () { setPhase(2); });
  $('bsod-back1').addEventListener('click', function () { setPhase(1); });
  $('bsod-todiag').addEventListener('click', function () {
    if (Object.keys(used).length < 2) { $('bsod-diag-msg').textContent = T.need2; return; }
    setPhase(3);
  });
  $('bsod-more').addEventListener('click', function () { setPhase(2); });
  $('bsod-next').addEventListener('click', function () {
    gameEl.hidden = true;
    document.getElementById('bsod-cases').scrollIntoView({ behavior: 'smooth' });
  });
  $('bsod-retry').addEventListener('click', function () { if (current) openCase(current); });
  // Reiniciar SOLO el puntaje de este minijuego: borra sus casos resueltos
  // (y con eso su aporte a los puntos del sitio); no toca nada más.
  var resetBtn = $('bsod-reset');
  if (resetBtn) {
    resetBtn.textContent = T.reset;
    resetBtn.addEventListener('click', function () {
      if (!window.confirm(T.resetConfirm)) return;
      store = { solved: {} };
      save(store);
      gameEl.hidden = true;
      renderCases();
    });
  }

  renderCases();
})();
