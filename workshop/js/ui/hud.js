// =========================================================
// NVISION PC WORKSHOP - Interfaz (HUD, inventario, mensajes)
// Textos ES/EN propios del Workshop; el idioma activo se
// lee de la misma clave del sitio (user_lang en
// localStorage) para seguir al selector de la navbar.
// =========================================================

export const STRINGS = {
  es: {
    title: 'NVISION PC Workshop',
    subtitle: 'Taller virtual de armado de PC · Fase 1: banco 3D, puntos de montaje y compatibilidad al montar',
    inventory: 'Inventario del taller',
    inventoryHint: 'Toca una pieza para tomarla, suéltala sobre el banco (o pulsa su punto brillante) para montarla. También puedes arrastrarla.',
    bench: 'Banco de trabajo 3D',
    benchHint: 'Arrastra para girar · rueda para zoom · doble clic en una pieza para enfocarla · clic para ver su ficha',
    total: 'Total', watts: 'Consumo est.', progress: 'Progreso',
    power: '⏻ Probar encendido', panelOpen: 'Cerrar panel lateral', panelClosed: 'Abrir panel lateral',
    reset: 'Vaciar el banco', quality: 'Calidad gráfica',
    qLow: 'Baja', qMedium: 'Media', qHigh: 'Alta',
    install: 'Instalar en su punto', remove: 'Retirar al inventario',
    holdingNone: 'Ninguna pieza en la mano. Elige una del inventario.',
    holding: 'En la mano: ', selected: 'Seleccionada: ',
    welcome: 'Bienvenido al taller. Empieza colocando el gabinete en el banco (punto brillante).',
    placed: '✅ Montada: ', removed: '↩️ Pieza retirada al inventario: ',
    cantRemoveCase: 'No puedes retirar el gabinete con piezas dentro: vacíalo primero.',
    openPanelFirst: 'El panel lateral está cerrado: ábrelo antes de montar piezas internas.',
    powerOk: '🎉 ¡El PC enciende! Ventiladores girando y RGB activo. (POST, BIOS y temperaturas llegan en la Fase 4.)',
    powerMissing: 'Todavía no puede encender. Faltan: ',
    savedNote: 'Tu avance de la Fase 1 se guarda solo en este navegador.',
    qualityDropped: '⚙️ Calidad reducida automáticamente para mantener los FPS.',
    webglError: '⚠️ Tu navegador no pudo iniciar WebGL: el banco 3D no está disponible, pero el inventario y las reglas sí cargaron.',
    catNames: { case: 'Gabinete', board: 'Placa base', cpu: 'Procesador', ram: 'Memoria RAM', gpu: 'Tarjeta gráfica', storage: 'Almacenamiento', psu: 'Fuente de poder', cooler: 'Refrigeración' },
    dragHint: 'Suelta sobre el banco para montar…'
  },
  en: {
    title: 'NVISION PC Workshop',
    subtitle: 'Virtual PC building workshop · Phase 1: 3D bench, snap points and fit checks',
    inventory: 'Workshop inventory',
    inventoryHint: 'Tap a part to pick it up, drop it on the bench (or click its glowing point) to mount it. Dragging works too.',
    bench: '3D workbench',
    benchHint: 'Drag to orbit · scroll to zoom · double-click a part to focus it · click for its card',
    total: 'Total', watts: 'Est. draw', progress: 'Progress',
    power: '⏻ Test power-on', panelOpen: 'Close side panel', panelClosed: 'Open side panel',
    reset: 'Clear the bench', quality: 'Graphics quality',
    qLow: 'Low', qMedium: 'Medium', qHigh: 'High',
    install: 'Install on its mount', remove: 'Return to inventory',
    holdingNone: 'Nothing in hand. Pick a part from the inventory.',
    holding: 'In hand: ', selected: 'Selected: ',
    welcome: 'Welcome to the workshop. Start by placing the case on the bench (glowing point).',
    placed: '✅ Mounted: ', removed: '↩️ Part returned to inventory: ',
    cantRemoveCase: 'You cannot remove the case with parts inside: empty it first.',
    openPanelFirst: 'The side panel is closed: open it before mounting internal parts.',
    powerOk: '🎉 The PC powers on! Fans spinning and RGB alive. (POST, BIOS and thermals arrive in Phase 4.)',
    powerMissing: 'It cannot power on yet. Missing: ',
    savedNote: 'Your Phase 1 progress saves automatically in this browser.',
    qualityDropped: '⚙️ Quality lowered automatically to keep the FPS up.',
    webglError: '⚠️ Your browser could not start WebGL: the 3D bench is unavailable, but inventory and rules did load.',
    catNames: { case: 'Case', board: 'Motherboard', cpu: 'Processor', ram: 'Memory (RAM)', gpu: 'Graphics card', storage: 'Storage', psu: 'Power supply', cooler: 'Cooling' },
    dragHint: 'Drop on the bench to mount…'
  }
};

