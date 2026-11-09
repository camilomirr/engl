# Pasos que solo puede hacer el dueño del proyecto Supabase

Guía para **Camilo** (dueño del proyecto Supabase y del repo). Todo lo demás del
sitio ya está hecho en código; esto es lo que falta y **solo se puede activar
desde su cuenta**. Nada de esto requiere saber programar: son copiar, pegar y
clic, en orden.

Proyecto: `https://xiuztrujrwdgcpjrruxu.supabase.co`
Dónde se hace todo lo de base de datos: **Supabase → SQL Editor → New query**,
pegar el archivo indicado y **Run**.

---

## 1. Crear el registro oficial de certificados ⏳ pendiente

**Por qué:** hoy la tabla `certificados` no existe (la API responde 404), así que
`verificar.html` solo puede decir «autenticidad no confirmada», aunque el código
del certificado coincida.

**Pasos:**
1. Abrir el archivo `supabase/certificados.sql` de este repo.
2. Copiarlo entero en el SQL Editor y darle **Run**.
3. Comprobar en el mismo SQL Editor: `select count(*) from public.certificados;`
   debe responder `0` (la tabla existe y está vacía), ya no un error de
   «tabla no encontrada». Además, en `verificar.html`, un código que coincida
   pasará a poder constar en el registro.

Desde ese momento, cada certificado nuevo queda registrado al generarse y la
verificación puede confirmar que consta en el registro oficial.

## 2. Aplicar los límites de la base y borrar una fila de auditoría ⏳ pendiente

**Por qué:** en `team_tasks` sigue viva la fila de prueba `id 59` con nombre
`__audit__` (la dejó la auditoría de seguridad y solo se puede borrar desde
dentro), y conviene dejar aplicados todos los límites (CHECK) en un solo paso.

**Pasos:**
1. Abrir `supabase/validacion.sql`.
2. Ejecutar **la limpieza inicial y la PARTE 1** (todo lo que no está comentado).
   La Parte 1 no rompe ninguna función: solo pone topes sanos de puntajes y
   longitudes. Si alguna sentencia falla, es porque ya hay una fila fuera del
   límite: corregirla o borrarla y volver a correr.
3. La **PARTE 2 queda comentada a propósito**: es el paso 3 de esta guía.

Nota: parte de esos límites ya están activos (los `CHECK` de `leaderboard` se
comprobaron en vivo), así que es posible que algunas sentencias digan que la
restricción ya existe o que el nombre difiere; el archivo usa
`drop constraint if exists` antes de crear, pensado para correr sin miedo.

## 3. Cierres fuertes de seguridad (Parte 2) ⚠️ decisión del dueño

Hoy, sin iniciar sesión, todavía se puede **actualizar `team_tasks`** y
**borrar filas de `leaderboard` y `live_players`** (comprobado en vivo en la
auditoría). Cerrar eso rompe flujos actuales, por eso está comentado en
`supabase/endurecimiento.sql` y en `supabase/validacion.sql`:

| Cierre | Qué se gana | Qué se rompe al aplicarlo |
|---|---|---|
| 2A Quitar UPDATE anon en `team_tasks` | Nadie puede falsificar tareas del equipo marcándolas «listo» | El puente de tareas que marca «listo» con la clave anon deja de funcionar. **Antes** hay que pasar ese puente a usar la clave `service_role` en un entorno privado (servidor o PC del equipo, **jamás** en el repo ni en la página) |
| 2B Quitar DELETE anon en `leaderboard` y `live_players` | Nadie puede vaciar el TOP del juego ni expulsar jugadores de una sala | Los botones de admin del juego («Borrar TOP», cerrar sala) dejan de funcionar desde la página; esas limpiezas se harían desde el panel de Supabase |
| 2C `game_state` solo para usuarios con cuenta | El anfitrión de una partida sería una cuenta real | Exige cambiar el juego para enviar el token de la sesión en sus llamadas (trabajo de código, no solo de panel) |

