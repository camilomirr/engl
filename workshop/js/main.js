// =========================================================
// NVISION PC WORKSHOP - Entrada principal (Fase 1)
// Une catalogo (JSON), reglas de compatibilidad, escena 3D
// y HUD. Flujo de montaje: tomar pieza -> soltar en el
// banco / clic en el punto brillante / boton Instalar ->
// las reglas validan -> la pieza vuela a su punto de
// montaje. El avance se guarda en localStorage.
// =========================================================
import { loadComponents } from './data/catalog.js?v=8';
import { checkPlacement, missingParts, REQUIRED } from './core/rules.js?v=8';
import { createScene } from './core/scene.js?v=8';
import { loadState, saveState, buy as ecoBuy, sell as ecoSell, advanceDay } from './core/economy.js?v=8';
import { createShop } from './ui/shop.js?v=8';
import { tasksFor, doNextTask, assemblyPending, TOOLS } from './core/assembly.js?v=8';
import { createTasksPanel } from './ui/tasks.js?v=8';
import { runPost, biosRows, stressTest, temps } from './core/boot.js?v=8';
import { createMonitor } from './ui/monitor.js?v=8';
import { genOrders, evaluate as evalOrder, applyDelivery, levelFor } from './core/career.js?v=8';
import { createOrders } from './ui/orders.js?v=8';
import { createHud, t } from './ui/hud.js?v=8';

const installed = {};   // categoria -> componente
const game = loadState(); // dinero, dia, inventario propio y armado guardado
let components = [];
let holding = null;
let scene = null;
let selectedCat = null;

const hud = createHud({
  onPick(item) { pick(item); },
  onDragStart(item, ev) { startDrag(item, ev); }
});

