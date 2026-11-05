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
    nav_network: "Del Hardware a la Red",
    nav_glossary: "Glosario",
    nav_lab: "Laboratorio de Códigos",
    nav_ms: "Mantenimiento por software",
    nav_explorer_3d: "Explorador 3D del PC",
    nav_grp_hardware: "Hardware",
    nav_back: "Volver",
    nav_grp_networks: "Redes",
    nav_grp_resources: "Recursos",
    nav_grp_pc3d: "PC3D y más",
    nav_pc3d_viewer: "Visor 3D",
    nav_pc3d_parts: "Componentes y tipos",
    nav_pc3d_maintenance: "Mantenimiento del PC",
    nav_pc3d_malware: "Malware",
    
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
    switch3d_title: "El switch por dentro: cómo decide a dónde va cada trama",
    switch3d_desc: "Envía tramas entre los equipos y observa, paso a paso, cómo el switch aprende las direcciones MAC y decide por qué puerto sale cada trama. Compáralo con un hub y verás la diferencia.",
    switch3d_badge: "Laboratorio L2",
    swl_caption_idle: "Elige quién envía y quién recibe, y pulsa «Enviar trama». Mira cómo el switch va aprendiendo las MAC en su tabla.",
    swl_caption_hub_idle: "Modo HUB activado: envía una trama y compara qué pasa con lo que hace el switch.",
    swl_mode_switch: "Modo switch",
    swl_mode_hub: "Modo hub",
    swl_from: "Envía",
    swl_to: "Recibe",
    swl_send: "Enviar trama",
    swl_reset: "Borrar tabla MAC",
    swl_table_title: "Tabla MAC (lo que el switch ha aprendido)",
    swl_col_port: "Puerto",
    swl_col_mac: "MAC",
    swl_table_empty: "Vacía: todavía no aprende ninguna MAC.",
    swl_table_hub: "Un hub no tiene tabla MAC: no aprende nada.",
    swl_cap_send: "{from} envía una trama destinada a {to}.",
    swl_cap_enter: "La trama entra al switch por el puerto {port}.",
    swl_cap_learn: "El switch aprende: anota en su tabla que la MAC de {from} está en el puerto {port}.",
    swl_cap_lookup: "Ahora busca la MAC de {to} en su tabla…",
    swl_cap_forward: "¡La tiene, puerto {port}! Reenvía la trama SOLO por ese puerto: los demás equipos ni se enteran.",
    swl_cap_flood: "Todavía no conoce la MAC de {to}: envía la trama por TODOS los puertos (flooding) a ver quién responde.",
    swl_cap_reply: "Los demás la ignoran; solo {to} responde. Con su respuesta, el switch aprende también la MAC de {to}: puerto {port}.",
    swl_cap_done: "✔ Trama entregada a {to}. Y ojo a la tabla: la próxima vez entre estos dos equipos el envío será directo, sin flooding.",
    swl_cap_hub: "El hub no piensa ni aprende: repite la trama por TODOS los puertos, siempre.",
    swl_cap_hub_done: "Todos recibieron la trama aunque era solo para {to}: más tráfico y cero privacidad. Por eso los hubs desaparecieron y hoy todo es switch.",

    // Topologías de Redes
    nav_topologies: "Topologías",
    topol_title: "Topologías de Redes",
    nav_switch3d: "El switch por dentro",
    nav_wifi: "WiFi Avanzado",
    wifi_kicker: "Guía práctica · Redes inalámbricas",
    wifi_h1: "WiFi avanzado, explicado paso a paso",
    wifi_hero_p: "De la caja a una red rápida y segura: instala el módem/router, entra a su panel, cambia la clave, suma un repetidor y gana cobertura. Todo en orden y sin vueltas.",
    wifi_node_modem: "MÓDEM",
    wifi_node_repeater: "REPETIDOR",
    wifi_node_device: "EQUIPO",
    wifi_instal_title: "Instalar el módem/router",
    wifi_instal_sub: "El orden importa: primero la conexión física, después el panel de configuración.",
    wifi_c1_t: "Conecta y enciende",
    wifi_c1_p: "La instalación física es la mitad del trabajo. En orden:",
    wifi_c1_1: "Conecta el cable del proveedor (la fibra/ONT o el cable coaxial/DSL) al puerto de entrada del equipo.",
    wifi_c1_2: "Enciéndelo y espera unos 2 minutos: las luces de encendido e internet deben quedar fijas.",
    wifi_c1_3: "Conéctate por cable Ethernet si puedes; si no, entra al WiFi usando el nombre (SSID) y la clave impresos en la etiqueta del equipo.",
    wifi_c1_4: "Con esa conexión lista, ya puedes abrir el panel de configuración (siguiente tarjeta).",
    wifi_c2_t: "Entra al panel y cambia lo importante",
    wifi_c2_p: "El panel es el centro de control de tu red:",
    wifi_c2_1: "En el navegador escribe 192.168.1.1 (si no abre, prueba 192.168.0.1). El usuario y la clave del panel están en la etiqueta del equipo.",
    wifi_c2_2: "Cambia el nombre de la red (SSID) por uno reconocible, pero sin datos personales.",
    wifi_c2_3: "Pon una contraseña nueva y larga (más de 12 caracteres): es la llave de tu casa digital.",
    wifi_c2_4: "Seguridad en WPA2 o WPA3. Nunca dejes la red abierta ni con el viejo WEP.",
    wifi_c3_t: "Suma un repetidor y gana cobertura",
    wifi_c3_p: "Si el WiFi no llega a un cuarto, un repetidor recibe la señal y la reemite. La clave está en ubicarlo a mitad de camino, en un punto donde todavía llegue buena señal del módem (si lo pones donde ya no hay señal, repetirá... nada). Hay dos formas de enlazarlo:",
    wifi_m1_t: "Método WPS (el rápido)",
    wifi_m1_p: "Pulsa el botón WPS del módem y, dentro de 2 minutos, el del repetidor. Se enlazan solos y el repetidor copia tu misma red y clave.",
    wifi_m2_t: "Método manual (el que controlas)",
    wifi_m2_p: "Conéctate a la red temporal del repetidor, entra a su panel, elige tu WiFi de la lista, escribe la clave y guarda. Tarda más, pero ves cada paso.",
    wifi_c4_t: "2.4 GHz o 5 GHz: usa las dos bandas",
    wifi_c4_1: "2.4 GHz: llega más lejos y atraviesa paredes, pero es más lenta y se satura fácil.",
    wifi_c4_2: "5 GHz: mucho más rápida; ideal cerca del módem para jugar, estudiar y ver streaming.",
    wifi_c4_3: "Si el módem permite un solo nombre para ambas bandas, déjalo así: cada equipo elige la mejor solo.",
    wifi_c4_4: "En edificios con muchas redes, cambiar el canal ayuda: en 2.4 GHz usa 1, 6 u 11 para esquivar a los vecinos.",
    wifi_c5_t: "Dónde poner el módem",
    wifi_c5_p: "La ubicación vale más que muchos repetidores:",
    wifi_c5_1: "En un punto central y elevado de la casa; nunca en el piso ni dentro de un mueble cerrado.",
    wifi_c5_2: "Lejos de microondas, bases de teléfonos inalámbricos y objetos grandes de metal.",
    wifi_c5_3: "Un muro grueso o una pecera entre el módem y tú debilita la señal: a veces mover el equipo un metro lo arregla todo.",
    wifi_cl_t: "Lista de verificación final",
    wifi_cl_1: "Luces del módem fijas (encendido e internet)",
    wifi_cl_2: "SSID cambiado y contraseña nueva guardada",
    wifi_cl_3: "Seguridad en WPA2 o WPA3",
    wifi_cl_4: "Firmware del módem actualizado",
    wifi_cl_5: "Red de invitados activa para las visitas",
    wifi_cl_6: "Señal probada en todos los cuartos",
    wifi_cl_7: "Repetidor ubicado donde aún hay buena señal",
    wifi_cl_8: "Foto de la etiqueta del módem en el celular",
    wifi_warn_t: "Ojo con esto:",
    wifi_warn_p: "Nunca dejes el usuario y la clave de fábrica del panel (tipo admin/admin): es la primera combinación que prueba cualquier intruso. Cámbiala y guarda la nueva en un lugar seguro, lejos del alcance de las visitas.",
    wifi_faq_title: "Preguntas frecuentes",
    wifi_faq_sub: "Los tres problemas que le pasan a todo el mundo, resueltos.",
    wifi_f1_q: "El 192.168.1.1 no abre, ¿qué hago?",
    wifi_f1_p: "Confirma que estás conectado a ESE módem (por cable o a su WiFi) y prueba también 192.168.0.1. En el celular desactiva los datos móviles mientras configuras: a veces el teléfono se escapa por la red móvil y nunca toca el panel.",
    wifi_f2_q: "¿Por qué el WiFi llega débil a mi cuarto?",
    wifi_f2_p: "Distancia, muros y electrodomésticos se comen la señal. Sube el módem a un punto central y alto, y si aun así falta, pon el repetidor a mitad del camino (no dentro del cuarto sin señal, porque ahí no tiene qué repetir).",
    wifi_f3_q: "¿El WPS es seguro?",
    wifi_f3_p: "El botón físico WPS es práctico para enlazar el repetidor, pero el WPS por código PIN es vulnerable. Si tu panel lo permite, desactiva el WPS por PIN y deja solo el botón.",
    assistant_title: "Asistente NVISION",
    assistant_status: "Chat entrenado",
    assistant_welcome: "Pregúntame sobre el contenido del sitio. Si no sé algo, puedes enseñármelo en la pestaña Entrenar.",
    assistant_placeholder: "Escribe tu pregunta…",
    assistant_search: "Enviar",
    assistant_empty: "No encontré una coincidencia. Prueba con otra palabra clave.",
    assistant_open: "Abrir sección",
    assistant_tab_chat: "Chat",
    assistant_tab_train: "Entrenar",
    assistant_fallback: "Todavía no sé responder eso 🤔. Prueba con otras palabras, o enséñame la respuesta para que la próxima vez la sepa.",
    assistant_teach_title: "Enseñar una respuesta nueva",
    assistant_teach_q: "Formas de preguntarlo (una por línea)",
    assistant_teach_a: "Respuesta",
    assistant_teach_cat: "Categoría",
    assistant_save: "Guardar",
    assistant_cancel_edit: "Cancelar edición",
    assistant_edit_title: "Editar respuesta",
    assistant_stats_base: "respuestas base",
    assistant_stats_learned: "enseñadas por ti",
    assistant_test_title: "Probar al asistente",
    assistant_test_ph: "Escribe una pregunta para ver qué entiende",
    assistant_missed_title: "Preguntas sin respuesta",
    assistant_learned_title: "Lo que le has enseñado",
    assistant_backup_title: "Respaldo",
    assistant_export: "Exportar",
    assistant_import: "Importar",
    assistant_reset: "Borrar lo aprendido",
    assistant_saved_toast: "¡Aprendido! Ya conozco esta respuesta.",
    assistant_need_both: "Escribe al menos una pregunta y la respuesta.",
    assistant_thanks: "¡Gracias! 💚",
    assistant_teach_this: "Enséñame esta respuesta",
    assistant_up: "Me sirvió",
    assistant_down: "Mejorar",
    assistant_no_match: "Sin coincidencia clara",
    assistant_match: "Coincide con",
    assistant_missed_empty: "Aún no hay preguntas pendientes.",
    assistant_learned_empty: "Todavía no has enseñado nada.",
    assistant_teach_btn: "Enseñar",
    assistant_remove_btn: "Quitar",
    assistant_edit_btn: "Editar",
    assistant_delete_btn: "Borrar",
    assistant_confirm_delete: "¿Borrar esta respuesta?",
    assistant_confirm_reset: "¿Borrar todo lo que le has enseñado?",
    assistant_imported: "respuestas importadas",
    assistant_import_bad: "El respaldo no tiene un formato válido.",
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
    lab_title: "Laboratorio de Códigos",
    lab_desc: "Códigos listos para copiar y probar en tu propio equipo: abre PowerShell, pega el código y observa qué pasa.",
    model3d_title: "Simulación de Torre 3D",
    model3d_desc: "Espacio reservado para integrar Three.js o un visor 3D interactivo que permita rotar y desarmar una torre de PC virtual.",
    model3d_wait: "Modelo 3D en desarrollo (Three.js / WebGL)",
    ps_title: "Diagnóstico de Hardware (PowerShell)",
    ps_desc: "Código nativo en Windows para consultar los componentes reales del equipo en el que se ejecuta la práctica de laboratorio:",
    copy_code: "Copiar",
    copied_code: "¡Copiado!",
    code_ipmac_title: "Tu IP y tu MAC",
    code_ipmac_desc: "Muestra la dirección IP de tu equipo y la dirección física (MAC) de tu tarjeta de red: los dos datos que te identifican en la red.",
    code_ping_title: "¿Hay conexión? Haz ping",
    code_ping_desc: "Envía paquetes al servidor de Google (8.8.8.8). Si responde, tu conexión funciona; si todo se pierde, el problema está en tu red local.",
    code_arp_title: "¿Quién está en tu red?",
    code_arp_desc: "Lista los dispositivos de tu red local con su IP y su MAC: los equipos que el tuyo ya conoce.",
    code_renew_title: "Renueva tu IP",
    code_renew_desc: "Suelta tu IP actual y pide una nueva al router. Es el arreglo clásico cuando el internet se pone raro (ejecuta PowerShell como administrador).",
    detect_title: "Detecta mi equipo",
    detect_desc: "Sin instalar nada ni ejecutar código: esto es lo único que tu navegador puede ver de tu equipo. Para el diagnóstico completo (modelo exacto del procesador y de la placa) usa el código de PowerShell.",
    detect_btn: "Detectar mi equipo",
    detect_os: "Sistema operativo",
    detect_browser: "Navegador",
    detect_cores: "Procesadores lógicos (hilos)",
    detect_ram: "RAM aproximada",
    detect_gpu: "Tarjeta gráfica",
    detect_screen: "Pantalla",
    detect_battery: "Batería",
    detect_na: "No disponible",
    detect_gpu_private: "Oculta por el navegador (privacidad)",
    detect_charging: "cargando",

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
    footer_text: "NVISION",
    explorer_title: "Explorador 3D del computador",
    explorer_desc: "Mueve el cursor sobre la escena para recorrer el interior de una torre y reconocer cómo se conectan sus piezas.",
    explorer_status: "ESCENA INTERACTIVA",
    explorer_kicker: "CINEMÁTICA ACTIVA",
    explorer_hint: "Arrastra para girar · Rueda para zoom · Toca una pieza para desmontarla",
    pc3d_viewer_loading: "Cargando modelo 3D…",
    pc3d_viewer_error: "No se pudo cargar el visor 3D. Revisa tu conexión e inténtalo de nuevo.",
    pc3d_explode_label: "Desarmar",
    pc3d_reset_view: "Restablecer vista",
    pc3d_part_installed: "Instalada",
    pc3d_part_removed: "Retirada · toca de nuevo para instalarla",
    pc3d_disassemble_all: "Desarmar todo",
    pc3d_assemble_all: "Armar todo",
    pc3d_labels: "Etiquetas",
    scene_overview_title: "Vista general",
    scene_overview_desc: "La torre abierta revela la ruta principal de energía, datos y procesamiento.",
    scene_core_title: "Núcleo de cálculo",
    scene_core_desc: "CPU y RAM toman el foco: aquí las instrucciones se convierten en trabajo útil.",
    scene_airflow_title: "Flujo y energía",
    scene_airflow_desc: "La fuente y la tarjeta gráfica muestran cómo circulan energía y calor dentro del equipo.",
    scene_overview_btn: "Vista general",
    scene_core_btn: "Núcleo de cálculo",
    scene_airflow_btn: "Flujo y energía",
    part_motherboard: "Placa madre",
    part_ram: "Memoria RAM",
    part_cpu: "Procesador CPU",
    part_gpu: "Tarjeta gráfica GPU",
    part_storage: "Almacenamiento SSD",
    part_psu: "Fuente de poder",
    part_optical: "Unidad óptica",
    explorer_parts: "PIEZAS EN 3D",
    explorer_view: "VISTA DINÁMICA",
    pc3d_hero_title: "Conoce tu PC por dentro y mantenlo en forma.",
    pc3d_hero_desc: "Una guía visual para identificar cada componente, entender sus tipos y aplicar mantenimiento sin improvisar.",
    pc3d_viewer_kicker: "01 / Vista interactiva",
    pc3d_viewer_title: "Desarma la torre con la mirada",
    pc3d_viewer_desc: "Arrastra para girar la torre, usa la rueda para acercar y toca una pieza para desmontarla; tócala de nuevo para instalarla. Todo el modelo es 3D de verdad.",
    pc3d_parts_kicker: "02 / Lectura técnica",
    pc3d_parts_title: "Qué hace cada componente y qué tipos existen",
    pc3d_parts_desc: "Las variantes importan: cambian el rendimiento, el consumo, la compatibilidad y el precio de un equipo.",
    pc3d_part_mb_title: "Placa madre",
    pc3d_part_mb_desc: "Conecta CPU, RAM, almacenamiento, GPU y periféricos mediante buses y chipset.",
    pc3d_part_cpu_title: "Procesador / CPU",
    pc3d_part_cpu_desc: "Ejecuta instrucciones y coordina las operaciones del sistema. Más núcleos ayudan en multitarea.",
    pc3d_part_ram_title: "Memoria RAM",
    pc3d_part_ram_desc: "Guarda temporalmente los datos de los programas activos para que la CPU acceda rápido.",
    pc3d_part_gpu_title: "Tarjeta gráfica / GPU",
    pc3d_part_gpu_desc: "Procesa imágenes, video, 3D e inteligencia artificial; tiene su propia memoria VRAM.",
    pc3d_part_storage_title: "Almacenamiento",
    pc3d_part_storage_desc: "Conserva sistema, aplicaciones y archivos incluso cuando el equipo se apaga.",
    pc3d_part_psu_title: "Fuente de poder / PSU",
    pc3d_part_psu_desc: "Convierte corriente AC en voltajes DC estables. Una fuente adecuada protege todo el equipo.",
    pc3d_part_cooling_title: "Refrigeración",
    pc3d_part_cooling_desc: "Extrae el calor del CPU y GPU para evitar reducción de frecuencia y fallos térmicos.",
    pc3d_part_net_title: "Red y conectividad",
    pc3d_part_net_desc: "Permite enviar y recibir datos por cable o Wi-Fi desde el computador hacia la red.",
    pc3d_part_odd_title: "Unidad de Disco Óptico / ODD",
    pc3d_part_odd_desc: "Lee y graba datos en discos CD, DVD y Blu-ray mediante un láser óptico. Hoy es una pieza opcional, cada vez menos común en las torres nuevas.",
    pc3d_maint_kicker: "03 / Cuidado preventivo",
    pc3d_maint_title: "Mantenimiento por fuera y por dentro",
    pc3d_maint_desc: "Trabaja siempre con el equipo apagado, desconectado y con una superficie limpia. La electricidad estática puede dañar los circuitos.",
    pc3d_maint_ext_badge: "EXTERIOR",
    pc3d_maint_ext_title: "Limpieza visible",
    pc3d_maint_ext_li1: "Apaga, desconecta todos los cables y mantén presionado el botón de encendido unos segundos.",
    pc3d_maint_ext_li2: "Limpia filtros, rejillas, puertos y ventiladores externos con aire comprimido en ráfagas cortas.",
    pc3d_maint_ext_li3: "Usa paño de microfibra ligeramente húmedo en el chasis. Nunca rocíes líquido directamente.",
    pc3d_maint_ext_li4: "Ordena los cables para no bloquear entradas y salidas de aire.",
    pc3d_maint_int_badge: "INTERIOR",
    pc3d_maint_int_title: "Limpieza profunda",
    pc3d_maint_int_li1: "Abre el panel lateral y sujeta los ventiladores para que no giren libremente al aplicar aire.",
    pc3d_maint_int_li2: "Retira polvo de disipadores, GPU, fuente y filtros desde dentro hacia afuera.",
    pc3d_maint_int_li3: "Revisa que no haya cables flojos, capacitores hinchados o corrosión.",
    pc3d_maint_int_li4: "Cambia la pasta térmica del CPU cuando las temperaturas suban o según el uso del equipo.",
    pc3d_maint_sys_badge: "SISTEMA",
    pc3d_maint_sys_title: "Salud digital",
    pc3d_maint_sys_li1: "Actualiza sistema, controladores y firmware desde fuentes oficiales.",
    pc3d_maint_sys_li2: "Desinstala programas que no uses y revisa el espacio libre del SSD.",
    pc3d_maint_sys_li3: "Haz copias de seguridad y comprueba periódicamente el estado SMART del almacenamiento.",
    pc3d_maint_sys_li4: "Usa un antivirus confiable y evita instaladores modificados o desconocidos.",
    pc3d_maint_routine_badge: "RUTINA",
    pc3d_maint_routine_title: "Frecuencia segura",
    pc3d_maint_routine_li1: "Exterior y filtros: cada 1 a 3 meses según polvo, mascotas y ventilación.",
    pc3d_maint_routine_li2: "Interior: cada 6 a 12 meses o antes si aumenta el ruido y la temperatura.",
    pc3d_maint_routine_li3: "Pasta térmica: normalmente cada 2 a 4 años, revisando antes las temperaturas.",
    pc3d_maint_routine_li4: "Si hay olor a quemado, apagados repentinos o ruido eléctrico, deja de usarlo y consulta servicio técnico.",
    pc3d_maint_rule_title: "Regla práctica:",
    pc3d_maint_rule_text: "el mantenimiento no es solo estética; conservar el flujo de aire aumenta la estabilidad y la vida útil.",
    pc3d_malware_kicker: "04 / Seguridad digital",
    pc3d_malware_title: "Malware: el enemigo invisible de tu PC",
    pc3d_malware_desc: "No basta con limpiar el polvo: un PC también se enferma por dentro. El malware es software creado para dañar, robar datos o tomar el control de tu equipo, muchas veces sin que lo notes.",
    pc3d_malware_what_badge: "QUÉ ES",
    pc3d_malware_what_title: "Tipos más comunes",
    pc3d_malware_what_li1: "Virus: se replica pegándose a otros archivos y se activa al abrirlos.",
    pc3d_malware_what_li2: "Troyano: se disfraza de programa legítimo, como un juego o un “optimizador”, y abre la puerta a ladrones de datos.",
    pc3d_malware_what_li3: "Gusano (worm): se copia solo de equipo en equipo por la red, sin que nadie lo instale.",
    pc3d_malware_what_li4: "Spyware y ransomware: el primero espía y roba datos; el segundo secuestra archivos y pide rescate para liberarlos.",
    pc3d_malware_entry_badge: "CÓMO ENTRA",
    pc3d_malware_entry_title: "Puertas más frecuentes",
    pc3d_malware_entry_li1: "Adjuntos y enlaces sospechosos en correos o mensajes, aunque parezcan de un conocido.",
    pc3d_malware_entry_li2: "Programas pirata, instaladores modificados y “optimizadores” de sitios no oficiales.",
    pc3d_malware_entry_li3: "Memorias USB desconocidas y redes Wi-Fi sin protección.",
    pc3d_malware_entry_li4: "Sistema y programas sin actualizar, que dejan agujeros sin parchear.",
    pc3d_malware_signs_badge: "SEÑALES",
    pc3d_malware_signs_title: "Ve a revisión si notas…",
    pc3d_malware_signs_li1: "Ventanas o anuncios que aparecen solos, o el navegador que cambia de buscador.",
    pc3d_malware_signs_li2: "El equipo se vuelve lento, se calienta o se apaga sin una razón clara.",
    pc3d_malware_signs_li3: "Archivos que desaparecen, cambian de nombre o piden rescate para abrirlos.",
    pc3d_malware_signs_li4: "Programas nuevos que no instalaste o actividad extraña en tus cuentas.",
    pc3d_malware_protect_badge: "PROTECCIÓN",
    pc3d_malware_protect_title: "Qué hacer siempre",
    pc3d_malware_protect_li1: "Mantén un solo antivirus activo y actualizado, con análisis rápido semanal y completo mensual.",
    pc3d_malware_protect_li2: "Descarga solo desde sitios oficiales y mantén sistema, programas y controladores al día.",
    pc3d_malware_protect_li3: "Haz copias de seguridad con la regla 3-2-1 para recuperar tus archivos si algo falla.",
    pc3d_malware_protect_li4: "Si sospechas infección: desconecta el equipo, pasa el antivirus completo y no pagues rescates; restaura desde tu copia.",
    pc3d_malware_rule_title: "Regla práctica:",
    pc3d_malware_rule_text: "la limpieza física cuida el hardware; el antivirus, las actualizaciones y las copias cuidan tus datos. Un PC limpio por fuera también debe estar protegido por dentro.",
    pc3d_tools_kicker: "05 / Kit de trabajo",
    pc3d_tools_title: "Herramientas indispensables para mantener tu PC",
    pc3d_tools_desc: "Utiliza herramientas limpias y adecuadas para no rayar el gabinete ni descargar electricidad sobre los componentes.",
    pc3d_tool_drivers_title: "Destornilladores de precisión",
    pc3d_tool_drivers_desc: "Phillips, plano y Torx para retirar tapas, discos, ventiladores y tornillos de la placa.",
    pc3d_tool_wrist_title: "Manilla antiestática",
    pc3d_tool_wrist_desc: "Descarga la electricidad estática de tu cuerpo antes de tocar RAM, CPU o placa madre.",
    pc3d_tool_air_title: "Aire comprimido",
    pc3d_tool_air_desc: "Expulsa polvo de disipadores y filtros. Mantén los ventiladores sujetos para no dañarlos.",
    pc3d_tool_brush_title: "Brocha antiestática",
    pc3d_tool_brush_desc: "Afloja polvo acumulado en ranuras, rejillas y superficies delicadas sin rayar los circuitos.",
    pc3d_tool_paste_title: "Pasta térmica",
    pc3d_tool_paste_desc: "Mejora el contacto entre CPU y disipador. Aplica una pequeña cantidad sobre la superficie limpia.",
    pc3d_tool_cloth_title: "Paño de microfibra",
    pc3d_tool_cloth_desc: "Limpia el gabinete, vidrio y periféricos sin dejar pelusas ni aplicar líquidos directamente.",
    pc3d_tool_ties_title: "Bridas y velcro",
    pc3d_tool_ties_desc: "Ordenan el cableado y mantienen despejado el flujo de aire dentro del gabinete.",
    pc3d_partfunc_motherboard: "Conecta todos los componentes y permite que intercambien datos.",
    pc3d_partfunc_ram: "Mantiene temporalmente los datos de los programas que están en uso.",
    pc3d_partfunc_cpu: "Ejecuta instrucciones, cálculos y coordina las operaciones del computador.",
    pc3d_partfunc_gpu: "Procesa gráficos, video, renderizado 3D e inteligencia artificial.",
    pc3d_partfunc_storage: "Guarda el sistema operativo, las aplicaciones y los archivos de forma permanente.",
    pc3d_partfunc_psu: "Convierte la corriente y entrega voltajes estables a cada pieza.",
    pc3d_partfunc_optical: "Lee y graba datos en discos CD, DVD y Blu-ray mediante un láser óptico.",
    pc3d_parttypes_motherboard: "ATX · Micro-ATX · Mini-ITX",
    pc3d_parttypes_ram: "DDR3 · DDR4 · DDR5 · DIMM",
    pc3d_parttypes_cpu: "Intel · AMD · x86 · x64",
    pc3d_parttypes_gpu: "Integrada · Dedicada · GDDR6 · PCIe",
    pc3d_parttypes_storage: "HDD · SSD SATA · M.2 NVMe",
    pc3d_parttypes_psu: "ATX · SFX · Bronze · Silver · Gold · Platinum · Titanium",
    pc3d_parttypes_optical: "CD · DVD · Blu-ray · SATA",
    page_title_index: "NVISION - Hardware y Computadores",
    page_title_hardware: "NVISION - Hardware y Evolución",
    page_title_redes: "NVISION - Redes y Simulación",
    page_title_recursos: "NVISION - Recursos de Aprendizaje",
    page_title_pc3d: "NVISION - PC3D y más",
    page_title_wifi: "NVISION - WiFi Avanzado",
    pc3d_footer: "© 2026 - NVISION / PC3D y más",
    pc3d_type_integrated: "Integrada",
    pc3d_type_dedicated: "Dedicada",
    pc3d_type_aircooler: "Disipador de aire",
    pc3d_type_aio: "AIO líquida",
    theme_toggle_title: "Cambiar tema",
    menu_toggle_title: "Abrir menú",
    assistant_toggle_title: "Abrir asistente",
    page_title_ms: "NVISION - Mantenimiento preventivo por software",
    ms_eyebrow: "Mantenimiento / Por software",
    ms_title: "Mantenimiento preventivo por software",
    ms_desc: "Es el cuidado que se hace sin abrir el computador: actualizar, proteger, limpiar, respaldar y revisar el sistema antes de que falle. Bien hecho, evita virus, lentitud, errores y pérdida de archivos, y alarga la vida útil del equipo.",
    ms_btn_tasks: "Ver las 6 tareas",
    ms_btn_routine: "Ver la rutina",
    ms_hero_caption: "El software es el que ordena todo el hardware: si está desactualizado o desordenado, hasta un buen equipo se vuelve lento e inseguro.",
    ms_stat1: "tareas esenciales, en orden y sin herramientas costosas",
    ms_stat2: "regla de oro: primero la copia de seguridad, después cualquier cambio",
    ms_stat3: "frecuencias: semanal, mensual, trimestral y semestral",
    ms_que_kicker: "01 / Qué es",
    ms_que_title: "Prevenir es más barato que reparar",
    ms_que_desc: "El mantenimiento preventivo por software no espera a que el equipo se dañe. Son revisiones programadas del sistema operativo, los programas, los controladores, la seguridad y los archivos, para detectar problemas cuando todavía son pequeños.",
    ms_benefit_label: "Beneficio",
    ms_benefit1_title: "Menos fallos y pantallazos",
    ms_benefit1_desc: "Las actualizaciones y los controladores correctos corrigen errores conocidos y mejoran la compatibilidad entre el sistema y el hardware.",
    ms_benefit2_title: "Más velocidad y espacio",
    ms_benefit2_desc: "Eliminar archivos temporales, programas que no se usan y procesos de inicio innecesarios libera disco, memoria y tiempo de arranque.",
    ms_benefit3_title: "Más seguridad y tranquilidad",
    ms_benefit3_desc: "Un antivirus actualizado, contraseñas fuertes y copias de seguridad protegen tus archivos frente a virus, ransomware y errores humanos.",
    ms_tasks_kicker: "02 / Las 6 tareas",
    ms_tasks_title: "Todo lo que hay que revisar, sin perderse",
    ms_tasks_desc: "Cada tarjeta es una tarea completa: qué es, qué hacer y cada cuánto. Empieza siempre por la copia de seguridad si vas a actualizar o limpiar algo importante.",
    ms_freq_label: "Frecuencia:",
    ms_task1_badge: "Tarea 01",
    ms_task1_title: "Actualizar sistema y aplicaciones",
    ms_task1_desc: "Las actualizaciones cierran agujeros de seguridad y corrigen errores. Un programa viejo es una puerta abierta.",
    ms_task1_li1: "Activa las actualizaciones automáticas del sistema operativo.",
    ms_task1_li2: "Actualiza navegador, ofimática y demás programas desde sus sitios oficiales.",
    ms_task1_li3: "Reinicia después de actualizar para que los cambios se apliquen bien.",
    ms_task1_freq: "semanal, o cuando el sistema lo pida.",
    ms_task2_badge: "Tarea 02",
    ms_task2_title: "Controladores (drivers) al día",
    ms_task2_desc: "Los controladores son el traductor entre el sistema y cada pieza: video, red, sonido y chipset. Si fallan, aparecen pantallas negras, Wi-Fi inestable o sonido perdido.",
    ms_task2_li1: "Descárgalos solo del fabricante del equipo o del componente.",
    ms_task2_li2: "Prioriza video, red y chipset; no instales paquetes de drivers de sitios dudosos.",
    ms_task2_li3: "Si algo empeora tras actualizar, vuelve al controlador anterior.",
    ms_task2_freq: "mensual, o cuando algo deje de funcionar.",
    ms_task3_badge: "Tarea 03",
    ms_task3_title: "Antivirus y protección antimalware",
    ms_task3_desc: "El antivirus detecta y bloquea virus, spyware y ransomware antes de que dañen archivos o roben datos.",
    ms_task3_li1: "Mantén un solo antivirus activo y actualizado, no dos a la vez.",
    ms_task3_li2: "Haz un análisis rápido semanal y uno completo al mes.",
    ms_task3_li3: "No abras adjuntos ni enlaces sospechosos, aunque parezcan de un conocido.",
    ms_task3_freq: "análisis rápido semanal, completo mensual.",
    ms_task4_badge: "Tarea 04",
    ms_task4_title: "Limpieza y orden digital",
    ms_task4_desc: "Archivos temporales, descargas viejas y programas sin uso ocupan disco y hacen más lento el arranque y las búsquedas.",
    ms_task4_li1: "Borra temporales, papelera y descargas que ya no necesites.",
    ms_task4_li2: "Desinstala programas que no usas desde el panel oficial del sistema.",
    ms_task4_li3: "Revisa qué programas inician con el equipo y desactiva los innecesarios.",
    ms_task4_freq: "mensual.",
    ms_task5_badge: "Tarea 05",
    ms_task5_title: "Copias de seguridad y restauración",
    ms_task5_desc: "La copia es el seguro de tus archivos: si el disco falla o entra un virus, puedes volver atrás sin perder trabajos, fotos ni documentos.",
    ms_task5_li1: "Aplica la regla 3-2-1: 3 copias, en 2 medios distintos, 1 fuera de casa o en la nube.",
    ms_task5_li2: "Automatiza la copia para no depender de acordarte.",
    ms_task5_li3: "Comprueba alguna vez que la copia se puede abrir y restaurar de verdad.",
    ms_task5_freq: "automática semanal; verificación trimestral.",
    ms_task6_badge: "Tarea 06",
    ms_task6_title: "Optimización y salud del sistema",
    ms_task6_desc: "Revisar espacio, salud del disco y programas en segundo plano mantiene el equipo estable y evita que un problema pequeño se vuelva una falla.",
    ms_task6_li1: "Mantén al menos 15–20 % del disco libre.",
    ms_task6_li2: "Revisa la salud SMART del disco y la temperatura del equipo.",
    ms_task6_li3: "Si el equipo va lento, revisa primero inicio, disco lleno y programas en segundo plano.",
    ms_task6_freq: "mensual; salud del disco trimestral.",
    ms_routine_kicker: "03 / Rutina recomendada",
    ms_routine_title: "Una rutina corta, que sí se cumple",
    ms_routine_desc: "No hace falta hacerlo todo cada día. Con este calendario, el equipo se mantiene sano sin dedicarle horas.",
    ms_table_h1: "Cuándo",
    ms_table_h2: "Qué hacer",
    ms_table_h3: "Por qué",
    ms_row1_when: "Semanal",
    ms_row1_what: "Actualizar sistema y programas · Análisis antivirus rápido · Verificar que la copia automática corrió",
    ms_row1_why: "Es la defensa básica contra virus y errores nuevos.",
    ms_row2_when: "Mensual",
    ms_row2_what: "Limpieza de temporales y descargas · Desinstalar lo que no se usa · Análisis antivirus completo · Revisar inicio y espacio libre",
    ms_row2_why: "Recupera velocidad y evita que el disco se llene.",
    ms_row3_when: "Trimestral",
    ms_row3_what: "Revisar controladores · Salud SMART del disco · Probar que una copia se puede restaurar · Revisar contraseñas importantes",
    ms_row3_why: "Detecta desgaste y fallos antes de que pierdas datos.",
    ms_row4_when: "Semestral",
    ms_row4_what: "Revisión completa: sistema, seguridad, copias, espacio y programas · Cambiar contraseñas débiles o repetidas",
    ms_row4_why: "Deja el equipo como nuevo, sin reinstalar por gusto.",
    ms_steps_kicker: "04 / Paso a paso",
    ms_steps_title: "El orden seguro, en 6 pasos",
    ms_steps_desc: "Si solo tienes media hora, sigue este orden: protege primero, limpia después y comprueba al final.",
    ms_step1_title: "Haz copia antes de tocar nada",
    ms_step1_desc: "Guarda documentos, trabajos y fotos en la nube o en un disco externo antes de actualizar o limpiar.",
    ms_step2_title: "Actualiza sistema y programas",
    ms_step2_desc: "Instala las actualizaciones pendientes desde fuentes oficiales y reinicia el equipo.",
    ms_step3_title: "Pasa el antivirus",
    ms_step3_desc: "Ejecuta un análisis completo y sigue lo que recomiende: cuarentena o eliminación, nunca ignorar una alerta.",
    ms_step4_title: "Limpia temporales y programas",
    ms_step4_desc: "Borra lo innecesario y desinstala lo que no usas. No borres carpetas del sistema que no reconozcas.",
    ms_step5_title: "Revisa inicio y espacio",
    ms_step5_desc: "Desactiva el inicio automático innecesario y deja libre al menos 15–20 % del disco.",
    ms_step6_title: "Reinicia y comprueba",
    ms_step6_desc: "Abre tus programas habituales, revisa Wi-Fi, sonido y archivos, y confirma que la copia quedó al día.",
    ms_alerts_kicker: "05 / Alertas",
    ms_alerts_title: "Señales de que algo anda mal, y qué no hacer",
    ms_alert_warn_title: "Ve a revisión si notas…",
    ms_alert_warn_li1: "Ventanas o anuncios que aparecen solos, o el navegador cambia de buscador.",
    ms_alert_warn_li2: "El equipo se calienta, se apaga solo o tarda mucho más que antes.",
    ms_alert_warn_li3: "Archivos que desaparecen, cambian de nombre o piden rescate para abrirlos.",
    ms_alert_warn_li4: "El disco está siempre lleno o al 100 % sin razón aparente.",
    ms_alert_ok_title: "Qué no hacer nunca",
    ms_alert_ok_li1: "No instales dos antivirus a la vez: se pelean entre sí y dejan huecos.",
    ms_alert_ok_li2: "No descargues programas, controladores ni “optimizadores” de sitios pirata.",
    ms_alert_ok_li3: "No borres archivos del sistema ni del registro si no sabes qué hacen.",
    ms_alert_ok_li4: "No ignores las copias: un equipo sin copia es un archivo perdido esperando su momento.",
    ms_credit: "Imágenes: Unsplash (placa, portátil con código y portátil en la oscuridad), MakeUseOf (análisis antivirus), Avast (limpieza de disco) y Telkom University (copia en la nube). Las imágenes se cargan desde sus sitios originales, como en el resto de NVISION.",
    ms_prog_kicker: "06 / Programas recomendados",
    ms_prog_title: "Los mejores programas, clasificados sin rodeos",
    ms_prog_desc: "No hace falta instalar diez programas. Esta clasificación usa tres criterios claros: Mejor es la valoración general para mantenimiento preventivo, Costo es lo que pagas por el uso básico y Eficiencia es lo ligero y rápido que va en un equipo normal. Las estrellas son orientativas, no un laboratorio: el mejor programa es el que vas a mantener actualizado.",
    ms_prog_note: "Cómo leer la tabla: ★★★★★ es excelente, ★★★★☆ es muy bueno y ★★★☆☆ es correcto, pero con límites. “Gratis” significa que el uso básico no cuesta nada; algunos ofrecen una versión de pago con más funciones.",
    ms_prog_best_badge: "🏆 Mejor en general",
    ms_prog_best_desc: "Ya viene con Windows, se actualiza solo y protege todo el tiempo sin instalar nada extra ni pagar nada. Para la mayoría de usuarios, es la base correcta.",
    ms_prog_best_tag: "Gratis · Integrado en Windows · Siempre activo",
    ms_prog_cost_badge: "💰 Mejor costo",
    ms_prog_cost_desc: "La combinación de costo cero: Defender protege y BleachBit limpia temporales sin publicidad, sin suscripción y sin peso extra. Ideal si no quieres gastar nada.",
    ms_prog_cost_tag: "Costo total: 0 · Código abierto · Sin suscripción",
    ms_prog_eff_badge: "⚡ Más eficiente",
    ms_prog_eff_desc: "Solo trabajan cuando se les pide: Winget actualiza programas en un momento y CrystalDiskInfo revisa la salud del disco sin quedarse consumiendo recursos en segundo plano.",
    ms_prog_eff_tag: "Casi sin consumo · Rápidos · No residentes",
    ms_prog_th_prog: "Programa",
    ms_prog_th_use: "Para qué sirve",
    ms_prog_th_best: "Mejor",
    ms_prog_th_cost: "Costo",
    ms_prog_th_eff: "Eficiencia",
    ms_prog_th_for: "Recomendado para",
    ms_prog_p1_use: "Antivirus y protección en tiempo real",
    ms_prog_p1_cost: "Gratis, integrado en Windows",
    ms_prog_p1_eff: "Alta",
    ms_prog_p1_for: "Todos los usuarios de Windows",
    ms_prog_p2_use: "Segunda opinión antimalware, análisis bajo demanda",
    ms_prog_p2_cost: "Gratis, con versión Pro de pago",
    ms_prog_p2_eff: "Alta",
    ms_prog_p2_for: "Revisar un equipo con sospecha de infección",
    ms_prog_p3_use: "Actualizar muchos programas a la vez desde Windows",
    ms_prog_p3_cost: "Gratis, integrado en Windows",
    ms_prog_p3_eff: "Alta",
    ms_prog_p3_for: "Mantener programas actualizados sin buscar uno a uno",
    ms_prog_p4_use: "Actualizar sistema y controladores básicos",
    ms_prog_p4_cost: "Gratis, integrado en Windows",
    ms_prog_p4_eff: "Alta",
    ms_prog_p4_for: "La base de todo mantenimiento, sin excepción",
    ms_prog_p5_use: "Limpiar temporales, caché y archivos inútiles",
    ms_prog_p5_cost: "Gratis, código abierto",
    ms_prog_p5_eff: "Alta, muy ligero",
    ms_prog_p5_for: "Equipos lentos y usuarios que no quieren pagar",
    ms_prog_p6_use: "Limpieza y gestión de inicio, con más opciones",
    ms_prog_p6_cost: "Gratis, con versión Pro de pago",
    ms_prog_p6_eff: "Media",
    ms_prog_p6_for: "Quien quiere limpieza guiada, sin tocar el registro",
    ms_prog_p7_use: "Revisar salud SMART y temperatura del disco",
    ms_prog_p7_cost: "Gratis",
    ms_prog_p7_eff: "Alta, muy ligero",
    ms_prog_p7_for: "Detectar un disco enfermo antes de perder datos",
    ms_prog_p8_use: "Copia de seguridad completa del sistema y archivos",
    ms_prog_p8_cost: "Gratis en su uso básico",
    ms_prog_p8_eff: "Media, la primera copia tarda más",
    ms_prog_p8_for: "Proteger trabajos, fotos y documentos importantes",
    ms_prog_pick1_badge: "Si no quieres gastar nada",
    ms_prog_pick1_title: "Defender + Winget + BleachBit",
    ms_prog_pick1_desc: "Protección, actualizaciones y limpieza por 0, con programas oficiales o de código abierto. Añade CrystalDiskInfo cada tres meses y ya tienes la rutina cubierta.",
    ms_prog_pick2_badge: "Si quieres que sea automático",
    ms_prog_pick2_title: "Defender + copia automática",
    ms_prog_pick2_desc: "Deja las actualizaciones automáticas activas y programa la copia de seguridad. El mantenimiento que no depende de acordarte es el que realmente se hace.",
    ms_prog_pick3_badge: "Si tu equipo es viejo o lento",
    ms_prog_pick3_title: "Menos programas, más eficiencia",
    ms_prog_pick3_desc: "Evita suites pesadas y dos antivirus a la vez. Quédate con Defender, limpieza ligera y revisión del disco: cada programa residente extra le quita velocidad.",
    ms_prog_credit: "Consejo final: descarga cada programa solo desde su sitio oficial o desde Windows. Un “optimizador” de un sitio pirata puede ser justo lo contrario: el programa que te infecta el equipo.",
    assistant_close_title: "Cerrar"
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
    nav_network: "From Hardware to Network",
    nav_glossary: "Glossary",
    nav_lab: "Code Lab",
    nav_ms: "Software Maintenance",
    nav_explorer_3d: "3D PC Explorer",
    nav_grp_hardware: "Hardware",
    nav_back: "Back",
    nav_grp_networks: "Networks",
    nav_grp_resources: "Resources",
    nav_grp_pc3d: "PC3D and more",
    nav_pc3d_viewer: "3D viewer",
    nav_pc3d_parts: "Components and types",
    nav_pc3d_maintenance: "PC maintenance",
    nav_pc3d_malware: "Malware",

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
    switch3d_title: "Inside a switch: how it decides where each frame goes",
    switch3d_desc: "Send frames between the computers and watch, step by step, how the switch learns MAC addresses and decides which port each frame leaves through. Compare it with a hub and see the difference.",
    switch3d_badge: "Layer 2 Lab",
    swl_caption_idle: "Choose who sends and who receives, then press \"Send frame\". Watch how the switch learns MAC addresses into its table.",
    swl_caption_hub_idle: "HUB mode on: send a frame and compare what happens with what the switch does.",
    swl_mode_switch: "Switch mode",
    swl_mode_hub: "Hub mode",
    swl_from: "Sends",
    swl_to: "Receives",
    swl_send: "Send frame",
    swl_reset: "Clear MAC table",
    swl_table_title: "MAC table (what the switch has learned)",
    swl_col_port: "Port",
    swl_col_mac: "MAC",
    swl_table_empty: "Empty: it has not learned any MAC yet.",
    swl_table_hub: "A hub has no MAC table: it learns nothing.",
    swl_cap_send: "{from} sends a frame addressed to {to}.",
    swl_cap_enter: "The frame enters the switch through port {port}.",
    swl_cap_learn: "The switch learns: it writes down that {from}'s MAC is on port {port}.",
    swl_cap_lookup: "Now it looks up {to}'s MAC in its table…",
    swl_cap_forward: "Found it, port {port}! It forwards the frame ONLY through that port: the other computers never see it.",
    swl_cap_flood: "It does not know {to}'s MAC yet: it sends the frame out through ALL ports (flooding) to see who answers.",
    swl_cap_reply: "The others ignore it; only {to} replies. With that reply, the switch also learns {to}'s MAC: port {port}.",
    swl_cap_done: "✔ Frame delivered to {to}. And check the table: next time between these two computers the delivery will be direct, no flooding.",
    swl_cap_hub: "The hub does not think or learn: it repeats the frame through ALL ports, always.",
    swl_cap_hub_done: "Everyone received the frame even though it was only for {to}: more traffic and zero privacy. That is why hubs disappeared and everything is a switch today.",

    // Network Topologies
    nav_topologies: "Topologies",
    topol_title: "Network Topologies",
    nav_switch3d: "Inside a switch",
    nav_wifi: "Advanced WiFi",
    wifi_kicker: "Hands-on guide · Wireless networks",
    wifi_h1: "Advanced WiFi, explained step by step",
    wifi_hero_p: "From the box to a fast, secure network: install the modem/router, open its panel, change the password, add a repeater and gain coverage. All in order, no detours.",
    wifi_node_modem: "MODEM",
    wifi_node_repeater: "REPEATER",
    wifi_node_device: "DEVICE",
    wifi_instal_title: "Install the modem/router",
    wifi_instal_sub: "Order matters: first the physical connection, then the settings panel.",
    wifi_c1_t: "Connect and power on",
    wifi_c1_p: "The physical setup is half the job. In order:",
    wifi_c1_1: "Connect the provider's cable (fiber/ONT or coax/DSL) to the device's input port.",
    wifi_c1_2: "Turn it on and wait about 2 minutes: the power and internet lights should stay solid.",
    wifi_c1_3: "Connect by Ethernet cable if you can; otherwise join the WiFi using the name (SSID) and password printed on the device's label.",
    wifi_c1_4: "With that connection ready, you can now open the settings panel (next card).",
    wifi_c2_t: "Open the panel and change what matters",
    wifi_c2_p: "The panel is your network's control center:",
    wifi_c2_1: "In the browser type 192.168.1.1 (if it does not open, try 192.168.0.1). The panel user and password are on the device's label.",
    wifi_c2_2: "Change the network name (SSID) to something recognizable, but with no personal data.",
    wifi_c2_3: "Set a new, long password (over 12 characters): it is the key to your digital home.",
    wifi_c2_4: "Security on WPA2 or WPA3. Never leave the network open or on old WEP.",
    wifi_c3_t: "Add a repeater and gain coverage",
    wifi_c3_p: "If WiFi does not reach a room, a repeater picks up the signal and rebroadcasts it. The trick is placing it halfway, where the modem's signal is still strong (place it where there is no signal and it will repeat... nothing). Two ways to link it:",
    wifi_m1_t: "WPS method (the fast one)",
    wifi_m1_p: "Press the WPS button on the modem and, within 2 minutes, the one on the repeater. They pair by themselves and the repeater copies your same network and password.",
    wifi_m2_t: "Manual method (the one you control)",
    wifi_m2_p: "Join the repeater's temporary network, open its panel, pick your WiFi from the list, type the password and save. Slower, but you see every step.",
    wifi_c4_t: "2.4 GHz or 5 GHz: use both bands",
    wifi_c4_1: "2.4 GHz: reaches farther and crosses walls, but it is slower and gets crowded easily.",
    wifi_c4_2: "5 GHz: much faster; ideal near the modem for gaming, classes and streaming.",
    wifi_c4_3: "If the modem offers one name for both bands, keep it: each device picks the best one by itself.",
    wifi_c4_4: "In buildings full of networks, changing the channel helps: on 2.4 GHz use 1, 6 or 11 to dodge the neighbors.",
    wifi_c5_t: "Where to place the modem",
    wifi_c5_p: "Placement beats several repeaters:",
    wifi_c5_1: "At a central, elevated spot in the home; never on the floor or inside a closed cabinet.",
    wifi_c5_2: "Away from microwaves, cordless phone bases and large metal objects.",
    wifi_c5_3: "A thick wall or a fish tank between the modem and you weakens the signal: sometimes moving the device one meter fixes everything.",
    wifi_cl_t: "Final checklist",
    wifi_cl_1: "Modem lights solid (power and internet)",
    wifi_cl_2: "SSID changed and new password saved",
    wifi_cl_3: "Security set to WPA2 or WPA3",
    wifi_cl_4: "Modem firmware updated",
    wifi_cl_5: "Guest network on for visitors",
    wifi_cl_6: "Signal tested in every room",
    wifi_cl_7: "Repeater placed where signal is still good",
    wifi_cl_8: "Photo of the modem label on your phone",
    wifi_warn_t: "Watch out:",
    wifi_warn_p: "Never keep the panel's factory user and password (like admin/admin): it is the first combination any intruder tries. Change it and store the new one somewhere safe, away from visitors.",
    wifi_faq_title: "Frequently asked questions",
    wifi_faq_sub: "The three problems everyone runs into, solved.",
    wifi_f1_q: "192.168.1.1 will not open, what do I do?",
    wifi_f1_p: "Make sure you are connected to THAT modem (by cable or its WiFi) and also try 192.168.0.1. On your phone, turn mobile data off while setting up: sometimes the phone escapes through mobile data and never reaches the panel.",
    wifi_f2_q: "Why is WiFi weak in my room?",
    wifi_f2_p: "Distance, walls and appliances eat the signal. Move the modem to a central, high spot, and if it is still not enough, place the repeater halfway (not inside the room with no signal, because there it has nothing to repeat).",
    wifi_f3_q: "Is WPS safe?",
    wifi_f3_p: "The physical WPS button is handy for linking the repeater, but PIN-based WPS is vulnerable. If your panel allows it, disable PIN WPS and keep only the button.",
    assistant_title: "NVISION Assistant",
    assistant_status: "Trained chat",
    assistant_welcome: "Ask me about the site content. If I miss something, you can teach me in the Train tab.",
    assistant_placeholder: "Type your question…",
    assistant_search: "Send",
    assistant_empty: "I could not find a match. Try another keyword.",
    assistant_open: "Open section",
    assistant_tab_chat: "Chat",
    assistant_tab_train: "Train",
    assistant_fallback: "I do not know how to answer that yet 🤔. Try other words, or teach me the answer so I know it next time.",
    assistant_teach_title: "Teach a new answer",
    assistant_teach_q: "Ways to ask it (one per line)",
    assistant_teach_a: "Answer",
    assistant_teach_cat: "Category",
    assistant_save: "Save",
    assistant_cancel_edit: "Cancel editing",
    assistant_edit_title: "Edit answer",
    assistant_stats_base: "base answers",
    assistant_stats_learned: "taught by you",
    assistant_test_title: "Test the assistant",
    assistant_test_ph: "Type a question to see what it understands",
    assistant_missed_title: "Unanswered questions",
    assistant_learned_title: "What you have taught it",
    assistant_backup_title: "Backup",
    assistant_export: "Export",
    assistant_import: "Import",
    assistant_reset: "Erase learned",
    assistant_saved_toast: "Learned! I know this answer now.",
    assistant_need_both: "Write at least one question and the answer.",
    assistant_thanks: "Thanks! 💚",
    assistant_teach_this: "Teach me this answer",
    assistant_up: "It helped",
    assistant_down: "Improve",
    assistant_no_match: "No clear match",
    assistant_match: "Matches",
    assistant_missed_empty: "No pending questions yet.",
    assistant_learned_empty: "You have not taught anything yet.",
    assistant_teach_btn: "Teach",
    assistant_remove_btn: "Remove",
    assistant_edit_btn: "Edit",
    assistant_delete_btn: "Delete",
    assistant_confirm_delete: "Delete this answer?",
    assistant_confirm_reset: "Erase everything you have taught it?",
    assistant_imported: "imported answers",
    assistant_import_bad: "The backup format is not valid.",
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
    lab_title: "Code Lab",
    lab_desc: "Codes ready to copy and try on your own computer: open PowerShell, paste the code and watch what happens.",
    model3d_title: "3D PC Case Simulation",
    model3d_desc: "Reserved space to integrate Three.js or WebGL models to inspect and disassemble a virtual PC tower.",
    model3d_wait: "3D model placeholder (Three.js / WebGL)",
    ps_title: "Hardware Diagnostics (PowerShell)",
    ps_desc: "Native Windows code to inspect the physical hardware specifications during lab sessions:",
    copy_code: "Copy",
    copied_code: "Copied!",
    code_ipmac_title: "Your IP and Your MAC",
    code_ipmac_desc: "Shows your computer's IP address and the physical address (MAC) of your network card: the two values that identify you on the network.",
    code_ping_title: "Is there a connection? Ping it",
    code_ping_desc: "Sends packets to Google's server (8.8.8.8). If it replies, your connection works; if everything is lost, the problem is on your local network.",
    code_arp_title: "Who is on your network?",
    code_arp_desc: "Lists the devices on your local network with their IP and MAC: the machines yours already knows.",
    code_renew_title: "Renew your IP",
    code_renew_desc: "Releases your current IP and asks the router for a new one. The classic fix when the internet acts weird (run PowerShell as administrator).",
    detect_title: "Detect my device",
    detect_desc: "No installs and no code to run: this is all your browser is allowed to see about your device. For the full diagnostics (exact processor and motherboard model) use the PowerShell code.",
    detect_btn: "Detect my device",
    detect_os: "Operating system",
    detect_browser: "Browser",
    detect_cores: "Logical processors (threads)",
    detect_ram: "Approximate RAM",
    detect_gpu: "Graphics card",
    detect_screen: "Screen",
    detect_battery: "Battery",
    detect_na: "Not available",
    detect_gpu_private: "Hidden by the browser (privacy)",
    detect_charging: "charging",

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
    footer_text: "NVISION",
    explorer_title: "3D computer explorer",
    explorer_desc: "Move across the scene to travel through a tower and see how its internal parts connect.",
    explorer_status: "INTERACTIVE SCENE",
    explorer_kicker: "ACTIVE CINEMATIC",
    explorer_hint: "Drag to rotate · Scroll to zoom · Tap a part to remove it",
    pc3d_viewer_loading: "Loading 3D model…",
    pc3d_viewer_error: "The 3D viewer couldn't load. Check your connection and try again.",
    pc3d_explode_label: "Explode",
    pc3d_reset_view: "Reset view",
    pc3d_part_installed: "Installed",
    pc3d_part_removed: "Removed · tap again to reinstall",
    pc3d_disassemble_all: "Disassemble all",
    pc3d_assemble_all: "Reassemble all",
    pc3d_labels: "Labels",
    scene_overview_title: "Overview",
    scene_overview_desc: "The open tower reveals the main route for power, data and processing.",
    scene_core_title: "Compute core",
    scene_core_desc: "CPU and RAM take focus: this is where instructions become useful work.",
    scene_airflow_title: "Airflow and power",
    scene_airflow_desc: "The power supply and graphics card show how energy and heat move through the machine.",
    scene_overview_btn: "Overview",
    scene_core_btn: "Compute core",
    scene_airflow_btn: "Airflow and power",
    part_motherboard: "Motherboard",
    part_ram: "RAM memory",
    part_cpu: "CPU processor",
    part_gpu: "GPU graphics card",
    part_storage: "SSD storage",
    part_psu: "Power supply",
    part_optical: "Optical drive",
    explorer_parts: "3D PARTS",
    explorer_view: "DYNAMIC VIEW",
    pc3d_hero_title: "Get to know your PC inside and keep it in shape.",
    pc3d_hero_desc: "A visual guide to identify every component, understand its types and do maintenance without improvising.",
    pc3d_viewer_kicker: "01 / Interactive view",
    pc3d_viewer_title: "Take the tower apart with your eyes",
    pc3d_viewer_desc: "Drag to rotate the tower, scroll to zoom in and tap a part to remove it; tap it again to reinstall it. The whole model is real 3D.",
    pc3d_parts_kicker: "02 / Technical reading",
    pc3d_parts_title: "What each component does and which types exist",
    pc3d_parts_desc: "Variants matter: they change performance, power use, compatibility and price.",
    pc3d_part_mb_title: "Motherboard",
    pc3d_part_mb_desc: "Connects CPU, RAM, storage, GPU and peripherals through buses and the chipset.",
    pc3d_part_cpu_title: "Processor / CPU",
    pc3d_part_cpu_desc: "Runs instructions and coordinates system operations. More cores help multitasking.",
    pc3d_part_ram_title: "RAM memory",
    pc3d_part_ram_desc: "Temporarily holds the data of active programs so the CPU can reach it fast.",
    pc3d_part_gpu_title: "Graphics card / GPU",
    pc3d_part_gpu_desc: "Processes images, video, 3D and artificial intelligence; it has its own VRAM memory.",
    pc3d_part_storage_title: "Storage",
    pc3d_part_storage_desc: "Keeps the system, apps and files even when the computer is off.",
    pc3d_part_psu_title: "Power supply / PSU",
    pc3d_part_psu_desc: "Turns AC current into stable DC voltages. A proper PSU protects the whole machine.",
    pc3d_part_cooling_title: "Cooling",
    pc3d_part_cooling_desc: "Pulls heat away from the CPU and GPU to prevent throttling and thermal failures.",
    pc3d_part_net_title: "Networking and connectivity",
    pc3d_part_net_desc: "Lets the computer send and receive data by cable or Wi-Fi to the network.",
    pc3d_part_odd_title: "Optical Disc Drive / ODD",
    pc3d_part_odd_desc: "Reads and burns data on CD, DVD and Blu-ray discs with an optical laser. Today it is an optional part, less and less common in new towers.",
    pc3d_maint_kicker: "03 / Preventive care",
    pc3d_maint_title: "Maintenance outside and inside",
    pc3d_maint_desc: "Always work with the machine off, unplugged and on a clean surface. Static electricity can damage circuits.",
    pc3d_maint_ext_badge: "EXTERIOR",
    pc3d_maint_ext_title: "Visible cleaning",
    pc3d_maint_ext_li1: "Turn it off, unplug every cable and hold the power button down for a few seconds.",
    pc3d_maint_ext_li2: "Clean filters, grilles, ports and external fans with short bursts of compressed air.",
    pc3d_maint_ext_li3: "Wipe the chassis with a slightly damp microfiber cloth. Never spray liquid directly.",
    pc3d_maint_ext_li4: "Tidy the cables so they do not block air inlets and outlets.",
    pc3d_maint_int_badge: "INTERIOR",
    pc3d_maint_int_title: "Deep cleaning",
    pc3d_maint_int_li1: "Open the side panel and hold the fans so they do not spin freely when you apply air.",
    pc3d_maint_int_li2: "Remove dust from heatsinks, GPU, PSU and filters from the inside out.",
    pc3d_maint_int_li3: "Check for loose cables, swollen capacitors or corrosion.",
    pc3d_maint_int_li4: "Replace the CPU thermal paste when temperatures rise or based on how you use the machine.",
    pc3d_maint_sys_badge: "SYSTEM",
    pc3d_maint_sys_title: "Digital health",
    pc3d_maint_sys_li1: "Update the system, drivers and firmware from official sources.",
    pc3d_maint_sys_li2: "Uninstall programs you do not use and check free SSD space.",
    pc3d_maint_sys_li3: "Make backups and check the storage SMART status regularly.",
    pc3d_maint_sys_li4: "Use a trusted antivirus and avoid modified or unknown installers.",
    pc3d_maint_routine_badge: "ROUTINE",
    pc3d_maint_routine_title: "Safe frequency",
    pc3d_maint_routine_li1: "Exterior and filters: every 1 to 3 months depending on dust, pets and ventilation.",
    pc3d_maint_routine_li2: "Interior: every 6 to 12 months, or sooner if noise and temperature rise.",
    pc3d_maint_routine_li3: "Thermal paste: usually every 2 to 4 years, checking temperatures first.",
    pc3d_maint_routine_li4: "If there is a burning smell, sudden shutdowns or electrical noise, stop using it and consult a technician.",
    pc3d_maint_rule_title: "Practical rule:",
    pc3d_maint_rule_text: "maintenance is not just about looks; keeping airflow clear increases stability and lifespan.",
    pc3d_malware_kicker: "04 / Digital security",
    pc3d_malware_title: "Malware: your PC's invisible enemy",
    pc3d_malware_desc: "Cleaning dust is not enough: a PC can also get sick on the inside. Malware is software created to damage, steal data or take control of your machine, often without you noticing.",
    pc3d_malware_what_badge: "WHAT IT IS",
    pc3d_malware_what_title: "Most common types",
    pc3d_malware_what_li1: "Virus: it replicates by attaching to other files and activates when you open them.",
    pc3d_malware_what_li2: "Trojan: it disguises itself as a legit program, like a game or an “optimizer”, and opens the door to data thieves.",
    pc3d_malware_what_li3: "Worm: it copies itself from machine to machine over the network, with nobody installing it.",
    pc3d_malware_what_li4: "Spyware and ransomware: the first spies and steals data; the second hijacks files and demands ransom to free them.",
    pc3d_malware_entry_badge: "HOW IT GETS IN",
    pc3d_malware_entry_title: "Most common entry points",
    pc3d_malware_entry_li1: "Suspicious attachments and links in emails or messages, even if they look like they come from someone you know.",
    pc3d_malware_entry_li2: "Pirated programs, modified installers and “optimizers” from unofficial sites.",
    pc3d_malware_entry_li3: "Unknown USB drives and unprotected Wi-Fi networks.",
    pc3d_malware_entry_li4: "System and programs left unupdated, leaving unpatched holes.",
    pc3d_malware_signs_badge: "WARNING SIGNS",
    pc3d_malware_signs_title: "Get it checked if you notice…",
    pc3d_malware_signs_li1: "Popups or ads appearing on their own, or a browser that changes search engine.",
    pc3d_malware_signs_li2: "The machine becomes slow, overheats or shuts down for no clear reason.",
    pc3d_malware_signs_li3: "Files disappearing, changing names or demanding ransom to open them.",
    pc3d_malware_signs_li4: "New programs you did not install, or strange activity in your accounts.",
    pc3d_malware_protect_badge: "PROTECTION",
    pc3d_malware_protect_title: "What to always do",
    pc3d_malware_protect_li1: "Keep a single antivirus active and updated, with a quick scan weekly and a full scan monthly.",
    pc3d_malware_protect_li2: "Download only from official sites and keep the system, programs and drivers up to date.",
    pc3d_malware_protect_li3: "Make backups with the 3-2-1 rule so you can recover your files if something fails.",
    pc3d_malware_protect_li4: "If you suspect an infection: disconnect the machine, run a full antivirus scan and do not pay ransoms; restore from your backup.",
    pc3d_malware_rule_title: "Practical rule:",
    pc3d_malware_rule_text: "physical cleaning takes care of the hardware; antivirus, updates and backups take care of your data. A PC that is clean outside must also be protected inside.",
    pc3d_tools_kicker: "05 / Work kit",
    pc3d_tools_title: "Essential tools to maintain your PC",
    pc3d_tools_desc: "Use clean, suitable tools so you do not scratch the case or discharge static onto components.",
    pc3d_tool_drivers_title: "Precision screwdrivers",
    pc3d_tool_drivers_desc: "Phillips, flat and Torx to remove covers, drives, fans and board screws.",
    pc3d_tool_wrist_title: "Anti-static wrist strap",
    pc3d_tool_wrist_desc: "Discharges your body's static electricity before you touch RAM, CPU or motherboard.",
    pc3d_tool_air_title: "Compressed air",
    pc3d_tool_air_desc: "Blows dust out of heatsinks and filters. Hold the fans so they do not get damaged.",
    pc3d_tool_brush_title: "Anti-static brush",
    pc3d_tool_brush_desc: "Loosens dust stuck in slots, grilles and delicate surfaces without scratching circuits.",
    pc3d_tool_paste_title: "Thermal paste",
    pc3d_tool_paste_desc: "Improves contact between CPU and cooler. Apply a small amount on the clean surface.",
    pc3d_tool_cloth_title: "Microfiber cloth",
    pc3d_tool_cloth_desc: "Cleans the case, glass and peripherals lint-free and without applying liquids directly.",
    pc3d_tool_ties_title: "Cable ties and velcro",
    pc3d_tool_ties_desc: "Tidy the cabling and keep airflow clear inside the case.",
    pc3d_partfunc_motherboard: "Connects all components and lets them exchange data.",
    pc3d_partfunc_ram: "Temporarily holds the data of the programs in use.",
    pc3d_partfunc_cpu: "Runs instructions, calculations and coordinates the computer's operations.",
    pc3d_partfunc_gpu: "Processes graphics, video, 3D rendering and artificial intelligence.",
    pc3d_partfunc_storage: "Stores the operating system, apps and files permanently.",
    pc3d_partfunc_psu: "Converts current and delivers stable voltages to each part.",
    pc3d_partfunc_optical: "Reads and burns data on CD, DVD and Blu-ray discs with an optical laser.",
    pc3d_parttypes_motherboard: "ATX · Micro-ATX · Mini-ITX",
    pc3d_parttypes_ram: "DDR3 · DDR4 · DDR5 · DIMM",
    pc3d_parttypes_cpu: "Intel · AMD · x86 · x64",
    pc3d_parttypes_gpu: "Integrated · Dedicated · GDDR6 · PCIe",
    pc3d_parttypes_storage: "HDD · SSD SATA · M.2 NVMe",
    pc3d_parttypes_psu: "ATX · SFX · Bronze · Silver · Gold · Platinum · Titanium",
    pc3d_parttypes_optical: "CD · DVD · Blu-ray · SATA",
    caption_mb: "Layout and distribution of sockets, PCIe slots, chipset and connectors on a modern motherboard.",
    caption_cpu: "High-performance multicore microprocessor with integrated heat spreader (IHS).",
    caption_ram: "DIMM memory module with DRAM chips and gold contacts for high-speed bus connection.",
    caption_storage: "Modern solid-state drive in M.2 NVMe format connected directly via PCIe lanes.",
    caption_nic: "PCIe network interface card (NIC) with Gigabit Ethernet RJ45 port and controller chip.",
    caption_psu: "Modular ATX power supply with cooling fan and power connectors for motherboard and components.",
    btn_view_component_img: "View image and info",
    btn_hide_component_img: "Hide image",
    page_title_index: "NVISION - Hardware and Computers",
    page_title_hardware: "NVISION - Hardware and Evolution",
    page_title_redes: "NVISION - Networks and Simulation",
    page_title_recursos: "NVISION - Learning Resources",
    page_title_pc3d: "NVISION - PC3D and more",
    page_title_wifi: "NVISION - Advanced WiFi",
    pc3d_footer: "© 2026 - NVISION / PC3D and more",
    pc3d_type_integrated: "Integrated",
    pc3d_type_dedicated: "Dedicated",
    pc3d_type_aircooler: "Air cooler",
    pc3d_type_aio: "Liquid AIO",
    theme_toggle_title: "Change theme",
    menu_toggle_title: "Open menu",
    assistant_toggle_title: "Open assistant",
    page_title_ms: "NVISION - Preventive software maintenance",
    ms_eyebrow: "Maintenance / By software",
    ms_title: "Preventive software maintenance",
    ms_desc: "It is the care you give without opening the computer: updating, protecting, cleaning, backing up and checking the system before it fails. Done well, it prevents viruses, slowness, errors and data loss, and extends the computer's useful life.",
    ms_btn_tasks: "See the 6 tasks",
    ms_btn_routine: "See the routine",
    ms_hero_caption: "Software is what organizes all the hardware: if it is outdated or messy, even a good computer becomes slow and unsafe.",
    ms_stat1: "essential tasks, in order and without expensive tools",
    ms_stat2: "golden rule: first the backup, then any change",
    ms_stat3: "frequencies: weekly, monthly, quarterly and half-yearly",
    ms_que_kicker: "01 / What it is",
    ms_que_title: "Prevention is cheaper than repair",
    ms_que_desc: "Preventive software maintenance does not wait for the computer to break down. It is scheduled checks of the operating system, programs, drivers, security and files, to catch problems while they are still small.",
    ms_benefit_label: "Benefit",
    ms_benefit1_title: "Fewer crashes and blue screens",
    ms_benefit1_desc: "Correct updates and drivers fix known errors and improve compatibility between the system and the hardware.",
    ms_benefit2_title: "More speed and space",
    ms_benefit2_desc: "Deleting temporary files, unused programs and unnecessary startup processes frees disk, memory and boot time.",
    ms_benefit3_title: "More security and peace of mind",
    ms_benefit3_desc: "An updated antivirus, strong passwords and backups protect your files from viruses, ransomware and human error.",
    ms_tasks_kicker: "02 / The 6 tasks",
    ms_tasks_title: "Everything to check, without getting lost",
    ms_tasks_desc: "Each card is a complete task: what it is, what to do and how often. Always start with a backup if you are going to update or clean something important.",
    ms_freq_label: "Frequency:",
    ms_task1_badge: "Task 01",
    ms_task1_title: "Update the system and apps",
    ms_task1_desc: "Updates close security holes and fix errors. An old program is an open door.",
    ms_task1_li1: "Turn on automatic operating system updates.",
    ms_task1_li2: "Update your browser, office software and other programs from their official sites.",
    ms_task1_li3: "Restart after updating so the changes apply properly.",
    ms_task1_freq: "weekly, or whenever the system asks for it.",
    ms_task2_badge: "Task 02",
    ms_task2_title: "Up-to-date drivers",
    ms_task2_desc: "Drivers are the translator between the system and each part: video, network, sound and chipset. If they fail, you get black screens, unstable Wi-Fi or lost sound.",
    ms_task2_li1: "Download them only from the computer or component manufacturer.",
    ms_task2_li2: "Prioritize video, network and chipset; do not install driver packs from dubious sites.",
    ms_task2_li3: "If something gets worse after updating, roll back to the previous driver.",
    ms_task2_freq: "monthly, or when something stops working.",
    ms_task3_badge: "Task 03",
    ms_task3_title: "Antivirus and antimalware protection",
    ms_task3_desc: "Antivirus detects and blocks viruses, spyware and ransomware before they damage files or steal data.",
    ms_task3_li1: "Keep a single antivirus active and updated, not two at once.",
    ms_task3_li2: "Run a quick scan weekly and a full scan monthly.",
    ms_task3_li3: "Do not open suspicious attachments or links, even if they seem to come from someone you know.",
    ms_task3_freq: "quick scan weekly, full scan monthly.",
    ms_task4_badge: "Task 04",
    ms_task4_title: "Digital cleaning and tidiness",
    ms_task4_desc: "Temporary files, old downloads and unused programs take up disk space and slow down startup and searches.",
    ms_task4_li1: "Delete temporary files, trash and downloads you no longer need.",
    ms_task4_li2: "Uninstall programs you do not use from the system's official panel.",
    ms_task4_li3: "Check which programs start with the computer and disable the unnecessary ones.",
    ms_task4_freq: "monthly.",
    ms_task5_badge: "Task 05",
    ms_task5_title: "Backups and restore",
    ms_task5_desc: "A backup is insurance for your files: if the disk fails or a virus gets in, you can go back without losing work, photos or documents.",
    ms_task5_li1: "Apply the 3-2-1 rule: 3 copies, on 2 different media, 1 off-site or in the cloud.",
    ms_task5_li2: "Automate backups so you do not depend on remembering.",
    ms_task5_li3: "Check from time to time that the backup can really be opened and restored.",
    ms_task5_freq: "automatic weekly; check quarterly.",
    ms_task6_badge: "Task 06",
    ms_task6_title: "System optimization and health",
    ms_task6_desc: "Checking space, disk health and background programs keeps the computer stable and stops a small problem becoming a failure.",
    ms_task6_li1: "Keep at least 15–20% of the disk free.",
    ms_task6_li2: "Check the disk's SMART health and the computer's temperature.",
    ms_task6_li3: "If the computer is slow, first check startup, a full disk and background programs.",
    ms_task6_freq: "monthly; disk health quarterly.",
    ms_routine_kicker: "03 / Recommended routine",
    ms_routine_title: "A short routine you will actually follow",
    ms_routine_desc: "You do not need to do everything every day. With this calendar, the computer stays healthy without spending hours on it.",
    ms_table_h1: "When",
    ms_table_h2: "What to do",
    ms_table_h3: "Why",
    ms_row1_when: "Weekly",
    ms_row1_what: "Update system and programs · Quick antivirus scan · Check that the automatic backup ran",
    ms_row1_why: "It is the basic defense against viruses and new errors.",
    ms_row2_when: "Monthly",
    ms_row2_what: "Clean temporary files and downloads · Uninstall what you do not use · Full antivirus scan · Check startup and free space",
    ms_row2_why: "It recovers speed and stops the disk filling up.",
    ms_row3_when: "Quarterly",
    ms_row3_what: "Check drivers · Disk SMART health · Test that a backup can be restored · Check important passwords",
    ms_row3_why: "It detects wear and faults before you lose data.",
    ms_row4_when: "Half-yearly",
    ms_row4_what: "Full check: system, security, backups, space and programs · Change weak or repeated passwords",
    ms_row4_why: "It leaves the computer like new, without reinstalling just for fun.",
    ms_steps_kicker: "04 / Step by step",
    ms_steps_title: "The safe order, in 6 steps",
    ms_steps_desc: "If you only have half an hour, follow this order: protect first, clean afterwards and check at the end.",
    ms_step1_title: "Back up before touching anything",
    ms_step1_desc: "Save documents, work and photos to the cloud or an external disk before updating or cleaning.",
    ms_step2_title: "Update the system and programs",
    ms_step2_desc: "Install pending updates from official sources and restart the computer.",
    ms_step3_title: "Run the antivirus",
    ms_step3_desc: "Run a full scan and follow its advice: quarantine or removal, never ignore an alert.",
    ms_step4_title: "Clean temporary files and programs",
    ms_step4_desc: "Delete what is unnecessary and uninstall what you do not use. Do not delete system folders you do not recognize.",
    ms_step5_title: "Check startup and space",
    ms_step5_desc: "Turn off unnecessary automatic startup and leave at least 15–20% of the disk free.",
    ms_step6_title: "Restart and check",
    ms_step6_desc: "Open your usual programs, check Wi-Fi, sound and files, and confirm the backup is up to date.",
    ms_alerts_kicker: "05 / Warnings",
    ms_alerts_title: "Signs that something is wrong, and what not to do",
    ms_alert_warn_title: "Get it checked if you notice…",
    ms_alert_warn_li1: "Windows or ads appearing on their own, or the browser changing search engine.",
    ms_alert_warn_li2: "The computer overheats, shuts down on its own or takes much longer than before.",
    ms_alert_warn_li3: "Files disappearing, changing name or asking for a ransom to open them.",
    ms_alert_warn_li4: "The disk is always full or at 100% for no apparent reason.",
    ms_alert_ok_title: "What never to do",
    ms_alert_ok_li1: "Do not install two antivirus programs at once: they fight each other and leave gaps.",
    ms_alert_ok_li2: "Do not download programs, drivers or “optimizers” from pirate sites.",
    ms_alert_ok_li3: "Do not delete system or registry files if you do not know what they do.",
    ms_alert_ok_li4: "Do not ignore backups: a computer without a backup is a lost file waiting to happen.",
    ms_credit: "Images: Unsplash (circuit board, laptop with code and laptop in the dark), MakeUseOf (antivirus scan), Avast (disk cleaning) and Telkom University (cloud backup). Images load from their original sites, as in the rest of NVISION.",
    ms_prog_kicker: "06 / Recommended programs",
    ms_prog_title: "The best programs, ranked straight",
    ms_prog_desc: "You do not need to install ten programs. This ranking uses three clear criteria: Best is the overall rating for preventive maintenance, Cost is what you pay for basic use, and Efficiency is how light and fast it runs on a normal computer. The stars are a guide, not a laboratory test: the best program is the one you will keep updated.",
    ms_prog_note: "How to read the table: ★★★★★ is excellent, ★★★★☆ is very good and ★★★☆☆ is fine, but with limits. “Free” means basic use costs nothing; some offer a paid version with more features.",
    ms_prog_best_badge: "🏆 Best overall",
    ms_prog_best_desc: "It already comes with Windows, updates itself and protects all the time without installing anything extra or paying anything. For most users, it is the right foundation.",
    ms_prog_best_tag: "Free · Built into Windows · Always active",
    ms_prog_cost_badge: "💰 Best value",
    ms_prog_cost_desc: "The zero-cost combination: Defender protects and BleachBit cleans temporary files with no ads, no subscription and no extra weight. Ideal if you do not want to spend anything.",
    ms_prog_cost_tag: "Total cost: 0 · Open source · No subscription",
    ms_prog_eff_badge: "⚡ Most efficient",
    ms_prog_eff_desc: "They only work when asked: Winget updates programs in a moment and CrystalDiskInfo checks disk health without staying in the background consuming resources.",
    ms_prog_eff_tag: "Almost no consumption · Fast · Not resident",
    ms_prog_th_prog: "Program",
    ms_prog_th_use: "What it is for",
    ms_prog_th_best: "Best",
    ms_prog_th_cost: "Cost",
    ms_prog_th_eff: "Efficiency",
    ms_prog_th_for: "Best for",
    ms_prog_p1_use: "Antivirus and real-time protection",
    ms_prog_p1_cost: "Free, built into Windows",
    ms_prog_p1_eff: "High",
    ms_prog_p1_for: "All Windows users",
    ms_prog_p2_use: "Second-opinion antimalware, on-demand scans",
    ms_prog_p2_cost: "Free, with a paid Pro version",
    ms_prog_p2_eff: "High",
    ms_prog_p2_for: "Checking a computer suspected of infection",
    ms_prog_p3_use: "Update many programs at once from Windows",
    ms_prog_p3_cost: "Free, built into Windows",
    ms_prog_p3_eff: "High",
    ms_prog_p3_for: "Keeping programs updated without searching one by one",
    ms_prog_p4_use: "Update the system and basic drivers",
    ms_prog_p4_cost: "Free, built into Windows",
    ms_prog_p4_eff: "High",
    ms_prog_p4_for: "The foundation of all maintenance, no exception",
    ms_prog_p5_use: "Clean temporary files, cache and useless files",
    ms_prog_p5_cost: "Free, open source",
    ms_prog_p5_eff: "High, very light",
    ms_prog_p5_for: "Slow computers and users who do not want to pay",
    ms_prog_p6_use: "Cleaning and startup management, with more options",
    ms_prog_p6_cost: "Free, with a paid Pro version",
    ms_prog_p6_eff: "Medium",
    ms_prog_p6_for: "Anyone who wants guided cleaning, without touching the registry",
    ms_prog_p7_use: "Check disk SMART health and temperature",
    ms_prog_p7_cost: "Free",
    ms_prog_p7_eff: "High, very light",
    ms_prog_p7_for: "Spotting a failing disk before losing data",
    ms_prog_p8_use: "Full system and file backup",
    ms_prog_p8_cost: "Free for basic use",
    ms_prog_p8_eff: "Medium, the first backup takes longer",
    ms_prog_p8_for: "Protecting work, photos and important documents",
    ms_prog_pick1_badge: "If you do not want to spend anything",
    ms_prog_pick1_title: "Defender + Winget + BleachBit",
    ms_prog_pick1_desc: "Protection, updates and cleaning for 0, with official or open-source programs. Add CrystalDiskInfo every three months and your routine is covered.",
    ms_prog_pick2_badge: "If you want it automatic",
    ms_prog_pick2_title: "Defender + automatic backup",
    ms_prog_pick2_desc: "Leave automatic updates on and schedule your backup. Maintenance that does not depend on remembering is the maintenance that actually happens.",
    ms_prog_pick3_badge: "If your computer is old or slow",
    ms_prog_pick3_title: "Fewer programs, more efficiency",
    ms_prog_pick3_desc: "Avoid heavy suites and two antivirus programs at once. Stick with Defender, light cleaning and disk checks: every extra resident program takes speed away.",
    ms_prog_credit: "Final tip: download each program only from its official site or from Windows. An “optimizer” from a pirate site can be just the opposite: the program that infects your computer.",
    assistant_close_title: "Close"
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

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][key]) el.setAttribute('placeholder', translations[lang][key]);
  });

  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (translations[lang] && translations[lang][key]) {
      el.setAttribute('title', translations[lang][key]);
      el.setAttribute('aria-label', translations[lang][key]);
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
  document.querySelectorAll('.copy-btn').forEach((copyBtn) => {
    const targetId = copyBtn.dataset.copyTarget || (copyBtn.id === 'copy-code-btn' ? 'ps-code' : null);
    if (!targetId) return;
    const codeElem = document.getElementById(targetId);
    if (!codeElem) return;

    copyBtn.addEventListener('click', () => {
      const textToCopy = codeElem.textContent.trim();
      navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.textContent = translations[currentLang].copied_code;
        setTimeout(() => {
          copyBtn.textContent = translations[currentLang].copy_code;
        }, 2000);
      });
    });
  });
}

