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
- `js/core/rules.js` — motor de compatibilidad (socket, RAM, GPU, fuente, formato, orden de montaje).
- `js/core/scene.js` — escena 3D: banco, gabinete con panel, puntos de montaje, calidad gráfica.
- `js/ui/hud.js` — inventario, HUD, mensajes y textos ES/EN.
- `js/main.js` — une todo: tomar/soltar/instalar, guardado en localStorage.

## Cómo probarlo localmente
Desde la raíz del repo: `python3 -m http.server 8000` y abrir
`http://localhost:8000/workshop/`. (Con file:// el JSON usa la copia de
respaldo incrustada y el 3D puede variar según el navegador.)

## Fases
1. ✅ Estructura, integración, escena 3D, banco, cámara, montar/desmontar con snap y reglas básicas.
2. ⏳ Motor ampliado, catálogo JSON completo, tienda e inventario con dinero.
3. ⏳ Secuencia completa (tornillos, pasta térmica, cables), herramientas y errores de montaje.
4. ⏳ Encendido real: POST, BIOS, SO, temperaturas, consumo y fallas.
5. ⏳ Modo carrera: clientes, pedidos, economía, progresión y guardado completo.
6. ⏳ Benchmarks, FPS por juego, RGB personalizable y compartir builds.
7. ⏳ Pulido: audio, tutorial, optimización, accesibilidad y documentación final.
