# Base de datos — NVISION

El proyecto usa **dos bases**, una por versión de las páginas:

| Versión | Base de datos | Archivo del esquema |
|---|---|---|
| **PHP** (XAMPP e InfinityFree) | **MySQL / MariaDB** | `nvision_mysql.sql` |
| HTML (nvision.social) | Supabase / PostgreSQL | `esquema_supabase.sql` |

Las dos guardan lo mismo: el **foro**, los **comentarios**, los
**PQR** y los **avisos**. Nada de juegos ni cuentas.

---

## 1) MySQL — la base de la versión PHP

### Puesta en marcha en XAMPP (local)

1. Enciende **Apache** y **MySQL** en el panel de XAMPP.
2. Abre **http://localhost/phpmyadmin** y crea una base de datos
   llamada **`nvision`** (cotejamiento `utf8mb4_general_ci`).
3. Entra a la base → pestaña **Importar** → elige
   **`nvision_mysql.sql`** → **Continuar**. Se crean las 5 tablas
   con sus datos semilla.
4. La conexión ya viene puesta en `backend/conexion.php` con los
   valores de XAMPP (`localhost`, `nvision`, `root`, sin clave).

### Puesta en marcha en InfinityFree (internet)

1. En el panel del hosting, crea una **base de datos MySQL**.
2. Entra al **phpMyAdmin** de esa base e importa
   **`nvision_mysql.sql`** (el archivo no crea la base, solo las
   tablas: por eso sirve igual en los dos lados).
3. En la copia del proyecto **que está en el hosting**, cambia los
   4 datos de `backend/conexion.php` por los del panel.

> ⚠️ Los datos de conexión del hosting **no se suben al
> repositorio**: en el repo quedan siempre los de XAMPP.

### Tablas (MySQL)

| Tabla | Para qué |
|---|---|
| `productos` | **El inventario de la tienda** (`nombre`, `categoria`, `descripcion`, `precio` en pesos, `cantidad` de stock): el CRUD principal, desde `tienda.php` |
| `foro_preguntas` | Preguntas del foro El Taller (`nombre`, `titulo`, `tema`, `contenido`, `fecha`) |
| `foro_respuestas` | Respuestas de cada pregunta; si se borra la pregunta, se borran solas (`ON DELETE CASCADE`) |
| `comentarios` | Comentarios por página (`pagina`: inicio, hardware, redes, mantenimiento) |
| `pqr` | Peticiones, quejas, reclamos y sugerencias, con `radicado` único y `estado` (arranca en `Pendiente`) |
| `avisos` | Novedades de la página principal |

### Trabajo diario del encargado de la base (phpMyAdmin)

- **Revisar PQR:** abre la tabla `pqr`. Cambia el `estado` de
  `Pendiente` → `En revisión` → `Resuelto` a medida que se
  atienden. El visitante consulta su caso con el `radicado`.
- **Publicar un aviso:** tabla `avisos` → *Insertar* con título y
  contenido. Aparece solo en la página principal.
- **Moderar:** el foro y los comentarios se pueden editar y borrar
  desde la misma página; también se puede borrar la fila aquí.

### El CRUD, ¿dónde está?

Todo está en `backend/bd.php` con PDO y **sentencias preparadas**:

- **Crear:** `bd_producto_crear`, `bd_foro_crear_pregunta`,
  `bd_foro_crear_respuesta`, `bd_comentario_crear`, `bd_pqr_crear`.
- **Consultar:** `bd_productos`, `bd_producto`,
  `bd_foro_preguntas`, `bd_foro_pregunta`, `bd_foro_respuestas`,
  `bd_comentarios`, `bd_pqr_consultar`, `bd_avisos`.
- **Actualizar:** `bd_producto_actualizar` (editar producto) y
  `bd_foro_actualizar_pregunta` (editar pregunta).
- **Eliminar:** `bd_producto_eliminar`,
  `bd_foro_eliminar_pregunta`, `bd_foro_eliminar_respuesta`,
  `bd_comentario_eliminar`.

---

## 2) Supabase — la base de la versión HTML

> **Estado:** ya está creada y conectada — proyecto
> **`nvision-nuevo`** en Supabase, con `esquema_supabase.sql`
> aplicado y la versión HTML funcionando. Estos pasos son solo
> por si se quiere montar otra desde cero.

1. Entra a [supabase.com](https://supabase.com) y crea un proyecto.
2. En **SQL Editor**, pega `esquema_supabase.sql` y pulsa **Run**.
3. En **Settings → API** copia la **Project URL** y la **anon key**.
4. Pégalas en `backend/config.js`.

Esa base tiene las mismas 5 tablas (en PostgreSQL) y su seguridad
es por políticas RLS, explicadas al final del propio archivo SQL.
