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
    nav_lab: "Laboratorio de Códigos",
    nav_explorer_3d: "Explorador 3D del PC",
    nav_grp_hardware: "Hardware",
    nav_back: "Volver",
    nav_grp_networks: "Redes",
    nav_grp_resources: "Recursos",
    nav_grp_pc3d: "PC3D y más",
    nav_pc3d_viewer: "Visor 3D",
    nav_pc3d_parts: "Componentes y tipos",
    nav_pc3d_maintenance: "Mantenimiento del PC",
    
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
    explorer_hint: "Mueve el ratón para cambiar la perspectiva",
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
    explorer_parts: "PIEZAS EN CAPA",
    explorer_view: "VISTA DINÁMICA"
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
    nav_lab: "Code Lab",
    nav_explorer_3d: "3D PC Explorer",
    nav_grp_hardware: "Hardware",
    nav_back: "Back",
    nav_grp_networks: "Networks",
    nav_grp_resources: "Resources",
    nav_grp_pc3d: "PC3D and more",
    nav_pc3d_viewer: "3D viewer",
    nav_pc3d_parts: "Components and types",
    nav_pc3d_maintenance: "PC maintenance",

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
    explorer_hint: "Move the mouse to change perspective",
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
    explorer_parts: "LAYERED PARTS",
    explorer_view: "DYNAMIC VIEW"
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
    { c: 'Otro', k: ['hola', 'buenas', 'buenos dias', 'hey', 'saludos', 'hello', 'hi'], r: ['¡Hola! Soy el asistente de **NVISION** 🤖. Pregúntame de hardware, redes, el switch, los códigos del laboratorio o el WiFi. Toca una sugerencia o escribe tu duda.', 'Hi! I am the **NVISION** assistant 🤖. Ask me about hardware, networks, the switch, the code lab or WiFi. Tap a suggestion or type your question.'] },
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
    { c: 'Otro', k: ['chao', 'adios', 'hasta luego', 'nos vemos', 'bye', 'see you'], r: ['¡Hasta pronto! 👋 Recuerda: el switch aprende solo si le envías tramas… y yo también aprendo si me enseñas.', 'See you soon! 👋 Remember: the switch only learns if you send it frames… and I learn too if you teach me.'] }
  ];
  const SUGGEST = [
    ['¿Qué es la RAM?', 'What is RAM?'],
    ['¿Cómo trabaja un switch?', 'How does a switch work?'],
    ['¿Cómo veo mi IP y mi MAC?', 'How do I see my IP and MAC?'],
    ['Instalar un repetidor WiFi', 'Set up a WiFi repeater'],
    ['¿Qué es throughput?', 'What is throughput?'],
    ['¿Cómo limpio mi PC?', 'How do I clean my PC?']
  ];
  const CATS = ['Hardware', 'Redes', 'WiFi', 'Recursos', 'Otro'];

  /* ===== Persistencia (lo enseñado y lo no respondido vive en este navegador) ===== */
  const loadArr = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : d; } catch (e) { return d; } };
  const storeArr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  let learned = loadArr('nvision_bot_learned', []);
  let missed = loadArr('nvision_bot_missed', []);
  let editIdx = -1;

  /* ===== Motor de coincidencia (mismo modelo que FinBot) ===== */
  const STOP = new Set('de la el los las un una unos unas y o u que en es por para con como se mi mis me a al del lo su sus te tu yo si no mas muy cual cuales cuanto quiero puedo debo hay ser son esta este eso esa the a an of to in is are what how do does can i you it and or for on with my me'.split(' '));
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
        <button class="local-assistant-close" type="button" aria-label="Cerrar">×</button>
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
    <button class="local-assistant-toggle" type="button" aria-controls="local-assistant-panel" aria-expanded="false" title="Abrir asistente" aria-label="Abrir asistente">
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
  setupPcExplorer();
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

