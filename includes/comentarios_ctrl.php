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

// Se cargan las funciones bd_* (bd_comentarios, bd_comentario_crear…)
// que son las que hablan con la tabla «comentarios» de MySQL.
require_once __DIR__ . '/../backend/bd.php';

// Todo lo que llegue por POST es una orden de crear o de eliminar.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // El campo oculto «accion» del formulario dice qué se pidió.
    $accion = $_POST['accion'] ?? '';
    // Dirección de esta misma página sin los parámetros de la URL:
    // es a donde se regresa después de guardar o borrar.
    $volver = strtok($_SERVER['REQUEST_URI'], '?');

    // ----- CREAR: guardar el comentario nuevo -----
    if ($accion === 'comentar') {
        // Se lee el nombre tal como lo escribió la persona, sin
        // espacios sobrantes al principio ni al final.
        $nombre    = trim($_POST['nombre'] ?? '');
        // Lo mismo con el texto del comentario que se va a guardar.
        $contenido = trim($_POST['contenido'] ?? '');
        // Validación en PHP: nombre y comentario son obligatorios.
        // Con menos de 2 caracteres no se guarda nada.
        if (mb_strlen($nombre) >= 2 && mb_strlen($contenido) >= 2) {
            // Se inserta la fila en «comentarios» amarrada a esta
            // página ($PAGINA_COMENTARIOS la fijó cada página antes).
            bd_comentario_crear($PAGINA_COMENTARIOS, $nombre, $contenido);
        }
        // Recarga limpia de la página (Post/Redirect/Get) cayendo
        // justo en la sección de comentarios, ya con el nuevo visible.
        header('Location: ' . $volver . '#comentarios');
        // Se corta aquí: después de un header de redirección no
        // debe seguir corriendo código de esta petición.
        exit;
    }

    // ----- ELIMINAR: borrar un comentario por su id -----
    if ($accion === 'eliminar_comentario') {
        // El id viene en un campo oculto de la tarjeta del comentario
        // y se pasa a entero: si traía otra cosa, queda en 0 y no se borra.
        $cid = (int)($_POST['comentario_id'] ?? 0);
        // Solo se manda a borrar cuando el id es un número válido.
        if ($cid > 0) {
            bd_comentario_eliminar($cid);
        }
        // Se vuelve a la misma página y a la misma sección, ya sin
        // el comentario que se acaba de eliminar.
        header('Location: ' . $volver . '#comentarios');
        exit;
    }
}

// ===== CONSULTAR: comentarios de esta página para la vista =====
// Se consultan solo los comentarios de ESTA página (la columna
// «pagina» de la tabla) y la vista los recorre con un foreach.
$listaComentarios = bd_comentarios($PAGINA_COMENTARIOS);