const shop = createShop({
  onBuy(item) {
    const s = t();
    const r = ecoBuy(game, item);
    if (!r.ok) { hud.log(r.reason === 'nostock' ? s.noStock : s.noMoney + '$' + r.price, 'err'); return; }
    hud.log(s.bought + item.name + ' (-$' + r.price + ')', 'ok');
    save();
  },
  onSell(item) {
    const s = t();
    const isIn = installed[item.category] && installed[item.category].id === item.id;
    const r = ecoSell(game, item, isIn);
    if (!r.ok) { hud.log(r.reason === 'installed' ? s.cantSellInstalled : s.noStock, 'err'); return; }
    hud.log(s.sold + item.name + ' (+$' + r.gain + ')', 'ok');
    save();
  }
});
const lang = () => (localStorage.getItem('user_lang') === 'en' ? 'en' : 'es');
function buildCtx() {
  return {
    gpuNeedsPower: !!(installed.gpu && installed.gpu.id !== 'gpu-none' && installed.gpu.specs.powerNeed && installed.gpu.specs.powerNeed !== 'none'),
    storageSata: !!(installed.storage && installed.storage.specs.mount !== 'M.2'),
    cpuProgress: installed.cpu ? (game.assembly[installed.cpu.id] || {}) : {}
  };
}
function progressFor(item) {
  if (!game.assembly[item.id]) game.assembly[item.id] = {};
  return game.assembly[item.id];
}
const tasksPanel = createTasksPanel({
  onTool() {},
  onDo() { doStep(); }
});
function refreshTasks() {
  const item = selectedCat ? installed[selectedCat] : null;
  if (!item) { tasksPanel.setView(null); return; }
  const progress = progressFor(item);
  tasksPanel.setView({
    partName: item.name,
    tasks: tasksFor(item, buildCtx()).map(tk => ({ label: tk.label[lang()], tool: tk.tool, count: tk.count, done: progress[tk.id] || 0 }))
  });
}
// ---------------- Fase 4: arranque, BIOS, SO, termicas ----------------
const monitor = createMonitor();
let bootState = 'off'; // off | needos | desktop
const wait = ms => new Promise(r => setTimeout(r, ms));
function setBtn(id, on) { const b = document.getElementById(id); if (b) b.disabled = !on; }
function updateMonitorBtns() {
  setBtn('ws-bios-btn', bootState === 'needos' || bootState === 'desktop');
  setBtn('ws-os-btn', bootState === 'needos');
  setBtn('ws-stress-btn', bootState === 'desktop');
  const x = document.getElementById('ws-xmp-btn');
  if (x) x.textContent = '⚡ XMP/EXPO: ' + (game.system.xmp ? 'ON' : 'OFF');
}
function powerDown(msg) {
  if (scene) scene.setPowered(false);
  bootState = 'off';
  monitor.off(msg || (lang() === 'en' ? '— No signal —' : '— Sin señal —'));
  updateMonitorBtns();
}
function showDesktop() {
  const tp = temps(installed);
  const en = lang() === 'en';
  monitor.desktop('<div class="ws-desktop"><div class="ws-desk-emoji">🖥️</div><b>NVISION OS</b><p>' +
    (en ? 'Desktop ready' : 'Escritorio listo') + ' · CPU ' + tp.idle + ' °C ' + (en ? 'idle' : 'en reposo') + ' · ' + tp.load + ' °C ' + (en ? 'est. load' : 'carga est.') + '</p><p class="ws-line--dim">' +
    (en ? 'Run the stress test to check stability.' : 'Pasa la prueba de carga para comprobar la estabilidad.') + '</p></div>');
  bootState = 'desktop';
  updateMonitorBtns();
}
async function bootFlow() {
  const s = t();
  const missing = missingParts(installed);
  if (missing.length) {
    hud.log(s.powerMissing + missing.map(c => s.catNames[c]).join(', ') + '.', 'err');
    powerDown();
    return;
  }
  const pending = assemblyPending(installed, game.assembly, buildCtx());
  if (pending.length) {
    pending.slice(0, 4).forEach(p => hud.log('🔧 Falta: ' + p.task.label[lang()] + ' — ' + p.item.name + ' (' + p.done + '/' + p.task.count + ')', 'err'));
    hud.log('Termina el montaje paso a paso antes de encender.', 'err');
    powerDown();
    return;
  }
  if (scene) scene.setPowered(true);
  const post = runPost(installed, game.system);
  const completed = await monitor.playLines(post.lines, lang());
  if (!completed) return;
  if (!post.ok) {
    monitor.fault(post.fault, lang());
    hud.log('⛔ POST: ' + post.fault.title[lang()], 'err');
    if (scene) scene.setPowered(false);
    bootState = 'off';
    updateMonitorBtns();
    return;
  }
  hud.log(s.powerOk, 'ok');
  if (!game.system.osInstalled) {
    bootState = 'needos';
    monitor.line(lang() === 'en' ? 'No operating system found — press "Install system".' : 'Sin sistema operativo — pulsa «Instalar sistema».', 'warn');
    updateMonitorBtns();
  } else {
    showDesktop();
  }
}
function doStep() {
  const item = selectedCat ? installed[selectedCat] : null;
  if (!item) return;
  const progress = progressFor(item);
  const res = doNextTask(item, progress, tasksPanel.getTool(), buildCtx(), installed);
  if (!res.ok) {
    if (res.error === 'tool') hud.log('🧰 Para ese paso necesitas: ' + TOOLS[res.task.tool].icon + ' ' + TOOLS[res.task.tool][lang()], 'err');
    else if (res.error === 'paste') hud.log('🧴 ¡Falta la pasta térmica! Selecciona el procesador, elige la herramienta de pasta y aplícala antes de apretar el disipador.', 'err');
    else if (res.error === 'needs') hud.log('🔌 Ese cable necesita la pieza destino montada primero.', 'err');
    refreshTasks();
    return;
  }
  if (res.task.id === 'paste' && scene) scene.setPaste(true);
  if (res.task.cable && scene) scene.setCable(res.task.cable, true);
  hud.log('🔧 ' + res.task.label[lang()] + (res.finished ? ' ✅' : ' (' + progress[res.task.id] + '/' + res.task.count + ')'), 'ok');
  save();
}
function applyAssemblyFx() {
  if (!scene) return;
  const ctx = buildCtx();
  if (installed.cpu && (game.assembly[installed.cpu.id] || {}).paste >= 1) scene.setPaste(true);
  if (installed.psu) {
    const progress = game.assembly[installed.psu.id] || {};
    tasksFor(installed.psu, ctx).forEach(tk => { if (tk.cable && (progress[tk.id] || 0) >= tk.count) scene.setCable(tk.cable, true); });
  }
}
// ---------------- Fase 5: modo carrera ----------------
function ensureOrders() {
  const c = game.career;
  if (c.active && game.day > c.active.deadlineDay) {
    hud.log('⏰ El pedido de ' + c.active.client + ' venció y se canceló solo.', 'err');
    c.active = null;
  }
  if (c.ordersDay !== game.day) {
    c.orders = genOrders(game.day, levelFor(c.xp)).filter(o => !c.active || o.id !== c.active.id);
    c.ordersDay = game.day;
  }
}
function evalState() {
  return {
    missing: missingParts(installed),
    pendingCount: assemblyPending(installed, game.assembly, buildCtx()).length,
    osInstalled: !!game.system.osInstalled,
    lastStress: game.system.lastStress
  };
}
const ordersPanel = createOrders({
  onAccept(order) {
    game.career.active = { ...order, deadlineDay: game.day + order.days };
    game.career.orders = game.career.orders.filter(o => o.id !== order.id);
    hud.log('📋 Pedido aceptado: ' + order.client + ' — ' + order.purposeLabel[lang()] + ' por $' + order.budget + '. ¡A armar!', 'ok');
    save();
  },
  onCancel() {
    if (!game.career.active) return;
    hud.log('Pedido de ' + game.career.active.client + ' abandonado.', 'info');
    game.career.active = null;
    save();
  },
  onDeliver() {
    const order = game.career.active;
    if (!order) return;
    const ev = evalOrder(order, installed, evalState());
    if (!ev.ready) { hud.log('🚚 Todavía falta: revisa la lista del pedido activo.', 'err'); return; }
    const res = applyDelivery(game, { ...installed }, order);
    Object.keys(installed).slice().reverse().forEach(cat => { if (scene) scene.remove(cat); delete installed[cat]; });
    game.assembly = {};
    game.system.osInstalled = false;
    game.system.lastStress = null;
    if (scene) { scene.setPaste(false); ['atx', 'eps', 'pcie', 'sata'].forEach(k => scene.setCable(k, false)); }
    powerDown();
    hud.log('🚚 ¡Equipo entregado a ' + order.client + '! Cobraste $' + res.payment + ' y ganaste ' + res.xpGain + ' XP.', 'ok');
    if (res.leveledUp) hud.log('⭐ ¡Subiste al nivel ' + res.newLevel + '! La tienda desbloqueó piezas nuevas.', 'ok');
    save();
  }
});
function syncUI() {
  ensureOrders();
  hud.setData(components, installed, game.owned, game);
  shop.setData(components, game, levelFor(game.career.xp));
  ordersPanel.setData({
    career: game.career, level: levelFor(game.career.xp), day: game.day,
    evaluation: game.career.active ? evalOrder(game.career.active, installed, evalState()) : null
  });
  refreshTasks();
}
function save() {
  const ids = {};
  Object.keys(installed).forEach(k => { ids[k] = installed[k].id; });
  game.installed = ids;
  saveState(game);
  syncUI();
}
function restore() {
  const ids = game.installed || {};
  REQUIRED.forEach(cat => {
    const item = components.find(c => c.id === ids[cat]);
    if (item) { installed[cat] = item; if (scene) scene.place(cat, item); }
  });
}

