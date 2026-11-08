// =========================================================
// NVISION PC WORKSHOP - Arranque y diagnostico (Fase 4)
// POST con deteccion de hardware, fallas reales derivadas
// del equipo montado (sin video, BIOS antigua), modelo
// termico segun CPU/disipador/gabinete y prueba de carga
// con tres salidas posibles: estable, throttling o
// apagado/reinicio. Logica pura y bilingue.
// =========================================================

const L = (es, en) => ({ es, en });

export function totalWatts(installed) {
  let w = 60; // base: placa, ventiladores, USB
  Object.values(installed).forEach(i => { w += i.watts || 0; });
  return w;
}
export function ramActualSpeed(ram, xmp) {
  if (!ram) return 0;
  if (xmp) return ram.specs.speed;
  return ram.specs.type === 'DDR5' ? 4800 : 3200; // JEDEC sin XMP/EXPO
}
export function temps(installed) {
  const cpu = installed.cpu, cooler = installed.cooler, kase = installed.case;
  if (!cpu || !cooler || !kase) return { idle: 0, load: 0 };
  const ratio = (cpu.watts || 65) / Math.max(20, cooler.perf.cooling || 50);
  const airFactor = 1.1 - (kase.perf.cooling || 50) / 250;
  const load = Math.round(30 + ratio * 38 * airFactor);
  const idle = Math.round(28 + ratio * 7 * airFactor);
  return { idle, load };
}
export function hasVideo(installed) {
  const gpu = installed.gpu;
  if (gpu && gpu.id !== 'gpu-none') return true;
  return !!(installed.cpu && installed.cpu.specs.igpu);
}
function isRyzen9000(cpu) {
  return !!cpu && /-9\d{3}/.test(cpu.id) && cpu.compat.socket === 'AM5';
}

// POST: devuelve { ok, lines:[{text, level}], fault|null, warnings:[] }
export function runPost(installed, system) {
  const lines = [];
  const push = (text, level) => lines.push({ text, level: level || 'dim' });
  push(L('NVISION UEFI BIOS v2.4 — Autoprueba de encendido (POST)', 'NVISION UEFI BIOS v2.4 — Power-On Self Test (POST)'));
  const cpu = installed.cpu, ram = installed.ram, gpu = installed.gpu, st = installed.storage, board = installed.board;
  if (cpu) push(L(`CPU: ${cpu.name} · ${cpu.specs.cores} núcleos / ${cpu.specs.threads} hilos · hasta ${cpu.specs.boostGHz} GHz`, `CPU: ${cpu.name} · ${cpu.specs.cores} cores / ${cpu.specs.threads} threads · up to ${cpu.specs.boostGHz} GHz`), 'ok');
  if (ram) {
    const spd = ramActualSpeed(ram, system.xmp);
    push(L(`Memoria: ${ram.specs.gb} GB ${ram.specs.type} @ ${spd} MT/s ${system.xmp ? '(XMP/EXPO activado)' : '(JEDEC — activa XMP/EXPO para su velocidad nominal)'}`, `Memory: ${ram.specs.gb} GB ${ram.specs.type} @ ${spd} MT/s ${system.xmp ? '(XMP/EXPO on)' : '(JEDEC — enable XMP/EXPO for rated speed)'}`), system.xmp ? 'ok' : 'warn');
  }
  if (gpu && gpu.id !== 'gpu-none') push(L(`GPU: ${gpu.name} · ${gpu.specs.vramGb} GB VRAM`, `GPU: ${gpu.name} · ${gpu.specs.vramGb} GB VRAM`), 'ok');
  else if (cpu) push(L(`GPU: integrada en el procesador (${cpu.specs.igpu ? 'disponible' : 'NO disponible'})`, `GPU: CPU-integrated (${cpu.specs.igpu ? 'available' : 'NOT available'})`), cpu.specs.igpu ? 'ok' : 'err');
  if (st) push(L(`Almacenamiento: ${st.name} · ${st.specs.interface} · ${st.specs.gb >= 1000 ? (st.specs.gb / 1000) + ' TB' : st.specs.gb + ' GB'}`, `Storage: ${st.name} · ${st.specs.interface} · ${st.specs.gb >= 1000 ? (st.specs.gb / 1000) + ' TB' : st.specs.gb + ' GB'}`), 'ok');
  const warnings = [];
  if (board && isRyzen9000(cpu) && /^(B650|A620)/.test(board.specs.chipset || ''))
    warnings.push(L('⚠ BIOS de la placa anterior a Ryzen 9000: funciona, pero se recomienda actualizarla para plena compatibilidad.', '⚠ Board BIOS predates Ryzen 9000: it works, but updating is recommended for full compatibility.'));
  warnings.forEach(w => push(w, 'warn'));

  if (!hasVideo(installed)) {
    push(L('✖ SIN SEÑAL DE VIDEO — el monitor no recibe imagen', '✖ NO VIDEO SIGNAL — the monitor gets no picture'), 'err');
    return {
      ok: false, lines, warnings,
      fault: {
        code: 'NOVIDEO',
        title: L('Sin señal de video', 'No video signal'),
        hint: L('Este procesador no trae gráficos integrados (modelos con F o la serie X de Intel/AMD sin iGPU) y no hay gráfica dedicada. Instala una GPU o cambia a un CPU con iGPU.', 'This CPU has no integrated graphics and there is no dedicated GPU. Install a GPU or switch to a CPU with an iGPU.')
      }
    };
  }
  push(L('POST correcto ✔ — todos los dispositivos responden', 'POST OK ✔ — all devices respond'), 'ok');
  return { ok: true, lines, warnings, fault: null };
}

