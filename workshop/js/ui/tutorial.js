// =========================================================
// NVISION PC WORKSHOP - Tutorial guiado (Fase 7)
// Tarjeta paso a paso que resalta el elemento real de la
// pagina en cada paso. Se muestra solo la primera vez (la
// marca queda en el guardado) y se puede repetir con el
// boton 🎓 Tutorial.
// =========================================================
const L = (es, en) => ({ es, en });
export const TUTORIAL_STEPS = [
  { el: 'ws-inventory', text: L('Este es tu inventario. Toca una pieza para tomarla: primero el gabinete.', 'This is your inventory. Tap a part to pick it up: start with the case.') },
  { el: 'ws-canvas-wrap', text: L('Suelta la pieza sobre su punto brillante en el banco 3D (o usa el botón «Instalar en su punto»). Gira con el ratón y acerca con la rueda.', 'Drop the part onto its glowing snap point on the 3D bench (or use the "Install" button). Drag to orbit, scroll to zoom.') },
  { el: 'ws-panel-btn', text: L('Con este botón abres y cierras el panel lateral del gabinete para montar las piezas internas.', 'This button opens and closes the case side panel so you can fit the inner parts.') },
  { el: 'ws-tasks', text: L('Cada pieza montada tiene tareas: elige la herramienta correcta (mano, destornillador, pasta térmica) y haz los pasos en orden.', 'Every fitted part has tasks: pick the right tool (hand, screwdriver, thermal paste) and do the steps in order.') },
  { el: 'ws-power-btn', text: L('Cuando el montaje esté completo, prueba el encendido: verás el POST en el monitor, podrás instalar NVISION OS y pasar la prueba de carga.', 'When assembly is complete, try the power button: you will see the POST on the monitor, install NVISION OS and run the stress test.') },
  { el: 'ws-orders', text: L('En Pedidos aceptas encargos de clientes: cumple su lista (rendimiento, presupuesto, temperatura) y entrega el equipo para ganar dinero y XP.', 'In Orders you take client jobs: meet their checklist (performance, budget, temperature) and deliver the rig to earn money and XP.') },
  { el: 'ws-shop', text: L('En la tienda compras y vendes piezas. Los precios cambian cada día: compra barato, vende caro y sube de nivel para desbloquear hardware.', 'In the shop you buy and sell parts. Prices change daily: buy low, sell high and level up to unlock better hardware.') }
];
export function createTutorial(lang, onDone) {
  // lang puede ser el idioma ('es'/'en') o una funcion que lo devuelve,
  // para que el tutorial salga en el idioma activo aunque cambie despues.
  const getLang = typeof lang === 'function' ? lang : () => lang;
  let idx = -1, card = null, currentEl = null;
  function cleanup() {
    if (currentEl) currentEl.classList.remove('ws-highlight');
    currentEl = null;
    if (card) { card.remove(); card = null; }
    idx = -1;
  }
  function show(i) {
    const step = TUTORIAL_STEPS[i];
    if (!step) { cleanup(); if (onDone) onDone(); return; }
    idx = i;
    if (currentEl) currentEl.classList.remove('ws-highlight');
    currentEl = document.getElementById(step.el);
    if (currentEl) {
      currentEl.classList.add('ws-highlight');
      currentEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    if (!card) {
      card = document.createElement('div');
      card.className = 'ws-tutorial';
      card.setAttribute('role', 'dialog');
      card.setAttribute('aria-live', 'polite');
      document.body.appendChild(card);
    }
    const langNow = getLang();
    const en = langNow === 'en';
    card.innerHTML = '<b>🎓 ' + (en ? 'Workshop tour' : 'Visita guiada') + ' · ' + (i + 1) + '/' + TUTORIAL_STEPS.length + '</b>' +
      '<p>' + step.text[langNow] + '</p>' +
      '<div class="ws-tutorial-btns">' +
      '<button type="button" class="ws-btn" data-tut="skip">' + (en ? 'Skip' : 'Omitir') + '</button>' +
      '<button type="button" class="ws-btn ws-btn--install" data-tut="next">' + (i === TUTORIAL_STEPS.length - 1 ? (en ? 'Finish' : 'Terminar') : (en ? 'Next' : 'Siguiente')) + '</button>' +
      '</div>';
    card.querySelector('[data-tut="next"]').addEventListener('click', () => show(i + 1));
    card.querySelector('[data-tut="skip"]').addEventListener('click', () => { cleanup(); if (onDone) onDone(); });
  }
  return {
    start() { show(0); },
    stop: cleanup,
    get active() { return idx >= 0; }
  };
}
