-- ============================================================
-- NVISION · Capa de validación en la base de datos
-- Auditoría de seguridad 2026-11-09 (complementa endurecimiento.sql).
-- Para ejecutar en: Supabase → SQL Editor (cuenta del dueño).
--
-- QUÉ SE COMPROBÓ EN VIVO (con la clave anon, que es pública):
--   · leaderboard: se pudo BORRAR una fila sin sesión → cualquiera
--     puede vaciar el TOP del juego. El INSERT también acepta
--     puntajes arbitrarios hasta el tope viejo (100000), cuando el
--     máximo real del juego es 150 (10 preguntas × 15 puntos).
--   · live_players: se pudo BORRAR una fila sin sesión → cualquiera
--     puede echar a todos los jugadores de una sala.
--   · team_tasks: se pudo ACTUALIZAR una fila sin sesión y marcarla
--     "listo" con un resultado falso → se puede falsificar el
--     trabajo del equipo en el chat. (El DELETE sí está cerrado.)
--   · site_ranking y user_progress: CORRECTOS. Sin sesión devuelven
--     401 al intentar escribir; sus políticas atan cada fila a su
--     dueño (auth.uid() = user_id).
--   · certificados: la tabla AÚN NO EXISTE (404). Hay que crearla
--     ejecutando supabase/certificados.sql; mientras tanto la
--     página de verificación ya no muestra certificados como
--     auténticos solo por el código (ver js/verificar.js).
--
-- PARTE 1: límites y limpieza — NO rompe ninguna función. Aplicar ya.
--   Si alguna sentencia de ADD CONSTRAINT falla, es porque ya hay
--   filas fuera del límite: corrígelas o bórralas y reintenta.
-- PARTE 2: cierres de RLS — ROMPEN flujos actuales a propósito;
--   están comentados, con el aviso de qué se rompe en cada caso.
-- ============================================================

-- ── Limpieza de la propia auditoría ─────────────────────────
-- La prueba en vivo dejó UNA fila en team_tasks (id 59, nombre
-- '__audit__'): no se pudo borrar desde fuera porque el DELETE
-- con anon está cerrado (eso está bien). No se ve en el widget
-- del equipo (su nombre no es de ningún integrante). Bórrala:
delete from public.team_tasks where id = 59 and name = '__audit__';

-- ── PARTE 1 · Límites sanos en la base ──────────────────────
-- leaderboard (TOP del juego): puntaje real máximo = 150.
alter table public.leaderboard drop constraint if exists leaderboard_points_check;
alter table public.leaderboard drop constraint if exists leaderboard_points_rng;
alter table public.leaderboard
  add constraint leaderboard_points_rng check (points >= 0 and points <= 150);
alter table public.leaderboard drop constraint if exists leaderboard_name_check;
alter table public.leaderboard drop constraint if exists leaderboard_name_len;
alter table public.leaderboard
  add constraint leaderboard_name_len check (char_length(name) between 1 and 40);

-- live_players (salas del juego): mismo máximo real, 150.
alter table public.live_players drop constraint if exists live_players_points_check;
alter table public.live_players drop constraint if exists live_players_points_rng;
alter table public.live_players
  add constraint live_players_points_rng check (points >= 0 and points <= 150);
alter table public.live_players drop constraint if exists live_players_name_len;
alter table public.live_players
  add constraint live_players_name_len check (char_length(name) between 1 and 40);
alter table public.live_players drop constraint if exists live_players_session_len;
alter table public.live_players
  add constraint live_players_session_len check (char_length(session_id) <= 64);

-- team_tasks (chat del equipo): mismos límites de endurecimiento.sql,
-- por si esa parte no se había aplicado.
alter table public.team_tasks drop constraint if exists team_tasks_name_len;
alter table public.team_tasks drop constraint if exists team_tasks_task_len;
alter table public.team_tasks drop constraint if exists team_tasks_result_len;
alter table public.team_tasks
  add constraint team_tasks_name_len   check (char_length(name) between 1 and 60),
  add constraint team_tasks_task_len   check (char_length(task) between 1 and 2000),
  add constraint team_tasks_result_len check (char_length(result) <= 4000);

-- site_ranking: el máximo legítimo hoy es 805 puntos
-- (5 exámenes × 100 + 11 pasos de ruta × 10 + 13 logros × 15);
-- se deja 1000 de margen para contenido nuevo. El tope de 100000
-- permitía publicar un puntaje imposible y reinar en el ranking.
alter table public.site_ranking drop constraint if exists ranking_points_rng;
alter table public.site_ranking
  add constraint ranking_points_rng check (points >= 0 and points <= 1000);

-- user_progress: el progreso legítimo pesa pocos KB (los apuntes
-- completos, ~100 KB); 512 KB de tope frena el abuso de espacio
-- sin tocar a ningún usuario real.
alter table public.user_progress drop constraint if exists user_progress_data_size;
alter table public.user_progress
  add constraint user_progress_data_size check (pg_column_size(data) <= 524288);

-- ── PARTE 2 · Cierres de RLS (LEER ANTES, comentados) ───────
-- Primero, para ver los nombres reales de las políticas:
--   select tablename, policyname, cmd, roles
--   from pg_policies where schemaname = 'public'
--   order by tablename, cmd;
-- Ajusta los DROP a esos nombres antes de descomentar.

-- 2A) team_tasks: quitar el UPDATE al rol anon.
--     ⚠️ ROMPE el puente de tareas: las automatizaciones del
--     equipo que marcan "listo" con la clave anon dejarán de
--     funcionar. Antes de aplicarlo, el puente debe usar la
--     SERVICE ROLE key en un entorno privado (NUNCA en el repo
--     ni en el navegador): esa clave salta RLS y el flujo sigue.
-- drop policy "team_tasks_update" on public.team_tasks;

-- 2B) leaderboard y live_players: quitar el DELETE al rol anon.
--     ⚠️ Los botones del panel admin del juego ("Borrar TOP",
--     cerrar/reiniciar sala) dejarán de funcionar desde la
--     página; esas limpiezas se harían desde este panel.
-- drop policy "leaderboard_delete" on public.leaderboard;
-- drop policy "live_players_delete" on public.live_players;

-- 2C) game_state: el UPDATE con anon es lo que permite al
--     anfitrión iniciar y avanzar la partida (ver
--     endurecimiento.sql, nota 2C). Sin re-arquitectura no se
--     puede cerrar; el riesgo aceptado es que alguien
--     interrumpa una partida en curso, sin robo de datos.

-- ── Nota: la clave del panel admin del juego ────────────────
-- Sigue escrita en el JS público (redes_challenge/juego.js,
-- usuario y clave "redesjuego"): es pública desde que se subió
-- y se debe considerar quemada. Cambiarla en el archivo NO la
-- hace secreta (el repo y la página son públicos): la
-- protección real son los cierres 2B/2C de arriba. Mientras
-- tanto, el panel solo esconde botones; no protege la base.
