<?php
/* ============================================================
   NVISION — Funciones de la base de datos (backend PHP)
   ------------------------------------------------------------
   Aquí vive TODO el CRUD del proyecto: cada función hace UNA
   operación sobre UNA tabla de MySQL usando PDO y sentencias
   preparadas (los datos viajan aparte de la consulta, así nadie
   puede inyectar SQL desde un formulario).

     Productos:   bd_productos() · bd_producto()
                  bd_producto_crear() · bd_producto_actualizar()
                  bd_producto_eliminar()   ← el CRUD principal
     Avisos:      bd_avisos()
     Foro:        bd_foro_preguntas() · bd_foro_pregunta()
                  bd_foro_respuestas()
                  bd_foro_crear_pregunta()
                  bd_foro_actualizar_pregunta()
                  bd_foro_eliminar_pregunta()
                  bd_foro_crear_respuesta()
                  bd_foro_eliminar_respuesta()
     Comentarios: bd_comentarios() · bd_comentario_crear()
                  bd_comentario_eliminar()
     PQR:         bd_pqr_crear() · bd_pqr_consultar()

   Y dos ayudas para las vistas: e() escapa el texto del usuario
   antes de imprimirlo y fecha_corta() formatea las fechas.
   La conexión está en backend/conexion.php.
   ============================================================ */

require_once __DIR__ . '/conexion.php';

// ===== PRODUCTOS — EL CRUD PRINCIPAL (tienda.php) =====
/* CONSULTAR: lista todos los productos del inventario,
   ordenados por categoría y nombre. */
function bd_productos() {
    $pdo = conectar();
    $sql = 'SELECT id, nombre, categoria, descripcion, precio, cantidad, fecha
            FROM productos
            ORDER BY categoria ASC, nombre ASC';
    return $pdo->query($sql)->fetchAll();
}

/* CONSULTAR: trae UN producto por su id (para editarlo).
   Devuelve la fila o null si no existe. */
function bd_producto($id) {
    $pdo = conectar();
    $stmt = $pdo->prepare(
        'SELECT id, nombre, categoria, descripcion, precio, cantidad, fecha
         FROM productos
         WHERE id = ?'
    );
    $stmt->execute(array((int)$id));
    $fila = $stmt->fetch();
    return $fila === false ? null : $fila;
}

/* CREAR: registra un producto nuevo en el inventario
   y devuelve su id. */