function pick(item) {
  if (installed[item.category] && installed[item.category].id === item.id) {
    // tocar la tarjeta de lo ya montado selecciona la pieza en la escena
    if (scene) scene.focus(item.category);
    selectedCat = item.category;
    hud.setSelected(item.category);
    refreshTasks();
    return;
  }
  holding = item;
  hud.setHolding(item);
  if (scene) scene.showMarkersFor(item.category);
}

function attemptPlace(item) {
  const s = t();
  if (!item) return;
  if (scene && installed.case && item.category !== 'case' && !scene.isPanelOpen()) {
    hud.log(s.openPanelFirst, 'err');
    return;
  }
  const chk = checkPlacement(item, installed);
  if (!chk.ok) {
    chk.reasons.forEach(r => hud.log('⛔ ' + (document.documentElement.lang === 'en' || localStorage.getItem('user_lang') === 'en' ? r.en : r.es), 'err'));
    return;
  }
  chk.warnings.forEach(r2 => hud.log('⚠️ ' + (localStorage.getItem('user_lang') === 'en' ? r2.en : r2.es), 'warn'));
  if (installed[item.category] && scene) scene.remove(item.category);
  installed[item.category] = item;
  if (scene) { scene.place(item.category, item); scene.setPowered(false); }
  if (bootState !== 'off') powerDown(lang() === 'en' ? '— No signal — You changed parts: power on again.' : '— Sin señal — Cambiaste piezas: vuelve a encender el equipo.');
  game.system.lastStress = null;
  if (item.category === 'storage') game.system.osInstalled = false;
  holding = null;
  selectedCat = item.category;
  hud.setSelected(item.category);
  hud.setHolding(null);
  if (scene) scene.showMarkersFor(null);
  hud.log(s.placed + item.name, 'ok');
  save();
}

