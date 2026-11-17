# NVISION — versión nueva y ligera

Plataforma educativa de tecnología: **hardware, redes y mantenimiento**,
con foro de la comunidad, comentarios por módulo, avisos y formulario
**PQR**. El diseño es **exactamente el del proyecto original** (se
reutiliza su sistema de estilos completo: encabezado, héroe, tarjetas,
colores y tipografías), pero con lo justo y necesario.

Esta carpeta es la **versión PHP** (la del proyecto final): PHP +
**MySQL/MariaDB**, pensada para XAMPP en local y para el hosting
(InfinityFree) en internet. Tienda con el CRUD completo de productos,
foro también con CRUD, comentarios, PQR con consulta por radicado
y avisos.

(La versión HTML publicada en nvision.social, que se conecta a
Supabase desde el navegador, vive en el repositorio del equipo y no
forma parte de esta entrega.)

Hecha desde cero para un equipo de **3 personas**:

## Quién hace qué

| Rol | Carpeta | Qué toca |
|---|---|---|
| **Frontend** | `frontend/` + las páginas | Diseño y estructura: `frontend/css/` (el sistema de estilos original completo), `frontend/js/interfaz.js`, `frontend/js/validaciones.js` (validaciones de formularios) y las páginas |
| **Backend** | `backend/` | `conexion.php` (conexión PDO a MySQL) y `bd.php` (todo el CRUD con sentencias preparadas) |
| **Base de datos** | `base-de-datos/` | `nvision_mysql.sql` crea las tablas MySQL del proyecto (es el archivo que se importa en phpMyAdmin); `esquema_supabase.sql` queda solo como referencia de la versión web. Su `README.md` explica la puesta en marcha |

## Qué tiene la página

- **Tienda** — el **módulo CRUD principal** del proyecto: un
  sistema de inventario de productos de tecnología. Catálogo en
  tarjetas con precio en pesos y stock, formulario para registrar
  productos, edición y eliminación (tabla `productos`).
- **Inicio** — módulos, novedades (avisos de la base de datos),
  fondo de pantalla descargable y comentarios.
- **Hardware / Redes / Mantenimiento** — el contenido de aprendizaje,
  cada uno con sus comentarios.
- **Foro «El Taller»** — el módulo de comunidad, también con CRUD
  completo: preguntas y respuestas que se publican, consultan,
  editan y eliminan.
- **PQR** — peticiones, quejas, reclamos y sugerencias con radicado
  y consulta de estado por radicado.

## Qué NO tiene (a propósito)

Sin juegos, sin cuentas ni registros, sin página de privacidad,
sin traductor y sin chatbot. La base de datos se usa para el foro,
los comentarios, los PQR y los avisos — nada de puntajes.

## Cómo se pone a funcionar

### Versión PHP — local con XAMPP

1. Instala XAMPP y abre su panel de control.
2. Copia esta carpeta dentro de `C:\xampp\htdocs\` (por ejemplo,
   `C:\xampp\htdocs\nvision`).
3. Enciende **Apache** y **MySQL** (Start en los dos) en el panel.
4. Crea la base de datos en phpMyAdmin y carga las tablas:
   - Abre **http://localhost/phpmyadmin**.
   - Crea una base llamada **`nvision`** (cotejamiento
     `utf8mb4_general_ci`).
   - Entra a esa base → pestaña **Importar** → elige
     `base-de-datos/nvision_mysql.sql` → **Continuar**.
5. Abre en el navegador: **http://localhost/nvision/index.php**
   (si la carpeta quedó con otro nombre, usa ese nombre).

La conexión ya viene lista para XAMPP en `backend/conexion.php`
(servidor `localhost`, base `nvision`, usuario `root`, sin clave).
No necesitas internet para esta versión: la base está en tu equipo.

### Versión PHP — publicada en InfinityFree

1. Crea la cuenta y el sitio en el panel de InfinityFree.
2. En el panel, crea una **base de datos MySQL** y entra a su
   **phpMyAdmin**: importa ahí `base-de-datos/nvision_mysql.sql`.
3. Sube los archivos del proyecto al hosting (administrador de
   archivos o FTP), dentro de `htdocs`.
4. En la copia **del hosting**, edita `backend/conexion.php` y cambia
   SOLO los 4 datos de arriba (servidor, nombre de la base, usuario
   y clave) por los que muestra el panel de InfinityFree.
5. Abre el enlace público y prueba el foro, los comentarios y el PQR.

> ⚠️ Las credenciales del hosting son privadas: **NO se suben al
> repositorio**. En el repo, `backend/conexion.php` queda siempre
> con los datos locales de XAMPP.

### Versión HTML — en línea

La publicada en **https://nvision.social** (GitHub Pages, repo
`engl`). Las páginas `.html` se conectan a Supabase (proyecto
`nvision-nuevo`) desde el navegador, con el backend JavaScript de
`backend/` y la conexión en `backend/config.js`. El esquema de esa
base es `base-de-datos/esquema_supabase.sql`.

## Estructura

```
NVISION-nuevo/
├── index.php  hardware.php  redes.php        ← versión PHP (MySQL)
├── mantenimiento.php  foro.php  pqr.php
├── tienda.php                                ← inventario (CRUD principal)
├── index.html  hardware.html  redes.html     ← versión HTML (Supabase)
├── mantenimiento.html  foro.html  pqr.html
├── assets/            (fondo de pantalla)
├── frontend/
│   ├── css/           (sistema de estilos)
│   └── js/interfaz.js  js/validaciones.js
├── backend/
│   ├── conexion.php   ← conexión PDO a MySQL (versión PHP)
│   ├── bd.php         ← todo el CRUD en PHP
│   ├── config.js      ← conexión a Supabase (versión HTML)
│   ├── supabase.js
│   ├── foro.js  pqr.js  comentarios.js  avisos.js
├── includes/          (header, footer y comentarios de las .php)
└── base-de-datos/
    ├── nvision_mysql.sql     ← tablas MySQL + datos semilla
    ├── esquema_supabase.sql  ← esquema de la versión HTML
    └── README.md
```

## Estructura del proyecto (equivalencia con la guía)

La guía del proyecto final sugiere una estructura de referencia y
permite adaptarla. Así se corresponde con la nuestra:

| Estructura de referencia (guía) | En este proyecto |
|---|---|
| `conexion.php` | `backend/conexion.php` (PDO a MySQL) |
| `js/validaciones.js` | `frontend/js/validaciones.js` |
| `database/proyecto.sql` | `base-de-datos/nvision_mysql.sql` |
| `php/registrar.php` (Crear) | `bd_producto_crear()` y `bd_foro_crear_pregunta()` en `backend/bd.php`, llamadas desde `tienda.php` y `foro.php` |
| `php/consultar.php` (Consultar) | `bd_productos()`, `bd_producto()`, `bd_foro_preguntas()` en `backend/bd.php` |
| `php/actualizar.php` (Actualizar) | `bd_producto_actualizar()` y `bd_foro_actualizar_pregunta()` en `backend/bd.php` |
| `php/eliminar.php` (Eliminar) | `bd_producto_eliminar()` y `bd_foro_eliminar_pregunta()` en `backend/bd.php` |
| `vistas/` (las páginas) | Las páginas `.php` de la raíz (`tienda.php` es el inventario) y las partes comunes en `includes/` |
| `css/estilos.css` | `frontend/css/` (el sistema de estilos del sitio) |
