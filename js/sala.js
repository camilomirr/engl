// NVISION · Quiz en vivo con código de sala.
// Usa la sala en vivo del sitio (Supabase: game_state id=1 + live_players,
// la misma infraestructura del Redes Challenge). El anfitrión crea la
// sala y avanza las preguntas; los jugadores se unen con el código y
// responden desde su dispositivo. Sin Realtime: sondeo cada ~1.8 s.
// PUNTOS: 10 por acierto (máximo 80). La base de datos limita live_players
// a 150 puntos (restricción live_players_points_rng de validacion.sql),
// así que 100 por acierto era imposible: el segundo acierto se rechazaba
// y todos quedaban en 100 en el podio. Si el dueño corre
// supabase/sala-puntos.sql (límite 800), se puede volver a 100.
(function () {
  'use strict';
  var home = document.getElementById('sala-home');
  if (!home) return;
  var API = 'https://xiuztrujrwdgcpjrruxu.supabase.co/rest/v1';
  var KEY = window.NVISION_SUPABASE_ANON_KEY;
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var T = {
    es: { wait: 'Esperando a que el anfitrión inicie…', playing: 'En juego · pregunta ', of: ' de ', finished: '¡Fin del quiz!', lobby: 'En el lobby', players: 'Jugadores', youHost: 'Eres el anfitrión: cuando estén todos, pulsa «Iniciar el quiz».', correct: '¡Correcto! +10', wrong: 'Incorrecto', answered: 'Respuesta registrada. Espera la siguiente pregunta…', noRoom: 'Esa sala no está activa. Revisa el código.', started: 'El quiz ya empezó; espera la próxima sala.', needName: 'Escribe tu nombre para unirte.', badCode: 'El código son 4 letras.', roomGone: 'La sala terminó o el anfitrión la cerró.', podium: 'Podio final', pts: 'pts', q: 'Pregunta', next: 'Siguiente pregunta', podiumBtn: 'Ver el podio' },
    en: { wait: 'Waiting for the host to start…', playing: 'Playing · question ', of: ' of ', finished: 'Quiz over!', lobby: 'In the lobby', players: 'Players', youHost: 'You are the host: when everyone is in, press "Start the quiz".', correct: 'Correct! +10', wrong: 'Wrong', answered: 'Answer saved. Wait for the next question…', noRoom: 'That room is not active. Check the code.', started: 'The quiz already started; wait for the next room.', needName: 'Type your name to join.', badCode: 'The code is 4 letters.', roomGone: 'The room ended or the host closed it.', podium: 'Final podium', pts: 'pts', q: 'Question', next: 'Next question', podiumBtn: 'See the podium' }
  }[lang];
  var BANK = [
    { q: { es: '¿Qué dispositivo conecta varias redes y decide la mejor ruta?', en: 'Which device connects several networks and picks the best route?' }, o: [{ es: 'Switch', en: 'Switch' }, { es: 'Router', en: 'Router' }, { es: 'Hub', en: 'Hub' }, { es: 'Módem USB', en: 'USB modem' }], a: 1 },
    { q: { es: '¿Cuántos bits tiene una dirección IPv4?', en: 'How many bits does an IPv4 address have?' }, o: [{ es: '16', en: '16' }, { es: '64', en: '64' }, { es: '32', en: '32' }, { es: '128', en: '128' }], a: 2 },
    { q: { es: '¿Qué memoria pierde su contenido al apagar el equipo?', en: 'Which memory loses its content when the PC turns off?' }, o: [{ es: 'ROM', en: 'ROM' }, { es: 'SSD', en: 'SSD' }, { es: 'RAM', en: 'RAM' }, { es: 'Caché de disco', en: 'Disk cache' }], a: 2 },
    { q: { es: '¿Qué comando comprueba la conectividad con otro equipo?', en: 'Which command checks connectivity with another host?' }, o: [{ es: 'ipconfig', en: 'ipconfig' }, { es: 'ping', en: 'ping' }, { es: 'format', en: 'format' }, { es: 'mkdir', en: 'mkdir' }], a: 1 },
    { q: { es: '¿Qué pieza convierte la corriente alterna en continua para el PC?', en: 'Which part turns AC into DC power for the PC?' }, o: [{ es: 'La fuente de poder', en: 'The power supply' }, { es: 'El disipador', en: 'The heatsink' }, { es: 'La tarjeta de red', en: 'The network card' }, { es: 'El chipset', en: 'The chipset' }], a: 0 },
    { q: { es: 'En el estándar T568B, ¿qué color va en el pin 1?', en: 'In the T568B standard, which color goes on pin 1?' }, o: [{ es: 'Verde sólido', en: 'Solid green' }, { es: 'Naranja sólido', en: 'Solid orange' }, { es: 'Blanco-naranja', en: 'White-orange' }, { es: 'Blanco-verde', en: 'White-green' }], a: 2 },
    { q: { es: '¿Qué es un phishing?', en: 'What is phishing?' }, o: [{ es: 'Un tipo de cable', en: 'A type of cable' }, { es: 'Un engaño para robar credenciales', en: 'A scam to steal credentials' }, { es: 'Un antivirus', en: 'An antivirus' }, { es: 'Un protocolo de red', en: 'A network protocol' }], a: 1 },
    { q: { es: '¿Qué almacena el SSD que la RAM no?', en: 'What does the SSD store that RAM does not?' }, o: [{ es: 'Datos permanentes', en: 'Permanent data' }, { es: 'Instrucciones de arranque', en: 'Boot instructions' }, { es: 'La hora del sistema', en: 'The system clock' }, { es: 'Nada, son iguales', en: 'Nothing, they are the same' }], a: 0 }
  ];

  var role = null, code = '', myId = null, myPoints = 0, timer = null, answeredFor = -1, lastQ = -1, playersCache = [];
  var $ = function (id) { return document.getElementById(id); };
  var msg = $('sala-msg');

  function req(method, path, body) {
    return fetch(API + path, {
      method: method,
      headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json().catch(function () { return []; }); });
  }
  function patchState(patch) { return req('PATCH', '/game_state?id=eq.1', patch); }
  function genCode() { var c = 'ABCDEFGHJKMNPQRSTUVWXYZ', s = ''; for (var i = 0; i < 4; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
  function cleanName(n) { return window.NVISION_validate ? window.NVISION_validate.cleanName(n, 24) : String(n || '').slice(0, 24); }

  function enterRoom() {
    home.hidden = true;
    $('sala-room').hidden = false;
    $('sala-hostbar').hidden = role !== 'host';
    $('sala-code-out').textContent = code;
    poll();
    timer = setInterval(poll, 1800);
  }
  function leave() {
    if (timer) clearInterval(timer); timer = null;
    role = null; myId = null; myPoints = 0; answeredFor = -1; lastQ = -1;
    $('sala-room').hidden = true; home.hidden = false;
  }
  $('sala-leave').addEventListener('click', leave);

  $('sala-create').addEventListener('click', function () {
    if (!KEY) { msg.textContent = 'Supabase no está disponible en este momento.'; return; }
    code = genCode();
    req('GET', '/game_state?id=eq.1&select=session_id').then(function (rows) {
      var old = rows && rows[0] && rows[0].session_id;
      var clean = old ? req('DELETE', '/live_players?session_id=eq.' + encodeURIComponent(old)) : Promise.resolve();
      return clean.then(function () { return patchState({ status: 'lobby', session_id: code, current_question: 0, started_at: null }); });
    }).then(function () { role = 'host'; enterRoom(); })
      .catch(function () { msg.textContent = 'No se pudo crear la sala. Inténtalo de nuevo.'; });
  });

  $('sala-join').addEventListener('click', function () {
    var c = ($('sala-code-in').value || '').toUpperCase().trim();
    var name = cleanName($('sala-name-in').value || '');
    if (!/^[A-Z]{4}$/.test(c)) { msg.textContent = T.badCode; return; }
    if (!name) { msg.textContent = T.needName; return; }
    req('GET', '/game_state?id=eq.1&select=*').then(function (rows) {
      var gs = rows && rows[0];
      if (!gs || gs.session_id !== c) { msg.textContent = T.noRoom; return; }
      if (gs.status !== 'lobby') { msg.textContent = T.started; return; }
      return req('POST', '/live_players', { session_id: c, name: name, points: 0 }).then(function (rows2) {
        myId = rows2 && rows2[0] && rows2[0].id;
        code = c; role = 'player'; enterRoom();
      });
    }).catch(function () { msg.textContent = 'No se pudo unir. Revisa tu conexión.'; });
  });

  $('sala-start').addEventListener('click', function () {
    patchState({ status: 'playing', current_question: 0, started_at: new Date().toISOString() }).then(poll);
  });
  $('sala-next').addEventListener('click', function () {
    req('GET', '/game_state?id=eq.1&select=current_question').then(function (rows) {
      var q = rows && rows[0] ? rows[0].current_question : 0;
      if (q + 1 >= BANK.length) return patchState({ status: 'finished' }).then(poll);
      return patchState({ current_question: q + 1 }).then(poll);
    }).catch(function () {});
  });
  $('sala-end').addEventListener('click', function () {
    req('DELETE', '/live_players?session_id=eq.' + encodeURIComponent(code))
      .then(function () { return patchState({ status: 'lobby', session_id: '', current_question: 0, started_at: null }); })
      .catch(function () {})
      .then(leave);
  });

  function renderPlayers() {
    var box = $('sala-players');
    box.innerHTML = '<strong>' + T.players + ' (' + playersCache.length + ')</strong>';
    playersCache.forEach(function (p) {
      var chip = document.createElement('span');
      chip.className = 'sala-chip' + (myId && p.id === myId ? ' me' : '');
      chip.textContent = p.name + ' · ' + (parseInt(p.points, 10) || 0) + ' ' + T.pts;
      box.appendChild(chip);
    });
  }

  function renderQuestion(qi, gs) {
    var stage = $('sala-stage');
    var item = BANK[qi];
    if (!item) return;
    stage.innerHTML = '';
    var h = document.createElement('h3');
    h.textContent = T.q + ' ' + (qi + 1) + '/' + BANK.length + ' — ' + item.q[lang];
    stage.appendChild(h);
    var grid = document.createElement('div'); grid.className = 'sala-opts';
    item.o.forEach(function (op, oi) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'sala-opt'; b.textContent = op[lang];
      if (role === 'host') { if (oi === item.a) b.classList.add('is-correct'); b.disabled = true; }
      else {
        if (answeredFor === qi) { b.disabled = true; if (oi === item.a) b.classList.add('is-correct'); }
        b.addEventListener('click', function () {
          if (answeredFor === qi || !myId) return;
          answeredFor = qi;
          var good = oi === item.a;
          if (good) {
            myPoints += 10;
            req('PATCH', '/live_players?id=eq.' + myId, { points: myPoints }).catch(function () {
              // Si la base rechaza el puntaje, el total local no debe mentir:
              // se revierte para que el siguiente acierto no parta de un total falso.
              myPoints -= 10;
            });
          }
          grid.querySelectorAll('.sala-opt').forEach(function (x, xi) { x.disabled = true; if (xi === item.a) x.classList.add('is-correct'); else if (x === b) x.classList.add('is-wrong'); });
          var note = document.createElement('p');
          note.className = 'sala-note-line';
          note.textContent = good ? T.correct : T.wrong + ' — ' + T.answered;
          stage.appendChild(note);
          renderPlayersSoon();
        });
      }
      grid.appendChild(b);
    });
    stage.appendChild(grid);
  }
  function renderPlayersSoon() { setTimeout(poll, 500); }

  function poll() {
    if (!code) return;
    req('GET', '/game_state?id=eq.1&select=*').then(function (rows) {
      var gs = rows && rows[0];
      if (!gs || gs.session_id !== code) { leave(); if (msg) msg.textContent = T.roomGone; return; }
      return req('GET', '/live_players?session_id=eq.' + encodeURIComponent(code) + '&select=id,name,points&order=points.desc,created_at.asc&limit=30').then(function (ps) {
        playersCache = ps || [];
        renderPlayers();
        var st = $('sala-status'), stage = $('sala-stage');
        if (gs.status === 'lobby') {
          st.textContent = '· ' + T.lobby;
          stage.innerHTML = '<p>' + (role === 'host' ? T.youHost : T.wait) + '</p>';
          lastQ = -1;
          var sb = $('sala-start'); if (sb) sb.hidden = false;
          var nb = $('sala-next'); if (nb) nb.hidden = true;
        } else if (gs.status === 'playing') {
          st.textContent = '· ' + T.playing + (gs.current_question + 1) + T.of + BANK.length;
          if (gs.current_question !== lastQ) { lastQ = gs.current_question; renderQuestion(gs.current_question, gs); }
          var sb2 = $('sala-start'); if (sb2) sb2.hidden = true;
          var nb2 = $('sala-next'); if (nb2) { nb2.hidden = role !== 'host'; nb2.textContent = gs.current_question + 1 >= BANK.length ? T.podiumBtn : T.next; }
        } else if (gs.status === 'finished') {
          st.textContent = '· ' + T.finished;
          stage.innerHTML = '';
          var h = document.createElement('h3'); h.textContent = T.podium; stage.appendChild(h);
          var ol = document.createElement('ol'); ol.className = 'sala-podium';
          playersCache.slice(0, 5).forEach(function (p) { var li = document.createElement('li'); li.textContent = p.name + ' — ' + (parseInt(p.points, 10) || 0) + ' ' + T.pts; ol.appendChild(li); });
          stage.appendChild(ol);
          var nb3 = $('sala-next'); if (nb3) nb3.hidden = true;
        }
      });
    }).catch(function () {});
  }
})();
