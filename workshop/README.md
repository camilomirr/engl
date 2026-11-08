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
3. ⏳ Secuencia completa (tornillos, pasta térmica, cables), herramientas y errores de montaje.
4. ⏳ Encendido real: POST, BIOS, SO, temperaturas, consumo y fallas.
5. ⏳ Modo carrera: clientes, pedidos, economía, progresión y guardado completo.
6. ⏳ Benchmarks, FPS por juego, RGB personalizable y compartir builds.
7. ⏳ Pulido: audio, tutorial, optimización, accesibilidad y documentación final.
