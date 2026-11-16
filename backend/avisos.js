/* ============================================================
   NVISION — Avisos / novedades (backend)
   Muestra en la página principal los avisos de la tabla avisos,
   con el diseño de tarjetas de novedades del sitio. Los avisos
   se crean desde el panel de Supabase (Table Editor → avisos);
   la página solo los lee.
   ============================================================ */

(function () {
  var cont = document.getElementById("avisos");
  if (!cont) return;
  var BD = window.BD;

  if (!window.bdConfigurada()) {
    cont.innerHTML = "<p>Las novedades se activan cuando se conecte la base de datos en backend/config.js.</p>";
    return;
  }

  BD.listar("avisos", { orden: "created_at.desc", limite: 5 }).then(function (filas) {
    if (!filas.length) { cont.innerHTML = "<p>No hay avisos por ahora.</p>"; return; }
    cont.innerHTML = filas.map(function (a) {
      return '<article class="nov-card"><div class="nov-head"><span class="nov-tag">Aviso</span><span>' +
        BD.fechaCorta(a.created_at) + "</span></div><h2>" + BD.esc(a.titulo) + "</h2><p>" +
        BD.esc(a.contenido) + "</p></article>";
    }).join("");
  }).catch(function () {
    cont.innerHTML = "<p>No se pudieron cargar las novedades.</p>";
  });
})();
