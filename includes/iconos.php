<?php
/* ============================================================
   NVISION — Símbolos SVG de la tienda
   ------------------------------------------------------------
   La tienda NO usa emojis: cada símbolo es un dibujo SVG de
   trazo (líneas) hecho a mano para este proyecto, en el mismo
   estilo de íconos de línea del resto del diseño. Ventajas:
   se ve igual en todos los navegadores y sistemas (un emoji
   cambia de cara según el teléfono), hereda el color del
   texto con currentColor y combina con claro y oscuro.

   Lo usan tienda.php y carrito.php:
     icono_svg('carrito')      → un símbolo suelto por nombre.
     icono_producto($producto) → el símbolo que le toca a un
                                 producto sin foto: primero por
                                 su archivo de imagen y, si no
                                 calza, por su categoría.
   ============================================================ */

/* Devuelve el SVG (como texto) del símbolo pedido.
   $clase permite ajustar el tamaño desde el CSS según dónde
   se pinte: «icono-btn» dentro de botones, «icono-svg» suelto. */
function icono_svg($nombre, $clase = 'icono-svg') {
    // El dibujo interno de cada símbolo: trazos dentro de una
    // cuadrícula de 24×24, sin relleno (solo contorno).
    $dibujos = array(
        // Carrito de compras: canasta con manija y dos ruedas.
        'carrito' => '<path d="M2.5 4h2.2l2.3 11.1a1.6 1.6 0 0 0 1.57 1.28h7.85a1.6 1.6 0 0 0 1.56-1.28L20.5 8H6.1"/><circle cx="10.2" cy="20.4" r="1.35"/><circle cx="17.6" cy="20.4" r="1.35"/>',
        // Memoria RAM: tarjeta con su chip y los pines de abajo.
        'ram' => '<rect x="3" y="8" width="18" height="7.5" rx="1"/><rect x="10" y="10.7" width="4" height="2.2" rx="0.5"/><path d="M6.5 15.5V19M10.5 15.5V19M14.5 15.5V19M18 15.5V19"/>',
        // Disco SSD: caja con dos líneas de datos grabadas.
        'ssd' => '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M6.5 10h7M6.5 14h4"/>',
        // Disco duro: caja con el plato circular y su brazo.
        'disco' => '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9.5" cy="12" r="3.2"/><path d="M9.5 12L16 7.5"/><circle cx="9.5" cy="12" r="0.7" fill="currentColor" stroke="none"/>',
        // Mouse: cuerpo redondeado con la ruedita marcada.
        'mouse' => '<rect x="8" y="2.8" width="8" height="18.4" rx="4"/><path d="M12 6.5v3.5"/>',
        // Teclado: rectángulo con filas de teclas y barra espaciadora.
        'teclado' => '<rect x="2.6" y="7" width="18.8" height="10" rx="1.8"/><path d="M6 10.6h.9M10 10.6h.9M14 10.6h.9M17.6 10.6h.4M6 13.8h.9M17.1 13.8h.9M9.5 13.8h5"/>',
        // Router: caja con dos antenas y sus puntos de señal.
        'router' => '<rect x="3" y="13.5" width="18" height="6.5" rx="1.6"/><path d="M7.5 13.5V7M16.5 13.5V7"/><circle cx="7.5" cy="5.2" r="0.9" fill="currentColor" stroke="none"/><circle cx="16.5" cy="5.2" r="0.9" fill="currentColor" stroke="none"/><path d="M6.8 16.8h.9M10.4 16.8h.9"/>',
        // Enchufe: clavija con sus dos patas y el cable saliendo.
        'cable' => '<path d="M9 3.5V8M15 3.5V8"/><path d="M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0Z"/><path d="M12 17v2.2a1.8 1.8 0 0 0 1.8 1.8h1.7"/>',
        // Monitor: pantalla con su pie y su base.
        'monitor' => '<rect x="3" y="4" width="18" height="12" rx="1.6"/><path d="M12 16v3.4M8.5 20.5h7"/>',
        // Diadema: arco superior, dos copas y el micrófono.
        'diadema' => '<path d="M4 16.5v-3.2a8 8 0 0 1 16 0v3.2"/><rect x="3" y="14.8" width="4.4" height="6.2" rx="1.8"/><rect x="16.6" y="14.8" width="4.4" height="6.2" rx="1.8"/><path d="M20 20.8c-.6.8-1.7 1.2-3 1.2h-2.4"/>',
        // Fuente de poder: caja con el ventilador circular.
        'fuente' => '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3.6"/><circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none"/><path d="M12 8.4v2M15.1 13.8l-1.7-1M8.9 13.8l1.7-1"/>',
        // Procesador (respaldo de Componentes): chip con pines.
        'cpu' => '<rect x="7" y="7" width="10" height="10" rx="1.6"/><rect x="10.4" y="10.4" width="3.2" height="3.2" rx="0.6"/><path d="M10 7V4.2M14 7V4.2M10 19.8V17M14 19.8V17M7 10H4.2M7 14H4.2M19.8 10H17M19.8 14H17"/>',
        // Señal wifi (respaldo de Redes): arcos y punto central.
        'wifi' => '<path d="M4.5 10.5a11 11 0 0 1 15 0M7.2 13.8a6.8 6.8 0 0 1 9.6 0M9.9 17a2.9 2.9 0 0 1 4.2 0"/><circle cx="12" cy="19.6" r="0.9" fill="currentColor" stroke="none"/>',
        // Caja de producto (respaldo genérico): caja cerrada en 3D.
        'caja' => '<path d="M3.2 7.8 12 3.4l8.8 4.4v8.4L12 20.6l-8.8-4.4Z"/><path d="M3.2 7.8 12 12.2l8.8-4.4M12 12.2v8.4"/>',
        // Bolsa de compras: para el estado de carrito vacío.
        'bolsa' => '<path d="M5.5 8h13l-1 12.2a1.8 1.8 0 0 1-1.8 1.6H8.3a1.8 1.8 0 0 1-1.8-1.6Z"/><path d="M8.8 10.5V6.8a3.2 3.2 0 0 1 6.4 0v3.7"/>',
        // Listo: círculo con la marca de verificación (compra OK).
        'check' => '<circle cx="12" cy="12" r="8.6"/><path d="M8.4 12.4l2.5 2.5 4.8-5.4"/>',
        // Papelera: el botón de quitar un ítem del carrito.
        'basura' => '<path d="M4.5 6h15M9.5 6V4.4a.9.9 0 0 1 .9-.9h3.2a.9.9 0 0 1 .9.9V6M6.5 6l.8 12.2a1.8 1.8 0 0 0 1.8 1.8h5.8a1.8 1.8 0 0 0 1.8-1.8L17.5 6M10 10.5v5.5M14 10.5v5.5"/>'
    );
    // Nombre desconocido: se cae a la caja genérica.
    $cuerpo = $dibujos[$nombre] ?? $dibujos['caja'];
    // La etiqueta svg común: trazo del color del texto (currentColor),
    // grosor parejo y puntas redondeadas; aria-hidden porque el
    // símbolo es decorativo y el texto de al lado ya dice qué es.
    return '<svg class="' . $clase . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' . $cuerpo . '</svg>';
}

