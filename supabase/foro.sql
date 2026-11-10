-- ============================================================
-- NVISION · Foro de Soporte Comunitario «El Taller» (2026-11-10)
-- Ejecutar TODO este archivo en el SQL Editor de Supabase.
--
-- Crea las dos tablas del foro (foro.html):
--   · foro_preguntas:  problemas que publican los estudiantes.
--   · foro_respuestas: ayudas de la comunidad; la pregunta guarda
--     en solucion_id la respuesta que su autor marcó como solución.
--
-- Seguridad (RLS):
--   · Lectura pública (el foro se puede leer sin cuenta).
--   · Escribir exige sesión y cada fila queda atada a su dueño
--     (auth.uid() = user_id), igual que site_ranking/user_progress.
--   · Solo el dueño puede editar (marcar la solución) o borrar
--     lo suyo. Los límites de longitud van como CHECK en la base,
--     además de la validación del cliente (js/validation.js).
-- ============================================================

create table if not exists public.foro_preguntas (
  id          bigint generated always as identity primary key,
  user_id     uuid not null,
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
  user_id     uuid not null,
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

-- Escribir solo con sesión y como dueño de la fila
drop policy if exists "foro preguntas crear propia" on public.foro_preguntas;
create policy "foro preguntas crear propia" on public.foro_preguntas
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "foro respuestas crear propia" on public.foro_respuestas;
create policy "foro respuestas crear propia" on public.foro_respuestas
  for insert to authenticated with check (auth.uid() = user_id);

-- Editar/borrar solo lo propio (marcar solución = editar tu pregunta)
drop policy if exists "foro preguntas editar propia" on public.foro_preguntas;
create policy "foro preguntas editar propia" on public.foro_preguntas
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "foro preguntas borrar propia" on public.foro_preguntas;
create policy "foro preguntas borrar propia" on public.foro_preguntas
  for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "foro respuestas borrar propia" on public.foro_respuestas;
create policy "foro respuestas borrar propia" on public.foro_respuestas
  for delete to authenticated using (auth.uid() = user_id);
