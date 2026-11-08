// =========================================================
// NVISION PC WORKSHOP - Entrada principal (Fase 1)
// Une catalogo (JSON), reglas de compatibilidad, escena 3D
// y HUD. Flujo de montaje: tomar pieza -> soltar en el
// banco / clic en el punto brillante / boton Instalar ->
// las reglas validan -> la pieza vuela a su punto de
// montaje. El avance se guarda en localStorage.
// =========================================================
import { loadComponents } from './data/catalog.js?v=6';
import { checkPlacement, missingParts, REQUIRED } from './core/rules.js?v=6';
import { createScene } from './core/scene.js?v=6';
import { loadState, saveState, buy as ecoBuy, sell as ecoSell, advanceDay } from './core/economy.js?v=6';
import { createShop } from './ui/shop.js?v=6';
import { tasksFor, doNextTask, assemblyPending, TOOLS } from './core/assembly.js?v=6';
import { createTasksPanel } from './ui/tasks.js?v=6';
import { createHud, t } from './ui/hud.js?v=6';

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
function syncUI() {
  hud.setData(components, installed, game.owned, game);
  shop.setData(components, game);
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
  document.getElementById('ws-power-btn').addEventListener('click', () => {
    const s = t();
    const missing = missingParts(installed);
    if (missing.length) {
      hud.log(s.powerMissing + missing.map(c => s.catNames[c]).join(', ') + '.', 'err');
      if (scene) scene.setPowered(false);
      return;
    }
    const pending = assemblyPending(installed, game.assembly, buildCtx());
    if (pending.length) {
      pending.slice(0, 4).forEach(p => hud.log('🔧 Falta: ' + p.task.label[lang()] + ' — ' + p.item.name + ' (' + p.done + '/' + p.task.count + ')', 'err'));
      hud.log('Termina el montaje paso a paso antes de encender.', 'err');
      if (scene) scene.setPowered(false);
      return;
    }
    if (scene) scene.setPowered(true);
    hud.log(s.powerOk, 'ok');
  });
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
