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
  const bad = (es, en) => reasons.push({ es, en });
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
    const realNeed = Math.round(estimatedWatts(installed) * 1.15);
    if (item.specs.wattsOut < realNeed)
      bad(`Fuente insuficiente: el equipo ya montado pide ~${realNeed} W con margen y esta entrega ${item.specs.wattsOut} W.`,
          `Not enough power: the current build needs ~${realNeed} W with headroom and this unit delivers ${item.specs.wattsOut} W.`);
  }
  if (installed.psu && item.category !== 'psu' && item.category !== 'case') {
    const need = Math.round(estimatedWatts(installed, item) * 1.15);
    if (installed.psu.specs.wattsOut < need)
      bad(`Con esa pieza el consumo sube a ~${need} W y la fuente instalada (${installed.psu.specs.wattsOut} W) ya no da abasto.`,
          `With that part the draw rises to ~${need} W and the installed PSU (${installed.psu.specs.wattsOut} W) is no longer enough.`);
  }

  return { ok: reasons.length === 0, reasons };
}

export const REQUIRED = ['case', 'board', 'cpu', 'ram', 'gpu', 'storage', 'psu', 'cooler'];
export function missingParts(installed) {
  return REQUIRED.filter(c => !installed[c]);
}