// BIOS: filas de informacion para la pantalla de setup
export function biosRows(installed, system) {
  const t = temps(installed);
  const rows = [];
  const add = (k, v) => rows.push({ k, v });
  add(L('Placa', 'Board'), installed.board ? installed.board.name + ' · ' + installed.board.specs.chipset : '—');
  add(L('CPU', 'CPU'), installed.cpu ? installed.cpu.name : '—');
  add(L('Temperatura CPU (reposo)', 'CPU temp (idle)'), t.idle ? t.idle + ' °C' : '—');
  add(L('Memoria', 'Memory'), installed.ram ? installed.ram.specs.gb + ' GB @ ' + ramActualSpeed(installed.ram, system.xmp) + ' MT/s' : '—');
  add('XMP/EXPO', system.xmp ? 'ON' : 'OFF');
  add(L('Arranque', 'Boot'), installed.storage ? installed.storage.name : '—');
  add(L('Sistema operativo', 'OS'), system.osInstalled ? 'NVISION OS' : L('Sin instalar', 'Not installed'));
  return rows;
}

// Prueba de carga: { outcome: 'ok'|'throttle'|'shutdown'|'reset', tempLoad, lines }
export function stressTest(installed) {
  const t = temps(installed);
  const lines = [];
  const watts = totalWatts(installed);
  const psu = installed.psu;
  const ratio = psu ? watts / (psu.specs.wattsOut || 1) : 0;
  lines.push({ text: L(`Carga total estimada: ${watts} W · CPU a ${t.load} °C bajo carga`, `Estimated total load: ${watts} W · CPU at ${t.load} °C under load`), level: 'dim' });
  if (t.load > 102) {
    lines.push({ text: L(`✖ APAGADO POR TEMPERATURA — ${t.load} °C supera el límite seguro`, `✖ THERMAL SHUTDOWN — ${t.load} °C exceeds the safe limit`), level: 'err' });
    return { outcome: 'shutdown', tempLoad: t.load, lines, fault: { code: 'OVERHEAT', title: L('Apagado por temperatura', 'Thermal shutdown'), hint: L('La refrigeración no da abasto para este procesador en este gabinete: mejora el disipador o el flujo de aire.', 'Cooling cannot keep up with this CPU in this case: upgrade the cooler or the airflow.') } };
  }
  if (ratio > 0.92) {
    lines.push({ text: L(`✖ REINICIO BAJO CARGA — la fuente va al ${Math.round(ratio * 100)}% de su capacidad`, `✖ RESET UNDER LOAD — the PSU runs at ${Math.round(ratio * 100)}% of its capacity`), level: 'err' });
    return { outcome: 'reset', tempLoad: t.load, lines, fault: { code: 'PSULIMIT', title: L('La fuente no aguanta la carga', 'PSU cannot hold the load'), hint: L('El consumo supera el 92% de la fuente: instala una de mayor potencia o certificación.', 'Draw exceeds 92% of the PSU: install a higher-wattage unit.') } };
  }
  if (t.load >= 92) {
    lines.push({ text: L(`⚠ THERMAL THROTTLING — a ${t.load} °C el CPU baja frecuencias para protegerse: rinde menos`, `⚠ THERMAL THROTTLING — at ${t.load} °C the CPU downclocks to protect itself: it performs worse`), level: 'warn' });
    return { outcome: 'throttle', tempLoad: t.load, lines, fault: null };
  }
  lines.push({ text: L(`✔ ESTABLE — ${t.load} °C bajo carga, sin throttling ni reinicios`, `✔ STABLE — ${t.load} °C under load, no throttling, no resets`), level: 'ok' });
  return { outcome: 'ok', tempLoad: t.load, lines, fault: null };
}
