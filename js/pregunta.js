// NVISION - Pregunta del día + racha de estudio.
// Una pregunta por día (determinista por fecha) del banco de abajo.
// El progreso vive en nvision_racha_v1 y se sincroniza con la cuenta.
(function () {
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var T = {
    es: { title: 'Pregunta del día', streak: 'días de racha', total: 'respondidas en total', correct: '¡Correcto!', wrong: 'Casi… la respuesta era:', done: 'Ya respondiste la de hoy. Vuelve mañana para mantener tu racha.', come: 'Vuelve mañana por otra pregunta.' },
    en: { title: 'Question of the day', streak: 'day streak', total: 'answered in total', correct: 'Correct!', wrong: 'Close… the answer was:', done: 'You already answered today. Come back tomorrow to keep your streak.', come: 'Come back tomorrow for another question.' }
  }[lang];

  function Q(topic, qEs, qEn, oEs, oEn, a, wEs, wEn) { return { t: topic, q: { es: qEs, en: qEn }, o: { es: oEs, en: oEn }, a: a, why: { es: wEs, en: wEn } }; }
  var POOL = [
    Q('Hardware', '¿Qué componente guarda los datos aunque se apague el PC?', 'Which component keeps data when the PC is off?', ['La RAM', 'El disco SSD/HDD', 'La caché L1', 'El registro'], ['RAM', 'The SSD/HDD drive', 'L1 cache', 'The register'], 1, 'El almacenamiento es no volátil; RAM y caché se borran sin energía.', 'Storage is non-volatile; RAM and cache are erased without power.'),
    Q('Hardware', '¿Qué unidad se usa para la velocidad de un procesador?', 'Which unit measures processor speed?', ['Vatios', 'Hercios (GHz)', 'Bytes', 'Voltios'], ['Watts', 'Hertz (GHz)', 'Bytes', 'Volts'], 1, 'La frecuencia de reloj se mide en hercios.', 'Clock frequency is measured in hertz.'),
    Q('Redes', '¿Cuántos bits tiene una dirección IPv4?', 'How many bits does an IPv4 address have?', ['32', '64', '128', '16'], ['32', '64', '128', '16'], 0, 'IPv4 = 4 octetos de 8 bits = 32.', 'IPv4 = 4 octets of 8 bits = 32.'),
    Q('Redes', '¿Qué hace un switch con una trama cuyo destino no conoce?', 'What does a switch do with a frame whose destination is unknown?', ['La descarta', 'La envía por todos los puertos (flooding)', 'La guarda para siempre', 'La convierte en IP'], ['It drops it', 'It sends it out of all ports (flooding)', 'It stores it forever', 'It converts it to IP'], 1, 'Sin entrada en su tabla MAC, el switch hace flooding.', 'Without a MAC table entry, the switch floods the frame.'),
    Q('Redes', 'En la norma T568B, ¿qué color va en el pin 1?', 'In the T568B standard, which color goes on pin 1?', ['Blanco-verde', 'Blanco-naranja', 'Azul', 'Blanco-marrón'], ['White-green', 'White-orange', 'Blue', 'White-brown'], 1, 'T568B empieza con el par naranja: blanco-naranja, naranja…', 'T568B starts with the orange pair: white-orange, orange…'),
    Q('WiFi', '¿Qué banda WiFi suele dar más velocidad a corta distancia?', 'Which WiFi band usually gives more speed at short range?', ['2.4 GHz', '5 GHz', '900 MHz', 'FM'], ['2.4 GHz', '5 GHz', '900 MHz', 'FM'], 1, '5 GHz: más velocidad, menos alcance que 2.4 GHz.', '5 GHz: more speed, less range than 2.4 GHz.'),
    Q('Mantenimiento', '¿Qué herramienta de Windows revisa errores del disco?', 'Which Windows tool checks disk errors?', ['CHKDSK', 'Regedit', 'Paint', 'Bloc de notas'], ['CHKDSK', 'Regedit', 'Paint', 'Notepad'], 0, 'CHKDSK escanea y repara el sistema de archivos.', 'CHKDSK scans and repairs the file system.'),
    Q('Seguridad', '¿Qué es el phishing?', 'What is phishing?', ['Un antivirus', 'Suplantar a alguien para robar datos', 'Un tipo de cable', 'Comprimir archivos'], ['An antivirus', 'Impersonating someone to steal data', 'A cable type', 'Compressing files'], 1, 'Correos o páginas falsas que imitan a bancos y servicios.', 'Fake emails or pages imitating banks and services.'),
    Q('Hardware', '¿Qué memoria es la más rápida y cercana a la CPU?', 'Which memory is fastest and closest to the CPU?', ['La caché', 'El SSD', 'La RAM', 'La nube'], ['Cache', 'The SSD', 'RAM', 'The cloud'], 0, 'La caché (L1/L2/L3) vive dentro o junto al procesador.', 'Cache (L1/L2/L3) lives inside or next to the processor.'),
    Q('Redes', '¿Qué protocolo asigna direcciones IP automáticamente?', 'Which protocol assigns IP addresses automatically?', ['DNS', 'DHCP', 'FTP', 'SMTP'], ['DNS', 'DHCP', 'FTP', 'SMTP'], 1, 'DHCP entrega IP, máscara, puerta de enlace y DNS.', 'DHCP hands out IP, mask, gateway and DNS.'),
    Q('Redes', '¿Para qué sirve el comando ping?', 'What is the ping command for?', ['Para comprobar si otro equipo responde en la red', 'Para borrar archivos', 'Para subir la velocidad de la RAM', 'Para cambiar la contraseña del WiFi'], ['To check if another host answers on the network', 'To delete files', 'To speed up RAM', 'To change the WiFi password'], 0, 'Ping envía paquetes ICMP de eco y mide la respuesta.', 'Ping sends ICMP echo packets and measures the reply.')
  ];
  POOL.push(
    Q('Mantenimiento', '¿Qué atajo abre el Administrador de tareas?', 'Which shortcut opens Task Manager?', ['Ctrl+Mayús+Esc', 'Alt+F4', 'Win+L', 'Ctrl+P'], ['Ctrl+Shift+Esc', 'Alt+F4', 'Win+L', 'Ctrl+P'], 0, 'Ctrl+Mayús+Esc lo abre directo.', 'Ctrl+Shift+Esc opens it directly.'),
    Q('WiFi', '¿Qué es el SSID?', 'What is the SSID?', ['La contraseña del WiFi', 'El nombre de la red WiFi', 'El canal', 'La antena'], ['The WiFi password', 'The WiFi network name', 'The channel', 'The antenna'], 1, 'El SSID es el nombre visible de la red.', 'The SSID is the visible network name.'),
    Q('Seguridad', '¿Qué hace la verificación en dos pasos (2FA)?', 'What does two-factor authentication (2FA) do?', ['Duplica la contraseña', 'Pide un segundo código además de la contraseña', 'Borra la cuenta', 'Acelera el inicio de sesión'], ['It duplicates the password', 'It asks for a second code besides the password', 'It deletes the account', 'It speeds up login'], 1, 'Aunque roben tu contraseña, sin el segundo factor no entran.', 'Even if your password is stolen, without the second factor they cannot get in.'),
    Q('Hardware', '¿Qué conector de video es el más común hoy en monitores y TV?', 'Which video connector is most common today on monitors and TVs?', ['VGA', 'HDMI', 'PS/2', 'Serie'], ['VGA', 'HDMI', 'PS/2', 'Serial'], 1, 'HDMI lleva video y audio digital en un solo cable.', 'HDMI carries digital video and audio in one cable.'),
    Q('Redes', '¿Cuántos hilos tiene un cable de red UTP?', 'How many wires does a UTP network cable have?', ['4', '6', '8', '12'], ['4', '6', '8', '12'], 2, 'Son 4 pares trenzados = 8 hilos.', 'Four twisted pairs = 8 wires.'),
    Q('Mantenimiento', '¿Cada cuánto conviene hacer copia de seguridad de lo importante?', 'How often should you back up important files?', ['Nunca', 'Solo cuando el PC falla', 'Periódicamente, antes de que algo falle', 'Una vez al comprar el PC'], ['Never', 'Only when the PC fails', 'Regularly, before anything fails', 'Once when buying the PC'], 2, 'La copia sirve solo si existe ANTES del problema.', 'A backup only helps if it exists BEFORE the problem.'),
    Q('Seguridad', '¿Cuál contraseña es más segura?', 'Which password is stronger?', ['duay123', 'Tu fecha de cumpleaños', 'Una frase larga con números y símbolos', 'La misma de siempre'], ['duay123', 'Your birthday', 'A long phrase with numbers and symbols', 'The same one as always'], 2, 'La longitud y la variedad la hacen difícil de adivinar.', 'Length and variety make it hard to guess.'),
    Q('WiFi', '¿Qué puede bajar mucho la velocidad de tu WiFi?', 'What can lower your WiFi speed a lot?', ['Paredes gruesas y distancia', 'El color del router', 'El nombre de la red', 'Tener muchos contactos'], ['Thick walls and distance', 'The router color', 'The network name', 'Having many contacts'], 0, 'Los obstáculos y la distancia atenúan la señal.', 'Obstacles and distance weaken the signal.'),
    Q('Hardware', '¿Qué hace la fuente de poder (PSU)?', 'What does the power supply (PSU) do?', ['Enfría la CPU', 'Convierte la corriente y alimenta los componentes', 'Guarda los juegos', 'Conecta el internet'], ['It cools the CPU', 'It converts power and feeds the components', 'It stores games', 'It connects the internet'], 1, 'Convierte la corriente alterna en los voltajes que usa el PC.', 'It converts AC into the voltages the PC uses.')
  );

  var KEY = 'nvision_racha_v1';
  function load() { try { var p = JSON.parse(localStorage.getItem(KEY) || 'null'); if (p && p.days) return p; } catch (e) {} return { days: {}, total: 0, updatedAt: null }; }
  function save(st) { st.updatedAt = new Date().toISOString(); try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function dayStr(d) { return d.toISOString().slice(0, 10); }
  function streakOf(st) {
    var n = 0; var d = new Date();
    if (!st.days[dayStr(d)]) d.setDate(d.getDate() - 1); // hoy aún sin responder: la racha cuenta hasta ayer
    while (st.days[dayStr(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  var box = document.getElementById('pregunta-dia');
  if (!box) return;
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var doy = Math.floor((now - start) / 86400000);
  var q = POOL[doy % POOL.length];
  var st = load();
  var today = dayStr(now);
  var answered = !!st.days[today];

  var head = document.createElement('div');
  head.className = 'pd-head';
  head.innerHTML = '<span class="pd-chip"></span><span class="pd-streak"></span>';
  head.querySelector('.pd-chip').textContent = q.t;
  head.querySelector('.pd-streak').textContent = '🔥 ' + streakOf(st) + ' ' + T.streak + ' · ' + st.total + ' ' + T.total;
  var h = document.createElement('h3'); h.textContent = q.q[lang];
  box.append(head, h);

  var opts = document.createElement('div');
  opts.className = 'pd-opts';
  q.o[lang].forEach(function (opt, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'pd-opt'; b.textContent = opt;
    if (answered) { b.disabled = true; if (i === q.a) b.classList.add('is-correct'); }
    b.addEventListener('click', function () {
      if (st.days[today]) return;
      st.days[today] = (i === q.a) ? 1 : -1;
      st.total = (st.total || 0) + 1;
      save(st);
      opts.querySelectorAll('.pd-opt').forEach(function (x, xi) {
        x.disabled = true;
        if (xi === q.a) x.classList.add('is-correct');
        else if (xi === i) x.classList.add('is-wrong');
      });
      var msg = document.createElement('p');
      msg.className = 'pd-msg';
      msg.textContent = (i === q.a ? T.correct + ' ' : T.wrong + ' "' + q.o[lang][q.a] + '". ') + q.why[lang] + ' ' + T.come;
      box.appendChild(msg);
      head.querySelector('.pd-streak').textContent = '🔥 ' + streakOf(st) + ' ' + T.streak + ' · ' + st.total + ' ' + T.total;
    });
    opts.appendChild(b);
  });
  box.appendChild(opts);
  if (answered) {
    var note = document.createElement('p');
    note.className = 'pd-msg';
    note.textContent = T.done + ' ' + q.why[lang];
    box.appendChild(note);
  }
})();
