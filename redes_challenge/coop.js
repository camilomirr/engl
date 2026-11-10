// NVISION · Redes Challenge — Modo Cooperativo «Salven la red» (2026-11-10)
// Misión en equipo contra un ciberataque: varios jugadores entran con el
// mismo código, responden preguntas de respuesta a incidentes y cada
// acierto suma DEFENSA compartida. El ataque avanza con el reloj: si
// llega al 100% antes de completar la defensa, la red cae.
//
// Infraestructura: reutiliza las tablas vivas del sitio SIN tocar el
// juego competitivo (que usa game_state id=1):
//   · game_state id=2  → sala cooperativa (status/session_id/started_at)
//     y current_question guarda la META de defensa de la partida.
//   · live_players     → miembros del equipo y su aporte (puntos).
// Las victorias locales se guardan en nvision_coop_v1 para los logros.
(function () {
  'use strict';
  var lang = 'es';
  try { lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es'; } catch (e) {}
  var SB = window.NVISION_sb, V = window.NVISION_validate;
  var STATE_ID = 2, ATTACK_SECONDS = 600, PER_CORRECT = 10, PERSONAL_CAP = 150;
  var KEY = 'nvision_coop_v1';

  var T = {
    es: { needName: 'Escribe tu nombre (mínimo 3 letras).', needCode: 'Escribe el código de 4 letras de la sala.', creating: 'Creando la sala…', joining: 'Uniéndome…', noRoom: 'Esa sala no existe o ya cerró. Pide el código de nuevo.', errNet: 'No se pudo conectar. Revisa tu internet e inténtalo de nuevo.', lobby: 'En espera: compartan el código y, cuando estén todos, el anfitrión inicia la misión.', playing: '¡Misión en curso! Respondan para defender la red.', won: '🏆 ¡La red está a salvo! El equipo detuvo el ataque. Defensa completa: ', lost: '💥 El ataque tomó la red. Defensa lograda: ', of: ' de ', defense: 'Defensa del equipo', attack: 'Avance del ataque', waitStart: 'Esperando a que el anfitrión inicie…', correct: '✓ ¡Correcto! +10 de defensa. ', wrong: '✗ No: ', yourTurn: 'Tu aporte', pts: 'pts', members: 'Equipo' },
    en: { needName: 'Type your name (at least 3 letters).', needCode: 'Type the 4-letter room code.', creating: 'Creating the room…', joining: 'Joining…', noRoom: 'That room does not exist or already closed. Ask for the code again.', errNet: 'Could not connect. Check your internet and try again.', lobby: 'Waiting: share the code and, once everyone is in, the host starts the mission.', playing: 'Mission running! Answer to defend the network.', won: '🏆 The network is safe! The team stopped the attack. Defense completed: ', lost: '💥 The attack took the network. Defense reached: ', of: ' of ', defense: 'Team defense', attack: 'Attack progress', waitStart: 'Waiting for the host to start…', correct: '✓ Correct! +10 defense. ', wrong: '✗ No: ', yourTurn: 'Your contribution', pts: 'pts', members: 'Team' }
  }[lang];

  // Banco de preguntas de respuesta a incidentes (bilingüe).
  var Q = [
    { q: { es: 'Un empleado abrió un correo falso y escribió su contraseña. ¿Primera acción?', en: 'An employee opened a fake email and typed their password. First action?' }, o: { es: ['Cambiar esa contraseña ya y avisar a sistemas', 'Borrar el correo y no decir nada', 'Reenviar el correo a todos para avisar'], en: ['Change that password now and notify IT', 'Delete the email and say nothing', 'Forward the email to everyone to warn them'] }, a: 0, w: { es: 'La credencial ya está en manos del atacante: cambiarla corta el acceso.', en: 'The credential is already in attacker hands: changing it cuts access.' } },
    { q: { es: 'Varios archivos aparecen renombrados y piden un rescate en bitcoin. ¿Qué es y qué se hace?', en: 'Several files appear renamed and a bitcoin ransom is demanded. What is it and what do you do?' }, o: { es: ['Es un virus común: abrir los archivos para revisar', 'Ransomware: aislar el equipo de la red ya', 'Un error de Windows: reiniciar y seguir'], en: ['A common virus: open the files to check', 'Ransomware: isolate the machine from the network now', 'A Windows error: reboot and carry on'] }, a: 1, w: { es: 'El ransomware cifra y se propaga por la red: aislar el equipo frena el contagio.', en: 'Ransomware encrypts and spreads over the network: isolating the host stops the spread.' } },
    { q: { es: 'El firewall muestra miles de intentos de conexión al puerto 3389 (RDP). ¿Medida inmediata?', en: 'The firewall shows thousands of connection attempts to port 3389 (RDP). Immediate measure?' }, o: { es: ['Ignorarlo: son escaneos normales', 'Cerrar el RDP al exterior y exigir VPN', 'Cambiar el fondo de pantalla del servidor'], en: ['Ignore it: normal scans', 'Close RDP from the internet and require VPN', 'Change the server wallpaper'] }, a: 1, w: { es: 'Es fuerza bruta contra el escritorio remoto: el RDP no debe estar expuesto a internet.', en: 'It is brute force against remote desktop: RDP must not be exposed to the internet.' } },
    { q: { es: '¿Qué copia de seguridad protege de verdad contra ransomware?', en: 'Which backup truly protects against ransomware?' }, o: { es: ['Una en el mismo disco del servidor', 'Una desconectada o inmutable, fuera del alcance del ataque', 'Ninguna: los respaldos no sirven'], en: ['One on the same server disk', 'An offline or immutable one, out of the attack\'s reach', 'None: backups are useless'] }, a: 1, w: { es: 'El ransomware también cifra los respaldos conectados: la copia debe estar aislada.', en: 'Ransomware also encrypts connected backups: the copy must be isolated.' } },
    { q: { es: 'Detectan que el sitio de la empresa redirige a una página falsa. El DNS fue cambiado. ¿Qué se revisa?', en: 'The company site redirects to a fake page. DNS was changed. What do you check?' }, o: { es: ['Los registros DNS y las credenciales del panel del dominio', 'El color del logo', 'El monitor del diseñador'], en: ['DNS records and the domain panel credentials', 'The logo color', 'The designer\'s monitor'] }, a: 0, w: { es: 'Un DNS alterado desvía a todos los visitantes: se auditan registros y accesos del panel.', en: 'Altered DNS diverts every visitor: audit records and panel access.' } },
    { q: { es: 'Un parche crítico de Windows salió hace un mes y ningún equipo lo tiene. Eso es…', en: 'A critical Windows patch came out a month ago and no machine has it. That is…' }, o: { es: ['Un ahorro de tiempo', 'Una ventana abierta: actualizar de inmediato', 'Un problema solo del fabricante'], en: ['A time saver', 'An open window: update immediately', 'Only the vendor\'s problem'] }, a: 1, w: { es: 'Los ataques explotan fallos ya conocidos: el parche publicado le dice al atacante dónde está la puerta.', en: 'Attacks exploit known flaws: the published patch tells the attacker where the door is.' } },
    { q: { es: 'La red de visitas puede ver los servidores internos. ¿Qué principio falla?', en: 'The guest network can see the internal servers. Which principle fails?' }, o: { es: ['La segmentación de la red', 'La velocidad del WiFi', 'El diseño del logo'], en: ['Network segmentation', 'WiFi speed', 'Logo design'] }, a: 0, w: { es: 'Segmentar separa invitados de servidores: si un lado cae, el otro queda protegido.', en: 'Segmentation separates guests from servers: if one side falls, the other stays protected.' } },
    { q: { es: 'El jefe pide desactivar el antivirus «porque pone lento el PC». ¿Respuesta correcta?', en: 'The boss asks to disable the antivirus "because it slows the PC". Right answer?' }, o: { es: ['Desactivarlo para siempre', 'No: se busca la causa de la lentitud y se mantiene la protección', 'Desactivarlo solo los lunes'], en: ['Disable it forever', 'No: find the slowness cause and keep the protection', 'Disable it only on Mondays'] }, a: 1, w: { es: 'Sin antivirus el equipo queda ciego ante el ataque: se optimiza, no se desprotege.', en: 'Without antivirus the machine is blind to the attack: optimize it, do not unprotect it.' } },
    { q: { es: 'Alguien conecta una USB encontrada en el parqueadero. Riesgo principal:', en: 'Someone plugs in a USB found in the parking lot. Main risk:' }, o: { es: ['Que la USB esté llena', 'Malware que se ejecuta al conectarla', 'Que pese mucho'], en: ['That the USB is full', 'Malware that runs when plugged in', 'That it is heavy'] }, a: 1, w: { es: 'Las USB «perdidas» son un truco clásico para sembrar malware dentro de la red.', en: '“Lost” USB drives are a classic trick to plant malware inside the network.' } },
    { q: { es: '¿Para qué sirve la autenticación en dos pasos (2FA) en plena crisis?', en: 'What is two-factor authentication (2FA) for during a crisis?' }, o: { es: ['Para decorar el inicio de sesión', 'Aunque roben la contraseña, no pueden entrar sin el segundo factor', 'Para gastar más datos'], en: ['To decorate the sign-in', 'Even if the password is stolen, they cannot enter without the second factor', 'To use more data'] }, a: 1, w: { es: 'El 2FA convierte una contraseña robada en un papel sin valor.', en: '2FA turns a stolen password into a worthless piece of paper.' } },
    { q: { es: 'El ataque terminó. ¿Qué se hace ANTES de volver a conectar todo?', en: 'The attack is over. What do you do BEFORE reconnecting everything?' }, o: { es: ['Nada: conectar y celebrar', 'Verificar que el atacante salió, cambiar credenciales y revisar respaldos', 'Formatear también los respaldos'], en: ['Nothing: reconnect and celebrate', 'Verify the attacker is out, change credentials and check backups', 'Format the backups too'] }, a: 1, w: { es: 'Reconectar con el atacante dentro reinicia la crisis: primero se limpia y se verifica.', en: 'Reconnecting with the attacker inside restarts the crisis: clean and verify first.' } },
    { q: { es: 'Un solo equipo infectado puede hablar con todos los demás. ¿Qué diseño lo habría limitado?', en: 'A single infected machine can talk to all the others. Which design would have limited it?' }, o: { es: ['Red plana sin divisiones', 'Red segmentada por áreas con firewall entre ellas', 'Cables de colores'], en: ['Flat network with no divisions', 'Network segmented by areas with firewalls between them', 'Colored cables'] }, a: 1, w: { es: 'La segmentación contiene el daño: el incendio no pasa de una habitación a todo el edificio.', en: 'Segmentation contains the damage: the fire does not spread from one room to the whole building.' } }
  ];

  function $(id) { return document.getElementById(id); }
  function cleanName(s) { return V ? V.cleanName(s, 24) : String(s || '').slice(0, 24); }
  function loadLocal() { try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d) return d; } catch (e) {} return { wins: 0, games: 0 }; }
  function saveLocal(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }

  var state = null, players = [], myId = null, mySession = '', isHost = false, myPoints = 0, qIndex = 0, pollTimer = null, ended = false, countedGame = false;

  function showCoop() {
    ['startScreen', 'lobbyScreen', 'game', 'end'].forEach(function (id) { var el = $(id); if (el) el.classList.add('hidden'); });
    $('coopScreen').classList.remove('hidden');
  }
  function leaveCoop() {
    stopPoll();
    $('coopScreen').classList.add('hidden');
    $('coopRoom').classList.add('hidden');
    $('coopHome').classList.remove('hidden');
    var ss = $('startScreen'); if (ss) ss.classList.remove('hidden');
  }

  function getState() { return SB.get('/rest/v1/game_state?id=eq.' + STATE_ID + '&select=*').then(function (rows) { return rows && rows[0] ? rows[0] : null; }); }

  function codeGen() {
    var abc = 'ABCDEFGHJKMNPQRSTUVWXYZ', s = '';
    for (var i = 0; i < 4; i++) s += abc[Math.floor(Math.random() * abc.length)];
    return s;
  }

  function createRoom() {
    var st = $('coopHomeStatus');
    var name = cleanName($('coopName1').value);
    if (!name || name.length < 3) { st.textContent = T.needName; return; }
    st.textContent = T.creating;
    var session = 'coop-' + codeGen();
    var patch = { status: 'lobby', session_id: session, started_at: null, current_question: 200 };
    SB.patch('/rest/v1/game_state?id=eq.' + STATE_ID, patch)
      .then(function () { return getState(); })
      .then(function (row) {
        if (!row || row.session_id !== session) {
          // La fila id=2 no existía: se intenta crear.
          return SB.post('/rest/v1/game_state', Object.assign({ id: STATE_ID }, patch), 'return=representation')
            .then(function () { return getState(); });
        }
        return row;
      })
      .then(function (row) {
        if (!row || row.session_id !== session) throw new Error('no-row');
        isHost = true;
        joinAs(session, name);
      })
      .catch(function () { st.textContent = T.errNet; });
  }

  function joinRoom() {
    var st = $('coopHomeStatus');
    var code = String($('coopCode').value || '').trim().toUpperCase();
    var name = cleanName($('coopName2').value);
    if (code.length !== 4) { st.textContent = T.needCode; return; }
    if (!name || name.length < 3) { st.textContent = T.needName; return; }
    st.textContent = T.joining;
    isHost = false;
    joinAs('coop-' + code, name, code);
  }

  function joinAs(session, name, codeForError) {
    var st = $('coopHomeStatus');
    getState().then(function (row) {
      if (!row || row.session_id !== session || (row.status !== 'lobby' && row.status !== 'playing')) { st.textContent = T.noRoom; return; }
      state = row;
      SB.post('/rest/v1/live_players', { session_id: session, name: name, points: 0 }, 'return=representation')
        .then(function (created) {
          mySession = session; myId = created && created[0] ? created[0].id : null; myPoints = 0; qIndex = Math.floor(Math.random() * Q.length); ended = false; countedGame = false;
          $('coopHome').classList.add('hidden');
          $('coopRoom').classList.remove('hidden');
          $('coopRoomCode').textContent = session.replace('coop-', '');
          $('btnCoopStart').classList.toggle('hidden', !isHost);
          startPoll();
          refresh();
        })
        .catch(function () { st.textContent = T.errNet; });
    }).catch(function () { st.textContent = T.errNet; });
  }

  function startMission() {
    var goal = Math.max(200, players.length * 100);
    var start = new Date(Date.now() + 4000).toISOString();
    SB.patch('/rest/v1/game_state?id=eq.' + STATE_ID, { status: 'playing', started_at: start, current_question: goal })
      .then(function () { refresh(); })
      .catch(function () {});
  }

  function refresh() {
    if (!mySession) return;
    Promise.all([
      getState(),
      SB.get('/rest/v1/live_players?session_id=eq.' + encodeURIComponent(mySession) + '&select=id,name,points&order=points.asc,created_at.asc&limit=30')
    ]).then(function (res) {
      state = res[0]; players = res[1] || [];
      render();
    }).catch(function () {});
  }

  function startPoll() { stopPoll(); pollTimer = setInterval(refresh, 2500); }
  function stopPoll() { if (pollTimer) clearInterval(pollTimer); pollTimer = null; }

  function defense() { return players.reduce(function (a, p) { return a + (parseInt(p.points, 10) || 0); }, 0); }
  function goal() { return state && state.current_question ? parseInt(state.current_question, 10) : 200; }
  function attackPct() {
    if (!state || !state.started_at || state.status !== 'playing') return 0;
    var el = (Date.now() - new Date(state.started_at).getTime()) / 1000;
    return Math.max(0, Math.min(100, Math.round(el / ATTACK_SECONDS * 100)));
  }

  function render() {
    if (!state) return;
    var members = $('coopMembers');
    members.innerHTML = '';
    var label = document.createElement('strong'); label.textContent = T.members + ': ';
    members.appendChild(label);
    players.forEach(function (p) {
      var chip = document.createElement('span');
      chip.className = 'coop-member';
      chip.textContent = p.name + ' · ' + (parseInt(p.points, 10) || 0) + ' ' + T.pts;
      members.appendChild(chip);
    });
    var def = defense(), g = goal(), atk = attackPct();
    $('coopDefenseBar').style.width = Math.min(100, Math.round(def / g * 100)) + '%';
    $('coopDefenseText').textContent = def + T.of + g + ' ' + T.pts;
    $('coopAttackBar').style.width = atk + '%';
    $('coopAttackText').textContent = atk + '%';
    var phase = $('coopPhase'), play = $('coopPlay'), res = $('coopResult');

    if (state.status === 'lobby') {
      phase.textContent = T.lobby;
      play.classList.add('hidden');
      $('btnCoopStart').classList.toggle('hidden', !isHost);
      return;
    }
    if (state.status === 'playing') {
      phase.textContent = T.playing;
      $('btnCoopStart').classList.add('hidden');
      if (def >= g) { finish(true, def, g); return; }
      if (atk >= 100) { finish(false, def, g); return; }
      play.classList.remove('hidden');
      if (!play.dataset.q) renderQuestion();
      return;
    }
    if (state.status === 'won' || state.status === 'lost') {
      finish(state.status === 'won', def, g, true);
    }
    if (res && state.status !== 'playing' && state.status !== 'lobby') play.classList.add('hidden');
  }

  function finish(wonGame, def, g, fromState) {
    if (ended) return;
    ended = true;
    $('coopPlay').classList.add('hidden');
    $('coopResult').textContent = (wonGame ? T.won : T.lost) + def + T.of + g + ' ' + T.pts + '.';
    if (!fromState && wonGame) {
      SB.patch('/rest/v1/game_state?id=eq.' + STATE_ID, { status: 'won' }).catch(function () {});
    }
    if (!fromState && !wonGame) {
      SB.patch('/rest/v1/game_state?id=eq.' + STATE_ID, { status: 'lost' }).catch(function () {});
    }
    if (!countedGame) {
      countedGame = true;
      var d = loadLocal();
      d.games = (d.games || 0) + 1;
      if (wonGame) d.wins = (d.wins || 0) + 1;
      saveLocal(d);
    }
  }

  function renderQuestion() {
    var play = $('coopPlay');
    var item = Q[qIndex % Q.length];
    play.dataset.q = String(qIndex);
    $('coopQ').textContent = item.q[lang];
    var box = $('coopOptions');
    box.innerHTML = '';
    $('coopFeedback').textContent = '';
    item.o[lang].forEach(function (opt, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = opt;
      b.addEventListener('click', function () { answer(i, item, box); });
      box.appendChild(b);
    });
  }

  function answer(i, item, box) {
    Array.prototype.forEach.call(box.children, function (b) { b.disabled = true; });
    var fb = $('coopFeedback');
    if (i === item.a) {
      fb.textContent = T.correct + item.w[lang];
      if (myId && myPoints < PERSONAL_CAP) {
        myPoints = Math.min(PERSONAL_CAP, myPoints + PER_CORRECT);
        var pts = V ? V.safePoints(myPoints) : myPoints;
        SB.patch('/rest/v1/live_players?id=eq.' + myId, { points: pts }).then(function () { refresh(); }).catch(function () {});
      }
    } else {
      fb.textContent = T.wrong + item.w[lang];
    }
    setTimeout(function () {
      qIndex++;
      var play = $('coopPlay');
      delete play.dataset.q;
      if (!ended && state && state.status === 'playing') renderQuestion();
    }, 2600);
  }

  var open = $('btnCoopOpen');
  if (open) open.addEventListener('click', showCoop);
  var create = $('btnCoopCreate');
  if (create) create.addEventListener('click', createRoom);
  var join = $('btnCoopJoin');
  if (join) join.addEventListener('click', joinRoom);
  var start = $('btnCoopStart');
  if (start) start.addEventListener('click', startMission);
  var leave = $('btnCoopLeave');
  if (leave) leave.addEventListener('click', leaveCoop);
})();
