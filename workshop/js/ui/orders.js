// =========================================================
// NVISION PC WORKSHOP - Panel de pedidos (Fase 5)
// Lista de clientes del dia, pedido activo con su checklist
// de entrega en vivo y el nivel del taller. La logica vive
// en core/career.js; esto solo pinta y recoge clics.
// =========================================================
import { currentLang, money } from './hud.js';
import { LEVEL_XP } from '../core/career.js';

const STR = {
  es: { level: 'Nivel', xp: 'XP', delivered: 'entregas', earned: 'ganado', accept: 'Aceptar pedido', deliver: '🚚 Entregar equipo', cancel: 'Abandonar', active: 'Pedido activo', daysLeft: 'días restantes', deadlineToday: '¡vence hoy!', noOrders: 'Sin pedidos nuevos por ahora: avanza un día en la tienda para recibir más clientes.', budget: 'Presupuesto', nextLevel: 'siguiente nivel' },
  en: { level: 'Level', xp: 'XP', delivered: 'deliveries', earned: 'earned', accept: 'Accept order', deliver: '🚚 Deliver the PC', cancel: 'Drop order', active: 'Active order', daysLeft: 'days left', deadlineToday: 'due today!', noOrders: 'No new orders right now: advance a day in the shop to get more clients.', budget: 'Budget', nextLevel: 'next level' }
};
function reqChips(order, lang) {
  const r = order.req, chips = [];
  if (r.needGpu || r.minGpu) chips.push('🎮 GPU ≥ ' + r.minGpu);
  if (r.minCpuWork) chips.push('🧠 CPU ≥ ' + r.minCpuWork);
  chips.push('💾 RAM ≥ ' + r.minRamGb + ' GB');
  chips.push('💿 ≥ ' + (r.minStorageGb >= 1000 ? (r.minStorageGb / 1000) + ' TB' : r.minStorageGb + ' GB'));
  if (r.maxTemp) chips.push('🌡️ ≤ ' + r.maxTemp + ' °C');
  return chips;
}

export function createOrders(handlers) {
  const $ = id => document.getElementById(id);
  const listEl = $('ws-orders'), activeEl = $('ws-active-order'), statsEl = $('ws-career-stats');
  function render(data) {
    if (!listEl) return;
    const lang = currentLang(), s = STR[lang];
    const { career, level, evaluation } = data;
    const nextNeed = LEVEL_XP[level] || null;
    if (statsEl) statsEl.textContent = '⭐ ' + s.level + ' ' + level + ' · ' + career.xp + ' ' + s.xp +
      (nextNeed ? ' (' + (nextNeed - career.xp) + ' ' + (lang === 'en' ? 'to' : 'para el') + ' ' + s.nextLevel + ')' : '') +
      ' · 🚚 ' + career.delivered + ' ' + s.delivered + ' · ' + money(career.earned) + ' ' + s.earned;
    // Pedido activo
    if (activeEl) {
      activeEl.innerHTML = '';
      if (career.active) {
        const o = career.active;
        const left = o.deadlineDay - data.day;
        const card = document.createElement('article');
        card.className = 'ws-order-card ws-order-card--active';
        let checksHtml = '';
        if (evaluation) checksHtml = '<ul class="ws-checks">' + evaluation.checks.map(c =>
          '<li class="' + (c.ok ? 'ok' : 'no') + '">' + (c.ok ? '✅' : '⬜') + ' ' + c.label[lang] + '</li>').join('') + '</ul>';
        card.innerHTML = '<span class="ws-card-cat">' + s.active + ' · ⏰ ' + (left > 0 ? left + ' ' + s.daysLeft : s.deadlineToday) + '</span>' +
          '<b>' + o.icon + ' ' + o.client + ' — ' + o.purposeLabel[lang] + '</b>' +
          '<span class="ws-card-price">' + s.budget + ': ' + money(o.budget) + '</span>' + checksHtml +
          '<span class="ws-shop-btns"><button type="button" class="ws-btn ws-btn--install" data-act="deliver"' + (evaluation && evaluation.ready ? '' : ' disabled') + '>' + s.deliver + '</button>' +
          '<button type="button" class="ws-btn" data-act="cancel">' + s.cancel + '</button></span>';
        card.querySelector('[data-act="deliver"]').addEventListener('click', () => handlers.onDeliver());
        card.querySelector('[data-act="cancel"]').addEventListener('click', () => handlers.onCancel());
        activeEl.appendChild(card);
      }
    }
    // Pedidos disponibles
    listEl.innerHTML = '';
    if (!career.orders.length) listEl.innerHTML = '<p class="ws-note">' + s.noOrders + '</p>';
    career.orders.forEach(o => {
      const card = document.createElement('article');
      card.className = 'ws-order-card';
      card.innerHTML = '<b>' + o.icon + ' ' + o.client + ' — ' + o.purposeLabel[lang] + '</b>' +
        '<span class="ws-card-price">' + s.budget + ': ' + money(o.budget) + '</span>' +
        '<span class="ws-req-chips">' + reqChips(o, lang).map(c => '<span class="ws-chip">' + c + '</span>').join('') + '</span>' +
        '<span class="ws-card-state">⏰ ' + o.days + ' ' + s.daysLeft + '</span>' +
        '<button type="button" class="ws-btn ws-btn--install" data-act="accept"' + (career.active ? ' disabled' : '') + '>' + s.accept + '</button>';
      card.querySelector('[data-act="accept"]').addEventListener('click', () => handlers.onAccept(o));
      listEl.appendChild(card);
    });
  }
  return { setData(data) { render(data); } };
}
