# Base de datos — NVISION (Supabase / PostgreSQL)

La base guarda lo que la página necesita de verdad: el **foro**, los
**comentarios**, los **PQR** y los **avisos**. Nada de juegos ni cuentas.

> **Estado:** ya está creada y conectada — proyecto **`nvision-nuevo`**
> en Supabase, con este esquema aplicado y la página funcionando.
> Los pasos de abajo son solo por si se quiere montar otra desde cero.

## Puesta en marcha (15 minutos)

1. Entra a [supabase.com](https://supabase.com) y crea un proyecto gratis
   (nombre sugerido: `nvision`).
2. En el panel del proyecto ve a **SQL Editor → New query**, pega todo el
   contenido de `esquema.sql` y pulsa **Run**. Debe terminar sin errores.
3. Ve a **Settings → API** y copia dos datos:
   - **Project URL** (ej: `https://abcd1234.supabase.co`)
   - **anon public key** (la llave larga que dice `anon`)
4. Pégalos en `backend/config.js`. Con eso el foro, los comentarios,
   los avisos y el formulario PQR quedan funcionando.

## Tablas

| Tabla | Para qué | Quién lee | Quién escribe |
|---|---|---|---|
| `foro_preguntas` | Preguntas del foro El Taller | Todo el mundo | Todo el mundo |
| `foro_respuestas` | Respuestas de cada pregunta | Todo el mundo | Todo el mundo |
| `comentarios` | Comentarios por página (`pagina`: inicio, hardware, redes, mantenimiento) | Todo el mundo | Todo el mundo |
| `pqr` | Peticiones, quejas, reclamos y sugerencias, con `estado` | **Solo el equipo** (panel) | La página solo envía |
| `avisos` | Novedades de la página principal | Todo el mundo | **Solo el equipo** (panel) |

Además hay una vista `foro_resumen` con el conteo de respuestas por pregunta.

## Trabajo diario del encargado de la base

- **Revisar PQR:** Table Editor → `pqr`. Cambia el `estado` de
  `Recibido` → `En revisión` → `Resuelto` a medida que se atienden.
  El radicado que recibe el visitante son los primeros 8 caracteres
  del `id` de su fila: búscalo con ese dato cuando pregunte por su caso.
- **Publicar un aviso:** Table Editor → `avisos` → *Insert row* con
  título y contenido. Aparece solo en la página principal.
- **Moderar:** si un comentario o pregunta del foro no va, se borra la
  fila desde el Table Editor (borrar una pregunta borra sus respuestas).

## Seguridad (RLS)

Todas las tablas tienen Row Level Security activado. Las políticas están
al final de `esquema.sql` y dicen exactamente quién puede hacer qué.
La tabla `pqr` no tiene política de lectura pública a propósito: guarda
correos personales.
