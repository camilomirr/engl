// =========================================================
// NVISION PC WORKSHOP - Modo carrera (Fase 5)
// Clientes con pedidos (presupuesto y requisitos), checklist
// de entrega evaluado contra el equipo del banco, XP y
// niveles que desbloquean piezas de la tienda. Los pedidos
// del dia son deterministas (mismo dia = mismos clientes).
// Logica pura; la UI vive en ui/orders.js.
// =========================================================
import { temps } from './boot.js';

const L = (es, en) => ({ es, en });
export const LEVEL_XP = [0, 250, 600, 1200, 2200, 4000];
export function levelFor(xp) {
  let lvl = 1;
  LEVEL_XP.forEach((need, i) => { if (xp >= need) lvl = i + 1; });
  return lvl;
}
export function xpGainFor(order) { return 80 + Math.round(order.budget / 25); }

const CLIENTS = ['Camila R.', 'Santiago P.', 'Valentina M.', 'Andrés G.', 'Mariana T.', 'Felipe C.', 'Laura D.', 'Diego H.', 'Sofía L.', 'Mateo V.', 'Isabella F.', 'Tomás A.', 'Luciana B.', 'Emilio S.'];
const PURPOSES = [
  { id: 'gaming', icon: '🎮', label: L('PC gamer', 'Gaming PC') },
  { id: 'oficina', icon: '🏢', label: L('PC de oficina', 'Office PC') },
  { id: 'creador', icon: '🎬', label: L('Estación de creación', 'Creator workstation') },
  { id: 'streaming', icon: '📺', label: L('PC para streaming', 'Streaming PC') }
];
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  // Mezcla final (avalancha): el FNV puro apenas mueve los bits
  // altos cuando solo cambia un caracter de la semilla, y los 3
  // pedidos del mismo dia salian casi siempre con el mismo
  // proposito (y cliente/presupuesto correlados). Con la mezcla,
  // cada hueco del dia varia de verdad; sigue siendo
  // determinista: mismo dia = mismos pedidos.
  h ^= h >>> 16;
  h = Math.imul(h, 0x45d9f3b);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}
function pick(seed, arr) { return arr[Math.floor(hashStr(seed) * arr.length) % arr.length]; }

// Genera los 3 pedidos visibles de un dia segun el nivel.
export function genOrders(day, level) {
  const ranges = { 1: [650, 1150], 2: [1100, 1800], 3: [1700, 2600], 4: [2400, 3400], 5: [3200, 4500], 6: [4200, 6000] };
  const [lo, hi] = ranges[Math.min(6, Math.max(1, level))] || ranges[1];
  const orders = [];
  for (let slot = 0; slot < 3; slot++) {
    const seed = 'career@' + day + '#' + slot;
    const purpose = pick(seed + 'p', PURPOSES);
    const budget = Math.round((lo + hashStr(seed + 'b') * (hi - lo)) / 10) * 10;
    const tier = Math.min(3, 1 + Math.floor(hashStr(seed + 't') * 3) + Math.floor((level - 1) / 2)); // 1..3+ segun nivel
    const req = { minGpu: 0, minCpuWork: 0, minRamGb: 8, minStorageGb: 500, needGpu: false, maxTemp: 0 };
    if (purpose.id === 'gaming') { req.minGpu = [45, 62, 80][tier - 1] || 45; req.needGpu = true; req.minRamGb = 16; req.minStorageGb = 1000; req.maxTemp = [0, 95, 88][tier - 1] || 0; }
    if (purpose.id === 'oficina') { req.minRamGb = [8, 16, 16][tier - 1]; req.minStorageGb = [500, 500, 1000][tier - 1]; req.minCpuWork = [0, 35, 45][tier - 1] || 0; }
    if (purpose.id === 'creador') { req.minCpuWork = [50, 68, 85][tier - 1] || 50; req.minRamGb = [16, 32, 32][tier - 1]; req.minStorageGb = [1000, 2000, 2000][tier - 1]; req.minGpu = [0, 40, 55][tier - 1] || 0; }
    if (purpose.id === 'streaming') { req.minGpu = [50, 65, 78][tier - 1] || 50; req.needGpu = true; req.minCpuWork = [45, 60, 72][tier - 1] || 45; req.minRamGb = 16; req.minStorageGb = 1000; }
    orders.push({
      id: 'ord-' + day + '-' + slot,
      client: pick(seed + 'c', CLIENTS),
      purpose: purpose.id, icon: purpose.icon, purposeLabel: purpose.label,
      budget, req, days: 3
    });
  }
  return orders;
}

