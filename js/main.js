/**
 * main.js - Manejo de traducción bilingüe (Español / Inglés),
 * menú adaptativo para dispositivos móviles y utilidades interactivas.
 */

// Diccionario de textos bilingüe
const translations = {
  es: {
    badge_hero: "Estructura de Redes",
    hero_title: "Arquitectura y Evolución de los Computadores",
    hero_desc: "Una base interactiva diseñada para explorar la historia, componentes y funcionamiento del hardware computacional y su impacto en las redes.",
    btn_timeline: "Línea de Tiempo",
    btn_components: "Ver Componentes",
    btn_see_full_history: "Ver historia completa y pioneros",
    btn_hide_full_history: "Ocultar historia completa",
    badge_origin: "Hito Histórico Fundacional",
    heading_how_created: "¿Cómo y por qué nació el ENIAC?",
    text_eniac_history_1: "Durante la Segunda Guerra Mundial, el ejército estadounidense enfrentaba la necesidad crítica de calcular con rapidez y precisión complejas tablas balísticas de tiro para artillería pesada. En 1943, el Laboratorio de Investigación Balística del Ejército financió en secreto el proyecto en la Moore School of Electrical Engineering de la Universidad de Pensilvania bajo el nombre clave Project PX.",
    text_eniac_history_2: "Concluido formalmente en 1945 y presentado al público en febrero de 1946, el ENIAC (Electronic Numerical Integrator and Computer) pesaba más de 27 toneladas, ocupaba una superficie de 167 m², requería 150 kW de energía y constaba de más de 17.468 tubos de vacío, 7.200 diodos de cristal y 5 millones de uniones soldadas a mano.",
    heading_pioneers: "Pioneros y Creadores Clave",
    role_mauchly: "Físico y Diseñador Conceptual Principal",
    desc_mauchly: "Ideó la arquitectura electrónica básica tras comprender que los circuitos con válvulas podían realizar operaciones aritméticas a velocidades impensables para los relés mecánicos.",
    role_eckert: "Ingeniero Eléctrico Jefe",
    desc_eckert: "El genio detrás del diseño de ingeniería y la fiabilidad del hardware. Diseñó los circuitos que evitaron que los miles de tubos de vacío fallaran constantemente.",
    pioneers_programmers_title: "Las 6 Programadoras Pioneras del ENIAC",
    role_programmers: "Kay McNulty, Betty Jennings, Betty Snyder, Marlyn Wescoff, Ruth Lichterman y Frances Bilas",
    desc_programmers: "Programaban el ENIAC sin lenguajes de programación ni sistemas operativos: configuraban a mano cientos de cables, paneles de conmutación y diagramas lógicos para calcular trayectorias balísticas.",
    role_von_neumann: "Consultor Matemático",
    desc_von_neumann: "Se unió como consultor y, a partir del aprendizaje del ENIAC, formuló en 1945 el concepto de programa almacenado (Arquitectura Von Neumann) que hoy rige a casi todas las computadoras modernas.",
    heading_legacy: "Impacto y Legado Tecnológico",
    text_eniac_legacy: "El ENIAC demostró al mundo que el cálculo electrónico a gran escala era viable. Aunque no almacenaba el programa en memoria como hoy (se recableaba manualmente para cada tarea), redujo cálculos de balística de 20 horas a tan solo 30 segundos, abriendo la era digital moderna.",
    nav_history: "Historia",
    nav_components: "Componentes",
    nav_network: "Hardware & Redes",
    nav_glossary: "Glosario",
    nav_lab: "Laboratorio",
    nav_grp_hardware: "Hardware",
    nav_back: "Volver",
    nav_grp_networks: "Redes",
    nav_grp_resources: "Recursos",
    
    // Historia
    hist_title: "Computadores Históricos (Antes de 1980)",
    hist_desc: "Los primeros hitos de la computación que sentaron las bases para las redes y la microcomputación moderna.",
    eniac_title: "ENIAC - Primer Computador Electrónico de Propósito General",
    eniac_desc: "Ocupaba una habitación entera y empleaba más de 17.000 válvulas de vacío. Fue crucial para el cálculo balístico y científico.",
    ibm7090_title: "IBM 7090 - Sistema Central Transistorizado",
    ibm7090_desc: "Reemplazó las válvulas de vacío por transistores, multiplicando por 6 la velocidad de cálculo y reduciendo el consumo eléctrico.",
    altair_title: "Altair 8800 - Primer Microcomputador Comercial",
    altair_desc: "Basado en el procesador Intel 8080. Dio origen al software de microcomputadoras y al inicio de la informática personal.",
    apple2_title: "Apple II - Microcomputador Personal Integrado",
    apple2_desc: "Uno de los primeros microcomputadores producidos en masa con teclado integrado, gráficos a color y ranuras de expansión.",

    // Componentes
    comp_title: "Componentes de un Computador",
    comp_desc: "Los pilares del hardware que permiten procesar datos, ejecutar programas y comunicarse en red.",
    mb_title: "Placa Madre (Motherboard)",
    mb_desc: "El circuito principal que interconecta el procesador, memorias, tarjetas de red y dispositivos de almacenamiento.",
    mb_sub: "Conectividad & Buses",
    cpu_title: "Procesador (CPU)",
    cpu_desc: "El cerebro del sistema encargado de ejecutar instrucciones, realizar cálculos lógicos y coordinar periféricos.",
    cpu_sub: "Unidad Central de Procesamiento",
    ram_title: "Memoria RAM",
    ram_desc: "Almacenamiento de alta velocidad y temporal donde se cargan los programas en ejecución y los búferes de red.",
    ram_sub: "Memoria de Acceso Aleatorio",
    storage_title: "Almacenamiento (SSD / HDD)",
    storage_desc: "Memoria persistente donde se almacena el sistema operativo, controladores, datos y servicios de red.",
    storage_sub: "Persistencia de Datos",
    nic_title: "Adaptador de Red (NIC)",
    nic_desc: "Hardware clave en estructura de redes para conectar el host a redes Ethernet LAN o inalámbricas Wi-Fi.",
    nic_sub: "Interfaz LAN / WLAN",
    psu_title: "Fuente de Poder (PSU)",
    psu_desc: "Convierte la corriente alterna en los voltajes continuos que alimentan con estabilidad a cada circuito del equipo.",
    psu_sub: "Distribución Eléctrica",
    btn_view_component_img: "Ver imagen e info",
    btn_hide_component_img: "Ocultar imagen",
    caption_mb: "Esquema y distribución de zócalos, ranuras PCIe, chipset y conectores en una placa base moderna.",
    caption_cpu: "Microprocesador multicore de alto rendimiento con cápsula de protección térmica (IHS).",
    caption_ram: "Módulo de memoria DIMM con chips DRAM y contactos dorados para conexión al bus de alta velocidad.",
    caption_storage: "Unidad de estado sólido moderna en formato M.2 NVMe conectada directamente por líneas PCIe.",
    caption_nic: "Tarjeta de interfaz de red (NIC) PCIe con puerto RJ45 Gigabit Ethernet y chip controlador.",
    caption_psu: "Fuente ATX modular con ventilador de refrigeración y conectores de alimentación para placa base y componentes.",
    cooling_title: "Refrigeración Líquida (AIO Cooler)",
    cooling_desc: "Disipa el calor extremo generado por el procesador (CPU) mediante un circuito cerrado de líquido refrigerante, radiador y ventiladores de alta presión estática.",
    cooling_sub: "Disipación Térmica & Control de Temperatura",
    caption_cooling: "Sistema de refrigeración líquida todo en uno (AIO) con bomba RGB integrada y radiador de doble ventilador para evitar estrangulamiento térmico.",
    gpu_title: "Tarjeta Gráfica (GPU)",
    gpu_desc: "Circuito dedicado de alto rendimiento para el renderizado 3D acelerado, modelado por computadora, inteligencia artificial y cálculo intensivo.",
    gpu_sub: "Procesamiento Gráfico & Paralelo",
    caption_gpu: "Tarjeta de video dedicada para ranura PCIe con disipador masivo, ventiladores axiales y memoria VRAM de alta velocidad para aceleración por hardware.",
    optical_title: "Unidad de Disco Óptico (ODD)",
    optical_desc: "Dispositivo de almacenamiento que utiliza diodos láser de luz infrarroja o azul para leer y escribir datos en discos compactos CD, DVD y Blu-ray.",
    optical_sub: "Medio Extraíble & Láser Óptico",
    caption_optical: "Lector y grabador de discos ópticos SATA con bandeja de carga frontal, lente láser óptico y motor de giro para almacenamiento físico extraíble.",

    // Hardware y Redes
    net_title: "Del Hardware a la Red",
    net_desc: "Cómo el equipo físico se enlaza e interactúa en una infraestructura de red local (LAN).",
    mac_title: "Dirección MAC (Hardware Address)",
    mac_desc: "Identificador físico único de 48 bits grabado directamente en la memoria ROM de cada tarjeta de red (NIC) para la capa de enlace de datos.",
    eth_title: "Puertos Físicos y Conectividad",
    eth_desc: "Interfaces RJ-45 para cable de par trenzado (Ethernet) e interfaces de radiofrecuencia (Wi-Fi) conectadas mediante el bus PCIe.",
    flow_title: "Flujo de Datos en el Host",
    flow_desc: "Los paquetes viajan desde la memoria RAM, son procesados por la CPU y enviados al controlador NIC para su modulación y transmisión en el medio físico.",

    // Topologías de Redes
    nav_topologies: "Topologías",
    topol_title: "Topologías de Redes",
    topol_desc: "La distribución física y lógica que define cómo se interconectan los nodos, hosts y enlaces de transmisión en una infraestructura de comunicaciones.",
    lbl_typical_use: "Uso común:",

    star_title: "Topología en Estrella (Star)",
    star_badge: "Punto Centralizado // Estándar LAN",
    star_desc: "Cada nodo se conecta independientemente a un conmutador (Switch) o concentrador central. Si un cable o estación falla, el resto de la red sigue operando sin interrupción.",
    star_pro: "Fácil de diagnosticar y agregar nuevos nodos sin detener la red.",
    star_con: "Punto único de fallo: si el switch central falla, toda la red cae.",
    star_use: "Redes Ethernet modernas, oficinas corporativas y routers domésticos Wi-Fi.",

    bus_title: "Topología en Bus",
    bus_badge: "Canal Compartido // Troncal",
    bus_desc: "Todos los dispositivos se conectan a un único cable troncal compartido (backbone). Requiere resistencias terminadoras en ambos extremos para absorber las señales y evitar reflexiones.",
    bus_pro: "Bajo costo de instalación y menor consumo de cableado físico.",
    bus_con: "Una rotura en el cable troncal deja inoperativa toda la red (alta probabilidad de colisiones).",
    bus_use: "Redes automotrices (CAN bus), instrumentación industrial y Ethernet histórica 10BASE2.",

    ring_title: "Topología en Anillo (Ring)",
    ring_badge: "Bucle Cerrado // Paso de Token",
    ring_desc: "Cada estación se conecta a dos vecinas formando un circuito cerrado. Los datos viajan secuencialmente en un único sentido mediante un testigo o 'token' lógico para evitar colisiones.",
    ring_pro: "Sin colisiones de paquetes; rendimiento regular y predecible bajo alto tráfico.",
    ring_con: "La desconexión o fallo de un equipo interrumpe todo el ciclo de transmisión.",
    ring_use: "Redes metropolitanas de fibra óptica (FDDI, SONET/SDH) e histórica Token Ring.",

    mesh_title: "Topología en Malla (Mesh)",
    mesh_badge: "Redundancia Total // Alta Disponibilidad",
    mesh_desc: "Cada nodo cuenta con conexiones directas punto a punto con múltiples o todos los demás nodos de la red. Ofrece múltiples rutas dinámicas para transportar cada paquete de información.",
    mesh_pro: "Máxima tolerancia a fallos: si un enlace se corta, el tráfico se redirige al instante.",
    mesh_con: "Elevado coste en cableado, interfaces físicas y complejidad de ruteo.",
    mesh_use: "Infraestructura troncal de Internet (Backbone Tier-1), centros de datos y redes Wi-Fi Mesh.",

    tree_title: "Topología en Árbol (Tree)",
    tree_badge: "Estructura Jerárquica // Multinivel",
    tree_desc: "Organiza los dispositivos en diferentes niveles jerárquicos (Núcleo, Distribución y Acceso). Es una combinación estructurada de múltiples estrellas conectadas a un conmutador principal.",
    tree_pro: "Gran escalabilidad, facilita el aislamiento de subredes y la gestión por departamentos.",
    tree_con: "Si el nodo raíz principal falla, las ramas subordinadas pierden conectividad entre sí.",
    tree_use: "Redes de campus universitarios, edificios corporativos y redes de televisión por cable.",

    hybrid_title: "Topología Híbrida (Mixta)",
    hybrid_badge: "Combinación Adaptativa // Flexible",
    hybrid_desc: "Fusión de dos o más topologías distintas (por ejemplo, estrella-anillo o estrella-bus) en una misma red. Permite adaptar la arquitectura física a las necesidades geográficas de cada sector.",
    hybrid_pro: "Máxima flexibilidad: aprovecha las virtudes de cada topología según cada área de la empresa.",
    hybrid_con: "Diseño y mantenimiento complejos; requiere dispositivos de interconexión avanzados.",
    hybrid_use: "Grandes organizaciones multinacionales, redes bancarias y enlaces nube con sedes locales.",

    // Glosario
    glos_title: "Glosario Técnico de Redes y Computación",
    glos_desc: "Conceptos esenciales en inglés técnico para la comunicación en redes y arquitectura de sistemas.",
    term_throughput: "Throughput (Tasa de transferencia efectiva)",
    desc_throughput: "Volumen real de datos transferidos con éxito entre dos puntos de la red en un intervalo de tiempo.",
    term_bandwidth: "Bandwidth (Ancho de banda)",
    desc_bandwidth: "Capacidad máxima teórica de transmisión de un canal o medio de red medido en bps (bits por segundo).",
    term_nic: "NIC (Network Interface Card)",
    desc_nic: "Circuito integrado que proporciona el puente físico y lógico entre el bus interno del computador y el cable de red.",
    term_packet: "Packet (Paquete de red)",
    desc_packet: "Unidad de datos formateada con encabezados de origen, destino y carga útil que viaja por la red.",

    // Laboratorio
    lab_title: "Área de Innovación & Expansiones",
    lab_desc: "Módulos experimentales preparados para futuras entregas del equipo.",
    model3d_title: "Simulación de Torre 3D",
    model3d_desc: "Espacio reservado para integrar Three.js o un visor 3D interactivo que permita rotar y desarmar una torre de PC virtual.",
    model3d_wait: "Modelo 3D en desarrollo (Three.js / WebGL)",
    ps_title: "Diagnóstico de Hardware (PowerShell)",
    ps_desc: "Código nativo en Windows para consultar los componentes reales del equipo en el que se ejecuta la práctica de laboratorio:",
    copy_code: "Copiar",
    copied_code: "¡Copiado!",

    // Clasificación de Redes por Alcance (Tabla y Tarjetas BAN a GAN)
    nav_scope: "Clasificación de Redes",
    scope_title: "Tipos de Redes según su Cobertura Geográfica",
    scope_desc: "Clasificación completa de redes informáticas en orden ascendente según su escala espacial, distancia de transmisión y aplicaciones reales.",
    lbl_example: "Caso de uso común:",
    th_sigla: "Sigla",
    th_fullname: "Nombre Completo",
    th_coverage: "Cobertura Típica",
    th_usecase: "Caso de Uso Común",
    tbl_ban_name: "Body Area Network",
    tbl_ban_cov: "< 1 metro",
    tbl_ban_use: "Sensores médicos y dispositivos en el cuerpo",
    tbl_pan_name: "Personal Area Network",
    tbl_pan_cov: "~1 a 10 metros",
    tbl_pan_use: "Bluetooth entre móvil, reloj y auriculares",
    tbl_lan_name: "Local / Wireless LAN",
    tbl_lan_cov: "Edificio, hogar (~100 m)",
    tbl_lan_use: "Red doméstica Wi-Fi o red de oficina",
    tbl_can_name: "Campus Area Network",
    tbl_can_cov: "Conjunto de edificios (1 a 5 km)",
    tbl_can_use: "Universidad, hospital o parque industrial",
    tbl_man_name: "Metropolitan Area Network",
    tbl_man_cov: "Ciudad o municipio (hasta 50 km)",
    tbl_man_use: "Red municipal de fibra óptica o TV por cable",
    tbl_wan_name: "Wide Area Network",
    tbl_wan_cov: "País, continente o global",
    tbl_wan_use: "Interconexión de sucursales bancarias; Internet",
    tbl_gan_name: "Global Area Network",
    tbl_gan_cov: "Planetario",
    tbl_gan_use: "Redes satelitales (Starlink) y cables submarinos",
    ban_title: "BAN (Body Area Network)",
    ban_sub: "Red de Área Corporal",
    ban_desc: "Menos de 1 metro en torno al cuerpo humano. Comunica biosensores implantables o llevables con monitores de salud.",
    ban_example: "Sensores médicos inalámbricos, marcapasos inteligentes y monitores continuos de glucosa o ritmo cardíaco.",
    pan_title: "PAN (Personal Area Network)",
    pan_sub: "Red de Área Personal",
    pan_desc: "Alrededor de 1 a 10 metros del usuario. Enlaza dispositivos personales directos de bajo consumo eléctrico.",
    pan_example: "Bluetooth entre móvil, reloj inteligente y auriculares inalámbricos.",
    lan_title: "LAN / WLAN (Local Area Network)",
    lan_sub: "Red de Área Local Cableada / Inalámbrica",
    lan_desc: "Espacio delimitado como una casa, laboratorio u oficina (hasta 100 m por segmento de cable).",
    lan_example: "Red doméstica Wi-Fi o red interna conmutada de oficina para compartir impresoras e Internet.",
    can_title: "CAN (Campus Area Network)",
    can_sub: "Red de Área de Campus",
    can_desc: "Conjunto contiguo de edificios dentro de un radio de 1 a 5 km, interconectados mediante troncales de alta velocidad.",
    can_example: "Universidad, complejo hospitalario o parque industrial con múltiples facultades y laboratorios enlazados.",
    man_title: "MAN (Metropolitan Area Network)",
    man_sub: "Red de Área Metropolitana",
    man_desc: "Una ciudad, municipio o área metropolitana completa (hasta 50 km) mediante anillos ópticos.",
    man_example: "Red municipal de fibra óptica, sistemas de cámaras de seguridad urbana o televisión por cable.",
    wan_title: "WAN (Wide Area Network)",
    wan_sub: "Red de Área Amplia",
    wan_desc: "Cobertura masiva a nivel de países o continentes mediante telecomunicaciones públicas y privadas.",
    wan_example: "Interconexión de sucursales bancarias nacionales, corporaciones multinacionales y la red Internet.",
    gan_title: "GAN (Global Area Network)",
    gan_sub: "Red de Área Global",
    gan_desc: "Escala planetaria completa. Red global sin límites fronterizos que une todas las redes terrestres y espaciales.",
    gan_example: "Redes de constelaciones satelitales en órbita baja (Starlink, OneWeb), GPS y cables submarinos transoceánicos.",

    // Simulador Ping
    nav_simulator: "Simulador Ping",
    sim_title: "Simulador Interactivo de Ping & Tránsito de Paquetes",
    sim_desc: "Visualiza en tiempo real cómo viaja un paquete ICMP (Echo Request & Reply) a través de los componentes físicos: desde la tarjeta NIC del host, pasando por el Switch (Capa 2) y Router (Capa 3), hasta el servidor de destino.",
    sim_lbl_source: "Host de Origen:",
    sim_lbl_target: "Destino:",
    sim_btn_ping: "Enviar Ping ICMP",
    sim_btn_reset: "Reiniciar",
    sim_l2_badge: "Capa 2 (MAC Table)",
    sim_l3_badge: "Capa 3 (Routing Table)",
    sim_term_title: "Monitor de Tráfico de Red (Wireshark / CLI Ping Log)",
    sim_status_ready: "LISTO",
    insp_l2_title: "Capa 2 - Trama Ethernet (MAC)",
    insp_l3_title: "Capa 3 - Paquete IP (Protocolo 1 ICMP)",
    insp_stat_title: "Métricas de Conectividad",
    lang_select_title: "Seleccionar Idioma",
    footer_text: "NVISION"
  },
  en: {
    badge_hero: "Network Structure",
    hero_title: "Computer Architecture and Evolution",
    hero_desc: "An interactive baseline designed to explore the history, hardware components, and networking foundation of computers.",
    btn_timeline: "Timeline",
    btn_components: "View Components",
    btn_see_full_history: "View full history and pioneers",
    btn_hide_full_history: "Hide full history",
    badge_origin: "Foundational Historic Milestone",
    heading_how_created: "How and why was ENIAC born?",
    text_eniac_history_1: "During World War II, the U.S. Army faced a critical need to quickly and accurately calculate complex ballistic firing tables for heavy artillery. In 1943, the Army Ballistic Research Laboratory secretly funded the project at the Moore School of Electrical Engineering at the University of Pennsylvania under the code name Project PX.",
    text_eniac_history_2: "Formally completed in 1945 and revealed to the public in February 1946, ENIAC (Electronic Numerical Integrator and Computer) weighed over 27 tons, occupied 167 m², consumed 150 kW of power, and featured more than 17,468 vacuum tubes, 7,200 crystal diodes, and 5 million hand-soldered joints.",
    heading_pioneers: "Key Pioneers and Creators",
    role_mauchly: "Physicist and Principal Conceptual Designer",
    desc_mauchly: "Conceived the core electronic architecture, realizing that vacuum tube circuits could perform arithmetic operations at speeds inconceivable for mechanical relays.",
    role_eckert: "Chief Electrical Engineer",
    desc_eckert: "The engineering mastermind behind hardware reliability. He designed circuits that prevented thousands of vacuum tubes from failing constantly.",
    pioneers_programmers_title: "The 6 Pioneer Programmers of ENIAC",
    role_programmers: "Kay McNulty, Betty Jennings, Betty Snyder, Marlyn Wescoff, Ruth Lichterman, and Frances Bilas",
    desc_programmers: "They programmed ENIAC without programming languages or operating systems: routing patch cables, configuring switches, and crafting logic diagrams by hand.",
    role_von_neumann: "Mathematical Consultant",
    desc_von_neumann: "Joined as a consultant and, drawing from ENIAC insights, formalized in 1945 the stored-program concept (Von Neumann Architecture) underlying modern computers.",
    heading_legacy: "Technological Impact and Legacy",
    text_eniac_legacy: "ENIAC proved to the world that high-speed electronic calculation was viable. While programs were configured with manual patch cords, it slashed ballistic calculation times from 20 hours to just 30 seconds, launching the modern digital age.",
    nav_history: "History",
    nav_components: "Components",
    nav_network: "Hardware & Networks",
    nav_glossary: "Glossary",
    nav_lab: "Lab",
    nav_grp_hardware: "Hardware",
    nav_back: "Back",
    nav_grp_networks: "Networks",
    nav_grp_resources: "Resources",

    // History
    hist_title: "Historical Computers (Pre-1980s)",
    hist_desc: "Pioneering milestones in computing that paved the way for networking and modern personal computing.",
    eniac_title: "ENIAC - General-Purpose Electronic Computer",
    eniac_desc: "Occupied an entire room and used over 17,000 vacuum tubes. Key for ballistic trajectories and scientific calculation.",
    ibm7090_title: "IBM 7090 - Transistorized Mainframe System",
    ibm7090_desc: "Replaced fragile vacuum tubes with solid-state transistors, multiplying computing speeds by 6 and saving energy.",
    altair_title: "Altair 8800 - First Commercial Microcomputer",
    altair_desc: "Powered by the Intel 8080 CPU. Marked the birth of microcomputer software and the dawn of personal computing.",
    apple2_title: "Apple II - Integrated Personal Microcomputer",
    apple2_desc: "One of the first mass-produced microcomputers with integrated keyboard, color graphics, and expansion slots.",

    // Components
    comp_title: "Computer Components",
    comp_desc: "The essential hardware building blocks that process instructions, run software, and communicate across networks.",
    mb_title: "Motherboard",
    mb_desc: "The central circuit board that bridges the CPU, memory modules, network adapters, and permanent storage drives.",
    mb_sub: "Connectivity & System Buses",
    cpu_title: "Central Processing Unit (CPU)",
    cpu_desc: "The computer's brain tasked with executing instructions, running logic calculations, and managing hardware peripherals.",
    cpu_sub: "Core Execution Engine",
    ram_title: "RAM Memory",
    ram_desc: "Ultra fast temporary storage where active programs, operating system tasks, and network buffers reside.",
    ram_sub: "Random Access Memory",
    storage_title: "Storage Drives (SSD / HDD)",
    storage_desc: "Non-volatile memory where the operating system, network drivers, user data, and service files are preserved.",
    storage_sub: "Persistent Storage",
    nic_title: "Network Interface Card (NIC)",
    nic_desc: "Critical hardware for network structure that links the computer to local Ethernet LAN or wireless Wi-Fi.",
    nic_sub: "LAN / WLAN Interface",
    psu_title: "Power Supply Unit (PSU)",
    psu_desc: "Converts household AC power into regulated low-voltage DC power to safely feed all hardware components.",
    psu_sub: "Clean Power Distribution",
    cooling_title: "Liquid Cooling (AIO Cooler)",
    cooling_desc: "Dissipates extreme heat generated by high-performance CPUs using a closed-loop liquid coolant circuit, radiator, and high static pressure fans.",
    cooling_sub: "Thermal Dissipation & Thermal Control",
    caption_cooling: "All-in-one (AIO) closed-loop liquid cooling system with an RGB pump block mounted to the CPU socket and dual-fan radiator.",
    gpu_title: "Graphics Processing Unit (GPU)",
    gpu_desc: "Dedicated high-performance processing hardware engineered for hardware-accelerated 3D rendering, machine learning, and parallel visual computation.",
    gpu_sub: "Parallel Graphics Processing",
    caption_gpu: "Dedicated PCIe graphics card featuring a robust heatsink assembly, axial fans, and ultra-fast dedicated VRAM for visual workloads.",
    optical_title: "Optical Disc Drive (ODD)",
    optical_desc: "Removable storage device utilizing infrared or blue laser diodes to read and record data onto compact discs, DVDs, and Blu-ray media.",
    optical_sub: "Removable Media & Optical Laser",
    caption_optical: "SATA optical disc drive featuring a front-loading motorized tray, laser lens assembly, and spindle motor for physical offline media.",

    // Hardware & Networks
    net_title: "From Hardware to Network",
    net_desc: "How physical host hardware interfaces with local area network (LAN) infrastructures.",
    mac_title: "MAC Address (Hardware Address)",
    mac_desc: "A unique 48-bit physical identifier permanently stored in the NIC ROM used at the Data Link Layer.",
    eth_title: "Physical Ports and Connectivity",
    eth_desc: "RJ-45 interfaces for twisted pair Ethernet cables and wireless RF adapters interconnected through the PCIe bus.",
    flow_title: "Host Data Flow Architecture",
    flow_desc: "Data packets stream from RAM buffers, undergo CPU processing, and are dispatched to the NIC controller for physical signal modulation.",

    // Network Topologies
    nav_topologies: "Topologies",
    topol_title: "Network Topologies",
    topol_desc: "The physical and logical layout that defines how nodes, devices, and transmission links are interconnected in a telecommunications infrastructure.",
    lbl_typical_use: "Common use:",

    star_title: "Star Topology",
    star_badge: "Centralized Hub // Modern LAN Standard",
    star_desc: "Every node connects individually to a central switch or hub. If a single cable or host fails, the rest of the network continues operating without interruption.",
    star_pro: "Easy to troubleshoot and add new nodes without disrupting ongoing network traffic.",
    star_con: "Single point of failure: if the central switch goes down, the entire network disconnects.",
    star_use: "Modern Ethernet LANs, corporate office networks, and home Wi-Fi routers.",

    bus_title: "Bus Topology",
    bus_badge: "Shared Channel // Backbone Line",
    bus_desc: "All devices connect to a single shared backbone cable. Requires terminating resistors at both ends to absorb electrical signals and eliminate signal reflections.",
    bus_pro: "Economical setup costs and low physical cabling consumption.",
    bus_con: "A single break in the main backbone breaks the entire network (prone to packet collisions).",
    bus_use: "Automotive CAN bus systems, industrial sensors, and legacy 10BASE2 Ethernet.",

    ring_title: "Ring Topology",
    ring_badge: "Closed Loop // Token Passing",
    ring_desc: "Each host connects to two adjacent devices, forming a circular pathway. Data travels sequentially in a single direction governed by a logical token to avoid collisions.",
    ring_pro: "Deterministic traffic flow without collisions; steady performance under heavy loads.",
    ring_con: "A single workstation failure or break halts the entire ring transmission loop.",
    ring_use: "Metropolitan fiber optic rings (FDDI, SONET/SDH) and legacy Token Ring networks.",

    mesh_title: "Mesh Topology",
    mesh_badge: "Full Redundancy // High Availability",
    mesh_desc: "Each node maintains dedicated point-to-point links to several or all other nodes in the network, providing multiple redundant paths for packet routing.",
    mesh_pro: "Maximum fault tolerance: dynamic self-healing redirects traffic if a link is severed.",
    mesh_con: "High cost of physical cabling, multiple NIC ports, and complex routing overhead.",
    mesh_use: "Internet Tier-1 backbone routers, enterprise data centers, and modern home Wi-Fi mesh.",

    tree_title: "Tree Topology",
    tree_badge: "Hierarchical Architecture // Multilevel",
    tree_desc: "Arranges devices in structured hierarchical tiers (Core, Distribution, and Access). It consists of groups of star networks interconnected via a root backbone switch.",
    tree_pro: "Highly scalable, simplifies subnet segmentation and departmental policy enforcement.",
    tree_con: "If the root or core switch fails, subordinate branch networks lose inter-communication.",
    tree_use: "University campus backbones, multi-story office buildings, and cable TV networks.",

    hybrid_title: "Hybrid Topology",
    hybrid_badge: "Adaptive Combination // Modular Design",
    hybrid_desc: "Integrates two or more distinct topologies (e.g., star-ring or star-bus) within the same network. Adapts the physical topology to the site's unique architectural constraints.",
    hybrid_pro: "Maximum flexibility: optimizes reliability and budget across diverse departmental areas.",
    hybrid_con: "Complex configuration and maintenance; requires high-end managed switches and routers.",
    hybrid_use: "Multinational corporations, banking networks, and hybrid cloud-to-on-prem architectures.",

    // Glossary
    glos_title: "Technical Glossary (Networks & Hardware)",
    glos_desc: "Core English terminology essential for computer architecture and network engineering.",
    term_throughput: "Throughput",
    desc_throughput: "Actual amount of data successfully transferred across a network link within a specific timeframe.",
    term_bandwidth: "Bandwidth",
    desc_bandwidth: "Theoretical maximum transmission capacity of a network communication channel measured in bps.",
    term_nic: "NIC (Network Interface Card)",
    desc_nic: "Dedicated expansion card or integrated chipset providing physical and logical access to network media.",
    term_packet: "Packet",
    desc_packet: "A structured unit of data formatted with headers containing source, destination, and payload.",

    // Lab
    lab_title: "Innovation Lab & Expansions",
    lab_desc: "Experimental modules prepared for team milestones and advanced presentations.",
    model3d_title: "3D PC Case Simulation",
    model3d_desc: "Reserved space to integrate Three.js or WebGL models to inspect and disassemble a virtual PC tower.",
    model3d_wait: "3D model placeholder (Three.js / WebGL)",
    ps_title: "Hardware Diagnostics (PowerShell)",
    ps_desc: "Native Windows code to inspect the physical hardware specifications during lab sessions:",
    copy_code: "Copy",
    copied_code: "Copied!",

    // Network Scope Classification (Table and Cards BAN to GAN)
    nav_scope: "Network Scopes",
    scope_title: "Network Types by Geographic Scope",
    scope_desc: "Comprehensive hierarchy of computer networks ordered ascending by physical spatial scale, range, and real deployments.",
    lbl_example: "Common use case:",
    th_sigla: "Acronym",
    th_fullname: "Full Name",
    th_coverage: "Typical Coverage",
    th_usecase: "Common Use Case",
    tbl_ban_name: "Body Area Network",
    tbl_ban_cov: "< 1 meter",
    tbl_ban_use: "Medical sensors and on-body health monitors",
    tbl_pan_name: "Personal Area Network",
    tbl_pan_cov: "~1 to 10 meters",
    tbl_pan_use: "Bluetooth pairing between mobile, watch, and earbuds",
    tbl_lan_name: "Local / Wireless LAN",
    tbl_lan_cov: "Building, home (~100 m)",
    tbl_lan_use: "Home Wi-Fi or office switched Ethernet network",
    tbl_can_name: "Campus Area Network",
    tbl_can_cov: "Cluster of buildings (1 to 5 km)",
    tbl_can_use: "University, hospital campus, or industrial park",
    tbl_man_name: "Metropolitan Area Network",
    tbl_man_cov: "City or municipality (up to 50 km)",
    tbl_man_use: "Municipal fiber optic ring or cable television network",
    tbl_wan_name: "Wide Area Network",
    tbl_wan_cov: "Country, continent, or global",
    tbl_wan_use: "Interconnecting bank branches; global Internet",
    tbl_gan_name: "Global Area Network",
    tbl_gan_cov: "Planetary",
    tbl_gan_use: "Satellite constellations (Starlink) and submarine cables",
    ban_title: "BAN (Body Area Network)",
    ban_sub: "Body Area Network",
    ban_desc: "Under 1 meter spanning the human body. Interconnects wearable or implantable biosensors with medical controllers.",
    ban_example: "Wireless biosensors, smart pacemakers, and continuous glucose/ECG telemetry devices.",
    pan_title: "PAN (Personal Area Network)",
    pan_sub: "Personal Area Network",
    pan_desc: "Around 1 to 10 meters centered around a person. Connects localized consumer peripherals with smartphones.",
    pan_example: "Bluetooth communication across smartphones, smartwatches, and wireless audio headsets.",
    lan_title: "LAN / WLAN (Local Area Network)",
    lan_sub: "Wired / Wireless Local Area Network",
    lan_desc: "Bounded area such as an apartment, office floor, or computing lab (up to 100 meters per cable span).",
    lan_example: "Residential Wi-Fi router or high-speed Gigabit office switch infrastructure.",
    can_title: "CAN (Campus Area Network)",
    can_sub: "Campus Area Network",
    can_desc: "A contiguous group of buildings spanning a 1 to 5 km radius linked through high-speed fiber backbones.",
    can_example: "A university campus, hospital complex, or industrial manufacturing facility.",
    man_title: "MAN (Metropolitan Area Network)",
    man_sub: "Metropolitan Area Network",
    man_desc: "An entire municipality, urban core, or metro district (up to 50 km) linked by metropolitan optical rings.",
    man_example: "Municipal government fiber networks, city traffic sensor grids, or regional cable TV providers.",
    wan_title: "WAN (Wide Area Network)",
    wan_sub: "Wide Area Network",
    wan_desc: "Long-haul network infrastructure connecting branch offices and data centers across nations and continents.",
    wan_example: "National banking branch VPNs, multinational corporate backbones, and the Internet.",
    gan_title: "GAN (Global Area Network)",
    gan_sub: "Global Area Network",
    gan_desc: "Unbounded planetary coverage unifying terrestrial fiber infrastructure with orbital satellite networks.",
    gan_example: "Low Earth orbit satellite constellations (Starlink, OneWeb), GPS arrays, and transoceanic undersea cables.",

    // Simulator Ping
    nav_simulator: "Ping Simulator",
    sim_title: "Interactive Ping & Packet Routing Simulator",
    sim_desc: "Real-time visual tracer of ICMP packets (Echo Request & Reply) flowing across physical networking gear: from host NICs, traversing Layer-2 Switches and Layer-3 Routers, to target cloud servers.",
    sim_lbl_source: "Source Host:",
    sim_lbl_target: "Destination:",
    sim_btn_ping: "Send ICMP Ping",
    sim_btn_reset: "Reset",
    sim_l2_badge: "Layer 2 (MAC Table)",
    sim_l3_badge: "Layer 3 (Routing Table)",
    sim_term_title: "Network Traffic Monitor (Wireshark / Ping CLI)",
    sim_status_ready: "READY",
    insp_l2_title: "Layer 2 - Ethernet Frame (MAC)",
    insp_l3_title: "Layer 3 - IP Packet (Protocol 1 ICMP)",
    insp_stat_title: "Connectivity Metrics",
    lang_select_title: "Select Language",
    footer_text: "NVISION"
  }
};

