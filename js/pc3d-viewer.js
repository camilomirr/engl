// =========================================================
// NVISION — Visor 3D real de la torre (Three.js)
// Reemplaza el antiguo "visor" de fotos apiladas por un modelo
// 3D de verdad: órbita, zoom, piezas clicables, cinemáticas,
// vista desarmada y flujo de aire animado.
// =========================================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const mount = document.getElementById('pc-viewer3d');
if (mount) init();

function init() {
  const canvas = document.getElementById('pc-canvas');
  const loadingEl = document.getElementById('pc-viewer-loading');
  const errorEl = document.getElementById('pc-viewer-error');
  const tooltip = document.getElementById('pc-tooltip');
  const shell = document.getElementById('pc-scene-shell');
  const titleEl = document.getElementById('pc-scene-title');
  const descEl = document.getElementById('pc-scene-desc');
  const partNameEl = document.getElementById('pc-part-name');
  const partIndexEl = document.getElementById('pc-part-index');
  const sceneButtons = document.querySelectorAll('.pc-scene-btn[data-scene]');
  const explodeInput = document.getElementById('pc-explode');
  const explodeVal = document.getElementById('pc-explode-val');
  const resetBtn = document.getElementById('pc-reset-view');
  const statusWrap = document.getElementById('pc-part-status');
  const statusText = document.getElementById('pc-part-status-text');
  const allBtn = document.getElementById('pc-disassemble-all');
  const allBtnLabel = allBtn ? allBtn.querySelector('span:last-child') : null;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- i18n (reusa el diccionario de main.js, con respaldo en español) ---
  const lang = () => (typeof currentLang !== 'undefined' ? currentLang : 'es');
  const t = (key) => {
    try {
      if (typeof translations !== 'undefined') {
        return translations[lang()]?.[key] || translations.es?.[key] || key;
      }
    } catch (e) { /* sin diccionario: se usa la clave */ }
    return key;
  };

  const PARTS = [
    { id: 'motherboard', key: 'part_motherboard', funcKey: 'pc3d_partfunc_motherboard', typesKey: 'pc3d_parttypes_motherboard' },
    { id: 'ram', key: 'part_ram', funcKey: 'pc3d_partfunc_ram', typesKey: 'pc3d_parttypes_ram' },
    { id: 'cpu', key: 'part_cpu', funcKey: 'pc3d_partfunc_cpu', typesKey: 'pc3d_parttypes_cpu' },
    { id: 'gpu', key: 'part_gpu', funcKey: 'pc3d_partfunc_gpu', typesKey: 'pc3d_parttypes_gpu' },
    { id: 'storage', key: 'part_storage', funcKey: 'pc3d_partfunc_storage', typesKey: 'pc3d_parttypes_storage' },
    { id: 'psu', key: 'part_psu', funcKey: 'pc3d_partfunc_psu', typesKey: 'pc3d_parttypes_psu' },
    { id: 'optical', key: 'part_optical', funcKey: 'pc3d_partfunc_optical', typesKey: 'pc3d_parttypes_optical' }
  ];
  const partById = Object.fromEntries(PARTS.map((p) => [p.id, p]));

  const SCENES = {
    overview: { cam: [9.0, 4.4, 5.4], tgt: [0, 2.3, 0], focus: null, particles: false, fanBoost: 1 },
    core: { cam: [4.6, 4.3, 3.8], tgt: [-0.55, 3.1, 0.1], focus: ['cpu', 'ram'], particles: false, fanBoost: 1 },
    airflow: { cam: [6.4, 5.4, 7.4], tgt: [0, 2.0, 0], focus: ['psu', 'gpu'], particles: true, fanBoost: 2.4 }
  };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    if (loadingEl) loadingEl.hidden = true;
    if (errorEl) errorEl.hidden = false;
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(...SCENES.overview.cam);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(...SCENES.overview.tgt);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 3.5;
  controls.maxDistance = 18;
  controls.maxPolarAngle = Math.PI * 0.55;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 0.9;

  // --- Luces ---
  scene.add(new THREE.AmbientLight(0x94a3b8, 0.75));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
  keyLight.position.set(6, 9, 7);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.left = -7; keyLight.shadow.camera.right = 7;
  keyLight.shadow.camera.top = 7; keyLight.shadow.camera.bottom = -7;
  scene.add(keyLight);
  const innerGlow = new THREE.PointLight(0x22d3ee, 18, 10, 2);
  innerGlow.position.set(0.4, 3.0, 0.8);
  scene.add(innerGlow);
  const fillLight = new THREE.PointLight(0xf59e0b, 6, 12, 2);
  fillLight.position.set(-4, 2, -5);
  scene.add(fillLight);

  // --- Suelo: sombra + anillo ---
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(8, 48),
    new THREE.ShadowMaterial({ opacity: 0.32 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  ground.receiveShadow = true;
  scene.add(ground);
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(3.3, 3.38, 64),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.01;
  scene.add(ring);

  // --- Materiales y helpers ---
  const mat = (color, opts = {}) => new THREE.MeshStandardMaterial({
    color, metalness: opts.metal ?? 0.55, roughness: opts.rough ?? 0.45,
    emissive: opts.emissive ?? 0x000000, emissiveIntensity: opts.emissiveIntensity ?? 0,
    transparent: true
  });
  const box = (w, h, d, material) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    m.castShadow = true; m.receiveShadow = true;
    return m;
  };
  const cyl = (rt, rb, h, material, seg = 24) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material);
    m.castShadow = true; m.receiveShadow = true;
    return m;
  };

  const CASE_MAT = mat(0x2a3648, { metal: 0.7, rough: 0.35 });
  const DARK_MAT = mat(0x0f172a, { metal: 0.5, rough: 0.5 });
  const PCB_MAT = mat(0x166534, { metal: 0.2, rough: 0.55 });
  const METAL_MAT = mat(0xb8c4d4, { metal: 0.9, rough: 0.25 });
  const COPPER_MAT = mat(0xb87333, { metal: 0.9, rough: 0.3 });

  const spinners = []; // ventiladores que giran { group, speed }
  function makeFan(radius, ringColor = 0x22d3ee) {
    const group = new THREE.Group();
    const spinner = new THREE.Group();
    const ringMesh = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.055, 10, 40),
      mat(0x1e293b, { metal: 0.7, rough: 0.35 })
    );
    group.add(ringMesh);
    const hub = cyl(radius * 0.28, radius * 0.28, 0.1, mat(0x334155, { metal: 0.6, rough: 0.4 }), 20);
    hub.rotation.x = Math.PI / 2;
    group.add(hub);
    for (let i = 0; i < 5; i++) {
      const blade = box(radius * 0.78, radius * 0.34, 0.03, mat(0x0f172a, { metal: 0.4, rough: 0.5 }));
      const holder = new THREE.Group();
      blade.position.x = radius * 0.52;
      blade.rotation.x = 0.5;
      holder.add(blade);
      holder.rotation.z = (i / 5) * Math.PI * 2;
      spinner.add(holder);
    }
    group.add(spinner);
    const glow = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 0.94, 0.02, 8, 40),
      new THREE.MeshBasicMaterial({ color: ringColor })
    );
    group.add(glow);
    spinners.push({ group: spinner, speed: 6 + Math.random() * 2 });
    return group;
  }

  // --- Registro de piezas clicables ---
  const partGroups = {};
  const partMeshes = [];
  const partMats = {};
  function registerPart(group, id, dir) {
    group.userData.partId = id;
    group.userData.base = group.position.clone();
    group.userData.dir = new THREE.Vector3(...dir);
    group.userData.targetOpacity = 1;
    group.userData.removed = false;
    group.userData.removeK = 0;
    const mats = new Set();
    group.traverse((o) => {
      if (o.isMesh) {
        o.userData.partId = id;
        partMeshes.push(o);
        if (o.material && o.material.isMeshStandardMaterial) {
          mats.add(o.material);
          o.material.userData.baseEmissive = o.material.emissive.getHex();
          o.material.userData.baseEmissiveIntensity = o.material.emissiveIntensity;
        }
      }
    });
    partMats[id] = [...mats];
    partGroups[id] = group;
  }

  // --- Torre: chasis (panel lateral abierto, sin vidrio) ---
  const tower = new THREE.Group();
  scene.add(tower);
  const caseParts = [];
  function caseBox(w, h, d, x, y, z, material = CASE_MAT) {
    const m = box(w, h, d, material);
    m.position.set(x, y, z);
    tower.add(m);
    caseParts.push(m);
    return m;
  }
  caseBox(0.08, 4.6, 4.0, -1.1, 2.3, 0);          // pared izquierda (placa madre)
  caseBox(2.28, 4.6, 0.08, 0, 2.3, -2);           // trasera
  caseBox(2.28, 0.08, 4.08, 0, 4.6, 0);           // techo
  caseBox(2.28, 0.08, 4.08, 0, 0.04, 0);          // piso
  const frontPanel = caseBox(2.28, 4.6, 0.08, 0, 2.3, 2); // frontal
  frontPanel.userData.base = frontPanel.position.clone();
  frontPanel.userData.dir = new THREE.Vector3(0, 0, 1.6);
  // marco del lado abierto (+X)
  caseBox(0.08, 0.12, 4.0, 1.1, 4.55, 0);
  caseBox(0.08, 0.12, 4.0, 1.1, 0.12, 0);
  caseBox(0.08, 4.6, 0.12, 1.1, 2.3, 1.95);
  caseBox(0.08, 4.6, 0.12, 1.1, 2.3, -1.95);
  // patas
  [[-0.9, -1.8], [0.9, -1.8], [-0.9, 1.8], [0.9, 1.8]].forEach(([x, z]) => {
    const foot = cyl(0.09, 0.11, 0.12, DARK_MAT, 12);
    foot.position.set(x, -0.04, z);
    tower.add(foot);
  });
  // tira RGB vertical en el frontal
  const rgbStrip = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 4.1, 0.06),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee })
  );
  rgbStrip.position.set(1.06, 2.3, 1.9);
  tower.add(rgbStrip);

  // --- Placa madre ---
  const motherboard = new THREE.Group();
  motherboard.position.set(-0.94, 2.5, -0.1);
  const board = box(0.08, 3.5, 3.4, PCB_MAT);
  motherboard.add(board);
  const chipset = box(0.1, 0.5, 0.5, DARK_MAT);
  chipset.position.set(0.08, -0.9, -0.6);
  motherboard.add(chipset);
  [-1.15, -0.55].forEach((y) => {
    const slot = box(0.1, 0.12, 2.4, mat(0x111827, { metal: 0.4, rough: 0.55 }));
    slot.position.set(0.08, y, 0.1);
    motherboard.add(slot);
  });
  for (let i = 0; i < 6; i++) {
    const cap = cyl(0.05, 0.05, 0.16, COPPER_MAT, 10);
    cap.rotation.z = Math.PI / 2;
    cap.position.set(0.1, 1.35 - i * 0.22, 1.45);
    motherboard.add(cap);
  }
  const trace = box(0.02, 2.6, 0.1, mat(0x0f172a, { emissive: 0x0ea5e9, emissiveIntensity: 0.5 }));
  trace.position.set(0.06, 0.2, -1.2);
  motherboard.add(trace);
  tower.add(motherboard);
  registerPart(motherboard, 'motherboard', [0, 0, 0]);

  // --- CPU + disipador con ventilador ---
  const cpu = new THREE.Group();
  cpu.position.set(-0.86, 3.45, -0.7);
  const socket = box(0.1, 0.72, 0.72, DARK_MAT);
  cpu.add(socket);
  const chip = box(0.12, 0.5, 0.5, METAL_MAT);
  chip.position.x = 0.08;
  cpu.add(chip);
  const heatsink = cyl(0.52, 0.52, 0.3, COPPER_MAT, 28);
  heatsink.rotation.z = Math.PI / 2;
  heatsink.position.x = 0.32;
  cpu.add(heatsink);
  const cpuFan = makeFan(0.5);
  cpuFan.rotation.y = Math.PI / 2;
  cpuFan.position.x = 0.52;
  cpu.add(cpuFan);
  tower.add(cpu);
  registerPart(cpu, 'cpu', [1.6, 0.2, 0]);

  // --- RAM (2 módulos) ---
  const ram = new THREE.Group();
  ram.position.set(-0.82, 3.3, 0.75);
  [0, 0.4].forEach((dz, i) => {
    const stick = box(0.1, 1.15, 0.22, mat(0x1f2937, { metal: 0.5, rough: 0.45 }));
    stick.position.set(0, 0, dz);
    ram.add(stick);
    const rgb = box(0.11, 0.09, 0.22, mat(0x0f172a, { emissive: i === 0 ? 0x22d3ee : 0xd946ef, emissiveIntensity: 0.9 }));
    rgb.position.set(0, 0.6, dz);
    ram.add(rgb);
  });
  const ramSlot = box(0.12, 0.1, 0.85, DARK_MAT);
  ramSlot.position.set(0, -0.62, 0.2);
  ram.add(ramSlot);
  tower.add(ram);
  registerPart(ram, 'ram', [1.6, 0.3, 0.2]);

  // --- GPU ---
  const gpu = new THREE.Group();
  gpu.position.set(-0.55, 1.75, 0.1);
  const gpuBody = box(0.42, 0.55, 2.7, mat(0x1f2937, { metal: 0.6, rough: 0.4 }));
  gpu.add(gpuBody);
  const gpuAccent = box(0.44, 0.09, 2.7, mat(0x7f1d1d, { emissive: 0xef4444, emissiveIntensity: 0.7 }));
  gpuAccent.position.y = 0.28;
  gpu.add(gpuAccent);
  const gpuPlate = box(0.05, 0.5, 2.6, METAL_MAT);
  gpuPlate.position.x = -0.22;
  gpu.add(gpuPlate);
  [-0.62, 0.62].forEach((dz) => {
    const fan = makeFan(0.42, 0xef4444);
    fan.rotation.y = Math.PI / 2;
    fan.position.set(0.24, 0, dz);
    gpu.add(fan);
  });
  tower.add(gpu);
  registerPart(gpu, 'gpu', [1.8, 0, 0]);

  // --- Fuente de poder ---
  const psu = new THREE.Group();
  psu.position.set(0.25, 0.5, -1.25);
  const psuBody = box(1.5, 0.85, 1.4, mat(0x111827, { metal: 0.6, rough: 0.45 }));
  psu.add(psuBody);
  const psuGrill = cyl(0.32, 0.32, 0.03, mat(0x334155, { metal: 0.7, rough: 0.4 }), 24);
  psuGrill.position.set(0, 0.44, 0);
  psu.add(psuGrill);
  const psuLabel = box(0.5, 0.3, 0.02, mat(0x0f172a, { emissive: 0x10b981, emissiveIntensity: 0.6 }));
  psuLabel.position.set(0.76, 0.1, 0.3);
  psuLabel.rotation.y = Math.PI / 2;
  psu.add(psuLabel);
  tower.add(psu);
  registerPart(psu, 'psu', [0, -0.8, -0.5]);

  // --- Almacenamiento (SSD M.2 en placa) ---
  const storage = new THREE.Group();
  storage.position.set(-0.85, 1.05, 0.9);
  const ssd = box(0.06, 0.28, 0.95, mat(0x1d4ed8, { metal: 0.6, rough: 0.4 }));
  storage.add(ssd);
  const ssdLabel = box(0.02, 0.2, 0.6, mat(0x0f172a, { emissive: 0x38bdf8, emissiveIntensity: 0.5 }));
  ssdLabel.position.x = 0.04;
  storage.add(ssdLabel);
  tower.add(storage);
  registerPart(storage, 'storage', [1.3, 0, 0.5]);

  // --- Unidad óptica (bahía frontal superior) ---
  const optical = new THREE.Group();
  optical.position.set(0, 4.25, 1.55);
  const oddBody = box(1.8, 0.28, 1.3, mat(0x9aa7b8, { metal: 0.8, rough: 0.35 }));
  optical.add(oddBody);
  const oddBezel = box(1.82, 0.28, 0.06, DARK_MAT);
  oddBezel.position.z = 0.66;
  optical.add(oddBezel);
  const oddSlot = box(1.2, 0.03, 0.02, mat(0x000000, { metal: 0.2, rough: 0.8 }));
  oddSlot.position.set(0, 0.02, 0.7);
  optical.add(oddSlot);
  tower.add(optical);
  registerPart(optical, 'optical', [0, 0.8, 1.3]);

  // --- Ventiladores del chasis (no clicables) ---
  const caseFans = [];
  [[0, 3.5, 1.92, 0, 0x22d3ee], [0, 1.3, 1.92, 0, 0x22d3ee], [0, 3.9, -1.92, Math.PI, 0x34d399]].forEach(([x, y, z, ry, color]) => {
    const fan = makeFan(0.55, color);
    fan.position.set(x, y, z);
    fan.rotation.y = ry;
    tower.add(fan);
    caseFans.push(fan);
  });

  // --- Cables ---
  function cable(points, radius, color) {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 24, radius, 8, false),
      mat(color, { metal: 0.2, rough: 0.7 })
    );
    mesh.castShadow = true;
    tower.add(mesh);
    return mesh;
  }
  cable([[0.3, 0.95, -0.9], [0.7, 1.3, -0.2], [-0.2, 1.7, 0.5], [-0.85, 2.1, 0.9]], 0.06, 0x991b1b);
  cable([[0.3, 0.95, -0.6], [0.5, 1.4, 0.1], [-0.45, 2.0, 0.55]], 0.045, 0xd97706);
  cable([[-0.2, 0.95, -1.0], [-0.5, 1.0, 0.2], [-0.85, 1.05, 0.85]], 0.03, 0x2563eb);

  // --- Partículas de flujo de aire ---
  const P_COUNT = 140;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(P_COUNT * 3);
  const pData = [];
  for (let i = 0; i < P_COUNT; i++) {
    pData.push({
      x: -0.7 + Math.random() * 1.4,
      y: 0.5 + Math.random() * 3.7,
      z: 1.9,
      speed: 0.6 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2
    });
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0x34d399, size: 0.075, transparent: true, opacity: 0.9, depthWrite: false
  }));
  particles.visible = false;
  particles.frustumCulled = false;
  scene.add(particles);

  // --- Estado ---
  let activeScene = 'overview';
  let selectedPart = null;
  let hoveredPart = null;
  let camTween = null;
  let fanBoost = 1;
  let explodeTarget = 0;
  let explodeCurrent = 0;
  const clock = new THREE.Clock();

  function setEmissive(id, hex, intensity) {
    (partMats[id] || []).forEach((m) => {
      m.emissive.setHex(hex);
      m.emissiveIntensity = intensity;
    });
  }
  function restoreEmissive(id) {
    (partMats[id] || []).forEach((m) => {
      m.emissive.setHex(m.userData.baseEmissive ?? 0x000000);
      m.emissiveIntensity = m.userData.baseEmissiveIntensity ?? 0;
    });
  }
  function applyDim() {
    const focus = SCENES[activeScene].focus;
    PARTS.forEach((p) => {
      const g = partGroups[p.id];
      g.userData.targetOpacity = !focus || focus.includes(p.id) || selectedPart === p.id || g.userData.removed ? 1 : 0.32;
    });
  }
  function updateStatus() {
    if (!statusText || !statusWrap) return;
    if (!selectedPart) {
      statusText.textContent = t('pc3d_part_installed');
      statusText.dataset.i18n = 'pc3d_part_installed';
      statusWrap.classList.remove('is-removed');
      return;
    }
    const removed = partGroups[selectedPart].userData.removed;
    statusText.textContent = t(removed ? 'pc3d_part_removed' : 'pc3d_part_installed');
    statusText.dataset.i18n = removed ? 'pc3d_part_removed' : 'pc3d_part_installed';
    statusWrap.classList.toggle('is-removed', removed);
  }
  function updateAllButton() {
    if (!allBtnLabel) return;
    const allRemoved = PARTS.every((p) => partGroups[p.id].userData.removed);
    allBtnLabel.textContent = t(allRemoved ? 'pc3d_assemble_all' : 'pc3d_disassemble_all');
    allBtnLabel.dataset.i18n = allRemoved ? 'pc3d_assemble_all' : 'pc3d_disassemble_all';
  }
  function toggleRemove(id) {
    const g = partGroups[id];
    g.userData.removed = !g.userData.removed;
    updateStatus();
    updateAllButton();
    applyDim();
  }
  function setAllRemoved(remove) {
    PARTS.forEach((p, i) => {
      setTimeout(() => {
        partGroups[p.id].userData.removed = remove;
        if (selectedPart === p.id) updateStatus();
        updateAllButton();
        applyDim();
      }, i * 90);
    });
  }
  function updatePanelForPart(part, index) {
    if (titleEl) {
      titleEl.textContent = t(part.key);
      titleEl.dataset.i18n = part.key;
    }
    if (descEl) {
      descEl.textContent = t(part.funcKey);
      descEl.dataset.i18n = part.funcKey;
    }
    if (partNameEl) {
      partNameEl.textContent = t(part.typesKey);
      partNameEl.dataset.i18n = part.typesKey;
    }
    if (partIndexEl) partIndexEl.textContent = `${String(index + 1).padStart(2, '0')} / ${String(PARTS.length).padStart(2, '0')}`;
  }
  function selectPart(id) {
    if (selectedPart && selectedPart !== id) restoreEmissive(selectedPart);
    selectedPart = id;
    if (id) {
      setEmissive(id, 0x0ea5e9, 0.5);
      toggleRemove(id); // clic = desmontar / volver a instalar
      const part = partById[id];
      updatePanelForPart(part, PARTS.indexOf(part));
    } else {
      setSceneText(activeScene);
      if (partNameEl) {
        partNameEl.textContent = t(partById.motherboard.typesKey);
        partNameEl.dataset.i18n = partById.motherboard.typesKey;
      }
      if (partIndexEl) partIndexEl.textContent = `01 / ${String(PARTS.length).padStart(2, '0')}`;
      updateStatus();
    }
    applyDim();
  }
  function setSceneText(name) {
    const s = SCENES[name];
    if (!s) return;
    if (titleEl) {
      titleEl.textContent = t(`scene_${name}_title`);
      titleEl.dataset.i18n = `scene_${name}_title`;
    }
    if (descEl) {
      descEl.textContent = t(`scene_${name}_desc`);
      descEl.dataset.i18n = `scene_${name}_desc`;
    }
  }
  function flyTo(pos, tgt) {
    camTween = {
      p0: camera.position.clone(), p1: new THREE.Vector3(...pos),
      t0: controls.target.clone(), t1: new THREE.Vector3(...tgt), k: 0
    };
  }
  function setScene(name) {
    if (!SCENES[name]) return;
    activeScene = name;
    const s = SCENES[name];
    sceneButtons.forEach((b) => b.classList.toggle('is-active', b.dataset.scene === name));
    setSceneText(name);
    flyTo(s.cam, s.tgt);
    particles.visible = s.particles;
    fanBoost = s.fanBoost;
    if (selectedPart) { restoreEmissive(selectedPart); selectedPart = null; }
    applyDim();
  }

  // --- Interacción ---
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pointerClient = { x: 0, y: 0 };
  let downPos = null;

  function pickPart(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(partMeshes, false);
    return hits.length ? hits[0].object.userData.partId : null;
  }
  canvas.addEventListener('pointermove', (event) => {
    pointerClient = { x: event.clientX, y: event.clientY };
    if (event.pointerType !== 'mouse') return;
    const id = pickPart(event);
    if (id !== hoveredPart) {
      if (hoveredPart && hoveredPart !== selectedPart) restoreEmissive(hoveredPart);
      hoveredPart = id;
      if (id && id !== selectedPart) setEmissive(id, 0x0ea5e9, 0.22);
      canvas.style.cursor = id ? 'pointer' : 'grab';
    }
    if (tooltip) {
      if (id) {
        const rect = shell.getBoundingClientRect();
        tooltip.hidden = false;
        tooltip.textContent = t(partById[id].key);
        tooltip.style.left = `${event.clientX - rect.left + 14}px`;
        tooltip.style.top = `${event.clientY - rect.top + 14}px`;
      } else {
        tooltip.hidden = true;
      }
    }
  });
  canvas.addEventListener('pointerleave', () => {
    if (hoveredPart && hoveredPart !== selectedPart) restoreEmissive(hoveredPart);
    hoveredPart = null;
    if (tooltip) tooltip.hidden = true;
    canvas.style.cursor = 'grab';
  });
  canvas.addEventListener('pointerdown', (event) => {
    downPos = { x: event.clientX, y: event.clientY };
    camTween = null;
    controls.autoRotate = false;
  });
  canvas.addEventListener('pointerup', (event) => {
    if (!downPos) return;
    const moved = Math.hypot(event.clientX - downPos.x, event.clientY - downPos.y);
    downPos = null;
    if (moved > 8) return; // fue un arrastre, no un clic
    const id = pickPart(event);
    selectPart(id);
  });
  canvas.addEventListener('wheel', () => { controls.autoRotate = false; }, { passive: true });

  sceneButtons.forEach((button) => {
    button.addEventListener('click', () => setScene(button.dataset.scene));
  });
  if (explodeInput) {
    explodeInput.addEventListener('input', () => {
      explodeTarget = Number(explodeInput.value) / 100;
      if (explodeVal) explodeVal.textContent = `${explodeInput.value}%`;
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (explodeInput) { explodeInput.value = '0'; explodeTarget = 0; }
      if (explodeVal) explodeVal.textContent = '0%';
      PARTS.forEach((p) => { partGroups[p.id].userData.removed = false; });
      updateAllButton();
      selectPart(null);
      setScene('overview');
    });
  }
  if (allBtn) {
    allBtn.addEventListener('click', () => {
      const anyInstalled = PARTS.some((p) => !partGroups[p.id].userData.removed);
      setAllRemoved(anyInstalled);
    });
  }

  // --- Tamaño ---
  function resize() {
    const w = shell.clientWidth;
    const h = shell.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  if (window.ResizeObserver) {
    new ResizeObserver(resize).observe(shell);
  }
  window.addEventListener('resize', resize);
  resize();

  // --- Bucle de animación ---
  let firstFrame = true;
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;

    if (camTween) {
      camTween.k += dt / 0.9;
      const k = Math.min(camTween.k, 1);
      const s = k * k * (3 - 2 * k);
      camera.position.lerpVectors(camTween.p0, camTween.p1, s);
      controls.target.lerpVectors(camTween.t0, camTween.t1, s);
      if (k >= 1) camTween = null;
    }
    controls.update();

    // ventiladores
    const spin = reduceMotion ? 0 : 1;
    spinners.forEach((f) => { f.group.rotation.z += f.speed * fanBoost * spin * dt; });

    // tira RGB con ciclo de color suave
    rgbStrip.material.color.setHSL((elapsed * 0.04) % 1, 0.85, 0.6);

    // vista desarmada (interpolada) + piezas retiradas con clic
    explodeCurrent += (explodeTarget - explodeCurrent) * Math.min(1, dt * 6);
    Object.values(partGroups).forEach((g) => {
      g.userData.removeK += ((g.userData.removed ? 1 : 0) - g.userData.removeK) * Math.min(1, dt * 5);
      g.position.copy(g.userData.base).addScaledVector(g.userData.dir, explodeCurrent * 1.6 + g.userData.removeK * 2.1);
    });
    frontPanel.position.copy(frontPanel.userData.base).addScaledVector(frontPanel.userData.dir, explodeCurrent);

    // atenuado de piezas (interpolado)
    Object.values(partGroups).forEach((g) => {
      const target = g.userData.targetOpacity;
      g.traverse((o) => {
        if (o.isMesh && o.material && o.material.isMeshStandardMaterial) {
          const m = o.material;
          m.opacity += (target - m.opacity) * Math.min(1, dt * 6);
          m.depthWrite = m.opacity > 0.6;
        }
      });
    });

    // partículas de aire
    if (particles.visible) {
      const arr = pGeo.attributes.position.array;
      for (let i = 0; i < P_COUNT; i++) {
        const d = pData[i];
        d.z -= d.speed * dt;
        if (d.z < -1.9) d.z = 1.9;
        arr[i * 3] = d.x + Math.sin(elapsed * 2 + d.phase) * 0.15;
        arr[i * 3 + 1] = d.y;
        arr[i * 3 + 2] = d.z;
      }
      pGeo.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
    if (firstFrame) {
      firstFrame = false;
      if (loadingEl) loadingEl.hidden = true;
      window.__pcViewerReady = true;
    }
  }
  setScene('overview');
  animate();
}
