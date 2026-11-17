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

// Sin este archivo ninguna función tendría cómo conectarse:
// conectar() vive en backend/conexion.php.
require_once __DIR__ . '/conexion.php';

// ===== PRODUCTOS — EL CRUD PRINCIPAL (tienda.php) =====
/* CONSULTAR: lista todos los productos del inventario,
   ordenados por categoría y nombre. */
function bd_productos() {
    // Se pide la conexión que quedó configurada en conexion.php.
    $pdo = conectar();
    // Solo se traen las columnas que el catálogo de tienda.php
    // muestra; el orden es por categoría y, dentro de ella, por nombre.
    $sql = 'SELECT id, nombre, categoria, descripcion, precio, cantidad, fecha
            FROM productos
            ORDER BY categoria ASC, nombre ASC';
    // Como la consulta no lleva ningún dato del visitante, puede
    // ejecutarse directa y se devuelven todas las filas de una vez.
    return $pdo->query($sql)->fetchAll();
}

/* CONSULTAR: trae UN producto por su id (para editarlo).
   Devuelve la fila o null si no existe. */
function bd_producto($id) {
    $pdo = conectar();
    // El «?» es un hueco: el id viaja aparte y MySQL lo trata como
    // dato, nunca como parte de la orden (eso evita la inyección SQL).
    $stmt = $pdo->prepare(
        'SELECT id, nombre, categoria, descripcion, precio, cantidad, fecha
         FROM productos
         WHERE id = ?'
    );
    // Se ejecuta metiendo el id convertido a entero en el hueco.
    $stmt->execute(array((int)$id));
    // fetch() trae la única fila esperada (o false si no apareció).
    $fila = $stmt->fetch();
    // Se normaliza: en vez de false se entrega null, que es lo
    // que tienda.php compara para saber si el producto existe.
    return $fila === false ? null : $fila;
}

/* CREAR: registra un producto nuevo en el inventario
   y devuelve su id. */
function bd_producto_crear($nombre, $categoria, $descripcion, $precio, $cantidad) {
    $pdo = conectar();
    // INSERT con cinco huecos, uno por cada columna que llena el
    // formulario de la tienda (la fecha la pone MySQL por defecto).
    $stmt = $pdo->prepare(
        'INSERT INTO productos (nombre, categoria, descripcion, precio, cantidad)
         VALUES (?, ?, ?, ?, ?)'
    );
    // El orden del arreglo es el mismo de los huecos: nombre,
    // categoría, descripción, precio y cantidad. Precio y stock
    // se fuerzan a entero para guardarlos sin decimales.
    $stmt->execute(array($nombre, $categoria, $descripcion, (int)$precio, (int)$cantidad));
    // Se devuelve el id que el AUTO_INCREMENT le asignó al producto.
    return (int)$pdo->lastInsertId();
}

/* ACTUALIZAR: cambia los datos de un producto que ya existe
   (nombre, categoría, descripción, precio y stock). */
function bd_producto_actualizar($id, $nombre, $categoria, $descripcion, $precio, $cantidad) {
    $pdo = conectar();
    // UPDATE con el WHERE por id: sin ese WHERE se cambiarían
    // TODOS los productos del inventario, por eso va de últimas.
    $stmt = $pdo->prepare(
        'UPDATE productos
         SET nombre = ?, categoria = ?, descripcion = ?, precio = ?, cantidad = ?
         WHERE id = ?'
    );
    // Los cinco datos nuevos primero y el id del producto al
    // final, en el mismo orden en que aparecen los «?» arriba.
    return $stmt->execute(array($nombre, $categoria, $descripcion, (int)$precio, (int)$cantidad, (int)$id));
}

/* ELIMINAR: borra un producto del inventario por su id. */
function bd_producto_eliminar($id) {
    $pdo = conectar();
    // DELETE de una sola fila: la que tenga ese id de producto.
    $stmt = $pdo->prepare('DELETE FROM productos WHERE id = ?');
    // Se ejecuta con el id pasado a entero y se devuelve si salió bien.
    return $stmt->execute(array((int)$id));
}

