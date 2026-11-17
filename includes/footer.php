<?php
/* Pie de página compartido de NVISION.
   Además del pie, aquí se carga frontend/js/validaciones.js:
   como TODAS las páginas .php incluyen este archivo, así las
   validaciones de los formularios llegan a todas sin repetir
   la línea en cada página. */
?>
<footer class="site-footer">
    <nav class="footer-nav" aria-label="Enlaces del sitio">
      <a href="index.php">Inicio</a>
      <a href="hardware.php">Hardware</a>
      <a href="redes.php">Redes</a>
      <a href="mantenimiento.php">Mantenimiento</a>
      <a href="tienda.php">Tienda</a>
      <a href="foro.php">Foro</a>
      <a href="pqr.php">PQR</a>
    </nav>
    <p class="footer-contact">¿Dudas o sugerencias? Escríbenos desde la sección de <a href="pqr.php">PQR y contacto</a>.</p>
    <p>© 2026 - <span>NVISION</span></p>
  </footer>
  <!-- Validaciones de formularios del lado del navegador -->
  <script src="frontend/js/validaciones.js"></script>