let currentLang = localStorage.getItem('user_lang') || 'es';

function setLanguage(lang) {
  if (lang !== 'es' && lang !== 'en') return;
  currentLang = lang;
  localStorage.setItem('user_lang', currentLang);
  applyLanguage(currentLang);
  closeLangDropdown();
}

function applyLanguage(lang) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  const langLabel = document.getElementById('lang-label');
  if (langLabel) {
    langLabel.textContent = lang.toUpperCase();
  }

  // Actualizar estado activo en el menú desplegable
  const dropdownItems = document.querySelectorAll('.lang-dropdown-item');
  dropdownItems.forEach((item) => {
    if (item.getAttribute('data-lang') === lang) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  document.documentElement.lang = lang;
}

function closeLangDropdown() {
  const wrapper = document.getElementById('lang-dropdown-wrapper');
  const toggleBtn = document.getElementById('lang-toggle');
  if (wrapper) wrapper.classList.remove('open');
  if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
}

function setupLanguageDropdown() {
  const wrapper = document.getElementById('lang-dropdown-wrapper');
  const toggleBtn = document.getElementById('lang-toggle');
  const menu = document.getElementById('lang-dropdown-menu');
  if (!wrapper || !toggleBtn || !menu) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = wrapper.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  const items = menu.querySelectorAll('.lang-dropdown-item');
  items.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const selected = item.getAttribute('data-lang');
      if (selected) {
        setLanguage(selected);
      }
    });
  });

  // Cerrar al hacer clic fuera del dropdown
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      closeLangDropdown();
    }
  });

  // Cerrar al presionar la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLangDropdown();
    }
  });
}