function bd_producto_crear($nombre, $categoria, $descripcion, $precio, $cantidad) {
    $pdo = conectar();
    $stmt = $pdo->prepare(
        'INSERT INTO productos (nombre, categoria, descripcion, precio, cantidad)
         VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute(array($nombre, $categoria, $descripcion, (int)$precio, (int)$cantidad));
    return (int)$pdo->lastInsertId();
}

/* ACTUALIZAR: cambia los datos de un producto que ya existe
   (nombre, categoría, descripción, precio y stock). */
function bd_producto_actualizar($id, $nombre, $categoria, $descripcion, $precio, $cantidad) {
    $pdo = conectar();
    $stmt = $pdo->prepare(
        'UPDATE productos
         SET nombre = ?, categoria = ?, descripcion = ?, precio = ?, cantidad = ?
         WHERE id = ?'
    );
    return $stmt->execute(array($nombre, $categoria, $descripcion, (int)$precio, (int)$cantidad, (int)$id));
}

/* ELIMINAR: borra un producto del inventario por su id. */
function bd_producto_eliminar($id) {
    $pdo = conectar();
    $stmt = $pdo->prepare('DELETE FROM productos WHERE id = ?');
    return $stmt->execute(array((int)$id));
}

// ===== AVISOS (página principal) =====
/* Lista los avisos, del más reciente al más viejo. */
function bd_avisos() {
    $pdo = conectar();
    $sql = 'SELECT id, titulo, contenido, fecha
            FROM avisos
            ORDER BY fecha DESC
            LIMIT 5';
    return $pdo->query($sql)->fetchAll();
}

// ===== FORO — CONSULTAR =====
/* Lista las preguntas del foro con su conteo de respuestas
   (la columna «respuestas» sale del LEFT JOIN + COUNT). */
function bd_foro_preguntas() {
    $pdo = conectar();
    $sql = 'SELECT p.id, p.nombre, p.titulo, p.tema, p.contenido, p.fecha,
                   COUNT(r.id) AS respuestas
            FROM foro_preguntas p
            LEFT JOIN foro_respuestas r ON r.pregunta_id = p.id
            GROUP BY p.id
            ORDER BY p.fecha DESC
            LIMIT 50';
    return $pdo->query($sql)->fetchAll();
}

/* Trae UNA pregunta por su id (para el detalle y para editar).
   Devuelve la fila o null si no existe. */
function bd_foro_pregunta($id) {
    $pdo = conectar();
    $stmt = $pdo->prepare(
        'SELECT id, nombre, titulo, tema, contenido, fecha
         FROM foro_preguntas
         WHERE id = ?'
    );
    $stmt->execute(array((int)$id));
    $fila = $stmt->fetch();
    return $fila === false ? null : $fila;
}

/* Lista las respuestas de una pregunta, en orden de llegada. */
function bd_foro_respuestas($pregunta_id) {
    $pdo = conectar();
    $stmt = $pdo->prepare(
        'SELECT id, pregunta_id, nombre, contenido, fecha
         FROM foro_respuestas
         WHERE pregunta_id = ?
         ORDER BY fecha ASC
         LIMIT 200'
    );
    $stmt->execute(array((int)$pregunta_id));
    return $stmt->fetchAll();
}

// ===== FORO — CREAR =====
/* Guarda una pregunta nueva y devuelve su id. */
function bd_foro_crear_pregunta($nombre, $titulo, $tema, $contenido) {
    $pdo = conectar();
    $stmt = $pdo->prepare(
        'INSERT INTO foro_preguntas (nombre, titulo, tema, contenido)
         VALUES (?, ?, ?, ?)'
    );
    $stmt->execute(array($nombre, $titulo, $tema, $contenido));
    return (int)$pdo->lastInsertId();
}

/* Guarda una respuesta dentro de una pregunta. */
function bd_foro_crear_respuesta($pregunta_id, $nombre, $contenido) {
    $pdo = conectar();
    $stmt = $pdo->prepare(
        'INSERT INTO foro_respuestas (pregunta_id, nombre, contenido)
         VALUES (?, ?, ?)'
    );
    $stmt->execute(array((int)$pregunta_id, $nombre, $contenido));
    return (int)$pdo->lastInsertId();
}

// ===== FORO — ACTUALIZAR =====
/* Cambia el título, el tema y el contenido de una pregunta
   que ya existe (el autor y la fecha no se tocan). */
function bd_foro_actualizar_pregunta($id, $titulo, $tema, $contenido) {
    $pdo = conectar();
    $stmt = $pdo->prepare(
        'UPDATE foro_preguntas
         SET titulo = ?, tema = ?, contenido = ?
         WHERE id = ?'
    );
    return $stmt->execute(array($titulo, $tema, $contenido, (int)$id));
}

// ===== FORO — ELIMINAR =====
/* Borra una pregunta. Sus respuestas se borran solas porque
   la tabla foro_respuestas tiene la llave foránea con
   ON DELETE CASCADE (ver base-de-datos/nvision_mysql.sql). */
function bd_foro_eliminar_pregunta($id) {
    $pdo = conectar();
    $stmt = $pdo->prepare('DELETE FROM foro_preguntas WHERE id = ?');
    return $stmt->execute(array((int)$id));
}

/* Borra una sola respuesta del foro. */
function bd_foro_eliminar_respuesta($id) {
    $pdo = conectar();
    $stmt = $pdo->prepare('DELETE FROM foro_respuestas WHERE id = ?');
    return $stmt->execute(array((int)$id));
}

// ===== COMENTARIOS DE LAS PÁGINAS =====
/* Lista los comentarios de una página ('inicio', 'hardware',
   'redes' o 'mantenimiento'), del más reciente al más viejo. */
function bd_comentarios($pagina) {
    $pdo = conectar();
    $stmt = $pdo->prepare(
        'SELECT id, pagina, nombre, contenido, fecha
         FROM comentarios
         WHERE pagina = ?
         ORDER BY fecha DESC
         LIMIT 50'
    );
    $stmt->execute(array($pagina));
    return $stmt->fetchAll();
}

/* Guarda un comentario nuevo en una página. */
function bd_comentario_crear($pagina, $nombre, $contenido) {
    $pdo = conectar();
    $stmt = $pdo->prepare(
        'INSERT INTO comentarios (pagina, nombre, contenido)
         VALUES (?, ?, ?)'
    );
    $stmt->execute(array($pagina, $nombre, $contenido));
    return (int)$pdo->lastInsertId();
}

/* Borra un comentario por su id. */
function bd_comentario_eliminar($id) {
    $pdo = conectar();
    $stmt = $pdo->prepare('DELETE FROM comentarios WHERE id = ?');
    return $stmt->execute(array((int)$id));
}

// ===== PQR =====
/* Guarda una PQR y devuelve su radicado: 8 caracteres hex en
   mayúsculas (ej: «A3F9C1D2»). El radicado es ÚNICO en la tabla;
   si por mala suerte se repite uno, se genera otro (máximo 5
   intentos) antes de guardar. */
function bd_pqr_crear($nombre, $correo, $tipo, $mensaje) {
    $pdo = conectar();
    $stmt = $pdo->prepare(
        'INSERT INTO pqr (radicado, nombre, correo, tipo, mensaje)
         VALUES (?, ?, ?, ?, ?)'
    );
    for ($intento = 0; $intento < 5; $intento++) {
        $radicado = strtoupper(bin2hex(random_bytes(4)));
        try {
            $stmt->execute(array($radicado, $nombre, $correo, $tipo, $mensaje));
            return $radicado;
        } catch (PDOException $e) {
            // 23000 = el radicado ya existía: se intenta con otro.
            if ($e->getCode() !== '23000') {
                throw $e;
            }
        }
    }
    return null;
}

/* Busca una PQR por su radicado (para «Consultar mi PQR»).
   Devuelve la fila (tipo, estado, fecha…) o null si no existe. */
function bd_pqr_consultar($radicado) {
    $pdo = conectar();
    $stmt = $pdo->prepare(
        'SELECT id, radicado, nombre, correo, tipo, mensaje, estado, fecha
         FROM pqr
         WHERE radicado = ?'
    );
    $stmt->execute(array(strtoupper(trim((string)$radicado))));
    $fila = $stmt->fetch();
    return $fila === false ? null : $fila;
}

// ===== AYUDAS PARA LAS VISTAS =====
/* Escapa el texto del usuario antes de imprimirlo en el HTML
   (así un «<script>» escrito en un comentario se ve como texto
   y no se ejecuta). */
function e($texto) {
    return htmlspecialchars((string)($texto ?? ''), ENT_QUOTES, 'UTF-8');
}

/* 145000 → '$ 145.000' (precio en pesos colombianos). */
function precio_cop($precio) {
    return '$ ' . number_format((int)$precio, 0, ',', '.');
}

/* '2026-11-16 14:30:00' → '16 nov 2026' */
function fecha_corta($fecha) {
    $t = strtotime((string)$fecha);
    if ($t === false) return '';
    $meses = array(1 => 'ene', 'feb', 'mar', 'abr', 'may', 'jun',
                   'jul', 'ago', 'sep', 'oct', 'nov', 'dic');
    return date('j', $t) . ' ' . $meses[(int)date('n', $t)] . ' ' . date('Y', $t);
}
