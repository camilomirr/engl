// =========================================================
// NVISION PC WORKSHOP - Escena 3D del banco de trabajo
// Three.js r160 local (../js/vendor), modelos procedurales
// propios (sin assets externos). Camara orbital, puntos de
// montaje (snap) con marcadores, panel lateral que se abre,
// ventiladores y RGB al encender, calidad configurable con
// degradacion automatica si el FPS cae.
// =========================================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export const SNAP_POS = {
  case:    new THREE.Vector3(0, 0.0, 0),
  board:   new THREE.Vector3(0.86, 2.35, 0),
  cpu:     new THREE.Vector3(0.78, 3.15, -0.72),
  cooler:  new THREE.Vector3(0.30, 3.15, -0.72),
  ram:     new THREE.Vector3(0.45, 3.10, 0.12),
  gpu:     new THREE.Vector3(0.25, 1.95, -0.55),
  storage: new THREE.Vector3(0.74, 1.50, 0.75),
  psu:     new THREE.Vector3(0.00, 0.50, -1.25)
};

const MATS = () => ({
  metal: new THREE.MeshStandardMaterial({ color: 0x1b2436, roughness: 0.45, metalness: 0.75 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.6, metalness: 0.4 }),
  board: new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.55, metalness: 0.3 }),
  chip: new THREE.MeshStandardMaterial({ color: 0x9aa7bd, roughness: 0.3, metalness: 0.9 }),
  plastic: new THREE.MeshStandardMaterial({ color: 0x232c40, roughness: 0.5, metalness: 0.2 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.3, metalness: 0.9 }),
  glass: new THREE.MeshStandardMaterial({ color: 0xa5d8ff, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.14 }),
  fan: new THREE.MeshStandardMaterial({ color: 0x2b364e, roughness: 0.5, metalness: 0.3 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x27324a, roughness: 0.65, metalness: 0.2 })
});