export function buildCost(installed) {
  return Object.values(installed).reduce((sum, i) => sum + (i.price || 0), 0);
}

// Checklist de entrega contra el estado actual del taller.
// state: { missing:[], pendingCount, osInstalled, lastStress }
export function evaluate(order, installed, state) {
  const checks = [];
  const add = (label, ok) => checks.push({ label, ok: !!ok });
  const gpu = installed.gpu, cpu = installed.cpu, ram = installed.ram, st = installed.storage;
  add(L('Equipo completo (8 piezas montadas)', 'Complete build (8 parts mounted)'), state.missing.length === 0);
  add(L('Montaje paso a paso terminado', 'Step-by-step assembly finished'), state.pendingCount === 0 && state.missing.length === 0);
  add(L('Sistema operativo instalado', 'Operating system installed'), state.osInstalled);
  add(L('Prueba de carga superada (estable o con throttling leve)', 'Stress test passed (stable or mild throttling)'), state.lastStress === 'ok' || state.lastStress === 'throttle');
  if (order.req.needGpu || order.req.minGpu > 0)
    add(L(`Gráfica dedicada con rendimiento ≥ ${order.req.minGpu}`, `Dedicated GPU with performance ≥ ${order.req.minGpu}`),
      gpu && gpu.id !== 'gpu-none' && (gpu.perf.gaming || 0) >= order.req.minGpu);
  if (order.req.minCpuWork > 0)
    add(L(`CPU de trabajo ≥ ${order.req.minCpuWork}`, `CPU work score ≥ ${order.req.minCpuWork}`), cpu && (cpu.perf.work || 0) >= order.req.minCpuWork);
  add(L(`RAM ≥ ${order.req.minRamGb} GB`, `RAM ≥ ${order.req.minRamGb} GB`), ram && ram.specs.gb >= order.req.minRamGb);
  add(L(`Almacenamiento ≥ ${order.req.minStorageGb} GB`, `Storage ≥ ${order.req.minStorageGb} GB`), st && st.specs.gb >= order.req.minStorageGb);
  if (order.req.maxTemp > 0) {
    const t = temps(installed);
    add(L(`Temperatura en carga ≤ ${order.req.maxTemp} °C (ahora: ${t.load} °C)`, `Load temperature ≤ ${order.req.maxTemp} °C (now: ${t.load} °C)`), t.load > 0 && t.load <= order.req.maxTemp);
  }
  const cost = buildCost(installed);
  add(L(`Costo de piezas dentro del presupuesto ($${cost} de $${order.budget})`, `Parts cost within budget ($${cost} of $${order.budget})`), cost > 0 && cost <= order.budget);
  return { checks, ready: checks.every(c => c.ok), cost };
}

// Aplica la entrega sobre el estado del juego (sin tocar la
// escena: eso lo hace la UI). Devuelve el resumen del pago.
export function applyDelivery(game, installed, order) {
  const gain = xpGainFor(order);
  game.money += order.budget;
  Object.values(installed).forEach(item => {
    if (game.owned[item.id] > 0) {
      game.owned[item.id] -= 1;
      if (game.owned[item.id] <= 0) delete game.owned[item.id];
    }
  });
  game.career.xp += gain;
  game.career.delivered += 1;
  game.career.earned += order.budget;
  const newLevel = levelFor(game.career.xp);
  const leveledUp = newLevel > (game.career.level || 1);
  game.career.level = newLevel;
  game.career.active = null;
  game.career.orders = game.career.orders.filter(o => o.id !== order.id);
  return { payment: order.budget, xpGain: gain, newLevel, leveledUp };
}
