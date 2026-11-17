/* ============================================================
   NVISION — Interfaz (frontend)
   El comportamiento visual del diseño original: menú móvil,
   submenús del encabezado y la barra de progreso superior.
   Nada de cuentas, traductor ni chatbot: la página es directa.
   ============================================================ */

// Todo el archivo va dentro de una función que se ejecuta sola:
// así sus variables no quedan sueltas en la página.
(function () {
  /* Barra de progreso superior (carga + scroll), como en el diseño original */
  // Se crea el contenedor de la barrita que va pegada arriba.
  var barra = document.createElement("div");
  // Esa clase es la que el CSS usa para fijarla en el borde superior.
  barra.className = "scroll-progress";
  // El relleno es la parte que sí se va estirando con el scroll.
  var relleno = document.createElement("div");
  // Su clase le da el color y la animación del CSS.
  relleno.className = "scroll-progress-fill";
  // Al cargar la página la barra arranca vacía, en 0 %.
  relleno.style.width = "0%";
  // El relleno queda dentro del contenedor.
  barra.appendChild(relleno);
  // Y el contenedor se agrega al final del body para que exista en el DOM.
  document.body.appendChild(barra);
  // Recalcula cuánto de la página ya se recorrió, en porcentaje.
  function progreso() {
    // Alto total desplazable: lo que mide el documento menos la ventana.
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    // Si la página no tiene scroll, el porcentaje queda en 0 (sin dividir por cero).
    var pct = alto > 0 ? (window.scrollY / alto) * 100 : 0;
    // Se aplica el porcentaje como ancho del relleno.
    relleno.style.width = pct + "%";
  }
  // Cada vez que el usuario baja o sube, se actualiza la barra;
  // passive: true le dice al navegador que no bloquee el scroll.
  window.addEventListener("scroll", progreso, { passive: true });
  // Una primera medición al cargar, por si la página abre ya corrida.
  progreso();

  /* Menú móvil */
  // Se busca la navegación principal del encabezado compartido.
  var nav = document.getElementById("nav-menu");
  // Y el botón de las tres rayitas que solo se ve en pantallas angostas.
  var toggle = document.getElementById("menu-toggle");
  // Si la página no trae alguno de los dos, este bloque no hace nada.
  if (nav && toggle) {
    // Al tocar el botón hamburguesa…
    toggle.addEventListener("click", function () {
      // …se pone o se quita la clase is-active, que es la que
      // muestra el menú en el CSS; toggle devuelve si quedó puesta.
      var abierto = nav.classList.toggle("is-active");
      // Se avisa a lectores de pantalla si el menú quedó abierto o cerrado.
      toggle.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
  }

  /* Submenús: en escritorio abren al pasar el mouse (CSS);
     con clic/táctil se alternan con la clase is-open. */
  // La lista de enlaces del menú: se marca cuando hay un submenú abierto.
  var links = document.querySelector(".nav-links");
  // Se recorre cada ítem con submenú («Aprende» y «Comunidad»).
  document.querySelectorAll(".nav-item-dropdown").forEach(function (item) {
    // Dentro del ítem, el botón que dispara el submenú.
    var btn = item.querySelector(".nav-dropdown-trigger");
    // Un ítem sin botón no tiene nada que conectar y se salta.
    if (!btn) return;
    // Al hacer clic en «Aprende» o «Comunidad»…
    btn.addEventListener("click", function (ev) {
      // …el clic no sigue subiendo al documento, porque el
      // documento lo interpretaría como «clic afuera» y cerraría todo.
      ev.stopPropagation();
      // Se anota si ESTE submenú ya estaba abierto antes del clic.
      var abierto = item.classList.contains("is-open");
      // Primero se cierran todos los submenús que estén abiertos:
      // en el menú solo puede haber uno desplegado a la vez.
      document.querySelectorAll(".nav-item-dropdown.is-open").forEach(function (o) {
        o.classList.remove("is-open");
        var b = o.querySelector(".nav-dropdown-trigger");
        // Su botón también vuelve a aria-expanded en false.
        if (b) b.setAttribute("aria-expanded", "false");
      });
      // Si el clicado estaba cerrado, ahora sí se abre; si ya
      // estaba abierto, el cierre de arriba ya lo dejó cerrado.
      if (!abierto) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
      // La lista principal refleja si quedó algún submenú abierto.
      if (links) links.classList.toggle("submenu-active", !!document.querySelector(".nav-item-dropdown.is-open"));
    });
  });
  // Un clic en cualquier otra parte de la página cierra los submenús.
  document.addEventListener("click", function () {
    document.querySelectorAll(".nav-item-dropdown.is-open").forEach(function (o) {
      o.classList.remove("is-open");
    });
    // Y se quita la marca de «hay submenú abierto» de la lista.
    if (links) links.classList.remove("submenu-active");
  });

  /* Botones «Ver imagen e info» (componentes) y de historia:
     despliegan la caja con la foto y el texto largo de cada
     tarjeta de hardware.php. El HTML y el CSS ya existían (la
     caja nace con el atributo hidden y la flecha gira cuando el
     botón queda en aria-expanded=true), pero faltaba este clic. */
  // Se conectan los dos tipos de botón desplegable del sitio.
  document.querySelectorAll(".btn-component-expand, .btn-expand-history").forEach(function (boton) {
    // Al hacer clic en el botón de una tarjeta…
    boton.addEventListener("click", function () {
      // …se busca la caja que le toca: su id viene en data-target
      // y, en algunos botones de historia, en aria-controls.
      var idCaja = boton.getAttribute("data-target") || boton.getAttribute("aria-controls");
      // Sin id no hay caja que desplegar: no se hace nada.
      if (!idCaja) return;
      // La caja pareja del botón, identificada por ese id.
      var caja = document.getElementById(idCaja);
      // Si la caja no está en la página, tampoco hay nada que hacer.
      if (!caja) return;
      // Se anota si la caja estaba escondida antes del clic.
      var estabaOculta = caja.hidden;
      // Se invierte: escondida se muestra, visible se esconde.
      caja.hidden = !estabaOculta;
      // aria-expanded refleja el nuevo estado (true si se abrió)
      // y con ese atributo el CSS gira la flecha del botón.
      boton.setAttribute("aria-expanded", estabaOculta ? "true" : "false");
    });
  });
})();
