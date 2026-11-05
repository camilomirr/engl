// =========================================================
// NVISION — Modelo 3D de la torre (Three.js)
// Reescrito desde cero: chasis, 8 piezas, ventiladores,
// cables con sus conectores, LED y tira RGB.
// Solo construye la geometría: la cámara, la interacción
// y las animaciones viven en pc3d-viewer.js.
// Three.js corre desde los archivos del repo
// (js/vendor/three), sin CDN.
// =========================================================
import * as THREE from 'three';

// id, claves i18n y dirección en la que sale la pieza al desmontarla
// (el lado abierto de la torre es +X; el frontal es +Z).
export const PARTS = [
  { id: 'motherboard', key: 'part_motherboard', funcKey: 'pc3d_partfunc_motherboard', typesKey: 'pc3d_parttypes_motherboard', dir: [1.6, 0.2, 0] },
  { id: 'ram', key: 'part_ram', funcKey: 'pc3d_partfunc_ram', typesKey: 'pc3d_parttypes_ram', dir: [1.6, 0.3, 0.2], labelOff: [0.25, 0, 0] },
  { id: 'cpu', key: 'part_cpu', funcKey: 'pc3d_partfunc_cpu', typesKey: 'pc3d_parttypes_cpu', dir: [1.6, 0.2, 0] },
  { id: 'cooler', key: 'part_cooler', funcKey: 'pc3d_partfunc_cooler', typesKey: 'pc3d_parttypes_cooler', dir: [1, 0.7, 0], labelOff: [0, 0.6, 0] },
  { id: 'gpu', key: 'part_gpu', funcKey: 'pc3d_partfunc_gpu', typesKey: 'pc3d_parttypes_gpu', dir: [1.8, 0, 0] },
  { id: 'storage', key: 'part_storage', funcKey: 'pc3d_partfunc_storage', typesKey: 'pc3d_parttypes_storage', dir: [1.3, 0, 0.5] },
  { id: 'psu', key: 'part_psu', funcKey: 'pc3d_partfunc_psu', typesKey: 'pc3d_parttypes_psu', dir: [1.2, 0.2, -0.8] },
  { id: 'optical', key: 'part_optical', funcKey: 'pc3d_partfunc_optical', typesKey: 'pc3d_parttypes_optical', dir: [0, 0.8, 1.3] }
];

