// =========================================================
// NVISION — PC3D: etiquetas con el hardware real del equipo
// Solo cambia el TEXTO de las etiquetas flotantes del visor 3D
// (y el rótulo al pasar el cursor). El modelo 3D NO se toca:
// misma geometría, mismas piezas, mismo comportamiento.
//
// Cómo funciona:
// 1) "Detectar mi PC" consulta el puente local (PowerShell) en
//    http://127.0.0.1:8765/api/hardware. El puente debe estar
//    corriendo en el PC con Windows del visitante; los datos
//    nunca salen de ese equipo ni se guardan en ningún lado.
// 2) "Ver ejemplo" muestra etiquetas con datos de muestra,
//    para ver cómo queda sin tener el puente (celular, Mac).
// 3) Las etiquetas derivadas se envían al visor con el evento
//    'nvision:hardware-labels'. El visor (js/pc3d-viewer.js)
//    solo aplica el texto; cooler y fuente no tienen datos
//    en el puente y conservan su etiqueta general.
// =========================================================
(function () {
  'use strict';

  var mount = document.getElementById('pc-viewer3d');
  var detectBtn = document.getElementById('pc-hw-detect');
  var demoBtn = document.getElementById('pc-hw-demo');
  var clearBtn = document.getElementById('pc-hw-clear');
  var statusText = document.getElementById('pc-hw-status-text');
  var statusDot = document.getElementById('pc-hw-dot');
  var helpEl = document.getElementById('pc-hw-help');
  if (!mount || !detectBtn || !demoBtn || !clearBtn || !statusText) return;

  var BRIDGE_URLS = [
    'http://127.0.0.1:8765/api/hardware',
    'http://localhost:8765/api/hardware'
  ];
  var FETCH_TIMEOUT_MS = 30000; // la primera consulta WMI tarda y el permiso de red local espera al usuario

  // Datos de muestra con la MISMA forma del JSON del puente.
  // Nunca se presentan como datos reales: el estado lo dice.
  var DEMO = {
    equipo: { nombre: 'PC-EJEMPLO' },
    sistema: { nombre: 'Microsoft Windows 11 Pro', version: '10.0.26100', arquitectura: '64-bit' },
    procesador: { nombre: 'Intel(R) Core(TM) i5-12400F', fabricante: 'GenuineIntel', nucleos: 6, hilos: 12, frecuenciaMHz: 4400 },
    memoria: {
      totalGB: 16,
      modulos: [
        { fabricante: 'Kingston', capacidadGB: 8, velocidadMHz: 3200, tipo: 'DDR4' },
        { fabricante: 'Kingston', capacidadGB: 8, velocidadMHz: 3200, tipo: 'DDR4' }
      ]
    },
    graficos: [{ nombre: 'NVIDIA GeForce GTX 1650', fabricante: 'NVIDIA', memoriaGB: 4, driver: '31.0.15.1234' }],
    almacenamiento: [{ modelo: 'Samsung SSD 970 EVO Plus 500GB', fabricante: 'Samsung', capacidadGB: 465.76, interfaz: 'NVMe', tipo: 'Fixed hard disk media' }],
    unidadOptica: [],
    placaMadre: { fabricante: 'ASUSTeK COMPUTER INC.', modelo: 'PRIME H610M-A D4', version: 'Rev 1.xx' },
    fechaConsulta: '2026-11-12 14:00:00'
  };

  var STR = {
    es: {
      kicker: 'ETIQUETAS CON TU PC',
      detect: 'Detectar mi PC',
      demo: 'Ver ejemplo',
      clear: 'Etiquetas normales',
      idle: 'Etiquetas: nombres generales',
      checking: 'Buscando el puente en tu PC… Si el navegador pide permiso de red local, acéptalo.',
      real: 'Etiquetas con tu hardware real',
      demoStatus: 'Ejemplo · datos de muestra, no es tu PC',
      error: 'No se encontró el puente. Sigue los pasos.',
      help: 'En tu PC con Windows: 1) abre la carpeta del puente y ejecuta iniciar-servidor.bat, dejando la ventana abierta; 2) vuelve aquí y pulsa Detectar mi PC; 3) si el navegador pide permiso de acceso a la red local, acéptalo. Al terminar, cierra la ventana del puente. Solo funciona en Windows; en celular o Mac usa Ver ejemplo.',
      modules: 'módulos',
      noOptical: 'Sin unidad óptica'
    },
    en: {
      kicker: 'LABELS WITH YOUR PC',
      detect: 'Detect my PC',
      demo: 'See an example',
      clear: 'Default labels',
      idle: 'Labels: generic names',
      checking: 'Looking for the bridge on your PC… If the browser asks for local-network permission, allow it.',
      real: 'Labels with your real hardware',
      demoStatus: 'Example · sample data, not your PC',
      error: 'Bridge not found. Follow the steps.',
      help: 'On your Windows PC: 1) open the bridge folder and run iniciar-servidor.bat, leaving the window open; 2) come back here and press Detect my PC; 3) if the browser asks for local-network access, allow it. When done, close the bridge window. Windows only; on phone or Mac use See an example.',
      modules: 'modules',
      noOptical: 'No optical drive'
    }
  };

  function lang() {
    try {
      if (typeof currentLang !== 'undefined' && (currentLang === 'es' || currentLang === 'en')) return currentLang;
    } catch (e) { /* sin diccionario global: respaldo abajo */ }
    return document.documentElement.lang === 'en' ? 'en' : 'es';
  }
  function S(key) {
    var l = lang();
    return (STR[l] && STR[l][key]) || STR.es[key] || key;
  }

  function text(v) {
    return (v === null || v === undefined) ? '' : String(v).trim();
  }
  function cleanName(v) {
    return text(v).replace(/\(R\)|\(TM\)|®|™/gi, ' ').replace(/\s+/g, ' ').trim();
  }
  function num(v) {
    var n = Number(v);
    return isFinite(n) ? n : 0;
  }
  function fmtGB(v) {
    var g = num(v);
    if (!g) return 0;
    return g >= 100 ? Math.round(g) : Math.round(g * 10) / 10;
  }
  function pickLargest(list, field) {
    var best = null;
    var bestVal = -1;
    (list || []).forEach(function (item) {
      var v = num(item && item[field]);
      if (v > bestVal) { bestVal = v; best = item; }
    });
    return best || (list && list[0]) || null;
  }

  // Deriva el texto de cada etiqueta desde el JSON del puente.
  // Solo devuelve las piezas con dato real; cooler y fuente
  // no vienen en el puente y quedan con su etiqueta general.
  function buildLabels(data, langCode) {
    var labels = {};
    if (!data || typeof data !== 'object') return labels;
    var modulesWord = (STR[langCode] && STR[langCode].modules) || STR.es.modules;
    var noOptical = (STR[langCode] && STR[langCode].noOptical) || STR.es.noOptical;

    var cpuName = data.procesador && cleanName(data.procesador.nombre);
    if (cpuName) labels.cpu = cpuName;

    if (data.placaMadre) {
      var fab = cleanName(data.placaMadre.fabricante).split(/\s+/)[0] || '';
      var mod = cleanName(data.placaMadre.modelo);
      if (mod) {
        labels.motherboard = (fab && mod.toLowerCase().indexOf(fab.toLowerCase()) !== 0)
          ? fab + ' ' + mod
          : mod;
      } else if (fab) {
        labels.motherboard = fab;
      }
    }

    if (data.memoria) {
      var total = fmtGB(data.memoria.totalGB);
      if (total) {
        var mods = Array.isArray(data.memoria.modulos) ? data.memoria.modulos : [];
        var type = mods.length ? text(mods[0].tipo) : '';
        var parts = total + ' GB';
        if (type && type.toLowerCase() !== 'desconocido' && type.toLowerCase() !== 'unknown') parts += ' ' + type;
        if (mods.length) parts += ' · ' + mods.length + ' ' + modulesWord;
        labels.ram = parts;
      }
    }

    var gpu = Array.isArray(data.graficos) ? pickLargest(data.graficos, 'memoriaGB') : null;
    var gpuName = gpu && cleanName(gpu.nombre);
    if (gpuName) labels.gpu = gpuName; // sin GB: WMI enrolla la VRAM mayor de 4 GB

    var disk = Array.isArray(data.almacenamiento) ? pickLargest(data.almacenamiento, 'capacidadGB') : null;
    if (disk) {
      var diskModel = cleanName(disk.modelo);
      var diskGB = fmtGB(disk.capacidadGB);
      if (diskModel) {
        labels.storage = /\d+(\.\d+)?\s*(GB|TB)/i.test(diskModel) || !diskGB
          ? diskModel
          : diskModel + ' · ' + diskGB + ' GB';
      } else if (diskGB) {
        labels.storage = diskGB + ' GB';
      }
    }

    if (Array.isArray(data.unidadOptica)) {
      if (data.unidadOptica.length) {
        var optName = cleanName(data.unidadOptica[0].nombre);
        if (optName) labels.optical = optName;
      } else {
        labels.optical = noOptical;
      }
    }

    return labels;
  }

  function publish(labels, source) {
    var detail = { labels: labels, source: source };
    window.__nvisionHardwareLabels = detail;
    window.dispatchEvent(new CustomEvent('nvision:hardware-labels', { detail: detail }));
  }

  var state = 'idle'; // idle | checking | real | demo | error
  var lastData = null;
  var requestSeq = 0;

  function renderStatus() {
    var dotClass = 'pc-hw-dot';
    var msg = S('idle');
    if (state === 'checking') { dotClass += ' is-checking'; msg = S('checking'); }
    else if (state === 'real') { dotClass += ' is-real'; msg = S('real'); }
    else if (state === 'demo') { dotClass += ' is-demo'; msg = S('demoStatus'); }
    else if (state === 'error') { dotClass += ' is-error'; msg = S('error'); }
    statusDot.className = dotClass;
    statusText.textContent = msg;
    clearBtn.hidden = !(state === 'real' || state === 'demo');
    helpEl.hidden = state !== 'error';
    if (state === 'error') helpEl.textContent = S('help');
  }

  function applyStaticStrings() {
    document.querySelectorAll('[data-hw-i18n]').forEach(function (el) {
      el.textContent = S(el.getAttribute('data-hw-i18n'));
    });
  }

  function fetchWithTimeout(url, ms) {
    if (typeof AbortController === 'undefined') {
      return fetch(url, { cache: 'no-store' });
    }
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, ms);
    return fetch(url, { cache: 'no-store', signal: controller.signal })
      .then(function (res) { clearTimeout(timer); return res; })
      .catch(function (err) { clearTimeout(timer); throw err; });
  }

  function fetchBridge() {
    var started = Date.now();
    return fetchWithTimeout(BRIDGE_URLS[0], FETCH_TIMEOUT_MS)
      .catch(function (err) {
        // Si falló rápido (puente apagado / permiso negado), probar
        // con localhost antes de rendirse; si tardó, no duplicar la espera.
        if (Date.now() - started < 3000) {
          return fetchWithTimeout(BRIDGE_URLS[1], 10000);
        }
        throw err;
      })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      });
  }

  function detect() {
    if (state === 'checking') return;
    if (typeof fetch === 'undefined') {
      state = 'error';
      renderStatus();
      return;
    }
    var seq = ++requestSeq;
    state = 'checking';
    detectBtn.disabled = true;
    renderStatus();
    fetchBridge()
      .then(function (data) {
        if (seq !== requestSeq) return;
        var labels = buildLabels(data, lang());
        if (!Object.keys(labels).length) throw new Error('empty');
        lastData = data;
        state = 'real';
        publish(labels, 'real');
      })
      .catch(function () {
        if (seq !== requestSeq) return;
        lastData = null;
        state = 'error';
        publish(null, null);
      })
      .then(function () {
        if (seq !== requestSeq) return;
        detectBtn.disabled = false;
        renderStatus();
      });
  }

  function showDemo() {
    requestSeq++; // invalida una detección en curso
    lastData = DEMO;
    state = 'demo';
    detectBtn.disabled = false;
    publish(buildLabels(DEMO, lang()), 'demo');
    renderStatus();
  }

  function clearAll() {
    requestSeq++;
    lastData = null;
    state = 'idle';
    detectBtn.disabled = false;
    publish(null, null);
    renderStatus();
  }

  detectBtn.addEventListener('click', detect);
  demoBtn.addEventListener('click', showDemo);
  clearBtn.addEventListener('click', clearAll);

  window.addEventListener('nvision-lang-change', function () {
    applyStaticStrings();
    if ((state === 'real' || state === 'demo') && lastData) {
      publish(buildLabels(lastData, lang()), state);
    }
    renderStatus();
  });

  applyStaticStrings();
  renderStatus();

  // Para pruebas y depuración (sin exponer datos del usuario).
  window.NVISION_PC_HARDWARE = { buildLabels: buildLabels, cleanName: cleanName, DEMO: DEMO };
})();
