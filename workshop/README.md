# NVISION PC Workshop

Simulador de armado de PC inspirado en el género de PC Building Simulator,
con identidad visual propia de NVISION. No usa logos, texturas, modelos,
sonidos ni UI del juego original. Las marcas y modelos de hardware aparecen
solo como datos descriptivos (nombre y especificaciones), sin logos oficiales.

## Licencias
- Modelos 3D: procedurales, creados con código propio en `js/core/scene.js` (sin assets externos).
- Three.js r160: copia local en `../js/vendor/three/` (licencia MIT de Three.js).
- Textos e interfaz: propios del proyecto NVISION.

## Estructura
- `index.html` — página integrada con la navbar/footer/idioma del sitio.
- `data/components.json` — catálogo de componentes (editable sin tocar código).
- `js/data/catalog.js` — carga del JSON con copia de respaldo incrustada.
- `js/core/rules.js` — motor de compatibilidad (socket, RAM, GPU, fuente, formato, orden de montaje, conectores, alturas, radiadores, avisos).
- `js/core/economy.js` — dinero, precios del día, stock, compra/venta y guardado (Fase 2).
- `js/core/assembly.js` — tareas de montaje, herramientas y errores (Fase 3).
- `js/ui/tasks.js` — barra de herramientas y panel de tareas (Fase 3).
- `js/core/boot.js` — POST, BIOS, modelo térmico, fallas y prueba de carga (Fase 4).
- `js/ui/monitor.js` — la pantalla del banco (Fase 4).
- `js/core/career.js` — clientes, pedidos, evaluación y niveles (Fase 5).
- `js/ui/orders.js` — panel de pedidos y checklist (Fase 5).
- `js/core/bench.js` — puntajes, FPS estimados, resumen y códigos del equipo (Fase 6).
- `js/core/sfx.js` — efectos de sonido sintetizados con WebAudio, sin archivos (Fase 7).
- `js/ui/tutorial.js` — visita guiada de 7 pasos con resaltado (Fase 7).
- `js/ui/shop.js` — tienda con filtros, búsqueda y orden (Fase 2).
- `js/core/scene.js` — escena 3D: banco, gabinete con panel, puntos de montaje, calidad gráfica.
- `js/ui/hud.js` — inventario, HUD, mensajes y textos ES/EN.
- `js/main.js` — une todo: tomar/soltar/instalar, guardado en localStorage.

## Cómo probarlo localmente
Desde la raíz del repo: `python3 -m http.server 8000` y abrir
`http://localhost:8000/workshop/`. (Con file:// el JSON usa la copia de
respaldo incrustada y el 3D puede variar según el navegador.)

## Fases
1. ✅ Estructura, integración, escena 3D, banco, cámara, montar/desmontar con snap y reglas básicas.
2. ✅ Motor de compatibilidad ampliado (altura de disipador, radiador, conectores 12V-2x6/8 pines, M.2, avisos de cuello de botella y PCIe), catálogo de 88 componentes, tienda con precios diarios ±8% y stock, inventario de piezas propias, dinero ($1.500 iniciales) y venta al 70%, guardado v2 con migración desde la Fase 1.
3. ✅ Secuencia completa de montaje paso a paso con herramientas (mano, destornillador Phillips, pasta térmica): tornillos por pieza, pasta antes del disipador, cables de la fuente dibujados en 3D y encendido bloqueado hasta terminar.
4. ✅ Encendido real: POST animado en el monitor, pantalla BIOS, instalación de NVISION OS, escritorio con temperaturas, XMP/EXPO, fallas (sin video, sobrecalentamiento, límite de fuente) y prueba de carga.
5. ✅ Modo carrera: 3 clientes al día con pedidos por propósito y presupuesto, un pedido activo con plazo y lista de verificación en vivo, entrega que consume las piezas, XP y 6 niveles que desbloquean hardware en la tienda.
6. ✅ Benchmarks con puntajes Gaming/Trabajo/Creación y FPS estimados por juego y resolución, modo RGB con luz que cicla dentro del gabinete, resumen para copiar y códigos de equipo NVW1-… importables.
7. ✅ Pulido: efectos de sonido sintetizados con WebAudio (sin archivos) con silencio persistente, tutorial guiado de 7 pasos que se muestra solo la primera vez, sección «Cómo jugar», foco visible de teclado, respeto a prefers-reduced-motion y esta documentación. La página incluye un diagnóstico visible de arranque (franja roja con etapa y error si la inicialización no termina en 8 s).

## Cómo jugar

1. Toma el gabinete del inventario y suéltalo en el banco; abre el panel lateral.
2. Monta las 8 piezas en orden (placa, CPU, refrigeración, RAM, gráfica, disco, fuente) respetando la compatibilidad: la propia página bloquea lo que no encaje y explica por qué.
3. Completa el montaje paso a paso con las herramientas (tornillos, pasta térmica, cables) y enciende: mira el POST, entra a la BIOS si quieres, activa XMP/EXPO, instala NVISION OS y supera la prueba de carga vigilando la temperatura.
4. Acepta pedidos de clientes y cumple su lista dentro del presupuesto para ganar dinero y XP; con el nivel subido desbloqueas piezas mejores en la tienda, cuyos precios cambian a diario.
5. Mide tu equipo en Benchmarks, presume el resultado con el resumen o el código `NVW1-…`, y activa el RGB para verlo brillar.

Todo el avance (dinero, día, inventario, montaje, sistema, carrera y ajustes) se guarda solo en el navegador (localStorage).
