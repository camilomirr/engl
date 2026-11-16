/* ============================================================
   NVISION — Cliente mínimo de Supabase (backend)
   Habla con la base de datos por la API REST de Supabase usando
   fetch, sin librerías externas. Solo dos operaciones:
     BD.listar(tabla, opciones)  → leer filas
     BD.crear(tabla, fila)       → insertar una fila y devolverla
   ============================================================ */

(function () {
  function cabeceras() {
    var c = window.NVISION_CONFIG;
    return {
      "apikey": c.SUPABASE_ANON_KEY,
      "Authorization": "Bearer " + c.SUPABASE_ANON_KEY,
      "Content-Type": "application/json"
    };
  }

  async function listar(tabla, opciones) {
    opciones = opciones || {};
    var c = window.NVISION_CONFIG;
    var params = new URLSearchParams();
    params.set("select", opciones.select || "*");
    if (opciones.orden) params.set("order", opciones.orden);
    if (opciones.limite) params.set("limit", String(opciones.limite));
    if (opciones.igual) {
      Object.keys(opciones.igual).forEach(function (col) {
        params.set(col, "eq." + opciones.igual[col]);
      });
    }
    var r = await fetch(c.SUPABASE_URL + "/rest/v1/" + tabla + "?" + params.toString(), {
      headers: cabeceras()
    });
    if (!r.ok) throw new Error("Error al leer " + tabla + " (" + r.status + ")");
    return r.json();
  }

  async function crear(tabla, fila, opciones) {
    opciones = opciones || {};
    var c = window.NVISION_CONFIG;
    var headers = cabeceras();
    /* Sin retorno: para tablas privadas como pqr, donde la página puede
       crear pero NO leer. Pedir la fila de vuelta fallaría por seguridad. */
    if (!opciones.sinRetorno) headers["Prefer"] = "return=representation";
    var r = await fetch(c.SUPABASE_URL + "/rest/v1/" + tabla, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(fila)
    });
    if (!r.ok) throw new Error("Error al guardar en " + tabla + " (" + r.status + ")");
    if (opciones.sinRetorno) return fila;
    var datos = await r.json();
    return datos[0];
  }

  /* Escapa texto del usuario antes de meterlo en el HTML. */
  function esc(texto) {
    return String(texto == null ? "" : texto)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function fechaCorta(iso) {
    try {
      return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
    } catch (e) { return ""; }
  }

  window.BD = { listar: listar, crear: crear, esc: esc, fechaCorta: fechaCorta };
})();
