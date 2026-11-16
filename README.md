# NVISION — versión nueva y ligera

Plataforma educativa de tecnología: **hardware, redes y mantenimiento**,
con foro de la comunidad, comentarios por módulo, avisos y formulario
**PQR**. El diseño es **exactamente el del proyecto original** (se
reutiliza su sistema de estilos completo: encabezado, héroe, tarjetas,
colores y tipografías), pero con lo justo y necesario.

La página ya viene **conectada y funcionando** con su base de datos
propia en Supabase (proyecto `nvision-nuevo`): foro, comentarios, PQR
y avisos operan de una vez.

Hecha desde cero para un equipo de **3 personas**:

## Quién hace qué

| Rol | Carpeta | Qué toca |
|---|---|---|
| **Frontend** | `frontend/` + los `.html` | Diseño y estructura: `frontend/css/` (el sistema de estilos original completo), `frontend/js/interfaz.js` y las páginas |
| **Backend** | `backend/` | La lógica que habla con la base: `config.js` (conexión), `supabase.js` (cliente), `foro.js`, `pqr.js`, `comentarios.js`, `avisos.js` |
| **Base de datos** | `base-de-datos/` | El esquema en Supabase: `esquema.sql` crea las tablas y la seguridad; su `README.md` explica la puesta en marcha |

## Qué tiene la página

- **Inicio** — módulos, novedades (avisos de la base de datos),
  fondo de pantalla descargable y comentarios.
- **Hardware / Redes / Mantenimiento** — el contenido de aprendizaje,
  cada uno con sus comentarios.
- **Foro «El Taller»** — preguntas y respuestas de la comunidad.
- **PQR** — peticiones, quejas, reclamos y sugerencias con radicado.

## Qué NO tiene (a propósito)

Sin juegos, sin cuentas ni registros, sin página de privacidad,
sin traductor y sin chatbot. La base de datos se usa para el foro,
los comentarios, los PQR y los avisos — nada de puntajes.

## Cómo se pone a funcionar

Ya funciona: la base de datos está creada (proyecto `nvision-nuevo` en
Supabase, esquema aplicado) y `backend/config.js` ya trae la conexión.
Solo abre `index.html` en el navegador (o sirve la carpeta con cualquier
servidor estático / GitHub Pages).

Si algún día se crea otro proyecto de Supabase, el procedimiento está en
`base-de-datos/README.md`: correr `esquema.sql` y cambiar los dos datos
de `backend/config.js`.

## Estructura

```
NVISION-nuevo/
├── index.html  hardware.html  redes.html
├── mantenimiento.html  foro.html  pqr.html
├── assets/            (fondo de pantalla)
├── frontend/
│   ├── css/estilos.css
│   └── js/interfaz.js
├── backend/
│   ├── config.js      ← aquí se conecta la base de datos
│   ├── supabase.js
│   ├── foro.js  pqr.js  comentarios.js  avisos.js
└── base-de-datos/
    ├── esquema.sql
    └── README.md
```