// ===== AVISOS (página principal) =====
/* Lista los avisos, del más reciente al más viejo. */
function bd_avisos() {
    $pdo = conectar();
    // Para «Novedades» del inicio bastan los 5 avisos más nuevos:
    // fecha en orden descendente y corte en el quinto.
    $sql = 'SELECT id, titulo, contenido, fecha
            FROM avisos
            ORDER BY fecha DESC
            LIMIT 5';
    // Tampoco lleva datos del visitante: consulta directa y filas listas.
    return $pdo->query($sql)->fetchAll();
}

// ===== FORO — CONSULTAR =====
/* Lista las preguntas del foro con su conteo de respuestas
   (la columna «respuestas» sale del LEFT JOIN + COUNT). */
function bd_foro_preguntas() {
    $pdo = conectar();
    // El LEFT JOIN pega cada respuesta con su pregunta y el COUNT
    // las suma: así la lista muestra «3 respuestas» sin consultar
    // pregunta por pregunta. Es LEFT (y no INNER) para que las
    // preguntas todavía sin respuestas también aparezcan, con 0.
    $sql = 'SELECT p.id, p.nombre, p.titulo, p.tema, p.contenido, p.fecha,
                   COUNT(r.id) AS respuestas
            FROM foro_preguntas p
            LEFT JOIN foro_respuestas r ON r.pregunta_id = p.id
            GROUP BY p.id
            ORDER BY p.fecha DESC
            LIMIT 50';
    // Las 50 preguntas más recientes son más que suficientes
    // para la lista de foro.php.
    return $pdo->query($sql)->fetchAll();
}

/* Trae UNA pregunta por su id (para el detalle y para editar).
   Devuelve la fila o null si no existe. */
function bd_foro_pregunta($id) {
    $pdo = conectar();
    // Misma idea que bd_producto(): una sola fila buscada por id,
    // con el id viajando como dato en el «?».
    $stmt = $pdo->prepare(
        'SELECT id, nombre, titulo, tema, contenido, fecha
         FROM foro_preguntas
         WHERE id = ?'
    );
    $stmt->execute(array((int)$id));
    // fetch() entrega la pregunta o false si ese id no existe.
    $fila = $stmt->fetch();
    // foro.php trabaja con null para decir «esta pregunta no está».
    return $fila === false ? null : $fila;
}

/* Lista las respuestas de una pregunta, en orden de llegada. */
function bd_foro_respuestas($pregunta_id) {
    $pdo = conectar();
    // Solo las respuestas cuyo pregunta_id sea el de la pregunta
    // abierta, ordenadas de la más vieja a la más nueva (fecha ASC)
    // para que la conversación se lea en el orden en que ocurrió.
    $stmt = $pdo->prepare(
        'SELECT id, pregunta_id, nombre, contenido, fecha
         FROM foro_respuestas
         WHERE pregunta_id = ?
         ORDER BY fecha ASC
         LIMIT 200'
    );
    $stmt->execute(array((int)$pregunta_id));
    // Aquí sí son varias filas: fetchAll() las entrega todas.
    return $stmt->fetchAll();
}

// ===== FORO — CREAR =====
/* Guarda una pregunta nueva y devuelve su id. */
function bd_foro_crear_pregunta($nombre, $titulo, $tema, $contenido) {
    $pdo = conectar();
    // Se insertan autor, título, tema y el texto del problema;
    // el id y la fecha los genera la propia tabla.
    $stmt = $pdo->prepare(
        'INSERT INTO foro_preguntas (nombre, titulo, tema, contenido)
         VALUES (?, ?, ?, ?)'
    );
    // Cada valor del arreglo cae en su «?» en el mismo orden.
    $stmt->execute(array($nombre, $titulo, $tema, $contenido));
    // Se devuelve el id nuevo por si la vista lo necesita.
    return (int)$pdo->lastInsertId();
}

