// =========================================================
// NVISION PC WORKSHOP - Secuencia de montaje (Fase 3)
// Cada pieza montada genera tareas reales de taller:
// tornillos (con su herramienta y su conteo), pasta termica
// obligatoria antes de apretar el disipador, cables de la
// fuente (24p, EPS, PCIe, SATA) y errores de montaje cuando
// se usa la herramienta equivocada o falta un paso previo.
// Logica pura: la UI solo pinta el estado que sale de aqui.
// =========================================================

export const TOOLS = {
  hand: { icon: '✋', es: 'Mano', en: 'Hand' },
  screwdriver: { icon: '🪛', es: 'Destornillador Phillips', en: 'Phillips screwdriver' },
  paste: { icon: '🧴', es: 'Pasta térmica', en: 'Thermal paste' }
};

const L = (es, en) => ({ es, en });

// tasksFor(item, ctx) -> lista de tareas de esa pieza.
// ctx: { gpuNeedsPower, storageSata }
export function tasksFor(item, ctx = {}) {
  if (!item) return [];
  switch (item.category) {
    case 'board':
      return [{ id: 'screws', tool: 'screwdriver', count: 6, label: L('Atornillar la placa a los separadores (6 tornillos)', 'Screw the board to the standoffs (6 screws)') }];
    case 'cpu':
      return [{ id: 'paste', tool: 'paste', count: 1, label: L('Aplicar pasta térmica (una gota al centro)', 'Apply thermal paste (a pea-sized drop in the center)') }];
    case 'ram':
      return [{ id: 'seat', tool: 'hand', count: 1, label: L('Presionar la RAM hasta el clic de las pestañas', 'Press the RAM down until the latches click') }];
    case 'storage':
      if (item.specs.mount === 'M.2')
        return [{ id: 'screw', tool: 'screwdriver', count: 1, label: L('Apretar el tornillo M.2', 'Tighten the M.2 screw') }];
      return [{ id: 'sata-data', tool: 'hand', count: 1, label: L('Conectar el cable de datos SATA', 'Connect the SATA data cable') }];
    case 'gpu':
      if (item.id === 'gpu-none') return [];
      return [{ id: 'screws', tool: 'screwdriver', count: 2, label: L('Atornillar la gráfica a la bahía (2 tornillos)', 'Screw the GPU to the bracket (2 screws)') }];
    case 'psu': {
      const list = [
        { id: 'screws', tool: 'screwdriver', count: 4, label: L('Atornillar la fuente al gabinete (4 tornillos)', 'Screw the PSU to the case (4 screws)') },
        { id: 'cable-atx', tool: 'hand', count: 1, needs: 'board', cable: 'atx', label: L('Conectar el cable 24 pines a la placa', 'Connect the 24-pin cable to the board') },
        { id: 'cable-eps', tool: 'hand', count: 1, needs: 'cpu', cable: 'eps', label: L('Conectar el cable EPS 8 pines del procesador', 'Connect the CPU 8-pin EPS cable') }
      ];
      if (ctx.gpuNeedsPower) list.push({ id: 'cable-pcie', tool: 'hand', count: 1, needs: 'gpu', cable: 'pcie', label: L('Conectar el cable PCIe a la gráfica', 'Connect the PCIe cable to the GPU') });
      if (ctx.storageSata) list.push({ id: 'cable-sata', tool: 'hand', count: 1, needs: 'storage', cable: 'sata', label: L('Conectar el poder SATA al disco', 'Connect SATA power to the drive') });
      return list;
    }
    case 'cooler':
      return [{ id: 'mount', tool: 'screwdriver', count: 4, requiresPaste: true, label: L('Apretar los tornillos del disipador en cruz (4)', 'Tighten the cooler screws in a cross pattern (4)') }];
    default:
      return [];
  }
}

export function nextTask(item, progress, ctx) {
  const list = tasksFor(item, ctx);
  for (const task of list) {
    if ((progress[task.id] || 0) < task.count) return task;
  }
  return null;
}
export function partComplete(item, progress, ctx) {
  return nextTask(item, progress, ctx) === null;
}
export function pasteDone(cpuProgress) {
  return (cpuProgress && cpuProgress.paste || 0) >= 1;
}

// Intenta ejecutar la siguiente tarea de la pieza.
// Devuelve {ok} o {ok:false, error:'tool'|'paste'|'needs', task}
export function doNextTask(item, progress, tool, ctx, installed) {
  const task = nextTask(item, progress, ctx);
  if (!task) return { ok: false, error: 'done', task: null };
  if (task.tool !== tool) return { ok: false, error: 'tool', task };
  if (task.requiresPaste && !pasteDone(ctx.cpuProgress)) return { ok: false, error: 'paste', task };
  if (task.needs && !(installed && installed[task.needs])) return { ok: false, error: 'needs', task };
  progress[task.id] = (progress[task.id] || 0) + 1;
  return { ok: true, task, finished: (progress[task.id] >= task.count) };
}

// Resumen global: que falta para poder encender.
export function assemblyPending(installed, assembly, ctx) {
  const pending = [];
  Object.keys(installed).forEach(cat => {
    const item = installed[cat];
    const progress = assembly[item.id] || {};
    tasksFor(item, ctx).forEach(task => {
      const done = progress[task.id] || 0;
      if (done < task.count) pending.push({ cat, item, task, done });
    });
  });
  return pending;
}
