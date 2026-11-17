-- ============================================================
-- NVISION — Esquema completo de la base de datos (Supabase / PostgreSQL)
-- ------------------------------------------------------------
-- Cómo usarlo: crea un proyecto en https://supabase.com, entra a
-- SQL Editor, pega TODO este archivo y pulsa Run. Crea las 5
-- tablas del proyecto con su seguridad (RLS) y datos de ejemplo.
--
-- Tablas:
--   foro_preguntas   preguntas del foro «El Taller»
--   foro_respuestas  respuestas de cada pregunta
--   comentarios      comentarios de las páginas de aprendizaje
--   pqr              peticiones, quejas, reclamos y sugerencias
--   avisos           novedades que se muestran en el inicio
-- ============================================================

-- Extensión para generar identificadores únicos (uuid)
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 1) FORO — preguntas
-- ------------------------------------------------------------
create table if not exists public.foro_preguntas (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null check (char_length(nombre) between 2 and 60),
  titulo     text not null check (char_length(titulo) between 4 and 120),
  etiqueta   text not null default 'Otro'
             check (etiqueta in ('Hardware', 'Redes', 'Mantenimiento', 'Otro')),
  mensaje    text not null check (char_length(mensaje) between 4 and 2000),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2) FORO — respuestas (cada una cuelga de una pregunta)
-- ------------------------------------------------------------
create table if not exists public.foro_respuestas (
  id          uuid primary key default gen_random_uuid(),
  pregunta_id uuid not null references public.foro_preguntas (id) on delete cascade,
  nombre      text not null check (char_length(nombre) between 2 and 60),
  mensaje     text not null check (char_length(mensaje) between 2 and 1000),
  created_at  timestamptz not null default now()
);
create index if not exists idx_respuestas_pregunta on public.foro_respuestas (pregunta_id);

-- ------------------------------------------------------------
-- 3) COMENTARIOS de las páginas (hardware, redes, mantenimiento…)
-- ------------------------------------------------------------
create table if not exists public.comentarios (
  id         uuid primary key default gen_random_uuid(),
  pagina     text not null check (pagina in ('inicio', 'hardware', 'redes', 'mantenimiento')),
  nombre     text not null check (char_length(nombre) between 2 and 60),
  mensaje    text not null check (char_length(mensaje) between 2 and 500),
  created_at timestamptz not null default now()
);
create index if not exists idx_comentarios_pagina on public.comentarios (pagina, created_at desc);

-- ------------------------------------------------------------
-- 4) PQR — peticiones, quejas, reclamos y sugerencias
--    El estado lo cambia el equipo desde el panel de Supabase.
-- ------------------------------------------------------------
create table if not exists public.pqr (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null check (char_length(nombre) between 2 and 80),
  correo     text not null check (correo like '%@%.%'),
  tipo       text not null check (tipo in ('Petición', 'Queja', 'Reclamo', 'Sugerencia')),
  asunto     text not null check (char_length(asunto) between 4 and 120),
  mensaje    text not null check (char_length(mensaje) between 10 and 2000),
  estado     text not null default 'Recibido'
             check (estado in ('Recibido', 'En revisión', 'Resuelto')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 5) AVISOS — novedades del inicio (se publican desde el panel)
-- ------------------------------------------------------------
create table if not exists public.avisos (
  id         uuid primary key default gen_random_uuid(),
  titulo     text not null check (char_length(titulo) between 4 and 120),
  contenido  text not null check (char_length(contenido) between 4 and 600),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SEGURIDAD (RLS): quién puede leer y escribir desde la página
-- ------------------------------------------------------------
alter table public.foro_preguntas  enable row level security;
alter table public.foro_respuestas enable row level security;
alter table public.comentarios     enable row level security;
alter table public.pqr             enable row level security;
alter table public.avisos          enable row level security;

-- Foro: cualquiera puede leer y publicar (es un foro público).
drop policy if exists "foro leer" on public.foro_preguntas;
create policy "foro leer" on public.foro_preguntas
  for select to anon, authenticated using (true);
drop policy if exists "foro publicar" on public.foro_preguntas;
create policy "foro publicar" on public.foro_preguntas
  for insert to anon, authenticated with check (true);

drop policy if exists "respuestas leer" on public.foro_respuestas;
create policy "respuestas leer" on public.foro_respuestas
  for select to anon, authenticated using (true);
drop policy if exists "respuestas publicar" on public.foro_respuestas;
create policy "respuestas publicar" on public.foro_respuestas
  for insert to anon, authenticated with check (true);

-- Comentarios: cualquiera puede leer y comentar.
drop policy if exists "comentarios leer" on public.comentarios;
create policy "comentarios leer" on public.comentarios
  for select to anon, authenticated using (true);
drop policy if exists "comentarios publicar" on public.comentarios;
create policy "comentarios publicar" on public.comentarios
  for insert to anon, authenticated with check (true);

-- PQR: la página SOLO puede enviar (insert). Leerlos o cambiar el
-- estado se hace desde el panel de Supabase, porque traen correos
-- personales. Por eso NO se crea política de lectura pública.
drop policy if exists "pqr enviar" on public.pqr;
create policy "pqr enviar" on public.pqr
  for insert to anon, authenticated with check (true);

-- Avisos: la página solo los lee; se publican desde el panel.
drop policy if exists "avisos leer" on public.avisos;
create policy "avisos leer" on public.avisos
  for select to anon, authenticated using (true);

-- ------------------------------------------------------------
-- VISTA: resumen del foro con el conteo de respuestas por pregunta
-- ------------------------------------------------------------
create or replace view public.foro_resumen as
select p.id, p.titulo, p.nombre, p.created_at,
       count(r.id) as respuestas
from public.foro_preguntas p
left join public.foro_respuestas r on r.pregunta_id = p.id
group by p.id
order by p.created_at desc;

-- ------------------------------------------------------------
-- DATOS DE EJEMPLO (se pueden borrar desde el Table Editor)
-- ------------------------------------------------------------
insert into public.avisos (titulo, contenido) values
  ('¡Bienvenidos a la nueva NVISION!',
   'Estrenamos página: mismo diseño, menos vueltas. Aprende en los módulos, pregunta en el foro y envía tus PQR desde la sección de contacto.')
on conflict do nothing;

insert into public.foro_preguntas (nombre, titulo, etiqueta, mensaje) values
  ('Equipo NVISION', '¿Dudas con un tema? Pregunta aquí', 'Otro',
   'Este es el foro El Taller: deja tu pregunta sobre hardware, redes o mantenimiento y la comunidad te responde.')
on conflict do nothing;