export function currentLang() {
  try { return localStorage.getItem('user_lang') === 'en' ? 'en' : 'es'; } catch (e) { return 'es'; }
}
export function t() { return STRINGS[currentLang()]; }
export function money(n) { return '$' + n.toLocaleString('es-CO'); }

export function createHud(handlers) {
  const $ = id => document.getElementById(id);
  const invEl = $('ws-inventory'), msgEl = $('ws-messages');
  let components = [], installed = {}, holding = null, selectedCat = null, lang = currentLang();

  function applyStaticTexts() {
    const s = t();
    document.querySelectorAll('[data-ws]').forEach(el => {
      const k = el.getAttribute('data-ws');
      if (s[k]) el.textContent = s[k];
    });
    const q = $('ws-quality');
    if (q) { q.options[0].textContent = s.qLow; q.options[1].textContent = s.qMedium; q.options[2].textContent = s.qHigh; }
    render();
  }
  function log(text, kind) {
    const li = document.createElement('li');
    li.className = 'ws-msg ws-msg--' + (kind || 'info');
    li.textContent = text;
    msgEl.prepend(li);
    while (msgEl.children.length > 7) msgEl.removeChild(msgEl.lastChild);
  }
  function specLine(item) {
    const sp = item.specs || {};
    const bits = [];
    if (sp.socket) bits.push(sp.socket);
    if (sp.cores) bits.push(sp.cores + ' núcleos');
    if (sp.type) bits.push(sp.type + ' ' + (sp.speed || ''));
    if (sp.gb) bits.push(sp.gb + ' GB');
    if (sp.lenMm) bits.push(sp.lenMm + ' mm');
    if (sp.vramGb) bits.push(sp.vramGb + ' GB VRAM');
    if (sp.wattsOut) bits.push(sp.wattsOut + ' W');
    if (sp.form) bits.push(sp.form);
    if (sp.gpuMaxMm) bits.push('GPU ≤ ' + sp.gpuMaxMm + ' mm');
    if (sp.interface) bits.push(sp.interface);
    if (sp.radiatorMm) bits.push(sp.radiatorMm + ' mm');
    return bits.join(' · ');
  }
  function render() {
    const s = t();
    invEl.innerHTML = '';
    components.forEach(item => {
      const isIn = !!installed[item.category];
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'ws-card' + (holding && holding.id === item.id ? ' ws-card--holding' : '') + (isIn ? ' ws-card--in' : '');
      card.setAttribute('data-id', item.id);
      card.innerHTML = '<span class="ws-card-cat">' + (s.catNames[item.category] || item.category) + '</span>' +
        '<b>' + item.name + '</b>' +
        '<span class="ws-card-specs">' + specLine(item) + '</span>' +
        '<span class="ws-card-blurb">' + (item.blurb[s ? currentLang() : 'es'] || item.blurb.es || '') + '</span>' +
        '<span class="ws-card-foot"><span class="ws-card-price">' + money(item.price) + '</span>' +
        '<span class="ws-card-state">' + (isIn ? '🔩 En el PC' : '📦 En inventario') + '</span></span>';
      card.addEventListener('click', () => handlers.onPick(item));
      card.addEventListener('pointerdown', ev => handlers.onDragStart(item, ev));
      invEl.appendChild(card);
    });
    // HUD
    const total = Object.values(installed).reduce((a, c) => a + (c ? c.price : 0), 0);
    $('ws-hud-total').textContent = money(total);
    let w = 60;
    Object.values(installed).forEach(c => { if (c && c.watts) w += c.watts; });
    $('ws-hud-watts').textContent = Object.keys(installed).length ? w + ' W' : '—';
    const done = Object.keys(installed).length;
    $('ws-hud-progress').textContent = done + ' / 8';
    $('ws-progress-bar').style.width = (done / 8 * 100) + '%';
    // panel de la mano / seleccion
    $('ws-holding-text').textContent = holding ? s.holding + holding.name : s.holdingNone;
    $('ws-install-btn').style.display = holding ? '' : 'none';
    const selItem = selectedCat ? installed[selectedCat] : null;
    $('ws-selected').style.display = selItem ? '' : 'none';
    if (selItem) $('ws-selected-text').textContent = s.selected + selItem.name + ' (' + (s.catNames[selectedCat]) + ')';
  }
  // seguir el selector de idioma del sitio
  setInterval(() => {
    const now = currentLang();
    if (now !== lang) { lang = now; applyStaticTexts(); }
  }, 700);

  return {
    setData(c, i) { components = c; installed = i; render(); },
    refresh() { render(); },
    setHolding(h) { holding = h; render(); },
    setSelected(cat) { selectedCat = cat; render(); },
    log,
    applyStaticTexts,
    t
  };
}