/* Guarda una respuesta dentro de una pregunta. */
function bd_foro_crear_respuesta($pregunta_id, $nombre, $contenido) {
    $pdo = conectar();
    // La respuesta nace amarrada a su pregunta por pregunta_id:
    // esa es la llave foránea que define el CREATE TABLE.
    $stmt = $pdo->prepare(
        'INSERT INTO foro_respuestas (pregunta_id, nombre, contenido)
         VALUES (?, ?, ?)'
    );
    $stmt->execute(array((int)$pregunta_id, $nombre, $contenido));
    // Id que recibió la respuesta recién guardada.
    return (int)$pdo->lastInsertId();
}

// ===== FORO — ACTUALIZAR =====
/* Cambia el título, el tema y el contenido de una pregunta
   que ya existe (el autor y la fecha no se tocan). */
function bd_foro_actualizar_pregunta($id, $titulo, $tema, $contenido) {
    $pdo = conectar();
    // Solo se reescriben título, tema y contenido; el nombre del
    // autor y la fecha de publicación se dejan como quedaron.
    $stmt = $pdo->prepare(
        'UPDATE foro_preguntas
         SET titulo = ?, tema = ?, contenido = ?
         WHERE id = ?'
    );
    // El id va de último porque su «?» es el del WHERE.
    return $stmt->execute(array($titulo, $tema, $contenido, (int)$id));
}

// ===== FORO — ELIMINAR =====
/* Borra una pregunta. Sus respuestas se borran solas porque
   la tabla foro_respuestas tiene la llave foránea con
   ON DELETE CASCADE (ver base-de-datos/nvision_mysql.sql). */
function bd_foro_eliminar_pregunta($id) {
    $pdo = conectar();
    // Al borrar la pregunta, la cascada de la llave foránea se
    // encarga de las filas hijas en foro_respuestas.
    $stmt = $pdo->prepare('DELETE FROM foro_preguntas WHERE id = ?');
    return $stmt->execute(array((int)$id));
}

/* Borra una sola respuesta del foro. */
function bd_foro_eliminar_respuesta($id) {
    $pdo = conectar();
    // Aquí se borra únicamente la respuesta indicada; la pregunta
    // y las demás respuestas quedan intactas.
    $stmt = $pdo->prepare('DELETE FROM foro_respuestas WHERE id = ?');
    return $stmt->execute(array((int)$id));
}

// ===== COMENTARIOS DE LAS PÁGINAS =====
/* Lista los comentarios de una página ('inicio', 'hardware',
   'redes' o 'mantenimiento'), del más reciente al más viejo. */
function bd_comentarios($pagina) {
    $pdo = conectar();
    // El filtro es la columna «pagina»: con el mismo código se
    // sirven los comentarios de inicio, hardware, redes y
    // mantenimiento sin mezclarlos entre sí.
    $stmt = $pdo->prepare(
        'SELECT id, pagina, nombre, contenido, fecha
         FROM comentarios
         WHERE pagina = ?
         ORDER BY fecha DESC
         LIMIT 50'
    );
    $stmt->execute(array($pagina));
    // Los 50 más recientes de esa página, listos para la vista.
    return $stmt->fetchAll();
}

/* Guarda un comentario nuevo en una página. */
function bd_comentario_crear($pagina, $nombre, $contenido) {
    $pdo = conectar();
    // Se guarda en qué página se comentó, quién y qué escribió;
    // sin esa columna «pagina» no se sabría dónde mostrarlo.
    $stmt = $pdo->prepare(
        'INSERT INTO comentarios (pagina, nombre, contenido)
         VALUES (?, ?, ?)'
    );
    $stmt->execute(array($pagina, $nombre, $contenido));
    // Id asignado al comentario recién publicado.
    return (int)$pdo->lastInsertId();
}