function setupPcExplorer() {
  const shell = document.getElementById('pc-scene-shell');
  const scene = document.getElementById('pc-scene');
  const sceneTitle = document.getElementById('pc-scene-title');
  const sceneDesc = document.getElementById('pc-scene-desc');
  const partName = document.getElementById('pc-part-name');
  const partIndex = document.getElementById('pc-part-index');
  const sceneButtons = document.querySelectorAll('.pc-scene-btn');

  if (!shell || !scene) return;

  const scenes = {
    overview: { title: 'scene_overview_title', desc: 'scene_overview_desc' },
    core: { title: 'scene_core_title', desc: 'scene_core_desc' },
    airflow: { title: 'scene_airflow_title', desc: 'scene_airflow_desc' }
  };
  const parts = [
    { selector: '.pc-motherboard', key: 'part_motherboard', functionText: 'Conecta todos los componentes y permite que intercambien datos.', types: 'ATX · Micro-ATX · Mini-ITX' },
    { selector: '.pc-ram', key: 'part_ram', functionText: 'Mantiene temporalmente los datos de los programas que están en uso.', types: 'DDR3 · DDR4 · DDR5 · DIMM' },
    { selector: '.pc-cpu', key: 'part_cpu', functionText: 'Ejecuta instrucciones, cálculos y coordina las operaciones del computador.', types: 'Intel · AMD · x86 · x64' },
    { selector: '.pc-gpu', key: 'part_gpu', functionText: 'Procesa gráficos, video, renderizado 3D e inteligencia artificial.', types: 'Integrada · Dedicada · GDDR6 · PCIe' },
    { selector: '.pc-storage', key: 'part_storage', functionText: 'Guarda el sistema operativo, las aplicaciones y los archivos de forma permanente.', types: 'HDD · SSD SATA · M.2 NVMe' },
    { selector: '.pc-psu', key: 'part_psu', functionText: 'Convierte la corriente y entrega voltajes estables a cada pieza.', types: 'ATX · SFX · Bronze · Silver · Gold · Platinum · Titanium' },
    { selector: '.pc-optical', key: 'part_optical', functionText: 'Lee y graba datos en discos CD, DVD y Blu-ray mediante un láser óptico.', types: 'CD · DVD · Blu-ray · SATA' }
  ];
  let activeScene = 'overview';
  let selectedPart = null;

  function getText(key) {
    return translations[currentLang]?.[key] || translations.es[key] || key;
  }

  function updateReadout(partPosition) {
    const part = parts[Math.min(parts.length - 1, Math.max(0, partPosition))];
    if (partName) {
      partName.textContent = getText(part.key);
      partName.setAttribute('data-i18n', part.key);
    }
    if (partIndex) partIndex.textContent = `${String(parts.indexOf(part) + 1).padStart(2, '0')} / ${String(parts.length).padStart(2, '0')}`;
  }

  function showPart(part) {
    selectedPart = part;
    document.querySelectorAll('.pc-layer').forEach((layer) => {
      layer.classList.toggle('is-selected', layer.matches(part.selector));
    });
    updateReadout(parts.indexOf(part));
    if (sceneTitle) sceneTitle.textContent = getText(part.key);
    if (sceneDesc) sceneDesc.textContent = part.functionText;
    if (partName) partName.textContent = part.types;
    if (sceneTitle) sceneTitle.removeAttribute('data-i18n');
    if (sceneDesc) sceneDesc.removeAttribute('data-i18n');
    if (partName) partName.removeAttribute('data-i18n');
  }

  function setScene(sceneName) {
    if (!scenes[sceneName]) return;
    activeScene = sceneName;
    scene.dataset.scene = sceneName;
    sceneButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.scene === sceneName);
    });
    if (sceneTitle) sceneTitle.textContent = getText(scenes[sceneName].title);
    if (sceneDesc) sceneDesc.textContent = getText(scenes[sceneName].desc);
    if (sceneTitle) sceneTitle.dataset.i18n = scenes[sceneName].title;
    if (sceneDesc) sceneDesc.dataset.i18n = scenes[sceneName].desc;
  }

  function updatePerspective(event) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = shell.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const rotateY = (x - 0.5) * 32;
    const rotateX = 12 - (y - 0.5) * 16;
    scene.style.transform = `translate(-50%, -50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    updateReadout(Math.floor(x * parts.length));

    if (!selectedPart) setScene(x < 0.34 ? 'overview' : x < 0.68 ? 'core' : 'airflow');
  }

  shell.addEventListener('pointermove', updatePerspective);
  shell.addEventListener('pointerleave', () => {
    scene.style.transform = 'translate(-50%, -50%) rotateX(10deg) rotateY(-16deg)';
  });
  sceneButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedPart = null;
      document.querySelectorAll('.pc-layer').forEach((layer) => layer.classList.remove('is-selected'));
      setScene(button.dataset.scene);
    });
  });
  parts.forEach((part) => {
    document.querySelectorAll(part.selector).forEach((layer) => {
      layer.addEventListener('click', () => showPart(part));
      layer.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          showPart(part);
        }
      });
    });
  });
  setScene('overview');
  updateReadout(0);
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