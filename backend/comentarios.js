/* ============================================================
   NVISION — Comentarios por página (backend)
   Cada página tiene un bloque <section id="comentarios"
   data-pagina="hardware"> (etc.). Los comentarios se guardan en
   la tabla comentarios con el nombre de la página, así cada
   tema tiene sus propios comentarios.
   ============================================================ */

(function () {
  var seccion = document.getElementById("comentarios");
  if (!seccion) return;
  var pagina = seccion.getAttribute("data-pagina") || "inicio";
  var lista = seccion.querySelector(".comentarios-lista");
  var form = seccion.querySelector(".comentarios-form");
  var BD = window.BD;

  if (!window.bdConfigurada()) {
    lista.innerHTML = "<p>Los comentarios se activan cuando se conecte la base de datos en backend/config.js.</p>";
    if (form) form.style.display = "none";
    return;
  }

  async function cargar() {
    try {
      var filas = await BD.listar("comentarios", {
        orden: "created_at.desc", limite: 50, igual: { pagina: pagina }
      });
      if (!filas.length) {
        lista.innerHTML = "<p>Sé la primera persona en comentar esta página.</p>";
        return;
      }
      lista.innerHTML = filas.map(function (c) {
        return '<article class="foro-item"><h3 class="foro-q-title">' + BD.esc(c.nombre) + "</h3>" +
          '<p class="foro-meta">' + BD.fechaCorta(c.created_at) + "</p><p>" + BD.esc(c.mensaje) + "</p></article>";
      }).join("");
    } catch (e) {
      lista.innerHTML = "<p>No se pudieron cargar los comentarios.</p>";
    }
  }

  if (form) form.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    var datos = new FormData(form);
    try {
      await BD.crear("comentarios", {
        pagina: pagina,
        nombre: String(datos.get("nombre") || "").trim(),
        mensaje: String(datos.get("mensaje") || "").trim()
      });
      form.reset();
      cargar();
    } catch (e) { alert("No se pudo publicar el comentario."); }
  });

  cargar();
})();
