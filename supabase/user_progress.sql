-- ============================================================
-- NVISION · Cuentas de usuario: tabla de progreso en la nube
-- ============================================================
-- Ejecutar UNA sola vez en el panel de Supabase del proyecto:
--   Supabase Dashboard > SQL Editor > New query > pegar todo > Run
--
-- Sin esta tabla, la página "Mi cuenta" (cuenta.html) permite
-- registrarse e iniciar sesión, pero la sincronización del
-- progreso (ruta de aprendizaje, exámenes y Workshop) queda
-- en espera. Al ejecutar esto, la sincronización se activa
-- sola, sin tocar más código.
-- ============================================================

create table if not exists public.user_progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

-- Cada usuario solo puede ver y modificar SU propia fila.
drop policy if exists "leer su propio progreso" on public.user_progress;
create policy "leer su propio progreso"
  on public.user_progress for select
  using (auth.uid() = user_id);

drop policy if exists "crear su propio progreso" on public.user_progress;
create policy "crear su propio progreso"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "actualizar su propio progreso" on public.user_progress;
create policy "actualizar su propio progreso"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "borrar su propio progreso" on public.user_progress;
create policy "borrar su propio progreso"
  on public.user_progress for delete
  using (auth.uid() = user_id);
