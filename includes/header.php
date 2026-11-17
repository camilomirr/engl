<?php
/* Encabezado compartido de NVISION (se incluye en todas las páginas .php). */
?>
<header class="site-header">
    <div class="header-container">
      <!-- Marca / Nombre de la tienda: lleva a la vitrina -->
      <a href="tienda.php" class="brand-logo" aria-label="NVISION Home">
        <span class="brand-text">NVISION</span>
      </a>

      <!-- Navegación principal: en pantallas angostas la muestra y la esconde el botón hamburguesa vía interfaz.js.
           El proyecto es SOLO la tienda: los únicos destinos son la vitrina y el carrito. -->
      <nav id="nav-menu" class="nav-menu">
        <ul class="nav-links">
          <!-- Tienda: la vitrina con el inventario (CRUD principal) -->
          <li>
            <a href="tienda.php"><span>Tienda</span></a>
          </li>

          <!-- Carrito: la compra que el visitante lleva armada -->
          <li>
            <a href="carrito.php"><span>Carrito</span></a>
          </li>
        </ul>
      </nav>

      <div>
        <!-- Botón de tres rayitas (Hamburguesa) para celulares -->
        <button id="menu-toggle" class="menu-toggle-btn" aria-label="Abrir menú" aria-expanded="false">
          <span class="menu-icon-inner mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></span>
        </button>
      </div>
    </div>
  </header>
