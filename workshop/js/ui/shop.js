// =========================================================
// NVISION PC WORKSHOP - Tienda (Fase 2)
// Catalogo completo con filtros por categoria, busqueda y
// orden; precios del dia y stock visible; comprar y vender
// (la venta devuelve el 70% y no aplica a piezas montadas).
// =========================================================
import { priceToday, stockLeft } from '../core/economy.js?v=5';
import { t, money, currentLang } from './hud.js?v=5';

export function createShop(handlers) {
  const $ = id => document.getElementById(id);
  const grid = $('ws-shop');
  let components = [], state = null, playerLevel = 1, catFilter = 'all', query = '', sortBy = 'price-asc';

  function visible() {
    let items = components.slice();
    if (catFilter !== 'all') items = items.filter(i => i.category === catFilter);
    if (query) items = items.filter(i => (i.name + ' ' + (i.blurb.es || '')).toLowerCase().includes(query));
    const price = i => priceToday(i, state ? state.day : 1);
    if (sortBy === 'price-asc') items.sort((a, b) => price(a) - price(b));
    if (sortBy === 'price-desc') items.sort((a, b) => price(b) - price(a));
    if (sortBy === 'perf') items.sort((a, b) => ((b.perf.gaming || b.perf.score || b.perf.cooling || 0) - (a.perf.gaming || a.perf.score || a.perf.cooling || 0)));
    return items;
  }
  function render() {
    if (!grid || !state) return;
    const s = t();
    grid.innerHTML = '';
    const items = visible();
    if (!items.length) grid.innerHTML = '<p class="ws-note">Sin resultados para ese filtro.</p>';
    items.forEach(item => {
      const price = priceToday(item, state.day);
      const left = stockLeft(state, item);
      const owned = state.owned[item.id] || 0;
      const locked = (item.unlockLevel || 1) > playerLevel;
      const delta = item.price ? Math.round((price / item.price - 1) * 100) : 0;
      const card = document.createElement('article');
      card.className = 'ws-shop-card';
      card.innerHTML =
        '<span class="ws-card-cat">' + (s.catNames[item.category] || item.category) + (owned ? ' · ×' + owned + ' en tu taller' : '') + (locked ? ' · 🔒 Nivel ' + item.unlockLevel : '') + '</span>' +
        '<b>' + item.name + '</b>' +
        '<span class="ws-card-blurb">' + (item.blurb[currentLang()] || item.blurb.es || '') + '</span>' +
        '<span class="ws-shop-row"><span class="ws-card-price">' + money(price) +
        (delta ? ' <small class="' + (delta < 0 ? 'ws-down' : 'ws-up') + '">' + (delta > 0 ? '▲' : '▼') + ' ' + Math.abs(delta) + '%</small>' : '') +
        '</span><span class="ws-card-state">' + (left > 0 ? 'Stock: ' + left : '⛔ Agotado hoy') + '</span></span>' +
        '<span class="ws-shop-btns">' +
        '<button type="button" class="ws-btn ws-btn--install" data-act="buy"' + (locked || left <= 0 || state.money < price ? ' disabled' : '') + '>🛒 ' + s.buy + '</button>' +
        '<button type="button" class="ws-btn" data-act="sell"' + (owned <= 0 ? ' disabled' : '') + '>' + s.sell + ' ' + money(Math.floor(price * 0.7)) + '</button></span>';
      card.querySelector('[data-act="buy"]').addEventListener('click', () => handlers.onBuy(item));
      card.querySelector('[data-act="sell"]').addEventListener('click', () => handlers.onSell(item));
      grid.appendChild(card);
    });
  }
  const catSel = $('ws-shop-cat'), searchEl = $('ws-shop-search'), sortEl = $('ws-shop-sort');
  if (catSel) catSel.addEventListener('change', () => { catFilter = catSel.value; render(); });
  if (searchEl) searchEl.addEventListener('input', () => { query = searchEl.value.trim().toLowerCase(); render(); });
  if (sortEl) sortEl.addEventListener('change', () => { sortBy = sortEl.value; render(); });
  return {
    setData(c, st, lvl) { components = c; state = st; if (lvl) playerLevel = lvl; render(); },
    refresh() { render(); }
  };
}
