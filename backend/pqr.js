/* ============================================================
   NVISION — Formulario PQR (backend)
   Guarda peticiones, quejas, reclamos y sugerencias en la tabla
   pqr. Por privacidad, la página SOLO puede crear registros: la
   lectura se hace desde el panel de Supabase (Table Editor → pqr),
   donde el equipo los revisa y cambia el estado.
   Al enviar, el visitante recibe su número de radicado.
   ============================================================ */

(function () {
  var form = document.getElementById("pqr-form");
  if (!form) return;
  var msg = document.getElementById("pqr-msg");
  var BD = window.BD;

  function campo(id) { return document.getElementById(id).value.trim(); }

  form.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    if (!window.bdConfigurada()) {
      msg.textContent = "La base de datos aún no está configurada: falta conectar Supabase en backend/config.js.";
      return;
    }
    try {
      /* El radicado se genera aquí (un uuid) y viaja como el id del
         registro: así el visitante conoce su radicado sin que la
         página necesite permiso de lectura sobre la tabla pqr. */
      var radicadoId = (window.crypto && crypto.randomUUID)
        ? crypto.randomUUID()
        : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (ch) {
            var r = Math.random() * 16 | 0;
            return (ch === "x" ? r : (r & 0x3 | 0x8)).toString(16);
          });
      await BD.crear("pqr", {
        id: radicadoId,
        nombre: campo("pqr-nombre"),
        correo: campo("pqr-correo"),
        tipo: document.getElementById("pqr-tipo").value,
        asunto: campo("pqr-asunto"),
        mensaje: campo("pqr-mensaje")
      }, { sinRetorno: true });
      form.reset();
      msg.textContent = "¡Recibido! Tu número de radicado es " + radicadoId.slice(0, 8).toUpperCase() +
        ". Guárdalo: con él puedes preguntar por el estado de tu caso en el foro.";
    } catch (e) {
      msg.textContent = "No se pudo enviar. Revisa los datos e inténtalo de nuevo.";
    }
  });
})();
