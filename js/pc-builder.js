/* =========================================================
   NVISION - PC BUILDER (Simulador de ensamblaje de PC)
   Inspirado en los simuladores de armado de PC: el jugador
   elige componentes reales, el motor revisa compatibilidad
   (socket, RAM, fuente, tamaño), calcula rendimiento y al
   "encender" corre un benchmark animado en el monitor.
   Todo es local: las partidas y los armados se guardan en
   el navegador (localStorage), sin cuentas ni servidor.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- CATÁLOGO DE COMPONENTES ----------------
     game/work: puntaje 0-100 de rendimiento.
     watts: consumo estimado en carga.                       */
  var CATEGORIES = [
    { id: 'cpu',    name: 'Procesador',        icon: 'cpu',    required: true },
    { id: 'board',  name: 'Placa base',        icon: 'board',  required: true },
    { id: 'ram',    name: 'Memoria RAM',       icon: 'ram',    required: true },
    { id: 'gpu',    name: 'Tarjeta gráfica',   icon: 'gpu',    required: false },
    { id: 'storage',name: 'Almacenamiento',    icon: 'disk',   required: true },
    { id: 'psu',    name: 'Fuente de poder',   icon: 'psu',    required: true },
    { id: 'case',   name: 'Gabinete',          icon: 'case',   required: true },
    { id: 'cooler', name: 'Refrigeración',     icon: 'fan',    required: true }
  ];

  var CATALOG = {
    cpu: [
      { id: 'i3-12100f', name: 'Intel Core i3-12100F', price: 95,  watts: 58,  socket: 'LGA1700', cores: 4,  game: 48, work: 42, igpu: false, desc: '4 núcleos · 4.3 GHz · ideal oficina y eSports ligeros' },
      { id: 'i5-12400f', name: 'Intel Core i5-12400F', price: 150, watts: 65,  socket: 'LGA1700', cores: 6,  game: 62, work: 58, igpu: false, desc: '6 núcleos · 4.4 GHz · el equilibrio clásico' },
      { id: 'i5-13600k',  name: 'Intel Core i5-13600K', price: 290, watts: 125, socket: 'LGA1700', cores: 14, game: 80, work: 78, igpu: true,  desc: '14 núcleos (6P+8E) · 5.1 GHz · gamer y creador' },
      { id: 'i7-14700k',  name: 'Intel Core i7-14700K', price: 410, watts: 125, socket: 'LGA1700', cores: 20, game: 88, work: 92, igpu: true,  desc: '20 núcleos (8P+12E) · 5.6 GHz · tope Intel' },
      { id: 'r5-5600',    name: 'AMD Ryzen 5 5600',    price: 120, watts: 65,  socket: 'AM4',     cores: 6,  game: 60, work: 55, igpu: false, desc: '6 núcleos · 4.4 GHz · rey del presupuesto AM4' },
      { id: 'r5-7600',    name: 'AMD Ryzen 5 7600',    price: 210, watts: 105, socket: 'AM5',     cores: 6,  game: 74, work: 68, igpu: true,  desc: '6 núcleos Zen 4 · 5.1 GHz · plataforma AM5' },
      { id: 'r7-7800x3d', name: 'AMD Ryzen 7 7800X3D', price: 380, watts: 120, socket: 'AM5',     cores: 8,  game: 97, work: 76, igpu: true,  desc: '8 núcleos + 3D V-Cache · el favorito para jugar' },
      { id: 'r9-7950x',   name: 'AMD Ryzen 9 7950X',   price: 520, watts: 170, socket: 'AM5',     cores: 16, game: 90, work: 99, igpu: true,  desc: '16 núcleos Zen 4 · render y compilación extrema' }
    ],
    board: [
      { id: 'h610m',   name: 'H610M Básica',        price: 80,  watts: 12, socket: 'LGA1700', ramType: 'DDR4', form: 'mATX', desc: 'LGA1700 · DDR4 · Micro-ATX · lo justo para oficina' },
      { id: 'b660m',   name: 'B660M DS3H',          price: 110, watts: 14, socket: 'LGA1700', ramType: 'DDR4', form: 'mATX', desc: 'LGA1700 · DDR4 · Micro-ATX · sólida y económica' },
      { id: 'b760',    name: 'B760 Tomahawk WiFi',  price: 190, watts: 16, socket: 'LGA1700', ramType: 'DDR5', form: 'ATX',  desc: 'LGA1700 · DDR5 · ATX · WiFi 6E y buen VRM' },
      { id: 'b550m',   name: 'B550M Aorus Elite',   price: 115, watts: 14, socket: 'AM4',     ramType: 'DDR4', form: 'mATX', desc: 'AM4 · DDR4 · Micro-ATX · clásica para Ryzen 5000' },
      { id: 'b650',    name: 'B650 Gaming Plus',    price: 210, watts: 16, socket: 'AM5',     ramType: 'DDR5', form: 'ATX',  desc: 'AM5 · DDR5 · ATX · PCIe 5.0 lista para futuro' },
      { id: 'b650i',   name: 'B650I Mini-ITX',      price: 260, watts: 13, socket: 'AM5',     ramType: 'DDR5', form: 'ITX',  desc: 'AM5 · DDR5 · Mini-ITX · para gabinetes mini' },
      { id: 'x670e',   name: 'X670E Master',        price: 330, watts: 20, socket: 'AM5',     ramType: 'DDR5', form: 'ATX',  desc: 'AM5 · DDR5 · ATX · gama alta, puertos de sobra' }
    ],
    ram: [
      { id: 'ram8d4',  name: '8 GB DDR4 3200',      price: 25,  watts: 3, type: 'DDR4', gb: 8,  speed: 3200, score: 30, rgb: false, desc: '1 módulo · oficina y tareas básicas' },
      { id: 'ram16d4', name: '16 GB DDR4 3600',     price: 45,  watts: 4, type: 'DDR4', gb: 16, speed: 3600, score: 55, rgb: false, desc: '2×8 GB · el mínimo cómodo para jugar' },
      { id: 'ram32d4', name: '32 GB DDR4 3600',     price: 85,  watts: 5, type: 'DDR4', gb: 32, speed: 3600, score: 72, rgb: false, desc: '2×16 GB · multitarea y edición sin ahogos' },
      { id: 'ram16d5', name: '16 GB DDR5 5600',     price: 55,  watts: 4, type: 'DDR5', gb: 16, speed: 5600, score: 62, rgb: false, desc: '2×8 GB DDR5 · entrada a la nueva generación' },
      { id: 'ram32d5', name: '32 GB DDR5 6000 RGB', price: 115, watts: 6, type: 'DDR5', gb: 32, speed: 6000, score: 84, rgb: true,  desc: '2×16 GB DDR5 · RGB · dulce para AM5 y gaming' },
      { id: 'ram64d5', name: '64 GB DDR5 6000',     price: 210, watts: 8, type: 'DDR5', gb: 64, speed: 6000, score: 96, rgb: false, desc: '2×32 GB · workstations, máquinas virtuales, IA local' }
    ],
    gpu: [
      { id: 'gpu-none', name: 'Sin gráfica dedicada', price: 0, watts: 0, len: 0, game: 8, work: 10, desc: 'Usa la gráfica integrada del procesador (si tiene)' },
      { id: 'gtx1650',  name: 'GTX 1650 4 GB',        price: 150, watts: 75,  len: 229, game: 35, work: 30, desc: '1080p en juegos ligeros · no pide conector extra' },
      { id: 'rtx4060',  name: 'RTX 4060 8 GB',        price: 300, watts: 115, len: 240, game: 66, work: 55, desc: '1080p alto / 1440p medio · DLSS 3 · muy eficiente' },
      { id: 'rtx4060ti',name: 'RTX 4060 Ti 16 GB',    price: 450, watts: 165, len: 245, game: 74, work: 66, desc: '1440p cómodo · 16 GB para texturas y creación' },
      { id: 'rx7800xt', name: 'RX 7800 XT 16 GB',     price: 500, watts: 263, len: 287, game: 82, work: 68, desc: '1440p ultra · mucha VRAM por el precio' },
      { id: 'rtx4070s', name: 'RTX 4070 Super 12 GB', price: 590, watts: 220, len: 267, game: 86, work: 80, desc: '1440p ultra / 4K medio · DLSS 3.5' },
      { id: 'rtx4090',  name: 'RTX 4090 24 GB',       price: 1600, watts: 450, len: 336, game: 100, work: 100, desc: '4K ultra sin discusión · enorme: mide tu gabinete' }
    ],
    storage: [
      { id: 'hdd1',    name: 'Disco duro 1 TB',      price: 40,  watts: 8, kind: 'HDD',  gb: 1000, score: 15, desc: 'Mecánico · barato por TB, lento para arrancar' },
      { id: 'sata500', name: 'SSD SATA 500 GB',      price: 45,  watts: 3, kind: 'SATA', gb: 500,  score: 40, desc: 'Un salto enorme frente al disco duro' },
      { id: 'nvme500', name: 'NVMe 500 GB Gen3',     price: 50,  watts: 4, kind: 'NVMe', gb: 500,  score: 58, desc: '3.500 MB/s · Windows vuela al encender' },
      { id: 'nvme1',   name: 'NVMe 1 TB Gen4',       price: 85,  watts: 5, kind: 'NVMe', gb: 1000, score: 78, desc: '7.000 MB/s · el favorito gamer' },
      { id: 'nvme2',   name: 'NVMe 2 TB Gen4',       price: 150, watts: 5, kind: 'NVMe', gb: 2000, score: 88, desc: 'Espacio para toda la biblioteca de juegos' },
      { id: 'nvme2g5', name: 'NVMe 2 TB Gen5',       price: 230, watts: 8, kind: 'NVMe', gb: 2000, score: 100, desc: '12.000 MB/s · lo más rápido del catálogo' }
    ],
    psu: [
      { id: 'psu450',  name: 'Fuente 450W Bronze',   price: 45,  wattsOut: 450,  tier: 'Bronze',   desc: 'Equipos de oficina y gama de entrada' },
      { id: 'psu550',  name: 'Fuente 550W Bronze',   price: 60,  wattsOut: 550,  tier: 'Bronze',   desc: 'Para gráficas de consumo moderado' },
      { id: 'psu650',  name: 'Fuente 650W Gold',     price: 85,  wattsOut: 650,  tier: 'Gold',     desc: 'El punto dulce gamer' },
      { id: 'psu750',  name: 'Fuente 750W Gold',     price: 105, wattsOut: 750,  tier: 'Gold',     desc: 'Gama alta con margen de sobra' },
      { id: 'psu850',  name: 'Fuente 850W Platinum', price: 140, wattsOut: 850,  tier: 'Platinum', desc: 'Silenciosa y eficiente para builds serios' },
      { id: 'psu1000', name: 'Fuente 1000W Platinum',price: 180, wattsOut: 1000, tier: 'Platinum', desc: 'RTX 4090 y workstations sin pestañear' }
    ],
    case: [
      { id: 'case-office', name: 'Gabinete Oficina Compacto', price: 45,  formMax: 'mATX', gpuMax: 240, rgb: false, airflow: 40, desc: 'Micro-ATX · sobrio · GPU máx 240 mm' },
      { id: 'case-mini',   name: 'Gabinete Mini-ITX Cube',     price: 85,  formMax: 'ITX',  gpuMax: 200, rgb: false, airflow: 45, desc: 'Mini-ITX · escritorio pequeño · GPU máx 200 mm' },
      { id: 'case-air',    name: 'Torre ATX Flujo de Aire',    price: 75,  formMax: 'ATX',  gpuMax: 320, rgb: false, airflow: 85, desc: 'Frente de malla · fresca y silenciosa' },
      { id: 'case-rgb',    name: 'Torre Cristal RGB',          price: 110, formMax: 'ATX',  gpuMax: 340, rgb: true,  airflow: 60, desc: 'Cristal templado · 4 ventiladores RGB' },
      { id: 'case-pano',   name: 'Torre Panorámica Premium',   price: 170, formMax: 'ATX',  gpuMax: 400, rgb: true,  airflow: 75, desc: 'Cristal doble · cabe cualquier gráfica' },
      { id: 'case-ws',     name: 'Torre Workstation XL',       price: 150, formMax: 'ATX',  gpuMax: 380, rgb: false, airflow: 70, desc: 'Espacio de sobra y cero ruido' }
    ],
    cooler: [
      { id: 'cool-stock', name: 'Disipador de serie',   price: 0,   height: 55,  cooling: 45,  sockets: ['LGA1700', 'AM4', 'AM5'], liquid: false, desc: 'El que viene en la caja · cumple en CPUs frescos' },
      { id: 'cool-tower', name: 'Torre de aire 120 mm', price: 35,  height: 155, cooling: 75,  sockets: ['LGA1700', 'AM4', 'AM5'], liquid: false, desc: 'El clásico confiable para 65-125W' },
      { id: 'cool-dual',  name: 'Torre doble premium',  price: 55,  height: 162, cooling: 90,  sockets: ['LGA1700', 'AM4', 'AM5'], liquid: false, desc: 'Doble ventilador · casi nivel líquida' },
      { id: 'cool-240',   name: 'Líquida AIO 240 mm',   price: 95,  height: 55,  cooling: 95,  sockets: ['LGA1700', 'AM4', 'AM5'], liquid: true,  desc: 'Radiador 240 · silencio y temperaturas bajas' },
      { id: 'cool-360',   name: 'Líquida AIO 360 RGB',  price: 140, height: 55,  cooling: 100, sockets: ['LGA1700', 'AM5'],        liquid: true,  desc: 'Radiador 360 RGB · ojo: no trae kit AM4' }
    ]
  };

  var FORM_RANK = { ITX: 1, mATX: 2, ATX: 3 };

  var MISSIONS = [
    { id: 'libre',   name: 'Modo libre',        budget: 0,    goal: null, desc: 'Arma lo que quieras, sin presupuesto ni notas. Tu taller, tus reglas.' },
    { id: 'oficina', name: 'Cliente: Oficina',  budget: 650,  goal: { key: 'office', min: 55 }, desc: 'Una oficina pide PCs que arranquen rápido y no hagan ruido. Presupuesto: $650 · Oficina ≥ 55.' },
    { id: 'gamer',   name: 'Cliente: Gamer 1440p', budget: 1300, goal: { key: 'gaming', min: 70 }, desc: 'Quiere jugar en 1440p sin vender un riñón. Presupuesto: $1.300 · Gaming ≥ 70.' },
    { id: 'creador', name: 'Cliente: Creador',  budget: 2200, goal: { key: 'work', min: 75, ramMin: 32, storageMin: 1000 }, desc: 'Edita video 4K: potencia de sobra, 32 GB de RAM o más y 1 TB o más. Presupuesto: $2.200 · Creación ≥ 75.' },
    { id: 'extremo', name: 'Cliente: Extremo',  budget: 3600, goal: { key: 'gaming', min: 90 }, desc: '“Lo mejor que exista, sin mirar el precio.” Bueno, casi: $3.600. Gaming ≥ 90.' }
  ];

  /* ---------------- ESTADO ---------------- */
  var build = {};           // catId -> item
  var mission = MISSIONS[0];
  var activeCat = 'cpu';
  var sortBy = 'price-asc';
  var powered = false;
  var busy = false;

  function $(id) { return document.getElementById(id); }
  function money(n) { return '$' + n.toLocaleString('es-CO'); }
  function findItem(cat, id) { return (CATALOG[cat] || []).filter(function (i) { return i.id === id; })[0] || null; }
  function catName(id) { var c = CATEGORIES.filter(function (x) { return x.id === id; })[0]; return c ? c.name : id; }

  /* ---------------- CÁLCULOS ---------------- */
  function totalPrice() { return Object.keys(build).reduce(function (s, k) { return s + (build[k] ? build[k].price : 0); }, 0); }
  function totalWatts() {
    var w = 35; // base: placa, ventiladores, USB
    Object.keys(build).forEach(function (k) { if (build[k] && build[k].watts) w += build[k].watts; });
    return w;
  }
  function scores() {
    var cpu = build.cpu, gpu = build.gpu, ram = build.ram, st = build.storage;
    if (!cpu) return { gaming: 0, office: 0, work: 0, overall: 0 };
    var gpuGame = gpu ? gpu.game : 8, gpuWork = gpu ? gpu.work : 10;
    var ramScore = ram ? ram.score : 0, stScore = st ? st.score : 0;
    var ramFactor = ram ? Math.min(1, ram.gb / 32) : 0;
    var gaming = Math.round(cpu.game * 0.30 + gpuGame * 0.50 + ramScore * 0.10 + stScore * 0.10);
    var office = Math.round(cpu.work * 0.35 + stScore * 0.30 + ramScore * 0.25 + 10 * 0.10 + (gpu ? 0 : 2));
    var work = Math.round(cpu.work * 0.45 + gpuWork * 0.20 + ramScore * 0.20 + stScore * 0.15);
    if (ram && ram.gb < 16) { gaming -= 8; work -= 6; }
    if (ramFactor >= 1) work += 3;
    // estrangulamiento térmico si la refrigeración no da abasto
    if (build.cooler && cpu.watts > build.cooler.cooling + 30) { gaming -= 6; work -= 6; }
    var clamp = function (n) { return Math.max(1, Math.min(100, n)); };
    gaming = clamp(gaming); office = clamp(office); work = clamp(work);
    return { gaming: gaming, office: office, work: work, overall: Math.round((gaming + office + work) / 3) };
  }
  function estTemp() {
    if (!build.cpu) return null;
    var cool = build.cooler ? build.cooler.cooling : 30;
    var air = build.case ? build.case.airflow : 50;
    var t = 38 + build.cpu.watts * 0.45 - cool * 0.28 - air * 0.06 + (build.gpu && build.gpu.watts > 200 ? 6 : 0);
    return Math.round(Math.max(34, Math.min(98, t)));
  }

  /* ---------------- COMPATIBILIDAD ---------------- */
  function checkCompat() {
    var errors = [], warnings = [];
    var cpu = build.cpu, board = build.board, ram = build.ram, gpu = build.gpu,
        psu = build.psu, kase = build.case, cooler = build.cooler;
    CATEGORIES.forEach(function (c) {
      if (c.required && !build[c.id]) errors.push('Falta instalar: ' + c.name + '.');
    });
    if (cpu && board && cpu.socket !== board.socket)
      errors.push('Socket incompatible: el procesador es ' + cpu.socket + ' y la placa es ' + board.socket + '.');
    if (ram && board && ram.type !== board.ramType)
      errors.push('RAM incompatible: la placa usa ' + board.ramType + ' y elegiste ' + ram.type + '.');
    if (board && kase && FORM_RANK[board.form] > FORM_RANK[kase.formMax])
      errors.push('La placa ' + board.form + ' no cabe en un gabinete ' + kase.formMax + '.');
    if (gpu && gpu.id !== 'gpu-none' && kase && gpu.len > kase.gpuMax)
      errors.push('La gráfica mide ' + gpu.len + ' mm y el gabinete admite máximo ' + kase.gpuMax + ' mm.');
    if (cooler && cpu && cooler.sockets.indexOf(cpu.socket) === -1)
      errors.push('La refrigeración no trae kit de montaje para ' + cpu.socket + '.');
    if ((!gpu || gpu.id === 'gpu-none') && cpu && !cpu.igpu)
      errors.push('Sin salida de video: ' + cpu.name + ' no tiene gráfica integrada (modelos “F”) y no instalaste una dedicada.');
    var w = totalWatts();
    if (psu) {
      if (psu.wattsOut < w) errors.push('Fuente insuficiente: el equipo consume ~' + w + ' W y la fuente entrega ' + psu.wattsOut + ' W.');
      else if (psu.wattsOut < w * 1.3) warnings.push('La fuente va justa (' + psu.wattsOut + ' W para ~' + w + ' W). Mejor dejar 30% de margen.');
    }
    if (cooler && cpu && cpu.watts > cooler.cooling + 30)
      warnings.push('Refrigeración corta para un procesador de ' + cpu.watts + ' W: habrá thermal throttling y ruido.');
    if (gpu && gpu.id !== 'gpu-none' && cpu && cpu.game < gpu.game - 35)
      warnings.push('Posible cuello de botella: la gráfica es mucho más potente que el procesador.');
    if (ram && ram.gb < 16) warnings.push('8 GB de RAM se quedan cortos en 2026 para jugar o editar.');
    return { errors: errors, warnings: warnings, complete: CATEGORIES.every(function (c) { return !c.required || build[c.id]; }) };
  }

  /* ---------------- RENDER: CATÁLOGO ---------------- */
  function specsOf(cat, item) {
    switch (cat) {
      case 'cpu': return [item.socket, item.cores + ' núcleos', item.watts + ' W TDP', item.igpu ? 'Con iGPU' : 'Sin iGPU'];
      case 'board': return [item.socket, item.ramType, item.form];
      case 'ram': return [item.gb + ' GB', item.type, item.speed + ' MT/s', item.rgb ? 'RGB' : 'Sin RGB'];
      case 'gpu': return item.id === 'gpu-none' ? ['Integrada'] : [item.len + ' mm', item.watts + ' W'];
      case 'storage': return [item.kind, item.gb >= 1000 ? (item.gb / 1000) + ' TB' : item.gb + ' GB'];
      case 'psu': return [item.wattsOut + ' W', '80+ ' + item.tier];
      case 'case': return ['Hasta ' + item.formMax, 'GPU máx ' + item.gpuMax + ' mm', item.rgb ? 'RGB' : 'Sobrio'];
      case 'cooler': return [item.liquid ? 'Líquida' : 'Por aire', 'Rinde ' + item.cooling, item.sockets.join(' · ')];
      default: return [];
    }
  }
  function perfOf(cat, item) {
    if (cat === 'cpu' || cat === 'gpu') return item.game;
    if (cat === 'ram' || cat === 'storage') return item.score;
    if (cat === 'cooler') return item.cooling;
    if (cat === 'case') return item.airflow;
    if (cat === 'psu') return Math.round(item.wattsOut / 10);
    if (cat === 'board') return Math.round(item.price / 3.3);
    return 50;
  }
  function renderCatalog() {
    var grid = $('pb-catalog');
    var items = CATALOG[activeCat].slice();
    if (sortBy === 'price-asc') items.sort(function (a, b) { return a.price - b.price; });
    if (sortBy === 'price-desc') items.sort(function (a, b) { return b.price - a.price; });
    if (sortBy === 'perf') items.sort(function (a, b) { return perfOf(activeCat, b) - perfOf(activeCat, a); });
    grid.innerHTML = '';
    items.forEach(function (item) {
      var selected = build[activeCat] && build[activeCat].id === item.id;
      var card = document.createElement('article');
      card.className = 'pb-card' + (selected ? ' pb-card--sel' : '');
      var chips = specsOf(activeCat, item).map(function (s) { return '<span class="pb-chip">' + s + '</span>'; }).join('');
      card.innerHTML =
        '<div class="pb-card-top"><h4>' + item.name + '</h4><span class="pb-price">' + (item.price ? money(item.price) : 'GRATIS') + '</span></div>' +
        '<p class="pb-card-desc">' + item.desc + '</p>' +
        '<div class="pb-chips">' + chips + '</div>' +
        '<div class="pb-perf"><span>Rendimiento</span><div class="pb-bar"><i style="width:' + perfOf(activeCat, item) + '%"></i></div><b>' + perfOf(activeCat, item) + '</b></div>' +
        '<button type="button" class="pb-install">' + (selected ? 'Instalado ✓ · Quitar' : 'Instalar en mi PC') + '</button>';
      card.querySelector('.pb-install').addEventListener('click', function () {
        if (selected) { delete build[activeCat]; }
        else { build[activeCat] = item; popSlot(activeCat); }
        powered = false;
        renderAll();
      });
      grid.appendChild(card);
    });
    document.querySelectorAll('.pb-tab').forEach(function (t) {
      var on = t.getAttribute('data-cat') === activeCat;
      t.classList.toggle('pb-tab--on', on);
      var done = !!build[t.getAttribute('data-cat')];
      t.querySelector('.pb-tab-state').textContent = done ? '✓' : '';
    });
  }

  /* ---------------- RENDER: GABINETE VISUAL ---------------- */
  function fanHTML(cls) { return '<span class="pb-fan ' + cls + '"><i></i><i></i><i></i><i></i><i></i><i></i></span>'; }
  function renderCase() {
    var kase = build.case;
    var visual = $('pb-case');
    visual.className = 'pb-case' + (powered ? ' pb-case--on' : '') + (kase && kase.rgb ? ' pb-case--rgb' : '');
    var gpu = build.gpu && build.gpu.id !== 'gpu-none';
    var ramSticks = build.ram ? Math.max(1, Math.min(4, Math.round(build.ram.gb / 8))) : 0;
    var sticks = '';
    for (var i = 0; i < 4; i++) sticks += '<span class="pb-stick' + (i < ramSticks ? ' pb-stick--in' + (build.ram.rgb ? ' pb-stick--rgb' : '') : '') + '"></span>';
    $('pb-slot-gpu').innerHTML = gpu
      ? '<div class="pb-gpu"><b>' + build.gpu.name + '</b><div class="pb-gpu-fans">' + fanHTML('') + fanHTML('') + '</div></div>'
      : '<div class="pb-empty">Ranura PCIe · sin gráfica</div>';
    $('pb-slot-cpu').innerHTML = build.cpu
      ? '<div class="pb-cpu"><b>' + (build.cooler && build.cooler.liquid ? 'Bomba AIO' : 'CPU') + '</b>' + (build.cooler && !build.cooler.liquid ? fanHTML('pb-fan--cpu') : '') + '<small>' + build.cpu.name.replace('Intel Core ', '').replace('AMD ', '') + '</small></div>'
      : '<div class="pb-empty">Socket vacío</div>';
    $('pb-slot-ram').innerHTML = '<div class="pb-sticks">' + sticks + '</div>' + (build.ram ? '<small>' + build.ram.name + '</small>' : '<small>Sin RAM</small>');
    $('pb-slot-board').textContent = build.board ? build.board.name + ' · ' + build.board.form : 'Sin placa base';
    $('pb-slot-storage').innerHTML = build.storage
      ? '<div class="pb-drive pb-drive--' + build.storage.kind.toLowerCase() + '"><b>' + build.storage.kind + '</b><small>' + build.storage.name + '</small></div>'
      : '<div class="pb-empty">Bahía vacía</div>';
    $('pb-slot-psu').innerHTML = build.psu
      ? '<div class="pb-psu"><b>PSU ' + build.psu.wattsOut + 'W</b><small>' + build.psu.tier + '</small></div>'
      : '<div class="pb-empty">Sin fuente</div>';
    $('pb-case-name').textContent = kase ? kase.name : 'Mesa de trabajo · elige un gabinete';
    $('pb-case-fans').innerHTML = fanHTML('pb-fan--case') + fanHTML('pb-fan--case') + fanHTML('pb-fan--case');
  }
  function popSlot(cat) {
    var map = { cpu: 'pb-slot-cpu', board: 'pb-slot-board', ram: 'pb-slot-ram', gpu: 'pb-slot-gpu', storage: 'pb-slot-storage', psu: 'pb-slot-psu', case: 'pb-case', cooler: 'pb-slot-cpu' };
    var el = $(map[cat] || 'pb-case');
    if (el) { el.classList.remove('pb-pop'); void el.offsetWidth; el.classList.add('pb-pop'); }
  }

  /* ---------------- RENDER: RESUMEN, STATS Y HUD ---------------- */
  function renderAll() {
    renderCatalog(); renderCase();
    var list = $('pb-build-list'); list.innerHTML = '';
    CATEGORIES.forEach(function (c) {
      var li = document.createElement('li');
      var item = build[c.id];
      li.className = 'pb-slot-row' + (item ? ' pb-slot-row--ok' : '');
      li.innerHTML = '<span class="pb-slot-cat">' + c.name + '</span><span class="pb-slot-name">' + (item ? item.name : '— vacío —') + '</span>' +
        (item ? '<span class="pb-slot-price">' + money(item.price) + '</span><button type="button" class="pb-remove" aria-label="Quitar ' + c.name + '">×</button>' : '');
      if (item) li.querySelector('.pb-remove').addEventListener('click', function () { delete build[c.id]; powered = false; renderAll(); });
      li.addEventListener('click', function (e) { if (e.target.tagName !== 'BUTTON') { activeCat = c.id; renderCatalog(); } });
      list.appendChild(li);
    });
    var chk = checkCompat(), sc = scores(), total = totalPrice(), watts = totalWatts();
    $('pb-total').textContent = money(total);
    $('pb-watts').textContent = watts + ' W';
    var temp = estTemp();
    $('pb-temp').textContent = temp === null ? '—' : '~' + temp + ' °C';
    var budgetBar = $('pb-budget-wrap');
    if (mission.budget) {
      budgetBar.style.display = '';
      var pct = Math.min(100, Math.round(total / mission.budget * 100));
      $('pb-budget-bar').style.width = pct + '%';
      $('pb-budget-bar').className = 'pb-budget-fill' + (total > mission.budget ? ' pb-budget-fill--over' : '');
      $('pb-budget-text').textContent = money(total) + ' de ' + money(mission.budget) + (total > mission.budget ? ' · ¡te pasaste!' : ' · te quedan ' + money(mission.budget - total));
    } else budgetBar.style.display = 'none';
    [['gaming', 'pb-score-gaming'], ['office', 'pb-score-office'], ['work', 'pb-score-work']].forEach(function (pair) {
      var el = $(pair[1]);
      el.querySelector('i').style.width = sc[pair[0]] + '%';
      el.querySelector('b').textContent = sc[pair[0]];
    });
    $('pb-score-overall').textContent = build.cpu ? sc.overall : '—';
    var box = $('pb-compat'); box.innerHTML = '';
    if (!chk.complete) box.innerHTML += '<p class="pb-note">Armado incompleto: instala todas las piezas obligatorias para poder encender.</p>';
    chk.errors.forEach(function (e) { box.innerHTML += '<p class="pb-err">⛔ ' + e + '</p>'; });
    chk.warnings.forEach(function (e) { box.innerHTML += '<p class="pb-warn">⚠️ ' + e + '</p>'; });
    if (chk.complete && !chk.errors.length && !chk.warnings.length) box.innerHTML += '<p class="pb-ok">✅ Todo compatible. ¡A encender!</p>';
    else if (chk.complete && !chk.errors.length) box.innerHTML += '<p class="pb-ok">✅ Compatible, con observaciones arriba.</p>';
    $('pb-power').disabled = busy;
    document.body.classList.toggle('pb-powered', powered);
  }

  /* ---------------- ENCENDIDO Y BENCHMARK ---------------- */
  function screen(lines, cls) {
    var scr = $('pb-screen');
    scr.className = 'pb-screen ' + (cls || '');
    scr.innerHTML = lines.map(function (l) { return '<div>' + l + '</div>'; }).join('');
    scr.scrollTop = scr.scrollHeight;
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  async function powerOn() {
    if (busy) return;
    var chk = checkCompat();
    busy = true; renderAll();
    if (!chk.complete || chk.errors.length) {
      powered = false; renderCase();
      screen(['NVISION BIOS v2.6', '........................', '❌ POST FALLÓ', ''].concat(chk.errors.map(function (e) { return '· ' + e; })).concat(['', 'Corrige el problema y vuelve a encender.']), 'pb-screen--err');
      busy = false; renderAll(); return;
    }
    var log = ['NVISION BIOS v2.6', 'CPU: ' + build.cpu.name + ' ✓', 'RAM: ' + build.ram.gb + ' GB ' + build.ram.type + ' ✓',
      'GPU: ' + (build.gpu && build.gpu.id !== 'gpu-none' ? build.gpu.name : 'Integrada') + ' ✓',
      build.storage.kind + ': ' + build.storage.name + ' ✓', 'POST OK · Arrancando Windows...'];
    screen([], '');
    for (var i = 0; i < log.length; i++) { log.slice(0, i + 1); screen(log.slice(0, i + 1), ''); await wait(260); }
    powered = true; renderCase();
    await wait(500);
    var sc = scores(), temp = estTemp();
    var games = [['Cyberpunk 2077 (1440p)', sc.gaming * 1.05], ['Fortnite (1080p)', sc.gaming * 1.9], ['CS2 (1080p)', sc.gaming * 2.6], ['Flight Simulator (1440p)', sc.gaming * 0.62]];
    var lines = log.concat(['', '— BENCHMARK NVISION —']);
    screen(lines, 'pb-screen--run');
    for (var g = 0; g < games.length; g++) {
      var fps = Math.max(4, Math.round(games[g][1] * (0.92 + Math.random() * 0.16)));
      lines.push(games[g][0] + ' → ' + fps + ' FPS');
      screen(lines.slice(), 'pb-screen--run'); await wait(650);
    }
    lines.push('Temperatura en carga: ~' + temp + ' °C ' + (temp > 85 ? '(¡caliente!)' : temp > 75 ? '(aceptable)' : '(fresca)'));
    lines.push('Puntaje general: ' + sc.overall + ' / 100');
    var verdict = missionVerdict(sc);
    lines.push(''); lines.push(verdict.text);
    screen(lines, verdict.ok ? 'pb-screen--ok' : 'pb-screen--run');
    if (verdict.ok) saveProgress(verdict);
    busy = false; renderAll();
  }
  function missionVerdict(sc) {
    if (!mission.goal) return { ok: true, text: '🏁 Modo libre: tu PC enciende y rinde ' + sc.overall + '/100. Guárdalo y compártelo con el equipo.' };
    var g = mission.goal, total = totalPrice(), fails = [];
    if (total > mission.budget) fails.push('te pasaste del presupuesto (' + money(total) + ' de ' + money(mission.budget) + ')');
    if (sc[g.key] < g.min) fails.push('el puntaje ' + (g.key === 'gaming' ? 'Gaming' : g.key === 'work' ? 'Creación' : 'Oficina') + ' es ' + sc[g.key] + ' y el cliente pide ≥ ' + g.min);
    if (g.ramMin && (!build.ram || build.ram.gb < g.ramMin)) fails.push('el cliente pide mínimo ' + g.ramMin + ' GB de RAM');
    if (g.storageMin && (!build.storage || build.storage.gb < g.storageMin)) fails.push('el cliente pide mínimo 1 TB de almacenamiento');
    if (!fails.length) {
      var stars = total <= mission.budget * 0.8 ? 3 : total <= mission.budget * 0.95 ? 2 : 1;
      return { ok: true, stars: stars, text: '🎉 ¡Cliente feliz! ' + '⭐'.repeat(stars) + ' Entregaste dentro del presupuesto con ' + money(mission.budget - total) + ' de sobra.' };
    }
    return { ok: false, text: '😐 El cliente no acepta la entrega: ' + fails.join(' · ') + '. Ajusta el armado y vuelve a encender.' };
  }

  /* ---------------- GUARDADO LOCAL ---------------- */
  function saveProgress(verdict) {
    try {
      var done = JSON.parse(localStorage.getItem('pb_missions') || '{}');
      if (mission.goal && verdict.stars) done[mission.id] = Math.max(done[mission.id] || 0, verdict.stars);
      localStorage.setItem('pb_missions', JSON.stringify(done));
      renderMissions();
    } catch (e) {}
  }
  function saveBuild() {
    var name = ($('pb-build-name').value || '').trim() || 'Mi PC ' + new Date().toLocaleDateString('es-CO');
    try {
      var all = JSON.parse(localStorage.getItem('pb_builds') || '[]');
      var ids = {}; Object.keys(build).forEach(function (k) { ids[k] = build[k].id; });
      all.push({ name: name, ids: ids, total: totalPrice(), score: scores().overall, when: Date.now() });
      localStorage.setItem('pb_builds', JSON.stringify(all.slice(-12)));
      renderSaved();
    } catch (e) {}
  }
  function renderSaved() {
    var ul = $('pb-saved'); if (!ul) return;
    var all = [];
    try { all = JSON.parse(localStorage.getItem('pb_builds') || '[]'); } catch (e) {}
    ul.innerHTML = all.length ? '' : '<li class="pb-note">Todavía no guardas ningún armado.</li>';
    all.slice().reverse().forEach(function (b, idx) {
      var li = document.createElement('li');
      li.className = 'pb-saved-row';
      li.innerHTML = '<span><b>' + b.name.replace(/</g, '&lt;') + '</b> · ' + money(b.total) + ' · ' + b.score + '/100</span>';
      var btn = document.createElement('button'); btn.type = 'button'; btn.textContent = 'Cargar'; btn.className = 'pb-mini';
      btn.addEventListener('click', function () {
        build = {};
        Object.keys(b.ids).forEach(function (k) { var it = findItem(k, b.ids[k]); if (it) build[k] = it; });
        powered = false; renderAll();
        screen(['Armado cargado: ' + b.name, 'Revisa la compatibilidad y enciende cuando quieras.'], '');
      });
      li.appendChild(btn); ul.appendChild(li);
    });
  }
  function summaryText() {
    var lines = ['🖥️ Mi PC en NVISION PC Builder — ' + money(totalPrice()) + ' · ' + scores().overall + '/100'];
    CATEGORIES.forEach(function (c) { if (build[c.id]) lines.push('· ' + c.name + ': ' + build[c.id].name); });
    lines.push('Consumo estimado: ' + totalWatts() + ' W · nvision.social/simulador-pc.html');
    return lines.join('\n');
  }

  /* ---------------- MISIONES ---------------- */
  function renderMissions() {
    var wrap = $('pb-missions'); wrap.innerHTML = '';
    var done = {};
    try { done = JSON.parse(localStorage.getItem('pb_missions') || '{}'); } catch (e) {}
    MISSIONS.forEach(function (m) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pb-mission' + (mission.id === m.id ? ' pb-mission--on' : '');
      b.innerHTML = '<b>' + m.name + '</b>' + (done[m.id] ? '<span class="pb-stars">' + '⭐'.repeat(done[m.id]) + '</span>' : '') + '<small>' + m.desc + '</small>';
      b.addEventListener('click', function () { mission = m; renderMissions(); renderAll(); });
      wrap.appendChild(b);
    });
  }

  /* ---------------- INICIO ---------------- */
  function init() {
    var tabs = $('pb-tabs');
    CATEGORIES.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'pb-tab'; b.setAttribute('data-cat', c.id);
      b.innerHTML = c.name + ' <span class="pb-tab-state"></span>';
      b.addEventListener('click', function () { activeCat = c.id; renderCatalog(); });
      tabs.appendChild(b);
    });
    $('pb-sort').addEventListener('change', function () { sortBy = this.value; renderCatalog(); });
    $('pb-power').addEventListener('click', powerOn);
    $('pb-reset').addEventListener('click', function () { build = {}; powered = false; screen(['Mesa limpia. Elige la primera pieza en el catálogo.'], ''); renderAll(); });
    $('pb-random').addEventListener('click', function () {
      // armado aleatorio pero compatible: elige plataforma primero
      var cpu = CATALOG.cpu[Math.floor(Math.random() * CATALOG.cpu.length)];
      build = { cpu: cpu };
      build.board = CATALOG.board.filter(function (b) { return b.socket === cpu.socket; })[Math.floor(Math.random() * CATALOG.board.filter(function (b) { return b.socket === cpu.socket; }).length)];
      build.ram = CATALOG.ram.filter(function (r) { return r.type === build.board.ramType; })[Math.floor(Math.random() * 3)];
      build.gpu = CATALOG.gpu[Math.floor(Math.random() * CATALOG.gpu.length)];
      build.storage = CATALOG.storage[Math.floor(Math.random() * CATALOG.storage.length)];
      build.case = CATALOG.case.filter(function (k) { return FORM_RANK[k.formMax] >= FORM_RANK[build.board.form] && k.gpuMax >= (build.gpu ? build.gpu.len : 0); })[0] || CATALOG.case[4];
      build.cooler = CATALOG.cooler.filter(function (c) { return c.sockets.indexOf(cpu.socket) !== -1; })[1];
      var w = totalWatts();
      build.psu = CATALOG.psu.filter(function (p) { return p.wattsOut >= w * 1.3; })[0] || CATALOG.psu[CATALOG.psu.length - 1];
      powered = false; renderAll();
      screen(['🎲 Armado sorpresa generado (compatible).', 'Revísalo, cámbiale lo que quieras y enciéndelo.'], '');
    });
    $('pb-save').addEventListener('click', saveBuild);
    $('pb-copy').addEventListener('click', function () {
      var txt = summaryText();
      if (navigator.clipboard) navigator.clipboard.writeText(txt);
      screen(['📋 Resumen copiado:', ''].concat(txt.split('\n')), 'pb-screen--ok');
    });
    renderMissions(); renderSaved(); renderAll();
    screen(['Bienvenido al taller NVISION.', '1) Acepta un encargo de cliente o juega libre.', '2) Instala las 8 categorías de piezas.', '3) Corrige los errores de compatibilidad.', '4) Pulsa ENCENDER y supera el benchmark.'], '');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
