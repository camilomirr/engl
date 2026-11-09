-- ============================================================
-- NVISION · Endurecimiento de seguridad (auditoría 2026-11-09)
-- Para ejecutar en: Supabase → SQL Editor (cuenta del dueño).
--
-- CONTEXTO: la clave "anon" es PÚBLICA (vive en el código del
-- sitio). La auditoría comprobó en vivo que con esa clave, sin
-- iniciar sesión, cualquiera puede:
--   · ACTUALIZAR cualquier fila de team_tasks (falsificar el
--     estado y el resultado de las tareas del equipo).
--   · BORRAR cualquier fila de leaderboard y de live_players
--     (vaciar el TOP del juego y echar a todos de la sala).
--   · ACTUALIZAR game_state (iniciar/reiniciar partidas ajenas).
-- Además, la contraseña del panel admin del juego está escrita
-- en el JS público (redes_challenge/juego.js): es pública y se
-- debe considerar quemada; la protección real es RLS, no ella.
--
-- PARTE 1: límites sanos — NO rompe ninguna función. Aplicar ya.
-- PARTE 2: cierres de UPDATE/DELETE — ROMPEN flujos actuales;
--         leer cada aviso antes de ejecutar.
-- ============================================================

-- ── PARTE 1 · Límites de tamaño y rango ─────────────────────
-- Si alguna sentencia falla es porque ya hay filas que violan el
-- límite: hay que corregir o borrar esas filas y reintentar.

alter table public.team_tasks
  add constraint team_tasks_name_len  check (char_length(name) <= 60),
  add constraint team_tasks_task_len  check (char_length(task) <= 2000),
  add constraint team_tasks_result_len check (char_length(result) <= 4000);

alter table public.leaderboard
  add constraint leaderboard_name_len   check (char_length(name) <= 40),
  add constraint leaderboard_points_rng check (points >= 0 and points <= 100000);

alter table public.live_players
  add constraint live_players_name_len   check (char_length(name) <= 40),
  add constraint live_players_points_rng check (points >= 0 and points <= 100000);

-- ── PARTE 2 · Cierres (LEER ANTES) ──────────────────────────
-- Los nombres exactos de las políticas pueden variar: revísalos
-- en Authentication → Policies y ajusta los DROP si hace falta.

-- 2A) team_tasks: quitar el UPDATE al rol anon.
--     ⚠️ ROMPE el puente de tareas si las automatizaciones del
--     equipo marcan "listo" usando la clave anon. Antes de
--     aplicarlo, el puente debe usar la SERVICE ROLE key en un
--     entorno privado (NUNCA en el repo ni en el navegador): esa
--     clave salta RLS y el flujo sigue igual para el equipo.
-- drop policy "team_tasks_update" on public.team_tasks;
-- (La lectura y la creación con anon se mantienen: la página
--  las necesita para mostrar el chat y enviar mensajes.)

-- 2B) leaderboard y live_players: quitar el DELETE al rol anon.
--     ⚠️ Los botones de admin del juego ("Borrar TOP", cerrar o
--     reiniciar sala) dejarán de funcionar desde la página; esas
--     limpiezas se harían desde este panel de Supabase.
-- drop policy "leaderboard_delete" on public.leaderboard;
-- drop policy "live_players_delete" on public.live_players;

-- 2C) game_state: el UPDATE con anon es lo que permite a la
--     página anfitriona iniciar y avanzar la partida, así que
--     NO se puede quitar sin re-arquitectar. Opciones reales:
--     (a) dejarlo y aceptar que alguien podría interrumpir una
--         partida en curso (solo afecta la partida, sin robo
--         de datos), o
--     (b) que el anfitrión juegue con una cuenta de NVISION y
--         cambiar la política de UPDATE a usuarios autenticados:
-- drop policy "game_state_update" on public.game_state;
-- create policy "game_state_update" on public.game_state
--   for update to authenticated using (true) with check (true);
--     Ojo: (b) también exige ajustar el juego para enviar el
--     token de la sesión en sus llamadas. Trabajo pendiente si
--     se quiere ese nivel.
