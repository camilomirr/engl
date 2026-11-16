/* ============================================================
   NVISION — Interfaz (frontend)
   El comportamiento visual del diseño original: menú móvil,
   submenús del encabezado y la barra de progreso superior.
   Nada de cuentas, traductor ni chatbot: la página es directa.
   ============================================================ */

(function () {
  /* Barra de progreso superior (carga + scroll), como en el diseño original */
  var barra = document.createElement("div");
  barra.className = "scroll-progress";
  var relleno = document.createElement("div");
  relleno.className = "scroll-progress-fill";
  relleno.style.width = "0%";
  barra.appendChild(relleno);
  document.body.appendChild(barra);
  function progreso() {
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    var pct = alto > 0 ? (window.scrollY / alto) * 100 : 0;
    relleno.style.width = pct + "%";
  }
  window.addEventListener("scroll", progreso, { passive: true });
  progreso();

  /* Menú móvil */
  var nav = document.getElementById("nav-menu");
  var toggle = document.getElementById("menu-toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var abierto = nav.classList.toggle("is-active");
      toggle.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
  }

  /* Submenús: en escritorio abren al pasar el mouse (CSS);
     con clic/táctil se alternan con la clase is-open. */
  var links = document.querySelector(".nav-links");
  document.querySelectorAll(".nav-item-dropdown").forEach(function (item) {
    var btn = item.querySelector(".nav-dropdown-trigger");
    if (!btn) return;
    btn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      var abierto = item.classList.contains("is-open");
      document.querySelectorAll(".nav-item-dropdown.is-open").forEach(function (o) {
        o.classList.remove("is-open");
        var b = o.querySelector(".nav-dropdown-trigger");
        if (b) b.setAttribute("aria-expanded", "false");
      });
      if (!abierto) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
      if (links) links.classList.toggle("submenu-active", !!document.querySelector(".nav-item-dropdown.is-open"));
    });
  });
  document.addEventListener("click", function () {
    document.querySelectorAll(".nav-item-dropdown.is-open").forEach(function (o) {
      o.classList.remove("is-open");
    });
    if (links) links.classList.remove("submenu-active");
  });
})();