export function buildPcModel() {
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

  // --- Registro de piezas (estado de arrastre y desmontaje) ---
  const partGroups = {};
  const partMeshes = [];
  const partMats = {};
  function registerPart(group, id) {
    const part = PARTS.find((p) => p.id === id);
    group.userData.partId = id;
    group.userData.base = group.position.clone();
    // Dirección normalizada: todas las piezas se alejan lo mismo al salir
    group.userData.dir = new THREE.Vector3(...part.dir).normalize();
    group.userData.targetOpacity = 1;
    group.userData.removed = false;
    group.userData.removeK = 0;
    group.userData.explodeK = 1; // arranca desarmada y se ensambla sola en la intro
    group.userData.explodeRate = 2.0 + PARTS.findIndex((p) => p.id === id) * 0.45;
    group.userData.freePos = null; // posición libre al arrastrarla suelta
    group.userData.dragging = false;
    group.userData.magnetArmed = false; // el imán solo ayuda al acercarla a su sitio
    group.userData.lastDragD = 0; // distancia al sitio en el movimiento anterior
    group.userData.grabOffset = new THREE.Vector3(); // agarre sin salto
    group.userData.ghost = null;
    group.userData.ghostMat = null;
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

  // Fantasma del hueco: silueta translúcida donde va la pieza retirada
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
    ensureGhost(id).visible = g.userData.removed;
  }

  // --- Torre: chasis (panel lateral abierto, sin vidrio) ---
  const tower = new THREE.Group();
  function caseBox(w, h, d, x, y, z, material = CASE_MAT) {
    const m = box(w, h, d, material);
    m.position.set(x, y, z);
    tower.add(m);
    return m;
  }
  caseBox(0.08, 4.6, 4.0, -1.1, 2.3, 0);          // pared izquierda (placa madre)
  // trasera con hueco real detrás del ventilador de la caja (sale el aire)
  caseBox(2.28, 3.3, 0.08, 0, 1.65, -2);          // trasera baja
  caseBox(2.28, 0.1, 0.08, 0, 4.55, -2);          // trasera alta
  caseBox(0.54, 1.2, 0.08, -0.87, 3.9, -2);       // trasera izquierda del hueco
  caseBox(0.54, 1.2, 0.08, 0.87, 3.9, -2);        // trasera derecha del hueco
  // rejilla del hueco trasero: aro + 3 barras
  const rearRing = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.03, 8, 40), CASE_MAT);
  rearRing.position.set(0, 3.9, -2);
  tower.add(rearRing);
  [3.6, 3.9, 4.2].forEach((y) => {
    const bar = box(1.16, 0.04, 0.02, CASE_MAT);
    bar.position.set(0, y, -2);
    tower.add(bar);
  });
  caseBox(2.28, 0.08, 4.08, 0, 4.6, 0);           // techo
  caseBox(2.28, 0.08, 4.08, 0, 0.04, 0);          // piso
  // frontal de malla gamer: marco sólido + rejilla perforada (los ventiladores se ven detrás)
  const frontPanel = new THREE.Group();
  frontPanel.position.set(0, 2.3, 2);
  const fpFrame = (w, h, x, y) => {
    const m = box(w, h, 0.08, CASE_MAT);
    m.position.set(x, y, 0);
    frontPanel.add(m);
    return m;
  };
  fpFrame(2.28, 0.25, 0, 2.175);   // marco superior
  fpFrame(2.28, 0.25, 0, -2.175);  // marco inferior
  fpFrame(0.25, 4.1, -1.015, 0);   // marco izquierdo
  fpFrame(0.25, 4.1, 1.015, 0);    // marco derecho
  // malla perforada: textura con agujeros reales (alphaTest)
  const meshCanvas = document.createElement('canvas');
  meshCanvas.width = meshCanvas.height = 256;
  const mctx = meshCanvas.getContext('2d');
  mctx.fillStyle = '#ffffff';
  mctx.fillRect(0, 0, 256, 256);
  mctx.globalCompositeOperation = 'destination-out';
  for (let yy = 8; yy < 256; yy += 16) {
    for (let xx = 8; xx < 256; xx += 16) {
      mctx.beginPath();
      mctx.arc(xx, yy, 5, 0, Math.PI * 2);
      mctx.fill();
    }
  }
  const meshTex = new THREE.CanvasTexture(meshCanvas);
  meshTex.colorSpace = THREE.SRGBColorSpace;
  meshTex.wrapS = meshTex.wrapT = THREE.RepeatWrapping;
  meshTex.repeat.set(1, 2.3);
  const meshMat = new THREE.MeshStandardMaterial({
    color: 0x2a3648, metalness: 0.7, roughness: 0.4,
    map: meshTex, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide
  });
  const meshPanel = new THREE.Mesh(new THREE.PlaneGeometry(1.78, 4.1), meshMat);
  meshPanel.castShadow = true; meshPanel.receiveShadow = true;
  frontPanel.add(meshPanel);
  frontPanel.userData.base = frontPanel.position.clone();
  frontPanel.userData.dir = new THREE.Vector3(0, 0, 1);
  frontPanel.userData.explodeK = 1;
  frontPanel.userData.explodeRate = 2.2;
  tower.add(frontPanel);
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
  // LED de encendido y de actividad (parpadean como un equipo real; van en el frontal)
  const powerLedMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
  const powerLed = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.03), powerLedMat);
  powerLed.position.set(0.72, 2.05, 0.05);
  frontPanel.add(powerLed);
  const hddLedMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const hddLed = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.06, 0.03), hddLedMat);
  hddLed.position.set(0.92, 2.05, 0.05);
  frontPanel.add(hddLed);

  // --- Placa madre ---
  const motherboard = new THREE.Group();
  motherboard.position.set(-0.94, 2.5, -0.1);
  motherboard.add(box(0.08, 3.5, 3.4, PCB_MAT));
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
  const trace = box(0.02, 2.6, 0.1, mat(0x0f172a, { emissive: 0x0ea5e9, emissiveIntensity: 0.25 }));
  trace.position.set(0.06, 0.2, -1.2);
  motherboard.add(trace);
  // conector ATX de 24 pines en el borde derecho de la placa
  const atxConnector = box(0.12, 0.5, 0.3, mat(0xe5e7eb, { metal: 0.3, rough: 0.5 }));
  atxConnector.position.set(0.1, 0.1, 1.55);
  motherboard.add(atxConnector);
  // zócalo del procesador: queda visible en la placa cuando se quita el CPU
  const socket = box(0.04, 0.95, 0.95, mat(0x1e293b, { metal: 0.4, rough: 0.5 }));
  socket.position.set(0.06, 0.95, -0.6);
  motherboard.add(socket);
  const socketInner = box(0.02, 0.78, 0.78, mat(0x475569, { metal: 0.5, rough: 0.45 }));
  socketInner.position.set(0.09, 0.95, -0.6);
  motherboard.add(socketInner);
  const socketLever = box(0.02, 0.7, 0.05, METAL_MAT);
  socketLever.position.set(0.1, 0.95, -0.08);
  motherboard.add(socketLever);
  tower.add(motherboard);
  registerPart(motherboard, 'motherboard');

  // --- Procesador: el chip queda visible cuando se quita el disipador ---
  const cpu = new THREE.Group();
  cpu.position.set(-0.80, 3.45, -0.7);
  // sustrato verde del chip
  cpu.add(box(0.08, 0.78, 0.78, mat(0x14532d, { metal: 0.2, rough: 0.55 })));
  // contactos dorados de la cara inferior (se ven al sacar el chip)
  const cpuPins = box(0.02, 0.66, 0.66, mat(0xd4af37, { metal: 0.9, rough: 0.3 }));
  cpuPins.position.x = -0.05;
  cpu.add(cpuPins);
  // disipador térmico integrado (IHS) de metal pulido
  const ihs = box(0.12, 0.62, 0.62, METAL_MAT);
  ihs.position.x = 0.07;
  cpu.add(ihs);
  // marca del chip sobre el IHS
  const ihsMark = box(0.02, 0.34, 0.34, mat(0x475569, { metal: 0.8, rough: 0.3 }));
  ihsMark.position.x = 0.14;
  cpu.add(ihsMark);
  const ihsDot = box(0.02, 0.08, 0.08, mat(0x0f172a, { emissive: 0x22d3ee, emissiveIntensity: 0.6 }));
  ihsDot.position.set(0.15, 0.1, 0.1);
  cpu.add(ihsDot);
  tower.add(cpu);
  registerPart(cpu, 'cpu');

  // --- Disipador del procesador: se quita aparte y deja ver el chip ---
  const cooler = new THREE.Group();
  cooler.position.set(-0.40, 3.45, -0.7);
  // placa base de cobre que apoya sobre el chip
  const coolerBase = box(0.08, 0.7, 0.7, COPPER_MAT);
  coolerBase.position.x = -0.23;
  cooler.add(coolerBase);
  // aletas de aluminio apiladas
  for (let i = 0; i < 7; i++) {
    const fin = box(0.025, 0.85, 0.85, METAL_MAT);
    fin.position.x = -0.18 + i * 0.04;
    cooler.add(fin);
  }
  // dos heatpipes de cobre que atraviesan las aletas
  [-0.24, 0.24].forEach((z) => {
    const pipe = cyl(0.045, 0.045, 0.9, COPPER_MAT, 12);
    pipe.position.set(-0.06, 0, z);
    cooler.add(pipe);
  });
  // ventilador sobre las aletas
  const coolerFan = makeFan(0.55);
  coolerFan.rotation.y = Math.PI / 2;
  coolerFan.position.x = 0.16;
  cooler.add(coolerFan);
  tower.add(cooler);
  registerPart(cooler, 'cooler');

  // --- RAM: 2 módulos DIMM de pie, sobresalen de la placa como deben ---
  const ram = new THREE.Group();
  ram.position.set(-0.82, 3.25, 0.75);
  const CHIP_MAT = mat(0x0f172a, { metal: 0.4, rough: 0.4 });
  const GOLD_MAT = mat(0xd4af37, { metal: 0.9, rough: 0.3 });
  [0, 0.25].forEach((dz, i) => {
    const stick = new THREE.Group();
    stick.position.z = dz;
    // PCB del módulo: largo vertical, sobresale de la placa hacia el lado abierto
    const pcb = box(0.5, 1.6, 0.06, mat(0x14532d, { metal: 0.2, rough: 0.55 }));
    pcb.position.x = 0.25;
    stick.add(pcb);
    // 8 chips de memoria por cara
    for (let c = 0; c < 8; c++) {
      const y = -0.61 + c * 0.175;
      const chipF = box(0.42, 0.2, 0.02, CHIP_MAT);
      chipF.position.set(0.25, y, 0.04);
      stick.add(chipF);
      const chipB = box(0.42, 0.2, 0.02, CHIP_MAT);
      chipB.position.set(0.25, y, -0.04);
      stick.add(chipB);
    }
    // contactos dorados del borde que entra en la ranura, con la muesca DDR
    const goldA = box(0.06, 0.9, 0.065, GOLD_MAT);
    goldA.position.set(0.03, -0.32, 0);
    stick.add(goldA);
    const goldB = box(0.06, 0.55, 0.065, GOLD_MAT);
    goldB.position.set(0.03, 0.45, 0);
    stick.add(goldB);
    // barra disipadora metálica del borde exterior con acento RGB
    const spreader = box(0.1, 1.6, 0.09, METAL_MAT);
    spreader.position.set(0.47, 0, 0);
    stick.add(spreader);
    const rgb = box(0.04, 1.6, 0.1, mat(0x0f172a, { emissive: i === 0 ? 0x22d3ee : 0xd946ef, emissiveIntensity: 0.45 }));
    rgb.position.set(0.53, 0, 0);
    stick.add(rgb);
    // ranura DIMM en la placa (se mueve con el módulo)
    const slot = box(0.1, 1.75, 0.12, DARK_MAT);
    slot.position.set(-0.02, 0, 0);
    stick.add(slot);
    ram.add(stick);
  });
  tower.add(ram);
  registerPart(ram, 'ram');

  // --- GPU ---
  const gpu = new THREE.Group();
  gpu.position.set(-0.55, 1.75, 0.1);
  gpu.add(box(0.42, 0.55, 2.7, mat(0x1f2937, { metal: 0.6, rough: 0.4 })));
  const gpuAccent = box(0.5, 0.09, 2.7, mat(0x7f1d1d, { emissive: 0xef4444, emissiveIntensity: 0.45 }));
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
  registerPart(gpu, 'gpu');

  // --- Fuente de poder ---
  const psu = new THREE.Group();
  psu.position.set(0.25, 0.5, -1.25);
  psu.add(box(1.5, 0.85, 1.4, mat(0x111827, { metal: 0.6, rough: 0.45 })));
  const psuGrill = cyl(0.32, 0.32, 0.03, mat(0x334155, { metal: 0.7, rough: 0.4 }), 24);
  psuGrill.position.set(0, 0.44, 0);
  psu.add(psuGrill);
  const psuLabel = box(0.5, 0.3, 0.02, mat(0x0f172a, { emissive: 0x10b981, emissiveIntensity: 0.4 }));
  psuLabel.position.set(0.76, 0.1, 0.3);
  psuLabel.rotation.y = Math.PI / 2;
  psu.add(psuLabel);
  tower.add(psu);
  registerPart(psu, 'psu');

  // --- Almacenamiento (SSD M.2 en placa) ---
  const storage = new THREE.Group();
  storage.position.set(-0.85, 1.05, 0.9);
  storage.add(box(0.06, 0.28, 0.95, mat(0x1d4ed8, { metal: 0.6, rough: 0.4 })));
  const ssdLabel = box(0.02, 0.2, 0.6, mat(0x0f172a, { emissive: 0x38bdf8, emissiveIntensity: 0.35 }));
  ssdLabel.position.x = 0.04;
  storage.add(ssdLabel);
  // conector SATA del SSD
  const sataConnector = box(0.08, 0.2, 0.15, mat(0xe5e7eb, { metal: 0.3, rough: 0.5 }));
  sataConnector.position.set(0.05, 0, -0.4);
  storage.add(sataConnector);
  tower.add(storage);
  registerPart(storage, 'storage');

  // --- Unidad óptica (bahía frontal superior) ---
  const optical = new THREE.Group();
  optical.position.set(0, 4.25, 1.55);
  optical.add(box(1.8, 0.28, 1.3, mat(0x9aa7b8, { metal: 0.8, rough: 0.35 })));
  const oddBezel = box(1.82, 0.28, 0.06, DARK_MAT);
  oddBezel.position.z = 0.66;
  optical.add(oddBezel);
  const oddSlot = box(1.2, 0.03, 0.02, mat(0x000000, { metal: 0.2, rough: 0.8 }));
  oddSlot.position.set(0, 0.02, 0.7);
  optical.add(oddSlot);
  tower.add(optical);
  registerPart(optical, 'optical');

  // --- Ventiladores del chasis (no clicables) ---
  [[0, 3.5, 1.92, 0, 0x22d3ee], [0, 1.3, 1.92, 0, 0x22d3ee], [0, 3.9, -1.92, Math.PI, 0x34d399]].forEach(([x, y, z, ry, color]) => {
    const fan = makeFan(0.55, color);
    fan.position.set(x, y, z);
    fan.rotation.y = ry;
    tower.add(fan);
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

  return {
    tower, frontPanel, rgbStrip, powerLedMat, hddLedMat,
    partGroups, partMeshes, partMats, spinners, cables,
    ensureGhost, syncGhost
  };
}
