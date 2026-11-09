-- NVISION · Registro oficial de certificados (página verificar.html)
-- Ejecutar una sola vez en el panel de Supabase: SQL Editor → New query → Run.
-- Cuando un estudiante genera su certificado, la página intenta guardar
-- aquí su código (solo con su sesión iniciada). La verificación es
-- pública por código: cualquiera puede comprobar que un código existe.

create table if not exists public.certificados (
  code text primary key,
  name text not null,
  exam text not null,
  score integer not null,
  issued date not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint certificados_name_len check (char_length(name) <= 60),
  constraint certificados_score_rng check (score >= 0 and score <= 100),
  -- Validación en la base (auditoría 2026-11-09): el código tiene un
  -- formato cerrado y el examen es un id corto del catálogo; sin esto,
  -- cualquier cuenta podía registrar códigos y textos arbitrarios.
  constraint certificados_code_fmt check (code ~ '^NV-[0-9A-Z]{5}-[0-9A-Z]{5}$'),
  constraint certificados_exam_len check (char_length(exam) between 1 and 40)
);

alter table public.certificados enable row level security;

drop policy if exists "certificados lectura publica" on public.certificados;
create policy "certificados lectura publica"
  on public.certificados for select
  using (true);

drop policy if exists "certificados insertar con sesion" on public.certificados;
create policy "certificados insertar con sesion"
  on public.certificados for insert
  to authenticated
  -- La fila debe quedar a nombre de quien la registra: con
  -- with check (true) cualquier cuenta podía crear certificados
  -- con el user_id (y el nombre) de otra persona.
  with check (auth.uid() = user_id);
