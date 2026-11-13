-- NVISION · Quiz en vivo: subir el límite de puntos de live_players a 800.
-- SOLO LO PUEDE CORRER EL DUEÑO (Camilo) en Supabase → SQL Editor → Run.
--
-- POR QUÉ: la restricción live_players_points_rng (de validacion.sql) limita
-- los puntos a 150, que es el máximo del Redes Challenge. El Quiz en vivo
-- daba 100 puntos por acierto y tiene 8 preguntas (máximo 800), así que el
-- segundo acierto de cada jugador se rechazaba en silencio y el podio
-- mostraba a todos con 100 puntos. Mientras tanto la sala da 10 por acierto
-- (máximo 80); al correr este archivo se puede volver a 100 por acierto
-- cambiando una línea en js/sala.js (myPoints += 10 → += 100, y los textos
-- "+10" → "+100") y subiendo la versión ?v= del script en sala.html.
-- 800 cubre los dos juegos: el Challenge llega a 150 y la sala a 800.
-- Idempotente: se puede correr varias veces sin daño.

alter table public.live_players drop constraint if exists live_players_points_rng;
alter table public.live_players
  add constraint live_players_points_rng check (points >= 0 and points <= 800);

-- Comprobación: debe responder 800 como máximo permitido.
select conname, pg_get_constraintdef(oid) as definicion
  from pg_constraint
  where conname = 'live_players_points_rng';
