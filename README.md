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
Supabase, esquema aplicado) y la conexión ya viene puesta en
`backend/config.js` y `backend/config.php`.

El proyecto trae **las dos versiones de las páginas**, con el mismo
diseño y la misma base de datos:

- **En línea (`.html`):** la publicada en **https://nvision.social**
  (GitHub Pages, repo `engl`). Las páginas `.html` se conectan a la
  base desde el navegador con el backend JavaScript de `backend/`.
- **Local con XAMPP (`.php`):** las mismas páginas en PHP
  (`index.php`, `hardware.php`, `redes.php`, `mantenimiento.php`,
  `foro.php`, `pqr.php`), con el backend PHP de `backend/`
  (`config.php` + `bd.php`) y las partes comunes en `includes/`
  (`header.php`, `footer.php`, comentarios). En esta versión el foro,
  los comentarios, los avisos y el PQR se procesan en el servidor.

### Para presentarlo local con XAMPP

1. Instala XAMPP y abre su panel de control.
2. Copia esta carpeta dentro de `C:\xampp\htdocs\` (por ejemplo,
   `C:\xampp\htdocs\nvision`).
3. Enciende **Apache** (Start) en el panel de XAMPP.
4. Abre en el navegador: **http://localhost/nvision/index.php**
   (si la carpeta quedó con otro nombre, usa ese nombre).
5. Necesitas internet: la base de datos está en Supabase (la nube).

Si algún día se crea otro proyecto de Supabase, el procedimiento está en
`base-de-datos/README.md`: correr `esquema.sql` y cambiar los dos datos
de conexión en `backend/config.js` y `backend/config.php`.

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
