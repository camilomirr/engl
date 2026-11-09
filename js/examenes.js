// NVISION - Exámenes y certificados.
// Resultados en localStorage: nvision_examenes_v1 { results: { examenId: { best, passed, last, date } }, updatedAt }
(function () {
  'use strict';

  var KEY = 'nvision_examenes_v1';

  // Regla del sitio: para presentar un examen y descargar el certificado
  // hay que tener una cuenta REAL. No basta con que exista una sesión
  // guardada: antes de abrir el examen y antes de entregar el certificado
  // se le pregunta a Supabase si el token de la sesión es de verdad
  // (una sesión inventada a mano la rechaza el servidor).
  var SESSION_KEY = 'nvision_session_v1';
  var VERIFIED_KEY = 'nvision_verified_v1';
  var SUPABASE_URL = 'https://xiuztrujrwdgcpjrruxu.supabase.co';
  var ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdXp0cnVqcndkZ2NwanJydXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNTk2ODcsImV4cCI6MjEwOTYzNTY4N30.CBBQpCqHxuOtCaMcdUfIrKTa4vt0QJRqvivskHnt5g0';

  function readSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { return null; }
  }
  function hasSession() {
    var s = readSession();
    return !!(s && ((s.access && s.exp > Date.now()) || s.refresh));
  }
  function clearSession() { try { localStorage.removeItem(SESSION_KEY); } catch (e) {} }
  function readVerified() {
    try { return JSON.parse(sessionStorage.getItem(VERIFIED_KEY) || 'null'); } catch (e) { return null; }
  }
  function markVerified(uid, access) {
    try { sessionStorage.setItem(VERIFIED_KEY, JSON.stringify({ uid: uid, tok: String(access || '').slice(36, 60), at: Date.now() })); } catch (e) {}
  }
  function sbAuth(path, opts) {
    opts = opts || {};
    var headers = { 'apikey': ANON_KEY, 'Content-Type': 'application/json' };
    if (opts.token) headers['Authorization'] = 'Bearer ' + opts.token;
    return fetch(SUPABASE_URL + path, { method: opts.method || 'GET', headers: headers, body: opts.body ? JSON.stringify(opts.body) : undefined })
      .then(function (r) { return r.text().then(function (t) { var d = null; try { d = t ? JSON.parse(t) : null; } catch (e) {} return { status: r.status, data: d }; }); });
  }
  function saveSessionFromAuth(data, email) {
    var s = {
      access: data.access_token,
      refresh: data.refresh_token,
      exp: Date.now() + (data.expires_in || 3600) * 1000,
      userId: data.user && data.user.id,
      email: (data.user && data.user.email) || email,
      avatar: (data.user && data.user.user_metadata && data.user.user_metadata.avatar) || null,
      avatarImg: (data.user && data.user.user_metadata && data.user.user_metadata.avatar_image) || null
    };
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch (e) {}
    return s;
  }
  function verifySession() {
    var s = readSession();
    if (!s) return Promise.resolve(false);
    var v = readVerified();
    if (v && (Date.now() - v.at) < 10 * 60 * 1000 && s.access && String(s.access).slice(36, 60) === v.tok && (!s.userId || s.userId === v.uid)) {
      return Promise.resolve(true);
    }
    var tryRefresh = function () {
      if (!s.refresh) return Promise.resolve(false);
      return sbAuth('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: s.refresh } })
        .then(function (r) {
          if (r.status === 200 && r.data && r.data.access_token && r.data.user) {
            saveSessionFromAuth(r.data, s.email);
            markVerified(r.data.user.id, r.data.access_token);
            return true;
          }
          if (r.status === 400 || r.status === 401) clearSession();
          return false;
        })
        .catch(function () { return false; });
    };
    if (!s.access) return tryRefresh();
    return sbAuth('/auth/v1/user', { token: s.access })
      .then(function (r) {
        if (r.status === 200 && r.data && r.data.id) { markVerified(r.data.id, s.access); return true; }
        if (r.status === 401) return tryRefresh();
        return false;
      })
      .catch(function () { return tryRefresh(); });
  }
  var verifying = false;
  function requestStart(exam, btn) {
    if (verifying) return;
    verifying = true;
    var oldText = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = T.verifying; }
    verifySession().then(function (ok) {
      verifying = false;
      renderCards();
      if (ok) openExam(exam);
      else showGate();
    });
  }
  function showGate() {
    var b = document.getElementById('exam-gate-banner');
    if (!b) return;
    b.hidden = false;
    b.classList.remove('pulse');
    void b.offsetWidth;
    b.classList.add('pulse');
    b.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  var PASS = 70;
  var lang = (localStorage.getItem('user_lang') || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';

  var T = {
    es: { questions: 'preguntas', best: 'Mejor nota', none: 'Sin intentos aún', start: 'Empezar examen', passed: 'APROBADO', q: 'Pregunta', scoreMsg: 'Tu nota', passMsg: '¡Felicidades! Aprobaste el examen.', failMsg: 'Aún no llegas al 70%. Repasa el tema e inténtalo otra vez.', why: 'Explicación:', certFor: 'Por aprobar el examen de', certTitle: 'CERTIFICADO', certGiven: 'Se otorga a', certScore: 'con una nota de', team: 'Equipo NVISION', certBtnAlert: 'Escribe tu nombre completo para generar el certificado.', verifying: 'Verificando tu cuenta…' },
    en: { questions: 'questions', best: 'Best score', none: 'No attempts yet', start: 'Start exam', passed: 'PASSED', q: 'Question', scoreMsg: 'Your score', passMsg: 'Congratulations! You passed the exam.', failMsg: 'Not at 70% yet. Review the topic and try again.', why: 'Explanation:', certFor: 'For passing the', certTitle: 'CERTIFICATE', certGiven: 'Awarded to', certScore: 'with a score of', team: 'NVISION Team', certBtnAlert: 'Type your full name to generate the certificate.', verifying: 'Verifying your account…' }
  }[lang];

  function Q(qEs, qEn, oEs, oEn, a, wEs, wEn) { return { q: { es: qEs, en: qEn }, o: { es: oEs, en: oEn }, a: a, why: { es: wEs, en: wEn } }; }

  // Iconos SVG diseñados a medida para NVISION (sin emojis): mismo lenguaje
  // de trazo del resto del sitio (viewBox 24, stroke currentColor, ancho 2).
  // Hardware: monitor con el chip dentro. Redes: tres nodos unidos.
  // Mantenimiento: llave inglesa. WiFi: ondas de señal.
  var SVG_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var ICONS = {
    hardware: '<svg ' + SVG_ATTRS + '><rect x="2" y="4" width="20" height="12" rx="2"/><rect x="10" y="8" width="4" height="4" rx="0.5"/><line x1="11" y1="8" x2="11" y2="6.8"/><line x1="13" y1="8" x2="13" y2="6.8"/><line x1="11" y1="12" x2="11" y2="13.2"/><line x1="13" y1="12" x2="13" y2="13.2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="16" x2="12" y2="21"/></svg>',
    redes: '<svg ' + SVG_ATTRS + '><circle cx="12" cy="5" r="2.4"/><circle cx="5" cy="19" r="2.4"/><circle cx="19" cy="19" r="2.4"/><line x1="10.6" y1="6.9" x2="6.4" y2="17.1"/><line x1="13.4" y1="6.9" x2="17.6" y2="17.1"/><line x1="7.4" y1="19" x2="16.6" y2="19"/></svg>',
    mantenimiento: '<svg ' + SVG_ATTRS + '><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    wifi: '<svg ' + SVG_ATTRS + '><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>'
  };

  var EXAMS = [
    {
      id: 'hardware', icon: ICONS.hardware,
      name: { es: 'Hardware', en: 'Hardware' },
      desc: { es: 'Componentes del computador y su función.', en: 'Computer parts and what they do.' },
      questions: [
        Q('¿Cuál componente es considerado el "cerebro" del computador?',
          'Which component is considered the "brain" of the computer?',
          ['La memoria RAM', 'El procesador (CPU)', 'El disco SSD', 'La tarjeta de video'], ['RAM memory', 'The processor (CPU)', 'The SSD drive', 'The video card'], 1,
          'La CPU ejecuta las instrucciones y hace los cálculos de todo el sistema.', 'The CPU runs the instructions and performs all the system calculations.'),
        Q('¿Qué memoria pierde su contenido cuando apagas el equipo?',
          'Which memory loses its contents when you turn the computer off?',
          ['El disco duro', 'La ROM', 'La memoria RAM', 'La memoria USB'], ['The hard drive', 'ROM', 'RAM memory', 'The USB drive'], 2,
          'La RAM es volátil: guarda datos solo mientras recibe energía.', 'RAM is volatile: it only keeps data while it has power.'),
        Q('¿Cuál es una ventaja de un SSD frente a un disco duro mecánico (HDD)?',
          'What is an advantage of an SSD over a mechanical hard drive (HDD)?',
          ['Es más barato por gigabyte', 'Es mucho más rápido y no tiene partes móviles', 'Guarda datos sin electricidad por siglos', 'Pesa más y protege mejor'], ['It is cheaper per gigabyte', 'It is much faster and has no moving parts', 'It keeps data for centuries without power', 'It is heavier and protects better'], 1,
          'El SSD usa memoria flash: arranca y carga programas en segundos.', 'The SSD uses flash memory: it boots and loads programs in seconds.'),
        Q('¿Qué componente conecta y permite la comunicación entre todas las piezas del PC?',
          'Which component connects and lets all the PC parts communicate?',
          ['La fuente de poder', 'El gabinete', 'La tarjeta madre', 'El ventilador'], ['The power supply', 'The case', 'The motherboard', 'The fan'], 2,
          'En la tarjeta madre se conectan el procesador, la RAM, el almacenamiento y las tarjetas.', 'The processor, RAM, storage and cards all plug into the motherboard.'),
        Q('¿Cuál es el trabajo de la fuente de poder (PSU)?',
          'What does the power supply (PSU) do?',
          ['Enfriar el procesador', 'Convertir la corriente de la pared en la energía que usan los componentes', 'Guardar los archivos', 'Mostrar la imagen en pantalla'], ['Cool the processor', 'Convert the wall power into the energy the components use', 'Store the files', 'Show the image on screen'], 1,
          'La PSU transforma la corriente alterna en corriente continua regulada para cada pieza.', 'The PSU turns AC power into regulated DC power for every part.'),
        Q('¿Para qué sirve principalmente la tarjeta de video (GPU)?',
          'What is the video card (GPU) mainly for?',
          ['Procesar gráficos, video y juegos', 'Conectarse a internet', 'Guardar contraseñas', 'Imprimir documentos'], ['Processing graphics, video and games', 'Connecting to the internet', 'Storing passwords', 'Printing documents'], 0,
          'La GPU está especializada en cálculos gráficos y libera a la CPU de esa tarea.', 'The GPU specializes in graphics math and frees the CPU from that work.'),
        Q('Si un equipo tiene "16 GB de RAM", ¿qué significa?',
          'If a computer has "16 GB of RAM", what does it mean?',
          ['Su disco guarda 16 GB', 'Su memoria de trabajo temporal es de 16 GB', 'Su pantalla es de 16 pulgadas', 'Su procesador va a 16 GHz'], ['Its drive stores 16 GB', 'Its temporary working memory is 16 GB', 'Its screen is 16 inches', 'Its processor runs at 16 GHz'], 1,
          'Los GB de RAM miden cuántos datos puede manejar el equipo al mismo tiempo.', 'RAM gigabytes measure how much data the machine can handle at once.'),
        Q('El teclado, el mouse y el monitor son ejemplos de…',
          'The keyboard, mouse and monitor are examples of…',
          ['Software', 'Periféricos', 'Procesadores', 'Fuentes de poder'], ['Software', 'Peripherals', 'Processors', 'Power supplies'], 1,
          'Los periféricos son los dispositivos externos que conectas al computador.', 'Peripherals are the external devices you plug into the computer.'),
        Q('¿Dónde quedan guardados tus archivos de forma permanente?',
          'Where are your files stored permanently?',
          ['En la RAM', 'En la caché del procesador', 'En la unidad de almacenamiento (SSD o HDD)', 'En la tarjeta de red'], ['In RAM', 'In the processor cache', 'In the storage drive (SSD or HDD)', 'In the network card'], 2,
          'El almacenamiento no volátil conserva los archivos aunque apagues el equipo.', 'Non-volatile storage keeps files even when the machine is off.'),
        Q('¿Qué puede pasar si la fuente de poder entrega menos watts de los que el PC necesita?',
          'What can happen if the power supply delivers fewer watts than the PC needs?',
          ['Nada, funciona igual', 'El equipo puede apagarse bajo carga o no encender', 'La pantalla se ve más grande', 'El internet se vuelve más rápido'], ['Nothing, it works the same', 'The machine can shut down under load or not turn on', 'The screen looks bigger', 'The internet gets faster'], 1,
          'Sin energía suficiente, el sistema se vuelve inestable y se apaga para protegerse.', 'Without enough power, the system becomes unstable and shuts down to protect itself.')
      ]
    },
    {
      id: 'redes', icon: ICONS.redes,
      name: { es: 'Redes', en: 'Networks' },
      desc: { es: 'Tipos de redes, topologías y dispositivos.', en: 'Network types, topologies and devices.' },
      questions: [
        Q('Una red que cubre una casa o una oficina pequeña es una…',
          'A network covering a house or a small office is a…',
          ['WAN', 'LAN', 'MAN', 'GAN'], ['WAN', 'LAN', 'MAN', 'GAN'], 1,
          'La LAN (red de área local) cubre espacios pequeños como una casa u oficina.', 'A LAN (local area network) covers small spaces like a home or office.'),
        Q('En la topología en estrella, todos los equipos se conectan a…',
          'In a star topology, every device connects to…',
          ['Un cable que pasa de equipo en equipo', 'Un dispositivo central, como un switch', 'El equipo más rápido', 'Directamente a internet'], ['A cable going from device to device', 'A central device, such as a switch', 'The fastest device', 'Directly to the internet'], 1,
          'En estrella, el nodo central concentra todas las conexiones.', 'In a star, the central node concentrates all the connections.'),
        Q('¿Qué dispositivo conecta tu red local con internet?',
          'Which device connects your local network to the internet?',
          ['El router', 'El monitor', 'El switch de escritorio', 'El cable HDMI'], ['The router', 'The monitor', 'The desktop switch', 'The HDMI cable'], 0,
          'El router enlaza redes distintas: tu LAN con la red del proveedor de internet.', 'The router links different networks: your LAN with your internet provider network.'),
        Q('¿Qué comando comprueba si otro equipo responde en la red?',
          'Which command checks whether another device answers on the network?',
          ['format', 'ping', 'copy', 'shutdown'], ['format', 'ping', 'copy', 'shutdown'], 1,
          'ping envía paquetes de prueba y mide si hay respuesta y en cuánto tiempo.', 'ping sends test packets and measures whether there is a reply and how fast.'),
        Q('La dirección física única grabada en cada tarjeta de red se llama…',
          'The unique physical address burned into every network card is called…',
          ['Dirección IP', 'Dirección MAC', 'DNS', 'SSID'], ['IP address', 'MAC address', 'DNS', 'SSID'], 1,
          'La MAC identifica el hardware de red; la IP puede cambiar según la red.', 'The MAC identifies the network hardware; the IP can change per network.'),
        Q('¿Qué topología usa un solo cable principal del que se conectan todos los equipos?',
          'Which topology uses a single main cable that all devices attach to?',
          ['Anillo', 'Malla', 'Bus', 'Árbol'], ['Ring', 'Mesh', 'Bus', 'Tree'], 2,
          'En bus, todos comparten el mismo cable troncal.', 'In a bus, everyone shares the same backbone cable.'),
        Q('El ejemplo más grande de una WAN es…',
          'The largest example of a WAN is…',
          ['La red de un salón de clases', 'Internet', 'El Bluetooth del celular', 'Un cable entre dos PC'], ['A classroom network', 'The Internet', 'Phone Bluetooth', 'A cable between two PCs'], 1,
          'Internet conecta redes de todo el planeta: es una red de área amplia (WAN).', 'The Internet connects networks all over the planet: it is a wide area network (WAN).'),
        Q('¿Para qué sirve un switch en una red local?',
          'What is a switch for in a local network?',
          ['Para conectar varios equipos de la misma red y repartir los datos entre ellos', 'Para imprimir en red', 'Para enfriar el router', 'Para crear contraseñas'], ['To connect several devices on the same network and pass data between them', 'To print over the network', 'To cool the router', 'To create passwords'], 0,
          'El switch recibe un paquete y lo entrega solo al equipo destino dentro de la LAN.', 'The switch receives a packet and delivers it only to the destination device on the LAN.'),
        Q('¿Cuál de estas es una dirección IP privada típica de una red casera?',
          'Which of these is a typical private IP address of a home network?',
          ['8.8.8.8', '192.168.1.10', '999.1.1.1', '200.55.10.300'], ['8.8.8.8', '192.168.1.10', '999.1.1.1', '200.55.10.300'], 1,
          'Los rangos 192.168.x.x, 10.x.x.x y 172.16-31.x.x son privados; además cada octeto va de 0 a 255.', 'The 192.168.x.x, 10.x.x.x and 172.16-31.x.x ranges are private; also each octet goes from 0 to 255.'),
        Q('Si se corta el cable principal en una topología en bus, ¿qué pasa?',
          'If the main cable is cut in a bus topology, what happens?',
          ['Nada, cada equipo sigue conectado', 'Solo se cae un equipo', 'Toda la red deja de funcionar', 'La red se vuelve WiFi'], ['Nothing, every device stays connected', 'Only one device drops', 'The whole network stops working', 'The network becomes WiFi'], 2,
          'El bus depende de un único cable: si se rompe, la red se parte.', 'The bus depends on a single cable: if it breaks, the network splits.')
      ]
    },
    {
      id: 'mantenimiento', icon: ICONS.mantenimiento,
      name: { es: 'Mantenimiento por software', en: 'Software maintenance' },
      desc: { es: 'Cuidado y optimización de Windows.', en: 'Windows care and optimization.' },
      questions: [
        Q('¿Qué herramienta de Windows libera espacio borrando archivos temporales?',
          'Which Windows tool frees space by deleting temporary files?',
          ['El Bloc de notas', 'El Liberador de espacio en disco', 'Paint', 'La calculadora'], ['Notepad', 'Disk Cleanup', 'Paint', 'Calculator'], 1,
          'El Liberador de espacio en disco (cleanmgr) borra temporales, caché y papelera.', 'Disk Cleanup (cleanmgr) deletes temp files, cache and the recycle bin.'),
        Q('Un programa se quedó pegado y consume mucha CPU. ¿Dónde lo cierras?',
          'A program froze and is eating CPU. Where do you close it?',
          ['En el Administrador de tareas', 'En el Explorador de archivos', 'En la barra de búsqueda', 'En el Panel de control de sonido'], ['In Task Manager', 'In File Explorer', 'In the search bar', 'In the sound control panel'], 0,
          'El Administrador de tareas muestra los procesos y permite finalizarlos.', 'Task Manager shows the processes and lets you end them.'),
        Q('¿Por qué NO se debe desfragmentar un SSD?',
          'Why should you NOT defragment an SSD?',
          ['Porque se llena más rápido', 'Porque no lo necesita y el exceso de escrituras acorta su vida útil', 'Porque borra los archivos', 'Porque apaga el WiFi'], ['Because it fills up faster', 'Because it does not need it and excess writes shorten its lifespan', 'Because it deletes files', 'Because it turns off WiFi'], 1,
          'El SSD accede a cualquier dato al instante; desfragmentar solo lo desgasta.', 'An SSD reaches any data instantly; defragmenting only wears it out.'),
        Q('Mantener Windows Update activado sirve principalmente para…',
          'Keeping Windows Update on is mainly for…',
          ['Cambiar el fondo de pantalla', 'Recibir parches de seguridad y correcciones', 'Descargar juegos gratis', 'Acelerar el internet'], ['Changing the wallpaper', 'Receiving security patches and fixes', 'Downloading free games', 'Speeding up the internet'], 1,
          'Las actualizaciones corrigen fallos que los atacantes aprovechan.', 'Updates fix flaws that attackers take advantage of.'),
        Q('Antes de hacer un mantenimiento importante conviene…',
          'Before an important maintenance session, it is wise to…',
          ['Apagar el monitor', 'Hacer una copia de seguridad de tus archivos', 'Borrar la carpeta System32', 'Instalar tres antivirus'], ['Turn off the monitor', 'Back up your files', 'Delete the System32 folder', 'Install three antiviruses'], 1,
          'Con respaldo, cualquier error tiene vuelta atrás.', 'With a backup, any mistake can be undone.'),
        Q('¿Para qué sirve el Modo seguro de Windows?',
          'What is Windows Safe Mode for?',
          ['Para jugar sin internet', 'Para diagnosticar problemas arrancando solo con lo básico', 'Para hacer el PC más rápido siempre', 'Para instalar Windows desde cero'], ['To play offline', 'To diagnose problems by starting with only the basics', 'To make the PC always faster', 'To install Windows from scratch'], 1,
          'En Modo seguro cargan solo controladores esenciales: ideal para aislar fallos.', 'Safe Mode loads only essential drivers: ideal for isolating faults.'),
        Q('¿Cuál es la forma correcta de quitar un programa del PC?',
          'What is the correct way to remove a program from the PC?',
          ['Borrar su carpeta y el acceso directo', 'Desinstalarlo desde Configuración > Aplicaciones', 'Formatear el disco', 'Renombrar su carpeta'], ['Delete its folder and shortcut', 'Uninstall it from Settings > Apps', 'Format the drive', 'Rename its folder'], 1,
          'Desinstalar limpia también sus registros y archivos del sistema.', 'Uninstalling also cleans its registry entries and system files.'),
        Q('Si el PC tarda mucho en encender, ¿qué deberías revisar?',
          'If the PC takes long to start, what should you check?',
          ['Los programas que arrancan con Windows', 'El brillo de la pantalla', 'El color del gabinete', 'La hora del sistema'], ['The programs that start with Windows', 'The screen brightness', 'The case color', 'The system clock'], 0,
          'Muchas apps se lanzan al inicio y saturan el arranque; se gestionan en el Administrador de tareas.', 'Many apps launch at startup and clog the boot; they are managed in Task Manager.'),
        Q('Un antivirus actualizado y activo ayuda a…',
          'An up-to-date, active antivirus helps to…',
          ['Tener más espacio en disco', 'Detectar y bloquear malware', 'Mejorar la señal WiFi', 'Que la batería dure más'], ['Have more disk space', 'Detect and block malware', 'Improve the WiFi signal', 'Make the battery last longer'], 1,
          'Sus definiciones al día reconocen las amenazas recientes.', 'Up-to-date definitions recognize recent threats.'),
        Q('Los archivos temporales de Windows se acumulan principalmente en…',
          'Windows temporary files mostly pile up in…',
          ['La carpeta Temp del sistema', 'La papelera de reciclaje solamente', 'El escritorio', 'La BIOS'], ['The system Temp folder', 'Only the recycle bin', 'The desktop', 'The BIOS'], 0,
          'Programas e instaladores dejan restos en Temp que con el tiempo ocupan gigabytes.', 'Programs and installers leave leftovers in Temp that over time take gigabytes.')
      ]
    },
    {
      id: 'wifi', icon: ICONS.wifi,
      name: { es: 'WiFi avanzado', en: 'Advanced WiFi' },
      desc: { es: 'Bandas, estándares y seguridad inalámbrica.', en: 'Bands, standards and wireless security.' },
      questions: [
        Q('El estándar WiFi 6 corresponde a la norma…',
          'The WiFi 6 standard corresponds to the… specification',
          ['802.11n', '802.11ac', '802.11ax', '802.11g'], ['802.11n', '802.11ac', '802.11ax', '802.11g'], 2,
          'WiFi 6 es 802.11ax: más velocidad y mejor manejo de muchos equipos a la vez.', 'WiFi 6 is 802.11ax: more speed and better handling of many devices at once.'),
        Q('Comparada con 5 GHz, la banda de 2.4 GHz…',
          'Compared to 5 GHz, the 2.4 GHz band…',
          ['Es más rápida y llega menos lejos', 'Llega más lejos pero suele ser más lenta', 'No atraviesa paredes', 'Solo sirve para Bluetooth'], ['Is faster and reaches less far', 'Reaches farther but is usually slower', 'Cannot go through walls', 'Is only for Bluetooth'], 1,
          'Las frecuencias bajas viajan más lejos y atraviesan mejor los obstáculos.', 'Lower frequencies travel farther and pass obstacles better.'),
        Q('¿Cuál es el tipo de seguridad WiFi más moderno y recomendado?',
          'Which is the most modern and recommended WiFi security type?',
          ['WEP', 'WPA', 'WPA2', 'WPA3'], ['WEP', 'WPA', 'WPA2', 'WPA3'], 3,
          'WPA3 es el estándar actual; WEP y WPA original ya son inseguros.', 'WPA3 is the current standard; WEP and original WPA are already insecure.'),
        Q('En 2.4 GHz, los canales que menos se solapan entre sí son…',
          'In 2.4 GHz, the channels that overlap the least are…',
          ['1, 2 y 3', '1, 6 y 11', '5, 6 y 7', 'Todos se solapan igual'], ['1, 2 and 3', '1, 6 and 11', '5, 6 and 7', 'They all overlap the same'], 1,
          '1, 6 y 11 están separados lo suficiente para no pisarse entre ellos.', '1, 6 and 11 are spaced far enough not to step on each other.'),
        Q('¿Dónde conviene ubicar el router para mejor cobertura?',
          'Where should the router be placed for the best coverage?',
          ['En el piso, dentro de un mueble cerrado', 'En un lugar central y elevado de la casa', 'Junto a la nevera', 'En el sótano'], ['On the floor, inside a closed cabinet', 'In a central, elevated spot in the house', 'Next to the fridge', 'In the basement'], 1,
          'La señal se reparte en todas direcciones: el centro y la altura la aprovechan mejor.', 'The signal spreads in all directions: a central, high spot uses it best.'),
        Q('¿Qué debilita mucho la señal WiFi al atravesarla?',
          'What weakens the WiFi signal a lot when passing through it?',
          ['Las cortinas de tela', 'Los muros de concreto y el metal', 'La madera fina', 'El aire'], ['Fabric curtains', 'Concrete walls and metal', 'Thin wood', 'Air'], 1,
          'Los materiales densos y el metal absorben y reflejan la señal.', 'Dense materials and metal absorb and reflect the signal.'),
        Q('La banda de 5 GHz es ideal para…',
          'The 5 GHz band is ideal for…',
          ['Velocidad alta a corta distancia, como juegos y video 4K', 'Cubrir un barrio entero', 'Sensores que casi no envían datos', 'Casas de varios pisos sin repetidores'], ['High speed at short range, like gaming and 4K video', 'Covering a whole neighborhood', 'Sensors that barely send data', 'Multi-floor houses without repeaters'], 0,
          '5 GHz ofrece más velocidad, pero su alcance es menor que 2.4 GHz.', '5 GHz offers more speed, but its range is shorter than 2.4 GHz.'),
        Q('Cambiar el usuario y la contraseña de fábrica del router es…',
          'Changing the router factory user and password is…',
          ['Innecesario', 'Una medida básica de seguridad', 'Algo que daña el router', 'Solo para empresas'], ['Unnecessary', 'A basic security measure', 'Something that damages the router', 'Only for companies'], 1,
          'Las claves de fábrica son públicas y conocidas: cualquiera podría entrar a tu router.', 'Factory credentials are public and well known: anyone could get into your router.'),
        Q('¿Para qué sirve un repetidor o extensor WiFi?',
          'What is a WiFi repeater or extender for?',
          ['Para ampliar la cobertura a las zonas donde la señal llega débil', 'Para duplicar la velocidad contratada', 'Para reemplazar el módem', 'Para bloquear vecinos'], ['To extend coverage to areas where the signal is weak', 'To double the contracted speed', 'To replace the modem', 'To block neighbors'], 0,
          'El extensor recibe la señal y la retransmite más lejos.', 'The extender receives the signal and rebroadcasts it farther.'),
        Q('¿Qué es el SSID de una red WiFi?',
          'What is the SSID of a WiFi network?',
          ['Su contraseña', 'El nombre visible de la red', 'Su dirección MAC', 'Su canal'], ['Its password', 'The visible name of the network', 'Its MAC address', 'Its channel'], 1,
          'El SSID es el nombre que ves en la lista de redes disponibles.', 'The SSID is the name you see in the list of available networks.')
      ]
    }
  ];

  function loadState() {
    try { var raw = localStorage.getItem(KEY); if (raw) { var p = JSON.parse(raw); if (p && p.results) return p; } } catch (e) {}
    return { results: {}, updatedAt: null };
  }
  function saveState() {
    state.updatedAt = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  var state = loadState();
  var current = null;

  var grid = document.getElementById('exam-grid');
  var run = document.getElementById('exam-run');
  var form = document.getElementById('exam-form');
  var resultBox = document.getElementById('exam-result');

  function renderCards() {
    grid.innerHTML = '';
    EXAMS.forEach(function (exam) {
      var res = state.results[exam.id];
      var card = document.createElement('article');
      card.className = 'exam-card';
      card.innerHTML =
        '<div class="exam-emoji mono-icon">' + exam.icon + '</div>' +
        '<h3>' + exam.name[lang] + '</h3>' +
        '<p>' + exam.desc[lang] + '</p>' +
        (res && res.passed ? '<span class="exam-passed">' + T.passed + '</span>' : '') +
        '<div class="exam-meta">' + exam.questions.length + ' ' + T.questions + '</div>' +
        '<div class="exam-best">' + T.best + ': <b>' + (res ? res.best + '%' : T.none) + '</b></div>' +
        '<button type="button" class="exam-btn">' + T.start + '</button>';
      card.querySelector('button').addEventListener('click', function (ev) { requestStart(exam, ev.currentTarget); });
      grid.appendChild(card);
    });
  }

  function openExam(exam) {
    current = exam;
    document.getElementById('exam-run-title').innerHTML = '<span class="exam-run-icon mono-icon">' + exam.icon + '</span>' + exam.name[lang];
    form.innerHTML = '';
    exam.questions.forEach(function (q, qi) {
      var block = document.createElement('div');
      block.className = 'exam-q';
      var opts = '';
      q.o[lang].forEach(function (opt, oi) {
        opts += '<label class="exam-opt"><input type="radio" name="q' + qi + '" value="' + oi + '"><span>' + opt + '</span></label>';
      });
      block.innerHTML = '<h3><span class="qn">' + (qi + 1) + '.</span>' + q.q[lang] + '</h3>' + opts +
        '<p class="exam-why" id="why' + qi + '"><b>' + T.why + '</b> ' + q.why[lang] + '</p>';
      form.appendChild(block);
    });
    resultBox.className = 'exam-result';
    resultBox.style.display = 'none';
    document.getElementById('exam-cert').className = 'exam-cert';
    document.getElementById('exam-submit').style.display = '';
    document.getElementById('exam-retry').style.display = 'none';
    run.className = 'exam-run on';
    run.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function grade() {
    if (!current) return;
    var correct = 0;
    current.questions.forEach(function (q, qi) {
      var chosen = form.querySelector('input[name="q' + qi + '"]:checked');
      var val = chosen ? parseInt(chosen.value, 10) : -1;
      if (val === q.a) correct++;
      form.querySelectorAll('input[name="q' + qi + '"]').forEach(function (input) {
        input.disabled = true;
        var label = input.closest('.exam-opt');
        var oi = parseInt(input.value, 10);
        if (oi === q.a) label.classList.add('is-correct');
        else if (oi === val) label.classList.add('is-wrong');
      });
      document.getElementById('why' + qi).classList.add('on');
    });
    var pct = Math.round((correct / current.questions.length) * 100);
    var passed = pct >= PASS;
    var prev = state.results[current.id];
    state.results[current.id] = {
      best: Math.max(pct, prev ? prev.best : 0),
      passed: passed || !!(prev && prev.passed),
      last: pct,
      date: new Date().toISOString()
    };
    saveState();
    renderCards();

    document.getElementById('exam-score-num').textContent = pct + '%';
    document.getElementById('exam-result-msg').textContent = T.scoreMsg + ': ' + correct + '/' + current.questions.length + ' — ' + (passed ? T.passMsg : T.failMsg);
    resultBox.className = 'exam-result on' + (passed ? ' pass' : '');
    resultBox.style.display = '';
    document.getElementById('exam-cert').className = 'exam-cert' + (passed ? ' on' : '');
    document.getElementById('exam-submit').style.display = 'none';
    document.getElementById('exam-retry').style.display = '';
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function drawCertificate() {
    var name = String(document.getElementById('cert-name').value || '').trim();
    if (!name) { window.alert(T.certBtnAlert); return; }
    var res = state.results[current.id];
    var pct = res ? res.last : 0;
    var canvas = document.getElementById('cert-canvas');
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;

    var bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#0a0e17'); bg.addColorStop(1, '#0d1b2e');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    var glow = ctx.createRadialGradient(W * 0.88, H * 0.05, 40, W * 0.88, H * 0.05, 520);
    glow.addColorStop(0, 'rgba(56,189,248,0.28)'); glow.addColorStop(1, 'rgba(56,189,248,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 5; ctx.strokeRect(26, 26, W - 52, H - 52);
    ctx.strokeStyle = 'rgba(56,189,248,0.45)'; ctx.lineWidth = 1.6; ctx.strokeRect(42, 42, W - 84, H - 84);

    ctx.textAlign = 'center';
    var brand = ctx.createLinearGradient(W / 2 - 160, 0, W / 2 + 160, 0);
    brand.addColorStop(0, '#38bdf8'); brand.addColorStop(1, '#0284c7');
    ctx.fillStyle = brand;
    ctx.font = '700 54px "Bebas Neue", "Arial Narrow", sans-serif';
    ctx.fillText('N V I S I O N', W / 2, 128);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '400 92px "Bebas Neue", "Arial Narrow", sans-serif';
    ctx.fillText(T.certTitle, W / 2, 252);

    ctx.fillStyle = '#38bdf8'; ctx.fillRect(W / 2 - 170, 282, 340, 5);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 30px Inter, Arial, sans-serif';
    ctx.fillText(T.certGiven, W / 2, 348);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'italic 700 64px Georgia, serif';
    ctx.fillText(name, W / 2, 436);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '400 31px Inter, Arial, sans-serif';
    ctx.fillText(T.certFor + ' ' + current.name[lang] + ' ' + T.certScore + ' ' + pct + '%', W / 2, 512);

    var dateStr = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 26px Inter, Arial, sans-serif';
    ctx.fillText(dateStr, W / 2, 566);

    // Sello
    var sx = W - 215, sy = H - 170;
    var seal = ctx.createRadialGradient(sx - 18, sy - 18, 8, sx, sy, 74);
    seal.addColorStop(0, '#5ccbfb'); seal.addColorStop(1, '#0369a1');
    ctx.beginPath(); ctx.arc(sx, sy, 68, 0, Math.PI * 2); ctx.fillStyle = seal; ctx.fill();
    ctx.beginPath(); ctx.arc(sx, sy, 55, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 56px "Bebas Neue", "Arial Narrow", sans-serif';
    ctx.fillText('N', sx, sy + 20);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 24px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(T.team, 84, H - 92);
    ctx.strokeStyle = 'rgba(148,163,184,0.6)'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(84, H - 112); ctx.lineTo(330, H - 112); ctx.stroke();

    var a = document.createElement('a');
    a.download = 'certificado-nvision-' + current.id + '.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  }

  document.getElementById('exam-submit').addEventListener('click', grade);
  document.getElementById('exam-retry').addEventListener('click', function () { if (current) requestStart(current, this); });
  document.getElementById('exam-back').addEventListener('click', function () {
    run.className = 'exam-run';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.getElementById('exam-cert-btn').addEventListener('click', function () {
    verifySession().then(function (ok) {
      if (!ok) { showGate(); return; }
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawCertificate);
      else drawCertificate();
    });
  });

  if (!hasSession()) { var gb = document.getElementById('exam-gate-banner'); if (gb) gb.hidden = false; }
  else verifySession().then(function (ok) { if (!ok) { var gb2 = document.getElementById('exam-gate-banner'); if (gb2) gb2.hidden = false; } });
  renderCards();
})();
