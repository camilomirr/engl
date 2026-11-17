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
                  bd_producto_buscar()  ← vitrina con buscador,
                  filtro por categoría y orden (lista blanca)
     Carrito y    bd_productos_por_ids()  ← datos frescos de
     ventas:      los ítems del carrito
                  bd_venta_registrar()  ← guarda la venta, sus
                  detalles y descuenta el stock, todo en una
                  transacción (o se guarda todo o nada)

   Y dos ayudas para las vistas: e() escapa el texto del usuario
   antes de imprimirlo y precio_cop() formatea los precios.
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
    // muestra (incluida la ruta de la foto); el orden es por
    // categoría y, dentro de ella, por nombre.
    $sql = 'SELECT id, nombre, categoria, descripcion, precio, cantidad, imagen, fecha
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
        'SELECT id, nombre, categoria, descripcion, precio, cantidad, imagen, fecha
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
   y devuelve su id. La imagen es la ruta de la foto
   (puede ir null si el producto no tiene). */
function bd_producto_crear($nombre, $categoria, $descripcion, $precio, $cantidad, $imagen = null) {
    $pdo = conectar();
    // INSERT con seis huecos, uno por cada columna que llena el
    // formulario de la tienda (la fecha la pone MySQL por defecto).
    $stmt = $pdo->prepare(
        'INSERT INTO productos (nombre, categoria, descripcion, precio, cantidad, imagen)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    // El orden del arreglo es el mismo de los huecos: nombre,
    // categoría, descripción, precio, cantidad y la ruta de la
    // foto. Precio y stock se fuerzan a entero para guardarlos
    // sin decimales.
    $stmt->execute(array($nombre, $categoria, $descripcion, (int)$precio, (int)$cantidad, $imagen));
    // Se devuelve el id que el AUTO_INCREMENT le asignó al producto.
    return (int)$pdo->lastInsertId();
}

/* ACTUALIZAR: cambia los datos de un producto que ya existe
   (nombre, categoría, descripción, precio, stock y foto). */
function bd_producto_actualizar($id, $nombre, $categoria, $descripcion, $precio, $cantidad, $imagen = null) {
    $pdo = conectar();
    // UPDATE con el WHERE por id: sin ese WHERE se cambiarían
    // TODOS los productos del inventario, por eso va de últimas.
    $stmt = $pdo->prepare(
        'UPDATE productos
         SET nombre = ?, categoria = ?, descripcion = ?, precio = ?, cantidad = ?, imagen = ?
         WHERE id = ?'
    );
    // Los seis datos nuevos primero y el id del producto al
    // final, en el mismo orden en que aparecen los «?» arriba.
    return $stmt->execute(array($nombre, $categoria, $descripcion, (int)$precio, (int)$cantidad, $imagen, (int)$id));
}

/* ELIMINAR: borra un producto del inventario por su id. */
function bd_producto_eliminar($id) {
    $pdo = conectar();
    // DELETE de una sola fila: la que tenga ese id de producto.
    $stmt = $pdo->prepare('DELETE FROM productos WHERE id = ?');
    // Se ejecuta con el id pasado a entero y se devuelve si salió bien.
    return $stmt->execute(array((int)$id));
}

/* CONSULTAR PARA LA VITRINA: busca productos combinando tres
   filtros opcionales de tienda.php:
     $q         texto que debe aparecer en el nombre (buscador)
     $categoria una de las 4 del ENUM, o '' para «Todas»
     $orden     clave del orden elegido en el select
   Todo lo que escribe el visitante viaja como dato en los «?»,
   y el ORDER BY NUNCA se arma con su texto: sale de una lista
   blanca de órdenes escritos aquí, en el código. */
function bd_producto_buscar($q, $categoria, $orden) {
    $pdo = conectar();
    // ===== LISTA BLANCA DE ÓRDENES =====
    // La clave es lo que manda el select de la tienda; el valor
    // es el pedazo de SQL que sí se puede pegar en la consulta.
    // Si llega una clave desconocida, se usa «recientes».
    $ordenes = array(
        // Lo último que entró al inventario, primero.
        'recientes'    => 'id DESC',
        // Del precio más barato al más caro.
        'precio-menor' => 'precio ASC, nombre ASC',
        // Del precio más caro al más barato.
        'precio-mayor' => 'precio DESC, nombre ASC',
        // Alfabético por nombre.
        'nombre'       => 'nombre ASC'
    );
    // La clave del visitante solo sirve para ELEGIR de la lista:
    // el texto que entra al SQL es el de la derecha, nunca el suyo.
    $ordenSql = $ordenes[$orden] ?? $ordenes['recientes'];

    // ===== CONDICIONES SEGÚN LOS FILTROS =====
    // Cada filtro que sí venga suma una condición con su «?» y
    // su dato al arreglo de parámetros, en el mismo orden.
    $condiciones = array();
    // Los valores que viajarán en los «?» de la consulta.
    $params = array();
    // Buscador: solo se filtra si escribió algo en el campo q.
    if ($q !== '') {
        // Se escapan los comodines del LIKE (%, _ y la barra)
        // para que buscar «100%» encuentre el texto literal y no
        // «cualquier cosa»: MySQL usa la barra como escape.
        $qSeguro = str_replace(array('\\', '%', '_'), array('\\\\', '\\%', '\\_'), $q);
        // El LIKE compara contra el nombre con comodines a los
        // lados: encuentra el texto en cualquier parte del nombre.
        $condiciones[] = 'nombre LIKE ?';
        $params[] = '%' . $qSeguro . '%';
    }
    // Filtro de categoría: solo vale si es una de las cuatro del
    // ENUM; cualquier otro valor se ignora (equivale a «Todas»).
    if (in_array($categoria, array('Componentes', 'Periféricos', 'Redes', 'Accesorios'), true)) {
        $condiciones[] = 'categoria = ?';
        $params[] = $categoria;
    }

    // Se arma la consulta: la base trae también la ruta de la foto.
    $sql = 'SELECT id, nombre, categoria, descripcion, precio, cantidad, imagen, fecha
            FROM productos';
    // Si hay filtros, se pegan con AND detrás del WHERE.
    if ($condiciones) {
        $sql .= ' WHERE ' . implode(' AND ', $condiciones);
    }
    // El orden sale de la lista blanca de arriba, no del visitante.
    $sql .= ' ORDER BY ' . $ordenSql;
    // Consulta preparada: los datos del visitante van aparte.
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    // Las filas que cumplieron los filtros, ya ordenadas.
    return $stmt->fetchAll();
}

// ===== CARRITO Y VENTAS (carrito.php) =====
/* Trae los datos FRESCOS de varios productos por sus ids y los
   devuelve indexados por id: array(id => fila). Lo usa el
   carrito para recalcular precios y stock con lo que haya en
   la base AHORA, no con lo que había cuando se agregó el ítem. */
function bd_productos_por_ids($ids) {
    // Sin ids no hay nada que consultar: arreglo vacío y listo.
    if (!$ids) {
        return array();
    }
    $pdo = conectar();
    // Se fabrica un «?» por cada id: la lista de huecos es lo
    // único que se pega al SQL, y su largo depende del CONTEO
    // de ids (un número), nunca de texto del visitante.
    $huecos = implode(',', array_fill(0, count($ids), '?'));
    // La consulta trae los productos cuyo id esté en la lista.
    $stmt = $pdo->prepare(
        'SELECT id, nombre, categoria, descripcion, precio, cantidad, imagen, fecha
         FROM productos
         WHERE id IN (' . $huecos . ')'
    );
    // Los ids viajan como datos, forzados a entero uno por uno.
    $stmt->execute(array_map('intval', $ids));
    // Se reindexa el resultado: la llave de cada fila es su id,
    // así carrito.php encuentra cada producto sin recorrer todo.
    $porId = array();
    // Fila por fila se guarda en su casilla: $porId[id] = fila.
    foreach ($stmt->fetchAll() as $fila) {
        $porId[(int)$fila['id']] = $fila;
    }
    // El mapa id => producto que pidió el carrito.
    return $porId;
}

/* REGISTRAR UNA VENTA COMPLETA, en una sola transacción:
     1. inserta la fila en ventas con el total,
     2. inserta cada renglón en venta_detalles (con el nombre y
        el precio del momento, como historial),
     3. descuenta el stock de cada producto.
   $items es un arreglo de filas ya validadas por carrito.php,
   cada una con: id, nombre, precio y cantidad.
   Si CUALQUIER paso falla, la transacción se deshace entera
   (rollBack) y se devuelve null: no queda venta a medias ni
   stock descontado sin venta. Si todo sale, devuelve el id
   (número) de la venta. */
function bd_venta_registrar($items, $total, $cliente, $direccion) {
    $pdo = conectar();
    // ----- Paso 0: columnas de entrega al día -----
    // Las bases creadas con la versión anterior del archivo
    // SQL no tienen cliente/direccion/pago en la tabla ventas:
    // si falta alguna columna, se agrega aquí mismo para que
    // la compra no se caiga por una base vieja.
    $columnas = $pdo->query('SHOW COLUMNS FROM ventas')->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('cliente', $columnas)) {
        $pdo->exec("ALTER TABLE ventas ADD cliente VARCHAR(120) NOT NULL DEFAULT ''");
    }
    if (!in_array('direccion', $columnas)) {
        $pdo->exec("ALTER TABLE ventas ADD direccion VARCHAR(255) NOT NULL DEFAULT ''");
    }
    if (!in_array('pago', $columnas)) {
        $pdo->exec("ALTER TABLE ventas ADD pago VARCHAR(40) NOT NULL DEFAULT 'Contra entrega'");
    }
    // Todo lo del try es «o se guarda completo o no se guarda nada».
    try {
        // Abre la transacción: desde aquí ningún cambio es
        // definitivo hasta llegar al commit() del final.
        $pdo->beginTransaction();

        // ----- Paso 1: la venta -----
        // El total y los datos de entrega (quién recibe y
        // dónde); la fecha la pone la tabla y el pago es
        // siempre «Contra entrega» en esta tienda.
        $stmtVenta = $pdo->prepare(
            'INSERT INTO ventas (total, cliente, direccion, pago) VALUES (?, ?, ?, ?)'
        );
        $stmtVenta->execute(array((int)$total, $cliente, $direccion, 'Contra entrega'));
        // El id que MySQL le dio a la venta es su número oficial:
        // lo necesitan los renglones y la confirmación al comprador.
        $ventaId = (int)$pdo->lastInsertId();

        // Las otras dos sentencias se preparan una vez y se
        // ejecutan por cada ítem del carrito.
        // ----- Paso 2 (preparado): el renglón del detalle -----
        $stmtDetalle = $pdo->prepare(
            'INSERT INTO venta_detalles (venta_id, producto_id, nombre, precio, cantidad)
             VALUES (?, ?, ?, ?, ?)'
        );
        // ----- Paso 3 (preparado): descontar el stock -----
        // El «AND cantidad >= ?» es el candado final: si el stock
        // ya no alcanza, el UPDATE no toca ninguna fila y abajo
        // se detecta para deshacer la venta completa.
        $stmtStock = $pdo->prepare(
            'UPDATE productos
             SET cantidad = cantidad - ?
             WHERE id = ? AND cantidad >= ?'
        );

        // Ítem por ítem: primero su renglón, luego su descuento.
        foreach ($items as $item) {
            // El renglón guarda el nombre y el precio DE AHORA:
            // aunque el producto se edite o se borre mañana, el
            // historial de esta venta queda como fue.
            $stmtDetalle->execute(array(
                $ventaId, (int)$item['id'], $item['nombre'],
                (int)$item['precio'], (int)$item['cantidad']
            ));
            // Se descuenta lo comprado del stock del producto.
            $stmtStock->execute(array(
                (int)$item['cantidad'], (int)$item['id'], (int)$item['cantidad']
            ));
            // Si el UPDATE no cambió exactamente 1 fila, el stock
            // no alcanzaba: se lanza el error y el catch deshace
            // la venta entera, incluidos los renglones ya escritos.
            if ($stmtStock->rowCount() !== 1) {
                throw new Exception('Stock insuficiente para «' . $item['nombre'] . '».');
            }
        }

        // Todo salió bien: los cambios quedan guardados de verdad.
        $pdo->commit();
        // Se entrega el número de la venta a carrito.php.
        return $ventaId;
    } catch (Exception $e) {
        // Algo falló a mitad de camino: si la transacción sigue
        // abierta se deshace completa, como si nada hubiera pasado.
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        // null le dice a carrito.php «la compra no se hizo».
        return null;
    }
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
