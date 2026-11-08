// =========================================================
// NVISION PC WORKSHOP - Entrada principal (Fase 1)
// Une catalogo (JSON), reglas de compatibilidad, escena 3D
// y HUD. Flujo de montaje: tomar pieza -> soltar en el
// banco / clic en el punto brillante / boton Instalar ->
// las reglas validan -> la pieza vuela a su punto de
// montaje. El avance se guarda en localStorage.
// =========================================================
import { loadComponents } from './data/catalog.js';
import { checkPlacement, missingParts, REQUIRED } from './core/rules.js';
import { createScene } from './core/scene.js';
import { createHud, t } from './ui/hud.js';

const SAVE_KEY = 'nvision_workshop_fase1';
const installed = {};   // categoria -> componente
let components = [];
let holding = null;
let scene = null;
let selectedCat = null;

const hud = createHud({
  onPick(item) { pick(item); },
  onDragStart(item, ev) { startDrag(item, ev); }
});

function save() {
  try {
    const ids = {};
    Object.keys(installed).forEach(k => { ids[k] = installed[k].id; });
    localStorage.setItem(SAVE_KEY, JSON.stringify(ids));
  } catch (e) {}
}
function restore() {
  try {
    const ids = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    REQUIRED.forEach(cat => {
      const item = components.find(c => c.id === ids[cat]);
      if (item) { installed[cat] = item; if (scene) scene.place(cat, item); }
    });
  } catch (e) {}
}

function pick(item) {
  if (installed[item.category] && installed[item.category].id === item.id) {
    // tocar la tarjeta de lo ya montado selecciona la pieza en la escena
    if (scene) scene.focus(item.category);
    selectedCat = item.category;
    hud.setSelected(item.category);
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
  if (installed[item.category] && scene) scene.remove(item.category);
  installed[item.category] = item;
  if (scene) { scene.place(item.category, item); scene.setPowered(false); }
  holding = null;
  hud.setHolding(null);
  if (scene) scene.showMarkersFor(null);
  hud.setData(components, installed);
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
  delete installed[cat];
  if (scene) { scene.remove(cat); scene.setPowered(false); }
  hud.setSelected(null);
  hud.setData(components, installed);
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
  hud.setData(components, installed);
  hud.applyStaticTexts();

  const wrap = document.getElementById('ws-canvas-wrap');
  scene = createScene(wrap, {
    onError() { hud.log(t().webglError, 'err'); },
    onSnap() { if (holding) attemptPlace(holding); },
    onPartClick(cat) { selectedCat = cat; hud.setSelected(cat); },
    onQualityDrop() { hud.log(t().qualityDropped, 'info'); const q = document.getElementById('ws-quality'); if (q) q.value = 'low'; }
  });
  restore();
  hud.setData(components, installed);
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
    hud.setData(components, installed);
    save();
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