export function createScene(wrap, hooks = {}) {
  let renderer;
  let rgbLight = null, rgbOn = false, rgbHue = 0, pasteMesh = null, cableGroup = null;
  const cableMeshes = {};
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  } catch (e) {
    if (hooks.onError) hooks.onError(e);
    return null;
  }
  const M = MATS();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  wrap.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0f1a);
  scene.fog = new THREE.Fog(0x0a0f1a, 18, 32);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(-7.6, 4.6, 8.2);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2.0, 0);
  controls.enableDamping = true;
  controls.minDistance = 3.5;
  controls.maxDistance = 16;
  controls.maxPolarAngle = 1.52;

  scene.add(new THREE.HemisphereLight(0xbcd7ff, 0x1a2436, 0.7));
  rgbLight = new THREE.PointLight(0xffffff, 0, 7);
  rgbLight.position.set(0.3, 2.1, 0.2);
  scene.add(rgbLight);
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
  keyLight.position.set(-6, 9, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  scene.add(keyLight);
  const rim = new THREE.PointLight(0x38bdf8, 16, 22);
  rim.position.set(5, 4, -6);
  scene.add(rim);
  const inner = new THREE.PointLight(0x38bdf8, 0, 7);
  inner.position.set(-1.6, 2.4, 0);
  scene.add(inner);

  // --- Banco de trabajo: piso, mesa y panel de herramientas ---
  const floor = new THREE.Mesh(new THREE.CircleGeometry(17, 48),
    new THREE.MeshStandardMaterial({ color: 0x0d1524, roughness: 0.95 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -0.93; floor.receiveShadow = true;
  scene.add(floor);
  const desk = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.35, 6.8), M.wood);
  desk.position.y = -0.75; desk.castShadow = true; desk.receiveShadow = true;
  scene.add(desk);
  const peg = new THREE.Mesh(new THREE.BoxGeometry(10.5, 4.6, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x131c2e, roughness: 0.9 }));
  peg.position.set(0, 1.4, -3.4); peg.receiveShadow = true;
  scene.add(peg);
  // siluetas de herramientas colgadas (destornillador, llave, pinzas)
  [[-3.4, 0xd4a017], [-2.5, 0x9aa7bd], [-1.6, 0x38bdf8], [2.2, 0x9aa7bd], [3.1, 0xef4444]].forEach(([x, c], i) => {
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.1 - (i % 3) * 0.18, 0.08),
      new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0.5 }));
    t.position.set(x, 2.1, -3.28);
    scene.add(t);
  });

  const rig = new THREE.Group();
  scene.add(rig);

  function box(w, h, d, mat, x = 0, y = 0, z = 0) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    return m;
  }
  function fanMesh(r) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.TorusGeometry(r, r * 0.14, 10, 28), M.fan));
    const blades = new THREE.Group();
    for (let i = 0; i < 7; i++) {
      const holder = new THREE.Group();
      holder.rotation.z = (i / 7) * Math.PI * 2;
      holder.add(box(r * 0.22, r * 0.85, 0.03, M.fan, 0, r * 0.42, 0));
      blades.add(holder);
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.3, r * 0.3, 0.09, 20), M.plastic);
    hub.rotation.x = Math.PI / 2;
    blades.add(hub);
    g.add(blades);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 1.03, 0.022, 8, 32),
      new THREE.MeshStandardMaterial({ color: 0x0b1220, emissive: 0x38bdf8, emissiveIntensity: 0 }));
    g.add(ring);
    g.userData.blades = blades;
    g.userData.ring = ring;
    return g;
  }

  // --- estado ---
  const placed = {};        // cat -> {item, group, spawn}
  let spinners = [];
  let rgbMats = [];
  let powered = false;
  let panelGroup = null, panelOpen = true, panelAngle = -1.85, panelTarget = -1.85;
  let focusGoal = null;

  function track(group) {
    group.traverse(o => { if (o.geometry) o.castShadow = true; });
    return group;
  }
  function register(cat, item, group, home) {
    group.position.copy(home).add(new THREE.Vector3(-2.2, 0.6, 0));
    group.traverse(o => { o.userData.cat = cat; });
    rig.add(group);
    placed[cat] = { item, group, home: home.clone(), spawn: 0 };
  }
  function unregister(cat) {
    const p = placed[cat];
    if (!p) return;
    rig.remove(p.group);
    delete placed[cat];
    spinners = spinners.filter(f => !isChildOf(f, p.group));
    rgbMats = rgbMats.filter(m => { let used = false; p.group.traverse(o => { if (o.material === m) used = true; }); return !used; });
  }
  function isChildOf(node, root) { let n = node; while (n) { if (n === root) return true; n = n.parent; } return false; }

  function buildCase(item) {
    const g = new THREE.Group();
    if (item.id === 'case-bench') {
      // banco de pruebas abierto: sin paredes ni panel
      g.add(box(2.4, 0.12, 4.6, M.metal, 0, 0.08, 0));
      [[-1.05, -2.15], [1.05, -2.15], [-1.05, 2.15], [1.05, 2.15]].forEach(([x, z]) => g.add(box(0.1, 0.5, 0.1, M.metal, x, 0.3, z)));
      panelGroup = null;
      register('case', item, g, new THREE.Vector3(0, 0, 0));
      placed['case'].spawn = 1;
      placed['case'].group.position.copy(SNAP_POS.case);
      return;
    }
    const W = 2.0, H = 4.3, D = 4.4, t = 0.08;
    g.add(box(W, t, D, M.metal, 0, 0.04, 0));
    g.add(box(W, t, D, M.metal, 0, H, 0));
    g.add(box(t, H, D, M.metal, W / 2 - t / 2, H / 2, 0));
    g.add(box(W, H, t, M.metal, 0, H / 2, -D / 2 + t / 2));
    g.add(box(W, H, t, M.metal, 0, H / 2, D / 2 - t / 2));
    for (let i = 0; i < 3; i++) {
      const f = fanMesh(0.42);
      f.position.set(0.1, 1.05 + i * 1.15, D / 2 - 0.16);
      g.add(f); spinners.push(f); rgbMats.push(f.userData.ring.material);
    }
    // panel de vidrio con bisagra trasera
    panelGroup = new THREE.Group();
    panelGroup.position.set(0, 0, -D / 2);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.04, H - 0.25, D - 0.25), M.glass);
    glass.position.set(-W / 2, H / 2, D / 2);
    panelGroup.add(glass);
    panelGroup.rotation.y = panelAngle;
    g.add(panelGroup);
    register('case', item, g, new THREE.Vector3(0, 0, 0));
    placed['case'].spawn = 1; // el gabinete no vuela: aparece en el banco
    placed['case'].group.position.copy(SNAP_POS.case);
  }

  function buildPart(cat, item) {
    const g = new THREE.Group();
    if (cat === 'board') {
      const size = item.specs.form === 'ATX' ? 3.5 : item.specs.form === 'mATX' ? 3.0 : 2.3;
      g.add(box(0.09, size, size, M.board));
      for (let i = 0; i < 5; i++) g.add(box(0.05, 0.28, 0.5, M.chip, -0.08, -size / 2 + 0.5 + i * 0.62, size / 2 - 0.45));
    }
    if (cat === 'cpu') {
      g.add(box(0.1, 0.52, 0.52, M.chip));
      g.add(box(0.04, 0.4, 0.4, M.gold, -0.07, 0, 0));
    }
    if (cat === 'cooler') {
      if (item.specs.type === 'liquid') {
        const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.3, 24), M.plastic);
        pump.rotation.z = Math.PI / 2; pump.castShadow = true;
        g.add(pump);
        g.add(box(0.22, 0.28, 2.4, M.dark, 0.55, 0.95, 0.5));
        for (let i = 0; i < 2; i++) {
          const f = fanMesh(0.36);
          f.rotation.y = -Math.PI / 2;
          f.position.set(0.38, 0.8, 0.05 + i * 0.85);
          g.add(f); spinners.push(f); rgbMats.push(f.userData.ring.material);
        }
      } else {
        const hgt = Math.max(0.45, Math.min(1.2, (item.specs.heightMm || 150) / 140));
        g.add(box(0.85, hgt, 1.0, M.chip));
        const f = fanMesh(0.42);
        f.rotation.y = -Math.PI / 2; f.position.set(-0.52, 0, 0);
        g.add(f); spinners.push(f);
      }
    }
    if (cat === 'ram') {
      const count = Math.max(1, Math.min(4, item.specs.modules || 1));
      for (let i = 0; i < count; i++) {
        g.add(box(0.5, 1.05, 0.1, M.plastic, 0, 0, i * 0.24));
        const topMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, emissive: 0x38bdf8, emissiveIntensity: 0 });
        g.add(box(0.5, 0.07, 0.1, topMat, 0, 0.56, i * 0.24));
        if (item.specs.rgb) rgbMats.push(topMat);
      }
    }
    if (cat === 'gpu') {
      const lenZ = Math.min(3.9, item.specs.lenMm / 100);
      const tier = item.price >= 1500 ? 0xd4a017 : item.price >= 700 ? 0x7c3aed : item.price >= 350 ? 0x2563eb : 0x475569;
      g.add(box(0.34 + (item.specs.slots || 2) * 0.14, 0.95, lenZ, new THREE.MeshStandardMaterial({ color: tier, roughness: 0.4, metalness: 0.55 })));
      for (let i = 0; i < 2; i++) {
        const f = fanMesh(0.34);
        f.rotation.y = -Math.PI / 2;
        f.position.set(-0.32, 0, -lenZ / 4 + i * (lenZ / 2));
        g.add(f); spinners.push(f);
      }
      const strip = new THREE.MeshStandardMaterial({ color: 0x0b1220, emissive: 0x38bdf8, emissiveIntensity: 0 });
      g.add(box(0.56, 0.08, lenZ * 0.9, strip, 0, 0.52, 0));
      rgbMats.push(strip);
      register(cat, item, g, SNAP_POS.gpu.clone().setZ(-1.65 + lenZ / 2));
      return;
    }
    if (cat === 'storage') {
      if (item.specs.mount === 'M.2') {
        g.add(box(0.06, 0.3, 1.05, M.dark));
        g.add(box(0.04, 0.2, 0.5, M.chip, -0.05, 0, -0.2));
      } else {
        g.add(box(0.7, 0.45, 1.15, item.specs.kind === 'HDD' ? M.chip : M.dark));
        register(cat, item, g, new THREE.Vector3(0.1, 0.78, 1.35));
        return;
      }
    }
    if (cat === 'psu') {
      g.add(box(1.5, 0.72, 1.5, M.dark));
      g.add(box(1.3, 0.4, 0.04, item.specs.cert.includes('Gold') || item.specs.cert.includes('Platinum') ? M.gold : M.chip, -0.4, 0, 0.76));
    }
    register(cat, item, g, SNAP_POS[cat].clone());
  }

  // --- marcadores de puntos de montaje ---
  const markers = {};
  Object.keys(SNAP_POS).forEach(cat => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(cat === 'case' ? 0.5 : 0.17, 18, 18),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.0 }));
    m.position.copy(SNAP_POS[cat]);
    if (cat === 'case') m.position.y = 0.25;
    m.userData.snapCat = cat;
    scene.add(m);
    markers[cat] = m;
  });
  let markerCat = null;
  function showMarkersFor(cat) {
    markerCat = cat;
    Object.values(markers).forEach(m => { m.material.opacity = 0; });
    if (cat && markers[cat]) markers[cat].material.opacity = 0.55;
  }

  // --- interaccion ---
  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  function castAt(ev, objects) {
    const rect = renderer.domElement.getBoundingClientRect();
    ptr.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    ptr.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    ray.setFromCamera(ptr, camera);
    return ray.intersectObjects(objects, true);
  }
  let downAt = null;
  renderer.domElement.addEventListener('pointerdown', ev => { downAt = [ev.clientX, ev.clientY]; });
  renderer.domElement.addEventListener('pointerup', ev => {
    if (!downAt) return;
    const moved = Math.hypot(ev.clientX - downAt[0], ev.clientY - downAt[1]);
    downAt = null;
    if (moved >= 6) return;
    if (markerCat) {
      const hits = castAt(ev, [markers[markerCat]]);
      if (hits.length && hooks.onSnap) { hooks.onSnap(markerCat); return; }
    }
    const hits = castAt(ev, [rig]);
    for (const h of hits) {
      if (h.object.userData.cat) { if (hooks.onPartClick) hooks.onPartClick(h.object.userData.cat); return; }
    }
  });
  renderer.domElement.addEventListener('dblclick', ev => {
    const hits = castAt(ev, [rig]);
    for (const h of hits) {
      if (h.object.userData.cat) {
        const p = placed[h.object.userData.cat];
        if (p) focusGoal = p.group.position.clone();
        return;
      }
    }
  });

  // --- calidad grafica ---
  let quality = 'medium';
  function setQuality(q) {
    quality = q;
    const pr = q === 'low' ? 1 : q === 'medium' ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pr);
    renderer.shadowMap.enabled = q !== 'low';
    keyLight.castShadow = q !== 'low';
    keyLight.shadow.mapSize.set(q === 'high' ? 2048 : 1024, q === 'high' ? 2048 : 1024);
    if (keyLight.shadow.map) { keyLight.shadow.map.dispose(); keyLight.shadow.map = null; }
    resize();
  }
  let fpsTime = 0, fpsFrames = 0, dropped = false;
  function autoQuality(dt) {
    if (dropped) return;
    fpsTime += dt; fpsFrames++;
    if (fpsTime >= 3) {
      const fps = fpsFrames / fpsTime;
      if (fps < 45 && quality !== 'low') {
        setQuality(quality === 'high' ? 'medium' : 'low');
        dropped = true;
        if (hooks.onQualityDrop) hooks.onQualityDrop(quality);
      }
      fpsTime = 0; fpsFrames = 0;
    }
  }

  function resize() {
    const w = wrap.clientWidth || 640, h = wrap.clientHeight || 460;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    autoQuality(dt);
    Object.values(placed).forEach(p => {
      if (p.spawn < 1) {
        p.spawn = Math.min(1, p.spawn + dt * 1.7);
        const e = 1 - Math.pow(1 - p.spawn, 3);
        p.group.position.copy(p.home).add(new THREE.Vector3(-2.2 * (1 - e), 0.6 * (1 - e), 0));
      }
    });
    if (panelGroup) {
      panelAngle += (panelTarget - panelAngle) * Math.min(1, dt * 4);
      panelGroup.rotation.y = panelAngle;
    }
    if (markerCat && markers[markerCat]) {
      markers[markerCat].material.opacity = 0.4 + Math.sin(t * 5) * 0.2;
      markers[markerCat].scale.setScalar(1 + Math.sin(t * 5) * 0.12);
    }
    if (powered) {
      spinners.forEach(f => { if (f.userData.blades) f.userData.blades.rotation.z -= dt * 13; });
      if (rgbLight) {
        if (powered && rgbOn) { rgbHue = (rgbHue + dt * 0.07) % 1; rgbLight.intensity = 26; rgbLight.color.setHSL(rgbHue, 0.85, 0.55); }
        else rgbLight.intensity = 0;
      }
      const hue = (t * 0.12) % 1;
      rgbMats.forEach(m => { m.emissive.setHSL(hue, 0.85, 0.55); m.emissiveIntensity = 1.5; });
      inner.intensity = 6; inner.color.setHSL(hue, 0.8, 0.6);
    } else {
      rgbMats.forEach(m => { m.emissiveIntensity = 0; });
      inner.intensity = 0;
    }
    if (focusGoal) {
      controls.target.lerp(focusGoal, Math.min(1, dt * 3));
      if (controls.target.distanceTo(focusGoal) < 0.05) focusGoal = null;
    }
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  return {
    place(cat, item) { if (cat === 'case') buildCase(item); else buildPart(cat, item); },
    remove(cat) { unregister(cat); if (cat === 'case') panelGroup = null; },
    isPlaced(cat) { return !!placed[cat]; },
    showMarkersFor,
    setPanel(open) { panelOpen = open; panelTarget = open ? -1.85 : 0; },
    isPanelOpen() { return panelGroup ? panelOpen : true; },
    setPowered(on) { powered = on; },
    setQuality,
    focus(cat) { const p = placed[cat]; if (p) focusGoal = p.group.position.clone(); },
    setRGBMode(on) { rgbOn = !!on; },
    setPaste(on) {
      if (!pasteMesh) {
        pasteMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.075, 0.075, 0.016, 20),
          new THREE.MeshStandardMaterial({ color: 0xe9e9e9, roughness: 0.55 })
        );
        pasteMesh.position.copy(SNAP_POS.cpu).add(new THREE.Vector3(0, 0.09, 0));
        pasteMesh.visible = false;
        scene.add(pasteMesh);
      }
      pasteMesh.visible = !!on;
    },
    setCable(id, on) {
      if (!cableGroup) { cableGroup = new THREE.Group(); scene.add(cableGroup); }
      if (cableMeshes[id]) { cableGroup.remove(cableMeshes[id]); cableMeshes[id].geometry.dispose(); delete cableMeshes[id]; }
      if (!on) return;
      const targets = {
        'atx': SNAP_POS.board.clone().add(new THREE.Vector3(-0.1, -0.3, 0.6)),
        'eps': SNAP_POS.board.clone().add(new THREE.Vector3(-0.2, 0.55, -0.3)),
        'pcie': SNAP_POS.gpu.clone().add(new THREE.Vector3(0.1, 0.1, 0)),
        'sata': SNAP_POS.storage.clone()
      };
      const colors = { 'atx': 0xf59e0b, 'eps': 0x38bdf8, 'pcie': 0xef4444, 'sata': 0xa78bfa };
      const to = targets[id]; if (!to) return;
      const from = SNAP_POS.psu.clone().add(new THREE.Vector3(0.15, 0.3, 0.35));
      const mid = from.clone().lerp(to, 0.5).add(new THREE.Vector3(0, 0.3, 0.4));
      const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([from, mid, to]), 20, 0.024, 6, false);
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: colors[id] || 0xcccccc, roughness: 0.6 }));
      cableGroup.add(mesh);
      cableMeshes[id] = mesh;
    }
  };
}