Relacionado: la clave del panel admin del Redes Challenge está escrita en el
JS público (`redes_challenge/juego.js`) y debe considerarse **quemada**:
cambiarla en el archivo no la vuelve secreta, porque el repo es público. La
protección real son los cierres 2B/2C.

## 4. Activar «Continuar con Google» ⏳ pendiente

El botón ya está en `cuenta.html` y avisa que falta activar el proveedor.
Falta el alta en Google Cloud + Supabase (solo el dueño):

1. **Google Cloud Console** → APIs y servicios → Credenciales → Crear
   credenciales → **ID de cliente OAuth** → tipo «Aplicación web».
2. En «URIs de redireccionamiento autorizados» poner exactamente:
   `https://xiuztrujrwdgcpjrruxu.supabase.co/auth/v1/callback`
3. Copiar el **ID de cliente** y el **secreto** que genera Google.
4. **Supabase → Authentication → Providers → Google**: activarlo y pegar
   el ID y el secreto.
5. Probar en `cuenta.html`: el botón ya entra directo cuando el proveedor
   está encendido (la foto de Google solo se usa si el usuario la elige).

## 5. Activar Google Analytics (GA4) ⏳ falta el ID

El código ya está listo en `js/analytics.js` (respeta «Do Not Track» y usa
IP anonimizada). Solo falta el ID de medición:

1. Crear la propiedad en [analytics.google.com](https://analytics.google.com)
   para `nvision.social` y copiar el ID con formato `G-XXXXXXXXXX`.
2. Pasarle el ID al equipo (o pegarlo en `GA4_ID` dentro de `js/analytics.js`).
3. En la CSP de **todas** las páginas hay que permitir
   `www.googletagmanager.com` en `script-src` y `www.google-analytics.com`
   en `connect-src` (el comentario al inicio de `js/analytics.js` lo explica);
   ese cambio de código lo hace el equipo cuando tenga el ID.

## 6. Colocar el flujo de CI de GitHub Actions ⏳ pendiente (2 minutos, en la web)

Las pruebas automáticas ya están en el repo (`tests/run_tests.py`), pero el
flujo que las correría en cada push no se pudo subir desde la CLI: GitHub
rechaza crear archivos de `.github/workflows/` con un token OAuth sin el
permiso `workflow`.

**Pasos (en la web de GitHub, con cualquier cuenta con acceso al repo):**
1. Abrir el repo → **Add file → Create new file**.
2. Nombre del archivo: `.github/workflows/ci.yml`
3. Pegar el contenido de `tests/ci-para-github.yml` de este repo y confirmar.
4. En la pestaña **Actions** debe aparecer «CI NVISION» y correr en verde en
   el siguiente push.

Alternativa: que quien suba código renueve su acceso de `gh` incluyendo el
alcance `workflow` (`gh auth refresh -h github.com -s workflow`) y suba el
archivo desde su equipo.

## 7. (Opcional, a futuro) Notificaciones push reales

Los recordatorios dentro del sitio ya funcionan sin esto. Las notificaciones
push de verdad (con el navegador cerrado) necesitan **Supabase Edge Functions**
desplegadas por el dueño y claves VAPID: es un proyecto aparte, no un ajuste.

---

### Estado rápido

| Paso | Estado |
|---|---|
| 1. Tabla `certificados` | ⏳ Sin crear (404 en vivo) |
| 2. Límites + borrar fila `__audit__` id 59 | ⏳ Sin correr (`validacion.sql`) |
| 3. Cierres Parte 2 (RLS) | ⚠️ Decisión pendiente |
| 4. Login con Google | ⏳ Proveedor apagado |
| 5. GA4 | ⏳ Falta el ID `G-…` |
| 6. Flujo CI en `.github/workflows/` | ⏳ Sin colocar (listo en `tests/`) |
| 7. Push reales | 🔭 Futuro |