function removePart(cat) {
  const s = t();
  if (cat === 'case' && Object.keys(installed).length > 1) {
    hud.log(s.cantRemoveCase, 'err');
    return;
  }
  const item = installed[cat];
  if (!item) return;
  if (bootState !== 'off') powerDown(lang() === 'en' ? '— No signal — You changed parts: power on again.' : '— Sin señal — Cambiaste piezas: vuelve a encender el equipo.');
  game.system.lastStress = null;
  if (cat === 'storage') game.system.osInstalled = false;
  delete game.assembly[item.id];
  if (scene && cat === 'cpu') scene.setPaste(false);
  if (scene && cat === 'psu') ['atx', 'eps', 'pcie', 'sata'].forEach(k => scene.setCable(k, false));
  if (scene && cat === 'gpu') scene.setCable('pcie', false);
  if (scene && cat === 'storage') scene.setCable('sata', false);
  delete installed[cat];
  if (scene) { scene.remove(cat); scene.setPowered(false); }
  hud.setSelected(null);
  hud.log(s.removed + item.name, 'info');
  save();
}

// --- arrastrar y soltar desde el inventario ---
let dragGhost = null;
function startDrag(item, ev) {
  if (ev.button !== undefined && ev.button !== 0) return;
  const s = t();
  dragGhost = document.createElement('div');
  dragGhost.className = 'ws-ghost';
  dragGhost.textContent = '🔧 ' + item.name + ' — ' + s.dragHint;
  document.body.appendChild(dragGhost);
  moveGhost(ev);
  const move = e2 => moveGhost(e2);
  const up = e2 => {
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', up);
    if (dragGhost) { dragGhost.remove(); dragGhost = null; }
    const el = document.elementFromPoint(e2.clientX, e2.clientY);
    if (el && el.tagName === 'CANVAS') attemptPlace(item);
  };
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', up);
}
function moveGhost(ev) {
  if (!dragGhost) return;
  dragGhost.style.left = (ev.clientX + 14) + 'px';
  dragGhost.style.top = (ev.clientY + 12) + 'px';
}