/* Borra un comentario por su id. */
function bd_comentario_eliminar($id) {
    $pdo = conectar();
    // Borrado puntual: únicamente la fila de ese comentario.
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
    // La sentencia se prepara una sola vez y se reutiliza en cada
    // intento del ciclo de abajo, cambiando solo el radicado.
    $stmt = $pdo->prepare(
        'INSERT INTO pqr (radicado, nombre, correo, tipo, mensaje)
         VALUES (?, ?, ?, ?, ?)'
    );
    // Hasta 5 intentos de radicado: chocar dos veces con el mismo
    // código entre millones de combinaciones es casi imposible.
    for ($intento = 0; $intento < 5; $intento++) {
        // El radicado sale de 4 bytes al azar pasados a hexadecimal
        // (8 caracteres) y luego a mayúsculas: ej. «A3F9C1D2».
        $radicado = strtoupper(bin2hex(random_bytes(4)));
        try {
            // Se intenta guardar la PQR con ese radicado…
            $stmt->execute(array($radicado, $nombre, $correo, $tipo, $mensaje));
            // …y si MySQL lo aceptó, ese es el código que se le
            // entrega a la persona para consultar su caso.
            return $radicado;
        } catch (PDOException $e) {
            // 23000 = el radicado ya existía: se intenta con otro.
            if ($e->getCode() !== '23000') {
                // Cualquier otro error no es de radicado repetido:
                // se deja subir para no esconder el problema real.
                throw $e;
            }
        }
    }
    // Ni en 5 intentos se logró: se avisa con null y pqr.php
    // muestra el mensaje de error en vez de un radicado falso.
    return null;
}

/* Busca una PQR por su radicado (para «Consultar mi PQR»).
   Devuelve la fila (tipo, estado, fecha…) o null si no existe. */
function bd_pqr_consultar($radicado) {
    $pdo = conectar();
    // Se trae la fila completa de la PQR porque la vista muestra
    // tipo, estado y fecha del caso consultado.
    $stmt = $pdo->prepare(
        'SELECT id, radicado, nombre, correo, tipo, mensaje, estado, fecha
         FROM pqr
         WHERE radicado = ?'
    );
    // Antes de buscar se limpia lo que la persona escribió:
    // sin espacios de las puntas y en mayúsculas, igual a como
    // se guardó el radicado al radicar la PQR.
    $stmt->execute(array(strtoupper(trim((string)$radicado))));
    $fila = $stmt->fetch();
    // null significa «ese radicado no existe» y pqr.php lo avisa.
    return $fila === false ? null : $fila;
}

// ===== AYUDAS PARA LAS VISTAS =====
/* Escapa el texto del usuario antes de imprimirlo en el HTML
   (así un «<script>» escrito en un comentario se ve como texto
   y no se ejecuta). */
function e($texto) {
    // (string) convierte lo que llegue a texto y el «?? ''» cubre
    // el caso de un dato nulo; ENT_QUOTES también escapa las
    // comillas para que el texto sea seguro dentro de atributos.
    return htmlspecialchars((string)($texto ?? ''), ENT_QUOTES, 'UTF-8');
}

/* 145000 → '$ 145.000' (precio en pesos colombianos). */
function precio_cop($precio) {
    // number_format con 0 decimales, coma como separador decimal
    // (no se usa) y punto como separador de miles, al estilo
    // colombiano: 145000 se ve «$ 145.000» en el catálogo.
    return '$ ' . number_format((int)$precio, 0, ',', '.');
}

/* '2026-11-16 14:30:00' → '16 nov 2026' */
function fecha_corta($fecha) {
    // strtotime convierte el DATETIME de MySQL en un número de
    // tiempo con el que date() sí puede trabajar.
    $t = strtotime((string)$fecha);
    // Fecha ilegible: mejor no mostrar nada que mostrar un error.
    if ($t === false) return '';
    // Los meses se escriben a mano en español abreviado, porque
    // date() solo los sabe decir en inglés.
    $meses = array(1 => 'ene', 'feb', 'mar', 'abr', 'may', 'jun',
                   'jul', 'ago', 'sep', 'oct', 'nov', 'dic');
    // Se arma «día mes año»: 'j' es el día sin cero a la izquierda,
    // 'n' el número del mes (para buscarlo en el arreglo) e 'Y' el año.
    return date('j', $t) . ' ' . $meses[(int)date('n', $t)] . ' ' . date('Y', $t);
}
