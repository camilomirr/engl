// =========================================================
// NVISION — Visor 3D de la torre (Three.js)
// Reescrito desde cero: cámara, luces, postproceso,
// cinemáticas, etiquetas, explosión y el sistema de
// arrastre con imán. El modelo 3D vive en pc3d-model.js.
// Three.js corre desde los archivos del repo
// (js/vendor/three), sin CDN.
// =========================================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { PARTS, buildPcModel } from './pc3d-model.js?v=21';

const mount = document.getElementById('pc-viewer3d');
if (mount) init();

function init() {
  // --- Referencias del DOM ---
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
  const inspectCard = document.getElementById('pc-inspect-card');
  const inspectNameEl = document.getElementById('pc-inspect-name');
  const inspectFuncEl = document.getElementById('pc-inspect-func');
  const inspectTypesEl = document.getElementById('pc-inspect-types');
  const inspectReturnBtn = document.getElementById('pc-inspect-return');

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

  const partById = Object.fromEntries(PARTS.map((p) => [p.id, p]));

  // la torre está a la derecha de la mesa (x=3.5) y girada 90°: su lado abierto
  // mira al frente y su parte trasera (puertos) a la derecha. La vista general
  // centra el puesto entero (monitor a un lado, torre al otro, ambos visibles);
  // núcleo mira la CPU de frente (el lado abierto ya no mira a +X, mira a +Z)
  const SCENES = {
    overview: { cam: [11.0, 5.4, 6.6], tgt: [0, 2.1, 0.5], focus: null, particles: false, fanBoost: 1, dur: 1.8 }, // un poco más lejos que antes (9.0, 4.5, 5.4): se ve el puesto entero sin alejarse demasiado
    core: { cam: [3.4, 4.3, 5.5], tgt: [3.4, 3.2, -0.55], focus: ['cpu', 'ram'], particles: false, fanBoost: 1 },
    airflow: { cam: [9.9, 5.5, 5.5], tgt: [3.5, 2.1, 0], focus: ['psu', 'gpu'], particles: true, fanBoost: 2.4 }
  };

  // --- Renderizador ---
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
  renderer.toneMappingExposure = 1.3; // un poco más de luz general: había zonas oscuras en el taller

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0d1b2b, 30, 60);
  scene.background = new THREE.Color(0x0d1b2b); // ya no hay vacío negro: el fondo es el mismo azul del taller
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(-9, 9, 5.2); // punto de partida de la intro cinematográfica: dentro del cuarto (antes estaba fuera, en 15, 8.5, 17)

  // Entorno de estudio: reflejos realistas en metales y vidrios
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  // --- Controles: izquierdo agarra/gira · derecho mueve la vista · rueda zoom suave ---
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(...SCENES.overview.tgt);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 5.0;
  controls.maxDistance = 16;
  controls.maxPolarAngle = Math.PI * 0.55;
  controls.zoomSpeed = 0.35; // solo para el pellizco táctil; la rueda tiene su propio zoom
  controls.rotateSpeed = 0.85;
  controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
  controls.enablePan = true;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 0.9;

  // --- Habitación cerrada: la cámara no puede salir del cuarto ---
  // El taller mide x -36..36, z -20..20, piso en y=-2.6 y techo en y=12: la
  // cámara y el punto al que mira se quedan dentro, con 0.3 de margen para
  // que el plano cercano no se meta en la pared. La pared frontal quedó a
  // z=20, lejos de la cámara predeterminada (-9, 9, 5.2), que NO se movió:
  // ahora hay sitio de sobra para girar, alejar y mover la vista. Sin esto,
  // el paneo con clic derecho se iba debajo del piso, afuera de la casa y
  // a través de las paredes. La caja es convexa, así que los vuelos de
  // cámara entre dos puntos de dentro (intro, cinemáticas, doble clic)
  // tampoco salen.
  const ROOM_CAM = { x: [-35.7, 35.7], y: [-2.3, 11.7], z: [-19.7, 19.7] };
  const ROOM_TGT = { x: [-33, 33], y: [-1.5, 10], z: [-18, 18] };
  const clampVec = (v, b) => {
    v.x = THREE.MathUtils.clamp(v.x, b.x[0], b.x[1]);
    v.y = THREE.MathUtils.clamp(v.y, b.y[0], b.y[1]);
    v.z = THREE.MathUtils.clamp(v.z, b.z[0], b.z[1]);
    return v;
  };
  const clampRoom = () => { clampVec(controls.target, ROOM_TGT); clampVec(camera.position, ROOM_CAM); };

  // --- Postproceso: bloom suave para que brillen los LED y el RGB ---
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.15, 0.4, 1.0); // brillo bajo: el resplandor fuerte se veía feo (soleado sí, resplandor no)
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // --- Luces ---
  // El taller mide 72x40 y la luz principal viene de un solo lado (6,9,7):
  // el techo (cara inferior), la pared frontal y la pared derecha no reciben
  // nada de esa luz direccional, y las puntuales no llegan a las esquinas
  // lejanas por su distancia de corte y la caída con el cuadrado de la
  // distancia. Por eso quedaban zonas oscuras en las esquinas aunque se
  // subiera la luz general. Arreglo: base ambiente más blanca y fuerte,
  // luz de hemisferio (ilumina TODAS las orientaciones, incluido el techo),
  // una direccional de rebote sin sombras desde el lado opuesto para las
  // paredes que la principal no toca, y dos puntuales en las esquinas
  // frontales, que eran las que quedaban fuera del alcance de las demás.
  // También se ensancha la caja de sombras para cubrir todo el cuarto.
  scene.add(new THREE.AmbientLight(0xffffff, 1.1));
  scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x9a8a70, 0.75));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(6, 9, 7);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.left = -40; keyLight.shadow.camera.right = 40;
  keyLight.shadow.camera.top = 30; keyLight.shadow.camera.bottom = -30;
  scene.add(keyLight);
  const bounceLight = new THREE.DirectionalLight(0xfff2dd, 1.0);
  bounceLight.position.set(-8, 8, -9); // rebote desde el lado opuesto: ilumina pared frontal, pared derecha y esquinas traseras sin sombras
  scene.add(bounceLight);
  const innerGlow = new THREE.PointLight(0x22d3ee, 18, 10, 2);
  innerGlow.position.set(3.9, 3.1, 0.8); // dentro de la torre (la torre está en x=3.5, y=0.1)
  scene.add(innerGlow);
  const fillLight = new THREE.PointLight(0xf59e0b, 6, 12, 2);
  fillLight.position.set(-4, 2, -5);
  scene.add(fillLight);
  const benchLight = new THREE.PointLight(0xffe7b3, 60, 24, 2);
  benchLight.position.set(33, 6.5, -6); // bajo la lámpara colgante del banco de trabajo (antes esa lámpara no alumbraba)
  scene.add(benchLight);
  const westLight = new THREE.PointLight(0xffffff, 50, 28, 2);
  westLight.position.set(-24, 7, 2); // lado izquierdo del taller, lejos del escritorio
  scene.add(westLight);
  const frontLeftLight = new THREE.PointLight(0xffffff, 45, 32, 2);
  frontLeftLight.position.set(-30, 8, 16); // esquina frontal izquierda: fuera del alcance de westLight y benchLight
  scene.add(frontLeftLight);
  const frontRightLight = new THREE.PointLight(0xffffff, 45, 32, 2);
  frontRightLight.position.set(30, 8, 16); // esquina frontal derecha: fuera del alcance de westLight y benchLight
  scene.add(frontRightLight);

  // (anillos luminosos y disco de brillo sobre el escritorio ELIMINADOS a pedido
  // de Camilo: eran cosas transparentes sobre el tablero y el escritorio es todo madera)

  // --- Modelo 3D (torre, piezas, cables, LED) ---
  const model = buildPcModel();
  const { tower, frontPanel, rgbStrip, powerLedMat, hddLedMat, environment, powerButton, powerBtnRingMat, setScreen, inspectSpot, inspectRingMat } = model;
  const { partGroups, partMeshes, partMats, spinners, cables } = model;
  scene.add(tower);
  scene.add(environment); // el taller: escritorio, cuarto, monitor y cosas

  // --- Partículas de flujo de aire (cinemática 03) ---
  const P_COUNT = 140;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(P_COUNT * 3);
  const pData = [];
  for (let i = 0; i < P_COUNT; i++) {
    pData.push({
      x: -0.7 + Math.random() * 1.4, // local a la torre: las partículas son hijas de la torre y giran con ella
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
  tower.add(particles); // hijas de la torre: el flujo va de adelante hacia atrás aunque la torre gire

  // --- Guía de recorrido: línea punteada hasta el sitio de la pieza ---
  const MAGNET_RADIUS = 2.0; // radio en el que el imán empieza a atraerla hacia su sitio
  const RELEASE_SNAP_DIST = 1.2; // al soltarla dentro de este radio, encaja sola
  const guideGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const guideMat = new THREE.LineDashedMaterial({ color: 0xef4444, dashSize: 0.32, gapSize: 0.14, transparent: true, opacity: 1 });
  const guideLine = new THREE.Line(guideGeo, guideMat);
  guideLine.visible = false;
  guideLine.frustumCulled = false;
  scene.add(guideLine);
  // Pulso que viaja por la guía: hace visible el recorrido hasta el sitio.
  // Grande y con halo para que se vea sin duda en foto: antes era una bolita de
  // 0.07 y la línea punteada fina se perdía en las capturas
  const guidePulse = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xef4444 })
  );
  const guidePulseHalo = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.25 })
  );
  guidePulse.add(guidePulseHalo);
  guidePulse.visible = false;
  scene.add(guidePulse);
  const pulseV = new THREE.Vector3();
  const guideHomeV = new THREE.Vector3(); // el sitio en MUNDO, para el pulso (la base es local a la torre)
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
  let dragId = null; // pieza que se está arrastrando
  let dragCandidate = null; // pieza bajo el cursor al presionar (posible arrastre)
  let inspectedPart = null; // pieza que está sobre la mesa de inspección
  const clock = new THREE.Clock();

  // --- Ayudas de resaltado y panel ---
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
  // --- Encendido: el PC solo arranca con las 8 piezas instaladas ---
  let powered = false; // el equipo arranca apagado
  let powerSpin = 0; // 0 = ventiladores parados, 1 = a tope (sube poco a poco al encender)
  let twitchUntil = 0; // un intento fallido hace girar los ventiladores un instante
  let failBlinkUntil = 0; // parpadeo rojo del LED tras un intento fallido
  let bootTimer = null;
  let powerPress = false; // se presionó el botón físico 3D (posible clic, no arrastre)
  const powerBtn = document.getElementById('pc-power');
  const powerBtnLabel = powerBtn ? powerBtn.querySelector('span:last-child') : null;
  function missingParts() { return PARTS.filter((p) => partGroups[p.id].userData.removed); }
  function setPowerButtonUI() {
    if (!powerBtn) return;
    powerBtn.classList.toggle('is-active', powered);
    powerBtn.setAttribute('aria-pressed', String(powered));
    if (powerBtnLabel) {
      powerBtnLabel.textContent = t(powered ? 'pc3d_power_off' : 'pc3d_power_on');
      powerBtnLabel.dataset.i18n = powered ? 'pc3d_power_off' : 'pc3d_power_on';
    }
    // el anillo 3D lo lleva el bucle de animación (verde al encender, rojo si falla el arranque)
  }
  function failBoot(missing) {
    failBlinkUntil = clock.elapsedTime + 3;
    twitchUntil = clock.elapsedTime + 0.5;
    if (setScreen) setScreen('error', missing.map((p) => t(p.key)).join(', '));
    if (titleEl) { titleEl.textContent = t('pc3d_power_fail_title'); titleEl.dataset.i18n = 'pc3d_power_fail_title'; }
    if (descEl) descEl.textContent = t('pc3d_power_fail_desc').replace('{parts}', missing.map((p) => t(p.key)).join(', '));
  }
  // Si sacan una pieza con el PC encendido, se apaga de golpe (como un equipo real)
  function checkPowerAfterRemoval() {
    if (!powered) return;
    const missing = missingParts();
    if (!missing.length) return;
    powered = false;
    if (bootTimer) { clearInterval(bootTimer); bootTimer = null; }
    if (setScreen) setScreen('off');
    setPowerButtonUI();
    if (titleEl) { titleEl.textContent = t('pc3d_power_fail_title'); titleEl.dataset.i18n = 'pc3d_power_fail_title'; }
    if (descEl) descEl.textContent = t('pc3d_power_crash_desc').replace('{parts}', missing.map((p) => t(p.key)).join(', '));
  }
  function togglePower() {
    if (powered) { // apagar
      powered = false;
      if (bootTimer) { clearInterval(bootTimer); bootTimer = null; }
      if (setScreen) setScreen('off');
      setPowerButtonUI();
      if (titleEl) { titleEl.textContent = t('pc3d_power_off_title'); titleEl.dataset.i18n = 'pc3d_power_off_title'; }
      if (descEl) { descEl.textContent = t('pc3d_power_off_desc'); descEl.dataset.i18n = 'pc3d_power_off_desc'; }
      return;
    }
    const missing = missingParts();
    if (missing.length) { failBoot(missing); return; }
    // arrancar: logo y puntos de carga, luego el escritorio de Windows
    if (setScreen) setScreen('boot', 0);
    let tick = 0;
    if (bootTimer) clearInterval(bootTimer);
    bootTimer = setInterval(() => {
      tick++;
      if (setScreen) setScreen('boot', tick);
      if (tick >= 14) {
        clearInterval(bootTimer); bootTimer = null;
        powered = true;
        if (setScreen) setScreen('windows');
        setPowerButtonUI();
        if (titleEl) { titleEl.textContent = t('pc3d_power_on_title'); titleEl.dataset.i18n = 'pc3d_power_on_title'; }
        if (descEl) { descEl.textContent = t('pc3d_power_on_desc'); descEl.dataset.i18n = 'pc3d_power_on_desc'; }
      }
    }, 180);
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
      updateStatus(); // el estado (INSTALADA/RETIRADA) siempre refleja la pieza que se selecciona
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

  // --- Guía, arrastre e imán ---
  function updateGuide() {
    if (!dragId) return;
    const g = partGroups[dragId];
    // el sitio en COORDENADAS DE MUNDO: la línea y el marcador viven en la escena,
    // y la base es local a la torre (que está en x=3.5 y girada): sin convertirla,
    // la distancia salía siempre mayor que 3.5 y la guía nunca se ponía verde
    const home = tower.localToWorld(g.userData.base.clone());
    guideHomeV.copy(home); // el pulso viaja hasta aquí: en MUNDO, como la línea y el marcador
    g.getWorldPosition(guideV);
    const pos = guideGeo.attributes.position;
    pos.setXYZ(0, guideV.x, guideV.y, guideV.z);
    pos.setXYZ(1, home.x, home.y, home.z);
    pos.needsUpdate = true;
    guideLine.computeLineDistances();
    const d = guideV.distanceTo(home);
    // el color es solo distancia: verde = si la sueltas aquí se pega, ámbar = el imán te ayuda
    // (antes dependía de magnetArmed y un solo movimiento lateral lo apagaba, así que el verde casi nunca se veía)
    const inSnap = d < RELEASE_SNAP_DIST;
    const inMagnet = d < MAGNET_RADIUS;
    guideMat.color.setHex(inSnap ? 0x22c55e : inMagnet ? 0xf59e0b : 0xef4444);
    homeMarker.material.color.setHex(inSnap ? 0x22c55e : inMagnet ? 0xf59e0b : 0xef4444);
    if (g.userData.ghostMat) g.userData.ghostMat.color.setHex(inSnap ? 0x22c55e : inMagnet ? 0xf59e0b : 0x38bdf8);
    homeMarker.position.copy(home);
    homeMarker.lookAt(camera.position);
  }
  function startDrag(id) {
    const g = partGroups[id];
    if (g.userData.inspecting) {
      // agarrar la pieza desde la mesa de inspección: se cancela la inspección
      // y la pieza queda libre en la mano, como cualquier pieza retirada
      g.userData.inspecting = false;
      if (inspectedPart === id) inspectedPart = null;
      hideInspectCard();
    }
    dragId = id;
    dragCandidate = null;
    g.userData.dragging = true;
    g.userData.magnetArmed = g.userData.removed; // el imán solo se arma si la pieza ya estaba suelta
    selectPart(id); // el panel sigue a la pieza que se agarra
    if (!g.userData.removed) {
      g.userData.removed = true; // al agarrarla se suelta de su sitio
      g.userData.freePos = null;
      model.syncGhost(id);
      updateStatus();
      updateAllButton();
      applyDim();
      checkPowerAfterRemoval(); // si el PC estaba encendido, se apaga de golpe
    }
    const p = new THREE.Vector3();
    g.getWorldPosition(p);
    const n = new THREE.Vector3();
    camera.getWorldDirection(n);
    // El plano de arrastre pasa POR LA ZONA ROJA (su sitio), no por la pieza:
    // así la pieza sí puede llegar hasta su sitio con el cursor
    const homeWorld = tower.localToWorld(g.userData.base.clone());
    dragPlane.setFromNormalAndCoplanarPoint(n, homeWorld);
    // Agarre sin salto: guardar el desplazamiento entre el centro y el punto del cursor
    if (pointerClient) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((pointerClient.x - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((pointerClient.y - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(dragPlane, hit)) {
        const off = p.clone().sub(hit);
        off.addScaledVector(n, -off.dot(n)); // solo la parte dentro del plano
        g.userData.grabOffset = off;
      } else {
        g.userData.grabOffset = new THREE.Vector3();
      }
    }
    g.userData.lastDragD = p.distanceTo(homeWorld);
    guideLine.visible = true;
    homeMarker.visible = true;
    model.ensureGhost(id);
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
    model.syncGhost(id);
    updateStatus();
    updateAllButton();
    applyDim();
    // los controles se reactivan en el pointerup, no aquí
  }
  function setAllRemoved(remove) {
    if (inspectedPart) cancelInspectToHover(inspectedPart); // la pieza de la mesa se suma al desarme
    PARTS.forEach((p, i) => {
      setTimeout(() => {
        const g = partGroups[p.id];
        g.userData.removed = remove;
        if (!remove) g.userData.freePos = null;
        model.syncGhost(p.id);
        if (selectedPart === p.id) updateStatus();
        updateAllButton();
        applyDim();
        checkPowerAfterRemoval(); // si el PC estaba encendido, se apaga de golpe
      }, i * 90);
    });
  }

  // --- Mesa de inspección: doble clic en una pieza y vuela hasta la mesa
  // aparte, donde se queda girando despacio como en una vitrina, con su
  // nombre, su función y sus tipos en la tarjeta. La pieza es hija de la
  // torre, así que su destino se calcula en MUNDO y se pasa a local de la
  // torre; el vuelo es un arco con una vuelta entera y llegada suave.
  function showInspectCard(part) {
    if (!inspectCard) return;
    if (inspectNameEl) {
      inspectNameEl.textContent = t(part.key);
      inspectNameEl.dataset.i18n = part.key;
    }
    if (inspectFuncEl) {
      inspectFuncEl.textContent = t(part.funcKey);
      inspectFuncEl.dataset.i18n = part.funcKey;
    }
    if (inspectTypesEl) {
      inspectTypesEl.innerHTML = '';
      t(part.typesKey).split('·').map((s) => s.trim()).filter(Boolean).forEach((chip) => {
        const el = document.createElement('span');
        el.className = 'pc-inspect-chip';
        el.textContent = chip;
        inspectTypesEl.appendChild(el);
      });
    }
    inspectCard.hidden = false;
  }
  function hideInspectCard() { if (inspectCard) inspectCard.hidden = true; }
  // Vuelo de una pieza de un punto a otro (local a la torre): arco con giro.
  // mode 'rest' = al llegar se queda girando sobre la mesa; 'snap' = al
  // llegar se encaja en su sitio; 'release' = al llegar vuelve al control
  // normal (posición desarmada).
  function flyPartTo(id, toLocal, mode, dur = 1.4) {
    const g = partGroups[id];
    const ud = g.userData;
    ud.inspecting = true;
    ud.inspectMode = mode;
    ud.inspectDur = dur;
    ud.inspectK = 0;
    ud.inspectFrom = g.position.clone();
    ud.inspectTo = toLocal.clone();
    ud.inspectFromRot = g.rotation.y;
    ud.inspectPeak = Math.max(ud.inspectFrom.y, ud.inspectTo.y) + 2.0;
  }
  function startInspect(id) {
    if (inspectedPart && inspectedPart !== id) cancelInspectToHover(inspectedPart);
    const g = partGroups[id];
    const ud = g.userData;
    if (ud.dragging) return;
    dragCandidate = null;
    selectPart(id); // el panel lateral también sigue a la pieza inspeccionada
    if (!ud.removed) {
      ud.removed = true; // al sacarla de su sitio queda retirada (sale el fantasma)
      model.syncGhost(id);
      updateStatus();
      updateAllButton();
      applyDim();
      checkPowerAfterRemoval(); // si el PC estaba encendido, se apaga de golpe
    }
    ud.freePos = null;
    // la pieza descansa sobre la alfombrilla: su punto más bajo toca la mesa
    tower.updateWorldMatrix(true, true);
    const bb = new THREE.Box3().setFromObject(g);
    const wp = new THREE.Vector3();
    g.getWorldPosition(wp);
    const restY = inspectSpot.y + (wp.y - bb.min.y) + 0.02;
    const toLocal = tower.worldToLocal(new THREE.Vector3(inspectSpot.x, restY, inspectSpot.z));
    flyPartTo(id, toLocal, 'rest', 1.5);
    inspectedPart = id;
    flyTo([inspectSpot.x, 1.8, inspectSpot.z + 5.6], [inspectSpot.x, -0.4, inspectSpot.z], 1.4);
    controls.autoRotate = false;
    lastInteract = clock.elapsedTime;
    showInspectCard(partById[id]);
  }
  function returnInspect(id) {
    const g = partGroups[id];
    if (!g || !g.userData.inspecting) return;
    inspectedPart = null;
    hideInspectCard();
    flyPartTo(id, g.userData.base.clone(), 'snap', 1.2);
    flyTo(SCENES.overview.cam, SCENES.overview.tgt, 1.4); // la cámara vuelve a la vista general
  }
  function cancelInspectToHover(id) {
    // la pieza deja la mesa y vuela a su sitio desarmado (flotando, sin encajar)
    const g = partGroups[id];
    if (!g || !g.userData.inspecting) return;
    if (inspectedPart === id) inspectedPart = null;
    hideInspectCard();
    const ud = g.userData;
    const hover = ud.base.clone().addScaledVector(ud.dir, explodeTarget * 1.6 + 2.1);
    flyPartTo(id, hover, 'release', 1.1);
  }

  // --- Cámara y cinemáticas ---
  function flyTo(pos, tgt, dur = 1.0) {
    camTween = {
      // el destino se recorta al cuarto: el vuelo nunca sale de la habitación
      p0: camera.position.clone(), p1: clampVec(new THREE.Vector3(...pos), ROOM_CAM),
      t0: controls.target.clone(), t1: clampVec(new THREE.Vector3(...tgt), ROOM_TGT), k: 0, dur
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
  // Reglas del modelo (aprendidas a pulso):
  // · Izquierdo sobre pieza = agarrarla y arrastrarla; clic solo la selecciona.
  // · Izquierdo en vacío = girar la cámara · Derecho = mover la vista (pan).
  // · El menú del navegador nunca aparece sobre el visor.
  // · La órbita SIEMPRE vuelve a quedar activa al soltar o al presionar:
  //   si se apaga y no se vuelve a encender, la vista se congela y el
  //   clic derecho muestra el menú del navegador en vez de mover la vista.
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pointerClient = null;
  let downPos = null;

  function pickPart(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(partMeshes, false);
    return hits.length ? hits[0].object.userData.partId : null;
  }
  // ¿El cursor está sobre el botón de encendido físico del frontal?
  function pickPowerButton(event) {
    if (!powerButton) return false;
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObject(powerButton, true).length > 0;
  }
  canvas.addEventListener('pointermove', (event) => {
    pointerClient = { x: event.clientX, y: event.clientY };
    lastInteract = clock.elapsedTime; // mover el ratón es actividad: la cámara no gira sola mientras apuntas
    // Si se presionó sobre una pieza y el cursor se mueve, empieza el arrastre
    if (dragCandidate && !dragId && downPos) {
      if (Math.hypot(event.clientX - downPos.x, event.clientY - downPos.y) > 8) startDrag(dragCandidate);
    }
    // Si se presionó el botón de encendido y el cursor se mueve, fue un arrastre: se cancela la pulsación
    if (powerPress && downPos && Math.hypot(event.clientX - downPos.x, event.clientY - downPos.y) > 8) {
      powerPress = false;
      controls.enabled = true;
    }
    if (dragId) {
      // Arrastrar la pieza sobre el plano de su sitio, con imán al acercarla
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      if (raycaster.ray.intersectPlane(dragPlane, dragHit)) {
        const g = partGroups[dragId];
        const home = g.userData.base;
        const raw = tower.worldToLocal(dragHit.clone().add(g.userData.grabOffset));
        const d = raw.distanceTo(home);
        // el imán solo ayuda cuando la acercas a su sitio, nunca cuando la alejas
        const approaching = d < g.userData.lastDragD;
        g.userData.lastDragD = d;
        if (approaching && d < MAGNET_RADIUS) g.userData.magnetArmed = true;
        if (!approaching) g.userData.magnetArmed = false;
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
      // la pieza NO se pega sola al acercarla: solo se encaja al soltar el clic
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
    if (!id && pickPowerButton(event)) canvas.style.cursor = 'pointer'; // sobre el botón de encendido
    if (tooltip) {
      if (id && !labelsVisible) {
        // el nombre flotante solo aparece cuando las etiquetas están apagadas:
        // con las etiquetas puestas se veía el nombre dos veces (rótulo + flotante)
        const rect = shell.getBoundingClientRect();
        tooltip.hidden = false;
        tooltip.textContent = labelTextFor(partById[id]);
        tooltip.style.left = `${event.clientX - rect.left + 14}px`;
        tooltip.style.top = `${event.clientY - rect.top + 14}px`;
      } else if (pickPowerButton(event)) {
        const rect = shell.getBoundingClientRect();
        tooltip.hidden = false;
        tooltip.textContent = t(powered ? 'pc3d_power_off' : 'pc3d_power_on');
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
    // Botón de encendido físico en el frontal: se pulsa, no se arrastra
    if (pickPowerButton(event)) {
      powerPress = true;
      controls.enabled = false; // no rotar mientras se pulsa el botón
      return;
    }
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
    lastInteract = clock.elapsedTime; // el conteo de 6 s para girar sola arranca desde que sueltas
    if (event.button !== 0) { downPos = null; return; } // solo el botón izquierdo termina arrastres o clics
    if (powerPress) {
      // fue una pulsación del botón de encendido físico (sin arrastre)
      powerPress = false;
      const wasPress = downPos && Math.hypot(event.clientX - downPos.x, event.clientY - downPos.y) <= 8;
      downPos = null;
      if (wasPress) togglePower();
      return;
    }
    if (dragId) {
      // Soltar la pieza: si quedó cerca de su sitio, encaja sola; si no, queda flotando
      // (la posición de la pieza es de mundo y la base es local a la torre: hay que
      // convertir la base a mundo, si no la distancia siempre es mayor que 3.5 y
      // la pieza nunca encaja)
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
      if (p.distanceTo(tower.localToWorld(g.userData.base.clone())) < RELEASE_SNAP_DIST) snapIn(id);
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
    if (dragId) return; // en mitad de un arrastre no se inspecciona nada
    const id = pickPart(event);
    if (!id) return;
    // doble clic en la pieza que ya está en la mesa = devolverla a su sitio
    if (inspectedPart === id) { returnInspect(id); return; }
    startInspect(id);
    guideLine.visible = false;
    homeMarker.visible = false;
    controls.enabled = true;
    controls.autoRotate = false;
    lastInteract = clock.elapsedTime;
  });
  // Escape devuelve la pieza de la mesa a su sitio
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && inspectedPart) returnInspect(inspectedPart);
  });
  if (inspectReturnBtn) inspectReturnBtn.addEventListener('click', () => { if (inspectedPart) returnInspect(inspectedPart); });
  // --- Zoom de rueda propio: proporcional a cuánto se gira y con suavizado ---
  // El zoom de OrbitControls da un paso fijo por CADA evento de rueda, sin mirar
  // cuánto se giró: una rueda que dispara muchos eventos (o un trackpad) salta de
  // muy lejos a muy cerca sin punto medio. Aquí el cambio es proporcional a deltaY
  // (un giro corto acerca poco, un giro largo acerca más) y la cámara se acerca a
  // la distancia objetivo poco a poco. Se escucha en el contenedor, en fase de
  // captura, y se frena el evento para que OrbitControls no aplique su zoom encima.
  const ZOOM_MIN = 5.0;
  const ZOOM_MAX = 28; // el taller es el doble de grande: hay que poder alejarse más para verlo entero
  let targetRadius = new THREE.Vector3(...SCENES.overview.cam)
    .distanceTo(new THREE.Vector3(...SCENES.overview.tgt));
  let lastWheelAt = -10;
  mount.addEventListener('wheel', (event) => {
    event.preventDefault();
    event.stopPropagation();
    let dy = event.deltaY;
    if (event.deltaMode === 1) dy *= 33; // Firefox: líneas a píxeles
    else if (event.deltaMode === 2) dy *= 500; // páginas a píxeles
    targetRadius = THREE.MathUtils.clamp(targetRadius * Math.exp(dy * 0.0009), ZOOM_MIN, ZOOM_MAX);
    controls.autoRotate = false;
    lastInteract = clock.elapsedTime;
    lastWheelAt = clock.elapsedTime;
  }, { passive: false, capture: true });

  // --- Botones del panel ---
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
      if (inspectedPart) {
        // la pieza de la mesa vuelve a su sitio volando y se encaja sola
        const id = inspectedPart;
        inspectedPart = null;
        hideInspectCard();
        flyPartTo(id, partGroups[id].userData.base.clone(), 'snap', 1.2);
      }
      PARTS.forEach((p) => {
        partGroups[p.id].userData.removed = false;
        partGroups[p.id].userData.freePos = null;
        model.syncGhost(p.id);
      });
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
  // --- Botón de encendido (panel) y pantalla completa ---
  if (powerBtn) powerBtn.addEventListener('click', () => togglePower());
  const fsBtn = document.getElementById('pc-fullscreen');
  const fsBtnLabel = fsBtn ? fsBtn.querySelector('span:last-child') : null;
  const explorerLayout = document.querySelector('.pc-explorer-layout');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (explorerLayout && explorerLayout.requestFullscreen) explorerLayout.requestFullscreen();
    });
    document.addEventListener('fullscreenchange', () => {
      const on = !!document.fullscreenElement;
      fsBtn.classList.toggle('is-active', on);
      if (fsBtnLabel) {
        fsBtnLabel.textContent = t(on ? 'pc3d_exit_fullscreen' : 'pc3d_fullscreen');
        fsBtnLabel.dataset.i18n = on ? 'pc3d_exit_fullscreen' : 'pc3d_fullscreen';
      }
    });
  }

  // --- Etiquetas flotantes por pieza ---
  const labelsWrap = document.getElementById('pc-labels');
  const labelsToggle = document.getElementById('pc-labels-toggle');
  const labelV = new THREE.Vector3();
  const labelOffV = new THREE.Vector3();
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
  // --- Etiquetas con hardware real (puente local, js/pc-hardware.js) ---
  // Solo cambia el TEXTO de las etiquetas flotantes y del rótulo al
  // pasar el cursor. El modelo 3D, las posiciones y la animación
  // quedan intactos. Mientras una etiqueta muestra un dato real se
  // le quita data-i18n para que el cambio de idioma no la pise;
  // al volver a las etiquetas normales se restaura todo.
  let realLabels = null;
  function labelTextFor(p) {
    if (realLabels && realLabels[p.id]) return realLabels[p.id];
    return t(p.key);
  }
  function applyRealLabels(map) {
    realLabels = map && Object.keys(map).length ? map : null;
    PARTS.forEach((p) => {
      const el = labelEls[p.id];
      if (!el) return;
      if (realLabels && realLabels[p.id]) {
        el.textContent = realLabels[p.id];
        el.title = realLabels[p.id];
        el.classList.add('is-real');
        el.removeAttribute('data-i18n');
      } else {
        el.textContent = t(p.key);
        el.removeAttribute('title');
        el.classList.remove('is-real');
        el.dataset.i18n = p.key;
      }
    });
  }
  window.addEventListener('nvision:hardware-labels', (ev) => {
    applyRealLabels(ev.detail && ev.detail.labels ? ev.detail.labels : null);
  });
  if (window.__nvisionHardwareLabels) {
    applyRealLabels(window.__nvisionHardwareLabels.labels || null);
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

    // vuelo de cámara (intro y cinemáticas)
    if (camTween) {
      camTween.k += dt / camTween.dur;
      const k = Math.min(camTween.k, 1);
      const s = k * k * (3 - 2 * k);
      camera.position.lerpVectors(camTween.p0, camTween.p1, s);
      controls.target.lerpVectors(camTween.t0, camTween.t1, s);
      if (k >= 1) camTween = null;
    }
    // zoom de rueda suave: la cámara se acerca a la distancia objetivo poco a poco
    if (camTween) {
      targetRadius = camera.position.distanceTo(controls.target);
    } else {
      const curR = camera.position.distanceTo(controls.target);
      if (clock.elapsedTime - lastWheelAt > 0.5) {
        // la distancia cambió por otro medio (pellizco, cinemática): el objetivo la sigue
        targetRadius = curR;
      } else if (Math.abs(targetRadius - curR) > 0.001) {
        const k = 1 - Math.exp(-dt * 9);
        const nextR = curR + (targetRadius - curR) * k;
        const dir = camera.position.clone().sub(controls.target).normalize();
        camera.position.copy(controls.target).addScaledVector(dir, nextR);
      }
    }
    controls.update();
    clampRoom(); // la cámara y el punto de mira nunca salen del cuarto (paneo, giro, zoom, auto-rotación y vuelos)

    // la cámara vuelve a girar sola tras 6 s sin tocar nada
    if (!reduceMotion && !camTween && clock.elapsedTime - lastInteract > 6) controls.autoRotate = true;

    // pulso al pasar el cursor sobre una pieza
    if (hoveredPart && hoveredPart !== selectedPart) {
      const pulse = 0.24 + Math.sin(elapsed * 6) * 0.12;
      (partMats[hoveredPart] || []).forEach((m) => { m.emissiveIntensity = pulse; });
    }

    // ventiladores: solo giran con el PC encendido (o al intentar arrancar);
    // al encender suben poco a poco, al apagar bajan
    const spin = reduceMotion ? 0 : 1;
    const spinTarget = (powered || bootTimer) ? 1 : (clock.elapsedTime < twitchUntil ? 0.6 : 0);
    powerSpin += (spinTarget - powerSpin) * Math.min(1, dt * (spinTarget > powerSpin ? 2.5 : 4));
    spinners.forEach((f) => { f.group.rotation.z += f.speed * fanBoost * powerSpin * spin * dt; });

    // tira RGB con ciclo de color suave (solo con el PC encendido)
    if (powered || bootTimer) rgbStrip.material.color.setHSL((elapsed * 0.04) % 1, 0.85, 0.6);
    else rgbStrip.material.color.setHex(0x0f172a);

    // LED de encendido: verde respirando si está encendido, rojo parpadeando si falló, apagado si no
    // (el factor pasa de 1 para que el verde supere el umbral del bloom y se vea brillar)
    if (powered) powerLedMat.color.setHex(0x22c55e).multiplyScalar(1.3 + 0.6 * Math.sin(elapsed * 2.2));
    else if (clock.elapsedTime < failBlinkUntil) powerLedMat.color.setHex(Math.floor(elapsed * 6) % 2 ? 0xef4444 : 0x450a0a).multiplyScalar(Math.floor(elapsed * 6) % 2 ? 1.8 : 1);
    else powerLedMat.color.setHex(0x1f2937);
    // anillo del botón de encendido: verde respirando si está encendido, rojo
    // parpadeando si falló el arranque, apagado si no (antes quedaba gris en el error)
    if (powerBtnRingMat) {
      if (powered) powerBtnRingMat.color.setHex(0x22c55e).multiplyScalar(1.3 + 0.6 * Math.sin(elapsed * 2.2));
      else if (clock.elapsedTime < failBlinkUntil) powerBtnRingMat.color.setHex(Math.floor(elapsed * 6) % 2 ? 0xef4444 : 0x450a0a).multiplyScalar(Math.floor(elapsed * 6) % 2 ? 1.8 : 1);
      else powerBtnRingMat.color.setHex(0x1f2937);
    }
    // LED de disco: solo parpadea con el PC encendido
    if (powered && Math.random() < 0.08) hddOn = !hddOn;
    hddLedMat.color.setHex(powered ? (hddOn ? 0xf59e0b : 0x201404) : 0x201404);
    if (powered && hddOn) hddLedMat.color.multiplyScalar(1.6);
    // luz interior de la torre: se enciende con el PC
    innerGlow.intensity += ((powered ? 18 : 0) - innerGlow.intensity) * Math.min(1, dt * 3);

    // vista desarmada escalonada + piezas retiradas con arco y flotación
    Object.entries(partGroups).forEach(([id, g]) => {
      const ud = g.userData;
      ud.explodeK += (explodeTarget - ud.explodeK) * Math.min(1, dt * ud.explodeRate);
      ud.removeK += ((ud.removed ? 1 : 0) - ud.removeK) * Math.min(1, dt * 5);
      if (ud.inspecting) {
        // vuelo a la mesa (o de vuelta): arco con una vuelta entera, y al
        // llegar gira despacio como en una vitrina
        if (ud.inspectK < 1) {
          ud.inspectK = Math.min(1, ud.inspectK + dt / (ud.inspectDur || 1.4));
          const e = ud.inspectK * ud.inspectK * (3 - 2 * ud.inspectK);
          g.position.lerpVectors(ud.inspectFrom, ud.inspectTo, e);
          const yLin = THREE.MathUtils.lerp(ud.inspectFrom.y, ud.inspectTo.y, e);
          g.position.y = yLin + Math.sin(e * Math.PI) * Math.max(0, ud.inspectPeak - yLin);
          g.rotation.y = ud.inspectFromRot + e * Math.PI * 2;
          if (ud.inspectK >= 1) {
            if (ud.inspectMode === 'snap') { ud.inspecting = false; snapIn(id); }
            else if (ud.inspectMode === 'release') { ud.inspecting = false; ud.freePos = null; }
            // 'rest': se queda girando despacio sobre la mesa
          }
        } else {
          g.position.copy(ud.inspectTo);
          g.rotation.y += dt * 0.45;
        }
      } else if (ud.dragging) {
        // la posición la fija el puntero directamente
      } else if (ud.freePos) {
        g.position.lerp(ud.freePos, Math.min(1, dt * 8));
        g.position.y += Math.sin(elapsed * 2 + ud.explodeRate) * 0.04;
      } else {
        g.position.copy(ud.base).addScaledVector(ud.dir, ud.explodeK * 1.6 + ud.removeK * 2.1);
        g.position.y += Math.sin(elapsed * 2 + ud.explodeRate) * 0.05 * ud.removeK;
      }
      if (!ud.inspecting) g.rotation.y = ud.removeK * 0.7;
    });
    // los cables se desvanecen cuando su pieza está retirada
    cables.forEach((c) => {
      const target = partGroups[c.partId].userData.removed ? 0 : 1;
      c.mesh.material.opacity += (target - c.mesh.material.opacity) * Math.min(1, dt * 6);
      c.mesh.visible = c.mesh.material.opacity > 0.02;
    });
    if (homeMarker.visible) homeMarker.scale.setScalar(1 + 0.15 * Math.sin(elapsed * 5));
    // el anillo de la mesa de inspección respira mientras hay una pieza sobre ella
    if (inspectRingMat) inspectRingMat.opacity = inspectedPart ? 0.4 + 0.2 * Math.sin(elapsed * 3) : 0.15;
    // pulso que viaja por la línea de guía mientras se arrastra una pieza
    if (guideLine.visible && dragId) {
      const g = partGroups[dragId];
      g.getWorldPosition(pulseV);
      const k = (elapsed * 1.2) % 1;
      // de la pieza (mundo) a su sitio (MUNDO): antes iba a g.userData.base, que es
      // local a la torre, y la bolita salía volando hacia el origen, sin nada que ver
      // con la pieza ni con su sitio
      guidePulse.position.lerpVectors(pulseV, guideHomeV, k);
      guidePulse.material.color.copy(guideMat.color);
      guidePulseHalo.material.color.copy(guideMat.color);
      guidePulse.visible = true;
    } else {
      guidePulse.visible = false;
    }
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
        if (p.labelOff) labelV.add(labelOffV.set(p.labelOff[0], p.labelOff[1], p.labelOff[2]));
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
