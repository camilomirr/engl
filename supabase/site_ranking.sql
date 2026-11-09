-- NVISION · Ranking del sitio (página ranking.html)
-- Ejecutar una sola vez en el panel de Supabase: SQL Editor → New query → Run.
-- Crea la tabla pública de puntajes. Los estudiantes publican su puntaje
-- desde Mi cuenta (solo pueden escribir SU propia fila, con su sesión) y
-- cualquiera puede LEER el ranking. Puntaje = suma de mejores notas de
-- examen + 10 por paso de la ruta + 15 por logro.

create table if not exists public.site_ranking (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  avatar text,
  avatar_image text,
  points integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.site_ranking enable row level security;

drop policy if exists "ranking lectura publica" on public.site_ranking;
create policy "ranking lectura publica"
  on public.site_ranking for select
  using (true);

drop policy if exists "ranking insertar propio" on public.site_ranking;
create policy "ranking insertar propio"
  on public.site_ranking for insert
  with check (auth.uid() = user_id);

drop policy if exists "ranking actualizar propio" on public.site_ranking;
create policy "ranking actualizar propio"
  on public.site_ranking for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
