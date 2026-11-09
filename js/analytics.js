/* NVISION - Analítica (preparada, desactivada por defecto)
   ---------------------------------------------------------
   Hoy no envía nada a ningún servidor: solo cuenta las visitas
   de ESTE dispositivo en localStorage (para verlas, en la
   consola del navegador: JSON.parse(localStorage.getItem(
   "nvision_stats") || "{}")).

   PARA ACTIVAR GOOGLE ANALYTICS (GA4):
   1. Crea la propiedad en analytics.google.com y copia el ID
      de medición (formato G-XXXXXXXXXX).
   2. Pégalo aquí abajo en GA4_ID.
   3. En TODAS las páginas, la política de seguridad (CSP) debe
      permitir el dominio www.googletagmanager.com en
      script-src y www.google-analytics.com en connect-src.
   Se respeta "Do Not Track": si el navegador lo activa, no
   se carga ninguna analítica externa. */
(function () {
  var GA4_ID = ""; // ← pega aquí el ID de GA4 para activar

  try {
    var stats = JSON.parse(localStorage.getItem("nvision_stats") || "{}");
    var page = location.pathname || "/";
    stats[page] = (stats[page] || 0) + 1;
    stats.__total = (stats.__total || 0) + 1;
    stats.__last = new Date().toISOString();
    localStorage.setItem("nvision_stats", JSON.stringify(stats));
  } catch (e) {}

  if (!GA4_ID) return;
  if (navigator.doNotTrack === "1") return;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA4_ID, { anonymize_ip: true });
})();
