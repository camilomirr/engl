<?php
/* ============================================================
   NVISION — Controlador de comentarios (backend PHP)
   Cada página define $PAGINA_COMENTARIOS ('inicio', 'hardware',
   'redes' o 'mantenimiento') y luego incluye este archivo ANTES
   de imprimir cualquier HTML: si llegó un comentario nuevo lo
   guarda y recarga la página (patrón Post/Redirect/Get), y deja
   la lista lista en $listaComentarios para la vista.
   ============================================================ */

require_once __DIR__ . '/../backend/bd.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['accion'] ?? '') === 'comentar') {
    bd_crear('comentarios', array(
        'pagina'  => $PAGINA_COMENTARIOS,
        'nombre'  => trim($_POST['nombre'] ?? ''),
        'mensaje' => trim($_POST['mensaje'] ?? '')
    ));
    $volver = strtok($_SERVER['REQUEST_URI'], '?');
    header('Location: ' . $volver . '#comentarios');
    exit;
}

$listaComentarios = bd_listar('comentarios', array(
    'orden' => 'created_at.desc',
    'limite' => 50,
    'igual' => array('pagina' => $PAGINA_COMENTARIOS)
));