/* El símbolo que representa a un producto SIN foto: se elige
   por el nombre de su archivo de imagen (los productos semilla)
   y, si no calza, por su categoría. */
function icono_producto($prod) {
    // Mapa archivo de foto => nombre del símbolo que lo dibuja.
    $porImagen = array(
        'ram.jpg'     => 'ram',
        'ssd.jpg'     => 'ssd',
        'mouse.jpg'   => 'mouse',
        'teclado.jpg' => 'teclado',
        'router.jpg'  => 'router',
        'cable.jpg'   => 'cable',
        'monitor.jpg' => 'monitor',
        'diadema.jpg' => 'diadema',
        'disco.jpg'   => 'disco',
        'fuente.jpg'  => 'fuente'
    );
    // basename() deja solo el nombre del archivo de la ruta.
    $archivo = basename((string)($prod['imagen'] ?? ''));
    // Si ese archivo tiene símbolo asignado, ese se usa.
    if (isset($porImagen[$archivo])) {
        return icono_svg($porImagen[$archivo]);
    }
    // Sin imagen conocida: un símbolo por categoría.
    $porCategoria = array(
        'Componentes' => 'cpu',
        'Periféricos' => 'mouse',
        'Redes'       => 'wifi',
        'Accesorios'  => 'cable'
    );
    // Y si ni la categoría calza, la caja de producto genérica.
    return icono_svg($porCategoria[$prod['categoria']] ?? 'caja');
}