function setupCopyButton() {
  const copyBtn = document.getElementById('copy-code-btn');
  const codeElem = document.getElementById('ps-code');
  if (!copyBtn || !codeElem) return;

  copyBtn.addEventListener('click', () => {
    const textToCopy = codeElem.textContent.trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
      copyBtn.textContent = translations[currentLang].copied_code;
      setTimeout(() => {
        copyBtn.textContent = translations[currentLang].copy_code;
      }, 2000);
    });
  });
}

function setupMobileMenu() {
  const menuBtn = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!menuBtn || !navMenu) return;

  menuBtn.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('is-active');
    navMenu.classList.remove('submenu-active');
    navMenu.querySelectorAll('.nav-item-dropdown').forEach((dropdown) => dropdown.classList.remove('is-open'));
    menuBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    menuBtn.innerHTML = isActive ? '<span class="menu-icon-inner mono-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>' : '<span class="menu-icon-inner mono-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></span>';
  });

  const links = navMenu.querySelectorAll('a');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('is-active')) {
        navMenu.classList.remove('is-active');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '<span class="menu-icon-inner mono-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></span>';
      }
    });
  });
}

function setupSectionNavigation() {
  const cleanUrl = () => window.location.pathname + window.location.search;

  const scrollToSection = (targetId) => {
    const target = document.getElementById(targetId);
    if (!target) return false;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', cleanUrl());
    return true;
  };

  const pendingTarget = sessionStorage.getItem('nvision_pending_section');
  if (pendingTarget) {
    sessionStorage.removeItem('nvision_pending_section');
    window.requestAnimationFrame(() => scrollToSection(pendingTarget));
  }

  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href) return;

      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      const targetId = destination.hash.slice(1);
      if (!targetId) {
        if (destination.pathname !== window.location.pathname) return;
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.replaceState(null, '', cleanUrl());
        return;
      }

      if (destination.pathname === window.location.pathname) {
        if (scrollToSection(targetId)) event.preventDefault();
        return;
      }

      event.preventDefault();
      sessionStorage.setItem('nvision_pending_section', targetId);
      window.location.assign(destination.pathname + destination.search);
    });
  });
}

function setupNavigationDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-item-dropdown');
  const navLinks = document.querySelector('.nav-links');

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      if (window.matchMedia('(min-width: 821px)').matches) {
        dropdown.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        return;
      }

      const willOpen = !dropdown.classList.contains('is-open');
      dropdowns.forEach((item) => {
        item.classList.remove('is-open');
        const itemTrigger = item.querySelector('.nav-dropdown-trigger');
        if (itemTrigger) itemTrigger.setAttribute('aria-expanded', 'false');
      });
      dropdown.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
      if (navLinks) navLinks.classList.toggle('submenu-active', willOpen);
    });

    const backButton = dropdown.querySelector('.nav-mobile-back button');
    if (backButton) {
      backButton.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdown.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        if (navLinks) navLinks.classList.remove('submenu-active');
      });
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target instanceof Node && !event.target.closest('.nav-item-dropdown')) {
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove('is-open');
        const dropdownTrigger = dropdown.querySelector('.nav-dropdown-trigger');
        if (dropdownTrigger) dropdownTrigger.setAttribute('aria-expanded', 'false');
      });
      if (navLinks) navLinks.classList.remove('submenu-active');
    }
  });
}

function setupThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  const savedTheme = localStorage.getItem('user_theme');
  const currentTheme = savedTheme || 'dark';
  
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      const sunSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
      const moonSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
      themeIcon.innerHTML = theme === 'light' ? sunSvg : moonSvg;
    }
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('title', theme === 'light' ? 'Cambiar a modo oscuro / Switch to dark mode' : 'Cambiar a modo claro / Switch to light mode');
      themeToggleBtn.setAttribute('aria-label', theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    }
  }

  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const nextTheme = activeTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('user_theme', nextTheme);
      applyTheme(nextTheme);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupThemeToggle();
  setupLanguageDropdown();
  setupCopyButton();
  setupMobileMenu();
  setupSectionNavigation();
  setupNavigationDropdowns();
  setupHistoryToggle();
  setupComponentToggles();
  setupNetworkSimulator();
  applyLanguage(currentLang);
});



