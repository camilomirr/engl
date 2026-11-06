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
  function makeFan(radius, ringColor = 0x22d3ee, spin = true) { // spin=false: ventilador de repuesto, sin corriente no gira
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
      // una aspa azul para que el giro SE VEA: con las 5 iguales, en foto no se
      // distinguía si giraba o no (todas se ven igual al rotar)
      const bladeMat = i === 0 ? mat(0x38bdf8, { metal: 0.4, rough: 0.5 }) : mat(0x0f172a, { metal: 0.4, rough: 0.5 });
      const blade = box(radius * 0.78, radius * 0.34, 0.03, bladeMat);
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
    if (spin) spinners.push({ group: spinner, speed: 6 + Math.random() * 2 });
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
  // puertos traseros de la torre (la pared trasera termina en z=-2.04, así que
  // las bocas sobresalen por detrás): ahí entran el HDMI, la energía y el ethernet
  const rearPlateMat = mat(0x9ca3af, { metal: 0.9, rough: 0.3 });
  const rearDarkMat = mat(0x111827, { metal: 0.3, rough: 0.6 });
  const rearPort = (w, h, d, x, y, z, material) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; tower.add(m); return m;
  };
  rearPort(0.36, 0.18, 0.02, -0.55, 1.75, -2.05, rearPlateMat); // placa HDMI de la GPU
  rearPort(0.3, 0.12, 0.05, -0.55, 1.75, -2.07, rearDarkMat);   // boca HDMI
  rearPort(0.26, 0.21, 0.02, 0.25, 0.5, -2.05, rearPlateMat);   // placa de energía de la fuente
  rearPort(0.2, 0.15, 0.05, 0.25, 0.5, -2.07, rearDarkMat);     // boca de energía
  rearPort(0.22, 0.22, 0.02, -0.94, 3.0, -2.05, rearPlateMat);  // placa ethernet de la placa
  rearPort(0.16, 0.16, 0.05, -0.94, 3.0, -2.07, rearDarkMat);   // boca ethernet
  const ethLed = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.02), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
  ethLed.position.set(-0.78, 3.08, -2.06); tower.add(ethLed); // led del ethernet
  // puertos USB del panel trasero (el teclado y el ratón son inalámbricos: su
  // receptor va enchufado aquí, por eso no tienen cable)
  rearPort(0.22, 0.5, 0.02, -0.94, 2.3, -2.05, rearPlateMat);   // placa USB
  rearPort(0.12, 0.05, 0.05, -0.94, 2.4, -2.07, rearDarkMat);   // boca USB superior
  rearPort(0.12, 0.05, 0.05, -0.94, 2.2, -2.07, rearDarkMat);   // boca USB inferior
  rearPort(0.06, 0.03, 0.12, -0.94, 2.4, -2.13, rearDarkMat);   // receptor inalámbrico enchufado
  // interruptor de la fuente (rocker I/O): toda fuente lo lleva junto a su boca de
  // energía; antes la trasera tenía la boca pero no el interruptor
  rearPort(0.16, 0.2, 0.02, 0.55, 0.5, -2.05, rearPlateMat);    // placa del interruptor
  const psuSwitch = rearPort(0.12, 0.16, 0.04, 0.55, 0.5, -2.06, rearDarkMat);
  psuSwitch.rotation.x = 0.12; // basculante: un lado metido, el otro fuera
  // placa de I/O trasera (marco metálico alrededor de los puertos ethernet/USB):
  // antes eran placas sueltas sin el marco que las une
  const ioMat = mat(0x9ca3af, { metal: 0.9, rough: 0.3 });
  [[0.35, 0.03, -0.95, 3.35], [0.35, 0.03, -0.95, 1.95]].forEach(([w, h, x, y]) => {
    const bar = box(w, h, 0.02, ioMat); bar.position.set(x, y, -2.05); tower.add(bar);
  });
  [[-1.1], [-0.8]].forEach(([x]) => {
    const bar = box(0.03, 1.4, 0.02, ioMat); bar.position.set(x, 2.65, -2.05); tower.add(bar);
  });
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
  // grandes para que se vean: antes eran de 0.09 y en foto no se distinguían
  const powerLedMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
  const powerLed = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.04), powerLedMat);
  powerLed.position.set(0.72, 2.05, 0.05);
  frontPanel.add(powerLed);
  // botón de encendido físico en el frontal (se puede pulsar en 3D; el anillo se enciende con el PC)
  const powerBtnRingMat = new THREE.MeshBasicMaterial({ color: 0x1f2937 });
  const powerButton = new THREE.Group();
  const powerBtnCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.05, 20),
    new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.6, roughness: 0.35, transparent: true })
  );
  powerBtnCyl.rotation.x = Math.PI / 2;
  powerBtnCyl.position.set(0, 0, 0.04);
  powerButton.add(powerBtnCyl);
  const powerBtnRing = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.015, 8, 32), powerBtnRingMat);
  powerBtnRing.position.set(0, 0, 0.05);
  powerButton.add(powerBtnRing);
  powerButton.position.set(0.45, 2.05, 0.05);
  frontPanel.add(powerButton);
  const hddLedMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const hddLed = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.04), hddLedMat);
  hddLed.position.set(0.92, 2.05, 0.05);
  frontPanel.add(hddLed);
  // USB y audio en el frontal (bajo el botón): toda torre los lleva adelante;
  // antes el frontal solo tenía botón y LEDs
  const usbDark = mat(0x111827, { metal: 0.3, rough: 0.6 });
  [[0.45, 1.55], [0.72, 1.55]].forEach(([x, y]) => {
    const usb = box(0.16, 0.07, 0.03, usbDark); // boca USB-A
    usb.position.set(x, y, 0.05); frontPanel.add(usb);
    const tongue = box(0.13, 0.02, 0.02, mat(0x2563eb, { metal: 0.3, rough: 0.5 })); // lengua azul USB 3.0
    tongue.position.set(x, y, 0.065); frontPanel.add(tongue);
  });
  const usbC = box(0.09, 0.035, 0.03, usbDark); // USB-C
  usbC.position.set(0.58, 1.35, 0.05); frontPanel.add(usbC);
  // audio: verde = audífonos, rosa = micrófono
  [[0.45, 0x22c55e], [0.72, 0xec4899]].forEach(([x, c]) => {
    const jack = cyl(0.04, 0.04, 0.03, usbDark, 16);
    jack.rotation.x = Math.PI / 2; jack.position.set(x, 1.12, 0.05); frontPanel.add(jack);
    const jackRing = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.008, 8, 24), mat(c, { metal: 0.3, rough: 0.5 }));
    jackRing.position.set(x, 1.12, 0.065); frontPanel.add(jackRing);
  });

  // --- Placa madre ---
  const motherboard = new THREE.Group();
  motherboard.position.set(-0.94, 2.5, -0.1);
  motherboard.add(box(0.08, 3.5, 3.4, PCB_MAT));
  // cara con las pistas impresas como un mapa (textura generada: pistas, vías y serigrafía)
  const pcbCanvas = document.createElement('canvas');
  pcbCanvas.width = pcbCanvas.height = 512;
  const pctx = pcbCanvas.getContext('2d');
  pctx.fillStyle = '#166534';
  pctx.fillRect(0, 0, 512, 512);
  let pcbSeed = 1234567;
  const prnd = () => { pcbSeed = (pcbSeed * 1664525 + 1013904223) >>> 0; return pcbSeed / 4294967296; };
  for (let i = 0; i < 40; i++) { // parches suaves para que el verde no sea plano
    pctx.fillStyle = prnd() > 0.5 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
    pctx.fillRect(prnd() * 512, prnd() * 512, 40 + prnd() * 90, 30 + prnd() * 70);
  }
  const traceColors = ['#1f8a4c', '#1f8a4c', '#2ea86a', '#b45309', '#d4af37'];
  for (let t = 0; t < 34; t++) { // pistas: polilíneas ortogonales con giros de 45°/90°
    let x = prnd() * 512, y = prnd() * 512;
    let ang = Math.floor(prnd() * 8) * Math.PI / 4;
    const pts = [[x, y]];
    const steps = 3 + Math.floor(prnd() * 4);
    for (let s = 0; s < steps; s++) {
      const len = 20 + prnd() * 55;
      x = Math.max(10, Math.min(502, x + Math.cos(ang) * len));
      y = Math.max(10, Math.min(502, y + Math.sin(ang) * len));
      pts.push([x, y]);
      ang += (prnd() > 0.5 ? 1 : -1) * (Math.PI / 4) * (1 + Math.floor(prnd() * 2));
    }
    pctx.strokeStyle = traceColors[Math.floor(prnd() * traceColors.length)];
    pctx.lineWidth = t % 5 === 0 ? 2 : 3;
    pctx.lineJoin = 'round'; pctx.lineCap = 'round';
    pctx.beginPath(); pctx.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(([px, py]) => pctx.lineTo(px, py));
    pctx.stroke();
    pctx.fillStyle = '#d4af37'; // vías doradas en los giros
    pts.slice(1, -1).forEach(([px, py]) => { pctx.beginPath(); pctx.arc(px, py, 3, 0, Math.PI * 2); pctx.fill(); });
  }
  pctx.strokeStyle = 'rgba(229,231,235,0.8)'; // serigrafía blanca: contornos de componentes
  pctx.lineWidth = 1.5;
  for (let i = 0; i < 16; i++) {
    const w = 18 + prnd() * 46, h = 14 + prnd() * 40;
    pctx.strokeRect(prnd() * (512 - w), prnd() * (512 - h), w, h);
  }
  pctx.strokeStyle = '#0f3d21'; pctx.lineWidth = 10; // marco del borde
  pctx.strokeRect(5, 5, 502, 502);
  const pcbTex = new THREE.CanvasTexture(pcbCanvas);
  pcbTex.colorSpace = THREE.SRGBColorSpace;
  pcbTex.anisotropy = 4;
  const pcbFace = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 3.5),
    new THREE.MeshStandardMaterial({ map: pcbTex, roughness: 0.6, metalness: 0.1, transparent: true })
  );
  pcbFace.rotation.y = Math.PI / 2;
  pcbFace.position.set(0.05, 0, 0);
  pcbFace.castShadow = true; pcbFace.receiveShadow = true;
  motherboard.add(pcbFace);
  // disipador del chipset con aletas
  const chipset = box(0.1, 0.5, 0.5, DARK_MAT);
  chipset.position.set(0.08, -0.9, -0.6);
  motherboard.add(chipset);
  [-1.04, -0.92, -0.8, -0.68].forEach((y) => {
    const fin = box(0.06, 0.05, 0.5, METAL_MAT);
    fin.position.set(0.15, y, -0.6);
    motherboard.add(fin);
  });
  [-1.15, -0.55].forEach((y) => {
    const slot = box(0.1, 0.12, 2.4, mat(0x111827, { metal: 0.4, rough: 0.55 }));
    slot.position.set(0.08, y, 0.1);
    motherboard.add(slot);
  });
  // ranura PCIe x1 corta
  const slotX1 = box(0.1, 0.12, 0.8, mat(0x111827, { metal: 0.4, rough: 0.55 }));
  slotX1.position.set(0.08, -1.45, 0.1);
  motherboard.add(slotX1);
  for (let i = 0; i < 6; i++) {
    const cap = cyl(0.05, 0.05, 0.16, COPPER_MAT, 10);
    cap.rotation.z = Math.PI / 2;
    cap.position.set(0.1, 1.35 - i * 0.22, 1.45);
    motherboard.add(cap);
  }
  // condensadores del VRM: fila superior y columna izquierda del zócalo
  [[1.58, -1.0], [1.58, -0.75], [1.58, -0.5], [1.58, -0.25], [0.6, -1.28], [0.95, -1.28], [1.3, -1.28]].forEach(([y, z]) => {
    const cap = cyl(0.045, 0.045, 0.14, COPPER_MAT, 10);
    cap.rotation.z = Math.PI / 2;
    cap.position.set(0.1, y, z);
    motherboard.add(cap);
  });
  // pila CMOS (la moneda plateada)
  const battery = cyl(0.16, 0.16, 0.04, METAL_MAT, 24);
  battery.rotation.z = Math.PI / 2;
  battery.position.set(0.09, -1.4, 1.2);
  motherboard.add(battery);
  // chips negros repartidos por la placa
  [[1.6, -1.4, 0.3, 0.3], [-1.55, -1.2, 0.3, 0.3], [-0.2, 1.2, 0.3, 0.3], [0.6, -1.52, 0.25, 0.35]].forEach(([y, z, h, w]) => {
    const ic = box(0.06, h, w, DARK_MAT);
    ic.position.set(0.07, y, z);
    motherboard.add(ic);
  });
  // puertos SATA
  [0.55, 0.82].forEach((z) => {
    const sata = box(0.1, 0.15, 0.22, mat(0x111827, { metal: 0.4, rough: 0.55 }));
    sata.position.set(0.09, -1.62, z);
    motherboard.add(sata);
  });
  // conectores de ventilador (cabecitas blancas)
  [[1.6, 0.2], [-1.62, -0.5]].forEach(([y, z]) => {
    const fanHeader = box(0.06, 0.08, 0.12, mat(0xe5e7eb, { metal: 0.3, rough: 0.5 }));
    fanHeader.position.set(0.08, y, z);
    motherboard.add(fanHeader);
  });
  // conector ATX de 24 pines en el borde derecho de la placa
  const atxConnector = box(0.12, 0.5, 0.3, mat(0xe5e7eb, { metal: 0.3, rough: 0.5 }));
  atxConnector.position.set(0.1, 0.1, 1.55);
  motherboard.add(atxConnector);
  // conector EPS de 8 pines (poder del CPU) en el borde superior, sobre el zócalo
  const epsConnector = box(0.08, 0.15, 0.25, mat(0xe5e7eb, { metal: 0.3, rough: 0.5 }));
  epsConnector.position.set(0.08, 1.7, -0.4);
  motherboard.add(epsConnector);
  // cabecera del panel frontal (botón, LEDs y USB) en el borde inferior
  const fpHeader = box(0.06, 0.08, 0.2, mat(0xe5e7eb, { metal: 0.3, rough: 0.5 }));
  fpHeader.position.set(0.08, -1.62, 1.0);
  motherboard.add(fpHeader);
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
  // a ras del frontal (z=1.35): antes estaba en 1.55 y su frente sobresalía 0.2
  // por fuera de la malla del panel frontal, atravesándola
  const optical = new THREE.Group();
  optical.position.set(0, 4.25, 1.35);
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
  // ventilador superior de salida (techo): saca el aire caliente; antes el techo
  // era cerrado y no había salida superior. Gira con el PC (está en spinners)
  const topVent = cyl(0.62, 0.62, 0.02, mat(0x111827, { metal: 0.5, rough: 0.5 }), 24);
  topVent.position.set(0, 4.65, -0.5); tower.add(topVent); // rejilla oscura sobre el techo
  const topFan = makeFan(0.55, 0x22d3ee);
  topFan.rotation.x = Math.PI / 2; // boca arriba: extrae el aire por el techo
  topFan.position.set(0, 4.72, -0.5);
  tower.add(topFan);

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
  // 24 pines: de la fuente al conector ATX del borde de la placa (termina EN el conector)
  cable([[0.5, 0.7, -0.55], [0.95, 1.0, 0.2], [0.7, 1.9, 1.1], [0.0, 2.4, 1.45], [-0.84, 2.6, 1.45]], 0.06, 0x991b1b, 'motherboard');
  // poder de GPU: de la fuente al conector de 8 pines del borde superior
  cable([[0.0, 0.8, -0.55], [0.75, 1.3, 0.3], [0.4, 1.9, 0.95], [-0.5, 2.12, 1.15]], 0.045, 0xd97706, 'gpu');
  // SATA: de la fuente al conector del SSD (este es el de PODER; el de datos va aparte)
  cable([[-0.3, 0.7, -0.55], [-0.55, 0.9, 0.0], [-0.78, 1.05, 0.48]], 0.03, 0x2563eb, 'storage');
  // poder del CPU (EPS 8 pines): de la fuente, por detrás de la placa, al conector superior
  cable([[0.4, 0.75, -0.55], [-0.1, 1.5, -1.3], [-0.5, 2.8, -1.4], [-0.75, 3.8, -1.0], [-0.86, 4.15, -0.5]], 0.045, 0x374151, 'motherboard');
  // ventilador del CPU: del disipador a la cabecera CPU_FAN (arriba de la placa)
  cable([[-0.35, 3.55, -0.6], [-0.55, 3.85, -0.25], [-0.86, 4.1, 0.1]], 0.02, 0x1f2937, 'cooler');
  // ventilador trasero: a la cabecera superior (la de arriba sirve al ventilador de atrás)
  cable([[0, 3.9, -1.92], [-0.3, 4.05, -1.3], [-0.6, 4.15, -0.5], [-0.86, 4.1, 0.1]], 0.02, 0x1f2937, 'motherboard');
  // ventilador frontal superior: baja por el borde delantero hasta la cabecera SYS_FAN
  cable([[0, 3.5, 1.92], [0.4, 2.8, 1.75], [0.3, 1.8, 1.3], [-0.2, 1.1, 0.5], [-0.86, 0.88, -0.6]], 0.02, 0x1f2937, 'motherboard');
  // ventilador frontal inferior: a la cabecera SYS_FAN (abajo de la placa)
  cable([[0, 1.3, 1.92], [-0.2, 1.15, 1.4], [-0.6, 1.0, 0.6], [-0.86, 0.88, -0.6]], 0.02, 0x1f2937, 'motherboard');
  // unidad óptica: SATA de datos a la placa (puerto 1) y SATA de poder desde la fuente
  // (la unidad quedó a ras del frontal, así que su trasera está en z=0.7: los cables
  // terminan a ras de la trasera, sin meterse dentro de la unidad)
  cable([[0, 4.25, 0.7], [0.4, 3.8, 1.2], [0.6, 2.5, 1.4], [0.3, 1.2, 1.0], [-0.4, 0.9, 0.6], [-0.85, 0.88, 0.45]], 0.025, 0xdc2626, 'optical');
  cable([[0.4, 0.75, -0.55], [0.5, 1.8, -1.5], [0.4, 3.2, -1.6], [0.2, 4.0, -0.5], [0, 4.25, 0.7]], 0.03, 0x111827, 'optical');
  // SSD: SATA de datos del puerto 2 de la placa al conector del SSD (el azul ya es el de poder)
  cable([[-0.85, 0.88, 0.72], [-0.78, 0.95, 0.6], [-0.80, 1.05, 0.5]], 0.025, 0xdc2626, 'storage');
  // panel frontal: botón, LEDs y USB a la cabecera del borde inferior de la placa
  cable([[0.7, 2.0, 1.85], [0.5, 1.3, 1.5], [-0.2, 0.95, 1.1], [-0.86, 0.85, 1.0]], 0.02, 0x1f2937, 'motherboard');

  // --- Entorno 3D estilo taller (PC Building Simulator): cuarto, escritorio y cosas ---
  // La torre ya está en y=0, así que la superficie del escritorio ES y=0 y el suelo queda abajo.
  let setScreen = null; // la asigna buildEnvironment: dibuja la pantalla del monitor (off/boot/windows/error)
  function buildEnvironment() {
    const env = new THREE.Group();
    const woodTex = (() => { // madera del escritorio
      const c = document.createElement('canvas'); c.width = c.height = 256;
      const x = c.getContext('2d');
      x.fillStyle = '#7c5a3a'; x.fillRect(0, 0, 256, 256);
      let s = 777; const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
      for (let i = 0; i < 46; i++) {
        x.strokeStyle = r() > 0.5 ? 'rgba(93,66,38,0.55)' : 'rgba(160,120,80,0.4)';
        x.lineWidth = 1 + r() * 3;
        const y = r() * 256;
        x.beginPath(); x.moveTo(0, y);
        x.bezierCurveTo(85, y + (r() - 0.5) * 14, 170, y + (r() - 0.5) * 14, 256, y + (r() - 0.5) * 10);
        x.stroke();
      }
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2);
      return t;
    })();
    const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.75, metalness: 0.05, transparent: true });
    const darkMetal = mat(0x1f2937, { metal: 0.7, rough: 0.4 });
    const wallMat = mat(0x2b3648, { metal: 0.05, rough: 0.95 });
    const wallMat2 = mat(0x232f42, { metal: 0.05, rough: 0.95 });
    const floorMat = mat(0x1c2433, { metal: 0.05, rough: 0.95 });
    const add = (mesh, x, y, z) => { mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; env.add(mesh); return mesh; };

    // suelo del cuarto
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(34, 34), floorMat);
    floor.rotation.x = -Math.PI / 2; floor.position.y = -2.6; floor.receiveShadow = true;
    env.add(floor);
    // alfombra bajo el escritorio
    const rugCanvas = document.createElement('canvas'); rugCanvas.width = rugCanvas.height = 256;
    const rctx = rugCanvas.getContext('2d');
    rctx.fillStyle = '#1e293b'; rctx.fillRect(0, 0, 256, 256);
    rctx.strokeStyle = 'rgba(59,130,246,0.55)'; rctx.lineWidth = 6; rctx.strokeRect(10, 10, 236, 236);
    rctx.strokeStyle = '#334155'; rctx.lineWidth = 3; rctx.strokeRect(24, 24, 208, 208);
    const rugTex = new THREE.CanvasTexture(rugCanvas); rugTex.colorSpace = THREE.SRGBColorSpace;
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(19, 11),
      new THREE.MeshStandardMaterial({ map: rugTex, roughness: 0.95, metalness: 0, transparent: true }));
    rug.rotation.x = -Math.PI / 2; rug.position.set(0.3, -2.58, 0.5); rug.receiveShadow = true;
    env.add(rug);
    // paredes (solo la cara interior se ve; desde fuera desaparecen)
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(34, 12), wallMat);
    add(backWall, 0, 3.4, -5); backWall.castShadow = false;
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(24, 12), wallMat2);
    leftWall.rotation.y = Math.PI / 2; add(leftWall, -9.5, 3.4, 0); leftWall.castShadow = false;
    // rodapiés: apoyados en el suelo (y=-2.6), sin meterse por debajo del piso
    add(box(34, 0.25, 0.06, mat(0x94a3b8, { metal: 0.2, rough: 0.6 })), 0, -2.475, -4.97);
    add(box(0.06, 0.25, 24, mat(0x94a3b8, { metal: 0.2, rough: 0.6 })), -9.47, -2.475, 0);
    // ventana en la pared trasera (luz suave, sin quemar)
    const winGlass = new THREE.Mesh(new THREE.PlaneGeometry(3, 3),
      mat(0x0f172a, { emissive: 0x9cc8ff, emissiveIntensity: 1.25, metal: 0.1, rough: 0.4 }));
    add(winGlass, -3, 4.2, -4.96); winGlass.castShadow = false;
    const frameMat = mat(0xd7dee8, { metal: 0.3, rough: 0.5 });
    add(box(3.2, 0.12, 0.08, frameMat), -3, 5.75, -4.94);
    add(box(3.2, 0.12, 0.08, frameMat), -3, 2.65, -4.94);
    add(box(0.12, 3.2, 0.08, frameMat), -4.55, 4.2, -4.94);
    add(box(0.12, 3.2, 0.08, frameMat), -1.45, 4.2, -4.94);
    add(box(0.08, 3.0, 0.06, frameMat), -3, 4.2, -4.93);
    add(box(3.0, 0.08, 0.06, frameMat), -3, 4.2, -4.93);
    add(box(3.4, 0.1, 0.25, frameMat), -3, 2.55, -4.875); // repisa: a ras de la pared, sin atravesarla
    // póster NVISION en la pared trasera
    const posterCanvas = document.createElement('canvas'); posterCanvas.width = 256; posterCanvas.height = 340;
    const pctx = posterCanvas.getContext('2d');
    pctx.fillStyle = '#0f172a'; pctx.fillRect(0, 0, 256, 340);
    const grad = pctx.createLinearGradient(0, 0, 256, 0);
    grad.addColorStop(0, '#2563eb'); grad.addColorStop(1, '#06b6d4');
    pctx.fillStyle = grad; pctx.fillRect(0, 0, 256, 26);
    pctx.fillStyle = '#ffffff'; pctx.font = 'bold 48px sans-serif'; pctx.textAlign = 'center';
    pctx.fillText('NVISION', 128, 100);
    pctx.fillStyle = '#1e293b'; pctx.fillRect(78, 140, 100, 130);
    pctx.fillStyle = '#22d3ee'; pctx.beginPath(); pctx.arc(128, 195, 26, 0, Math.PI * 2); pctx.fill();
    pctx.fillStyle = '#0f172a'; pctx.fillRect(96, 240, 64, 10);
    pctx.fillStyle = '#64748b'; pctx.font = '16px sans-serif';
    pctx.fillText('ARMA · JUEGA · CREA', 128, 305);
    const posterTex = new THREE.CanvasTexture(posterCanvas); posterTex.colorSpace = THREE.SRGBColorSpace;
    const poster = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.4),
      new THREE.MeshStandardMaterial({ map: posterTex, roughness: 0.9, metalness: 0, transparent: true }));
    add(poster, 0.8, 5, -4.96); poster.castShadow = false;
    // estanterías con cajas de componentes en la pared trasera
    [5.0, 6.3].forEach((y) => {
      add(box(4, 0.08, 0.9, woodMat), 3.2, y, -4.55);
      [-0.5, 0.5].forEach((dx) => add(box(0.08, 0.3, 0.08, darkMetal), 3.2 + dx * 3.4, y - 0.18, -4.7));
    });
    add(box(0.9, 0.7, 0.7, mat(0x1e3a5f, { metal: 0.3, rough: 0.6 })), 1.9, 5.4, -4.55);
    add(box(0.7, 0.6, 0.6, mat(0x7f1d1d, { metal: 0.3, rough: 0.6 })), 3.1, 5.35, -4.55);
    add(box(0.6, 0.9, 0.6, mat(0x334155, { metal: 0.4, rough: 0.5 })), 4.2, 5.5, -4.55);
    add(box(0.8, 0.5, 0.7, mat(0x14532d, { metal: 0.3, rough: 0.6 })), 2.6, 6.6, -4.55);
    add(box(0.6, 0.6, 0.6, mat(0x78350f, { metal: 0.3, rough: 0.6 })), 3.8, 6.65, -4.55);
    const pot = cyl(0.18, 0.14, 0.25, mat(0x92400e, { metal: 0.2, rough: 0.7 }), 16);
    add(pot, 1.7, 6.48, -4.55);
    const leafMat = mat(0x22c55e, { metal: 0.1, rough: 0.7 });
    [[0, 0.25, 0], [0.1, 0.18, 0.08], [-0.1, 0.18, -0.06]].forEach(([dx, dy, dz]) => {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), leafMat);
      add(leaf, 1.7 + dx, 6.6 + dy, -4.55 + dz);
    });
    // escritorio: tablero de madera + patas + cajonera (mesa de trabajo ancha y honda,
    // estilo PC Building Simulator: el monitor a un lado y la torre al otro, ambos visibles)
    add(box(16, 0.35, 8, woodMat), 0.3, -0.175, 0.5);
    [[-7.4, -3.2], [7.6, -3.2], [-7.4, 4.2], [7.6, 4.2]].forEach(([x, z]) => {
      // patas de la alfombra (y=-2.58) hasta la cara inferior del tablero (y=-0.35):
      // antes medían 2.6 y se metían 0.35 dentro de la madera; con 2.25 llegaban
      // al suelo (y=-2.6) y atravesaban la alfombra 0.02 por debajo
      add(box(0.3, 2.23, 0.3, darkMetal), x, -1.465, z);
    });
    add(box(2.2, 2.23, 4.5, mat(0x374151, { metal: 0.5, rough: 0.5 })), 3.4, -1.465, 0.3);
    [-0.75, -1.45, -2.15].forEach((y) => {
      add(box(0.06, 0.62, 4.0, mat(0x4b5563, { metal: 0.5, rough: 0.5 })), 4.53, y, 0.3);
      add(box(0.05, 0.06, 0.5, METAL_MAT), 4.58, y, 0.3);
    });
    // monitor + teclado sobre el escritorio, a la izquierda de la torre
    // pantalla del monitor: off = apagada, boot = logo y puntos de carga,
    // windows = escritorio, error = falta una pieza (detail = nombre de la pieza)
    // pantalla del monitor: off = apagada, boot = logo NVISION y puntos de carga,
    // windows = escritorio Windows 11, error = falta una pieza (detail = nombre de la pieza)
    const screenCanvas = document.createElement('canvas'); screenCanvas.width = 512; screenCanvas.height = 288;
    const screenTex = new THREE.CanvasTexture(screenCanvas); screenTex.colorSpace = THREE.SRGBColorSpace;
    function drawScreen(mode, detail = '') {
      const x = screenCanvas.getContext('2d');
      const W = 512, H = 288;
      x.textAlign = 'center';
      if (mode === 'off') {
        x.fillStyle = '#05070d'; x.fillRect(0, 0, W, H);
      } else if (mode === 'boot') {
        // arranque de Windows 11 de verdad: logo de Windows (4 cuadros azules)
        // + ruedita de carga, en negro. El logo NVISION no va aquí: es el fondo
        // de escritorio (ver 'windows').
        x.fillStyle = '#000000'; x.fillRect(0, 0, W, H);
        const tick = Number(detail) || 0;
        const s = 34, gap = 6, lx = 256 - s - gap / 2, ly = 88;
        x.fillStyle = '#0078d4';
        x.fillRect(lx, ly, s, s);
        x.fillRect(lx + s + gap, ly, s, s);
        x.fillRect(lx, ly + s + gap, s, s);
        x.fillRect(lx + s + gap, ly + s + gap, s, s);
        const cx = 256, cy = 212, r = 16, n = 10;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2; // el primero, arriba
          const d = ((tick % n) - i + n) % n; // 0 = el que brilla, se apaga hacia atrás
          const alpha = d === 0 ? 1 : Math.max(0.2, 1 - d * 0.12);
          x.fillStyle = `rgba(255,255,255,${alpha})`;
          x.beginPath(); x.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, d === 0 ? 3.5 : 2.5, 0, Math.PI * 2); x.fill();
        }
      } else if (mode === 'error') {
        x.fillStyle = '#0a0f1e'; x.fillRect(0, 0, W, H);
        x.fillStyle = '#ef4444';
        x.beginPath(); x.moveTo(256, 44); x.lineTo(304, 124); x.lineTo(208, 124); x.closePath(); x.fill();
        x.fillStyle = '#ffffff'; x.font = 'bold 48px sans-serif';
        x.fillText('!', 256, 112);
        x.fillStyle = '#ef4444'; x.font = 'bold 30px sans-serif';
        x.fillText('FALTA UNA PIEZA', 256, 168);
        x.fillStyle = '#ffffff'; x.font = '22px sans-serif';
        const names = String(detail).split(', ');
        x.fillText(names[0] || '', 256, 208);
        if (names[1]) x.fillText(names.slice(1).join(', '), 256, 236);
        x.fillStyle = '#94a3b8';
        x.fillText('Instala todas las piezas', 256, 272);
      } else { // windows 11 modo claro: solo NVISION de fondo + rejilla de iconos + barra blanca
        // fondo: NVISION como wallpaper, SOLO el logo (sin "PC BUILDING"), centrado
        // en el área del escritorio con un resplandor suave detrás
        const g = x.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#000000'); g.addColorStop(0.55, '#050a14'); g.addColorStop(1, '#0a1628');
        x.fillStyle = g; x.fillRect(0, 0, W, H);
        const glow = x.createRadialGradient(256, 120, 10, 256, 120, 160);
        glow.addColorStop(0, 'rgba(37,99,235,0.4)'); glow.addColorStop(1, 'rgba(37,99,235,0)');
        x.fillStyle = glow; x.fillRect(0, 0, W, H);
        const lg = x.createLinearGradient(148, 0, 364, 0);
        lg.addColorStop(0, '#2563eb'); lg.addColorStop(1, '#06b6d4');
        x.fillStyle = lg;
        x.shadowColor = 'rgba(37,99,235,0.7)'; x.shadowBlur = 18;
        x.font = 'bold 56px sans-serif';
        x.fillText('NVISION', 256, 138);
        x.shadowBlur = 0;
        // iconos del escritorio estilo Windows 11: en columna a la izquierda, con
        // margen arriba (el primero ya no queda pegado al borde), su nombre debajo
        // y el mismo hueco entre uno y otro (paso de 68 px)
        x.textAlign = 'center';
        const deskIcon = (cy, label, draw) => {
          draw(44, cy);
          x.fillStyle = '#ffffff';
          x.shadowColor = 'rgba(0,0,0,0.6)'; x.shadowBlur = 3;
          x.font = '12px sans-serif';
          x.fillText(label, 44, cy + 38);
          x.shadowBlur = 0;
        };
        deskIcon(32, 'Este equipo', (ix, iy) => { // monitor chico
          x.fillStyle = '#3b82f6'; x.fillRect(ix - 12, iy - 9, 24, 16);
          x.fillStyle = '#93c5fd'; x.fillRect(ix - 3, iy + 7, 6, 4);
          x.fillStyle = '#60a5fa'; x.fillRect(ix - 9, iy + 11, 18, 2);
        });
        deskIcon(100, 'Papelera', (ix, iy) => {
          x.fillStyle = '#9ca3af';
          x.beginPath(); x.moveTo(ix - 10, iy - 6); x.lineTo(ix + 10, iy - 6); x.lineTo(ix + 8, iy + 10); x.lineTo(ix - 8, iy + 10); x.closePath(); x.fill();
          x.fillStyle = '#d1d5db'; x.fillRect(ix - 12, iy - 10, 24, 3);
        });
        deskIcon(168, 'NVISION', (ix, iy) => { // carpeta amarilla
          x.fillStyle = '#fbbf24'; x.fillRect(ix - 12, iy - 8, 24, 16);
          x.fillStyle = '#f59e0b'; x.fillRect(ix - 12, iy - 8, 9, 4);
        });
        // barra de tareas MODO CLARO: blanca, 7 iconos de 18 px con 8 px de hueco,
        // grupo de 174 px centrado exacto en 256 (169..343), reloj a la derecha
        x.fillStyle = 'rgba(243,243,243,0.94)'; x.fillRect(0, 248, W, 40);
        x.fillStyle = 'rgba(0,0,0,0.08)'; x.fillRect(0, 248, W, 1);
        x.fillStyle = '#0078d4'; // Inicio (4 cuadros)
        x.fillRect(169, 259, 8, 8); x.fillRect(179, 259, 8, 8);
        x.fillRect(169, 269, 8, 8); x.fillRect(179, 269, 8, 8);
        x.strokeStyle = '#1f2937'; x.lineWidth = 2; // Buscar (lupa)
        x.beginPath(); x.arc(204, 268, 5, 0, Math.PI * 2); x.stroke();
        x.beginPath(); x.moveTo(207.5, 271.5); x.lineTo(212, 276); x.stroke();
        x.strokeRect(221, 262, 12, 9); x.strokeRect(226, 267, 12, 9); // Vista de tareas
        x.strokeRect(247, 261, 18, 14); // Widgets
        x.beginPath(); x.moveTo(256, 261); x.lineTo(256, 275); x.stroke();
        x.fillStyle = '#fbbf24'; x.fillRect(273, 262, 18, 12); // Explorador (carpeta amarilla)
        x.fillStyle = '#f59e0b'; x.fillRect(273, 262, 7, 3);
        const eg = x.createLinearGradient(299, 259, 317, 277); // Edge (círculo azul-verde)
        eg.addColorStop(0, '#0ea5e9'); eg.addColorStop(1, '#10b981');
        x.fillStyle = eg; x.beginPath(); x.arc(308, 268, 9, 0, Math.PI * 2); x.fill();
        x.fillStyle = '#1f2937'; x.fillRect(325, 262, 14, 12); // Store (bolsa)
        x.strokeStyle = '#f3f3f3'; x.lineWidth = 1.5; x.beginPath(); x.arc(332, 262, 4, Math.PI, 0); x.stroke();
        x.strokeStyle = '#1f2937'; x.lineWidth = 1.8; // Wi-Fi, volumen y batería (oscuros)
        x.beginPath(); x.arc(368, 273, 9, Math.PI * 1.25, Math.PI * 1.75); x.stroke();
        x.beginPath(); x.arc(368, 273, 5.5, Math.PI * 1.25, Math.PI * 1.75); x.stroke();
        x.fillStyle = '#1f2937'; x.beginPath(); x.arc(368, 273, 1.8, 0, Math.PI * 2); x.fill();
        x.fillStyle = '#1f2937';
        x.beginPath(); x.moveTo(384, 261); x.lineTo(384, 275); x.lineTo(391, 271); x.lineTo(391, 265); x.closePath(); x.fill();
        x.fillRect(392, 267, 4, 3);
        x.strokeStyle = '#1f2937'; x.lineWidth = 1.8; x.strokeRect(400, 262, 12, 9);
        x.fillStyle = '#1f2937'; x.fillRect(402, 264, 8, 5); x.fillRect(413, 265, 2, 3);
        x.fillStyle = '#1f2937'; x.font = '13px sans-serif'; x.textAlign = 'right';
        x.fillText('20:31', 504, 266);
        x.fillText('05/11/2026', 504, 282);
      }
      screenTex.needsUpdate = true;
    }
    setScreen = drawScreen;
    drawScreen('off'); // el equipo arranca apagado: hay que encenderlo
    const peripherals = new THREE.Group();
    peripherals.position.set(-4.5, 0, 1.5); // a la izquierda de la torre, bien separado: ambos se ven a la vez
    peripherals.rotation.y = -0.27; // la pantalla mira hacia la cámara
    env.add(peripherals);
    const padd = (mesh, x, y, z) => { mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; peripherals.add(mesh); return mesh; };
    // monitor GRANDE de verdad: una pantalla de 27" (61 cm de ancho) mide casi lo mismo
    // de alto que la torre y es 3 veces más ancha que ella (1 unidad = 10 cm)
    padd(box(1.2, 0.08, 0.8, darkMetal), 0, 0.04, 0);
    padd(box(0.18, 0.9, 0.18, darkMetal), -0.1, 0.48, 0);
    padd(box(0.1, 2.5, 4.5, darkMetal), 0, 2.05, 0);
    // alfombrilla grande bajo teclado y ratón: antes iban directo sobre la madera
    padd(box(2.4, 0.02, 5.6, mat(0x1e293b, { metal: 0.1, rough: 0.9 })), 1.6, 0.01, 0.35);
    // (teclado, teclas y ratón suben 0.02 para apoyar SOBRE la alfombrilla, no dentro de ella)
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 2.35),
      new THREE.MeshBasicMaterial({ map: screenTex }));
    screen.rotation.y = Math.PI / 2;
    padd(screen, 0.06, 2.05, 0);
    // puertos en la parte trasera del monitor (la pantalla termina en x=-0.05):
    // placa metálica + boca oscura, ahí entran el HDMI y la energía
    const portPlateMat = mat(0x9ca3af, { metal: 0.9, rough: 0.3 });
    const portDarkMat = mat(0x111827, { metal: 0.3, rough: 0.6 });
    padd(box(0.02, 0.2, 0.3, portPlateMat), -0.06, 1.7, 0.4); // placa HDMI
    const hdmiSocket = padd(box(0.06, 0.14, 0.24, portDarkMat), -0.08, 1.7, 0.4); // boca HDMI
    padd(box(0.02, 0.16, 0.22, portPlateMat), -0.06, 1.2, -0.4); // placa energía
    const pwrSocket = padd(box(0.06, 0.1, 0.16, portDarkMat), -0.08, 1.2, -0.4); // boca de energía
    // teclado de tamaño real (45 cm de ancho): el lienzo va en vertical porque el
    // teclado es más ancho (Z) que profundo (X)
    const keyCanvas = document.createElement('canvas'); keyCanvas.width = 96; keyCanvas.height = 288;
    const kctx = keyCanvas.getContext('2d');
    kctx.fillStyle = '#111827'; kctx.fillRect(0, 0, 96, 288);
    kctx.fillStyle = '#1f2937';
    for (let c = 0; c < 4; c++) for (let r = 0; r < 14; r++) kctx.fillRect(6 + c * 22, 6 + r * 20, 18, 16);
    const keyTex = new THREE.CanvasTexture(keyCanvas); keyTex.colorSpace = THREE.SRGBColorSpace;
    padd(box(1.5, 0.07, 4.0, mat(0x111827, { metal: 0.3, rough: 0.6 })), 1.6, 0.055, 0);
    const keys = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 3.8),
      new THREE.MeshStandardMaterial({ map: keyTex, roughness: 0.6, metalness: 0.1, transparent: true }));
    keys.rotation.x = -Math.PI / 2;
    padd(keys, 1.6, 0.095, 0);
    // ratón de verdad (no una lámina plana): cuerpo con lomo, rueda y base, en gris
    // claro para que se distinga del escritorio oscuro
    const mouse = new THREE.Group();
    const mouseBase = box(1.1, 0.1, 0.6, mat(0x334155, { metal: 0.5, rough: 0.4 }));
    mouseBase.position.set(0, 0.05, 0); mouse.add(mouseBase);
    const mouseBody = box(0.9, 0.14, 0.5, mat(0x64748b, { metal: 0.4, rough: 0.45 }));
    mouseBody.position.set(-0.05, 0.16, 0); mouse.add(mouseBody);
    const wheel = cyl(0.05, 0.05, 0.07, mat(0x0f172a, { metal: 0.3, rough: 0.5 }), 12);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(0.32, 0.2, 0); mouse.add(wheel);
    padd(mouse, 1.6, 0.02, 2.4); mouse.rotation.y = -0.2;
    // cosas sueltas del taller sobre el escritorio (en el centro, atrás: fuera del
    // camino de las piezas que salen hacia +Z y de la torre, que con el giro de 90°
    // ocupa x 1.5..5.5 y z -1.1..1.1: nada puede pisar ese rectángulo)
    const spareFan = makeFan(0.55, 0x22d3ee, false); // de repuesto, sin corriente no gira
    spareFan.rotation.x = -Math.PI / 2;
    spareFan.position.set(-0.5, 0.06, -2.5); // apoyado en la mesa (antes flotaba a 0.15)
    env.add(spareFan);
    add(box(0.9, 0.6, 0.7, mat(0x9a7b4f, { metal: 0.1, rough: 0.85 })), 0.8, 0.3, -2.4);
    const smallBox = box(0.6, 0.4, 0.5, mat(0x9a7b4f, { metal: 0.1, rough: 0.85 }));
    add(smallBox, -0.6, 0.2, -1.2); smallBox.rotation.y = 0.4;
    const screwHandle = cyl(0.05, 0.05, 0.35, mat(0xdc2626, { metal: 0.3, rough: 0.5 }), 12);
    screwHandle.rotation.z = Math.PI / 2;
    add(screwHandle, -1.8, 0.05, -2.8);
    const screwShaft = cyl(0.02, 0.02, 0.4, METAL_MAT, 8);
    screwShaft.rotation.z = Math.PI / 2;
    add(screwShaft, -1.45, 0.05, -2.8);
    const mugMat = mat(0xdc2626, { metal: 0.2, rough: 0.5 }); // pocillo rojo, que se vea sobre el escritorio
    add(cyl(0.09, 0.09, 0.22, mugMat, 16), -5.5, 0.11, -1.0);
    const mugHandle = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.015, 8, 20), mugMat);
    mugHandle.position.set(-5.41, 0.11, -1.0); // el asa, como un pocillo de verdad
    mugHandle.castShadow = true;
    env.add(mugHandle);
    // panel lateral de la torre (el que se quitó para abrirla): apoyado en la pared
    // trasera, a la derecha de la torre. Antes la torre estaba abierta y el panel
    // no existía en ningún lado
    const sidePanel = box(4.0, 4.6, 0.06, mat(0x1f2937, { metal: 0.7, rough: 0.35 }));
    sidePanel.position.set(7.5, -0.36, -4.40); sidePanel.rotation.x = 0.26; // inclinado, arriba contra la pared
    sidePanel.castShadow = true; sidePanel.receiveShadow = true; env.add(sidePanel);
    const sideGlass = box(3.4, 3.9, 0.02, mat(0x94a3b8, { metal: 0.9, rough: 0.1 }));
    sideGlass.position.set(7.5, -0.36, -4.36); sideGlass.rotation.x = 0.26; // cristal claro para que se distinga del panel oscuro
    env.add(sideGlass);
    // lámpara de escritorio articulada (luz cálida): base + dos brazos en ángulo
    // + pantalla inclinada + bombilla grande que asoma + halo de luz en la mesa
    add(cyl(0.22, 0.28, 0.08, darkMetal, 20), -6.5, 0.04, -1.5);
    const lampArm1 = cyl(0.04, 0.04, 1.05, darkMetal, 12);
    add(lampArm1, -6.25, 0.54, -1.5); lampArm1.rotation.z = -0.497; // brazo bajo, 28° hacia el centro
    const lampJoint = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), darkMetal);
    lampJoint.position.set(-6.0, 1.0, -1.5); env.add(lampJoint);
    const lampArm2 = cyl(0.04, 0.04, 0.75, darkMetal, 12);
    add(lampArm2, -5.75, 1.275, -1.5); lampArm2.rotation.z = -0.737; // brazo alto, 42° hacia el centro
    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.35, 20), mat(0x1f2937, { metal: 0.6, rough: 0.4 }));
    lampShade.position.set(-5.5, 1.55, -1.5); lampShade.rotation.z = 0.6; lampShade.castShadow = true; env.add(lampShade);
    const lampBulb = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffe9c4 }));
    lampBulb.position.set(-5.55, 1.38, -1.5); env.add(lampBulb); // cuelga bien por debajo de la pantalla
    const lampLight = new THREE.PointLight(0xffd9a0, 15, 9, 2);
    lampLight.position.set(-5.55, 1.35, -1.5); env.add(lampLight);
    const lampPool = new THREE.Mesh(new THREE.CircleGeometry(0.9, 24),
      new THREE.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: 0.18 }));
    lampPool.rotation.x = -Math.PI / 2; lampPool.position.set(-5.6, 0.012, -1.5); env.add(lampPool);
    // bandeja con tornillos junto al destornillador: lo que se quita al abrir el PC
    add(box(0.7, 0.06, 0.5, mat(0x334155, { metal: 0.5, rough: 0.5 })), -1.6, 0.03, -2.2);
    [[-1.85, -2.32, 0.4], [-1.7, -2.2, 1.2], [-1.55, -2.35, 2.1], [-1.45, -2.15, 0.9], [-1.75, -2.05, 2.6]].forEach(([sx, sz, ry]) => {
      const screw = cyl(0.02, 0.02, 0.06, METAL_MAT, 8);
      screw.rotation.x = Math.PI / 2; screw.rotation.y = ry;
      add(screw, sx, 0.08, sz);
    });
    // silla de oficina frente al escritorio (mirando al monitor). Color claro para que
    // se distinga del suelo oscuro y respaldo alto que asoma por encima de la mesa
    const chair = new THREE.Group();
    const chairMat = mat(0x64748b, { metal: 0.1, rough: 0.9 });
    const chairSeat = box(1.1, 0.12, 1.0, chairMat);
    chairSeat.position.set(0, 1.3, 0); chair.add(chairSeat);
    const chairBack = box(1.0, 1.6, 0.1, chairMat);
    chairBack.position.set(0, 2.1, 0.55); chairBack.rotation.x = -0.15; chair.add(chairBack);
    const chairPole = cyl(0.06, 0.06, 1.2, METAL_MAT, 12);
    chairPole.position.set(0, 0.65, 0); chair.add(chairPole);
    const chairBase = cyl(0.55, 0.55, 0.06, METAL_MAT, 24);
    chairBase.position.set(0, 0.05, 0); chair.add(chairBase);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const caster = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), darkMetal);
      caster.position.set(0.5 * Math.cos(a), 0.08, 0.5 * Math.sin(a)); chair.add(caster);
    }
    chair.position.set(-2.9, -2.6, 4.8); env.add(chair);
    // pared derecha (espejo de la izquierda) y techo: antes el cuarto no tenía ni pared derecha ni techo
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(24, 12), wallMat2);
    rightWall.position.set(9.5, 3.4, 0); rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true; env.add(rightWall);
    add(box(0.06, 0.25, 24, wallMat), 9.47, -2.475, 0); // rodapié derecho
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(34, 24), wallMat);
    ceiling.position.set(0, 9, 0); ceiling.rotation.x = Math.PI / 2;
    env.add(ceiling);
    // cable de internet del router a la pared: antes el router solo conectaba al PC, no tenía internet
    const wanJack = box(0.3, 0.4, 0.06, mat(0xf1f5f9, { metal: 0.1, rough: 0.5 }));
    wanJack.position.set(6.5, -2.2, -4.97); wanJack.castShadow = true; env.add(wanJack);
    const wanSocket = box(0.12, 0.12, 0.03, darkMetal);
    wanSocket.position.set(6.5, -2.2, -4.93); env.add(wanSocket);
    const wanPort = box(0.12, 0.08, 0.02, darkMetal); // boca WAN en la trasera del router
    wanPort.position.set(6.3, 0.08, -3.11); env.add(wanPort);
    extCable([[6.3, 0.09, -3.11], [6.4, 0.09, -3.6], [6.45, 0.09, -3.75], [6.5, -0.6, -3.9], [6.5, -2.0, -4.3], [6.5, -2.2, -4.93]], 0.025, 0xeab308);
    // altavoces a ambos lados del monitor, girados hacia quien se sienta
    const makeSpeaker = (x, ry) => {
      const sp = new THREE.Group();
      const spBody = box(0.5, 0.9, 0.4, mat(0x111827, { metal: 0.3, rough: 0.6 }));
      spBody.position.set(0, 0.45, 0); sp.add(spBody);
      const woofer = cyl(0.16, 0.16, 0.03, mat(0x1f2937, { metal: 0.3, rough: 0.6 }), 20);
      woofer.rotation.x = Math.PI / 2; woofer.position.set(0, 0.35, 0.21); sp.add(woofer);
      const tweeter = cyl(0.06, 0.06, 0.03, mat(0x1f2937, { metal: 0.3, rough: 0.6 }), 16);
      tweeter.rotation.x = Math.PI / 2; tweeter.position.set(0, 0.7, 0.21); sp.add(tweeter);
      sp.position.set(x, 0, 1.0); sp.rotation.y = ry;
      env.add(sp);
    };
    makeSpeaker(-7.0, 0.3);
    makeSpeaker(-1.0, -0.3);
    // --- Cables de conexión: HDMI, energía, ethernet, regleta y router ---
    // Cada cable empieza y termina EN UN PUERTO de verdad (monitor o torre), no
    // flotando: la posición de los puertos del monitor se calcula (el grupo tiene
    // rotación) y la de la torre es su posición local + 3.5 en X
    function extCable(points, radius, color) {
      const curve = new THREE.CatmullRomCurve3(points.map((p) => Array.isArray(p) ? new THREE.Vector3(...p) : p.clone()));
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, radius, 8, false), mat(color, { metal: 0.2, rough: 0.7 }));
      mesh.castShadow = true; mesh.receiveShadow = true;
      env.add(mesh);
      return mesh;
    }
    peripherals.updateMatrixWorld(true);
    const hdmiPortW = new THREE.Vector3(); hdmiSocket.getWorldPosition(hdmiPortW);
    const pwrPortW = new THREE.Vector3(); pwrSocket.getWorldPosition(pwrPortW);
    // HDMI: del puerto del monitor al puerto HDMI de la tarjeta gráfica. La torre
    // está girada 90°, así que su parte trasera mira a la derecha y el puerto queda
    // en (5.57, 1.85, -0.55), a la vista: el cable bordea la mesa por detrás y
    // sube por el costado derecho hasta enchufarse. Los tramos sobre la mesa van a
    // y=0.08 con puntos intermedios que suavizan la bajada/subida: la curva
    // CatmullRom se hundía bajo la mesa justo en las transiciones y atravesaba
    // la madera (el cable solo toca la mesa, nunca la cruza)
    extCable([hdmiPortW, [-4.85, 1.0, 1.1], [-4.82, 0.55, 0.85], [-4.78, 0.2, 0.55], [-4.7, 0.08, 0.3], [-3.0, 0.08, -2.0], [-1.0, 0.08, -3.1], [2.0, 0.08, -3.1], [4.5, 0.08, -2.8], [5.6, 0.08, -1.5], [5.58, 0.2, -1.2], [5.57, 0.6, -0.85], [5.57, 1.1, -0.55], [5.57, 1.85, -0.55]], 0.035, 0x111827);
    // energía del monitor: del puerto del monitor a la regleta
    extCable([pwrPortW, [-4.42, 0.7, -0.25], [-4.41, 0.3, -0.1], [-4.4, 0.08, 0.0], [-2.0, 0.08, -1.5], [0.0, 0.08, -3.1], [2.5, 0.08, -3.15], [5.0, 0.09, -3.0]], 0.035, 0x111827);
    // energía de la torre: de la boca de la fuente (5.57, 0.6, 0.25) a la regleta,
    // bajando por el costado derecho, a la vista
    extCable([[5.57, 0.6, 0.25], [5.68, 0.35, 0.27], [5.73, 0.15, 0.29], [5.75, 0.09, 0.3], [5.75, 0.09, -1.5], [5.3, 0.09, -2.5], [5.0, 0.09, -3.0]], 0.04, 0x374151);
    // ethernet (azul): de la boca de la placa madre (5.57, 3.1, -0.94) a la boca
    // del router, bajando por el costado derecho, a la vista
    extCable([[5.57, 3.1, -0.94], [5.6, 1.6, -1.2], [5.6, 0.7, -1.45], [5.6, 0.3, -1.65], [5.6, 0.08, -1.8], [5.6, 0.08, -2.5], [5.69, 0.09, -2.7]], 0.03, 0x2563eb);
    // energía del router: de su toma trasera a la regleta
    extCable([[5.85, 0.09, -3.11], [5.3, 0.09, -3.0], [5.05, 0.09, -3.0]], 0.03, 0x111827);
    // cable de la regleta: baja por detrás del escritorio hasta el enchufe de la pared.
    // Sale por ENCIMA del borde trasero (a la altura de la mesa hasta pasar z=-3.5)
    // y luego cae por detrás: antes bajaba en diagonal y atravesaba la madera del borde.
    extCable([[5.0, 0.09, -3.1], [5.1, 0.09, -3.6], [5.15, 0.09, -3.75], [5.2, -0.6, -3.9], [5.1, -2.0, -4.3], [5.0, -2.55, -4.7], [5.0, -2.2, -4.95]], 0.04, 0x111827);
    // regleta (multitoma) sobre el escritorio, atrás a la derecha, junto a la torre
    add(box(1.2, 0.12, 0.35, mat(0xe5e7eb, { metal: 0.2, rough: 0.5 })), 5.0, 0.06, -3.0);
    [4.65, 5.0, 5.35].forEach((sx) => add(box(0.14, 0.02, 0.14, mat(0x111827, { metal: 0.3, rough: 0.5 })), sx, 0.13, -3.0));
    add(box(0.12, 0.03, 0.1, mat(0xdc2626, { metal: 0.3, rough: 0.5 })), 5.0, 0.13, -2.88);
    // router con sus antenas, luces y bocas (en x=6.15: antes en 6.0 su esquina
    // se metía 0.05 dentro de la regleta)
    add(box(0.9, 0.12, 0.6, mat(0x111827, { metal: 0.4, rough: 0.5 })), 6.15, 0.06, -2.8);
    const antMat = mat(0x1f2937, { metal: 0.5, rough: 0.4 });
    [[5.85, -2.55, 0.25], [6.45, -2.55, -0.25]].forEach(([ax, az, tilt]) => {
      const ant = cyl(0.02, 0.02, 0.55, antMat, 8);
      add(ant, ax, 0.35, az); ant.rotation.z = tilt;
    });
    [[5.9, 0x22c55e], [6.1, 0x22c55e], [6.3, 0x3b82f6]].forEach(([lx, c]) => {
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), new THREE.MeshBasicMaterial({ color: c }));
      led.position.set(lx, 0.13, -2.55); env.add(led);
    });
    // bocas ethernet del router (ahí entra el cable azul) y su toma de energía
    add(box(0.02, 0.08, 0.12, mat(0x1f2937, { metal: 0.3, rough: 0.6 })), 5.69, 0.08, -2.7);
    add(box(0.02, 0.08, 0.12, mat(0x1f2937, { metal: 0.3, rough: 0.6 })), 5.69, 0.08, -2.9);
    add(box(0.12, 0.08, 0.02, mat(0x1f2937, { metal: 0.3, rough: 0.6 })), 5.85, 0.08, -3.11);
    // enchufe en la pared trasera, junto al suelo, bajo la regleta
    add(box(0.5, 0.7, 0.06, mat(0xe5e7eb, { metal: 0.2, rough: 0.5 })), 5.0, -2.2, -4.97);
    add(box(0.12, 0.12, 0.03, mat(0x111827, { metal: 0.3, rough: 0.5 })), 4.88, -2.1, -4.93);
    add(box(0.12, 0.12, 0.03, mat(0x111827, { metal: 0.3, rough: 0.5 })), 5.12, -2.1, -4.93);
    // reloj de pared (las 10:10, como en los anuncios)
    const clockFace = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 32), mat(0xf8fafc, { metal: 0.2, rough: 0.4 }));
    clockFace.rotation.x = Math.PI / 2;
    add(clockFace, -5.5, 6.5, -4.96);
    const handMat = mat(0x111827, { metal: 0.3, rough: 0.5 });
    const hourHand = box(0.04, 0.28, 0.02, handMat);
    add(hourHand, -5.57, 6.62, -4.92); hourHand.rotation.z = 0.52;
    const minHand = box(0.03, 0.4, 0.02, handMat);
    add(minHand, -5.4, 6.67, -4.92); minHand.rotation.z = -0.52;
    const clockDot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), handMat);
    clockDot.position.set(-5.5, 6.5, -4.92); env.add(clockDot);
    return env;
  }
  // la torre va a la DERECHA de la mesa y el monitor a la IZQUIERDA: ambos se ven
  // a la vez y la torre ya no tapa el monitor. Girada 90° para que su lado abierto
  // (las piezas) mire al frente y su parte trasera (los puertos) mire a la derecha:
  // desde la cámara se ven AMBAS, así que cada cable se ve entrar en su puerto.
  // Subida 0.1 para que repose sobre sus patas (antes las patas se hundían 0.1
  // dentro del escritorio): los puertos y la luz interior suben lo mismo.
  // Las piezas, los cables internos y el panel frontal son hijos de la torre,
  // así que se mueven y giran con ella; los cables externos apuntan a los puertos
  // ya girados (sus posiciones de mundo están en buildEnvironment).
  tower.position.set(3.5, 0.1, 0);
  tower.rotation.y = -Math.PI / 2;
  const environment = buildEnvironment();

  return {
    tower, frontPanel, rgbStrip, powerLedMat, hddLedMat,
    partGroups, partMeshes, partMats, spinners, cables,
    ensureGhost, syncGhost, environment, powerButton, powerBtnRingMat, setScreen
  };
}
