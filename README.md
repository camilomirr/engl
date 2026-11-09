# NVISION — Hardware, Redes y Mantenimiento

Sitio educativo interactivo sobre hardware, redes y mantenimiento de computadores.
Publicado en **[nvision.social](https://nvision.social)** con GitHub Pages (rama `main`, archivo `CNAME`).

Bilingüe (ES/EN), con tema oscuro, instalable como PWA y con cuentas de usuario
para sincronizar el progreso en la nube (Supabase).

## Qué tiene el sitio

| Área | Páginas y funciones |
|---|---|
| Inicio | `index.html` — portada, pregunta del día con racha, asistente (chatbot) y asistente de voz |
| Hardware | `hardware.html` — componentes y evolución · `pc3d.html` — visor 3D de un PC |
| Taller PC | `workshop/` — simulador de armado: catálogo de 88 componentes, tienda y economía, armado paso a paso, POST/BIOS, sistema operativo, modo carrera, benchmarks y códigos de armado |
| Redes | `redes.html` — contenido, calculadora de subredes IPv4 y conversor de bases · `wifi.html` — guía WiFi · `redes_challenge/` — juego en vivo por salas con ranking |
| Mantenimiento | `mantenimiento-software.html` — limpieza y optimización de Windows con herramientas del sistema |
| Aprender | `ruta.html` — ruta de aprendizaje de 11 pasos · `recursos.html` — glosario con buscador y tarjetas (flashcards) · `ingles.html` — inglés técnico con audio y quiz · `comparador.html` — comparador de componentes · `terminal.html` — terminal simulada con 3 misiones · `apuntes.html` — apuntes personales sincronizados |
| Evaluar | `examenes.html` — 5 exámenes de 15 preguntas (Hardware, Redes, Mantenimiento, WiFi, Seguridad), nota en porcentaje, aprobado con 70% y certificado PNG con código de verificación · `verificar.html` — comprobar un certificado · `logros.html` — 19 logros · `ranking.html` — ranking del sitio |
| Cuenta | `cuenta.html` — registro/login (correo; Google cuando el dueño lo active), avatar (íconos o foto), sincronización, exportar/importar progreso · `perfil.html` — perfil público |
| Otros | `privacidad.html` · `404.html` · chat del equipo (widget conectado a Supabase) |

## Tecnología

- **Front-end estático:** HTML, CSS y JavaScript sin frameworks ni paso de compilación.
- **Back-end:** Supabase (Auth + Postgres con RLS). La clave `anon` es pública por
  diseño y vive en `js/main.js` (`window.NVISION_SUPABASE_ANON_KEY`); la seguridad
  real está en las políticas RLS y en los `CHECK` de la base, no en esconder la clave.
  La clave `service_role` **nunca** debe estar en este repo ni en el navegador.
- **PWA:** `manifest.webmanifest` + `sw.js` (caché `nvision-pwa-v7`): portada y
  páginas principales funcionan sin conexión.
- **SEO:** meta description y Open Graph en todas las páginas, `sitemap.xml`,
  `robots.txt`, favicon y página 404 propia.

## Capas de validación y seguridad

1. **`js/validation.js`** — capa compartida: escape HTML completo, nombres y textos
   saneados con tope de longitud, enteros forzados a rango, validación de correo,
   UUID, puntajes, foto de avatar (solo `data:` JPEG/PNG/WebP o foto oficial de
   Google) y códigos de certificado con formato.
2. **Puerta de exámenes con verificación en el servidor:** `js/examenes.js` confirma
   la sesión contra Supabase (`GET /auth/v1/user`) antes de abrir un examen y antes
   de entregar el certificado; una sesión local inventada no sirve.
3. **CSP** (política de seguridad de contenido) en las 22 páginas y
   `.well-known/security.txt`.
4. **En la base (Supabase):** RLS por dueño en `user_progress` y `site_ranking`,
   y `CHECK` de rangos y longitudes en `leaderboard`, `live_players` y
   `team_tasks` (ver `supabase/`).
5. **Certificados verificables:** el código `NV-XXXXX-XXXXX` se recalcula en
   `verificar.html`; el registro oficial en base de datos es opcional y se crea
   con `supabase/certificados.sql` (pasos en `supabase/PASOS_DUENO.md`).

### Archivos SQL (`supabase/`)

Se ejecutan a mano en **Supabase → SQL Editor** con la cuenta del dueño, en este orden:

1. `user_progress.sql` — progreso sincronizado de las cuentas.
2. `site_ranking.sql` — ranking del sitio.
3. `certificados.sql` — registro oficial de certificados (pendiente de ejecutar).
4. `endurecimiento.sql` y `validacion.sql` — Parte 1: límites seguros (aplicar ya).
   Parte 2: cierres de RLS comentados, con aviso de qué flujo rompe cada uno.

La guía paso a paso para el dueño está en **`supabase/PASOS_DUENO.md`**.

## Cómo probarlo en local

Sin instalar nada, con Python:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Pruebas automáticas

```bash
python3 tests/run_tests.py
```

Comprueban: CSP/meta/OG en todas las páginas, enlaces internos, manifiesto PWA y
sus archivos, sitemap y caché del service worker, `alt` en las imágenes, los
5 exámenes (15 preguntas, opciones ES/EN y respuesta válida), el banco de la
pregunta del día (32), los 19 logros, la capa de validación, el catálogo del
Workshop (88), que no haya claves `service_role` y la sintaxis de todos los JS
(si hay Node.js). El flujo de GitHub Actions para correrlas en cada push está
listo en `tests/ci-para-github.yml`: falta copiarlo a `.github/workflows/ci.yml`
desde la web de GitHub (el token de la CLI no tiene permiso `workflow` para
crearlo; ver `supabase/PASOS_DUENO.md`, paso 7).

## Analítica

`js/analytics.js` viene preparado pero **desactivado**: sin ID solo cuenta las
visitas en el propio dispositivo. Para activar Google Analytics (GA4) hay que
crear la propiedad, pegar el ID `G-…` en `GA4_ID` y ampliar la CSP como explica
el comentario al inicio de ese archivo (pasos en `supabase/PASOS_DUENO.md`).

## Convenciones del equipo

- Antes de editar: `git pull origin main`.
- Al terminar: `git add .` → `git commit -m "n"` → `git push origin main`.
- GitHub Pages puede tardar unos minutos (y su caché) en mostrar los cambios:
  verificar siempre en el sitio en vivo antes de dar algo por roto o por arreglado.
- Al subir la versión de un recurso (`?v=` en CSS/JS), usar un número mayor que
  **cualquiera** que se haya publicado antes, y subir también la versión de caché
  del service worker en `sw.js`, o los navegadores seguirán viendo lo viejo.

## Estructura

```
├── *.html            Páginas del sitio (20 en la raíz)
├── workshop/         Taller PC (simulador de armado)
├── redes_challenge/  Juego de redes en vivo
├── js/               Lógica de cada página + main.js (compartido) y validation.js
├── css/              styles.css y módulos por sección
├── assets/           Imágenes, iconos PWA y capturas
├── supabase/         SQL del proyecto y guía del dueño (PASOS_DUENO.md)
├── tests/            Pruebas automáticas (run_tests.py)
└── (pendiente) .github/workflows — el flujo listo vive en tests/ci-para-github.yml
```
