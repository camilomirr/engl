// =========================================================
// NVISION PC WORKSHOP - Economia (Fase 2)
// Dinero, tienda con stock y precios que varian por dia
// (variacion determinista: mismo dia = mismos precios),
// compra/venta y guardado v2 con migracion de la Fase 1.
// Las funciones de compra/venta son puras sobre el estado.
// =========================================================

export const SAVE_KEY_V2 = 'nvision_workshop_v2';
export const SAVE_KEY_V1 = 'nvision_workshop_fase1';
export const START_MONEY = 1500;
// El kit con el que el taller abre (las piezas de la Fase 1)
export const STARTER_IDS = ['case-airflow-atx', 'board-b650-atx', 'cpu-7800x3d', 'cpu-12400f',
  'ram-32-ddr5', 'ram-16-ddr4', 'gpu-rtx4060', 'gpu-rtx4090', 'storage-nvme-1tb',
  'psu-750-gold', 'psu-350-bronze', 'cooler-aio240'];

export function freshState() {
  const owned = {};
  STARTER_IDS.forEach(id => { owned[id] = 1; });
  return { money: START_MONEY, day: 1, owned, installed: {}, shopSold: {}, assembly: {} };
}

export function loadState() {
  try {
    const v2 = JSON.parse(localStorage.getItem(SAVE_KEY_V2) || 'null');
    if (v2 && typeof v2.money === 'number' && v2.owned) return Object.assign(freshState(), v2);
    const v1 = JSON.parse(localStorage.getItem(SAVE_KEY_V1) || 'null');
    if (v1) {
      const st = freshState();
      st.installed = v1; // los ids montados en la Fase 1 ya eran del jugador
      Object.values(v1).forEach(id => { st.owned[id] = Math.max(st.owned[id] || 0, 1); });
      return st;
    }
  } catch (e) {}
  return freshState();
}

export function saveState(state) {
  try { localStorage.setItem(SAVE_KEY_V2, JSON.stringify(state)); } catch (e) {}
}

// hash sencillo y estable para que el precio del dia no
// dependa de Math.random (todos ven el mismo "mercado")
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967295;
}
export function priceToday(item, day) {
  const f = 0.92 + hashStr(item.id + '@' + day) * 0.16; // -8% .. +8%
  return Math.max(5, Math.round(item.price * f));
}
export function baseStock(item) {
  if (item.price >= 900) return 2;
  if (item.price >= 400) return 3;
  return 4;
}
export function stockLeft(state, item) {
  return Math.max(0, baseStock(item) - (state.shopSold[item.id] || 0));
}
export function buy(state, item) {
  const price = priceToday(item, state.day);
  if (stockLeft(state, item) <= 0) return { ok: false, reason: 'nostock' };
  if (state.money < price) return { ok: false, reason: 'nomoney', price };
  state.money -= price;
  state.owned[item.id] = (state.owned[item.id] || 0) + 1;
  state.shopSold[item.id] = (state.shopSold[item.id] || 0) + 1;
  return { ok: true, price };
}
export function sell(state, item, isInstalled) {
  if (isInstalled) return { ok: false, reason: 'installed' };
  if (!(state.owned[item.id] > 0)) return { ok: false, reason: 'notowned' };
  const gain = Math.floor(priceToday(item, state.day) * 0.7);
  state.money += gain;
  state.owned[item.id] -= 1;
  if (state.owned[item.id] <= 0) delete state.owned[item.id];
  return { ok: true, gain };
}
export function advanceDay(state) {
  state.day += 1;
  state.shopSold = {};
  return state.day;
}
