<?php
/* Encabezado compartido de NVISION (se incluye en todas las páginas .php). */
?>
<header class="site-header">
    <div class="header-container">
      <!-- Marca / Nombre de la página -->
      <a href="index.php" class="brand-logo" aria-label="NVISION Home">
        <span class="brand-text">NVISION</span>
      </a>

      <!-- Navegación principal: en pantallas angostas la muestra y la esconde el botón hamburguesa vía interfaz.js -->
      <nav id="nav-menu" class="nav-menu">
        <ul class="nav-links">
          <!-- Catálogo 1: Aprende -->
          <li class="nav-item-dropdown">
            <button type="button" class="nav-dropdown-trigger" aria-expanded="false">
              <span>Aprende</span>
              <span class="nav-arrow mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
            </button>
            <!-- Submenú de Aprende: los tres módulos de contenido del sitio -->
            <ul class="nav-submenu">
              <li><a href="hardware.php">Hardware</a></li>
              <li><a href="redes.php">Redes</a></li>
              <li><a href="mantenimiento.php">Mantenimiento por software</a></li>
            </ul>
          </li>

          <!-- Tienda: el inventario de productos (CRUD principal) -->
          <li>
            <a href="tienda.php"><span>Tienda</span></a>
          </li>

          <!-- Catálogo 2: Comunidad -->
          <li class="nav-item-dropdown">
            <button type="button" class="nav-dropdown-trigger" aria-expanded="false">
              <span>Comunidad</span>
              <span class="nav-arrow mono-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
            </button>
            <!-- Submenú de Comunidad: el foro de la comunidad -->
            <ul class="nav-submenu">
              <li><a href="foro.php">Foro El Taller</a></li>
            </ul>
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