function setupHistoryToggle() {
  const historyButtons = document.querySelectorAll('.btn-expand-history');
  historyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      let targetId = btn.getAttribute('data-target');
      if (!targetId && btn.id === 'toggle-eniac-btn') {
        targetId = 'eniac-detail-box';
      }
      const detailPanel = document.getElementById(targetId);
      if (!detailPanel) return;

      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const nextState = !isExpanded;

      btn.setAttribute('aria-expanded', String(nextState));
      detailPanel.hidden = !nextState;

      const textSpan = btn.querySelector('.btn-expand-text');
      if (textSpan) {
        const key = nextState ? 'btn_hide_full_history' : 'btn_see_full_history';
        textSpan.setAttribute('data-i18n', key);
        if (translations[currentLang] && translations[currentLang][key]) {
          textSpan.textContent = translations[currentLang][key];
        }
      }

      if (nextState) {
        detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
}

function setupComponentToggles() {
  const compButtons = document.querySelectorAll('.btn-component-expand');
  compButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetBox = document.getElementById(targetId);
      if (!targetBox) return;

      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const nextState = !isExpanded;

      btn.setAttribute('aria-expanded', String(nextState));
      targetBox.hidden = !nextState;

      const textSpan = btn.querySelector('.comp-btn-text');
      if (textSpan) {
        const key = nextState ? 'btn_hide_component_img' : 'btn_view_component_img';
        textSpan.setAttribute('data-i18n', key);
        if (translations[currentLang] && translations[currentLang][key]) {
          textSpan.textContent = translations[currentLang][key];
        }
      }
    });
  });
}

