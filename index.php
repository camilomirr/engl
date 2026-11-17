<?php
/* ============================================================
   NVISION — Entrada del proyecto
   ------------------------------------------------------------
   El proyecto es la TIENDA (sistema de inventario con su
   carrito de compras): no hay portada aparte, así que la
   raíz del sitio manda directo a la vitrina. Así, al abrir
   http://localhost/nvision/ se llega a la tienda sin clics.
   ============================================================ */
// Redirección del servidor a la página de la tienda.
header('Location: tienda.php');
// Después de redirigir no se ejecuta nada más.
exit;