async function init() {
  components = await loadComponents();
  syncUI();
  hud.applyStaticTexts();

  const wrap = document.getElementById('ws-canvas-wrap');
  scene = createScene(wrap, {
    onError() { hud.log(t().webglError, 'err'); },
    onSnap() { if (holding) attemptPlace(holding); },
    onPartClick(cat) { selectedCat = cat; hud.setSelected(cat); refreshTasks(); },
    onQualityDrop() { hud.log(t().qualityDropped, 'info'); const q = document.getElementById('ws-quality'); if (q) q.value = 'low'; }
  });
  restore();
  applyAssemblyFx();
  syncUI();
  hud.log(t().welcome, 'info');
  if (scene && installed.case) scene.setPanel(true);

  document.getElementById('ws-install-btn').addEventListener('click', () => attemptPlace(holding));
  document.getElementById('ws-remove-btn').addEventListener('click', () => {
    if (selectedCat) { removePart(selectedCat); selectedCat = null; }
  });
  document.getElementById('ws-panel-btn').addEventListener('click', function () {
    if (!scene) return;
    const open = !scene.isPanelOpen();
    scene.setPanel(open);
    this.textContent = open ? t().panelOpen : t().panelClosed;
  });
  document.getElementById('ws-power-btn').addEventListener('click', () => { bootFlow(); });
  document.getElementById('ws-bios-btn').addEventListener('click', () => {
    const rows = biosRows(installed, game.system);
    const en = lang() === 'en';
    monitor.desktop('<b>NVISION UEFI SETUP</b>' + rows.map(r => '<div class="ws-bios-row"><span>' + (typeof r.k === 'string' ? r.k : r.k[lang()]) + '</span><b>' + (typeof r.v === 'string' ? r.v : r.v[lang()]) + '</b></div>').join('') +
      '<p class="ws-line--dim">' + (en ? 'Press "Test power" to exit and boot.' : 'Pulsa «Probar encendido» para salir y arrancar.') + '</p>');
  });
  document.getElementById('ws-os-btn').addEventListener('click', async () => {
    if (bootState !== 'needos') return;
    const en = lang() === 'en';
    const steps = en
      ? ['Preparing installer…', 'Copying system files… 35%', 'Copying system files… 70%', 'Installing drivers (chipset, GPU, network)…', 'Final setup…']
      : ['Preparando el instalador…', 'Copiando archivos del sistema… 35%', 'Copiando archivos del sistema… 70%', 'Instalando controladores (chipset, GPU, red)…', 'Configuración final…'];
    bootState = 'installing';
    updateMonitorBtns();
    for (const st of steps) { monitor.line(st, 'dim'); await wait(450); }
    game.system.osInstalled = true;
    save();
    hud.log(en ? '💿 NVISION OS installed.' : '💿 NVISION OS instalado.', 'ok');
    showDesktop();
  });
  document.getElementById('ws-stress-btn').addEventListener('click', async () => {
    if (bootState !== 'desktop') return;
    const res = stressTest(installed);
    for (const ln of res.lines) { monitor.line(ln.text[lang()], ln.level); await wait(500); }
    game.system.lastStress = res.outcome;
    save();
    if (res.fault) {
      monitor.fault(res.fault, lang());
      hud.log('⛔ ' + res.fault.title[lang()], 'err');
      if (scene) scene.setPowered(false);
      bootState = 'off';
      updateMonitorBtns();
    } else if (res.outcome === 'throttle') {
      hud.log('⚠ Throttling térmico: el equipo rinde menos bajo carga.', 'warn');
    } else {
      hud.log('🔥 Prueba de carga superada: equipo estable.', 'ok');
    }
    syncUI();
  });
  document.getElementById('ws-xmp-btn').addEventListener('click', () => {
    game.system.xmp = !game.system.xmp;
    save();
    updateMonitorBtns();
    hud.log('⚡ XMP/EXPO ' + (game.system.xmp ? 'ON' : 'OFF') + ' — se aplica en el próximo arranque.', 'info');
  });
  updateMonitorBtns();
  document.getElementById('ws-quality').addEventListener('change', function () {
    if (scene) scene.setQuality(this.value);
  });
  document.getElementById('ws-reset-btn').addEventListener('click', () => {
    Object.keys(installed).slice().reverse().forEach(cat => { if (scene) scene.remove(cat); delete installed[cat]; });
    if (scene) scene.setPowered(false);
    holding = null;
    hud.setHolding(null);
    hud.setSelected(null);
    save();
  });
  const dayBtn = document.getElementById('ws-day-btn');
  if (dayBtn) dayBtn.addEventListener('click', () => {
    advanceDay(game);
    hud.log(t().newDay + game.day + ' — precios y stock actualizados.', 'info');
    save();
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