function setupDetector() {
  const btn = document.getElementById('detect-btn');
  const box = document.getElementById('detect-results');
  if (!btn || !box) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  btn.addEventListener('click', async () => {
    const t = translations[currentLang];
    const na = t.detect_na;
    let os = na, browser = na;
    const ua = navigator.userAgent || '';

    if (navigator.userAgentData) {
      try {
        const hints = await navigator.userAgentData.getHighEntropyValues(['platform']);
        if (hints.platform) os = hints.platform;
        const brands = navigator.userAgentData.brands || [];
        const main = brands.find(b => /Chrome|Edge|Opera/i.test(b.brand));
        if (main) browser = main.brand.replace('Google ', '') + ' ' + main.version;
      } catch (e) { /* se usa el UA clasico */ }
    }
    if (os === na) {
      if (/Windows NT 10/.test(ua)) os = 'Windows 10/11';
      else if (/Windows/.test(ua)) os = 'Windows';
      else if (/Android/.test(ua)) os = 'Android';
      else if (/iPhone|iPad/.test(ua)) os = 'iOS';
      else if (/Mac OS X/.test(ua)) os = 'macOS';
      else if (/Linux/.test(ua)) os = 'Linux';
    }
    if (browser === na) {
      let m;
      if ((m = ua.match(/Edg\/([\d.]+)/))) browser = 'Edge ' + m[1].split('.')[0];
      else if ((m = ua.match(/OPR\/([\d.]+)/))) browser = 'Opera ' + m[1].split('.')[0];
      else if ((m = ua.match(/Chrome\/([\d.]+)/))) browser = 'Chrome ' + m[1].split('.')[0];
      else if ((m = ua.match(/Firefox\/([\d.]+)/))) browser = 'Firefox ' + m[1].split('.')[0];
      else if (/Safari\//.test(ua)) browser = 'Safari';
    }
    set('det-os', os);
    set('det-browser', browser);
    set('det-cores', navigator.hardwareConcurrency ? String(navigator.hardwareConcurrency) : na);
    set('det-ram', navigator.deviceMemory ? '\u2248 ' + navigator.deviceMemory + ' GB' : na);

    let gpu = na;
    try {
      const cv = document.createElement('canvas');
      const gl = cv.getContext('webgl') || cv.getContext('experimental-webgl');
      if (gl) {
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const raw = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
        if (raw && /brave/i.test(String(raw))) {
          gpu = t.detect_gpu_private;
        } else if (raw) {
          let g = String(raw).replace(/^ANGLE \(/, '').replace(/\)$/, '');
          const parts = g.split(',').map(x => x.trim());
          g = (parts[1] || parts[0] || g).replace(/\s*\(0x[0-9a-fA-F]+\)/, '').replace(/\s+Direct3D.*$/, '').replace(/\s+OpenGL.*$/, '').trim();
          if (g) gpu = g;
        }
      }
    } catch (e) { /* sin WebGL */ }
    set('det-gpu', gpu);
    set('det-screen', screen.width + ' \u00d7 ' + screen.height + ' px');

    if (navigator.getBattery) {
      navigator.getBattery()
        .then(b => set('det-battery', Math.round(b.level * 100) + '%' + (b.charging ? ' (' + t.detect_charging + ')' : '')))
        .catch(() => set('det-battery', na));
    } else set('det-battery', na);

    box.hidden = false;
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
  const currentTheme = savedTheme || 'light';
  
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

function setupLocalAssistant() {
  if (document.querySelector('.local-assistant')) return;

  /* ===== Base de conocimiento entrenada (modelo tipo FinBot) =====
     c = categoría · k = formas de preguntar (ES/EN) · r = respuesta [ES, EN] · href = sección del sitio */
  const KB = [
{ c: 'Hardware', k: ['que es el socket', 'socket del procesador', 'socket cpu'], r: ['El **socket** es el conector de la placa base donde encaja el procesador. Cada generación usa un socket distinto: por eso no puedes poner cualquier CPU en cualquier placa, aunque se vean iguales.', 'The **socket** is the motherboard connector where the processor fits. Each generation uses a different socket: that is why you cannot put any CPU in any board, even if they look alike.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es overclock', 'overclocking', 'overclock cpu'], r: ['El **overclocking** es forzar al procesador (o la GPU) a correr por encima de su frecuencia de fábrica para ganar rendimiento. Da más velocidad, pero también más calor y consumo, y puede acortar la vida del componente si no se refrigera bien.', '**Overclocking** means pushing the processor (or GPU) above its factory frequency for extra performance. It gives more speed, but also more heat and power draw, and it can shorten the component\u2019s life without good cooling.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es el tdp', 'tdp procesador', 'tdp que significa'], r: ['El **TDP** (Thermal Design Power) es el calor máximo, en vatios, que un procesador o GPU genera en uso típico. Sirve para elegir refrigeración y fuente: un TDP alto pide mejor disipador y más vatios.', '**TDP** (Thermal Design Power) is the maximum heat, in watts, a processor or GPU generates under typical load. It tells you which cooling and PSU you need: a high TDP demands a better cooler and more watts.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es la cache del procesador', 'cache l1 l2 l3', 'memoria cache cpu'], r: ['La **caché** es una memoria diminuta y ultra rápida dentro del procesador, en niveles **L1, L2 y L3**: guarda los datos que la CPU usa una y otra vez para no ir a buscarlos a la RAM, que es más lenta.', '**Cache** is a tiny, ultra-fast memory inside the processor, in **L1, L2 and L3** levels: it holds the data the CPU reuses constantly so it does not have to fetch it from the slower RAM.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['frecuencia base y boost', 'frecuencia boost cpu', 'ghz base boost'], r: ['La **frecuencia base** es la velocidad normal del procesador (en GHz) y la **boost** es la velocidad máxima que alcanza por momentos cuando hay trabajo pesado y temperatura de sobra. Más GHz no siempre es más rápido: también importan núcleos y arquitectura.', '**Base frequency** is the processor\u2019s normal speed (in GHz) and **boost** is the maximum speed it reaches briefly under heavy work when temperature allows. More GHz is not always faster: cores and architecture matter too.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['grafica integrada en el procesador', 'igpu', 'que es igpu'], r: ['La **iGPU** es la tarjeta gráfica integrada dentro del procesador: no tiene VRAM propia y usa parte de la RAM. Sirve para ofimática, video y juegos livianos; para juegos exigentes hace falta una GPU dedicada.', 'An **iGPU** is the graphics chip built into the processor: it has no VRAM of its own and borrows system RAM. It handles office work, video and light games; demanding games need a dedicated GPU.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['como elegir un procesador', 'que cpu elegir', 'elegir cpu por uso', 'como elijo un procesador'], r: ['Para elegir CPU piensa en el uso: ofimática y estudio van bien con 4-6 núcleos; juegos, 6-8; edición y streaming, 8 o más. Revisa que el **socket** sea compatible con tu placa y que tu refrigeración aguante su TDP.', 'To pick a CPU, think about the use: office and study do fine with 4-6 cores; gaming, 6-8; editing and streaming, 8 or more. Check the **socket** matches your board and your cooling handles its TDP.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es el cuello de botella', 'bottleneck', 'cuello de botella pc'], r: ['El **cuello de botella** pasa cuando un componente frena a los demás: por ejemplo, una GPU potente con un CPU viejo rinde menos de lo que debería, porque el CPU no le entrega datos a tiempo.', 'A **bottleneck** happens when one component holds the rest back: for example, a powerful GPU with an old CPU performs below its potential, because the CPU cannot feed it data fast enough.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es dual channel', 'doble canal ram', 'dual channel memoria'], r: ['El **dual channel** (doble canal) es usar dos módulos de RAM iguales en los slots correctos para que trabajen en paralelo: el ancho de banda se duplica frente a un solo módulo y el equipo responde mejor, sobre todo con gráfica integrada.', '**Dual channel** means using two identical RAM sticks in the right slots so they work in parallel: bandwidth doubles versus a single stick and the machine feels faster, especially with integrated graphics.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['latencia cl ram', 'que es cl en ram', 'latencia de la memoria'], r: ['La **latencia CL** (CAS Latency) es el retraso de la RAM al responder: a menor número, más rápida. Se combina con la frecuencia: una RAM de muchos MHz pero CL alto no siempre gana a una de menos MHz con CL bajo.', '**CL latency** (CAS Latency) is the RAM\u2019s delay when responding: lower is faster. It pairs with frequency: high-MHz RAM with high CL does not always beat lower-MHz RAM with low CL.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es so-dimm', 'so-dimm vs dimm', 'ram de portatil'], r: ['La **SO-DIMM** es la versión pequeña de la RAM, usada en portátiles y mini PC; la **DIMM** es la grande, de escritorio. No son intercambiables: cada placa acepta un tamaño.', '**SO-DIMM** is the small RAM format used in laptops and mini PCs; **DIMM** is the full-size desktop one. They are not interchangeable: each board takes one size.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es la memoria virtual', 'memoria virtual paginacion', 'archivo de paginacion'], r: ['La **memoria virtual** es espacio del disco que el sistema usa como RAM de emergencia cuando la RAM real se llena. Evita cierres, pero es mucho más lenta: si el equipo vive paginando, lo que falta es RAM física.', '**Virtual memory** is disk space the system uses as emergency RAM when real RAM fills up. It prevents crashes, but it is far slower: if the machine pages constantly, what it really needs is more physical RAM.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es el tbw', 'tbw ssd vida util', 'duracion de un ssd'], r: ['El **TBW** (terabytes escritos) es la cantidad total de datos que un SSD aguanta escribir antes de que el fabricante deje de garantizarlo: mide su vida útil. Para uso normal, un SSD dura años antes de acercarse a su TBW.', '**TBW** (terabytes written) is the total data an SSD can be written before the maker stops warranting it: it measures its lifespan. Under normal use, an SSD lasts years before getting near its TBW.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es una particion de disco', 'particionar disco', 'particion'], r: ['Una **partición** es una división lógica del disco: el sistema la ve como si fueran discos separados (C:, D:). Sirve para separar sistema y datos, o para tener dos sistemas en el mismo disco.', 'A **partition** is a logical split of a disk: the system sees it as separate drives (C:, D:). It separates system from data, or lets two systems share one disk.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['ntfs fat32 exfat', 'sistemas de archivos', 'ntfs o exfat'], r: ['El **sistema de archivos** organiza cómo se guardan los datos: **NTFS** es el de Windows (archivos grandes, permisos), **FAT32** es viejo y universal (límite de 4 GB por archivo) y **exFAT** es el moderno para USB que se mueven entre Windows y Mac.', 'A **file system** organizes how data is stored: **NTFS** is Windows\u2019 (big files, permissions), **FAT32** is old and universal (4 GB per-file limit) and **exFAT** is the modern one for USB drives shared between Windows and Mac.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es clonar un disco', 'clonar disco ssd', 'copiar disco completo'], r: ['**Clonar un disco** es copiarlo entero, sistema y programas incluidos, a otro disco. Es la forma de pasar de HDD a SSD sin reinstalar nada: el equipo arranca igual, pero más rápido.', '**Cloning a disk** means copying it entirely, system and programs included, to another disk. It is how you move from HDD to SSD without reinstalling anything: the machine boots the same, just faster.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['m.2 sata o nvme', 'm2 sata vs nvme', 'diferencia m2 sata nvme'], r: ['El conector **M.2** acepta dos tipos de SSD: **SATA** (hasta ~550 MB/s) y **NVMe** (varios GB/s por PCIe). Se ven iguales por fuera: revisa que tu placa soporte NVMe antes de comprar, o pagarás velocidad que no vas a usar.', 'The **M.2** slot takes two SSD types: **SATA** (up to ~550 MB/s) and **NVMe** (several GB/s over PCIe). They look alike: check your board supports NVMe before buying, or you will pay for speed you cannot use.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['desfragmentar disco', 'desfragmentar hdd', 'trim ssd', 'desfragmentar ssd'], r: ['**Desfragmentar** reordena los datos de un HDD para que el cabezal los lea sin saltar: en HDD viejos se nota. En un SSD **no se desfragmenta**: el sistema usa **TRIM**, que avisa qué bloques ya no sirven para mantenerlo rápido.', '**Defragmenting** reorders HDD data so the head reads it without jumping: it helps old HDDs. An SSD is **never defragmented**: the system uses **TRIM**, which flags dead blocks to keep it fast.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es ray tracing', 'trazado de rayos', 'ray tracing gpu'], r: ['El **ray tracing** (trazado de rayos) simula cómo rebota la luz real en espejos, agua y sombras: los juegos se ven mucho más realistas, pero exige una GPU moderna y potente.', '**Ray tracing** simulates how real light bounces off mirrors, water and shadows: games look far more realistic, but it demands a modern, powerful GPU.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es dlss', 'dlss fsr', 'escalado dlss'], r: ['**DLSS** (NVIDIA) y **FSR** (AMD) son técnicas que renderizan el juego a menor resolución y lo escalan con inteligencia para que se vea casi igual pero con muchos más fotogramas por segundo. Son la razón por la que una GPU media hoy juega tan bien.', '**DLSS** (NVIDIA) and **FSR** (AMD) render games at lower resolution and upscale them smartly so they look nearly identical but with many more frames per second. They are why a mid-range GPU games so well today.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['tasa de refresco hz', 'que son los hz del monitor', '144 hz monitor'], r: ['La **tasa de refresco** (Hz) es cuántas veces por segundo el monitor redibuja la imagen: 60 Hz es lo normal, 144 Hz o más se siente mucho más fluido en juegos y al mover el mouse. Necesitas una GPU que genere esos fotogramas para notarlo.', '**Refresh rate** (Hz) is how many times per second the monitor redraws the image: 60 Hz is standard, 144 Hz or more feels far smoother in games and mouse movement. You need a GPU producing those frames to notice it.'] },
    { c: 'Hardware', k: ['resolucion 1080p 1440p 4k', 'que es 1080p', 'que es 4k'], r: ['La **resolución** es la cantidad de píxeles de la pantalla: **1080p** (1920×1080) es Full HD, **1440p** (2560×1440) es QHD y **4K** (3840×2160) es Ultra HD. Más resolución = imagen más nítida, pero también más trabajo para la GPU.', '**Resolution** is how many pixels the screen has: **1080p** (1920×1080) is Full HD, **1440p** (2560×1440) is QHD and **4K** (3840×2160) is Ultra HD. More resolution means a sharper image, but also more work for the GPU.'] },
    { c: 'Hardware', k: ['que es una fuente modular', 'fuente modular vs no modular', 'fuente de poder modular'], r: ['Una **fuente modular** deja desconectar los cables que no usas: el interior queda limpio, con mejor flujo de aire y más fácil de armar. La no modular trae todos los cables fijos, aunque sobren.', 'A **modular PSU** lets you unplug cables you do not use: the interior stays clean, with better airflow and an easier build. A non-modular one has every cable fixed, even the spare ones.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es un ups', 'ups o regulador', 'ups para pc'], r: ['Un **UPS** es una batería para tu PC: si se va la luz, te da minutos para guardar y apagar sin perder nada, y filtra picos de voltaje. Un regulador solo estabiliza el voltaje, sin batería.', 'A **UPS** is a battery for your PC: if power fails, it gives you minutes to save and shut down without losing anything, and it filters voltage spikes. A voltage regulator only stabilizes voltage, with no battery.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['atx microatx mini-itx', 'formatos de placa base', 'tamaños de placa madre'], r: ['Los **formatos de placa** son sus tamaños: **ATX** (grande, más ranuras), **microATX** (mediana, lo común) y **mini-ITX** (pequeña, para equipos compactos). El formato debe coincidir con el gabinete y con lo que quieras conectar.', '**Board form factors** are their sizes: **ATX** (big, more slots), **microATX** (medium, the common one) and **mini-ITX** (small, for compact builds). The form factor must match the case and what you plan to plug in.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es el chipset', 'chipset de la placa', 'chipset que hace'], r: ['El **chipset** es el conjunto de chips de la placa que conecta CPU, RAM, USB, SATA y PCIe: define qué procesadores, cuántos puertos y qué velocidades soporta tu placa. Dos placas con el mismo socket pueden diferir solo por el chipset.', 'The **chipset** is the board\u2019s chip set connecting CPU, RAM, USB, SATA and PCIe: it decides which processors, how many ports and which speeds your board supports. Two boards with the same socket may differ only by chipset.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es thermal throttling', 'limitacion termica', 'throttling cpu'], r: ['El **thermal throttling** es cuando CPU o GPU bajan su velocidad solos para no sobrecalentarse: el equipo se vuelve lento de repente en juegos o render. La causa suele ser polvo, pasta vieja o mala ventilación.', '**Thermal throttling** is when the CPU or GPU slows itself down to avoid overheating: the machine suddenly feels slow in games or rendering. The cause is usually dust, old paste or bad ventilation.'], href: 'pc3d.html#mantenimiento' },
    { c: 'Hardware', k: ['temperatura normal cpu gpu', 'cuantos grados debe tener el procesador', 'temperatura normal del pc'], r: ['Temperaturas orientativas: en reposo, CPU y GPU entre **30 y 50 °C**; con carga fuerte, **70-85 °C** es normal. Por encima de 90-95 °C el equipo baja velocidad para protegerse: toca limpiar y revisar ventilación.', 'Rough guide: at idle, CPU and GPU sit at **30-50 °C**; under heavy load, **70-85 °C** is normal. Above 90-95 °C the machine slows down to protect itself: time to clean and check ventilation.'], href: 'pc3d.html#mantenimiento' },
    { c: 'Hardware', k: ['cuando cambiar la pasta termica', 'cada cuanto pasta termica', 'duracion pasta termica'], r: ['La **pasta térmica** se cambia cada **2 a 4 años**, o antes si las temperaturas suben sin explicación. Es la que transfiere el calor del procesador al disipador: vieja y seca, enfría mucho peor.', '**Thermal paste** is replaced every **2 to 4 years**, or sooner if temperatures climb for no reason. It transfers heat from the processor to the cooler: old and dry, it cools far worse.'], href: 'pc3d.html#mantenimiento' },
    { c: 'Hardware', k: ['switch administrable vs no administrable', 'switch gestionable', 'switch administrable'], r: ['Un **switch administrable** se configura: VLAN, velocidad por puerto y seguridad; el **no administrable** solo conecta y listo. En casa basta el simple; en empresas se usa el administrable para separar redes y controlar tráfico.', 'A **managed switch** is configurable: VLANs, per-port speed and security; an **unmanaged** one just connects and works. At home the simple one is enough; companies use managed ones to separate networks and control traffic.'], href: 'redes.html#redes' },
    { c: 'Hardware', k: ['que es un punto de acceso', 'punto de acceso ap', 'access point'], r: ['Un **punto de acceso (AP)** es un equipo que crea una red WiFi donde ya hay red por cable: se conecta al switch o al módem y emite señal. No es un repetidor: usa cable hasta el punto, así que no pierde velocidad.', 'An **access point (AP)** creates a WiFi network where wired network already exists: it plugs into the switch or modem and broadcasts signal. It is not a repeater: it uses cable all the way, so it loses no speed.'], href: 'redes.html#redes' },
    { c: 'Hardware', k: ['teclado mecanico vs membrana', 'teclado mecanico', 'teclado de membrana'], r: ['El **teclado mecánico** usa un interruptor por tecla: tacto preciso, más ruido y más precio, y dura más. El de **membrana** es silencioso y barato, con una goma bajo las teclas, y es el común de oficina.', 'A **mechanical keyboard** has one switch per key: precise feel, more noise and higher price, and it lasts longer. A **membrane** one is quiet and cheap, with rubber under the keys, and it is the office standard.'] },
    { c: 'Hardware', k: ['que es el dpi del mouse', 'dpi mouse', 'dpi alto o bajo'], r: ['El **DPI** del mouse es su sensibilidad: cuántos puntos se mueve el cursor por cada pulgada que mueves el mouse. DPI alto = cursor muy rápido; en juegos se usa bajo con alfombrilla grande para apuntar con precisión.', '**Mouse DPI** is its sensitivity: how many points the cursor moves per inch you move the mouse. High DPI means a very fast cursor; gamers use low DPI with a big pad for precise aiming.'] },
    { c: 'Hardware', k: ['monitor ips tn va', 'panel ips vs tn vs va', 'que panel de monitor'], r: ['Los **paneles de monitor**: **IPS** (mejores colores y ángulos, lo común para todo), **TN** (más rápido y barato, colores peores, para e-sports) y **VA** (mejor contraste y negros, bueno para películas). Elige según uses color, velocidad o cine.', '**Monitor panels**: **IPS** (best colors and angles, the all-rounder), **TN** (fastest and cheapest, worse colors, for e-sports) and **VA** (best contrast and blacks, good for movies). Pick by whether you need color, speed or cinema.'] },
    { c: 'Hardware', k: ['que es hdr', 'hdr monitor', 'hdr que significa'], r: ['El **HDR** (alto rango dinámico) muestra a la vez zonas muy brillantes y muy oscuras con detalle: el sol no se quema en blanco ni la sombra se vuelve negra total. Necesitas contenido HDR y un monitor que lo soporte de verdad.', '**HDR** (high dynamic range) shows very bright and very dark areas together with detail: the sun does not blow out to white nor shadows to pure black. You need HDR content and a monitor that truly supports it.'] },
    { c: 'Hardware', k: ['hdmi displayport vga', 'hdmi o displayport', 'diferencia hdmi displayport'], r: ['**HDMI** es el conector universal de video y audio (TV y monitores), **DisplayPort** es el de PC para altas tasas de refresco y varias pantallas, y **VGA** es el viejo analógico, ya sin audio ni alta definición.', '**HDMI** is the universal video-and-audio connector (TVs and monitors), **DisplayPort** is the PC one for high refresh rates and multiple screens, and **VGA** is the old analog one, with no audio and no high definition.'] },
    { c: 'Hardware', k: ['que es usb-c', 'usb-c thunderbolt', 'usb tipo c'], r: ['El **USB-C** es el conector ovalado reversible que hoy usan celulares, portátiles y discos: carga, datos y video por el mismo cable. **Thunderbolt** usa ese mismo conector pero con mucha más velocidad, en equipos compatibles.', '**USB-C** is the reversible oval connector used today by phones, laptops and drives: charging, data and video over one cable. **Thunderbolt** uses the same connector but with far more speed, on compatible machines.'] },
    { c: 'Hardware', k: ['pila cmos post', 'que es cmos', 'que es el post arranque'], r: ['La **pila CMOS** mantiene la hora y la configuración de la placa cuando el PC está apagado. El **POST** es la autoprueba al encender: si algo falla, la placa pita o muestra un código antes de arrancar el sistema.', 'The **CMOS battery** keeps the board\u2019s clock and settings while the PC is off. **POST** is the self-test at power-on: if something fails, the board beeps or shows a code before booting the system.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es uefi', 'bios vs uefi', 'uefi que es'], r: ['La **UEFI** es la sucesora moderna de la BIOS: arranca más rápido, soporta discos de más de 2 TB y mouse en su menú, y trae Secure Boot. La BIOS vieja (Legacy) quedó para equipos antiguos.', '**UEFI** is the modern successor to BIOS: faster boot, support for disks over 2 TB and mouse in its menu, plus Secure Boot. The old Legacy BIOS remains only for ancient machines.'], href: 'hardware.html#componentes' },
    { c: 'Redes', k: ['que es el modelo osi', 'modelo osi 7 capas', 'capas osi'], r: ['El **modelo OSI** describe la comunicación en 7 capas: física, enlace, red, transporte, sesión, presentación y aplicación. Sirve para ubicar dónde falla algo: ¿es el cable (física), la MAC (enlace), la IP (red) o el programa (aplicación)?', 'The **OSI model** describes communication in 7 layers: physical, link, network, transport, session, presentation and application. It locates failures: is it the cable (physical), the MAC (link), the IP (network) or the program (application)?'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['modelo tcp ip', 'modelo tcp ip 4 capas', 'tcp ip capas'], r: ['El **modelo TCP/IP** es el que usa internet de verdad, con 4 capas: acceso a la red, internet (IP), transporte (TCP/UDP) y aplicación (HTTP, DNS, correo). Es la versión práctica del modelo OSI.', 'The **TCP/IP model** is the one the real internet uses, with 4 layers: network access, internet (IP), transport (TCP/UDP) and application (HTTP, DNS, mail). It is OSI\u2019s practical version.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['puertos tcp udp', 'puertos 80 443', 'que son los puertos de red'], r: ['Los **puertos** son números que dicen a qué servicio va un paquete dentro de un equipo: **80** (web HTTP), **443** (web segura HTTPS), **53** (DNS) y **22** (SSH). La IP llega al equipo; el puerto, al programa.', '**Ports** are numbers telling which service a packet goes to inside a machine: **80** (HTTP web), **443** (secure HTTPS web), **53** (DNS) and **22** (SSH). The IP reaches the machine; the port reaches the program.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['http vs https', 'diferencia http https', 'https que es'], r: ['**HTTP** es el protocolo de la web sin cifrar: cualquiera en el camino puede leerlo. **HTTPS** es el mismo, pero cifrado con TLS (el candado del navegador): protege contraseñas y datos. Hoy casi toda la web usa HTTPS.', '**HTTP** is the web protocol, unencrypted: anyone in the middle can read it. **HTTPS** is the same, but encrypted with TLS (the browser padlock): it protects passwords and data. Today nearly the whole web uses HTTPS.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['que es ftp', 'ftp para que sirve', 'protocolo ftp'], r: ['El **FTP** es el protocolo clásico para transferir archivos entre un equipo y un servidor: subir una web o bajar archivos grandes. Hoy se prefiere su versión segura, SFTP, porque el FTP original viaja sin cifrar.', '**FTP** is the classic protocol for moving files between a machine and a server: uploading a website or downloading big files. Today its secure version, SFTP, is preferred, because original FTP travels unencrypted.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['que es ssh', 'ssh para que sirve', 'conexion ssh'], r: ['El **SSH** es el protocolo para administrar otro equipo por terminal de forma segura y cifrada: entras con usuario y clave (o llave) y ejecutas comandos como si estuvieras frente a él. Es el estándar para servidores.', '**SSH** is the protocol for managing another machine by terminal, securely and encrypted: you log in with user and password (or key) and run commands as if sitting in front of it. It is the server standard.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['que es un proxy', 'proxy que es', 'servidor proxy'], r: ['Un **proxy** es un intermediario: tus peticiones salen desde él, no desde tu equipo. Sirve para filtrar contenido, guardar caché o esconder tu IP, pero ve todo tu tráfico: solo usa proxies de confianza.', 'A **proxy** is a middleman: your requests leave from it, not from your machine. It filters content, caches or hides your IP, but it sees all your traffic: only use trusted proxies.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['que es una vpn', 'vpn para que sirve', 'vpn que significa'], r: ['Una **VPN** crea un túnel cifrado entre tu equipo y otro punto de internet: tu tráfico sale desde ahí, protegido de curiosos en redes públicas. No te hace anónimo total, pero sí mucho más seguro en WiFi abiertas.', 'A **VPN** builds an encrypted tunnel between your machine and another point on the internet: your traffic exits from there, shielded from snoopers on public networks. It does not make you fully anonymous, but far safer on open WiFi.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['que es un firewall', 'firewall que es', 'cortafuegos'], r: ['El **firewall** (cortafuegos) es el guardián que decide qué tráfico entra o sale según reglas: bloquea conexiones no pedidas y deja pasar las legítimas. Lo tienen tu sistema, tu módem y las empresas en equipos dedicados.', 'A **firewall** is the guard deciding which traffic enters or leaves by rules: it blocks unsolicited connections and lets legitimate ones through. Your system, your modem and companies (on dedicated boxes) all have one.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['que es nat', 'nat router', 'nat que significa'], r: ['El **NAT** es lo que hace tu router: todos tus equipos comparten una sola IP pública hacia internet, y el router recuerda a quién devolver cada respuesta. Por eso tu red local usa IPs privadas (192.168.x.x).', '**NAT** is what your router does: all your devices share one public IP toward the internet, and the router remembers who gets each reply. That is why your local network uses private IPs (192.168.x.x).'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['que es dhcp', 'dhcp que significa', 'dhcp servidor'], r: ['El **DHCP** es el servicio (normalmente del router) que reparte IPs automáticamente a cada equipo que se conecta: IP, máscara, puerta de enlace y DNS. Sin él, tendrías que configurar la IP de cada equipo a mano.', '**DHCP** is the service (usually on the router) that hands out IPs automatically to each connecting device: IP, mask, gateway and DNS. Without it, you would configure every device\u2019s IP by hand.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['ip publica vs privada', 'ip privada publica diferencia', 'ip publica que es'], r: ['Tu **IP privada** (192.168.x.x) solo vale dentro de tu red; tu **IP pública** es la que ve internet y la que te da tu proveedor. El router traduce entre ambas con NAT.', 'Your **private IP** (192.168.x.x) only works inside your network; your **public IP** is what the internet sees, given by your provider. The router translates between them with NAT.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['ip dinamica vs estatica', 'ip fija o dinamica', 'ip estatica que es'], r: ['Una **IP dinámica** cambia cada cierto tiempo (la da el DHCP) y una **estática** siempre es la misma. En casa casi todo es dinámico; los servidores usan estática para que siempre se les encuentre en la misma dirección.', 'A **dynamic IP** changes from time to time (DHCP gives it) and a **static** one is always the same. At home nearly everything is dynamic; servers use static IPs so they are always found at the same address.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['mascara de subred', 'que es cidr', 'mascara 255.255.255.0'], r: ['La **máscara de subred** (ej. 255.255.255.0 o /24) dice qué parte de la IP es la red y qué parte es el equipo. Con /24, los primeros 24 bits son la red y quedan 254 direcciones para equipos.', 'The **subnet mask** (e.g. 255.255.255.0 or /24) says which part of the IP is the network and which part is the device. With /24, the first 24 bits are the network, leaving 254 addresses for devices.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['que es la puerta de enlace', 'gateway que es', 'puerta de enlace red'], r: ['La **puerta de enlace** (gateway) es la IP de tu router dentro de tu red (normalmente 192.168.1.1): es la salida hacia internet. Si no la tienes bien configurada, hay red local pero no internet.', 'The **gateway** is your router\u2019s IP inside your network (usually 192.168.1.1): it is the exit to the internet. If it is misconfigured, you get local network but no internet.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['que es un dominio', 'dominio web', 'dominio .com'], r: ['Un **dominio** (ej. nvision.social) es el nombre fácil de recordar de un sitio: el DNS lo traduce a la IP del servidor. Los .com, .org o .co son solo terminaciones; el nombre lo eliges tú y se paga por año.', 'A **domain** (e.g. nvision.social) is a site\u2019s easy name: DNS translates it to the server\u2019s IP. Endings like .com, .org or .co are just suffixes; you pick the name and pay yearly.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['que es hosting', 'hosting web', 'alojamiento web'], r: ['El **hosting** es el alquiler del servidor donde vive tu página: guarda los archivos y los sirve cuando alguien entra a tu dominio. Sin hosting, tu web no está en internet.', '**Hosting** is renting the server where your page lives: it stores the files and serves them when someone visits your domain. Without hosting, your website is not on the internet.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['que es un servidor web', 'servidor web que hace', 'apache nginx'], r: ['Un **servidor web** es un programa (Apache, Nginx) que responde peticiones HTTP: cuando entras a una página, él te entrega sus archivos. Vive en un equipo siempre encendido, conectado a internet.', 'A **web server** is a program (Apache, Nginx) answering HTTP requests: when you visit a page, it hands you its files. It lives on a machine that is always on, connected to the internet.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['que es jitter', 'jitter red', 'jitter que significa'], r: ['El **jitter** es la variación del tiempo que tardan los paquetes en llegar: si unos llegan rápido y otros tarde, las llamadas y los juegos se entrecortan aunque la velocidad sea buena. Una red estable tiene jitter bajo.', '**Jitter** is the variation in how long packets take to arrive: if some arrive fast and others late, calls and games stutter even when speed is good. A stable network has low jitter.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['perdida de paquetes', 'packet loss', 'paquetes perdidos'], r: ['La **pérdida de paquetes** es el porcentaje de paquetes que nunca llega: con 0-1 % todo va bien; con más del 5 % hay cortes, voz robotizada y juegos con tirones. Se mide con ping y suele ser señal de cable, WiFi o proveedor con problemas.', '**Packet loss** is the percentage of packets that never arrive: at 0-1 % everything is fine; above 5 % you get drops, robotic voice and game stutter. It is measured with ping and usually signals cable, WiFi or provider trouble.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['que es qos', 'qos router', 'calidad de servicio qos'], r: ['El **QoS** (calidad de servicio) es la regla del router que prioriza tráfico importante (llamadas, juegos) sobre el resto (descargas): así una descarga no arruina tu partida ni tu clase en vivo.', '**QoS** (quality of service) is the router rule prioritizing important traffic (calls, games) over the rest (downloads): so a download does not ruin your match or live class.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['fibra optica vs cobre', 'fibra optica que es', 'fibra o cobre internet'], r: ['La **fibra óptica** lleva internet con pulsos de luz por hilos de vidrio: es mucho más rápida y estable que el cobre (ADSL o coaxial) y no sufre interferencias eléctricas. Por eso los planes rápidos de hoy son de fibra.', '**Fiber optics** carries internet as light pulses through glass strands: it is far faster and steadier than copper (ADSL or coaxial) and immune to electrical interference. That is why today\u2019s fast plans are fiber.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['cat5e cat6 cat6a', 'categorias cable ethernet', 'cable cat6'], r: ['Las **categorías de cable** marcan su velocidad: **Cat5e** llega a 1 Gbps, **Cat6** a 10 Gbps en tramos cortos y **Cat6a** a 10 Gbps en 100 m. Para una casa, Cat6 sobra; lo importante es que el cable no sea el más barato y falso.', '**Cable categories** mark their speed: **Cat5e** reaches 1 Gbps, **Cat6** 10 Gbps over short runs and **Cat6a** 10 Gbps over 100 m. For a home, Cat6 is plenty; what matters is not buying the cheapest fake cable.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['broadcast unicast multicast', 'broadcast que es', 'unicast multicast diferencia'], r: ['**Unicast** es un mensaje de uno a uno, **broadcast** es de uno a todos en la red (como un anuncio) y **multicast** es de uno a un grupo que lo pidió (como un stream en vivo). El switch aprende con unicast y el broadcast lo inunda a todos.', '**Unicast** is one-to-one, **broadcast** is one-to-all on the network (like an announcement) and **multicast** is one-to-a-group that asked for it (like a live stream). The switch learns with unicast and floods broadcast to everyone.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['que es stp', 'spanning tree', 'stp switch bucles'], r: ['El **STP** (Spanning Tree) es el protocolo que evita **bucles** cuando hay dos caminos entre switches: bloquea uno de ellos para que las tramas no den vueltas infinitas y tumben la red. En redes con un solo switch no se nota.', '**STP** (Spanning Tree) is the protocol preventing **loops** when two paths join switches: it blocks one so frames do not circle forever and crash the network. Single-switch networks never notice it.'], href: 'redes.html#switch-3d' },
    { c: 'Redes', k: ['que es trunk', 'trunk vlan', 'enlace troncal vlan'], r: ['Un **trunk** (enlace troncal) es un cable entre switches que lleva varias VLAN a la vez, marcando cada trama con su VLAN. Sin trunk, cada VLAN necesitaría su propio cable entre switches.', 'A **trunk** is a link between switches carrying several VLANs at once, tagging each frame with its VLAN. Without trunks, each VLAN would need its own cable between switches.'], href: 'redes.html#switch-3d' },
    { c: 'Redes', k: ['half duplex full duplex', 'half duplex que es', 'full duplex que es'], r: ['En **half-duplex** un equipo habla o escucha, no las dos cosas a la vez (como un walkie-talkie); en **full-duplex** habla y escucha a la vez (como una llamada). Las redes modernas con switch usan full-duplex y por eso no hay colisiones.', 'In **half-duplex** a device talks or listens, not both at once (like a walkie-talkie); in **full-duplex** it talks and listens simultaneously (like a phone call). Modern switched networks use full-duplex, which is why there are no collisions.'], href: 'redes.html#switch-3d' },
    { c: 'Redes', k: ['filtrado mac', 'filtrado mac sirve', 'filtrar por mac wifi'], r: ['El **filtrado MAC** deja entrar a la WiFi solo a equipos con MAC autorizada. Suena seguro, pero la MAC se falsifica fácil: sirve como un candado extra, no como tu única protección. Lo que protege de verdad es una contraseña WPA2/WPA3 fuerte.', '**MAC filtering** lets only authorized MACs onto WiFi. It sounds secure, but MACs are easily faked: it works as an extra lock, not your only protection. What truly protects you is a strong WPA2/WPA3 password.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['ocultar ssid sirve', 'ssid oculto', 'ocultar nombre wifi'], r: ['**Ocultar el SSID** hace que tu WiFi no aparezca en la lista, pero cualquiera con una herramienta la ve igual: no es seguridad real. Lo que protege es una contraseña fuerte y WPA2/WPA3; ocultar el nombre solo incomoda a tus visitas.', '**Hiding the SSID** keeps your WiFi off the list, but anyone with a tool sees it anyway: it is not real security. What protects you is a strong password and WPA2/WPA3; hiding the name only inconveniences your guests.'], href: 'wifi.html#instalar-modem' },
    { c: 'Redes', k: ['que es wpa3', 'wpa3 vs wpa2', 'wpa3 seguridad wifi'], r: ['El **WPA3** es la seguridad WiFi actual: reemplaza a WPA2 con cifrado más fuerte por equipo y mejor protección contra adivinar contraseñas. Si tu módem y tus equipos lo soportan, úsalo; si no, WPA2 con clave larga sigue siendo seguro.', '**WPA3** is current WiFi security: it replaces WPA2 with stronger per-device encryption and better protection against password guessing. If your modem and devices support it, use it; otherwise WPA2 with a long password stays secure.'], href: 'wifi.html#instalar-modem' },
    { c: 'Redes', k: ['que es un troyano', 'troyano informatico', 'virus troyano'], r: ['Un **troyano** es malware disfrazado de programa legítimo: lo instalas creyendo que es un juego o un "optimizador" y por dentro abre la puerta a ladrones de datos. Por eso solo se descarga desde sitios oficiales.', 'A **trojan** is malware disguised as a legit program: you install it thinking it is a game or an "optimizer" and inside it opens the door to data thieves. That is why you only download from official sites.'], href: 'mantenimiento-software.html#tareas' },
    { c: 'Redes', k: ['que es un gusano informatico', 'gusano worm', 'worm malware'], r: ['Un **gusano (worm)** es malware que se copia solo de equipo en equipo por la red, sin que nadie lo instale. A diferencia del virus, no necesita un archivo huésped: se propaga aprovechando agujeros sin parchear, por eso importan las actualizaciones.', 'A **worm** is malware that copies itself from machine to machine over the network, with nobody installing it. Unlike a virus, it needs no host file: it spreads through unpatched holes, which is why updates matter.'], href: 'mantenimiento-software.html#tareas' },
{ c: 'WiFi', k: ['banda 6 ghz wifi', 'wifi 6 ghz', 'que es 6 ghz'], r: ['La **banda de 6 GHz** es la nueva autopista del WiFi 6E/7: más canales libres y menos vecinos que en 2.4 y 5 GHz, así que va más rápido y estable. Necesitas módem y equipos compatibles, y su alcance es menor que 5 GHz.', 'The **6 GHz band** is the new WiFi 6E/7 highway: more free channels and fewer neighbors than 2.4 and 5 GHz, so it runs faster and steadier. It needs compatible modem and devices, and its range is shorter than 5 GHz.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['wifi 5 6 6e 7', 'generaciones wifi', 'wifi 5 vs 6 vs 7'], r: ['Las **generaciones WiFi**: **WiFi 5** (802.11ac, solo 5 GHz), **WiFi 6** (802.11ax, 2.4 y 5 GHz, mejor con muchos equipos), **WiFi 6E** (añade 6 GHz) y **WiFi 7** (802.11be, más velocidad y menos latencia). Cada generación pide equipos compatibles para notarse.', '**WiFi generations**: **WiFi 5** (802.11ac, 5 GHz only), **WiFi 6** (802.11ax, 2.4 and 5 GHz, better with many devices), **WiFi 6E** (adds 6 GHz) and **WiFi 7** (802.11be, more speed and less latency). Each needs compatible gear to be noticed.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['que es mu-mimo', 'mu-mimo wifi', 'mu mimo que significa'], r: ['El **MU-MIMO** deja que el módem hable con varios equipos a la vez, en vez de turnarlos uno por uno. En casas con muchos celulares y TVs se nota: menos esperas cuando todos usan la red al mismo tiempo.', '**MU-MIMO** lets the modem talk to several devices at once instead of taking turns one by one. In homes with many phones and TVs it shows: less waiting when everyone uses the network simultaneously.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['roaming wifi', 'roaming wifi que es', 'cambiar de punto wifi'], r: ['El **roaming WiFi** es el cambio automático de tu equipo entre puntos de acceso (o nodos mesh) cuando te mueves por la casa: si funciona bien, no notas el salto; si falla, se cae la llamada al cambiar de punto.', '**WiFi roaming** is your device\u2019s automatic hop between access points (or mesh nodes) as you move around the house: when it works, you never notice; when it fails, the call drops mid-hop.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['red mesh vs repetidor', 'mesh o repetidor', 'malla wifi vs repetidor'], r: ['Una **red mesh** usa varios nodos que hablan entre sí y te pasan de uno a otro sin cortes; un **repetidor** solo reemite la señal y pierde velocidad. Para casas grandes, mesh es mejor; para un cuarto muerto, un repetidor basta.', 'A **mesh network** uses several nodes that talk to each other and hand you over without drops; a **repeater** just re-broadcasts the signal and loses speed. For big homes, mesh wins; for one dead room, a repeater is enough.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['que es wifi direct', 'wifi direct para que sirve', 'wifi directo'], r: ['El **WiFi Direct** conecta dos equipos sin módem ni router de por medio: sirve para mandar archivos del celular a la TV o a la impresora directo, como un Bluetooth pero más rápido.', '**WiFi Direct** connects two devices with no modem or router between: it sends files from phone to TV or printer directly, like Bluetooth but faster.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['hotspot celular', 'compartir internet celular', 'zona wifi celular'], r: ['El **hotspot del celular** comparte sus datos móviles como una WiFi para otros equipos: útil cuando no hay internet en casa, pero gasta batería y datos rápido, y la velocidad depende de tu señal móvil.', 'A **phone hotspot** shares its mobile data as WiFi for other devices: handy with no home internet, but it drains battery and data fast, and speed depends on your mobile signal.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['velocidad subida vs bajada', 'subida y bajada internet', 'upload download'], r: ['La **bajada (download)** es la velocidad para recibir (ver videos, descargar) y la **subida (upload)** para enviar (videollamadas, subir archivos). Los planes suelen dar más bajada que subida; para clases y streaming en vivo, la subida importa mucho.', '**Download** is the speed for receiving (watching videos, downloading) and **upload** for sending (video calls, uploading files). Plans usually give more download than upload; for live classes and streaming, upload matters a lot.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['test de velocidad', 'como medir mi internet', 'speed test'], r: ['Un **test de velocidad** mide bajada, subida y ping de tu conexión en ese momento. Hazlo por cable y cerca del módem para ver lo real; por WiFi lejos del módem, el número baja y eso no es culpa del proveedor.', 'A **speed test** measures your connection\u2019s download, upload and ping right now. Run it wired and near the modem for the real number; over WiFi far from the modem the number drops, and that is not the provider\u2019s fault.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['que es cgnat', 'doble nat', 'cgnat que es'], r: ['El **CGNAT** es cuando tu proveedor comparte una IP pública entre varios clientes: tu router ya hace NAT y el proveedor otro NAT encima (**doble NAT**). Por eso a veces no puedes abrir puertos ni jugar en línea con NAT abierta.', '**CGNAT** is when your provider shares one public IP among several customers: your router already NATs and the provider NATs again on top (**double NAT**). That is why sometimes you cannot open ports or get open NAT in online games.'], href: 'wifi.html#instalar-modem' },
    { c: 'Otro', k: ['que es el kernel', 'kernel sistema operativo', 'nucleo del sistema'], r: ['El **kernel** es el núcleo del sistema operativo: habla directo con el hardware y decide quién usa CPU, memoria y disco. Todo lo demás (programas, ventanas) le pide permiso a él.', 'The **kernel** is the operating system\u2019s core: it talks directly to hardware and decides who uses CPU, memory and disk. Everything else (programs, windows) asks it for permission.'] },
    { c: 'Otro', k: ['administrador de tareas', 'task manager', 'ver procesos windows'], r: ['El **Administrador de tareas** (Ctrl + Shift + Esc en Windows) muestra qué programas y procesos consumen CPU, RAM y disco en vivo: sirve para encontrar al culpable cuando el equipo va lento y para cerrar lo trabado.', 'The **Task Manager** (Ctrl + Shift + Esc on Windows) shows which programs and processes eat CPU, RAM and disk live: it finds the culprit when the machine drags and kills frozen apps.'] },
    { c: 'Otro', k: ['que es un proceso', 'proceso y servicio', 'proceso vs servicio'], r: ['Un **proceso** es un programa en ejecución; un **servicio** es un proceso de fondo sin ventana (actualizaciones, antivirus, red) que trabaja aunque no lo veas. Muchos servicios son del sistema y no deben cerrarse.', 'A **process** is a running program; a **service** is a background process with no window (updates, antivirus, network) working unseen. Many services belong to the system and must not be closed.'] },
    { c: 'Otro', k: ['que es firmware', 'firmware que es', 'actualizar firmware'], r: ['El **firmware** es el software grabado dentro de un equipo (módem, impresora, placa, control): le dice cómo funcionar. Actualizarlo corrige fallos y seguridad, igual que actualizar un programa, pero con más cuidado: no se debe apagar a mitad.', '**Firmware** is software baked into a device (modem, printer, board, controller) telling it how to work. Updating it fixes bugs and security, like updating a program, but with more care: never power off mid-update.'] },
    { c: 'Otro', k: ['que es arranque dual', 'dual boot', 'dos sistemas operativos'], r: ['El **arranque dual (dual boot)** es tener dos sistemas (ej. Windows y Linux) en el mismo equipo y elegir cuál arrancar al encender. Cada uno vive en su partición y no se mezclan.', '**Dual boot** means having two systems (e.g. Windows and Linux) on one machine and choosing which boots at power-on. Each lives in its own partition and they do not mix.'] },
    { c: 'Otro', k: ['que es una maquina virtual', 'maquina virtual que es', 'virtualbox vmware'], r: ['Una **máquina virtual** es un computador simulado dentro de tu computador: corre otro sistema en una ventana, aislado del tuyo. Sirve para probar programas o sistemas sin tocar tu equipo real.', 'A **virtual machine** is a simulated computer inside your computer: it runs another system in a window, isolated from yours. It tests programs or systems without touching your real machine.'] },
    { c: 'Otro', k: ['software libre vs propietario', 'codigo abierto que es', 'software libre que significa'], r: ['El **software libre y de código abierto** se puede usar, estudiar y modificar (ej. Linux, BleachBit); el **propietario** es de una empresa y no ves su código (ej. Windows, Office). Libre no siempre es gratis, y gratis no siempre es libre.', '**Free and open-source software** can be used, studied and modified (e.g. Linux, BleachBit); **proprietary** software belongs to a company and hides its code (e.g. Windows, Office). Free is not always gratis, and gratis is not always free.'] },
    { c: 'Otro', k: ['por que no usar software pirata', 'software pirata peligro', 'programas pirata riesgo'], r: ['El **software pirata** suele venir con malware escondido (troyanos, mineros, ladrones de claves) y no recibe actualizaciones de seguridad. Además de ilegal, es la forma más común de infectar un equipo "gratis".', '**Pirated software** usually hides malware (trojans, miners, password stealers) and gets no security updates. Besides being illegal, it is the most common way to infect a machine "for free".'], href: 'mantenimiento-software.html#alertas' },
    { c: 'Otro', k: ['que es bloatware', 'bloatware que es', 'programas preinstalados basura'], r: ['El **bloatware** son los programas preinstalados que no pediste (pruebas, juegos, utilidades del fabricante) y que ocupan disco y arranque. Se desinstalan desde el panel oficial del sistema.', '**Bloatware** is preinstalled software you never asked for (trials, games, maker utilities) eating disk and boot time. Uninstall it from the system\u2019s official panel.'], href: 'mantenimiento-software.html#tareas' },
    { c: 'Otro', k: ['que es un programa portable', 'programa portable que es', 'app portable'], r: ['Un **programa portable** corre sin instalarse: lo llevas en un USB y funciona en cualquier PC sin dejar rastros. Ideal para herramientas de diagnóstico y para equipos donde no puedes instalar nada.', 'A **portable program** runs without installing: carry it on a USB and it works on any PC leaving no traces. Perfect for diagnostic tools and machines where you cannot install anything.'] },
    { c: 'Otro', k: ['que es el modo seguro', 'modo seguro windows', 'arrancar en modo seguro'], r: ['El **modo seguro** arranca Windows solo con lo mínimo (sin drivers ni programas extra): sirve para diagnosticar, quitar malware y deshacer un controlador que dejó la pantalla negra. Si en modo seguro todo va bien, el problema es un programa o driver.', '**Safe mode** boots Windows with only the minimum (no extra drivers or programs): it diagnoses, removes malware and undoes a driver that black-screened you. If everything works in safe mode, the problem is a program or driver.'] },
    { c: 'Otro', k: ['que es un punto de restauracion', 'punto de restauracion windows', 'restaurar sistema'], r: ['Un **punto de restauración** es una foto del sistema (configuración y programas) a una fecha: si una actualización o instalación rompe algo, vuelves a ese punto sin perder tus archivos personales.', 'A **restore point** is a snapshot of the system (settings and programs) at a date: if an update or install breaks something, you roll back to it without losing personal files.'], href: 'mantenimiento-software.html#tareas' },
    { c: 'Otro', k: ['reinstalar el sistema operativo', 'reinstalar windows', 'reinstalar el sistema'], r: ['**Reinstalar el sistema** es borrar Windows y ponerlo de nuevo, limpio: arregla problemas graves, pero borra programas y ajustes (no tus archivos si eliges conservarlos). Solo se hace con copia de seguridad hecha antes.', '**Reinstalling the system** wipes Windows and puts it back clean: it fixes severe problems, but removes programs and settings (not your files, if you choose to keep them). Only do it with a backup made beforehand.'], href: 'mantenimiento-software.html#tareas' },
    { c: 'Otro', k: ['que es una imagen del sistema', 'imagen de sistema backup', 'imagen completa del disco'], r: ['Una **imagen del sistema** es una copia exacta de todo el disco (sistema, programas y archivos) en un momento: si el disco muere, restauras la imagen en uno nuevo y quedas como estabas, sin reinstalar nada.', 'A **system image** is an exact copy of the whole disk (system, programs and files) at a moment: if the disk dies, you restore the image onto a new one and you are back as you were, reinstalling nothing.'], href: 'mantenimiento-software.html#tareas' },
    { c: 'Otro', k: ['arranque desde usb', 'boot desde usb', 'iniciar desde usb'], r: ['El **arranque desde USB** es encender el equipo desde una memoria USB en vez del disco: sirve para instalar un sistema, reparar uno dañado o probar Linux sin instalarlo. Se elige en la BIOS/UEFI o con la tecla de arranque.', '**Booting from USB** powers the machine from a USB stick instead of the disk: it installs a system, repairs a broken one or tries Linux without installing. Pick it in BIOS/UEFI or with the boot key.'] },
    { c: 'Otro', k: ['que es secure boot', 'secure boot que es', 'arranque seguro'], r: ['El **Secure Boot** es una función de la UEFI que solo deja arrancar sistemas firmados y de confianza: bloquea rootkits que se cuelan antes de Windows. A veces hay que desactivarlo para instalar ciertos Linux.', '**Secure Boot** is a UEFI feature that only boots signed, trusted systems: it blocks rootkits sneaking in before Windows. Sometimes you must disable it to install certain Linux distros.'] },
    { c: 'Otro', k: ['que es tpm', 'tpm que es', 'chip tpm'], r: ['El **TPM** es un chip de seguridad en la placa que guarda claves y verifica que el arranque no fue alterado: Windows 11 lo exige y es la base de BitLocker y del inicio de sesión seguro.', 'The **TPM** is a security chip on the board storing keys and verifying boot was not tampered with: Windows 11 requires it and it underpins BitLocker and secure sign-in.'] },
    { c: 'Otro', k: ['que es bitlocker', 'bitlocker cifrado', 'cifrar el disco'], r: ['El **BitLocker** cifra todo el disco de Windows: si te roban el equipo, nadie lee tus archivos sin la clave, aunque saquen el disco. Actívalo en portátiles con datos importantes y guarda la clave de recuperación aparte.', '**BitLocker** encrypts the whole Windows disk: if the machine is stolen, nobody reads your files without the key, even pulling the disk out. Turn it on for laptops with important data and keep the recovery key elsewhere.'], href: 'mantenimiento-software.html#tareas' },
    { c: 'Otro', k: ['que es la autenticacion en dos pasos', '2fa que es', 'doble factor autenticacion'], r: ['La **autenticación en dos pasos (2FA)** pide, además de tu clave, un código de tu celular o llave: aunque te roben la contraseña, no entran sin ese segundo factor. Actívala en correo, redes y bancos.', '**Two-factor authentication (2FA)** asks, besides your password, for a code from your phone or key: even with your password stolen, attackers cannot enter without that second factor. Turn it on for mail, social and banks.'], href: 'mantenimiento-software.html#rutina' },
    { c: 'Otro', k: ['gestor de contraseñas', 'que es un gestor de claves', 'administrador de contraseñas'], r: ['Un **gestor de contraseñas** guarda todas tus claves cifradas bajo una sola clave maestra y genera claves largas y únicas por sitio: así no repites la misma en todo ni la anotas en papel.', 'A **password manager** stores all your passwords encrypted under one master password and generates long, unique passwords per site: no more reusing one everywhere or writing them on paper.'], href: 'mantenimiento-software.html#rutina' },
    { c: 'Recursos', k: ['mejor antivirus gratis', 'que antivirus usar', 'microsoft defender', 'mejor programa mantenimiento'], r: ['🏆 **Mejor en general: Microsoft Defender** — ya viene con Windows, se actualiza solo y protege todo el tiempo sin instalar nada ni pagar nada. Para la mayoría de usuarios, es la base correcta.', '🏆 **Best overall: Microsoft Defender** — it already ships with Windows, updates itself and protects all the time with nothing to install or pay. For most users, it is the right base.'], href: 'mantenimiento-software.html#programas' },
    { c: 'Recursos', k: ['programas gratis mantenimiento', 'mantenimiento costo cero', 'mejor costo programas'], r: ['💰 **Mejor costo: BleachBit + Defender** — costo total 0: Defender protege y BleachBit limpia temporales sin publicidad, sin suscripción y sin peso extra. Ideal si no quieres gastar nada.', '💰 **Best value: BleachBit + Defender** — total cost 0: Defender protects and BleachBit cleans temps with no ads, no subscription and no extra weight. Ideal if you do not want to spend anything.'], href: 'mantenimiento-software.html#programas' },
    { c: 'Recursos', k: ['programas mas eficientes', 'winget que es', 'crystaldiskinfo que es'], r: ['⚡ **Más eficientes: Winget + CrystalDiskInfo** — solo trabajan cuando se les pide: Winget actualiza muchos programas a la vez desde Windows y CrystalDiskInfo revisa la salud SMART del disco sin quedarse en segundo plano.', '⚡ **Most efficient: Winget + CrystalDiskInfo** — they only work when asked: Winget updates many programs at once from Windows and CrystalDiskInfo checks disk SMART health without staying in the background.'], href: 'mantenimiento-software.html#programas' },
    { c: 'Recursos', k: ['tabla programas recomendados', 'que programas instalar mantenimiento', 'programas recomendados mantenimiento'], r: ['La tabla recomienda: **Defender** (antivirus), **Malwarebytes Free** (segunda opinión), **Winget** (actualizar todo), **Windows Update** (sistema y drivers), **BleachBit** (limpiar), **CCleaner Free** (limpieza guiada), **CrystalDiskInfo** (salud del disco) y **Copia de Windows / Veeam** (backup). Combo costo 0: Defender + Winget + BleachBit. Descarga todo solo desde su sitio oficial.', 'The table recommends: **Defender** (antivirus), **Malwarebytes Free** (second opinion), **Winget** (update everything), **Windows Update** (system and drivers), **BleachBit** (cleaning), **CCleaner Free** (guided cleaning), **CrystalDiskInfo** (disk health) and **Windows Backup / Veeam** (backup). Zero-cost combo: Defender + Winget + BleachBit. Download everything only from its official site.'], href: 'mantenimiento-software.html#programas' },
    { c: 'Recursos', k: ['que es tracert', 'tracert', 'traceroute que es'], r: ['El **tracert** (traceroute) muestra el camino que sigue un paquete hasta su destino, salto por salto con su tiempo: sirve para ver en qué punto se pierde o se demora la conexión. En Windows se escribe `tracert 8.8.8.8`.', '**Tracert** (traceroute) shows the path a packet takes to its destination, hop by hop with timing: it reveals where the connection is lost or delayed. On Windows you type `tracert 8.8.8.8`.'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['que es nslookup', 'nslookup para que sirve', 'nslookup dns'], r: ['El **nslookup** pregunta al DNS qué IP tiene un dominio (o al revés): sirve para comprobar si un sitio no abre por DNS o por otra cosa. Se escribe `nslookup nvision.social`.', '**Nslookup** asks DNS which IP a domain has (or vice versa): it checks whether a site fails because of DNS or something else. You type `nslookup nvision.social`.'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['que es netstat', 'netstat para que sirve', 'netstat conexiones'], r: ['El **netstat** lista las conexiones de red activas de tu equipo: qué programas están conectados, a qué IP y por qué puerto. Sirve para cazar programas sospechosos hablando con internet.', '**Netstat** lists your machine\u2019s active network connections: which programs are connected, to which IP and port. It catches suspicious programs talking to the internet.'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['que es getmac', 'getmac comando', 'ver mac con getmac'], r: ['El **getmac** muestra la dirección MAC de todas tus tarjetas de red en una lista rápida, sin abrir configuraciones. Es el código para ver tu MAC sin rodeos.', '**Getmac** shows the MAC address of all your network cards in a quick list, without opening settings. It is the no-nonsense code for seeing your MAC.'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['que es systeminfo', 'systeminfo comando', 'systeminfo para que sirve'], r: ['El **systeminfo** vuelca toda la ficha de tu equipo en la terminal: sistema, procesador, RAM, fecha de instalación y actualizaciones. Es el "Detecta mi equipo" pero por código.', '**Systeminfo** dumps your whole machine profile in the terminal: system, processor, RAM, install date and updates. It is "Detect my machine" but as code.'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['que es chkdsk', 'chkdsk para que sirve', 'chkdsk disco'], r: ['El **chkdsk** revisa el disco buscando errores del sistema de archivos y sectores dañados, y los repara si le pides (`chkdsk C: /f`). Si el disco tiene errores, es el primer código que se corre.', '**Chkdsk** scans the disk for file-system errors and bad sectors, and repairs them if asked (`chkdsk C: /f`). If the disk has errors, it is the first code to run.'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['que es sfc scannow', 'sfc scannow para que sirve', 'sfc reparar windows'], r: ['El **sfc /scannow** revisa los archivos del sistema de Windows y repara los dañados con copias buenas: sirve cuando Windows falla raro tras un virus o un apagón. Se corre en la terminal como administrador.', '**SFC /scannow** checks Windows system files and repairs damaged ones with good copies: it helps when Windows acts strange after a virus or blackout. Run it in the terminal as administrator.'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['ipconfig flushdns', 'flushdns para que sirve', 'limpiar cache dns'], r: ['El **ipconfig /flushdns** borra la caché de DNS de tu equipo: sirve cuando un sitio cambió de servidor y tu PC sigue yendo al viejo, o cuando el DNS quedó con basura. Después vuelve a preguntar desde cero.', '**ipconfig /flushdns** clears your machine\u2019s DNS cache: it helps when a site moved servers and your PC keeps going to the old one, or when DNS cache went stale. Afterwards it asks fresh.'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['netsh winsock reset', 'netsh winsock', 'resetear red windows'], r: ['El **netsh winsock reset** reinicia el catálogo de red de Windows: sirve cuando internet falla sin razón clara tras un virus o un programa que tocó la red. Después hay que reiniciar el equipo.', '**netsh winsock reset** resets Windows\u2019 network catalog: it helps when the internet fails for no clear reason after a virus or a program that touched the network. You must restart afterwards.'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['cmd vs powershell', 'diferencia cmd powershell', 'cmd o powershell'], r: ['El **CMD** es la consola clásica de Windows, simple y compatible con códigos viejos; **PowerShell** es su sucesor moderno, mucho más potente para administrar el sistema y automatizar tareas. Los códigos del laboratorio usan PowerShell donde hace falta potencia.', '**CMD** is classic Windows console, simple and compatible with old codes; **PowerShell** is its modern successor, far more powerful for managing the system and automating tasks. The lab codes use PowerShell where power is needed.'], href: 'recursos.html#laboratorio' },
    { c: 'Otro', k: ['que es un buscador', 'buscador google', 'buscador vs navegador'], r: ['Un **buscador** (Google, Bing) es la página que busca en la web y te da resultados; el **navegador** (Chrome, Firefox) es el programa donde abres esa página. Sin navegador no llegas al buscador, y sin buscador te tocaría escribir cada dirección a mano.', 'A **search engine** (Google, Bing) is the page that searches the web and gives results; the **browser** (Chrome, Firefox) is the program where you open that page. Without a browser you never reach the engine, and without an engine you would type every address by hand.'] },
    { c: 'Otro', k: ['que es streaming', 'streaming que es', 'ver streaming'], r: ['El **streaming** es ver o escuchar contenido por internet sin descargarlo: el video llega en pedazos mientras lo ves (Netflix, YouTube, Twitch). Necesita buena bajada y poco jitter para no pausarse.', '**Streaming** is watching or listening online without downloading: video arrives in pieces as you watch (Netflix, YouTube, Twitch). It needs good download speed and low jitter to avoid buffering.'] },
    { c: 'Otro', k: ['que es una red social', 'redes sociales que son', 'red social que significa'], r: ['Una **red social** (Instagram, TikTok, X) es una plataforma para publicar, seguir gente y conversar: su negocio es tu atención y tus datos. Cuida lo que publicas: una vez en internet, casi nunca se borra del todo.', 'A **social network** (Instagram, TikTok, X) is a platform to post, follow people and chat: its business is your attention and data. Mind what you post: once online, it almost never fully disappears.'] },
    { c: 'Otro', k: ['que es spam', 'spam correo', 'correo spam que es'], r: ['El **spam** es el correo o mensaje masivo no pedido (publicidad, estafas, cadenas): molesta y a veces esconde phishing. No respondas ni abras sus enlaces: márcalo como spam y el filtro aprenderá.', '**Spam** is unsolicited bulk mail or messages (ads, scams, chains): annoying and sometimes hiding phishing. Do not reply or open its links: mark it as spam and the filter will learn.'] },
    { c: 'Otro', k: ['que es la inteligencia artificial', 'inteligencia artificial que es', 'que es ia'], r: ['La **inteligencia artificial (IA)** es software que aprende de muchos ejemplos para hacer tareas que antes pedían personas: reconocer imágenes, traducir, conversar o predecir. No "piensa" como tú: calcula probabilidades con lo que aprendió.', '**Artificial intelligence (AI)** is software that learns from many examples to do tasks that once needed people: recognizing images, translating, chatting or predicting. It does not "think" like you: it computes probabilities from what it learned.'] },
    { c: 'Otro', k: ['que es un chatbot', 'chatbot que es', 'chatbot de reglas'], r: ['Un **chatbot** es un programa que conversa con texto: este asistente de NVISION es un chatbot de **reglas**, entrenado con fichas sobre el sitio (no una IA generativa): entiende tu pregunta, busca la ficha que mejor calza y responde con ella.', 'A **chatbot** is a program that chats in text: this NVISION assistant is a **rule-based** chatbot, trained on cards about the site (not a generative AI): it understands your question, finds the best-matching card and answers with it.'] },
    { c: 'Otro', k: ['que es una criptomoneda', 'criptomoneda que es', 'blockchain que es'], r: ['Una **criptomoneda** (Bitcoin, Ethereum) es dinero digital sin banco central, guardado en una **blockchain**: un registro público compartido que nadie puede borrar a escondidas. Su precio sube y baja muchísimo, y perder tu clave es perder tus monedas.', 'A **cryptocurrency** (Bitcoin, Ethereum) is digital money with no central bank, kept on a **blockchain**: a shared public ledger nobody can secretly erase. Its price swings wildly, and losing your key means losing your coins.'] },
{ c: 'Recursos', k: ['que es el mantenimiento por software', 'mantenimiento por software', 'mantenimiento preventivo por software', 'software maintenance'], r: ['Es el cuidado que se hace **sin abrir el computador**: actualizar, proteger, limpiar, respaldar y revisar el sistema antes de que falle. Bien hecho, evita virus, lentitud, errores y pérdida de archivos.', 'It is the care done **without opening the computer**: updating, protecting, cleaning, backing up and checking the system before it fails. Done well, it prevents viruses, slowness, errors and lost files.'], href: 'mantenimiento-software.html#que-es' },
    { c: 'Recursos', k: ['regla de oro mantenimiento', 'primero la copia de seguridad', 'antes de actualizar copia', 'golden rule backup'], r: ['**Regla de oro: primero la copia de seguridad, después cualquier cambio.** Antes de actualizar o limpiar algo importante, guarda tus archivos: si algo sale mal, vuelves atrás sin perder nada.', '**Golden rule: backup first, changes second.** Before updating or cleaning anything important, save your files: if something goes wrong, you roll back without losing anything.'], href: 'mantenimiento-software.html#paso-a-paso' },
    { c: 'Recursos', k: ['beneficios del mantenimiento', 'para que sirve el mantenimiento preventivo', 'ventajas mantenimiento software'], r: ['Tres beneficios: **menos fallos y pantallazos** (actualizaciones y drivers corrigen errores), **más velocidad y espacio** (limpiar temporales libera disco y arranque) y **más seguridad** (antivirus, contraseñas y copias contra virus y ransomware).', 'Three benefits: **fewer crashes and blue screens** (updates and drivers fix bugs), **more speed and space** (cleaning temp files frees disk and boot time) and **more security** (antivirus, passwords and backups against viruses and ransomware).'], href: 'mantenimiento-software.html#que-es' },
    { c: 'Recursos', k: ['actualizar sistema y aplicaciones', 'tarea actualizar', 'actualizaciones automaticas'], r: ['Las actualizaciones **cierran agujeros de seguridad** y corrigen errores: un programa viejo es una puerta abierta. Activa las automáticas del sistema, actualiza navegador y ofimática **desde sus sitios oficiales** y reinicia para que se apliquen bien.', 'Updates **close security holes** and fix bugs: an old program is an open door. Turn on automatic system updates, update browser and office apps **from their official sites** and restart so changes apply properly.'], href: 'mantenimiento-software.html#tareas' },
    { c: 'Recursos', k: ['controladores al dia', 'drivers al dia', 'actualizar drivers', 'que es un driver', 'que es un controlador driver'], r: ['El **controlador (driver)** es el traductor entre el sistema y cada pieza: video, red, sonido y chipset. Si falla: pantallas negras, Wi-Fi inestable o sonido perdido. Descárgalos **solo del fabricante**; si algo empeora tras actualizar, vuelve al controlador anterior.', 'A **driver** is the translator between the system and each part: video, network, sound and chipset. If it fails: black screens, unstable Wi-Fi or lost sound. Download only **from the manufacturer**; if something gets worse after updating, roll back to the previous driver.'], href: 'mantenimiento-software.html#tareas' },
    { c: 'Recursos', k: ['antivirus y antimalware', 'tarea antivirus', 'analisis antivirus', 'cuantos antivirus'], r: ['**Un solo antivirus activo y actualizado, nunca dos a la vez**: se pelean entre sí y dejan huecos. Análisis rápido semanal y completo mensual. No abras adjuntos ni enlaces sospechosos, aunque parezcan de un conocido.', '**One active, updated antivirus, never two at once**: they fight each other and leave gaps. Quick scan weekly, full scan monthly. Do not open suspicious attachments or links, even if they look like they come from someone you know.'], href: 'mantenimiento-software.html#tareas' },
    { c: 'Recursos', k: ['limpieza digital', 'limpieza y orden digital', 'archivos temporales ocupan disco', 'borrar temporales'], r: ['Temporales, descargas viejas y programas sin uso ocupan disco y hacen más lento el arranque. Borra temporales y papelera, desinstala desde el panel oficial del sistema y desactiva los programas innecesarios que inician con el equipo. Frecuencia: mensual.', 'Temp files, old downloads and unused programs eat disk and slow boot. Delete temps and trash, uninstall from the system\u2019s official panel and disable unneeded startup programs. Frequency: monthly.'], href: 'mantenimiento-software.html#tareas' },
    { c: 'Recursos', k: ['copias de seguridad', 'regla 3-2-1', 'como hacer copia de seguridad', 'backup 3-2-1'], r: ['La copia es el seguro de tus archivos. **Regla 3-2-1: 3 copias, en 2 medios distintos, 1 fuera de casa o en la nube.** Automatízala para no depender de acordarte y comprueba alguna vez que de verdad se puede abrir y restaurar.', 'A backup is your files\u2019 insurance. **3-2-1 rule: 3 copies, on 2 different media, 1 offsite or in the cloud.** Automate it so you do not rely on remembering, and test sometime that it really opens and restores.'], href: 'mantenimiento-software.html#tareas' },
    { c: 'Recursos', k: ['optimizacion del sistema', 'salud del sistema', 'salud smart', 'espacio libre disco'], r: ['Mantén al menos **15–20 % del disco libre**, revisa la salud **SMART** del disco y la temperatura. Si va lento, revisa primero: inicio, disco lleno y programas en segundo plano. Frecuencia: mensual; salud del disco, trimestral.', 'Keep at least **15–20 % of the disk free**, check the disk\u2019s **SMART** health and temperature. If it runs slow, check first: startup, full disk and background programs. Frequency: monthly; disk health, quarterly.'], href: 'mantenimiento-software.html#tareas' },
    { c: 'Recursos', k: ['rutina semanal mantenimiento', 'que hacer cada semana pc', 'mantenimiento semanal', 'que hago cada semana'], r: ['Cada **semana**: actualizar sistema y programas, análisis antivirus rápido y verificar que la copia automática corrió. Es la defensa básica contra virus y errores nuevos.', 'Every **week**: update system and programs, quick antivirus scan and verify the automatic backup ran. It is the basic defense against new viruses and bugs.'], href: 'mantenimiento-software.html#rutina' },
    { c: 'Recursos', k: ['rutina mensual mantenimiento', 'que hacer cada mes pc', 'mantenimiento mensual', 'que hago cada mes'], r: ['Cada **mes**: limpieza de temporales y descargas, desinstalar lo que no usas, análisis antivirus completo y revisar inicio y espacio libre. Recupera velocidad y evita que el disco se llene.', 'Every **month**: clean temps and downloads, uninstall what you do not use, full antivirus scan and check startup and free space. It recovers speed and keeps the disk from filling up.'], href: 'mantenimiento-software.html#rutina' },
    { c: 'Recursos', k: ['rutina trimestral mantenimiento', 'cada tres meses pc', 'mantenimiento trimestral', 'que hago cada trimestre'], r: ['Cada **trimestre**: revisar controladores, salud SMART del disco, probar que una copia se puede restaurar y revisar contraseñas importantes. Detecta desgaste y fallos antes de que pierdas datos.', 'Every **quarter**: check drivers, disk SMART health, test that a backup can be restored and review important passwords. It catches wear and failures before you lose data.'], href: 'mantenimiento-software.html#rutina' },
    { c: 'Recursos', k: ['rutina semestral mantenimiento', 'cada seis meses pc', 'revision completa equipo', 'que hago cada seis meses'], r: ['Cada **semestre**: revisión completa (sistema, seguridad, copias, espacio y programas) y cambiar contraseñas débiles o repetidas. Deja el equipo como nuevo, sin reinstalar por gusto.', 'Every **six months**: full review (system, security, backups, space and programs) and change weak or repeated passwords. It leaves the machine like new, without reinstalling for fun.'], href: 'mantenimiento-software.html#rutina' },
    { c: 'Recursos', k: ['orden seguro 6 pasos', 'media hora mantenimiento', 'en que orden limpiar mi pc', 'paso a paso mantenimiento'], r: ['Si solo tienes media hora, sigue este orden: **1)** copia antes de tocar nada, **2)** actualiza, **3)** pasa el antivirus, **4)** limpia temporales y programas, **5)** revisa inicio y espacio, **6)** reinicia y comprueba. Protege primero, limpia después.', 'If you only have half an hour, follow this order: **1)** backup before touching anything, **2)** update, **3)** run the antivirus, **4)** clean temps and programs, **5)** check startup and space, **6)** restart and verify. Protect first, clean second.'], href: 'mantenimiento-software.html#paso-a-paso' },
    { c: 'Recursos', k: ['ventanas solas anuncios', 'navegador cambio buscador', 'anuncios solos', 'popups solos'], r: ['Ventanas o anuncios que aparecen solos, o el navegador que cambia de buscador: señal de **malware**. Pasa el antivirus completo, revisa las extensiones del navegador y no instales "optimizadores" de sitios pirata.', 'Popups or ads appearing on their own, or a browser that changes search engine: a **malware** sign. Run a full antivirus scan, check browser extensions and never install "optimizers" from pirate sites.'], href: 'mantenimiento-software.html#alertas' },
    { c: 'Recursos', k: ['se calienta mucho', 'equipo muy caliente', 'sobrecalentamiento', 'temperatura alta equipo'], r: ['Si se calienta, se apaga solo o tarda mucho más que antes: revisa ventilación y polvo (limpieza de PC3D), temperatura y salud del disco. Si hay olor a quemado o ruido eléctrico, deja de usarlo y consulta servicio técnico.', 'If it overheats, shuts down alone or takes much longer than before: check ventilation and dust (PC3D cleaning), temperature and disk health. If there is a burning smell or electrical noise, stop using it and consult a technician.'], href: 'mantenimiento-software.html#alertas' },
    { c: 'Recursos', k: ['archivos desaparecen', 'archivos piden rescate', 'ransomware', 'archivos cambian de nombre'], r: ['Archivos que desaparecen, cambian de nombre o **piden rescate para abrirlos**: señal de ransomware o virus. No pagues: desconecta el equipo, pasa el antivirus y restaura desde tu copia (por eso existe la regla 3-2-1).', 'Files disappearing, changing names or **demanding ransom to open**: a ransomware or virus sign. Do not pay: disconnect the machine, run the antivirus and restore from your backup (that is why the 3-2-1 rule exists).'], href: 'mantenimiento-software.html#alertas' },
    { c: 'Recursos', k: ['disco siempre lleno', 'disco al 100 por ciento', 'disco lleno sin razon'], r: ['Disco siempre lleno o al 100 % sin razón: limpia temporales y descargas, desinstala lo que no usas y deja libre al menos 15–20 %. Si sigue al 100 %, revisa salud SMART y qué programa está escribiendo sin parar.', 'Disk always full or at 100 % for no reason: clean temps and downloads, uninstall what you do not use and keep at least 15–20 % free. If it stays at 100 %, check SMART health and which program keeps writing nonstop.'], href: 'mantenimiento-software.html#alertas' },
    { c: 'Recursos', k: ['que no hacer nunca mantenimiento', 'errores mantenimiento', 'no instalar dos antivirus', 'no descargar pirata'], r: ['Qué **no hacer nunca**: dos antivirus a la vez, descargar programas, drivers u "optimizadores" de sitios pirata, borrar archivos del sistema o del registro sin saber qué hacen, e ignorar las copias: un equipo sin copia es un archivo perdido esperando su momento.', 'What **never to do**: two antiviruses at once, downloading programs, drivers or "optimizers" from pirate sites, deleting system or registry files without knowing what they do, and ignoring backups: a machine without a backup is a lost file waiting to happen.'], href: 'mantenimiento-software.html#alertas' },
    { c: 'Recursos', k: ['contraseñas fuertes', 'cambiar contraseñas', 'contraseñas debiles repetidas', 'passwords', 'como deben ser mis contraseñas'], r: ['Contraseñas **fuertes y distintas por servicio**; revisa las importantes cada trimestre y cambia las débiles o repetidas cada semestre. Son parte del mantenimiento: un antivirus no te protege si tu clave es "123456".', '**Strong, different passwords per service**; review the important ones quarterly and change weak or repeated ones every six months. They are part of maintenance: no antivirus protects you if your password is "123456".'], href: 'mantenimiento-software.html#rutina' },
    { c: 'Recursos', k: ['quienes hicieron el eniac', 'creadores del eniac', 'mauchly eckert', 'quien invento el eniac'], r: ['**John Mauchly** (físico, diseñador conceptual: vio que los circuitos con válvulas podían calcular a velocidades impensables) y **J. Presper Eckert** (ingeniero eléctrico jefe: diseñó los circuitos para que miles de tubos no fallaran sin parar).', '**John Mauchly** (physicist, conceptual designer: he saw vacuum-tube circuits could compute at inconceivable speeds) and **J. Presper Eckert** (chief electrical engineer: he designed the circuits so thousands of tubes would not fail nonstop).'], href: 'hardware.html#historia' },
    { c: 'Recursos', k: ['programadoras del eniac', 'mujeres eniac', 'quienes programaron el eniac', 'las 6 programadoras'], r: ['Las **6 programadoras pioneras**: Kay McNulty, Betty Jennings, Betty Snyder, Marlyn Wescoff, Ruth Lichterman y Frances Bilas. Programaban **sin lenguajes ni sistema operativo**: cables, paneles de conmutación y diagramas lógicos a mano para las trayectorias balísticas.', 'The **6 pioneer programmers**: Kay McNulty, Betty Jennings, Betty Snyder, Marlyn Wescoff, Ruth Lichterman and Frances Bilas. They programmed **without languages or an operating system**: patch cables, switch panels and logic diagrams by hand for the ballistic trajectories.'], href: 'hardware.html#historia' },
    { c: 'Recursos', k: ['von neumann', 'arquitectura von neumann', 'programa almacenado'], r: ['**John von Neumann**, consultor matemático del proyecto, formuló en 1945 el concepto de **programa almacenado** (Arquitectura Von Neumann): guardar programa y datos en la misma memoria. Casi todas las computadoras modernas siguen esa idea.', '**John von Neumann**, the project\u2019s mathematical consultant, formalized in 1945 the **stored-program** concept (Von Neumann Architecture): keeping program and data in the same memory. Almost every modern computer still follows that idea.'], href: 'hardware.html#historia' },
    { c: 'Recursos', k: ['por que nacio el eniac', 'para que se creo el eniac', 'project px', 'tablas balisticas'], r: ['En la Segunda Guerra Mundial el ejército de EE. UU. necesitaba **tablas balísticas** para artillería pesada con rapidez y precisión. En 1943 el Laboratorio de Investigación Balística financió en secreto el proyecto en la Universidad de Pensilvania bajo el nombre clave **Project PX**.', 'In World War II the U.S. Army needed **ballistic tables** for heavy artillery, fast and precise. In 1943 the Ballistic Research Laboratory secretly funded the project at the University of Pennsylvania under the code name **Project PX**.'], href: 'hardware.html#historia' },
    { c: 'Recursos', k: ['legado del eniac', 'impacto del eniac', 'que logro el eniac', '20 horas 30 segundos'], r: ['El ENIAC demostró que el cálculo electrónico a gran escala era viable: bajó cálculos de balística de **20 horas a 30 segundos**. No guardaba el programa en memoria como hoy (se recableaba a mano por tarea), pero abrió la era digital moderna.', 'ENIAC proved large-scale electronic computing was viable: it cut ballistic calculations from **20 hours to 30 seconds**. It did not store the program in memory like today (it was rewired by hand per task), but it opened the modern digital age.'], href: 'hardware.html#historia' },
    { c: 'Recursos', k: ['altair 8800', 'primer microcomputador comercial', 'intel 8080'], r: ['El **Altair 8800** fue el primer microcomputador comercial, basado en el procesador **Intel 8080**. Dio origen al software de microcomputadoras y al inicio de la informática personal.', 'The **Altair 8800** was the first commercial microcomputer, powered by the **Intel 8080** processor. It gave birth to microcomputer software and the dawn of personal computing.'], href: 'hardware.html#historia' },
    { c: 'Recursos', k: ['apple ii', 'apple 2', 'primer computador personal masivo'], r: ['El **Apple II** fue uno de los primeros microcomputadores producidos en masa: teclado integrado, gráficos a color y ranuras de expansión.', 'The **Apple II** was one of the first mass-produced microcomputers: integrated keyboard, color graphics and expansion slots.'], href: 'hardware.html#historia' },
    { c: 'Recursos', k: ['ibm 7090', 'transistores mainframe', 'sistema central transistorizado'], r: ['El **IBM 7090** reemplazó las válvulas de vacío por **transistores**: multiplicó por 6 la velocidad de cálculo y redujo el consumo eléctrico. Es el salto de los tubos al transistor.', 'The **IBM 7090** replaced vacuum tubes with **transistors**: it multiplied computing speed by 6 and cut power use. It is the leap from tubes to transistors.'], href: 'hardware.html#historia' },
    { c: 'Recursos', k: ['linea de tiempo computacion', 'timeline historia', 'historia completa computadores'], r: ['La línea de tiempo del sitio recorre: **ENIAC** y sus pioneros, el salto al transistor (**IBM 7090**), el primer microcomputador comercial (**Altair 8800**) y la informática personal (**Apple II**). Está en Hardware, sección Historia.', 'The site\u2019s timeline covers: **ENIAC** and its pioneers, the transistor leap (**IBM 7090**), the first commercial microcomputer (**Altair 8800**) and personal computing (**Apple II**). It lives in Hardware, History section.'], href: 'hardware.html#historia' },
    { c: 'Redes', k: ['ventajas desventajas estrella', 'pros contras estrella', 'estrella punto unico de fallo'], r: ['Estrella: **pro** — fácil de diagnosticar y agregar nodos sin detener la red; **contra** — punto único de fallo: si el switch central cae, toda la red cae.', 'Star: **pro** — easy to troubleshoot and add nodes without stopping the network; **con** — single point of failure: if the central switch dies, the whole network dies.'], href: 'redes.html#topologias' },
    { c: 'Redes', k: ['ventajas desventajas bus', 'pros contras bus'], r: ['Bus: **pro** — bajo costo y poco cableado; **contra** — una rotura del troncal deja inoperativa toda la red y hay alta probabilidad de colisiones.', 'Bus: **pro** — low cost and little cabling; **con** — a break in the backbone kills the whole network and collisions are highly likely.'], href: 'redes.html#topologias' },
    { c: 'Redes', k: ['ventajas desventajas anillo', 'pros contras anillo'], r: ['Anillo: **pro** — sin colisiones y rendimiento regular y predecible con mucho tráfico; **contra** — si un equipo falla o se desconecta, se interrumpe todo el ciclo.', 'Ring: **pro** — no collisions and steady, predictable performance under heavy traffic; **con** — if one device fails or disconnects, the whole cycle breaks.'], href: 'redes.html#topologias' },
    { c: 'Redes', k: ['ventajas desventajas malla', 'pros contras malla'], r: ['Malla: **pro** — máxima tolerancia a fallos, el tráfico se redirige al instante; **contra** — elevado costo de cableado, interfaces y complejidad de ruteo.', 'Mesh: **pro** — maximum fault tolerance, traffic reroutes instantly; **con** — high cost of cabling, interfaces and routing complexity.'], href: 'redes.html#topologias' },
    { c: 'Redes', k: ['ventajas desventajas arbol', 'pros contras arbol'], r: ['Árbol: **pro** — gran escalabilidad y fácil aislamiento de subredes por departamentos; **contra** — si el nodo raíz falla, las ramas pierden conectividad entre sí.', 'Tree: **pro** — highly scalable and easy to isolate subnets per department; **con** — if the root node fails, the branches lose connectivity with each other.'], href: 'redes.html#topologias' },
    { c: 'Redes', k: ['ventajas desventajas hibrida', 'pros contras hibrida'], r: ['Híbrida: **pro** — máxima flexibilidad, aprovecha lo mejor de cada topología por área; **contra** — diseño y mantenimiento complejos, requiere equipos de interconexión avanzados.', 'Hybrid: **pro** — maximum flexibility, takes the best of each topology per area; **con** — complex design and maintenance, needs advanced interconnection gear.'], href: 'redes.html#topologias' },
    { c: 'Redes', k: ['tabla comparativa redes', 'comparar redes tabla', 'tabla de alcances', 'tabla ban pan lan'], r: ['En la sección de tipos de red hay una **tabla comparativa**: cada red con su nombre, cobertura y caso de uso — BAN (<1 m), PAN (1-10 m), LAN (~100 m), CAN (1-5 km), MAN (hasta 50 km), WAN (países) y GAN (planetaria).', 'The network types section has a **comparison table**: each network with its name, coverage and use case — BAN (<1 m), PAN (1-10 m), LAN (~100 m), CAN (1-5 km), MAN (up to 50 km), WAN (countries) and GAN (planetary).'], href: 'redes.html#alcance-redes' },
    { c: 'Recursos', k: ['simulacion torre 3d', 'modelo 3d torre', 'three.js torre'], r: ['En Recursos hay un módulo opcional: la **simulación de torre 3D**, un espacio reservado para integrar Three.js/WebGL y rotar y desarmar una torre virtual. El visor 3D que sí funciona hoy está en PC3D.', 'Resources has an optional module: the **3D tower simulation**, a reserved space to integrate Three.js/WebGL and rotate and disassemble a virtual tower. The 3D viewer that works today is in PC3D.'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['bateria del detector', 'que muestra la bateria', 'detecta bateria'], r: ['El detector también muestra la **batería**: nivel y si está **cargando**. Es uno de los 7 datos que el navegador puede ver sin instalar nada.', 'The detector also shows the **battery**: level and whether it is **charging**. It is one of the 7 facts the browser can see with no installs.'], href: 'recursos.html#laboratorio' },
    { c: 'Otro', k: ['inicio de nvision', 'pagina principal nvision', 'que hay en el inicio', 'portada nvision'], r: ['La página principal presenta el sitio — **Arquitectura y Evolución de los Computadores** — y cuatro entradas: Hardware y Evolución, Redes y Simulación, Recursos de Aprendizaje y Mantenimiento por software.', 'The home page introduces the site — **Computer Architecture and Evolution** — and four entries: Hardware and Evolution, Networks and Simulation, Learning Resources and Software Maintenance.'] },
    { c: 'Redes', k: ['del hardware a la red', 'como se enlaza el equipo a la red', 'capa de enlace'], r: ['La sección **Del Hardware a la Red** explica cómo el equipo físico se enlaza a una LAN: la MAC de la NIC (capa de enlace), los puertos RJ-45 y Wi-Fi por PCIe, y el flujo de datos RAM → CPU → NIC → medio físico.', 'The **From Hardware to Network** section explains how physical hardware joins a LAN: the NIC\u2019s MAC (link layer), RJ-45 and Wi-Fi ports over PCIe, and the data flow RAM → CPU → NIC → physical medium.'], href: 'redes.html#redes' },
    { c: 'Otro', k: ['que es un sistema operativo', 'sistema operativo', 'que es windows', 'que es linux', 'que es el os'], r: ['El **sistema operativo** (Windows, Linux, macOS) es el programa base que administra hardware y programas: memoria, archivos, pantalla y red. Sin él, el PC no sabe qué hacer con sus piezas.', 'The **operating system** (Windows, Linux, macOS) is the base program that manages hardware and programs: memory, files, screen and network. Without it, the PC would not know what to do with its parts.'] },
    { c: 'Otro', k: ['que es un programa', 'que es una aplicacion', 'que es una app', 'que es el software de aplicacion'], r: ['Un **programa o app** es software que hace una tarea: navegador, ofimática, juegos. Corre sobre el sistema operativo y usa CPU, RAM y almacenamiento.', 'A **program or app** is software that performs a task: browser, office suite, games. It runs on the operating system and uses CPU, RAM and storage.'] },
    { c: 'Otro', k: ['que es un virus', 'que es malware', 'virus spyware ransomware', 'diferencia virus malware'], r: ['**Malware** es el término general para software dañino: **virus** (se replica), **spyware** (espía y roba datos) y **ransomware** (secuestra archivos pidiendo rescate). Contra todos: un antivirus actualizado y copias de seguridad.', '**Malware** is the general term for harmful software: **virus** (it replicates), **spyware** (it spies and steals data) and **ransomware** (it hijacks files demanding ransom). Against all of them: an updated antivirus and backups.'], href: 'mantenimiento-software.html#tareas' },
    { c: 'Otro', k: ['que es la nube', 'nube que es', 'cloud que significa', 'guardar en la nube'], r: ['La **nube** son servidores de otros (internet) donde guardas archivos y usas programas sin tenerlos en tu disco. Sirve para copias de seguridad: es el "1 fuera de casa" de la regla 3-2-1.', 'The **cloud** is other people\u2019s servers (on the internet) where you store files and run programs without keeping them on your disk. It works for backups: it is the "1 offsite" of the 3-2-1 rule.'], href: 'mantenimiento-software.html#tareas' },
    { c: 'Otro', k: ['que es un navegador', 'navegador web', 'chrome firefox edge'], r: ['El **navegador** (Chrome, Firefox, Edge, Brave) es el programa para ver páginas web: pide la página al servidor por HTTP/DNS y la dibuja. No es lo mismo que el buscador ni que internet.', 'The **browser** (Chrome, Firefox, Edge, Brave) is the program for viewing web pages: it requests the page from the server over HTTP/DNS and draws it. It is not the same as the search engine or the internet.'] },
    { c: 'Otro', k: ['que es un archivo', 'que es una carpeta', 'archivos y carpetas'], r: ['Un **archivo** es un conjunto de datos con nombre (documento, foto, programa); una **carpeta** los organiza. Viven en el almacenamiento y se copian, mueven y respaldan como unidades.', 'A **file** is a named set of data (document, photo, program); a **folder** organizes them. They live in storage and are copied, moved and backed up as units.'] },
    { c: 'Otro', k: ['que es usb', 'usb para que sirve', 'memoria usb'], r: ['**USB** es el conector universal para periféricos y memorias: teclados, mouse, discos externos y celulares. Sirve para pasar archivos y para copias de seguridad en un medio distinto.', '**USB** is the universal connector for peripherals and drives: keyboards, mice, external disks and phones. It moves files and works for backups on a different medium.'] },
    { c: 'Otro', k: ['que es el correo electronico', 'email que es', 'correo electronico'], r: ['El **correo electrónico** es el servicio para enviar mensajes y archivos entre cuentas (ej. usuario@dominio.com) a través de servidores de correo. Ojo: los adjuntos sospechosos son la puerta favorita del malware.', '**Email** is the service for sending messages and files between accounts (e.g. user@domain.com) through mail servers. Watch out: suspicious attachments are malware\u2019s favorite door.'] },
    { c: 'Otro', k: ['contraseña segura', 'clave segura', 'como crear contraseña segura'], r: ['Una contraseña segura es **larga (más de 12 caracteres), única por servicio** y mezcla letras, números y símbolos. Nunca repitas la misma en todo: si filtran una, caen todas.', 'A secure password is **long (over 12 characters), unique per service** and mixes letters, numbers and symbols. Never reuse the same one everywhere: if one leaks, they all fall.'], href: 'mantenimiento-software.html#rutina' },
    { c: 'Otro', k: ['que es phishing', 'phishing', 'correo falso estafa', 'suplantacion'], r: ['**Phishing** es el engaño que se hace pasar por un conocido o una empresa (correo, mensaje o página falsa) para robarte claves o datos. Señales: urgencia, remitente raro y enlaces sospechosos. No abras adjuntos ni enlaces dudosos.', '**Phishing** is the trick that pretends to be someone you know or a company (fake email, message or page) to steal your passwords or data. Signs: urgency, odd sender and suspicious links. Do not open dubious attachments or links.'] },
    { c: 'Otro', k: ['archivos temporales que son', 'temporales windows', 'limpiar temporales'], r: ['Los **archivos temporales** son restos que programas y sistema dejan al trabajar: cachés, instaladores viejos, papelera. Borrarlos cada mes libera disco y no rompe nada (nunca toques carpetas del sistema que no reconozcas).', '**Temporary files** are leftovers programs and the system leave while working: caches, old installers, trash. Deleting them monthly frees disk and breaks nothing (never touch system folders you do not recognize).'], href: 'mantenimiento-software.html#tareas' },
    { c: 'Otro', k: ['que es formatear', 'formatear disco', 'formatear pc'], r: ['**Formatear** es borrar por completo un disco o USB y dejarlo como nuevo, listo para guardar. Borra TODO: solo se hace con copia de seguridad hecha antes.', '**Formatting** means completely erasing a disk or USB and leaving it like new, ready to store. It erases EVERYTHING: only do it with a backup made beforehand.'] },
    { c: 'Otro', k: ['que es una actualizacion', 'para que sirven las actualizaciones', 'actualizaciones para que'], r: ['Una **actualización** es una versión nueva de un programa o del sistema que corrige errores y **cierra agujeros de seguridad**. Por eso el mantenimiento pide activar las automáticas y reiniciar después.', 'An **update** is a new version of a program or the system that fixes bugs and **closes security holes**. That is why maintenance asks you to turn on automatic updates and restart after.'], href: 'mantenimiento-software.html#tareas' },
    { c: 'Otro', k: ['internet o web', 'diferencia internet web', 'web que es'], r: ['**Internet** es la red física de redes; la **web** son las páginas y servicios que corren sobre ella (HTTP). Puedes tener internet sin web (correo, juegos en línea), pero no web sin internet.', '**Internet** is the physical network of networks; the **web** is the pages and services that run on it (HTTP). You can have internet without the web (email, online games) but not the web without the internet.'], href: 'redes.html#alcance-redes' },
    { c: 'Otro', k: ['que es un bit', 'que es un byte', 'bits y bytes', 'mb gb'], r: ['**Bit** es la unidad mínima (0 o 1); **byte** son 8 bits. El ancho de banda se mide en bits por segundo (bps) y el almacenamiento en bytes (KB, MB, GB, TB).', '**Bit** is the smallest unit (0 or 1); **byte** is 8 bits. Bandwidth is measured in bits per second (bps) and storage in bytes (KB, MB, GB, TB).'] },
    { c: 'Otro', k: ['wifi 6', 'que es wifi 6', '802.11ax'], r: ['**WiFi 6 (802.11ax)** es la generación actual de WiFi que usa la LAN de la página de Redes: más velocidad y mejor manejo de muchos equipos a la vez en la misma red.', '**WiFi 6 (802.11ax)** is the current WiFi generation used by the Networks page LAN: more speed and better handling of many devices at once on the same network.'], href: 'redes.html#alcance-redes' },
    { c: 'Redes Challenge', k: ['redes challenge', 'el juego', 'juego de topologias', 'jugar redes challenge', 'donde esta el juego', 'como entro al juego'], r: ['**Redes Challenge** es el minijuego de NVISION para practicar topologías de red. Puedes entrar desde el menú **Redes → 🎮 Redes Challenge** (está en todas las páginas), desde la sección «Redes Challenge» en la página de Redes, o desde Recursos. Es gratis, corre en el navegador y tiene español e inglés.', '**Redes Challenge** is the NVISION mini-game for practicing network topologies. You can enter from the **Redes → 🎮 Redes Challenge** menu (on every page), from the "Redes Challenge" section on the Networks page, or from Recursos. It is free, runs in the browser and has Spanish and English.'], href: 'redes_challenge/index.html' },
    { c: 'Redes Challenge', k: ['reglas del juego', 'como se juega', 'cuantas preguntas', 'como funcionan las vidas', 'puntos del juego'], r: ['Reglas de **Redes Challenge**: son **10 preguntas** de opción múltiple; cada acierto suma **10 puntos** (máximo **100**). Empiezas con **3 vidas ❤️❤️❤️** y pierdes una por cada error; el juego termina si te quedas sin vidas o al responder las 10 preguntas. Cada respuesta incluye una explicación corta de por qué es correcta.', '**Redes Challenge** rules: there are **10 multiple-choice questions**; each correct answer adds **10 points** (max **100**). You start with **3 lives ❤️❤️❤️** and lose one per mistake; the game ends if you run out of lives or finish all 10 questions. Every answer includes a short explanation of why it is correct.'], href: 'redes_challenge/index.html' },
    { c: 'Redes Challenge', k: ['puntuacion del juego', 'cuanto es buena puntuacion', 'resultado final', 'que pasa si pierdo', 'volver a jugar'], r: ['Al terminar el juego: con **80 puntos o más** recibes «🏆 ¡Excelente trabajo!», con **50 o más** «👏 ¡Buen intento!», y con menos «📚 ¡Sigue practicando!». Si te quedas sin vidas puedes reiniciar con el botón **↻ Volver a jugar** y empezar de cero con las preguntas reordenadas.', 'At the end: **80 points or more** gives you «🏆 Excellent work!», **50 or more** «👏 Good try!», and below that «📚 Keep practicing!». If you run out of lives you can restart with the **↻ Play again** button and start fresh with shuffled questions.'], href: 'redes_challenge/index.html' },
    { c: 'Redes Challenge', k: ['que topologias aparecen', 'topologias del juego', 'temas del juego', 'que aprendo en el juego'], r: ['El juego evalúa las **5 topologías** vistas en la página de Redes: **Estrella, Bus, Anillo, Malla y Árbol**. Primero te pregunta por el diagrama (identificar la estructura que dibuja) y luego por conceptos (¿cuál usa un switch central?, ¿cuál tiene caminos alternativos?, etc.).', 'The game tests the **5 topologies** covered on the Networks page: **Star, Bus, Ring, Mesh and Tree**. It first asks about the diagram (identify the drawn structure) and then about concepts (which one uses a central switch? which one has alternative paths?, etc.).'], href: 'redes.html#topologias' },
    { c: 'Redes Challenge', k: ['estrella en el juego', 'switch central', 'cual usa un switch'], r: ['La **estrella** es la topología con un **dispositivo central** (un **SW/switch**) al que se conectan todas las PC con enlaces propios. Pista del juego: «todos los equipos se conectan a un dispositivo central». Es la estándar de las LAN modernas.', '**Star** is the topology with a **central device** (an **SW/switch**) that every PC connects to with its own link. Game hint: "all devices connect to one central device". It is the standard for modern LANs.'], href: 'redes.html#topologias' },
    { c: 'Redes Challenge', k: ['bus en el juego', 'cable troncal', 'cable compartido'], r: ['La **bus** usa un **cable principal (troncal) compartido** al que se cuelgan todos los equipos en línea recta. Pista del juego: «todos los equipos comparten un cable principal». Hoy sobrevive en buses industriales como CAN.', '**Bus** uses a **shared backbone cable** where all devices hang in a straight line. Game hint: "all devices share one main cable". Today it survives in industrial buses like CAN.'], href: 'redes.html#topologias' },
    { c: 'Redes Challenge', k: ['anillo en el juego', 'circuito cerrado', 'los equipos forman un ciclo'], r: ['El **anillo** conecta cada equipo con sus vecinos formando un **circuito cerrado** (PC1→PC2→PC3→PC4→PC1). Pista del juego: «los equipos forman un circuito cerrado».', '**Ring** connects each device to its neighbors forming a **closed loop** (PC1→PC2→PC3→PC4→PC1). Game hint: "devices form a closed circuit".'], href: 'redes.html#topologias' },
    { c: 'Redes Challenge', k: ['malla en el juego', 'caminos alternativos', 'enlaces multiples', 'redundancia'], r: ['La **malla** tiene **múltiples enlaces entre los dispositivos**: cada nodo se conecta con todos los demás, así hay **rutas redundantes** si un enlace falla. Pista del juego: «existen múltiples enlaces entre los dispositivos».', '**Mesh** has **multiple links between devices**: every node connects to all the others, so there are **redundant paths** if one link fails. Game hint: "there are multiple links between devices".'], href: 'redes.html#topologias' },
    { c: 'Redes Challenge', k: ['arbol en el juego', 'jerarquia de niveles', 'estructura jerarquica', 'ramas de una organizacion'], r: ['El **árbol** organiza los dispositivos en **niveles jerárquicos**: un switch raíz (SW1) conecta switches secundarios (SW2, SW3) y estos a las PC. Se parece a las ramas de una organización. Pista del juego: «los dispositivos se organizan en niveles jerárquicos».', '**Tree** organizes devices in **hierarchical levels**: a root switch (SW1) connects secondary switches (SW2, SW3), and those connect the PCs. It looks like the branches of an organization. Game hint: "devices are organized in hierarchical levels".'], href: 'redes.html#topologias' },
    { c: 'Redes Challenge', k: ['diagramas del juego', 'glosario y simulador', 'que mas ofrece el juego', 'idioma del juego'], r: ['Extras de **Redes Challenge**: los diagramas de topología son **SVG con efecto 3D** (se inclinan al mover el cursor), la barra superior muestra **puntos ⭐, pregunta ❔ y vidas ❤️**, y desde su menú lateral puedes saltar al **Glosario** de términos o al **Simulador Ping**. Funciona en **español e inglés** y también en el celular.', '**Redes Challenge** extras: the topology diagrams are **SVG with a 3D effect** (they tilt as you move the cursor), the top bar shows **points ⭐, question ❔ and lives ❤️**, and its side menu links to the **Glossary** and the **Ping Simulator**. It works in **Spanish and English** and on mobile too.'], href: 'redes_challenge/index.html' },
    { c: 'Otro', k: ['mi pc no enciende', 'no prende el computador', 'no arranca el pc', 'pantalla negra no enciende'], r: ['Si **no enciende**: revisa en orden — cable y toma de corriente, botón de la fuente (atrás), monitor encendido y bien conectado, y si hay pitidos o luces. Si huele a quemado o no da señales, no insistas: servicio técnico.', 'If it **will not turn on**: check in order — power cable and outlet, the PSU switch (at the back), monitor on and well connected, and whether there are beeps or lights. If it smells burnt or shows no signs, do not insist: get a technician.'] },
    { c: 'Otro', k: ['pantalla negra', 'pantalla en negro con cursor', 'monitor negro'], r: ['Pantalla negra con el equipo encendido: revisa cable del monitor y fuente de video, prueba otro puerto, y si empezó tras actualizar, sospecha del **controlador de video** (vuelve al anterior). Si no hay imagen ni en el arranque, puede ser RAM o GPU.', 'Black screen with the machine on: check the monitor cable and video source, try another port, and if it started after an update, suspect the **video driver** (roll back). If there is no image even at boot, it may be RAM or GPU.'] },
    { c: 'Otro', k: ['no tengo sonido', 'sin sonido pc', 'no suena el computador'], r: ['Sin sonido: revisa volumen y salida correcta (parlantes/auriculares), que el dispositivo no esté silenciado, y el **controlador de audio** (actualízalo desde el fabricante). Si empezó de repente, vuelve al controlador anterior.', 'No sound: check volume and the right output (speakers/headphones), that the device is not muted, and the **audio driver** (update it from the manufacturer). If it started suddenly, roll back to the previous driver.'] },
    { c: 'Otro', k: ['wifi inestable', 'wifi se cae', 'wifi se desconecta solo', 'wifi intermitente'], r: ['WiFi que se cae: acerca el equipo al módem o revisa su ubicación, cambia el canal en 2.4 GHz (1, 6 u 11) y actualiza el **controlador de red** desde el fabricante. Si solo falla un equipo, el problema es ese equipo, no la red.', 'WiFi dropping out: move closer to the modem or check its placement, change the 2.4 GHz channel (1, 6 or 11) and update the **network driver** from the manufacturer. If only one device fails, the problem is that device, not the network.'], href: 'wifi.html#instalar-modem' },
    { c: 'Otro', k: ['ventiladores hacen mucho ruido', 'ruido fuerte pc', 'suena mucho el computador'], r: ['Ruido fuerte: casi siempre son **ventiladores con polvo o trabajando al máximo por calor**. Limpia filtros y ventiladores con aire comprimido (sujetándolos) y revisa temperaturas; si el ruido es eléctrico o hay olor a quemado, apaga y consulta técnico.', 'Loud noise: almost always **fans full of dust or running at max because of heat**. Clean filters and fans with compressed air (holding them) and check temperatures; if the noise is electrical or there is a burning smell, power off and consult a technician.'], href: 'pc3d.html#mantenimiento' },
    { c: 'Otro', k: ['no carga la bateria', 'bateria no carga', 'portatil no carga'], r: ['Si no carga: prueba otro toma y otro cargador compatible, revisa que el conector no esté flojo o sucio y observa la salud de la batería. Si está **hinchada**, no la cargues ni la pinches: servicio técnico.', 'If it will not charge: try another outlet and another compatible charger, check the connector is not loose or dirty and watch battery health. If it is **swollen**, do not charge or puncture it: get a technician.'] },
    { c: 'Otro', k: ['hola', 'buenas', 'buenos dias', 'hey', 'saludos', 'hello', 'hi'], r: ['¡Hola! Soy el asistente de **NVISION** 🤖. Pregúntame de hardware, redes, el switch, el WiFi o del juego **Redes Challenge** 🎮. Toca una sugerencia o escribe tu duda.', 'Hi! I am the **NVISION** assistant 🤖. Ask me about hardware, networks, the switch, WiFi or the **Redes Challenge** game 🎮. Tap a suggestion or type your question.'] },
    { c: 'Otro', k: ['quien eres', 'que eres', 'que haces', 'para que sirves', 'ayuda', 'help', 'who are you', 'what can you do'], r: ['Soy un asistente **entrenado con el contenido de NVISION**: respondo desde una base de conocimiento guardada en la página, sin internet y sin IA externa. Si algo no lo sé, puedes **enseñármelo** en la pestaña «Entrenar» y lo aprendo en este navegador.', 'I am an assistant **trained on NVISION content**: I answer from a knowledge base stored in the page, no internet and no external AI. If I miss something, you can **teach me** in the "Train" tab and I learn it in this browser.'], },
    { c: 'Hardware', k: ['que es la cpu', 'procesador', 'cpu', 'cerebro del computador', 'what is the cpu', 'processor'], r: ['La **CPU** es el cerebro del PC: ejecuta las instrucciones de los programas. Se mide en núcleos e hilos (procesadores lógicos) y en GHz. En el detector del laboratorio puedes ver cuántos hilos tiene tu equipo.', 'The **CPU** is the brain of the PC: it runs program instructions. It is measured in cores and threads (logical processors) and in GHz. In the lab detector you can see how many threads your machine has.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es la ram', 'memoria ram', 'ram', 'para que sirve la ram', 'what is ram'], r: ['La **RAM** es la memoria de trabajo: guarda lo que el PC está usando ahora mismo y se borra al apagar. Más RAM = más programas abiertos sin que el equipo se ponga lento.', '**RAM** is the working memory: it holds what the PC is using right now and it clears when you shut down. More RAM = more open programs without slowdowns.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['tarjeta grafica', 'gpu', 'tarjeta de video', 'graphics card'], r: ['La **GPU** (tarjeta gráfica) dibuja todo lo que ves: pantalla, videos y juegos. Puede venir integrada en el procesador o ser una tarjeta dedicada con su propia memoria.', 'The **GPU** (graphics card) draws everything you see: screen, videos and games. It can be integrated into the processor or be a dedicated card with its own memory.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['placa madre', 'motherboard', 'mainboard', 'tarjeta madre'], r: ['La **placa madre** es la tarjeta principal donde se conecta TODO: procesador, RAM, almacenamiento y tarjetas. Es como el sistema nervioso del PC.', 'The **motherboard** is the main board where EVERYTHING connects: processor, RAM, storage and cards. It is like the nervous system of the PC.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['ssd', 'hdd', 'disco duro', 'almacenamiento', 'nvme', 'storage', 'hard drive'], r: ['El **almacenamiento** guarda tus archivos de forma permanente. El **SSD** (y su versión rápida NVMe) no tiene partes móviles y es mucho más veloz que el viejo disco duro **HDD**.', '**Storage** keeps your files permanently. The **SSD** (and its fast NVMe version) has no moving parts and is much faster than the old **HDD** hard drive.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['tarjeta de red', 'nic', 'tarjeta ethernet', 'network card'], r: ['La **NIC** es la tarjeta de red: el puente físico y lógico entre el PC y el cable (o la antena WiFi). Cada NIC tiene su dirección **MAC** única.', 'The **NIC** is the network card: the physical and logical bridge between the PC and the cable (or the WiFi antenna). Every NIC has its own unique **MAC** address.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['fuente de poder', 'psu', 'fuente de alimentacion', 'power supply'], r: ['La **fuente de poder (PSU)** convierte la corriente del enchufe en la energía que cada pieza necesita. Si es de mala calidad o queda corta de vatios, el PC se apaga o falla.', 'The **power supply (PSU)** turns wall power into the energy each part needs. A weak or low-quality one makes the PC shut down or fail.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['refrigeracion', 'refrigeracion liquida', 'cooler', 'ventilador', 'se calienta', 'cooling', 'overheating'], r: ['La **refrigeración** saca el calor del procesador: por aire (ventilador) o **líquida AIO** (bloque, mangueras y radiador). Sin ella, el PC baja su rendimiento para no quemarse.', '**Cooling** removes heat from the processor: by air (fan) or **liquid AIO** (block, tubes and radiator). Without it, the PC slows itself down to avoid burning up.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['unidad optica', 'lector de cd', 'dvd', 'bluray', 'optical drive'], r: ['La **unidad de disco óptico (ODD)** lee y graba CD, DVD y Blu-ray con un láser. Hoy es poco común porque casi todo llega por internet o USB.', 'The **optical disc drive (ODD)** reads and burns CDs, DVDs and Blu-ray with a laser. It is rare today because almost everything arrives over the internet or USB.'], href: 'hardware.html#componentes' },
    { c: 'Recursos', k: ['eniac', 'historia del computador', 'primer computador', 'pioneros', 'history of computers'], r: ['El **ENIAC** (1945) fue uno de los primeros computadores electrónicos: ocupaba una habitación y trabajaba con tubos de vacío. En la sección de historia ves la evolución hasta el PC actual.', 'The **ENIAC** (1945) was one of the first electronic computers: it filled a room and ran on vacuum tubes. In the history section you can see the evolution up to today\u2019s PC.'], href: 'hardware.html#historia' },
    { c: 'Redes', k: ['tipos de red', 'pan lan wan', 'clasificacion de redes', 'alcance de redes', 'que es una lan', 'que es una wan', 'network types', 'network scopes'], r: ['Las redes se clasifican por **alcance**: **PAN** (personal, unos metros), **LAN** (local, una casa u oficina), **MAN** (una ciudad) y **WAN** (países; internet es la WAN más grande). También están BAN, WLAN, CAN y GAN.', 'Networks are classified by **scope**: **PAN** (personal, a few meters), **LAN** (local, a home or office), **MAN** (a city) and **WAN** (countries; the internet is the biggest WAN). There are also BAN, WLAN, CAN and GAN.'], href: 'redes.html#alcance-redes' },
    { c: 'Redes', k: ['topologias', 'topologia estrella', 'bus', 'anillo', 'malla', 'topologies', 'star topology'], r: ['La **topología** es la forma en que se conectan los equipos: **estrella** (todos a un switch central, la más usada), **bus** (un solo cable), **anillo** (un círculo) y **malla** (todos con todos, muy resistente).', 'A **topology** is the shape of the connections: **star** (everyone to a central switch, the most common), **bus** (one single cable), **ring** (a circle) and **mesh** (everyone to everyone, very resilient).'], href: 'redes.html#topologias' },
    { c: 'Redes', k: ['como funciona un switch', 'switch', 'tabla mac', 'flooding', 'como aprende el switch', 'conmutador', 'how does a switch work'], r: ['El **switch** aprende en qué puerto está la MAC de cada equipo y anota eso en su **tabla MAC**. Cuando llega una trama, la reenvía **solo por el puerto correcto**. Si aún no conoce el destino, la envía por todos los puertos (**flooding**) y aprende con la respuesta. ¡Pruébalo en el laboratorio del switch!', 'The **switch** learns which port each MAC address lives on and writes it in its **MAC table**. When a frame arrives, it forwards it **only through the right port**. If it does not know the destination yet, it sends it through all ports (**flooding**) and learns from the reply. Try it in the switch lab!'], href: 'redes.html#switch-3d' },
    { c: 'Redes', k: ['hub', 'diferencia hub switch', 'hub vs switch', 'concentrador'], r: ['El **hub** es el antepasado tonto del switch: **no aprende nada** y repite cada trama por **todos** los puertos, siempre. El switch, en cambio, aprende las MAC y entrega cada trama solo a su destino: menos tráfico y más privacidad.', 'The **hub** is the switch\u2019s dumb ancestor: it **learns nothing** and repeats every frame through **all** ports, always. The switch instead learns MAC addresses and delivers each frame only to its destination: less traffic and more privacy.'], href: 'redes.html#switch-3d' },
    { c: 'Redes', k: ['simulador ping', 'ping', 'icmp', 'como hacer ping', 'ping simulator'], r: ['El **ping** envía paquetes **ICMP** a otro equipo y mide si responde y cuánto tarda: es la primera prueba para saber si hay conexión. En el simulador de Redes ves el paquete viajar paso a paso.', '**Ping** sends **ICMP** packets to another device and measures whether it answers and how long it takes: it is the first test to check a connection. In the Networks simulator you watch the packet travel step by step.'], href: 'redes.html#simulador-red' },
    { c: 'Recursos', k: ['ver mi ip', 'mi mac', 'ipconfig', 'como saber mi ip', 'direccion fisica', 'my ip address', 'my mac'], r: ['Con el código **ipconfig /all** en PowerShell ves la **IP** de tu equipo y su **dirección física (MAC)**. Está en el Laboratorio de Códigos, con botón para copiarlo.', 'With the code **ipconfig /all** in PowerShell you see your computer\u2019s **IP** and its **physical address (MAC)**. It lives in the Code Lab, with a copy button.'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['quien esta en mi red', 'arp', 'dispositivos de mi red', 'who is on my network'], r: ['El código **arp -a** lista los dispositivos que tu equipo conoce en la red local, con su IP y su MAC. Está en el Laboratorio de Códigos.', 'The code **arp -a** lists the devices your computer knows on the local network, with their IP and MAC. It lives in the Code Lab.'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['renovar ip', 'ipconfig renew', 'internet se puso raro', 'sin internet', 'renew ip', 'no internet'], r: ['Si el internet se pone raro, el código **ipconfig /release** + **ipconfig /renew** suelta tu IP y pide una nueva al router. Es el arreglo clásico; está en el Laboratorio de Códigos (PowerShell como administrador).', 'If the internet acts weird, the code **ipconfig /release** + **ipconfig /renew** drops your IP and asks the router for a new one. The classic fix; it lives in the Code Lab (PowerShell as administrator).'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['detectar mi equipo', 'datos de mi pc', 'especificaciones de mi pc', 'detect my device', 'my specs'], r: ['En el Laboratorio hay una tarjeta **«Detecta mi equipo»**: sin instalar nada muestra lo que el navegador puede ver: sistema, navegador, procesadores lógicos, RAM aproximada, gráfica, pantalla y batería. Son 7 datos; el modelo exacto del procesador solo sale con el código de PowerShell.', 'In the Lab there is a **"Detect my device"** card: with no installs it shows what the browser can see: system, browser, logical processors, approximate RAM, graphics, screen and battery. That is 7 items; the exact processor model only comes from the PowerShell code.'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['que es throughput', 'throughput', 'rendimiento de red'], r: ['**Throughput**: volumen real de datos que sí logran pasar entre dos puntos en un tiempo dado. Es lo que de verdad recibes, no lo que promete el papel.', '**Throughput**: the real volume of data that actually gets through between two points in a given time. It is what you truly receive, not what the paper promises.'], href: 'recursos.html#glosario' },
    { c: 'Recursos', k: ['que es bandwidth', 'bandwidth', 'ancho de banda', 'what is bandwidth'], r: ['**Bandwidth** (ancho de banda): capacidad máxima teórica de un canal, en bps. Una cosa es el ancho de la tubería y otra el agua que de verdad pasa (**throughput**).', '**Bandwidth**: the maximum theoretical capacity of a channel, in bps. One thing is the width of the pipe and another the water that actually flows (**throughput**).'], href: 'recursos.html#glosario' },
    { c: 'Recursos', k: ['que es un paquete', 'packet', 'paquete de datos', 'what is a packet'], r: ['Un **paquete** es la unidad de datos que viaja por la red: lleva encabezados con origen y destino, y la carga útil (tus datos). Todo en internet viaja en paquetes.', 'A **packet** is the unit of data that travels the network: it carries headers with source and destination, plus the payload (your data). Everything on the internet travels in packets.'], href: 'recursos.html#glosario' },
    { c: 'Hardware', k: ['limpiar mi pc', 'mantenimiento', 'polvo', 'pasta termica', 'cada cuanto limpiar', 'clean my pc', 'maintenance'], r: ['El **mantenimiento** básico: soplar el polvo con **aire comprimido**, trabajar con **manilla antiestática** y cambiar la **pasta térmica** de vez en cuando. En PC3D tienes la guía con las herramientas y sus fotos.', 'Basic **maintenance**: blow dust out with **compressed air**, work with an **anti-static wrist strap** and replace the **thermal paste** from time to time. In PC3D you have the guide with the tools and their photos.'], href: 'pc3d.html#mantenimiento' },
    { c: 'Hardware', k: ['herramientas', 'manilla antiestatica', 'aire comprimido', 'destornillador', 'tools', 'anti static wrist strap'], r: ['Las **herramientas indispensables** del mantenimiento: destornillador de precisión, manilla antiestática, aire comprimido en lata, brocha suave y bridas para ordenar cables. Están en la sección de herramientas de PC3D.', 'The essential **maintenance tools**: precision screwdriver, anti-static wrist strap, canned compressed air, soft brush and cable ties. They are in the PC3D tools section.'], href: 'pc3d.html#mantenimiento' },
    { c: 'Hardware', k: ['explorador 3d', 'visor 3d', 'torre 3d', 'ver el pc por dentro', 'pc3d', '3d explorer'], r: ['El **explorador 3D** de PC3D te deja recorrer la torre por capas y reconocer cada pieza: placa, CPU, RAM, GPU, almacenamiento, fuente, red y hasta la unidad óptica.', 'The PC3D **3D explorer** lets you walk through the tower layer by layer and recognize each part: board, CPU, RAM, GPU, storage, PSU, networking and even the optical drive.'], href: 'pc3d.html#visor-3d' },
    { c: 'WiFi', k: ['instalar modem', 'configurar router', 'movistar', 'entrar al router', '192.168.1.1', 'install modem', 'router setup'], r: ['Para **instalar el módem/router**: conecta el cable del proveedor, enciende y espera las luces fijas; luego entra al panel en **192.168.1.1** con los datos de la etiqueta y cambia SSID, contraseña y seguridad WPA2/WPA3. La guía completa está en WiFi Avanzado.', 'To **install the modem/router**: plug the provider cable, power on and wait for solid lights; then open the panel at **192.168.1.1** with the label credentials and change SSID, password and WPA2/WPA3 security. The full guide is in Advanced WiFi.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['repetidor', 'extensor', 'no llega el wifi', 'ampliar cobertura', 'wps', 'repeater', 'wifi coverage'], r: ['Un **repetidor** recibe el WiFi y lo reemite: ponlo a **mitad de camino**, donde aún llegue buena señal. Se enlaza por **WPS** (botón en ambos equipos) o a mano desde su panel. Si lo pones donde no hay señal, no tiene nada que repetir.', 'A **repeater** picks up WiFi and rebroadcasts it: place it **halfway**, where signal is still good. Link it by **WPS** (button on both devices) or manually from its panel. If you place it where there is no signal, it has nothing to repeat.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['cambiar clave wifi', 'contraseña del router', 'seguridad wifi', 'wpa2 wpa3', 'change wifi password'], r: ['Cambia la clave del WiFi desde el panel del router (**192.168.1.1**): contraseña nueva de más de 12 caracteres y seguridad **WPA2 o WPA3**. Y nunca dejes el usuario admin de fábrica del panel.', 'Change the WiFi password from the router panel (**192.168.1.1**): a new password over 12 characters and **WPA2 or WPA3** security. And never keep the panel factory admin user.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['2.4 o 5 ghz', 'banda wifi', 'wifi lento', 'canal wifi', 'wifi slow', 'wifi band'], r: ['**2.4 GHz** llega más lejos y cruza paredes, pero es más lenta; **5 GHz** es mucho más rápida cerca del módem. Si el WiFi va lento en un edificio lleno de redes, cambia el canal (1, 6 u 11 en 2.4 GHz).', '**2.4 GHz** reaches farther and crosses walls, but it is slower; **5 GHz** is much faster near the modem. If WiFi is slow in a building full of networks, change the channel (1, 6 or 11 on 2.4 GHz).'], href: 'wifi.html#instalar-modem' },
    { c: 'Otro', k: ['por donde empiezo', 'ruta de aprendizaje', 'que ver primero', 'como usar el sitio', 'donde empiezo', 'learning path', 'where do i start'], r: ['Ruta sugerida: **1)** Historia y componentes en Hardware, **2)** el explorador 3D de PC3D, **3)** tipos de red y topologías en Redes, **4)** el laboratorio del switch y el simulador ping, **5)** los códigos y el glosario en Recursos, y **6)** la guía WiFi. En ese orden todo encaja.', 'Suggested path: **1)** History and components in Hardware, **2)** the PC3D 3D explorer, **3)** network types and topologies in Networks, **4)** the switch lab and the ping simulator, **5)** the codes and glossary in Resources, and **6)** the WiFi guide. In that order everything clicks.'] },
    { c: 'Otro', k: ['gracias', 'muchas gracias', 'te agradezco', 'thanks', 'thank you'], r: ['¡Con gusto! 💚 Si te queda otra duda del sitio, pregúntame; y si alguna vez no sé algo, puedes enseñármelo en la pestaña «Entrenar».', 'You are welcome! 💚 If you have another question about the site, ask me; and if I ever miss something, you can teach me in the "Train" tab.'] },
    { c: 'Otro', k: ['chao', 'adios', 'hasta luego', 'nos vemos', 'bye', 'see you'], r: ['¡Hasta pronto! 👋 Recuerda: el switch aprende solo si le envías tramas… y yo también aprendo si me enseñas.', 'See you soon! 👋 Remember: the switch only learns if you send it frames… and I learn too if you teach me.'] },
{ c: 'Hardware', k: ['diferencia entre ram y disco', 'ram vs ssd', 'ram o almacenamiento', 'memoria ram o disco duro', 'ram vs storage'], r: ['No es lo mismo: la **RAM** es el escritorio de trabajo (rápida, temporal, se vacía al apagar) y el **almacenamiento** es el archivador (permanente). Un PC necesita los dos: sin RAM no trabaja y sin disco no guarda nada.', '**RAM** is the work desk (fast, temporary, cleared at shutdown) and **storage** is the filing cabinet (permanent). A PC needs both: without RAM it cannot work and without a drive it cannot keep anything.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que son los nucleos', 'nucleos e hilos', 'cuantos nucleos necesito', 'hilos del procesador', 'cores and threads', 'what are cores'], r: ['Cada **núcleo** es un cerebro independiente dentro de la CPU; los **hilos** (procesadores lógicos) son las tareas que cada núcleo puede turnarse. Más núcleos = más tareas a la vez: para estudiar y navegar bastan 4; para editar video o jugar ayudan 6-8.', 'Each **core** is an independent brain inside the CPU; **threads** (logical processors) are the tasks each core can juggle. More cores = more tasks at once: 4 is enough for study and browsing; 6-8 help for video editing or gaming.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['intel o amd', 'intel core o ryzen', 'que procesador es mejor', 'amd ryzen', 'intel vs amd', 'ryzen vs intel'], r: ['Las dos grandes marcas de CPU para PC son **Intel Core** y **AMD Ryzen** (y **ARM** domina en celulares). Ninguna gana siempre: se compite modelo contra modelo según precio y uso. En PC3D ves los tipos y qué mirar antes de elegir.', 'The two big PC CPU brands are **Intel Core** and **AMD Ryzen** (and **ARM** rules phones). Neither always wins: compare model against model by price and use. In PC3D you can see the types and what to check before choosing.'], href: 'pc3d.html#componentes-3d' },
    { c: 'Hardware', k: ['que es arm', 'arquitectura arm', 'x86 x64', 'arquitectura del procesador', 'what is arm'], r: ['**x86/x64** es la arquitectura clásica de los PC (Intel/AMD); **ARM** es la de celulares y tablets: gasta menos energía y hoy también vive en portátiles. El software debe estar hecho para la arquitectura de tu equipo.', '**x86/x64** is the classic PC architecture (Intel/AMD); **ARM** is the phone and tablet one: it uses less power and now lives in laptops too. Software must be built for your machine\u2019s architecture.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['atx micro atx mini itx', 'tamanos de placa madre', 'formatos de placa', 'placa atx', 'motherboard sizes'], r: ['La placa madre viene en tamaños: **ATX** (grande, más ranuras), **Micro-ATX** (mediana, la más común) y **Mini-ITX** (compacta, para equipos pequeños). El gabinete debe aceptar el mismo formato.', 'Motherboards come in sizes: **ATX** (large, more slots), **Micro-ATX** (medium, the most common) and **Mini-ITX** (compact, for small builds). The case must accept the same format.'], href: 'pc3d.html#componentes-3d' },
    { c: 'Hardware', k: ['que es pcie', 'pci express', 'ranuras de expansion', 'que es el chipset', 'buses de la placa', 'what is pcie'], r: ['El **PCIe** es la autopista rápida de la placa madre: por sus ranuras se conectan la GPU y la tarjeta de red. El **chipset** es el coordinador que organiza el tráfico entre CPU, RAM, almacenamiento y periféricos.', '**PCIe** is the motherboard\u2019s fast highway: the GPU and the network card plug into its slots. The **chipset** is the coordinator that organizes traffic between CPU, RAM, storage and peripherals.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['ddr3 ddr4 ddr5', 'tipos de memoria ram', 'que ram usa mi pc', 'dimm sodimm', 'diferencia ddr4 ddr5', 'ram types'], r: ['La RAM viene en generaciones **DDR3, DDR4 y DDR5**: cada una es más rápida, pero **no son compatibles entre sí** (la ranura cambia). **DIMM** es el módulo de escritorio y **SO-DIMM** el de portátil.', 'RAM comes in **DDR3, DDR4 and DDR5** generations: each is faster, but they are **not compatible with each other** (the slot changes). **DIMM** is the desktop module and **SO-DIMM** the laptop one.'], href: 'pc3d.html#componentes-3d' },
    { c: 'Hardware', k: ['cuanta ram necesito', '8 o 16 gb', 'cuanta memoria ram', 'ram para estudiar', 'how much ram'], r: ['Guía rápida: **8 GB** para tareas básicas y estudiar, **16 GB** para jugar y multitarea cómoda, **32 GB** para edición de video, diseño 3D o máquinas virtuales. Si dudas entre 8 y 16, elige 16: es lo que más se nota en el día a día.', 'Quick guide: **8 GB** for basic tasks and study, **16 GB** for gaming and comfortable multitasking, **32 GB** for video editing, 3D design or virtual machines. If you doubt between 8 and 16, pick 16: it is what you notice most day to day.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['grafica integrada o dedicada', 'integrada vs dedicada', 'que es vram', 'cuanta vram', 'integrated vs dedicated gpu'], r: ['La GPU **integrada** vive dentro del procesador y comparte la RAM: sirve para estudiar, video y juegos ligeros. La **dedicada** es una tarjeta propia con su memoria **VRAM**: es la que necesitas para juegos exigentes, 3D e IA.', 'An **integrated** GPU lives inside the processor and shares RAM: fine for study, video and light games. A **dedicated** one is its own card with its own **VRAM** memory: what you need for demanding games, 3D and AI.'], href: 'pc3d.html#componentes-3d' },
    { c: 'Hardware', k: ['hdd ssd sata nvme', 'sata o nvme', 'que es m.2', 'tipos de almacenamiento', 'diferencia ssd hdd', 'ssd vs hdd'], r: ['**HDD**: disco mecánico, barato y lento. **SSD SATA**: rápido, formato clásico. **SSD NVMe (M.2)**: se conecta directo por PCIe y es el más veloz. Para revivir un PC viejo, cambiar el HDD por un SSD es la mejora número uno.', '**HDD**: mechanical drive, cheap and slow. **SATA SSD**: fast, classic format. **NVMe SSD (M.2)**: plugs straight into PCIe and is the fastest. To revive an old PC, swapping the HDD for an SSD is the number one upgrade.'], href: 'pc3d.html#componentes-3d' },
    { c: 'Hardware', k: ['certificacion 80 plus', 'fuente bronze gold', 'cuantos watts necesito', 'vatios de la fuente', '80 plus', 'psu wattage'], r: ['La certificación **80 Plus** (Bronze, Silver, Gold, Platinum, Titanium) dice qué tan eficiente es la fuente. En vatios: un PC básico vive con 400-500 W; uno con GPU dedicada pide 550-750 W según la tarjeta.', 'The **80 Plus** certification (Bronze, Silver, Gold, Platinum, Titanium) tells how efficient the PSU is. In watts: a basic PC lives on 400-500 W; one with a dedicated GPU asks for 550-750 W depending on the card.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['aire o liquida', 'disipador o aio', 'tipos de refrigeracion', 'custom loop', 'air vs liquid cooling'], r: ['Tres niveles: **disipador de aire** (simple y confiable), **líquida AIO** (bloque + radiador, silenciosa) y **custom loop** (circuito hecho a mano, para entusiastas). Para la mayoría, un buen disipador de aire basta.', 'Three levels: **air cooler** (simple and reliable), **liquid AIO** (block + radiator, quiet) and **custom loop** (hand-built circuit, for enthusiasts). For most people, a good air cooler is enough.'], href: 'pc3d.html#componentes-3d' },
    { c: 'Hardware', k: ['mi pc se apaga solo', 'se apaga jugando', 'el pc se reinicia solo', 'pc se apaga', 'computer shuts down'], r: ['Si el PC **se apaga solo**, sospecha en este orden: **temperatura** (polvo, pasta térmica seca), **fuente de poder** corta o fallando, y drivers. Empieza por la limpieza de PC3D y revisa que los ventiladores giren.', 'If the PC **shuts down by itself**, suspect in this order: **temperature** (dust, dry thermal paste), a weak or failing **power supply**, and drivers. Start with the PC3D cleaning and check that the fans spin.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['mi pc se congela', 'pantallazo azul', 'se traba el computador', 'pc se queda pegado', 'computer freezes'], r: ['Congelamientos y pantallazos suelen venir de **RAM** inestable, disco con errores o drivers. Revisa el estado **SMART** del almacenamiento, actualiza controladores desde fuentes oficiales y, si empezó tras instalar algo, desinstálalo.', 'Freezes and blue screens usually come from unstable **RAM**, a failing drive or drivers. Check the storage **SMART** status, update drivers from official sources and, if it started after installing something, uninstall it.'], href: 'pc3d.html#mantenimiento' },
    { c: 'Hardware', k: ['que es un computador', 'que es una computadora', 'que es un pc', 'what is a computer'], r: ['Un **computador** es una máquina que procesa datos: recibe información, la trabaja con programas y entrega resultados. Por dentro es la suma de sus componentes: placa madre, CPU, RAM, almacenamiento, fuente y conexión de red.', 'A **computer** is a machine that processes data: it takes information in, works on it with programs and delivers results. Inside, it is the sum of its parts: motherboard, CPU, RAM, storage, power supply and network connection.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es hardware', 'que es software', 'diferencia hardware software', 'what is hardware'], r: ['**Hardware** es lo físico (lo que puedes tocar: CPU, RAM, pantalla). **Software** son los programas (lo que no se toca: sistema operativo, apps). Uno sin el otro no sirve: el hardware ejecuta lo que el software ordena.', '**Hardware** is the physical part (what you can touch: CPU, RAM, screen). **Software** is the programs (what you cannot touch: operating system, apps). Neither works alone: hardware runs what software commands.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['perifericos', 'teclado mouse monitor', 'dispositivos de entrada y salida', 'peripherals'], r: ['Los **periféricos** conectan al PC con el mundo: de **entrada** (teclado, mouse, micrófono) y de **salida** (monitor, parlantes, impresora). Se enchufan por USB, Bluetooth o a la placa madre.', '**Peripherals** connect the PC to the world: **input** (keyboard, mouse, microphone) and **output** (monitor, speakers, printer). They plug in via USB, Bluetooth or the motherboard.'], href: 'hardware.html#componentes' },
    { c: 'Hardware', k: ['que es la bios', 'bios uefi', 'firmware del pc', 'what is bios'], r: ['La **BIOS/UEFI** es el programa mínimo grabado en la placa madre que despierta el hardware al encender y le pasa el control al sistema operativo. Desde ahí también se ajusta el orden de arranque.', 'The **BIOS/UEFI** is the tiny program stored on the motherboard that wakes the hardware at power-on and hands control to the operating system. Boot order is also set there.'], href: 'hardware.html#componentes' },
    { c: 'Recursos', k: ['cuanto pesaba el eniac', 'tubos de vacio', 'cuando se creo el eniac', 'para que servia el eniac', 'project px', 'eniac facts'], r: ['Datos del **ENIAC**: se financió en secreto en 1943 (Project PX) para calcular tablas balísticas, se presentó en 1946, pesaba más de **27 toneladas**, ocupaba 167 m², gastaba 150 kW y funcionaba con más de **17.000 tubos de vacío**.', '**ENIAC** facts: secretly funded in 1943 (Project PX) to compute ballistic tables, unveiled in 1946, it weighed over **27 tons**, filled 167 m², drew 150 kW and ran on more than **17,000 vacuum tubes**.'], href: 'hardware.html#historia' },
    { c: 'Recursos', k: ['evolucion de los computadores', 'historia de la computacion', 'generaciones de computadores', 'history of computing'], r: ['La ruta: tubos de vacío (ENIAC) → transistores → circuitos integrados → microprocesador → el PC de hoy. Cada salto hizo los equipos más pequeños, baratos y potentes. La sección de Historia lo recorre con sus pioneros.', 'The path: vacuum tubes (ENIAC) → transistors → integrated circuits → microprocessor → today\u2019s PC. Each leap made machines smaller, cheaper and more powerful. The History section walks it with its pioneers.'], href: 'hardware.html#historia' },
    { c: 'Redes', k: ['que es una ban', 'red corporal', 'body area network', 'red de area corporal', 'sensores en el cuerpo'], r: ['Una **BAN** es la red más pequeña: menos de 1 metro alrededor del cuerpo. Conecta biosensores y wearables de salud: marcapasos inteligentes, monitores de glucosa o de ritmo cardíaco (estándar IEEE 802.15.6).', 'A **BAN** is the smallest network: under 1 meter around the body. It connects health biosensors and wearables: smart pacemakers, glucose or heart-rate monitors (IEEE 802.15.6 standard).'], href: 'redes.html#alcance-redes' },
    { c: 'Redes', k: ['que es una pan', 'red personal', 'personal area network', 'red de area personal'], r: ['Una **PAN** cubre de 1 a 10 metros alrededor de una persona: enlaza su celular, reloj y audífonos por **Bluetooth**, NFC o Zigbee, con muy bajo consumo.', 'A **PAN** covers 1 to 10 meters around a person: it links their phone, watch and earbuds over **Bluetooth**, NFC or Zigbee, with very low power use.'], href: 'redes.html#alcance-redes' },
    { c: 'Redes', k: ['que es wlan', 'lan o wlan', 'red local inalambrica', 'wireless lan'], r: ['**LAN** es la red local por cable y **WLAN** es la misma red local pero inalámbrica (Wi-Fi). Cubren una casa u oficina, hasta unos 100 m por segmento de cable.', '**LAN** is the wired local network and **WLAN** is the same local network but wireless (Wi-Fi). They cover a home or office, up to about 100 m per cable segment.'], href: 'redes.html#alcance-redes' },
    { c: 'Redes', k: ['que es una can', 'red de campus', 'campus area network', 'red universitaria'], r: ['Una **CAN** une los edificios de un campus (universidad, hospital, parque industrial) en un radio de 1 a 5 km, con troncales de fibra óptica de alta velocidad.', 'A **CAN** links the buildings of a campus (university, hospital, industrial park) within 1 to 5 km, with high-speed fiber-optic backbones.'], href: 'redes.html#alcance-redes' },
    { c: 'Redes', k: ['que es una man', 'red metropolitana', 'metropolitan area network', 'red de una ciudad'], r: ['Una **MAN** cubre una ciudad completa (hasta ~50 km) con anillos de fibra óptica: redes municipales, cámaras urbanas o TV por cable.', 'A **MAN** covers a whole city (up to ~50 km) with fiber-optic rings: municipal networks, city cameras or cable TV.'], href: 'redes.html#alcance-redes' },
    { c: 'Redes', k: ['que es una gan', 'red global', 'global area network', 'red planetaria', 'starlink que red es'], r: ['Una **GAN** es planetaria: une redes terrestres y espaciales sin fronteras. Ejemplos: constelaciones de satélites como **Starlink**, el GPS y los cables submarinos transoceánicos.', 'A **GAN** is planetary: it joins land and space networks without borders. Examples: satellite constellations like **Starlink**, GPS and transoceanic submarine cables.'], href: 'redes.html#alcance-redes' },
    { c: 'Redes', k: ['topologia estrella', 'star topology', 'ventajas de la estrella', 'red en estrella'], r: ['En la topología **estrella** cada equipo se conecta a un switch central. Si un cable falla, el resto sigue; es fácil de diagnosticar y de crecer. Su punto débil: si cae el switch central, cae toda la red. Es el estándar de las LAN modernas.', 'In a **star** topology every device connects to a central switch. If one cable fails, the rest keeps working; it is easy to diagnose and grow. Its weak point: if the central switch dies, the whole network does. It is the modern LAN standard.'], href: 'redes.html#topologias' },
    { c: 'Redes', k: ['topologia bus', 'red en bus', 'cable troncal', 'bus topology'], r: ['En la topología **bus** todos comparten un único cable troncal con terminadores en los extremos. Barata y simple, pero una rotura del troncal tumba toda la red. Hoy vive en redes de autos (CAN bus) e industria.', 'In a **bus** topology everyone shares a single backbone cable with terminators at both ends. Cheap and simple, but a break in the backbone kills the whole network. Today it lives in car networks (CAN bus) and industry.'], href: 'redes.html#topologias' },
    { c: 'Redes', k: ['topologia anillo', 'red en anillo', 'token ring', 'ring topology', 'testigo token'], r: ['En la topología **anillo** cada equipo se conecta a dos vecinos formando un círculo y los datos viajan en un solo sentido pasando un **testigo (token)**: sin colisiones, pero si un equipo se desconecta, el ciclo se rompe.', 'In a **ring** topology each device connects to two neighbors forming a circle and data travels one way passing a **token**: no collisions, but if one device disconnects, the cycle breaks.'], href: 'redes.html#topologias' },
    { c: 'Redes', k: ['topologia malla', 'red en malla', 'mesh topology', 'wifi mesh', 'red mesh'], r: ['En la topología **malla** cada nodo se conecta con varios o todos los demás: hay muchas rutas y si un enlace cae, el tráfico se redirige al instante. Es la base del backbone de internet y de los Wi-Fi Mesh.', 'In a **mesh** topology each node connects to several or all others: there are many routes and if a link fails, traffic reroutes instantly. It is the basis of the internet backbone and of Wi-Fi Mesh systems.'], href: 'redes.html#topologias' },
    { c: 'Redes', k: ['topologia arbol', 'topologia hibrida', 'tree topology', 'red jerarquica'], r: ['La topología **árbol** organiza la red en niveles (núcleo, distribución y acceso) como varias estrellas unidas; la **híbrida** mezcla dos o más topologías según la zona. Son las de campus y grandes empresas.', 'The **tree** topology organizes the network in levels (core, distribution, access) like several joined stars; the **hybrid** mixes two or more topologies per area. They are the campus and big-company choices.'], href: 'redes.html#topologias' },
    { c: 'Redes', k: ['que es la mac', 'direccion mac', 'mac address', 'mac de 48 bits', 'what is a mac address'], r: ['La **dirección MAC** es el identificador físico único de cada tarjeta de red: **48 bits** grabados de fábrica en su memoria (ej. 00:1A:2B:3C:4D:01). Con ella trabaja el switch en la capa 2. La ves con el código ipconfig /all.', 'The **MAC address** is the unique physical ID of each network card: **48 bits** burned in at the factory (e.g. 00:1A:2B:3C:4D:01). The switch works with it at layer 2. You can see yours with the ipconfig /all code.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['que es una ip', 'direccion ip', 'ip address', 'que es la ip', 'what is an ip address'], r: ['La **dirección IP** es el número lógico que identifica a tu equipo dentro de una red (ej. 192.168.1.10 en casa). A diferencia de la MAC, la IP **cambia** según la red a la que te conectes; la asigna el router.', 'The **IP address** is the logical number that identifies your device on a network (e.g. 192.168.1.10 at home). Unlike the MAC, the IP **changes** with each network you join; the router assigns it.'] },
    { c: 'Redes', k: ['diferencia entre ip y mac', 'ip o mac', 'ip vs mac'], r: ['**MAC** = identidad física de la tarjeta de red, nunca cambia. **IP** = la dirección de donde estás conectado hoy, cambia por red. El switch usa la MAC (capa 2); el router usa la IP (capa 3).', '**MAC** = the network card\u2019s physical identity, it never changes. **IP** = the address of where you are connected today, it changes per network. The switch uses the MAC (layer 2); the router uses the IP (layer 3).'] },
    { c: 'Redes', k: ['que es un router', 'que es el gateway', 'puerta de enlace', 'router gateway', 'what is a router'], r: ['El **router** conecta tu red local con otras redes (internet) usando direcciones IP: es la **puerta de enlace (gateway)**, en casa suele ser 192.168.1.1. En el simulador ves cómo enruta entre la LAN y el servidor web.', 'The **router** connects your local network to other networks (the internet) using IP addresses: it is the **gateway**, at home usually 192.168.1.1. In the simulator you watch it route between the LAN and the web server.'], href: 'redes.html#simulador-red' },
    { c: 'Redes', k: ['diferencia switch y router', 'switch o router', 'switch vs router', 'capa 2 y capa 3'], r: ['**Switch**: mueve tramas dentro de tu red local usando MAC (capa 2). **Router**: mueve paquetes entre redes distintas usando IP (capa 3). En casa ambos viven dentro del mismo equipo del proveedor.', '**Switch**: moves frames inside your local network using MAC (layer 2). **Router**: moves packets between different networks using IP (layer 3). At home both live inside the same provider box.'], href: 'redes.html#simulador-red' },
    { c: 'Redes', k: ['que es ttl', 'que es rtt', 'latencia del ping', 'perdida de paquetes', 'packet loss'], r: ['En un ping: **RTT** es el tiempo de ida y vuelta en ms (tu latencia), **TTL** es cuántos saltos le quedan al paquete antes de descartarse, y la **pérdida** dice qué porcentaje no volvió. El simulador muestra las tres métricas.', 'In a ping: **RTT** is the round-trip time in ms (your latency), **TTL** is how many hops the packet has left before being dropped, and **loss** says what percentage never came back. The simulator shows all three metrics.'], href: 'redes.html#simulador-red' },
    { c: 'Redes', k: ['trama o paquete', 'diferencia trama paquete', 'que es una trama', 'frame vs packet'], r: ['La **trama** es la unidad de la capa 2 (lleva MAC origen y destino) y el **paquete** la de la capa 3 (lleva IP origen y destino). El paquete viaja dentro de la trama cuando cruza tu red local.', 'The **frame** is the layer 2 unit (it carries source and destination MAC) and the **packet** is the layer 3 unit (source and destination IP). The packet travels inside the frame across your local network.'], href: 'redes.html#simulador-red' },
    { c: 'Redes', k: ['que es una vlan', 'vlan', 'red virtual', 'virtual lan'], r: ['Una **VLAN** divide un mismo switch en varias redes lógicas separadas, como si fueran switches distintos: orden y seguridad sin comprar más equipos. En el simulador la LAN trabaja en la VLAN 10.', 'A **VLAN** splits one switch into several separate logical networks, as if they were different switches: order and security without buying more gear. In the simulator the LAN runs on VLAN 10.'], href: 'redes.html#simulador-red' },
    { c: 'Redes', k: ['que es ethernet', 'puerto rj45', 'cable de red', 'cable ethernet', 'categorias de cable', 'cat6 cat5e'], r: ['**Ethernet** es la tecnología de red por cable: se conecta por puertos **RJ-45** con cable de par trenzado (categorías como Cat5e o Cat6). En la página de Redes ves el puerto y cómo la NIC lo enlaza por el bus PCIe.', '**Ethernet** is the wired networking technology: it connects through **RJ-45** ports with twisted-pair cable (categories like Cat5e or Cat6). On the Networks page you can see the port and how the NIC links it over the PCIe bus.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['que es internet', 'como funciona internet', 'la red de redes', 'what is the internet'], r: ['**Internet** es la WAN más grande del planeta: millones de redes (LAN, MAN, de proveedores) unidas por routers y protocolos comunes. Tu casa se conecta a ella a través de tu proveedor.', 'The **internet** is the biggest WAN on the planet: millions of networks (LANs, MANs, providers) joined by routers and common protocols. Your home connects to it through your provider.'], href: 'redes.html#alcance-redes' },
    { c: 'Redes', k: ['que es bluetooth', 'bluetooth', 'como funciona bluetooth'], r: ['**Bluetooth** es la tecnología inalámbrica de corto alcance (1-10 m) con la que se forma una PAN: audífonos, relojes y celulares se enlazan con muy bajo consumo (versión 5.3 en equipos recientes).', '**Bluetooth** is the short-range wireless technology (1-10 m) that forms a PAN: earbuds, watches and phones link with very low power use (version 5.3 on recent gear).'], href: 'redes.html#alcance-redes' },
    { c: 'Redes', k: ['como viajan los datos', 'flujo de datos en el host', 'de la ram al cable'], r: ['Dentro de tu equipo el viaje es: los datos salen de la **RAM**, la **CPU** los procesa y los entrega a la **NIC**, que los convierte en señales para el cable o el aire. Por eso la tarjeta de red también es hardware clave.', 'Inside your machine the trip is: data leaves the **RAM**, the **CPU** processes it and hands it to the **NIC**, which turns it into signals for the cable or the air. That is why the network card is key hardware too.'], href: 'redes.html#redes' },
    { c: 'Redes', k: ['como uso el simulador', 'simulador de redes', 'wireshark'], r: ['En el **simulador de Redes**: elige host de origen (PC1 o PC2) y destino (el servidor web o la otra PC), pulsa «Enviar Ping ICMP» y mira el monitor de tráfico: verás la trama (capa 2), el paquete (capa 3), el TTL y el RTT.', 'In the **Networks simulator**: pick a source host (PC1 or PC2) and a destination (the web server or the other PC), press "Send ICMP Ping" and watch the traffic monitor: you will see the frame (layer 2), the packet (layer 3), TTL and RTT.'], href: 'redes.html#simulador-red' },
    { c: 'Recursos', k: ['codigo de diagnostico', 'get-computerinfo', 'ver componentes con powershell', 'diagnostico de hardware codigo', 'modelo exacto de mi procesador'], r: ['El código **Get-ComputerInfo | Select-Object CsManufacturer, CsModel, CsProcessors, CsTotalPhysicalMemory** en PowerShell muestra fabricante, modelo, procesador exacto y RAM total de tu equipo. Es el diagnóstico completo que el detector del navegador no puede dar.', 'The code **Get-ComputerInfo | Select-Object CsManufacturer, CsModel, CsProcessors, CsTotalPhysicalMemory** in PowerShell shows your machine\u2019s maker, model, exact processor and total RAM. It is the full diagnosis the browser detector cannot give.'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['que es powershell', 'como abro powershell', 'como usar powershell', 'powershell'], r: ['**PowerShell** es la consola de códigos de Windows: allí pegas los códigos del Laboratorio. Ábrela desde el menú Inicio buscando «PowerShell»; para el código de renovar IP, ejecútala **como administrador** (clic derecho).', '**PowerShell** is the Windows code console: that is where you paste the Lab codes. Open it from the Start menu by searching "PowerShell"; for the renew-IP code, run it **as administrator** (right click).'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['codigo ping', 'ping 8.8.8.8', 'probar conexion con codigo', 'hay conexion codigo'], r: ['El código **ping 8.8.8.8** envía paquetes al servidor de Google: si responde, tu internet funciona; si todo se pierde, el problema está en tu red local. Está en el Laboratorio de Códigos, listo para copiar.', 'The code **ping 8.8.8.8** sends packets to Google\u2019s server: if it answers, your internet works; if everything is lost, the problem is in your local network. It lives in the Code Lab, ready to copy.'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['que es dns', 'dns', 'servidor dns', 'domain name system'], r: ['El **DNS** es la agenda telefónica de internet: traduce nombres como nvision.social a la dirección IP del servidor. Si el DNS falla, parece que «no hay internet» aunque la conexión esté perfecta.', '**DNS** is the internet\u2019s phone book: it translates names like nvision.social into the server\u2019s IP address. If DNS fails, it looks like "no internet" even when the connection is perfect.'] },
    { c: 'Recursos', k: ['que es la latencia', 'latencia', 'lag', 'ping alto'], r: ['La **latencia** es el tiempo que tarda un dato en ir y volver (el ping, en milisegundos). Para jugar y videollamadas importa más que la velocidad bruta: menos de 50 ms va sobrado; más de 150 ms se siente como «lag».', '**Latency** is how long data takes to go and come back (the ping, in milliseconds). For gaming and video calls it matters more than raw speed: under 50 ms is plenty; over 150 ms feels like "lag".'] },
    { c: 'Recursos', k: ['que es un protocolo', 'protocolos de red', 'network protocol'], r: ['Un **protocolo** es el acuerdo de cómo se comunican los equipos: idioma, formato y turnos. Ejemplos: **ICMP** (el del ping), **HTTP** (web) y la familia TCP/IP que mueve internet.', 'A **protocol** is the agreement on how devices communicate: language, format and turns. Examples: **ICMP** (the ping one), **HTTP** (web) and the TCP/IP family that moves the internet.'] },
    { c: 'Recursos', k: ['que es un servidor', 'que es un host', 'servidor web', 'server host'], r: ['Un **host** es cualquier equipo conectado a la red. Un **servidor** es un host que ofrece servicios a otros: el del simulador, por ejemplo, es un servidor web (10.0.0.80) que responde por HTTP y DNS.', 'A **host** is any device connected to the network. A **server** is a host that offers services to others: the one in the simulator, for example, is a web server (10.0.0.80) answering over HTTP and DNS.'] },
    { c: 'Recursos', k: ['por que el detector no muestra mi procesador', 'detector no sale grafica', 'grafica oculta brave', 'limitaciones del detector'], r: ['El detector solo ve lo que el navegador permite: por privacidad, navegadores como **Brave** ocultan la gráfica real, y ningún navegador revela el modelo exacto del procesador. Para eso está el código de PowerShell del propio laboratorio.', 'The detector only sees what the browser allows: for privacy, browsers like **Brave** hide the real graphics card, and no browser reveals the exact processor model. That is what the lab\u2019s own PowerShell code is for.'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['como copio un codigo', 'boton copiar codigo', 'como uso el laboratorio'], r: ['En cada tarjeta del Laboratorio pulsa **«Copiar»**, abre PowerShell en tu equipo, pega con clic derecho o Ctrl+V y presiona Enter. Los códigos son de consulta: muestran información sin cambiar nada (salvo Renovar IP, que pide una IP nueva).', 'On each Lab card press **"Copy"**, open PowerShell on your computer, paste with right click or Ctrl+V and press Enter. The codes are read-only: they show information without changing anything (except Renew IP, which asks for a new IP).'], href: 'recursos.html#laboratorio' },
    { c: 'Recursos', k: ['diferencia throughput bandwidth', 'throughput vs bandwidth', 'throughput o bandwidth'], r: ['**Bandwidth** es el máximo teórico del canal; **throughput** es lo que de verdad logra pasar. Analogía: el bandwidth es el ancho de la tubería y el throughput, el agua que realmente sale por el grifo.', '**Bandwidth** is the channel\u2019s theoretical maximum; **throughput** is what actually gets through. Analogy: bandwidth is the width of the pipe and throughput is the water that really comes out of the tap.'], href: 'recursos.html#glosario' },
    { c: 'Hardware', k: ['limpieza exterior', 'limpiar por fuera', 'limpiar filtros del pc', 'polvo por fuera'], r: ['Limpieza **exterior**: equipo apagado y desconectado, mantén el botón de encendido unos segundos para descargar, sopla filtros, rejillas y ventiladores con aire comprimido en ráfagas cortas y pasa un paño de microfibra apenas húmedo. Nunca rocíes líquido directo.', '**External** cleaning: PC off and unplugged, hold the power button a few seconds to discharge, blow filters, grilles and fans with short bursts of compressed air and wipe with a barely damp microfiber cloth. Never spray liquid directly.'], href: 'pc3d.html#mantenimiento' },
    { c: 'Hardware', k: ['limpieza interior', 'limpieza profunda', 'abrir la torre', 'polvo dentro del pc', 'capacitores hinchados'], r: ['Limpieza **interior**: abre el panel lateral, **sujeta los ventiladores** para que el aire no los haga girar, retira el polvo de disipadores, GPU y fuente de adentro hacia afuera, y revisa cables flojos, capacitores hinchados o corrosión.', '**Internal** cleaning: open the side panel, **hold the fans** so the air does not spin them, remove dust from heatsinks, GPU and PSU from the inside out, and check for loose cables, swollen capacitors or corrosion.'], href: 'pc3d.html#mantenimiento' },
    { c: 'Hardware', k: ['mantenimiento del sistema', 'salud digital', 'actualizar drivers', 'estado smart', 'copias de seguridad', 'backup'], r: ['La **salud digital** también es mantenimiento: actualiza sistema, controladores y firmware desde fuentes oficiales, desinstala lo que no uses, vigila el espacio del SSD, revisa su estado **SMART** y haz **copias de seguridad** periódicas.', '**Digital health** is maintenance too: update system, drivers and firmware from official sources, uninstall what you do not use, watch SSD space, check its **SMART** status and make regular **backups**.'], href: 'pc3d.html#mantenimiento' },
    { c: 'Hardware', k: ['electricidad estatica', 'descarga estatica', 'por que usar manilla', 'esd'], r: ['Tu cuerpo acumula **electricidad estática** y una descarga invisible puede quemar RAM, CPU o placa. Por eso se trabaja desconectado y con **manilla antiestática**: ella descarga tu cuerpo antes de que toques los circuitos.', 'Your body builds up **static electricity** and an invisible discharge can fry RAM, CPU or board. That is why you work unplugged and with an **anti-static wrist strap**: it discharges your body before you touch the circuits.'], href: 'pc3d.html#mantenimiento' },
    { c: 'Hardware', k: ['pasta termica', 'como aplicar pasta termica', 'cambiar la pasta termica', 'thermal paste'], r: ['La **pasta térmica** rellena el micro-espacio entre la CPU y el disipador para que el calor pase bien. Se cambia cuando las temperaturas suben: limpia la vieja y aplica una cantidad pequeña (como un grano de arroz) en el centro.', '**Thermal paste** fills the micro-gap between the CPU and the cooler so heat transfers well. Replace it when temperatures rise: clean the old one and apply a small amount (like a grain of rice) in the center.'], href: 'pc3d.html#mantenimiento' },
    { c: 'Hardware', k: ['destornillador de precision', 'destornilladores', 'torx', 'herramienta para tornillos'], r: ['Los **destornilladores de precisión** (Phillips, plano y Torx) retiran tapas, discos, ventiladores y tornillos de la placa sin dañarlos. Son la herramienta base de todo el kit de PC3D.', '**Precision screwdrivers** (Phillips, flat and Torx) remove covers, drives, fans and board screws without damaging them. They are the base tool of the whole PC3D kit.'], href: 'pc3d.html#mantenimiento' },
    { c: 'Hardware', k: ['brocha antiestatica', 'pano de microfibra', 'bridas y velcro', 'ordenar los cables'], r: ['La **brocha antiestática** afloja el polvo de ranuras sin rayar, el **paño de microfibra** limpia gabinete y vidrio sin pelusas, y las **bridas y el velcro** ordenan el cableado para no bloquear el flujo de aire.', 'The **anti-static brush** loosens dust from slots without scratching, the **microfiber cloth** cleans case and glass lint-free, and **ties and velcro** tidy the cabling so airflow is not blocked.'], href: 'pc3d.html#mantenimiento' },
    { c: 'Hardware', k: ['como usar aire comprimido', 'aire comprimido ventiladores', 'soplar el pc'], r: ['Con el **aire comprimido**: ráfagas cortas, lata en vertical y **sujetando los ventiladores** con un dedo para que no giren libremente (girar forzados puede dañarlos). Es la forma segura de sacar el polvo de disipadores y filtros.', 'With **compressed air**: short bursts, can upright and **holding the fans** with a finger so they do not spin freely (forced spinning can damage them). It is the safe way to clear dust from heatsinks and filters.'], href: 'pc3d.html#mantenimiento' },
    { c: 'Hardware', k: ['mi pc esta lento', 'computador lento', 'pc lento que hago', 'equipo lento', 'slow computer'], r: ['PC lento: revisa en orden — **1)** espacio libre del SSD, **2)** programas que no usas, **3)** polvo y temperaturas (limpieza de PC3D), **4)** si aún usa HDD, un **SSD** lo revive, y **5)** más **RAM** si abres muchas cosas a la vez.', 'Slow PC: check in order — **1)** free SSD space, **2)** programs you do not use, **3)** dust and temperatures (PC3D cleaning), **4)** if it still has an HDD, an **SSD** revives it, and **5)** more **RAM** if you open many things at once.'], href: 'pc3d.html#mantenimiento' },
    { c: 'WiFi', k: ['192.168.1.1 no abre', 'no abre el panel del router', 'no entra a 192', 'pagina del router no carga', '192.168.0.1'], r: ['Si **192.168.1.1 no abre**: confirma que estás conectado a ESE módem (por cable o a su WiFi), prueba también **192.168.0.1**, y en el celular **desactiva los datos móviles** mientras configuras, porque el teléfono puede estarse yendo por la red móvil y nunca toca el panel.', 'If **192.168.1.1 does not open**: make sure you are connected to THAT modem (cable or its WiFi), also try **192.168.0.1**, and on your phone **turn off mobile data** while setting up, because the phone may be escaping through the mobile network and never reaching the panel.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['wps es seguro', 'wps pin', 'desactivar wps', 'seguridad wps'], r: ['El **botón físico WPS** es práctico para enlazar el repetidor, pero el **WPS por código PIN es vulnerable**: si tu panel lo permite, desactiva el WPS por PIN y deja solo el botón.', 'The physical **WPS button** is handy for linking the repeater, but **WPS by PIN code is vulnerable**: if your panel allows it, disable PIN WPS and keep only the button.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['donde pongo el modem', 'poner el modem', 'colocar el modem', 'ubicacion del modem', 'modem en el piso', 'mejorar senal wifi', 'donde ubicar el router'], r: ['Ubicación que sí funciona: punto **central y elevado**, nunca en el piso ni dentro de un mueble cerrado; lejos de microondas, bases de teléfono inalámbrico y metal grande. Un muro grueso o una pecera en el camino debilitan la señal: a veces moverlo un metro lo arregla todo.', 'A placement that works: **central and high**, never on the floor or inside a closed cabinet; away from microwaves, cordless phone bases and big metal objects. A thick wall or a fish tank in the way weakens the signal: sometimes moving it one meter fixes everything.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['que es ssid', 'nombre de la red wifi', 'cambiar el nombre del wifi', 'ssid'], r: ['El **SSID** es el nombre de tu red WiFi, el que ves en la lista al conectarte. Al instalar, cámbialo por uno reconocible pero **sin datos personales** (nada de apellidos ni direcciones).', 'The **SSID** is your WiFi network\u2019s name, the one you see in the list when connecting. When installing, change it to something recognizable but with **no personal data** (no surnames or addresses).'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['actualizar firmware modem', 'firmware del router', 'actualizar el modem'], r: ['El **firmware** es el sistema interno del módem: mantenerlo **actualizado** cierra huecos de seguridad y arregla fallos. Se actualiza desde el propio panel (192.168.1.1); es uno de los puntos de la lista de verificación final de la guía.', 'The **firmware** is the modem\u2019s internal system: keeping it **updated** closes security holes and fixes bugs. Update it from the panel itself (192.168.1.1); it is one of the items on the guide\u2019s final checklist.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['red de invitados', 'wifi para visitas', 'guest network', 'red para invitados'], r: ['La **red de invitados** es un WiFi aparte para las visitas: navegan sin entrar a tu red principal ni ver tus equipos. Actívala en el panel; es parte de la lista de verificación final de la guía WiFi.', 'The **guest network** is a separate WiFi for visitors: they browse without entering your main network or seeing your devices. Enable it in the panel; it is part of the WiFi guide\u2019s final checklist.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['lista de verificacion', 'checklist wifi', 'que revisar al instalar wifi', 'verificacion final wifi'], r: ['La **lista final** de la guía: luces fijas, SSID cambiado y clave nueva guardada, seguridad WPA2/WPA3, firmware actualizado, red de invitados activa, señal probada en todos los cuartos, repetidor donde aún hay buena señal y foto de la etiqueta del módem en el celular.', 'The guide\u2019s **final checklist**: solid lights, SSID changed and new password saved, WPA2/WPA3 security, firmware updated, guest network on, signal tested in every room, repeater where signal is still good and a photo of the modem label on your phone.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['luces del modem', 'luz roja del modem', 'luces fijas', 'que significan las luces'], r: ['Al instalar, espera unos 2 minutos: las luces de **encendido e internet deben quedar fijas**. Si la de internet parpadea sin parar o está roja, el problema viene del cable del proveedor o de la línea, no de tu configuración.', 'When installing, wait about 2 minutes: the **power and internet lights should stay solid**. If the internet one blinks forever or is red, the problem comes from the provider cable or the line, not from your settings.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['diferencia modem y router', 'modem o router', 'modem vs router', 'que es un modem'], r: ['El **módem** traduce la señal del proveedor (fibra, coaxial, DSL) a red; el **router** reparte esa conexión entre tus equipos y crea tu red local. En casa el proveedor suele dar un solo equipo que hace las dos cosas.', 'The **modem** translates the provider signal (fiber, coax, DSL) into a network; the **router** shares that connection among your devices and creates your local network. At home the provider usually gives one box that does both.'] },
    { c: 'WiFi', k: ['que es la ont', 'fibra optica', 'cable coaxial', 'como llega el internet a casa'], r: ['La señal llega según tu servicio: **fibra óptica** (con su ONT), **cable coaxial** o **DSL** por la línea telefónica. Ese cable va al puerto de entrada del módem: es el paso 1 de la guía de instalación.', 'The signal arrives depending on your service: **fiber optic** (with its ONT), **coaxial cable** or **DSL** over the phone line. That cable goes into the modem\u2019s input port: it is step 1 of the installation guide.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['interferencias wifi', 'el microondas afecta el wifi', 'muchas redes vecinas', 'wifi se corta'], r: ['Enemigos de la señal: **microondas**, bases de teléfonos inalámbricos, metal grande, muros gruesos y las redes de los vecinos. En 2.4 GHz cambia al canal **1, 6 u 11** (los que no se pisan) y ubica el módem en alto y al centro.', 'Signal enemies: **microwaves**, cordless phone bases, big metal, thick walls and the neighbors\u2019 networks. On 2.4 GHz switch to channel **1, 6 or 11** (the non-overlapping ones) and place the modem high and central.'], href: 'wifi.html#instalar-modem' },
    { c: 'WiFi', k: ['que es el wifi', 'que es wifi', 'wifi', 'wi-fi'], r: ['**WiFi** es la forma inalámbrica de conectar tus equipos a la red local (una WLAN): en vez de cable, viaja por radio en las bandas de 2.4 y 5 GHz. La guía WiFi Avanzado te lleva de la caja a una red rápida y segura.', '**WiFi** is the wireless way to connect your devices to the local network (a WLAN): instead of a cable, it travels by radio on the 2.4 and 5 GHz bands. The Advanced WiFi guide takes you from the box to a fast, secure network.'], href: 'wifi.html' },
    { c: 'Otro', k: ['que es nvision', 'de que trata este sitio', 'de que es esta pagina', 'about nvision', 'what is nvision'], r: ['**NVISION** es un sitio para aprender tecnología haciendo: hardware y componentes, redes con laboratorios interactivos (switch y ping), códigos reales para tu PC y una guía WiFi paso a paso. Todo con ejemplos que puedes tocar.', '**NVISION** is a site to learn technology by doing: hardware and components, networks with interactive labs (switch and ping), real codes for your PC and a step-by-step WiFi guide. Everything with examples you can touch.'] },
    { c: 'Otro', k: ['modo oscuro', 'cambiar el tema', 'tema oscuro', 'dark mode'], r: ['El sitio tiene **botón de tema** en la barra superior (el ícono de sol/luna): púlsalo para alternar entre modo claro y oscuro. Tu elección se guarda para la próxima visita.', 'The site has a **theme button** in the top bar (the sun/moon icon): tap it to switch between light and dark mode. Your choice is saved for your next visit.'] },
    { c: 'Otro', k: ['cambiar idioma', 'poner en ingles', 'poner en espanol', 'change language', 'idioma del sitio'], r: ['Arriba, junto al botón **ES**, está el selector de idioma: cambia todo el sitio entre **español e inglés** al instante.', 'At the top, next to the **ES** button, is the language selector: it switches the whole site between **Spanish and English** instantly.'] },
    { c: 'Otro', k: ['que secciones tiene', 'que paginas hay', 'contenido del sitio', 'que puedo aprender', 'temas del sitio'], r: ['El sitio tiene 6 zonas: **Hardware** (historia y componentes), **PC3D** (explorador 3D, tipos y mantenimiento), **Redes** (tipos, topologías, simulador ping y laboratorio del switch), **Recursos** (glosario y Laboratorio de Códigos), **WiFi Avanzado** (instalación y repetidores) y **Mantenimiento por software** (actualizaciones, antivirus, limpieza, copias y rutina).', 'The site has 6 areas: **Hardware** (history and components), **PC3D** (3D explorer, types and maintenance), **Networks** (types, topologies, ping simulator and switch lab), **Resources** (glossary and Code Lab), **Advanced WiFi** (installation and repeaters) and **Software Maintenance** (updates, antivirus, cleaning, backups and routine).'] },
    { c: 'Otro', k: ['quien hizo el sitio', 'quien creo nvision', 'autor del sitio', 'creador de nvision'], r: ['NVISION es un **proyecto educativo** hecho para aprender y enseñar tecnología con práctica real. Más que el autor, importa el recorrido: cada página tiene algo para probar, no solo para leer.', 'NVISION is an **educational project** made to learn and teach technology with real practice. More than the author, what matters is the journey: every page has something to try, not just to read.'] },
    { c: 'Otro', k: ['no tengo internet que hago', 'se cayo el internet', 'wifi no funciona', 'sin wifi en casa'], r: ['Sin internet, en orden: **1)** mira las luces del módem (deben estar fijas), **2)** reinícialo y espera 2 minutos, **3)** prueba el código **ping 8.8.8.8** del Laboratorio para saber si el fallo es local, y **4)** renueva tu IP con ipconfig /release y /renew.', 'No internet, in order: **1)** check the modem lights (they should be solid), **2)** restart it and wait 2 minutes, **3)** try the Lab\u2019s **ping 8.8.8.8** code to learn if the fault is local, and **4)** renew your IP with ipconfig /release and /renew.'], href: 'wifi.html#instalar-modem' },
    { c: 'Otro', k: ['que computador compro', 'recomiendas un pc', 'que pc me conviene', 'comprar computador'], r: ['No vendo equipos, pero el sitio te enseña a elegir: en **PC3D** ves qué hace cada componente y sus tipos, y en **Hardware** los comparas. Con eso podrás juzgar cualquier oferta tú mismo: CPU, RAM, SSD y fuente primero.', 'I do not sell computers, but the site teaches you to choose: in **PC3D** you see what each component does and its types, and in **Hardware** you compare them. With that you can judge any deal yourself: CPU, RAM, SSD and PSU first.'], href: 'pc3d.html#componentes-3d' }
  ];
  const SUGGEST = [
    ['¿Qué es la RAM?', 'What is RAM?'],
    ['¿Cómo trabaja un switch?', 'How does a switch work?'],
    ['¿Cómo veo mi IP y mi MAC?', 'How do I see my IP and MAC?'],
    ['Instalar un repetidor WiFi', 'Set up a WiFi repeater'],
    ['¿Qué es throughput?', 'What is throughput?'],
    ['¿Cómo limpio mi PC?', 'How do I clean my PC?'],
    ['¿Hub o switch?', 'Hub or switch?'],
    ['¿Por qué no abre 192.168.1.1?', 'Why does 192.168.1.1 not open?'],
    ['¿Qué es el mantenimiento por software?', 'What is software maintenance?'],
    ['Mi PC no enciende, ¿qué hago?', 'My PC will not turn on, what do I do?']
  ];
  const CATS = ['Hardware', 'Redes', 'WiFi', 'Recursos', 'Otro'];

  /* ===== Persistencia (lo enseñado y lo no respondido vive en este navegador) ===== */
  const loadArr = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : d; } catch (e) { return d; } };
  const storeArr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  let learned = loadArr('nvision_bot_learned', []);
  let missed = loadArr('nvision_bot_missed', []);
  let editIdx = -1;

  /* ===== Motor de coincidencia (mismo modelo que FinBot) ===== */
  const STOP = new Set('de la el los las un una unos unas y o u que en es por para con como se mi mis me a al del lo su sus te tu yo si no mas muy cual cuales cuanto quien cuando donde quiero puedo debo hay ser son esta este eso esa the a an of to in is are what how do does can i you it and or for on with my me hacer debe deben'.split(' '));
  const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ');
  const stem = (w) => (w.length > 5 ? w.slice(0, 5) : w);
  const toks = (s) => [...new Set(norm(s).split(/\s+/).filter((w) => w && !STOP.has(w)).map(stem))];
  function bestMatch(q) {
    const qt = toks(q);
    let top = { score: 0, e: null, key: '' };
    if (!qt.length) return top;
    const all = [...learned.map((e) => ({ c: e.c, k: e.k, r: [e.r, e.r], href: null })), ...KB];
    for (const e of all) for (const key of e.k) {
      const kt = toks(key);
      if (!kt.length) continue;
      const inter = kt.filter((w) => qt.includes(w)).length;
      if (!inter) continue;
      const score = (inter / kt.length + inter / qt.length) / 2;
      if (score > top.score + 1e-9) top = { score, e, key };
    }
    return top;
  }

  /* ===== Construcción del panel ===== */
  const assistant = document.createElement('aside');
  assistant.className = 'local-assistant';
  assistant.innerHTML = `
    <div class="local-assistant-panel" id="local-assistant-panel" hidden>
      <div class="local-assistant-header">
        <div><strong data-i18n="assistant_title">Asistente NVISION</strong><small data-i18n="assistant_status">Chat entrenado</small></div>
        <button class="local-assistant-close" type="button" aria-label="Cerrar" data-i18n-title="assistant_close_title">×</button>
      </div>
      <div class="local-assistant-body">
        <div class="la-tabs" role="tablist">
          <button type="button" class="la-tab is-active" data-tab="chat" data-i18n="assistant_tab_chat">Chat</button>
          <button type="button" class="la-tab" data-tab="train" data-i18n="assistant_tab_train">Entrenar</button>
        </div>
        <div class="la-view la-view-chat">
          <p class="local-assistant-welcome" data-i18n="assistant_welcome">Pregúntame sobre el contenido del sitio. Si no sé algo, puedes enseñármelo en la pestaña Entrenar.</p>
          <div class="la-log" aria-live="polite"></div>
          <div class="la-chips"></div>
          <form class="local-assistant-form">
            <input class="local-assistant-input" type="text" autocomplete="off" maxlength="300" data-i18n-placeholder="assistant_placeholder" placeholder="Escribe tu pregunta…">
            <button class="local-assistant-submit" type="submit" data-i18n-title="assistant_search" title="Enviar" aria-label="Enviar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
            </button>
          </form>
        </div>
        <div class="la-view la-view-train" hidden>
          <div class="la-stats"><span><b class="la-n-base">0</b> <span data-i18n="assistant_stats_base">respuestas base</span></span><span><b class="la-n-learn">0</b> <span data-i18n="assistant_stats_learned">enseñadas por ti</span></span></div>
          <div class="la-card">
            <h3 class="la-form-title" data-i18n="assistant_teach_title">Enseñar una respuesta nueva</h3>
            <label data-i18n="assistant_teach_q">Formas de preguntarlo (una por línea)</label>
            <textarea class="la-tk" rows="3" placeholder="qué es un switch&#10;cómo trabaja un switch"></textarea>
            <label data-i18n="assistant_teach_a">Respuesta</label>
            <textarea class="la-tr" rows="3"></textarea>
            <label data-i18n="assistant_teach_cat">Categoría</label>
            <select class="la-tc"></select>
            <div class="la-row">
              <button type="button" class="la-btn la-save" data-i18n="assistant_save">Guardar</button>
              <button type="button" class="la-btn la-alt la-cancel" data-i18n="assistant_cancel_edit" hidden>Cancelar edición</button>
            </div>
            <div class="la-toast" role="status"></div>
          </div>
          <div class="la-card">
            <h3 data-i18n="assistant_test_title">Probar al asistente</h3>
            <input class="la-test" type="text" data-i18n-placeholder="assistant_test_ph" placeholder="Escribe una pregunta para ver qué entiende">
            <div class="la-test-out la-hint"></div>
          </div>
          <div class="la-card"><h3 data-i18n="assistant_missed_title">Preguntas sin respuesta</h3><div class="la-missed"></div></div>
          <div class="la-card"><h3 data-i18n="assistant_learned_title">Lo que le has enseñado</h3><div class="la-learned"></div></div>
          <div class="la-card">
            <h3 data-i18n="assistant_backup_title">Respaldo</h3>
            <textarea class="la-bk" rows="3" placeholder="JSON"></textarea>
            <div class="la-row">
              <button type="button" class="la-btn la-alt la-exp" data-i18n="assistant_export">Exportar</button>
              <button type="button" class="la-btn la-alt la-imp" data-i18n="assistant_import">Importar</button>
              <button type="button" class="la-btn la-alt la-reset" data-i18n="assistant_reset">Borrar lo aprendido</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="local-assistant-toggle" type="button" aria-controls="local-assistant-panel" aria-expanded="false" title="Abrir asistente" aria-label="Abrir asistente" data-i18n-title="assistant_toggle_title">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-4-.9L4 19l1.2-3.1A7.4 7.4 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5a7.5 7.5 0 0 1 8 7z"></path><path d="M8 11h.01M12 11h.01M16 11h.01"></path></svg>
    </button>`;
  document.body.appendChild(assistant);

  const $ = (sel) => assistant.querySelector(sel);
  const panel = $('.local-assistant-panel');
  const toggle = $('.local-assistant-toggle');
  const closeBtn = $('.local-assistant-close');
  const form = $('.local-assistant-form');
  const input = $('.local-assistant-input');
  const log = $('.la-log');
  const chipsBox = $('.la-chips');
  const L = () => (currentLang === 'en' ? 1 : 0);
  const T = () => translations[currentLang] || translations.es;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');

  /* ===== Chat ===== */
  function addMsg(role, text, q, href) {
    const d = document.createElement('div');
    d.className = 'la-msg ' + role;
    d.innerHTML = fmt(text);
    if (href) {
      const a = document.createElement('a');
      a.className = 'la-open';
      a.href = href;
      a.textContent = T().assistant_open;
      d.appendChild(a);
    }
    if (role === 'bot' && q) {
      const f = document.createElement('div');
      f.className = 'la-fb';
      const up = document.createElement('button');
      up.type = 'button'; up.textContent = '👍'; up.title = T().assistant_up;
      up.addEventListener('click', () => { f.textContent = T().assistant_thanks; });
      const down = document.createElement('button');
      down.type = 'button'; down.textContent = '👎 ' + T().assistant_down;
      down.addEventListener('click', () => goTeach(q));
      f.append(up, down);
      d.appendChild(f);
    }
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }
  function say(text, q, teachQ, href) {
    setTimeout(() => {
      addMsg('bot', text, q, href);
      if (teachQ) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'la-chip';
        b.textContent = T().assistant_teach_this;
        b.addEventListener('click', () => goTeach(teachQ));
        log.lastChild.appendChild(b);
      }
    }, 350);
  }
  function ask(text) {
    text = (text || '').trim();
    if (!text) return;
    addMsg('user', text);
    const b = bestMatch(text);
    if (b.score >= 0.4) { say(b.e.r[L()], text, null, b.e.href); return; }
    if (!missed.includes(text)) {
      missed.unshift(text);
      missed = missed.slice(0, 30);
      storeArr('nvision_bot_missed', missed);
    }
    say(T().assistant_fallback, null, text, null);
  }
  function renderChips() {
    chipsBox.replaceChildren();
    SUGGEST.forEach((pair) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'la-chip';
      b.textContent = pair[L()];
      b.addEventListener('click', () => ask(pair[L()]));
      chipsBox.appendChild(b);
    });
  }

  /* ===== Pestañas ===== */
  function showTab(name) {
    assistant.querySelectorAll('.la-tab').forEach((t) => t.classList.toggle('is-active', t.dataset.tab === name));
    $('.la-view-chat').hidden = name !== 'chat';
    $('.la-view-train').hidden = name !== 'train';
    if (name === 'train') renderTrain();
  }
  assistant.querySelectorAll('.la-tab').forEach((t) => t.addEventListener('click', () => showTab(t.dataset.tab)));
  function goTeach(q) {
    showTab('train');
    resetTeachForm();
    $('.la-tk').value = q || '';
    $('.la-tr').focus();
  }

  /* ===== Entrenamiento ===== */
  const tcSel = $('.la-tc');
  CATS.forEach((c) => { const o = document.createElement('option'); o.textContent = c; tcSel.appendChild(o); });
  function toast(msg) {
    const el = $('.la-toast');
    el.textContent = msg;
    setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 3000);
  }
  function resetTeachForm() {
    editIdx = -1;
    $('.la-tk').value = '';
    $('.la-tr').value = '';
    tcSel.value = 'Otro';
    $('.la-cancel').hidden = true;
    $('.la-form-title').textContent = T().assistant_teach_title;
  }
  $('.la-cancel').addEventListener('click', resetTeachForm);
  $('.la-save').addEventListener('click', () => {
    const k = $('.la-tk').value.split('\n').map((s) => s.trim()).filter(Boolean);
    const r = $('.la-tr').value.trim();
    if (!k.length || !r) { toast(T().assistant_need_both); return; }
    const entry = { c: tcSel.value, k, r };
    if (editIdx >= 0) learned[editIdx] = entry; else learned.unshift(entry);
    missed = missed.filter((m) => !k.some((x) => norm(x) === norm(m)));
    storeArr('nvision_bot_learned', learned);
    storeArr('nvision_bot_missed', missed);
    resetTeachForm();
    renderTrain();
    toast(T().assistant_saved_toast);
  });
  function itemRow(mainHtml, buttons) {
    const row = document.createElement('div');
    row.className = 'la-item';
    const main = document.createElement('div');
    main.innerHTML = mainHtml;
    const btns = document.createElement('span');
    btns.className = 'la-item-btns';
    buttons.forEach(([label, fn]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'la-btn la-sm';
      b.textContent = label;
      b.addEventListener('click', fn);
      btns.appendChild(b);
    });
    row.append(main, btns);
    return row;
  }
  function renderTrain() {
    $('.la-n-base').textContent = KB.length;
    $('.la-n-learn').textContent = learned.length;
    const missedBox = $('.la-missed');
    missedBox.replaceChildren();
    if (!missed.length) {
      const p = document.createElement('p'); p.className = 'la-hint'; p.textContent = T().assistant_missed_empty; missedBox.appendChild(p);
    }
    missed.forEach((m, i) => {
      missedBox.appendChild(itemRow(esc(m), [
        [T().assistant_teach_btn, () => goTeach(m)],
        [T().assistant_remove_btn, () => { missed.splice(i, 1); storeArr('nvision_bot_missed', missed); renderTrain(); }]
      ]));
    });
    const learnedBox = $('.la-learned');
    learnedBox.replaceChildren();
    if (!learned.length) {
      const p = document.createElement('p'); p.className = 'la-hint'; p.textContent = T().assistant_learned_empty; learnedBox.appendChild(p);
    }
    learned.forEach((e, i) => {
      const head = `<span class="la-tag">${esc(e.c)}</span> <b>${esc(e.k[0])}</b>${e.k.length > 1 ? ` <small>+${e.k.length - 1}</small>` : ''}<br><small>${esc(e.r.slice(0, 110))}${e.r.length > 110 ? '…' : ''}</small>`;
      learnedBox.appendChild(itemRow(head, [
        [T().assistant_edit_btn, () => { editIdx = i; $('.la-tk').value = e.k.join('\n'); $('.la-tr').value = e.r; tcSel.value = e.c; $('.la-cancel').hidden = false; $('.la-form-title').textContent = T().assistant_edit_title; }],
        [T().assistant_delete_btn, () => { if (confirm(T().assistant_confirm_delete)) { learned.splice(i, 1); storeArr('nvision_bot_learned', learned); resetTeachForm(); renderTrain(); } }]
      ]));
    });
  }
  $('.la-test').addEventListener('input', (ev) => {
    const q = ev.target.value;
    const out = $('.la-test-out');
    if (!q.trim()) { out.textContent = ''; return; }
    const b = bestMatch(q);
    const p = Math.round(b.score * 100);
    out.innerHTML = b.score >= 0.4
      ? `${esc(T().assistant_match)} «<b>${esc(b.key)}</b>» (${p} %).<br>${fmt(b.e.r[L()].slice(0, 160))}…`
      : `${esc(T().assistant_no_match)} (${p} %).`;
  });
  $('.la-exp').addEventListener('click', () => {
    const bk = $('.la-bk');
    bk.value = JSON.stringify(learned, null, 1);
    bk.select();
    try { navigator.clipboard.writeText(bk.value); } catch (e) {}
  });
  $('.la-imp').addEventListener('click', () => {
    try {
      const a = JSON.parse($('.la-bk').value);
      if (!Array.isArray(a)) throw new Error('bad');
      const ok = a.filter((x) => x && Array.isArray(x.k) && x.k.length && typeof x.r === 'string' && x.r.trim())
        .map((x) => ({ c: CATS.includes(x.c) ? x.c : 'Otro', k: x.k.map(String), r: x.r }));
      learned = [...ok, ...learned];
      storeArr('nvision_bot_learned', learned);
      renderTrain();
      toast(ok.length + ' ' + T().assistant_imported);
    } catch (e) { toast(T().assistant_import_bad); }
  });
  $('.la-reset').addEventListener('click', () => {
    if (!confirm(T().assistant_confirm_reset)) return;
    learned = [];
    missed = [];
    storeArr('nvision_bot_learned', learned);
    storeArr('nvision_bot_missed', missed);
    resetTeachForm();
    renderTrain();
  });

  /* ===== Abrir / cerrar y primer saludo ===== */
  let greeted = false;
  toggle.addEventListener('click', () => {
    const isOpen = !panel.hidden;
    panel.hidden = isOpen;
    toggle.setAttribute('aria-expanded', String(!isOpen));
    if (!isOpen) {
      renderChips();
      if (!greeted) { greeted = true; say(KB[0].r[L()], null, null, null); }
      input.focus();
    }
  });
  closeBtn.addEventListener('click', () => {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const v = input.value;
    input.value = '';
    ask(v);
  });
}

function setupCursorEffect() {
  if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const effect = document.createElement('div');
  effect.className = 'cursor-effect';
  effect.setAttribute('aria-hidden', 'true');
  effect.innerHTML = '<span class="cursor-aura"></span><span class="cursor-dot"></span>';
  document.body.appendChild(effect);

  let frame = 0;
  window.addEventListener('pointermove', (event) => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      effect.style.setProperty('--cursor-x', `${event.clientX}px`);
      effect.style.setProperty('--cursor-y', `${event.clientY}px`);
      effect.classList.add('is-visible');
      frame = 0;
    });
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => effect.classList.remove('is-visible'));
}

document.addEventListener('DOMContentLoaded', () => {
  setupThemeToggle();
  setupLanguageDropdown();
  setupCopyButton();
  setupDetector();
  setupMobileMenu();
  setupSectionNavigation();
  setupNavigationDropdowns();
  setupHistoryToggle();
  setupComponentToggles();
  setupMaintenanceToolImages();
  setupNetworkSimulator();
  setupSwitchLab();
  setupLocalAssistant();
  setupCursorEffect();
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


function setupMaintenanceToolImages() {
  const toolImages = {
    'Juego de destornilladores': 'https://jensa.vtexassets.com/arquivos/ids/161306-800-800?v=638188042753000000&width=800&height=800&aspect=true',
    'Pulsera antiestática': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHIlvAxb8SWQnWT1tSrBmRa3LFzUeqdscmSiBerjNlcg&s=10',
    'Aire comprimido': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqSPbG2H8ImniMSLt5Xm3rwyTiNe8bgjbbZchfrYN19A&s=10',
    'Pasta térmica': 'https://acf.geeknetic.es/imgri/imagenes/auto/20/06/17/eaj-jgv-71t7np6iz6l-sl1500.jpg?f=webp',
    'Paño de microfibra': 'https://www.esmero.com.co/wp-content/uploads/2020/06/esmero_panos_microfibra_azul_task.jpg'
  };

  document.querySelectorAll('.pc3d-tool-card').forEach((card) => {
    const image = card.querySelector('img');
    if (!image) return;
    const replacement = toolImages[image.alt];
    if (replacement) image.src = replacement;
    if (image.alt === 'Brochas de limpieza' || image.alt === 'Bridas organizadoras') {
      card.hidden = true;
    }
  });
}

function setupSwitchLab() {
  const svg = document.getElementById('swl-svg');
  if (!svg) return;
  const fromSel = document.getElementById('swl-from');
  const toSel = document.getElementById('swl-to');
  const sendBtn = document.getElementById('swl-send');
  const resetBtn = document.getElementById('swl-reset');
  const caption = document.getElementById('swl-caption');
  const tbody = document.getElementById('swl-mac-body');
  const modeSwitchBtn = document.getElementById('swl-mode-switch');
  const modeHubBtn = document.getElementById('swl-mode-hub');
  const deviceName = document.getElementById('swl-device-name');
  const framesLayer = document.getElementById('swl-frames');
  const NS = 'http://www.w3.org/2000/svg';
  const PCS = [
    { x: 290, mac: 'AA:BB:CC:00:00:01' },
    { x: 357, mac: 'AA:BB:CC:00:00:02' },
    { x: 423, mac: 'AA:BB:CC:00:00:03' },
    { x: 490, mac: 'AA:BB:CC:00:00:04' }
  ];
  const MID_Y = 70, PC_Y = 292;
  const learned = new Map(); // puerto -> indice de PC
  let mode = 'switch';
  let busy = false;

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const t = key => translations[currentLang]?.[key] || key;
  function cap(key, params = {}) {
    let txt = t(key);
    for (const k in params) txt = txt.replaceAll('{' + k + '}', params[k]);
    caption.textContent = txt;
  }
  const pcName = i => 'PC' + (i + 1);

  function renderTable(hiPort = null) {
    tbody.innerHTML = '';
    const row = cells => {
      const tr = document.createElement('tr');
      cells.forEach(c => { const td = document.createElement('td'); td.textContent = c; tr.appendChild(td); });
      return tr;
    };
    if (mode === 'hub') {
      const tr = row([t('swl_table_hub')]);
      tr.firstChild.colSpan = 3; tr.className = 'swl-note-row';
      tbody.appendChild(tr); return;
    }
    if (!learned.size) {
      const tr = row([t('swl_table_empty')]);
      tr.firstChild.colSpan = 3; tr.className = 'swl-note-row';
      tbody.appendChild(tr); return;
    }
    [...learned.entries()].sort((a, b) => a[0] - b[0]).forEach(([port, pc]) => {
      const tr = row(['P' + port, PCS[pc].mac, pcName(pc)]);
      if (port === hiPort) tr.className = 'is-new';
      tbody.appendChild(tr);
    });
  }

  function flashPc(i) {
    const el = document.getElementById('swl-pc-' + i);
    if (!el) return;
    el.classList.add('is-hit');
    setTimeout(() => el.classList.remove('is-hit'), 1100);
  }
  function flashPort(p) {
    const el = document.getElementById('swl-port-' + p);
    if (!el) return;
    el.classList.add('is-active-port');
    setTimeout(() => el.classList.remove('is-active-port'), 900);
  }

  function makeDot() {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('r', '9');
    c.setAttribute('class', 'swl-frame');
    framesLayer.appendChild(c);
    return c;
  }
  function moveAlong(dot, pts) {
    return new Promise(res => {
      const segs = []; let total = 0;
      for (let i = 1; i < pts.length; i++) {
        const len = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        segs.push({ a: pts[i - 1], b: pts[i], len }); total += len;
      }
      const dur = Math.max(260, total / 0.42);
      const t0 = performance.now();
      (function frame(now) {
        const p = Math.min(1, (now - t0) / dur);
        let d = p * total;
        for (const sg of segs) {
          if (d <= sg.len) {
            const k = sg.len ? d / sg.len : 0;
            dot.setAttribute('cx', sg.a[0] + (sg.b[0] - sg.a[0]) * k);
            dot.setAttribute('cy', sg.a[1] + (sg.b[1] - sg.a[1]) * k);
            break;
          }
          d -= sg.len;
        }
        if (p < 1) requestAnimationFrame(frame); else res();
      })(t0);
    });
  }

  async function travel(from, to) {
    const dot = makeDot();
    flashPort(from + 1);
    await moveAlong(dot, [[PCS[from].x, PC_Y], [PCS[from].x, MID_Y], [PCS[to].x, MID_Y], [PCS[to].x, PC_Y]]);
    flashPort(to + 1); flashPc(to);
    dot.remove();
  }
  async function upToSwitch(from) {
    const dot = makeDot();
    flashPort(from + 1);
    await moveAlong(dot, [[PCS[from].x, PC_Y], [PCS[from].x, MID_Y]]);
    return dot;
  }
  async function floodFromSwitch(from) {
    const jobs = [];
    for (let i = 0; i < 4; i++) {
      if (i === from) continue;
      const dot = makeDot();
      jobs.push((async () => {
        await moveAlong(dot, [[PCS[from].x, MID_Y], [PCS[i].x, MID_Y], [PCS[i].x, PC_Y]]);
        flashPort(i + 1); flashPc(i);
        dot.remove();
      })());
    }
    await Promise.all(jobs);
  }

  async function send() {
    if (busy) return;
    const from = parseInt(fromSel.value, 10);
    const to = parseInt(toSel.value, 10);
    if (from === to) return;
    busy = true; sendBtn.disabled = true;

    if (mode === 'hub') {
      cap('swl_cap_send', { from: pcName(from), to: pcName(to) });
      await sleep(650);
      cap('swl_cap_hub');
      const hdot = await upToSwitch(from);
      await floodFromSwitch(from);
      hdot.remove();
      cap('swl_cap_hub_done', { to: pcName(to) });
      busy = false; sendBtn.disabled = false;
      return;
    }

    cap('swl_cap_send', { from: pcName(from), to: pcName(to) });
    await sleep(650);
    cap('swl_cap_enter', { from: pcName(from), port: from + 1 });
    // La trama sube hasta el switch y espera ahi mientras decide
    const dot = await upToSwitch(from);

    // Aprende el origen
    if (!learned.has(from + 1)) {
      learned.set(from + 1, from);
      renderTable(from + 1);
      cap('swl_cap_learn', { from: pcName(from), port: from + 1 });
      await sleep(1500);
    }
    cap('swl_cap_lookup', { to: pcName(to) });
    await sleep(1000);

    if (learned.has(to + 1)) {
      cap('swl_cap_forward', { port: to + 1 });
      await sleep(900);
      await moveAlong(dot, [[PCS[from].x, MID_Y], [PCS[to].x, MID_Y], [PCS[to].x, PC_Y]]);
      flashPort(to + 1); flashPc(to);
      dot.remove();
      cap('swl_cap_done', { to: pcName(to) });
    } else {
      cap('swl_cap_flood', { to: pcName(to) });
      await sleep(1000);
      await floodFromSwitch(from);
      dot.remove();
      // Aprende el destino con la respuesta
      learned.set(to + 1, to);
      renderTable(to + 1);
      cap('swl_cap_reply', { to: pcName(to), port: to + 1 });
      await sleep(1600);
      await travel(to, from);
      cap('swl_cap_done', { to: pcName(to) });
    }
    busy = false; sendBtn.disabled = false;
  }

  function setMode(m) {
    mode = m;
    modeSwitchBtn.classList.toggle('is-active', m === 'switch');
    modeHubBtn.classList.toggle('is-active', m === 'hub');
    deviceName.textContent = m === 'hub' ? 'HUB' : 'SWITCH';
    renderTable();
    cap(m === 'hub' ? 'swl_caption_hub_idle' : 'swl_caption_idle');
  }

  [fromSel, toSel].forEach(sel => sel.addEventListener('change', () => {
    if (fromSel.value === toSel.value) {
      const other = sel === fromSel ? toSel : fromSel;
      other.value = String((parseInt(sel.value, 10) + 1) % 4);
    }
  }));
  sendBtn.addEventListener('click', send);
  resetBtn.addEventListener('click', () => { learned.clear(); renderTable(); cap('swl_caption_idle'); });
  modeSwitchBtn.addEventListener('click', () => setMode('switch'));
  modeHubBtn.addEventListener('click', () => setMode('hub'));
  renderTable();
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