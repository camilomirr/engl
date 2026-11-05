// =========================================================
// NVISION — Visor 3D real de la torre (Three.js)
// Reemplaza el antiguo "visor" de fotos apiladas por un modelo
// 3D de verdad: órbita, zoom, piezas clicables, cinemáticas,
// vista desarmada y flujo de aire animado.
// =========================================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

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
    overview: { cam: [9.0, 4.4, 5.4], tgt: [0, 2.3, 0], focus: null, particles: false, fanBoost: 1, dur: 1.8 },
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
  scene.fog = new THREE.Fog(0x0d1b2b, 15, 30);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(15, 8.5, 17); // punto de partida de la intro cinematográfica

  // Entorno de estudio: reflejos realistas en metales y vidrios
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(...SCENES.overview.tgt);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 4.0;
  controls.maxDistance = 18;
  controls.maxPolarAngle = Math.PI * 0.55;
  controls.zoomSpeed = 0.35; // zoom suave, de a poquito con la rueda
  controls.rotateSpeed = 0.85;
  // Izquierdo: agarrar piezas (y girar en vacío) · Derecho: mover la vista
  controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
  controls.enablePan = true;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 0.9;

  // Postproceso: bloom suave para que brillen los LED y el RGB
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.45, 0.85);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // --- Luces ---
  scene.add(new THREE.AmbientLight(0x94a3b8, 0.5));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
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
  const glowDisc = new THREE.Mesh(
    new THREE.CircleGeometry(3.3, 48),
    new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.05, side: THREE.DoubleSide })
  );
  glowDisc.rotation.x = -Math.PI / 2;
  glowDisc.position.y = 0.005;
  scene.add(glowDisc);
  const outerRing = new THREE.Mesh(
    new THREE.RingGeometry(4.6, 4.64, 64),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.16, side: THREE.DoubleSide })
  );
  outerRing.rotation.x = -Math.PI / 2;
  outerRing.position.y = 0.01;
  scene.add(outerRing);

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
    group.userData.explodeK = 1; // arranca desarmada y se ensambla sola en la intro
    group.userData.explodeRate = 2.0 + PARTS.findIndex((p) => p.id === id) * 0.45;
    group.userData.freePos = null; // posición libre al arrastrarla suelta
    group.userData.dragging = false;
    group.userData.magnetArmed = false; // el imán solo se arma al sacar la pieza de su sitio
    group.userData.ghost = null;
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

  // Fantasma del hueco: marca translúcida donde va la pieza retirada
  function ensureGhost(id) {
    const g = partGroups[id];
    if (g.userData.ghost) return g.userData.ghost;
    const ghost = g.clone(true);
    const ghostMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.16, depthWrite: false });
    ghost.traverse((o) => {
      if (o.isMesh) {
        o.material = ghostMat;
        o.castShadow = false;
        o.receiveShadow = false;
      }
    });
    ghost.position.copy(g.userData.base);
    ghost.rotation.set(0, 0, 0);
    ghost.visible = false;
    tower.add(ghost);
    g.userData.ghost = ghost;
    g.userData.ghostMat = ghostMat;
    return ghost;
  }
  function syncGhost(id) {
    const g = partGroups[id];
    if (!g.userData.removed && !g.userData.ghost) return;
    const ghost = ensureGhost(id);
    ghost.visible = g.userData.removed;
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
  frontPanel.userData.explodeK = 1;
  frontPanel.userData.explodeRate = 2.2;
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
  // LED de encendido y de actividad (parpadean como un equipo real)
  const powerLedMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
  const powerLed = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.03), powerLedMat);
  powerLed.position.set(0.72, 4.35, 2.05);
  tower.add(powerLed);
  const hddLedMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const hddLed = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.03), hddLedMat);
  hddLed.position.set(0.92, 4.35, 2.05);
  tower.add(hddLed);

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
  // conector ATX de 24 pines en el borde derecho de la placa
  const atxConnector = box(0.12, 0.5, 0.3, mat(0xe5e7eb, { metal: 0.3, rough: 0.5 }));
  atxConnector.position.set(0.1, 0.1, 1.55);
  motherboard.add(atxConnector);
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
  const gpuAccent = box(0.5, 0.09, 2.7, mat(0x7f1d1d, { emissive: 0xef4444, emissiveIntensity: 0.7 }));
  gpuAccent.position.y = 0.28;
  gpu.add(gpuAccent);
  const gpuPlate = box(0.05, 0.5, 2.6, METAL_MAT);
  gpuPlate.position.x = -0.22;
  gpu.add(gpuPlate);
  // conector de poder de 8 pines en el borde superior de la gráfica
  const gpuPower = box(0.3, 0.12, 0.4, DARK_MAT);
  gpuPower.position.set(0, 0.32, 1.05);
  gpu.add(gpuPower);
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
  // conector SATA del SSD
  const sataConnector = box(0.08, 0.2, 0.15, mat(0xe5e7eb, { metal: 0.3, rough: 0.5 }));
  sataConnector.position.set(0.05, 0, -0.4);
  storage.add(sataConnector);
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

  // --- Cables (cada uno pertenece a su pieza y se desvanece con ella) ---
  const cables = [];
  function cable(points, radius, color, partId) {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 24, radius, 8, false),
      mat(color, { metal: 0.2, rough: 0.7 })
    );
    mesh.castShadow = true;
    tower.add(mesh);
    cables.push({ mesh, partId });
    return mesh;
  }
  // 24 pines: de la fuente al conector ATX del borde de la placa
  cable([[0.5, 0.7, -0.55], [0.95, 1.0, 0.2], [0.7, 1.9, 1.1], [0.0, 2.4, 1.45], [-0.74, 2.6, 1.45]], 0.06, 0x991b1b, 'motherboard');
  // poder de GPU: de la fuente al conector de 8 pines del borde superior
  cable([[0.0, 0.8, -0.55], [0.75, 1.3, 0.3], [0.4, 1.9, 0.95], [-0.5, 2.12, 1.15]], 0.045, 0xd97706, 'gpu');
  // SATA: de la fuente al conector del SSD
  cable([[-0.3, 0.7, -0.55], [-0.55, 0.9, 0.0], [-0.78, 1.05, 0.48]], 0.03, 0x2563eb, 'storage');

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

  // Guía de recorrido: línea roja punteada hasta el sitio de la pieza
  const SNAP_DIST = 0.6; // distancia a la que la pieza se incrusta sola al acercarla
  const MAGNET_RADIUS = 2.0; // radio en el que el imán empieza a atraerla hacia su sitio
  const MAGNET_ARM_DIST = 1.2; // el imán se arma solo cuando la pieza ya está fuera de su sitio
  const RELEASE_SNAP_DIST = 1.2; // al soltarla dentro de este radio, encaja sola
  const guideGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const guideMat = new THREE.LineDashedMaterial({ color: 0xef4444, dashSize: 0.18, gapSize: 0.12, transparent: true, opacity: 0.95 });
  const guideLine = new THREE.Line(guideGeo, guideMat);
  guideLine.visible = false;
  guideLine.frustumCulled = false;
  scene.add(guideLine);
  const homeMarker = new THREE.Mesh(
    new THREE.TorusGeometry(0.34, 0.04, 10, 40),
    new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.9 })
  );
  homeMarker.visible = false;
  scene.add(homeMarker);
  const dragPlane = new THREE.Plane();
  const dragHit = new THREE.Vector3();
  const guideV = new THREE.Vector3();

  // --- Estado ---
  let activeScene = 'overview';
  let selectedPart = null;
  let hoveredPart = null;
  let camTween = null;
  let fanBoost = 1;
  let explodeTarget = 0;
  let lastInteract = 0;
  let hddOn = true;
  let dragId = null; // pieza que se está arrastrando suelta
  let dragCandidate = null; // pieza bajo el cursor al presionar (posible arrastre)
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
    if (!g.userData.removed) g.userData.freePos = null;
    syncGhost(id);
    updateStatus();
    updateAllButton();
    applyDim();
  }
  function updateGuide() {
    if (!dragId) return;
    const g = partGroups[dragId];
    const home = g.userData.base;
    g.getWorldPosition(guideV);
    const pos = guideGeo.attributes.position;
    pos.setXYZ(0, guideV.x, guideV.y, guideV.z);
    pos.setXYZ(1, home.x, home.y, home.z);
    pos.needsUpdate = true;
    guideLine.computeLineDistances();
    const d = guideV.distanceTo(home);
    const armed = g.userData.magnetArmed;
    const inSnap = armed && d < SNAP_DIST;
    const inMagnet = armed && d < MAGNET_RADIUS;
    guideMat.color.setHex(inSnap ? 0x22c55e : inMagnet ? 0xf59e0b : 0xef4444);
    homeMarker.material.color.setHex(inSnap ? 0x22c55e : inMagnet ? 0xf59e0b : 0xef4444);
    if (g.userData.ghostMat) g.userData.ghostMat.color.setHex(inSnap ? 0x22c55e : inMagnet ? 0xf59e0b : 0x38bdf8);
    homeMarker.position.copy(home);
    homeMarker.lookAt(camera.position);
  }
  function startDrag(id) {
    const g = partGroups[id];
    dragId = id;
    dragCandidate = null;
    g.userData.dragging = true;
    g.userData.magnetArmed = g.userData.removed; // el imán solo se arma si la pieza ya estaba suelta
    selectPart(id); // el panel sigue a la pieza que se agarra
    if (!g.userData.removed) {
      g.userData.removed = true; // al agarrarla se suelta de su sitio
      g.userData.freePos = null;
      syncGhost(id);
      updateStatus();
      updateAllButton();
      applyDim();
    }
    const p = new THREE.Vector3();
    g.getWorldPosition(p);
    const n = new THREE.Vector3();
    camera.getWorldDirection(n);
    dragPlane.setFromNormalAndCoplanarPoint(n, p);
    guideLine.visible = true;
    homeMarker.visible = true;
    ensureGhost(id);
    updateGuide();
    canvas.style.cursor = 'grabbing';
  }
  function snapIn(id) {
    const g = partGroups[id];
    g.userData.freePos = null;
    g.userData.removed = false;
    g.userData.dragging = false;
    dragId = null;
    dragCandidate = null;
    guideLine.visible = false;
    homeMarker.visible = false;
    canvas.style.cursor = 'grab';
    if (g.userData.ghostMat) g.userData.ghostMat.color.setHex(0x38bdf8);
    syncGhost(id);
    updateStatus();
    updateAllButton();
    applyDim();
    // los controles se reactivan en el pointerup, no aquí
  }
  function setAllRemoved(remove) {
    PARTS.forEach((p, i) => {
      setTimeout(() => {
        const g = partGroups[p.id];
        g.userData.removed = remove;
        if (!remove) g.userData.freePos = null;
        syncGhost(p.id);
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
    tooltip.hidden = true; // que no quede flotando el nombre viejo junto a la etiqueta
    if (selectedPart && selectedPart !== id) restoreEmissive(selectedPart);
    selectedPart = id;
    if (id) {
      setEmissive(id, 0x0ea5e9, 0.5);
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
  function flyTo(pos, tgt, dur = 1.0) {
    camTween = {
      p0: camera.position.clone(), p1: new THREE.Vector3(...pos),
      t0: controls.target.clone(), t1: new THREE.Vector3(...tgt), k: 0, dur
    };
  }
  function setScene(name) {
    if (!SCENES[name]) return;
    activeScene = name;
    const s = SCENES[name];
    sceneButtons.forEach((b) => b.classList.toggle('is-active', b.dataset.scene === name));
    setSceneText(name);
    flyTo(s.cam, s.tgt, s.dur || 1.0);
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
    // Si se presionó sobre una pieza y el cursor se mueve, empieza el arrastre
    if (dragCandidate && !dragId && downPos) {
      if (Math.hypot(event.clientX - downPos.x, event.clientY - downPos.y) > 8) startDrag(dragCandidate);
    }
    if (dragId) {
      // Arrastrar la pieza sobre el plano que mira a la cámara, con imán hacia su sitio
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      if (raycaster.ray.intersectPlane(dragPlane, dragHit)) {
        const g = partGroups[dragId];
        const home = g.userData.base;
        const raw = tower.worldToLocal(dragHit.clone());
        const d = raw.distanceTo(home);
        // el imán se arma solo cuando la pieza ya está fuera de su sitio
        if (d > MAGNET_ARM_DIST) g.userData.magnetArmed = true;
        let target = raw;
        if (g.userData.magnetArmed && d < MAGNET_RADIUS) {
          const pull = 1 - d / MAGNET_RADIUS;
          const strength = Math.pow(pull, 1.5) * 0.85;
          target = raw.clone().lerp(home, strength);
        }
        g.userData.freePos = target;
        g.position.copy(target);
      }
      updateGuide();
      // si vuelve muy cerca de su sitio, se incrusta sola
      const g = partGroups[dragId];
      if (g && g.userData.magnetArmed) {
        g.getWorldPosition(guideV);
        if (guideV.distanceTo(g.userData.base) < SNAP_DIST) snapIn(dragId);
      }
      return;
    }
    if (dragCandidate) return; // botón sostenido sobre una pieza, sin arrastre aún
    if (event.pointerType !== 'mouse') return;
    const id = pickPart(event);
    if (id !== hoveredPart) {
      if (hoveredPart && hoveredPart !== selectedPart) restoreEmissive(hoveredPart);
      hoveredPart = id;
      if (id && id !== selectedPart) setEmissive(id, 0x0ea5e9, 0.22);
      canvas.style.cursor = id ? 'grab' : 'default';
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
    if (dragId) {
      partGroups[dragId].userData.dragging = false;
      if (partGroups[dragId].userData.ghostMat) partGroups[dragId].userData.ghostMat.color.setHex(0x38bdf8);
      dragId = null;
      dragCandidate = null;
      controls.enabled = true;
      guideLine.visible = false;
      homeMarker.visible = false;
    } else if (dragCandidate) {
      dragCandidate = null;
      controls.enabled = true;
    }
    if (hoveredPart && hoveredPart !== selectedPart) restoreEmissive(hoveredPart);
    hoveredPart = null;
    if (tooltip) tooltip.hidden = true;
    canvas.style.cursor = 'grab';
  });
  // El menú del navegador nunca debe aparecer sobre el visor (clic derecho = panorámica)
  canvas.addEventListener('contextmenu', (event) => event.preventDefault());
  canvas.addEventListener('pointerdown', (event) => {
    controls.enabled = true; // red de seguridad: la órbita nunca queda apagada
    downPos = { x: event.clientX, y: event.clientY };
    camTween = null;
    controls.autoRotate = false;
    lastInteract = clock.elapsedTime;
    if (event.button !== 0) return; // derecho = panorámica, medio = zoom (los lleva OrbitControls)
    tooltip.hidden = true;
    // Botón izquierdo sobre una pieza = agarrarla; en vacío = girar la cámara
    const id = pickPart(event);
    if (id) {
      dragCandidate = id;
      controls.enabled = false; // no rotar mientras se agarra una pieza
    }
  });
  let clickTimer = null;
  canvas.addEventListener('pointerup', (event) => {
    // La órbita siempre vuelve a quedar activa al soltar, pase lo que pase
    controls.enabled = true;
    if (dragId) {
      // Soltar la pieza: si quedó cerca de su sitio, encaja sola; si no, queda flotando
      const g = partGroups[dragId];
      g.userData.dragging = false;
      if (g.userData.ghostMat) g.userData.ghostMat.color.setHex(0x38bdf8);
      const p = new THREE.Vector3();
      g.getWorldPosition(p);
      const id = g.userData.partId;
      dragId = null;
      dragCandidate = null;
      guideLine.visible = false;
      homeMarker.visible = false;
      canvas.style.cursor = 'grab';
      downPos = null;
      if (p.distanceTo(g.userData.base) < RELEASE_SNAP_DIST) snapIn(id);
      return;
    }
    if (dragCandidate) {
      // fue un clic sobre la pieza: solo seleccionarla, no quitarla
      const id = dragCandidate;
      dragCandidate = null;
      guideLine.visible = false;
      homeMarker.visible = false;
      canvas.style.cursor = 'grab';
      downPos = null;
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { selectPart(id); clickTimer = null; }, 260);
      return;
    }
    guideLine.visible = false;
    homeMarker.visible = false;
    if (!downPos) return;
    const moved = Math.hypot(event.clientX - downPos.x, event.clientY - downPos.y);
    downPos = null;
    if (moved > 8) return; // fue un arrastre, no un clic
    const id = pickPart(event);
    // Espera un poco por si es doble clic (enfocar); si no, procesa el clic
    if (clickTimer) clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { selectPart(id); clickTimer = null; }, 260);
  });
  canvas.addEventListener('dblclick', (event) => {
    if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
    dragCandidate = null;
    const id = pickPart(event);
    if (!id) return;
    const target = new THREE.Vector3();
    partGroups[id].getWorldPosition(target);
    const dir = camera.position.clone().sub(controls.target).normalize();
    flyTo(
      [target.x + dir.x * 5, target.y + dir.y * 5 + 0.6, target.z + dir.z * 5],
      [target.x, target.y, target.z],
      1.1
    );
    guideLine.visible = false;
    homeMarker.visible = false;
    controls.enabled = true;
    controls.autoRotate = false;
    lastInteract = clock.elapsedTime;
  });
  canvas.addEventListener('wheel', () => { controls.autoRotate = false; lastInteract = clock.elapsedTime; }, { passive: true });

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
      PARTS.forEach((p) => { partGroups[p.id].userData.removed = false; partGroups[p.id].userData.freePos = null; syncGhost(p.id); });
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

  // --- Etiquetas flotantes por pieza ---
  const labelsWrap = document.getElementById('pc-labels');
  const labelsToggle = document.getElementById('pc-labels-toggle');
  const labelV = new THREE.Vector3();
  let labelsVisible = true;
  const labelEls = {};
  if (labelsWrap) {
    PARTS.forEach((p) => {
      const el = document.createElement('div');
      el.className = 'pc-label';
      el.textContent = t(p.key);
      el.dataset.i18n = p.key;
      labelsWrap.appendChild(el);
      labelEls[p.id] = el;
    });
  }
  if (labelsToggle) {
    labelsToggle.addEventListener('click', () => {
      labelsVisible = !labelsVisible;
      labelsToggle.classList.toggle('is-active', labelsVisible);
      labelsToggle.setAttribute('aria-pressed', String(labelsVisible));
      if (labelsWrap) labelsWrap.style.display = labelsVisible ? '' : 'none';
    });
  }

  // --- Tamaño ---
  function resize() {
    const w = shell.clientWidth;
    const h = shell.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
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
      camTween.k += dt / camTween.dur;
      const k = Math.min(camTween.k, 1);
      const s = k * k * (3 - 2 * k);
      camera.position.lerpVectors(camTween.p0, camTween.p1, s);
      controls.target.lerpVectors(camTween.t0, camTween.t1, s);
      if (k >= 1) camTween = null;
    }
    controls.update();

    // la cámara vuelve a girar sola tras 6 s sin tocar nada
    if (!reduceMotion && !camTween && clock.elapsedTime - lastInteract > 6) controls.autoRotate = true;

    // pulso al pasar el cursor sobre una pieza
    if (hoveredPart && hoveredPart !== selectedPart) {
      const pulse = 0.24 + Math.sin(elapsed * 6) * 0.12;
      (partMats[hoveredPart] || []).forEach((m) => { m.emissiveIntensity = pulse; });
    }

    // ventiladores
    const spin = reduceMotion ? 0 : 1;
    spinners.forEach((f) => { f.group.rotation.z += f.speed * fanBoost * spin * dt; });

    // tira RGB con ciclo de color suave
    rgbStrip.material.color.setHSL((elapsed * 0.04) % 1, 0.85, 0.6);

    // LED de encendido (respiración) y de disco (parpadeo aleatorio)
    powerLedMat.color.setHex(0x22c55e).multiplyScalar(0.65 + 0.35 * Math.sin(elapsed * 2.2));
    if (Math.random() < 0.08) hddOn = !hddOn;
    hddLedMat.color.setHex(hddOn ? 0xf59e0b : 0x201404);

    // vista desarmada escalonada + piezas retiradas con arco y flotación
    Object.values(partGroups).forEach((g) => {
      const ud = g.userData;
      ud.explodeK += (explodeTarget - ud.explodeK) * Math.min(1, dt * ud.explodeRate);
      ud.removeK += ((ud.removed ? 1 : 0) - ud.removeK) * Math.min(1, dt * 5);
      if (ud.dragging) {
        // la posición la fija el puntero directamente
      } else if (ud.freePos) {
        g.position.lerp(ud.freePos, Math.min(1, dt * 8));
        g.position.y += Math.sin(elapsed * 2 + ud.explodeRate) * 0.04;
      } else {
        g.position.copy(ud.base).addScaledVector(ud.dir, ud.explodeK * 1.6 + ud.removeK * 2.1);
        g.position.y += Math.sin(elapsed * 2 + ud.explodeRate) * 0.05 * ud.removeK;
      }
      g.rotation.y = ud.removeK * 0.7;
    });
    // los cables se desvanecen cuando su pieza está retirada
    cables.forEach((c) => {
      const target = partGroups[c.partId].userData.removed ? 0 : 1;
      c.mesh.material.opacity += (target - c.mesh.material.opacity) * Math.min(1, dt * 6);
      c.mesh.visible = c.mesh.material.opacity > 0.02;
    });
    if (homeMarker.visible) homeMarker.scale.setScalar(1 + 0.15 * Math.sin(elapsed * 5));
    frontPanel.userData.explodeK += (explodeTarget - frontPanel.userData.explodeK) * Math.min(1, dt * frontPanel.userData.explodeRate);
    frontPanel.position.copy(frontPanel.userData.base).addScaledVector(frontPanel.userData.dir, frontPanel.userData.explodeK * 1.6);

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

    // etiquetas flotantes que siguen a cada pieza
    if (labelsWrap && labelsVisible) {
      const w = shell.clientWidth;
      const h = shell.clientHeight;
      PARTS.forEach((p) => {
        const el = labelEls[p.id];
        if (!el) return;
        partGroups[p.id].getWorldPosition(labelV);
        labelV.project(camera);
        if (labelV.z > 1) { el.style.display = 'none'; return; }
        el.style.display = '';
        el.style.left = `${(labelV.x * 0.5 + 0.5) * w}px`;
        el.style.top = `${(-labelV.y * 0.5 + 0.5) * h}px`;
        el.style.opacity = partGroups[p.id].userData.targetOpacity < 1 ? '0.35' : '1';
      });
    }

    composer.render();
    if (firstFrame) {
      firstFrame = false;
      if (loadingEl) loadingEl.hidden = true;
      window.__pcViewerReady = true;
    }
  }
  setScene('overview');
  animate();
}
