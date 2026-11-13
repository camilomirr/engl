-- ============================================================
-- NVISION · Foro de Soporte Comunitario «El Taller» (2026-11-10)
-- Ejecutar TODO este archivo en el SQL Editor de Supabase.
--
-- Crea las dos tablas del foro (foro.html):
--   · foro_preguntas:  problemas que publican los estudiantes.
--   · foro_respuestas: ayudas de la comunidad; la pregunta guarda
--     en solucion_id la respuesta que su autor marcó como solución.
--
-- Seguridad (RLS) — diseño SIN CUENTA (decisión de Duay, 2026-11-12):
--   · Lectura pública y escritura pública: cualquiera puede leer,
--     preguntar y responder escribiendo su nombre; NO se exige
--     inicio de sesión. La autoría va por el nombre escrito
--     (columna autor); user_id queda guardado solo cuando quien
--     publica sí tiene sesión, y puede ser nulo.
--   · Marcar la solución es una edición pública de solucion_id:
--     sin cuentas no hay dueño verificable; la página solo ofrece
--     el botón a quien usa el mismo nombre del autor.
--   · Nadie puede borrar filas desde la web (sin política DELETE:
--     solo el dueño desde el panel de Supabase). Los límites de
--     longitud van como CHECK en la base, además de la validación
--     del cliente (js/validation.js).
-- ============================================================

create table if not exists public.foro_preguntas (
  id          bigint generated always as identity primary key,
  user_id     uuid,
  autor       text not null check (char_length(autor) between 1 and 60),
  titulo      text not null check (char_length(titulo) between 4 and 120),
  cuerpo      text not null check (char_length(cuerpo) between 10 and 2000),
  etiqueta    text not null default 'hardware'
              check (etiqueta in ('hardware','redes','software','wifi','otros')),
  solucion_id bigint,
  created_at  timestamptz not null default now()
);

create table if not exists public.foro_respuestas (
  id          bigint generated always as identity primary key,
  pregunta_id bigint not null references public.foro_preguntas(id) on delete cascade,
  user_id     uuid,
  autor       text not null check (char_length(autor) between 1 and 60),
  cuerpo      text not null check (char_length(cuerpo) between 2 and 2000),
  created_at  timestamptz not null default now()
);

create index if not exists foro_respuestas_pregunta_idx
  on public.foro_respuestas (pregunta_id, created_at);

alter table public.foro_preguntas  enable row level security;
alter table public.foro_respuestas enable row level security;

-- Lectura pública
drop policy if exists "foro preguntas leer" on public.foro_preguntas;
create policy "foro preguntas leer" on public.foro_preguntas
  for select to anon, authenticated using (true);

drop policy if exists "foro respuestas leer" on public.foro_respuestas;
create policy "foro respuestas leer" on public.foro_respuestas
  for select to anon, authenticated using (true);

-- Escribir sin cuenta: cualquiera puede preguntar y responder.
-- (Los CHECK de longitud de las tablas siguen aplicando.)
drop policy if exists "foro preguntas crear propia" on public.foro_preguntas;
drop policy if exists "foro preguntas crear" on public.foro_preguntas;
create policy "foro preguntas crear" on public.foro_preguntas
  for insert to anon, authenticated with check (true);

drop policy if exists "foro respuestas crear propia" on public.foro_respuestas;
drop policy if exists "foro respuestas crear" on public.foro_respuestas;
create policy "foro respuestas crear" on public.foro_respuestas
  for insert to anon, authenticated with check (true);

-- Marcar la solución: editar solo solucion_id (sin cuentas no hay
-- dueño verificable; el permiso de columna lo acota a ese campo).
drop policy if exists "foro preguntas editar propia" on public.foro_preguntas;
drop policy if exists "foro preguntas marcar solucion" on public.foro_preguntas;
create policy "foro preguntas marcar solucion" on public.foro_preguntas
  for update to anon, authenticated using (true) with check (true);
revoke update on public.foro_preguntas from anon, authenticated;
grant update (solucion_id) on public.foro_preguntas to anon, authenticated;

-- Sin políticas DELETE: desde la web nadie borra filas.
