// =========================================================
// NVISION PC WORKSHOP - Motor de reglas de compatibilidad
// (Fase 1: socket, tipo de RAM, longitud de GPU, potencia
// de la fuente y factor de forma. Sin dependencias: se
// puede probar en Node y en el navegador por igual.)
// installed: mapa categoria -> componente ya montado.
// Devuelve { ok, reasons: [{es, en}] }.
// =========================================================

const FORM_RANK = { ITX: 1, mATX: 2, ATX: 3, 'E-ATX': 4 };
const BASE_WATTS = 60; // placa, ventiladores, USB, RGB

export function estimatedWatts(installed, extra) {
  let w = BASE_WATTS;
  const all = Object.assign({}, installed);
  if (extra) all[extra.category] = extra;
  Object.values(all).forEach(c => { if (c && c.watts) w += c.watts; });
  return w;
}

export function checkPlacement(item, installed) {
  const reasons = [];
  const warnings = [];
  const bad = (es, en) => reasons.push({ es, en });
  const warn = (es, en) => warnings.push({ es, en });
  const board = installed.board;
  const kase = installed.case;

  // Orden de taller: primero el gabinete, luego la placa.
  if (item.category !== 'case' && !kase)
    bad('Primero coloca el gabinete en el banco: las piezas se montan dentro de él.',
        'Place the case on the bench first: parts are mounted inside it.');
  if (!['case', 'board'].includes(item.category) && kase && !board)
    bad('Primero instala la placa base: todo lo demás se monta sobre ella.',
        'Install the motherboard first: everything else mounts on it.');
  if (item.category === 'cooler' && board && !installed.cpu)
    bad('El disipador va sobre el procesador: instala primero la CPU.',
        'The cooler sits on the CPU: install the processor first.');

  if (item.category === 'cpu' && board && item.compat.socket !== board.compat.socket)
    bad(`Socket incompatible: la CPU es ${item.compat.socket} y la placa es ${board.compat.socket}.`,
        `Socket mismatch: the CPU is ${item.compat.socket} and the board is ${board.compat.socket}.`);

  if (item.category === 'board' && installed.cpu && item.compat.socket !== installed.cpu.compat.socket)
    bad(`Socket incompatible: la placa es ${item.compat.socket} y la CPU es ${installed.cpu.compat.socket}.`,
        `Socket mismatch: the board is ${item.compat.socket} and the CPU is ${installed.cpu.compat.socket}.`);

  if (item.category === 'ram' && board && item.compat.ramType !== board.compat.ramType)
    bad(`RAM incompatible: la placa usa ${board.compat.ramType} y este kit es ${item.compat.ramType}. La muesca ni siquiera coincide.`,
        `RAM mismatch: the board uses ${board.compat.ramType} and this kit is ${item.compat.ramType}. The notch does not even line up.`);

  if (item.category === 'board' && kase && FORM_RANK[item.specs.form] > FORM_RANK[kase.specs.formMax])
    bad(`La placa ${item.specs.form} no cabe en un gabinete ${kase.specs.formMax}.`,
        `The ${item.specs.form} board does not fit a ${kase.specs.formMax} case.`);

  if (item.category === 'gpu' && kase && item.specs.lenMm > kase.specs.gpuMaxMm)
    bad(`La gráfica mide ${item.specs.lenMm} mm y el gabinete admite hasta ${kase.specs.gpuMaxMm} mm. No entra.`,
        `The GPU is ${item.specs.lenMm} mm long and the case fits up to ${kase.specs.gpuMaxMm} mm. It will not fit.`);

  if (item.category === 'cooler' && installed.cpu && !item.compat.sockets.includes(installed.cpu.compat.socket))
    bad(`Este disipador no trae kit de montaje para ${installed.cpu.compat.socket}.`,
        `This cooler has no mounting kit for ${installed.cpu.compat.socket}.`);

  if (item.category === 'psu') {
    // La fuente no se cuenta a si misma en el consumo: se mide lo ya montado.
    const realNeed = Math.round(estimatedWatts(installed) * 1.10);
    if (item.specs.wattsOut < realNeed)
      bad(`Fuente insuficiente: el equipo ya montado pide ~${realNeed} W con margen y esta entrega ${item.specs.wattsOut} W.`,
          `Not enough power: the current build needs ~${realNeed} W with headroom and this unit delivers ${item.specs.wattsOut} W.`);
  }
  if (installed.psu && item.category !== 'psu' && item.category !== 'case') {
    const need = Math.round(estimatedWatts(installed, item) * 1.10);
    if (installed.psu.specs.wattsOut < need)
      bad(`Con esa pieza el consumo sube a ~${need} W y la fuente instalada (${installed.psu.specs.wattsOut} W) ya no da abasto.`,
          `With that part the draw rises to ~${need} W and the installed PSU (${installed.psu.specs.wattsOut} W) is no longer enough.`);
  }

  // --- Fase 2: reglas ampliadas ---
  const gpu = item.category === 'gpu' ? item : installed.gpu;
  const psuNow = item.category === 'psu' ? item : installed.psu;

  if (item.category === 'ram' && board) {
    if (item.specs.modules > board.specs.ramSlots)
      bad(`La placa solo tiene ${board.specs.ramSlots} ranuras RAM y este kit trae ${item.specs.modules} módulos.`,
          `The board only has ${board.specs.ramSlots} RAM slots and this kit has ${item.specs.modules} modules.`);
    if (item.specs.gb > board.specs.ramMaxGb)
      bad(`La placa admite hasta ${board.specs.ramMaxGb} GB y este kit suma ${item.specs.gb} GB.`,
          `The board supports up to ${board.specs.ramMaxGb} GB and this kit totals ${item.specs.gb} GB.`);
  }
  if (item.category === 'cooler' && kase) {
    if (item.specs.type === 'air' && item.specs.heightMm > kase.specs.coolerMaxMm)
      bad(`El disipador mide ${item.specs.heightMm} mm de alto y el gabinete admite ${kase.specs.coolerMaxMm} mm: el panel no cierra.`,
          `The cooler is ${item.specs.heightMm} mm tall and the case fits ${kase.specs.coolerMaxMm} mm: the panel will not close.`);
    if (item.specs.type === 'liquid' && item.specs.radiatorMm > kase.specs.radiatorMaxMm)
      bad(`El radiador de ${item.specs.radiatorMm} mm no cabe en este gabinete (máximo ${kase.specs.radiatorMaxMm} mm).`,
          `The ${item.specs.radiatorMm} mm radiator does not fit this case (max ${kase.specs.radiatorMaxMm} mm).`);
  }
  if (item.category === 'storage' && board && item.specs.mount === 'M.2' && !(board.specs.m2Slots > 0))
    bad('Esta placa no tiene ranuras M.2 libres para ese SSD.',
        'This board has no free M.2 slots for that SSD.');
  if (item.category === 'storage' && board && /PCIe 5\.0/.test(item.specs.interface || '') && (board.specs.pcieGen || 4) < 5)
    warn('Ese NVMe Gen5 correrá a velocidad Gen4 en esta placa: funciona, pero no a su máximo.',
         'That Gen5 NVMe will run at Gen4 speed on this board: it works, just not at its peak.');

  // Conectores de alimentación de la GPU (en ambos sentidos)
  if (gpu && gpu.id !== 'gpu-none' && psuNow && gpu.specs.powerNeed) {
    if (gpu.specs.powerNeed === '12v' && !psuNow.specs.has12v && (psuNow.specs.pcie8 || 0) < 3)
      bad(`La ${gpu.name} necesita conector 12V-2x6/12VHPWR (o adaptador de 3×8 pines) y la fuente ${psuNow.name} no lo ofrece.`,
          `The ${gpu.name} needs a 12V-2x6/12VHPWR connector (or a 3×8-pin adapter) and the ${psuNow.name} does not offer one.`);
    else if (gpu.specs.powerNeed === '12v' && !psuNow.specs.has12v)
      warn('La gráfica se alimentará con adaptador de 3×8 pines: funciona, pero lo ideal es una fuente ATX 3.x con 12V-2x6 nativo.',
           'The GPU will be fed through a 3×8-pin adapter: it works, but an ATX 3.x PSU with a native 12V-2x6 is ideal.');
    if (gpu.specs.powerNeed === '8pin2' && (psuNow.specs.pcie8 || 0) < 2)
      bad(`La ${gpu.name} necesita 2 conectores PCIe de 8 pines y la fuente ${psuNow.name} solo trae ${psuNow.specs.pcie8 || 0}.`,
          `The ${gpu.name} needs 2 PCIe 8-pin connectors and the ${psuNow.name} only has ${psuNow.specs.pcie8 || 0}.`);
    if (gpu.specs.powerNeed === '8pin' && (psuNow.specs.pcie8 || 0) < 1)
      bad(`La ${gpu.name} necesita 1 conector PCIe de 8 pines y la fuente ${psuNow.name} no trae ninguno.`,
          `The ${gpu.name} needs 1 PCIe 8-pin connector and the ${psuNow.name} has none.`);
  }
  // Avisos que no bloquean el montaje
  if (gpu && gpu.id !== 'gpu-none' && installed.cpu && gpu.perf && installed.cpu.perf) {
    const diff = gpu.perf.gaming - installed.cpu.perf.gaming;
    if (diff > 35) warn('Posible cuello de botella: la gráfica es mucho más potente que el procesador elegido.',
                        'Possible bottleneck: the GPU is much stronger than the chosen CPU.');
    if (diff < -35) warn('El procesador va sobrado para esta gráfica: en juegos mandará la GPU.',
                         'The CPU is overkill for this GPU: games will be GPU-bound.');
  }
  if (item.category === 'gpu' && board && item.specs.pcieGen && board.specs.pcieGen && item.specs.pcieGen > board.specs.pcieGen)
    warn(`La gráfica es PCIe ${item.specs.pcieGen}.0 y la ranura de la placa es ${board.specs.pcieGen}.0: funcionará a ${board.specs.pcieGen}.0, con una pérdida mínima.`,
         `The GPU is PCIe ${item.specs.pcieGen}.0 and the board slot is ${board.specs.pcieGen}.0: it will run at ${board.specs.pcieGen}.0 with minimal loss.`);
  if (board && board.specs.tpm === false)
    warn('Esta placa no declara módulo TPM 2.0: Windows 11 no se instalaría sin rodeos.',
         'This board lists no TPM 2.0 module: Windows 11 would not install cleanly.');

  return { ok: reasons.length === 0, reasons, warnings };
}

export const REQUIRED = ['case', 'board', 'cpu', 'ram', 'gpu', 'storage', 'psu', 'cooler'];
export function missingParts(installed) {
  return REQUIRED.filter(c => !installed[c]);
}
