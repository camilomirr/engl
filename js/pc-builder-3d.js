// =========================================================
// NVISION - PC BUILDER 3D (Three.js, archivos locales)
// El PC que armas en el simulador, en 3D de verdad:
// - Arrastra para girar / rueda para zoom (OrbitControls)
// - Clic en una pieza para seleccionarla y ver su ficha
// - Control de vista explotada: desarma y ensambla el PC
// - Al instalar una pieza, vuela hasta su sitio
// - Al encender: ventiladores girando, RGB y LED del POST
// Se comunica con pc-builder.js por eventos (pb:change,
// pb:remove, pb:focus-cat) y window.PB_GET_STATE().
// =========================================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const wrap = document.getElementById('pb-3d-wrap');
if (wrap) init();

function init() {
  const tip = document.getElementById('pb-3d-tip');
  const info = document.getElementById('pb-3d-info');
  const explodeInput = document.getElementById('pb-explode');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  } catch (e) {
    const err = document.getElementById('pb-3d-error');
    if (err) err.style.display = 'block';
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  wrap.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0f1a);
  scene.fog = new THREE.Fog(0x0a0f1a, 16, 30);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(-7.4, 4.4, 7.8);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2.1, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 4;
  controls.maxDistance = 16;
  controls.maxPolarAngle = 1.52;
  controls.autoRotateSpeed = 1.4;

  scene.add(new THREE.HemisphereLight(0xbcd7ff, 0x1a2436, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(-6, 9, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -7; key.shadow.camera.right = 7;
  key.shadow.camera.top = 8; key.shadow.camera.bottom = -4;
  scene.add(key);
  const rim = new THREE.PointLight(0x38bdf8, 18, 20);
  rim.position.set(5, 4, -6);
  scene.add(rim);
  const innerLight = new THREE.PointLight(0x38bdf8, 0, 7);
  innerLight.position.set(-1.5, 2.4, 0);
  scene.add(innerLight);

  // Piso y mesa de trabajo
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(16, 48),
    new THREE.MeshStandardMaterial({ color: 0x0d1524, roughness: 0.95 })
  );
  floor.rotation.x = -Math.PI / 2; floor.position.y = -0.92; floor.receiveShadow = true;
  scene.add(floor);
  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(9.5, 0.35, 6.4),
    new THREE.MeshStandardMaterial({ color: 0x27324a, roughness: 0.6, metalness: 0.25 })
  );
  desk.position.y = -0.75; desk.castShadow = true; desk.receiveShadow = true;
  scene.add(desk);

  const rig = new THREE.Group();
  scene.add(rig);

  // ---------- materiales ----------
  const M = {
    metal: new THREE.MeshStandardMaterial({ color: 0x1b2436, roughness: 0.45, metalness: 0.75 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.6, metalness: 0.4 }),
    board: new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.55, metalness: 0.3 }),
    chip: new THREE.MeshStandardMaterial({ color: 0x9aa7bd, roughness: 0.3, metalness: 0.9 }),
    plastic: new THREE.MeshStandardMaterial({ color: 0x232c40, roughness: 0.5, metalness: 0.2 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.3, metalness: 0.9 }),
    glass: new THREE.MeshStandardMaterial({ color: 0xa5d8ff, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.13 }),
    fan: new THREE.MeshStandardMaterial({ color: 0x2b364e, roughness: 0.5, metalness: 0.3 })
  };

  function box(w, h, d, mat, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    return m;
  }
  function fanMesh(r) {
    const g = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, r * 0.14, 10, 28), M.fan);
    g.add(ring);
    const blades = new THREE.Group();
    for (let i = 0; i < 7; i++) {
      const b = box(r * 0.22, r * 0.85, 0.03, M.fan, 0, r * 0.42, 0);
      const holder = new THREE.Group();
      holder.rotation.z = (i / 7) * Math.PI * 2;
      holder.add(b); blades.add(holder);
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.3, r * 0.3, 0.09, 20), M.plastic);
    hub.rotation.x = Math.PI / 2;
    blades.add(hub);
    g.add(blades);
    g.userData.blades = blades;
    const ringLight = new THREE.Mesh(
      new THREE.TorusGeometry(r * 1.02, 0.022, 8, 32),
      new THREE.MeshStandardMaterial({ color: 0x0b1220, emissive: 0x38bdf8, emissiveIntensity: 0 })
    );
    g.add(ringLight);
    g.userData.ring = ringLight;
    return g;
  }

  // ---------- estado ----------
  let state = { powered: false, parts: {} };
  let partGroups = {};   // cat -> {group, home, dir, spawn}
  let spinners = [];     // ventiladores a girar si powered
  let rgbMats = [];      // materiales con emissive a ciclar
  let selected = null;
  let explodeTarget = 0, explodeCur = 0;
  let postLed = null;

  const CATNAMES = { cpu: 'Procesador', board: 'Placa base', ram: 'Memoria RAM', gpu: 'Tarjeta gráfica', storage: 'Almacenamiento', psu: 'Fuente de poder', case: 'Gabinete', cooler: 'Refrigeración' };
  const DIRS = {
    board: new THREE.Vector3(1.5, 0, 0),
    cpu: new THREE.Vector3(-0.6, 0.9, -0.6),
    cooler: new THREE.Vector3(-2.0, 0.5, -0.4),
    ram: new THREE.Vector3(-1.4, 0.4, 1.1),
    gpu: new THREE.Vector3(-2.4, -0.2, 0.3),
    storage: new THREE.Vector3(-1.2, -0.5, 1.5),
    psu: new THREE.Vector3(0.3, -0.4, -2.0),
    case: new THREE.Vector3(-2.8, 0, 0)
  };

  function registerPart(cat, group, home) {
    group.position.copy(home);
    group.traverse(o => { o.userData.cat = cat; });
    rig.add(group);
    partGroups[cat] = { group, home: home.clone(), dir: DIRS[cat] || new THREE.Vector3(-1.5, 0, 0), spawn: 0 };
  }
  function disposePart(cat) {
    const p = partGroups[cat];
    if (!p) return;
    rig.remove(p.group);
    p.group.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    delete partGroups[cat];
    spinners = spinners.filter(s => { let n = s; while (n) { if (n === p.group) return false; n = n.parent; } return true; });
  }

  function buildShell(kase) {
    // El "gabinete" 3D es el armazón + cristal; se desarma sacando el cristal.
    const g = new THREE.Group();
    if (kase.id === 'case-bench') {
      const base = box(2.4, 0.12, 4.6, M.metal, 0, 0.08, 0);
      g.add(base);
      registerPart('case', g, new THREE.Vector3(0, 0, 0));
      partGroups['case'].dir = new THREE.Vector3(0, -0.2, 0);
      return;
    }
    const W = 2.0, H = 4.3, D = 4.4, t = 0.08;
    g.add(box(W, t, D, M.metal, 0, 0.04, 0));            // piso
    g.add(box(W, t, D, M.metal, 0, H, 0));               // techo
    g.add(box(t, H, D, M.metal, W / 2 - t / 2, H / 2, 0)); // pared placa
    g.add(box(W, H, t, M.metal, 0, H / 2, -D / 2 + t / 2)); // trasera
    g.add(box(W, H, t, M.metal, 0, H / 2, D / 2 - t / 2));   // frente
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.04, H - 0.25, D - 0.25), M.glass);
    glass.position.set(-W / 2, H / 2, 0);
    g.add(glass);
    // ventiladores frontales
    for (let i = 0; i < 3; i++) {
      const f = fanMesh(0.42);
      f.position.set(0.1, 1.05 + i * 1.15, D / 2 - 0.16);
      g.add(f); spinners.push(f);
      if (kase.rgb) rgbMats.push(f.userData.ring.material);
      else f.userData.ring.material = new THREE.MeshStandardMaterial({ color: 0x0b1220, emissive: 0x38bdf8, emissiveIntensity: 0 });
      f.userData.plainRing = !kase.rgb;
      if (!kase.rgb) rgbMats.push(f.userData.ring.material);
    }
    registerPart('case', g, new THREE.Vector3(0, 0, 0));
    partGroups['case'].glassOnly = glass;
  }

  function buildPart(cat, item) {
    const g = new THREE.Group();
    if (cat === 'board') {
      const size = item.form === 'ATX' ? 3.5 : item.form === 'mATX' ? 3.0 : 2.3;
      const b = box(0.09, size, size, M.board, 0, 0, 0);
      g.add(b);
      for (let i = 0; i < 5; i++) g.add(box(0.05, 0.28, 0.5, M.chip, -0.08, -size / 2 + 0.5 + i * 0.62, size / 2 - 0.45));
      postLed = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x22c55e, emissiveIntensity: 0 }));
      postLed.position.set(-0.09, size / 2 - 0.25, -size / 2 + 0.25);
      g.add(postLed);
      registerPart('board', g, new THREE.Vector3(0.86, 2.35, 0));
    }
    if (cat === 'cpu') {
      const cpu = box(0.1, 0.52, 0.52, M.chip, 0, 0, 0);
      g.add(cpu);
      g.add(box(0.04, 0.4, 0.4, M.gold, -0.07, 0, 0));
      registerPart('cpu', g, new THREE.Vector3(0.78, 3.15, -0.72));
    }
    if (cat === 'cooler') {
      if (item.liquid) {
        const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.3, 24), M.plastic);
        pump.rotation.z = Math.PI / 2; pump.castShadow = true;
        g.add(pump);
        const rad = box(0.22, 0.28, 2.6, M.dark, 0.55, 0.95, 0.6);
        g.add(rad);
        for (let i = 0; i < 3; i++) {
          const f = fanMesh(0.36);
          f.rotation.y = -Math.PI / 2;
          f.position.set(0.38, 0.8, -0.35 + i * 0.85);
          g.add(f); spinners.push(f);
          if (item.id.includes('RGB') || item.id === 'cool-420') rgbMats.push(f.userData.ring.material);
        }
      } else {
        const h = item.id === 'cool-stock' || item.id === 'cool-low' ? 0.45 : 1.0;
        g.add(box(0.85, h, 1.0, M.chip, 0, 0, 0));
        const f = fanMesh(0.42);
        f.rotation.y = -Math.PI / 2;
        f.position.set(-0.52, 0, 0);
        g.add(f); spinners.push(f);
      }
      registerPart('cooler', g, new THREE.Vector3(0.3, 3.15, -0.72));
    }
    if (cat === 'ram') {
      const sticks = Math.max(1, Math.min(4, Math.round(item.gb / 12)));
      for (let i = 0; i < sticks; i++) {
        const st = box(0.5, 1.05, 0.1, M.plastic, 0, 0, i * 0.24);
        g.add(st);
        const topMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, emissive: 0x38bdf8, emissiveIntensity: 0 });
        const top = box(0.5, 0.07, 0.1, topMat, 0, 0.56, i * 0.24);
        g.add(top);
        if (item.rgb) rgbMats.push(topMat);
      }
      registerPart('ram', g, new THREE.Vector3(0.45, 3.1, 0.12));
    }
    if (cat === 'gpu') {
      if (item.id === 'gpu-none') { registerPart('gpu', g, new THREE.Vector3(0.3, 1.95, -0.6)); return; }
      const lenZ = Math.min(3.9, item.len / 100);
      const tier = item.price >= 1500 ? 0xd4a017 : item.price >= 700 ? 0x7c3aed : item.price >= 350 ? 0x2563eb : 0x475569;
      const body = box(0.55, 0.95, lenZ, new THREE.MeshStandardMaterial({ color: tier, roughness: 0.4, metalness: 0.55 }), 0, 0, 0);
      g.add(body);
      for (let i = 0; i < 2; i++) {
        const f = fanMesh(0.34);
        f.rotation.y = -Math.PI / 2;
        f.position.set(-0.32, 0, -lenZ / 4 + i * (lenZ / 2));
        g.add(f); spinners.push(f);
      }
      const stripMat = new THREE.MeshStandardMaterial({ color: 0x0b1220, emissive: 0x38bdf8, emissiveIntensity: 0 });
      g.add(box(0.56, 0.08, lenZ * 0.9, stripMat, 0, 0.52, 0));
      rgbMats.push(stripMat);
      registerPart('gpu', g, new THREE.Vector3(0.25, 1.95, -1.65 + lenZ / 2));
    }
    if (cat === 'storage') {
      if (item.kind === 'NVMe') {
        g.add(box(0.06, 0.3, 1.05, M.dark, 0, 0, 0));
        g.add(box(0.04, 0.2, 0.5, M.chip, -0.05, 0, -0.2));
        registerPart('storage', g, new THREE.Vector3(0.74, 1.5, 0.75));
      } else {
        g.add(box(0.7, 0.45, 1.15, item.kind === 'HDD' ? M.chip : M.dark, 0, 0, 0));
        registerPart('storage', g, new THREE.Vector3(0.1, 0.78, 1.35));
      }
    }
    if (cat === 'psu') {
      g.add(box(1.5, 0.72, 1.5, M.dark, 0, 0, 0));
      g.add(box(1.3, 0.4, 0.04, item.tier === 'Platinum' ? M.chip : M.gold, -0.4, 0, 0.76));
      registerPart('psu', g, new THREE.Vector3(0, 0.5, -1.25));
    }
  }

  function syncFromState(next) {
    const prevIds = {};
    Object.keys(state.parts).forEach(k => { prevIds[k] = state.parts[k].id; });
    state = next;
    const nextIds = {};
    Object.keys(state.parts).forEach(k => { nextIds[k] = state.parts[k].id; });
    ['case', 'board', 'cpu', 'cooler', 'ram', 'gpu', 'storage', 'psu'].forEach(cat => {
      if (prevIds[cat] === nextIds[cat]) return;
      disposePart(cat);
      spinners = spinners.filter(s => { let n = s; while (n) { if (!n.parent && n !== rig) break; n = n.parent; } return true; });
      if (!nextIds[cat]) return;
      if (cat === 'case') buildShell(state.parts.case);
      else buildPart(cat, state.parts[cat]);
    });
    innerLight.intensity = state.powered ? 6 : 0;
    if (postLed) postLed.material.emissiveIntensity = state.powered ? 2.2 : 0;
  }

  // ---------- interacción ----------
  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  let downAt = null;
  function pick(ev) {
    const rect = renderer.domElement.getBoundingClientRect();
    ptr.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    ptr.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    ray.setFromCamera(ptr, camera);
    const hits = ray.intersectObjects(rig.children, true);
    for (const h of hits) { if (h.object.userData.cat) return h.object.userData.cat; }
    return null;
  }
  function select(cat) {
    selected = cat;
    Object.keys(partGroups).forEach(k => {
      partGroups[k].group.traverse(o => { if (o.material && o.material.emissive && o.userData.baseEmissive === undefined && o.material.emissiveIntensity !== undefined) { } });
    });
    if (!cat) { info.textContent = 'Toca una pieza del PC para ver su ficha. Arrastra para girar, rueda para acercar.'; return; }
    const item = state.parts[cat];
    window.dispatchEvent(new CustomEvent('pb:focus-cat', { detail: { cat } }));
    info.innerHTML = item
      ? '<b>' + CATNAMES[cat] + ':</b> ' + item.name + ' · $' + item.price.toLocaleString('es-CO') + ' — En el catálogo puedes cambiarla; con el botón de abajo la desarmas del PC.'
      : '<b>' + CATNAMES[cat] + ':</b> aún no hay pieza instalada aquí.';
  }
  renderer.domElement.addEventListener('pointerdown', ev => { downAt = [ev.clientX, ev.clientY]; });
  renderer.domElement.addEventListener('pointerup', ev => {
    if (!downAt) return;
    const moved = Math.hypot(ev.clientX - downAt[0], ev.clientY - downAt[1]);
    downAt = null;
    if (moved < 6) select(pick(ev));
  });
  renderer.domElement.addEventListener('pointermove', ev => {
    const cat = pick(ev);
    if (cat && state.parts[cat]) {
      tip.style.display = 'block';
      tip.textContent = CATNAMES[cat] + ' · ' + state.parts[cat].name;
      const rect = wrap.getBoundingClientRect();
      tip.style.left = (ev.clientX - rect.left + 14) + 'px';
      tip.style.top = (ev.clientY - rect.top + 10) + 'px';
      renderer.domElement.style.cursor = 'pointer';
    } else {
      tip.style.display = 'none';
      renderer.domElement.style.cursor = 'grab';
    }
  });
  const removeBtn = document.getElementById('pb-3d-remove');
  if (removeBtn) removeBtn.addEventListener('click', () => {
    if (selected) { window.dispatchEvent(new CustomEvent('pb:remove', { detail: { cat: selected } })); info.textContent = 'Pieza desarmada. Elige otra en el catálogo para volver a ensamblar.'; selected = null; }
  });
  if (explodeInput) explodeInput.addEventListener('input', () => { explodeTarget = explodeInput.value / 100; });
  const disBtn = document.getElementById('pb-3d-disassemble');
  const asmBtn = document.getElementById('pb-3d-assemble');
  if (disBtn) disBtn.addEventListener('click', () => { explodeTarget = 1; if (explodeInput) explodeInput.value = 100; });
  if (asmBtn) asmBtn.addEventListener('click', () => { explodeTarget = 0; if (explodeInput) explodeInput.value = 0; });
  const spinChk = document.getElementById('pb-3d-spin');
  if (spinChk) spinChk.addEventListener('change', () => { controls.autoRotate = spinChk.checked; });

  window.addEventListener('pb:change', ev => syncFromState(ev.detail));
  if (window.PB_GET_STATE) syncFromState(window.PB_GET_STATE());

  // ---------- bucle ----------
  const clock = new THREE.Clock();
  function resize() {
    const w = wrap.clientWidth || 600, h = wrap.clientHeight || 440;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    explodeCur += (explodeTarget - explodeCur) * Math.min(1, dt * 5);
    Object.keys(partGroups).forEach(cat => {
      const p = partGroups[cat];
      if (p.spawn < 1) p.spawn = Math.min(1, p.spawn + dt * 1.6);
      const ease = 1 - Math.pow(1 - p.spawn, 3);
      const off = p.dir.clone().multiplyScalar(explodeCur + (1 - ease) * 1.6);
      p.group.position.copy(p.home).add(off);
      p.group.visible = p.spawn > 0.02;
      // el cristal del gabinete se separa mas que el armazon en vista explotada
      if (cat === 'case' && p.glassOnly) p.glassOnly.position.x = -1.0 - explodeCur * 1.6;
    });
    if (state.powered) {
      spinners.forEach(f => { if (f.userData.blades) f.userData.blades.rotation.z -= dt * 14; });
      const hue = (t * 0.12) % 1;
      rgbMats.forEach(m => { m.emissive.setHSL(hue, 0.85, 0.55); m.emissiveIntensity = 1.6; });
      innerLight.color.setHSL(hue, 0.8, 0.6);
    } else {
      rgbMats.forEach(m => { m.emissiveIntensity = 0; });
    }
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}
