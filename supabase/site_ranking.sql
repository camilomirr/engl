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
  updated_at timestamptz not null default now(),
  -- Validación en la base (auditoría 2026-11-09): el avatar_image se
  -- pinta en el navegador de otros visitantes, así que solo puede ser
  -- una imagen data: en base64, la foto oficial de Google o nada.
  constraint ranking_name_len check (char_length(name) <= 60),
  constraint ranking_points_rng check (points >= 0 and points <= 100000),
  constraint ranking_avatar_img check (
    avatar_image is null
    or avatar_image ~ '^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$'
    or avatar_image ~ '^https://lh3\.googleusercontent\.com/[A-Za-z0-9\-_=/]+$'
  ),
  constraint ranking_avatar_img_len check (avatar_image is null or char_length(avatar_image) <= 130000)
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

-- Cada uno puede BORRAR solo su propia fila (botón "Quitarme del
-- ranking" en Mi cuenta). Sin esta política el DELETE da 0 filas
-- aunque se haga con la sesión del propio usuario.
drop policy if exists "ranking borrar propio" on public.site_ranking;
create policy "ranking borrar propio"
  on public.site_ranking for delete
  using (auth.uid() = user_id);
