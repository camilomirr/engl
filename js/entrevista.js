// NVISION · Entrevista técnica simulada.
// El entrevistador hace preguntas de soporte y redes; la respuesta se
// evalúa buscando las ideas clave (palabras esenciales) y devuelve
// retroalimentación inmediata con la respuesta modelo al final.
(function () {
  'use strict';
  var log = document.getElementById('ent-log');
  if (!log) return;
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';
  var T = {
    es: { hi: 'Hola, soy el entrevistador de NVISION. Te haré ', qs: ' preguntas de soporte y redes. Responde con tus palabras, como en una entrevista real. ¡Empezamos!', good: 'Buena respuesta. ', mid: 'Respuesta parcial. ', bad: 'Le faltan ideas clave. ', model: 'Una respuesta modelo sería: ', end: 'Fin de la entrevista. Tu puntaje: ', of: ' de ', verdict1: 'Nivel listo para trabajar: respuestas claras y completas.', verdict2: 'Buen nivel: repasa las respuestas modelo y lo tendrás.', verdict3: 'A seguir practicando: revisa el glosario y la ruta de aprendizaje.', again: 'Practicar otra vez', startFirst: 'Pulsa «Comenzar entrevista» para empezar.', scoreLive: 'Puntaje parcial: ' },
    en: { hi: 'Hi, I am the NVISION interviewer. I will ask you ', qs: ' support and networking questions. Answer in your own words, like a real interview. Let us start!', good: 'Good answer. ', mid: 'Partial answer. ', bad: 'Key ideas are missing. ', model: 'A model answer would be: ', end: 'Interview over. Your score: ', of: ' of ', verdict1: 'Job-ready level: clear, complete answers.', verdict2: 'Good level: review the model answers and you will nail it.', verdict3: 'Keep practicing: check the glossary and the learning path.', again: 'Practice again', startFirst: 'Press "Start interview" to begin.', scoreLive: 'Partial score: ' }
  }[lang];
  /* Evaluación por IDEAS, no por palabras exactas (corregido
     2026-11-12, a petición de Camilo): antes cada respuesta se medía
     contra una lista corta de palabras técnicas y una respuesta
     natural ("apago y prendo el módem y miro si los demás tienen
     internet") salía con "Le faltan ideas clave" aunque estuviera
     bien. Ahora cada pregunta tiene GRUPOS de ideas y cada grupo
     acepta muchas formas de decir lo mismo: sinónimos, lenguaje
     cotidiano y la versión en inglés. La comparación ignora acentos
     y mayúsculas ("única" = "unica", "módem" = "modem"). */
  var BANK = [
    { q: { es: 'Un usuario dice que no tiene internet. ¿Qué revisas primero, paso a paso?', en: 'A user says they have no internet. What do you check first, step by step?' },
      groups: [
        ['un equipo', 'solo ese', 'solo su', 'solo un', 'solo a el', 'es solo', 'todos los equipos', 'todos se quedaron', 'toda la red', 'otros equipos', 'otro equipo', 'otros dispositivos', 'los demas', 'a todos les pasa', 'solo a esa persona', 'nadie tiene', 'one device', 'whole network', 'other devices', 'all devices'],
        ['cable', 'cables', 'luces', 'led', 'foquitos', 'bombillos', 'ethernet', 'conectado', 'enchuf', 'conexion fisica', 'lights', 'plugged', 'wiring'],
        ['router', 'modem', 'enrutador', 'aparato de internet', 'el aparato'],
        ['reinici', 'apag', 'prenderlo de nuevo', 'desconect', 'restart', 'reboot', 'turn it off', 'power cycle'],
        ['ip', 'ipconfig', 'direccion ip', 'puerta de enlace', 'gateway', 'dhcp'],
        ['ping', 'prueba', 'probar', 'comprobar', 'test', '8.8.8.8', 'google.com'],
        ['wifi', 'wi-fi', 'inalambric', 'senal', 'wireless'],
        ['proveedor', 'operador', 'compania de internet', 'isp', 'provider', 'falla en la zona', 'caida del servicio', 'outage', 'sin servicio en la zona']
      ],
      model: { es: 'Confirmar si afecta a un equipo o a toda la red, revisar cables y luces del router, reiniciarlo, comprobar la IP (ipconfig) y hacer ping a la puerta de enlace y a internet.', en: 'Check whether it affects one device or the whole network, inspect cables and router lights, restart it, verify the IP (ipconfig) and ping the gateway and the internet.' } },
    { q: { es: '¿Qué es una dirección IP y para qué sirve?', en: 'What is an IP address and what is it for?' },
      groups: [
        ['identifica', 'identificador', 'unica', 'unico', 'numero unico', 'unique', 'identify', 'identifier'],
        ['equipo', 'dispositivo', 'computador', 'pc', 'celular', 'aparato', 'device', 'computer', 'host'],
        ['red', 'network', 'lan', 'internet'],
        ['comunicar', 'comunicarse', 'comunicacion', 'encuentren', 'encontrar', 'conectarse', 'enviar', 'recibir', 'communicate', 'find each other', 'send', 'connect'],
        ['numero', 'direccion', 'como la direccion de una casa', 'address', 'number']
      ],
      model: { es: 'Es el identificador único de cada equipo dentro de una red; permite que los dispositivos se encuentren y se comuniquen entre sí.', en: 'It is the unique identifier of each device on a network; it lets devices find and communicate with each other.' } },
    { q: { es: 'La PC va muy lenta. ¿Qué causas de hardware revisarías?', en: 'The PC is very slow. Which hardware causes would you check?' },
      groups: [
        ['ram', 'memoria'],
        ['disco', 'hdd', 'ssd', 'almacenamiento', 'espacio', 'lleno', 'disk', 'storage'],
        ['temperatura', 'calent', 'sobrecalent', 'caliente', 'ventil', 'heat', 'overheat', 'temperature', 'fan'],
        ['polvo', 'sucio', 'suciedad', 'limpieza', 'dust', 'dirty'],
        ['cpu', 'procesador', 'procesos', 'programas abiertos', 'administrador de tareas', 'task manager', 'processes', 'processor', 'al 100', 'consumo'],
        ['fuente', 'power supply', 'energia']
      ],
      model: { es: 'RAM insuficiente o al 100%, disco HDD viejo o lleno (mejor SSD), sobrecalentamiento por polvo, y procesos que consumen CPU; se comprueba con el administrador de tareas y las temperaturas.', en: 'Not enough or maxed-out RAM, an old or full HDD (better an SSD), overheating from dust, and CPU-hungry processes; check with the task manager and temperatures.' } },
    { q: { es: '¿Para qué sirve el comando ping?', en: 'What is the ping command for?' },
      groups: [
        ['conectividad', 'conexion', 'conectado', 'llega', 'comunicacion', 'saber si responde', 'connectivity', 'connection', 'reachable'],
        ['icmp', 'paquetes', 'packets', 'envia', 'manda', 'echo', 'solicitud'],
        ['respuesta', 'responde', 'contesta', 'responder', 'reply', 'respond', 'response'],
        ['tiempo', 'tarda', 'tardanza', 'latencia', 'demora', 'milisegundos', 'time', 'latency', 'delay'],
        ['perdida', 'pierden', 'perdidos', 'loss', 'lost']
      ],
      model: { es: 'Para comprobar la conectividad con otro equipo: envía paquetes ICMP y muestra si responde, en cuánto tiempo y si se pierden paquetes.', en: 'To test connectivity with another host: it sends ICMP packets and shows whether it replies, how long it takes and whether packets are lost.' } },
    { q: { es: '¿Qué diferencia hay entre un switch y un router?', en: 'What is the difference between a switch and a router?' },
      groups: [
        ['misma red', 'red local', 'lan', 'dentro de la red', 'red interna', 'local network', 'same network'],
        ['switch', 'conmutador', 'conecta equipos', 'conecta los equipos', 'varios equipos', 'equipos entre si'],
        ['redes distintas', 'otras redes', 'diferentes redes', 'entre redes', 'redes diferentes', 'different networks', 'other networks'],
        ['internet', 'fuera', 'salida a internet', 'wan', 'salir']
      ],
      model: { es: 'El switch conecta equipos dentro de la misma red local (LAN); el router conecta redes distintas entre sí, por ejemplo tu LAN con internet.', en: 'A switch connects devices inside the same local network (LAN); a router connects different networks together, e.g. your LAN with the internet.' } },
    { q: { es: 'Un usuario recibió un correo sospechoso que pide su contraseña. ¿Qué le aconsejas?', en: 'A user got a suspicious email asking for their password. What do you advise?' },
      groups: [
        ['no hacer clic', 'no abrir', 'no abra', 'no entre', 'no dar clic', 'no pinchar', 'no tocar', 'no descargar', 'no descargue', 'do not click', "don't click", 'not open', 'no click'],
        ['no compartir', 'no dar la', 'no entregue', 'no escribir', 'no poner', 'nunca comparta', 'nunca de', 'contrasena', 'clave', 'datos personales', 'never share', 'not share', 'password'],
        ['phishing', 'fraude', 'estafa', 'sospechos', 'falso', 'engan', 'scam', 'fake', 'suspicious', 'suplantacion'],
        ['remitente', 'quien lo envio', 'de quien viene', 'direccion del correo', 'sender', 'enlace', 'url', 'link', 'verificar el correo'],
        ['reportar', 'reportarlo', 'reporte', 'borrar', 'eliminarlo', 'eliminar el correo', 'avisar', 'report', 'delete', 'avisara a sistemas', 'administrador']
      ],
      model: { es: 'Es phishing: no hacer clic ni descargar adjuntos, nunca compartir la contraseña, verificar el remitente, reportarlo y borrar el correo. Ninguna empresa seria pide contraseñas por correo.', en: 'It is phishing: do not click or download attachments, never share the password, check the sender, report it and delete the email. No serious company asks for passwords by email.' } },
    { q: { es: '¿Qué es una copia de seguridad y cada cuánto recomiendas hacerla?', en: 'What is a backup and how often do you recommend making one?' },
      groups: [
        ['copia', 'respaldo', 'backup', 'resguardo', 'copia de seguridad', 'otra copia', 'copy'],
        ['datos', 'archivos', 'informacion', 'documentos', 'fotos', 'files', 'data'],
        ['externo', 'otro lugar', 'nube', 'cloud', 'usb', 'otro disco', 'disco externo', 'external', 'pendrive', 'servidor', 'drive'],
        ['recuperar', 'restaurar', 'se pierde', 'se pierda', 'perder', 'falla', 'se dana', 'se borra', 'recover', 'restore', 'lose', 'fails'],
        ['semana', 'diario', 'periodica', 'periodicamente', 'seguido', 'automatica', 'regular', 'cada dia', 'cada semana', 'frecuencia', 'week', 'daily', 'regularly', 'automatic']
      ],
      model: { es: 'Es una copia de los datos en otro lugar (disco externo o nube) para recuperarlos si el equipo falla o se pierde; se recomienda periódica, por ejemplo semanal, y automática si es posible.', en: 'It is a copy of your data somewhere else (external drive or cloud) to recover it if the device fails or is lost; it should be regular, e.g. weekly, and automatic if possible.' } }
  ];
  var i = -1, score = 0, running = false;
  var input = document.getElementById('ent-input');
  var scoreBox = document.getElementById('ent-score');

  function say(text, who) {
    var d = document.createElement('div');
    d.className = 'ent-msg ' + who;
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }
  function ask() {
    i++;
    if (i >= BANK.length) return finish();
    say('(' + (i + 1) + '/' + BANK.length + ') ' + BANK[i].q[lang], 'bot');
    input.focus();
  }
  function finish() {
    running = false;
    var max = BANK.length * 2;
    var verdict = score >= max * 0.8 ? T.verdict1 : score >= max * 0.45 ? T.verdict2 : T.verdict3;
    say(T.end + score + T.of + max + '. ' + verdict, 'bot');
    scoreBox.textContent = '';
    document.getElementById('ent-start').textContent = T.again;
  }
  document.getElementById('ent-start').addEventListener('click', function () {
    log.innerHTML = ''; i = -1; score = 0; running = true;
    say(T.hi + BANK.length + T.qs, 'bot');
    ask();
  });
  document.getElementById('ent-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    if (!running) { say(T.startFirst, 'bot'); return; }
    say(text, 'me');
    input.value = '';
    var item = BANK[i];
    // Sin acentos ni mayúsculas: "unica", "ÚNICA" y "única" cuentan igual.
    var low = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Cuenta IDEAS tocadas: un grupo suma si aparece cualquiera de
    // sus variantes; repetir la misma idea con otras palabras no
    // infla el puntaje.
    var hits = item.groups.filter(function (g) {
      return g.some(function (k) { return low.indexOf(k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) !== -1; });
    }).length;
    var ratio = hits / item.groups.length;
    // Nota más justa con respuestas naturales: tocar la mitad de
    // las ideas ya es buena respuesta; con una idea ya suma.
    var pts = ratio >= 0.5 ? 2 : ratio >= 0.2 ? 1 : 0;
    score += pts;
    var fb = (pts === 2 ? T.good : pts === 1 ? T.mid : T.bad) + T.model + item.model[lang];
    say(fb, 'bot');
    scoreBox.textContent = T.scoreLive + score;
    setTimeout(ask, 350);
  });
  say(T.startFirst, 'bot');
})();
