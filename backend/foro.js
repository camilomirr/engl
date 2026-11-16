/* ============================================================
   NVISION — Foro «El Taller» (backend)
   Usa el diseño original del foro: lista de preguntas, vista de
   detalle con respuestas y formulario para publicar. Los datos
   viven en foro_preguntas y foro_respuestas de Supabase.
   Sin cuentas: quien publica escribe su nombre y ya.
   ============================================================ */

(function () {
  var lista = document.getElementById("foro-list");
  if (!lista) return;
  var BD = window.BD;
  var form = document.getElementById("foro-form");
  var msg = document.getElementById("foro-msg");
  var detalle = document.getElementById("foro-detail");
  var detalleBody = document.getElementById("foro-detail-body");
  var respuestasBox = document.getElementById("foro-answers");
  var answerForm = document.getElementById("foro-answer-form");
  var actual = null; // pregunta abierta en el detalle

  if (!window.bdConfigurada()) {
    var off = document.getElementById("foro-off");
    if (off) {
      off.hidden = false;
      off.querySelector(".mejora-msg").textContent =
        "El foro todavía no está activado: falta conectar la base de datos en backend/config.js.";
    }
    lista.innerHTML = "";
    return;
  }

  async function cargarLista() {
    lista.innerHTML = "<p>Cargando preguntas…</p>";
    try {
      var preguntas = await BD.listar("foro_preguntas", { orden: "created_at.desc", limite: 50 });
      var respuestas = await BD.listar("foro_respuestas", { orden: "created_at.asc", limite: 500, select: "id,pregunta_id" });
      var conteo = {};
      respuestas.forEach(function (r) { conteo[r.pregunta_id] = (conteo[r.pregunta_id] || 0) + 1; });
      if (!preguntas.length) {
        lista.innerHTML = "<p>Todavía no hay preguntas. ¡Publica la primera!</p>";
        return;
      }
      lista.innerHTML = "";
      preguntas.forEach(function (p) {
        var item = document.createElement("article");
        item.className = "foro-item";
        item.innerHTML =
          '<span class="foro-tag mejora-chip">' + BD.esc(p.etiqueta || "Otro") + "</span>" +
          '<h3 class="foro-q-title">' + BD.esc(p.titulo) + "</h3>" +
          '<p class="foro-meta">por ' + BD.esc(p.nombre) + " · " + BD.fechaCorta(p.created_at) +
          " · " + (conteo[p.id] || 0) + " respuestas</p>";
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tool-btn tool-btn-ghost";
        btn.textContent = "Ver y responder";
        btn.addEventListener("click", function () { abrirDetalle(p); });
        item.appendChild(btn);
        lista.appendChild(item);
      });
    } catch (e) {
      lista.innerHTML = "<p>No se pudo cargar el foro. Revisa la conexión e inténtalo de nuevo.</p>";
    }
  }

  async function abrirDetalle(p) {
    actual = p;
    detalle.hidden = false;
    detalleBody.innerHTML =
      '<span class="foro-tag mejora-chip">' + BD.esc(p.etiqueta || "Otro") + "</span>" +
      "<h2>" + BD.esc(p.titulo) + "</h2>" +
      '<p class="foro-meta">por ' + BD.esc(p.nombre) + " · " + BD.fechaCorta(p.created_at) + "</p>" +
      "<p>" + BD.esc(p.mensaje) + "</p>";
    respuestasBox.innerHTML = "<p>Cargando respuestas…</p>";
    detalle.scrollIntoView({ behavior: "smooth", block: "start" });
    try {
      var rs = await BD.listar("foro_respuestas", {
        orden: "created_at.asc", limite: 200, igual: { pregunta_id: p.id }
      });
      if (!rs.length) {
        respuestasBox.innerHTML = "<p>Sin respuestas todavía. ¡Sé la primera persona en ayudar!</p>";
        return;
      }
      respuestasBox.innerHTML = rs.map(function (r) {
        return '<div class="foro-answer"><p class="foro-meta">' + BD.esc(r.nombre) + " · " +
          BD.fechaCorta(r.created_at) + "</p><p>" + BD.esc(r.mensaje) + "</p></div>";
      }).join("");
    } catch (e) {
      respuestasBox.innerHTML = "<p>No se pudieron cargar las respuestas.</p>";
    }
  }

  var back = document.getElementById("foro-back");
  if (back) back.addEventListener("click", function () {
    detalle.hidden = true;
    actual = null;
    cargarLista();
  });

  if (answerForm) answerForm.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    if (!actual) return;
    var nombre = document.getElementById("foro-answer-nombre").value.trim();
    var texto = document.getElementById("foro-answer-text").value.trim();
    if (!nombre || !texto) return;
    try {
      await BD.crear("foro_respuestas", { pregunta_id: actual.id, nombre: nombre, mensaje: texto });
      answerForm.reset();
      abrirDetalle(actual);
    } catch (e) { alert("No se pudo enviar la respuesta."); }
  });

  if (form) form.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    try {
      await BD.crear("foro_preguntas", {
        nombre: document.getElementById("foro-nombre").value.trim(),
        titulo: document.getElementById("foro-titulo").value.trim(),
        etiqueta: document.getElementById("foro-etiqueta").value,
        mensaje: document.getElementById("foro-cuerpo").value.trim()
      });
      form.reset();
      if (msg) msg.textContent = "¡Pregunta publicada! Ya aparece en la lista de abajo.";
      cargarLista();
    } catch (e) {
      if (msg) msg.textContent = "No se pudo publicar. Revisa los datos e inténtalo de nuevo.";
    }
  });

  cargarLista();
})();