/* =========================================================
   LÓGICA DEL SIMULADOR INTERACTIVO DE PING & TRÁNSITO ICMP
   ========================================================= */

function setupNetworkSimulator() {
  const startBtn = document.getElementById('sim-start-btn');
  const resetBtn = document.getElementById('sim-reset-btn');
  const sourceSelect = document.getElementById('sim-source-select');
  const targetSelect = document.getElementById('sim-target-select');
  const packet = document.getElementById('sim-packet');
  const packetText = document.getElementById('packet-type-text');
  const consoleBody = document.getElementById('sim-console');
  const statusTag = document.getElementById('sim-status-tag');
  const inspL2 = document.getElementById('insp-l2-info');
  const inspL3 = document.getElementById('insp-l3-info');
  const inspStat = document.getElementById('insp-stat-info');
  const stage = document.getElementById('sim-stage');

  if (!startBtn || !stage) return;

  const devices = {
    pc1: { id: 'node-pc1', ip: '192.168.1.10', mac: '00:1A:2B:3C:4D:01', name: 'PC 1' },
    pc2: { id: 'node-pc2', ip: '192.168.1.20', mac: '00:1A:2B:3C:4D:02', name: 'PC 2' },
    switch: { id: 'node-switch', ip: 'L2 Switch', mac: 'CAM Table', name: 'Switch LAN' },
    router: { id: 'node-router', ip: '192.168.1.1', mac: '00:00:5E:00:53:01', name: 'Gateway Router' },
    server: { id: 'node-server', ip: '10.0.0.80', mac: 'AA:BB:CC:DD:EE:80', name: 'Web Server' }
  };

  let isRunning = false;
  let currentDevice = null;

  function log(msg, type = 'info') {
    if (!consoleBody) return;
    const p = document.createElement('p');
    p.className = `console-line ${type}`;
    p.textContent = msg;
    consoleBody.appendChild(p);
    consoleBody.scrollTop = consoleBody.scrollHeight;
  }

  function getDeviceCenter(devKey) {
    const el = document.getElementById(devices[devKey].id);
    if (!el || !stage) return { x: 50, y: 50 };
    const stageRect = stage.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const x = elRect.left - stageRect.left + elRect.width / 2;
    const y = elRect.top - stageRect.top + elRect.height / 2;
    return { x, y };
  }

  function movePacketTo(devKey, callback, duration = 750) {
    const coords = getDeviceCenter(devKey);
    setActiveRoute(currentDevice, devKey);
    positionPacket(coords);
    currentDevice = devKey;
    setTimeout(callback, duration);
  }

  function positionPacket(coords) {
    const packetWidth = packet.offsetWidth;
    const packetHeight = packet.offsetHeight;
    const maxX = Math.max(4, stage.clientWidth - packetWidth - 4);
    const x = Math.min(Math.max(4, coords.x - packetWidth / 2), maxX);
    const y = Math.max(4, coords.y - packetHeight - 8);
    packet.style.transform = `translate(${x}px, ${y}px)`;
  }

  function setActiveRoute(fromKey, toKey) {
    document.querySelectorAll('.sim-wire-glow').forEach(wire => wire.classList.remove('pulse'));
    stage.classList.toggle('reply-mode', packet.classList.contains('reply'));
    const route = [fromKey, toKey].sort().join('-');
    const wireByRoute = {
      'pc1-switch': 'wire-active-pc1',
      'pc2-switch': 'wire-active-pc2',
      'router-switch': 'wire-active-sr',
      'router-server': 'wire-active-dest'
    };
    const wire = document.getElementById(wireByRoute[route]);
    if (wire) wire.classList.add('pulse');
  }

  function highlightDevice(devKey) {
    document.querySelectorAll('.sim-device').forEach(d => {
      d.classList.remove('processing-packet', 'processing-reply', 'active-source', 'active-target');
    });
    const el = document.getElementById(devices[devKey].id);
    if (el) {
      el.classList.add(packet.classList.contains('reply') ? 'processing-reply' : 'processing-packet');
    }
  }

  function updateSelectionsUI() {
    document.querySelectorAll('.sim-device').forEach(d => {
      d.classList.remove('active-source', 'active-target');
    });
    const srcEl = document.getElementById(devices[sourceSelect.value]?.id);
    const dstEl = document.getElementById(devices[targetSelect.value]?.id);
    if (srcEl) srcEl.classList.add('active-source');
    if (dstEl) dstEl.classList.add('active-target');
  }

  sourceSelect.addEventListener('change', updateSelectionsUI);
  targetSelect.addEventListener('change', updateSelectionsUI);
  updateSelectionsUI();

  resetBtn.addEventListener('click', () => {
    isRunning = false;
    startBtn.disabled = false;
    packet.hidden = true;
    packet.className = 'packet-traveler';
    currentDevice = null;
    setActiveRoute(null, null);
    document.querySelectorAll('.sim-device').forEach(d => {
      d.classList.remove('processing-packet', 'processing-reply');
    });
    consoleBody.innerHTML = '<p class="console-line info">[SISTEMA] Simulador reiniciado. Listo para nueva prueba.</p>';
    statusTag.textContent = translations[currentLang]?.sim_status_ready || 'LISTO';
    statusTag.className = 'sim-status-idle';
    inspL2.textContent = 'Origen: -- | Destino: --';
    inspL3.textContent = 'IP Src: -- | IP Dst: -- | TTL: --';
    inspStat.textContent = 'RTT: -- ms | Pérdida: 0% | Estado: Esperando';
    updateSelectionsUI();
  });

  startBtn.addEventListener('click', () => {
    const src = sourceSelect.value;
    const dst = targetSelect.value;

    if (src === dst) {
      log('[ERROR] El host de origen y el de destino no pueden ser el mismo.', 'info');
      return;
    }

    if (isRunning) return;
    isRunning = true;
    startBtn.disabled = true;
    statusTag.textContent = 'TRANSMITIENDO...';
    statusTag.className = 'sim-status-running';
    consoleBody.innerHTML = '';

    const srcDev = devices[src];
    const dstDev = devices[dst];

    log(`[ICMP INICIO] Iniciando ping desde ${srcDev.name} (${srcDev.ip}) hacia ${dstDev.name} (${dstDev.ip})...`, 'req');

    // Posición inicial del paquete
    const initPos = getDeviceCenter(src);
    packet.hidden = false;
    packet.className = 'packet-traveler';
    currentDevice = src;
    setActiveRoute(null, null);
    packetText.textContent = 'Enviando datos';
    positionPacket(initPos);

    inspL2.textContent = `Trama: ${srcDev.mac} -> ${srcDev.ip.startsWith('192.168.1') && dstDev.ip.startsWith('10.0.0') ? devices.router.mac : dstDev.mac}`;
    inspL3.textContent = `IP Src: ${srcDev.ip} -> IP Dst: ${dstDev.ip} | Protocol: 1 (ICMP) | TTL: 64`;
    inspStat.textContent = 'Calculando latencia...';

    // RUTA DE IDA
    const isSameSubnet = dst === 'pc2';

    // Paso 1: Salida del Host a Switch
    setTimeout(() => {
      log(`[HOST NIC] ${srcDev.name} encapsula paquete IP en trama 802.3 Ethernet y lo envía por par trenzado al Switch LAN.`, 'l2');
      highlightDevice(src);
      movePacketTo('switch', () => {
        highlightDevice('switch');
        log(`[SWITCH] Lee encabezado Capa 2: Puerto asociado a MAC destino detectado en CAM Table.`, 'l2');

        if (isSameSubnet) {
          // Destino local: Switch entrega directo a PC2
          setTimeout(() => {
            movePacketTo(dst, () => {
              highlightDevice(dst);
              log(`[DESTINO] ${dstDev.name} recibe los datos correctamente.`, 'rep');
              startReturnTrip(srcDev, dstDev, true);
            });
          }, 600);
        } else {
          // Destino WAN: Switch entrega al Router Gateway
          setTimeout(() => {
            log(`[SWITCH] Destino está fuera de la subred local (192.168.1.0/24). Reenvía trama a la MAC de la Gateway (Router).`, 'l2');
            movePacketTo('router', () => {
              highlightDevice('router');
              log(`[ROUTER L3] Desencapsula trama L2. Consulta tabla de rutas: IP 10.0.0.80 está en la interfaz WAN. Decrementa TTL a 63.`, 'l3');
              inspL3.textContent = `IP Src: ${srcDev.ip} -> IP Dst: ${dstDev.ip} | Protocol: 1 (ICMP) | TTL: 63`;

              // Router a Servidor
              setTimeout(() => {
                log(`[ROUTER -> WAN] Transmite paquete a través de enlace punto a punto hacia ${dstDev.name}.`, 'l3');
                movePacketTo('server', () => {
                  highlightDevice('server');
                  log(`[WEB SERVER] El servidor recibe los datos y prepara la respuesta.`, 'rep');
                  startReturnTrip(srcDev, dstDev, false);
                });
              }, 650);
            });
          }, 650);
        }
      });
    }, 400);

    function startReturnTrip(srcD, dstD, isLocal) {
      setTimeout(() => {
        packet.classList.add('reply');
        packetText.textContent = 'Datos recibidos';
        log(`[ICMP RESPUESTA] Enviando respuesta desde ${dstD.ip} de vuelta a ${srcD.ip}...`, 'rep');
        inspL2.textContent = `Trama: ${dstD.mac} -> ${srcD.mac}`;

        if (isLocal) {
          movePacketTo('switch', () => {
            highlightDevice('switch');
            log(`[SWITCH] Conmuta respuesta directamente al puerto de ${srcD.name}.`, 'l2');
            setTimeout(() => {
              movePacketTo(src, () => finishPing(true));
            }, 600);
          });
        } else {
          movePacketTo('router', () => {
            highlightDevice('router');
            log(`[ROUTER] Enruta respuesta WAN de vuelta a subred LAN 192.168.1.0/24 hacia Switch.`, 'l3');
            setTimeout(() => {
              movePacketTo('switch', () => {
                highlightDevice('switch');
                log(`[SWITCH] Entrega Echo Reply final al puerto de ${srcD.name}.`, 'l2');
                setTimeout(() => {
                  movePacketTo(src, () => finishPing(false));
                }, 600);
              });
            }, 600);
          });
        }
      }, 700);
    }

    function finishPing(isLocal) {
      highlightDevice(src);
      const rtt = isLocal ? (Math.random() * 2 + 1).toFixed(2) : (Math.random() * 8 + 24).toFixed(2);
      log(`[ÉXITO] 64 bytes desde ${dstDev.ip}: icmp_seq=1 ttl=${isLocal ? 64 : 63} tiempo=${rtt} ms`, 'rep');
      log(`[RESUMEN] 1 paquetes transmitidos, 1 recibidos, 0% packet loss. Enlace verificado.`, 'info');
      inspStat.textContent = `RTT: ${rtt} ms | Pérdida: 0% | Estado: Conectado (OK)`;
      statusTag.textContent = 'COMPLETADO (100%)';
      statusTag.className = 'sim-status-idle';
      startBtn.disabled = false;
      isRunning = false;
      setTimeout(() => {
        document.querySelectorAll('.sim-device').forEach(d => {
          d.classList.remove('processing-packet', 'processing-reply');
        });
      }, 1000);
    }
  });
}