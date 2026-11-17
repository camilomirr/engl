<?php
/* ============================================================
   NVISION — Controlador de comentarios (backend PHP + MySQL)
   ------------------------------------------------------------
   Cada página define $PAGINA_COMENTARIOS ('inicio', 'hardware',
   'redes' o 'mantenimiento') y luego incluye este archivo ANTES
   de imprimir cualquier HTML.

   CREAR:    si llegó un comentario nuevo lo guarda en MySQL.
   ELIMINAR: si llegó la orden de borrar, borra ese comentario.
   En ambos casos recarga la página (patrón Post/Redirect/Get)
   y deja la lista lista en $listaComentarios para la vista
   (includes/comentarios.php).
   ============================================================ */

require_once __DIR__ . '/../backend/bd.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = $_POST['accion'] ?? '';
    $volver = strtok($_SERVER['REQUEST_URI'], '?');

    // ----- CREAR: guardar el comentario nuevo -----
    if ($accion === 'comentar') {
        $nombre    = trim($_POST['nombre'] ?? '');
        $contenido = trim($_POST['contenido'] ?? '');
        // Validación en PHP: nombre y comentario son obligatorios.
        if (mb_strlen($nombre) >= 2 && mb_strlen($contenido) >= 2) {
            bd_comentario_crear($PAGINA_COMENTARIOS, $nombre, $contenido);
        }
        header('Location: ' . $volver . '#comentarios');
        exit;
    }

    // ----- ELIMINAR: borrar un comentario por su id -----
    if ($accion === 'eliminar_comentario') {
        $cid = (int)($_POST['comentario_id'] ?? 0);
        if ($cid > 0) {
            bd_comentario_eliminar($cid);
        }
        header('Location: ' . $volver . '#comentarios');
        exit;
    }
}

// ===== CONSULTAR: comentarios de esta página para la vista =====
$listaComentarios = bd_comentarios($PAGINA_COMENTARIOS);
