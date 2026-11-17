-- ============================================================
-- NVISION — Base de datos MySQL / MariaDB (versión PHP)
-- ------------------------------------------------------------
-- CÓMO USARLO (en XAMPP):
--   1. Enciende Apache y MySQL en el panel de XAMPP.
--   2. Abre phpMyAdmin (http://localhost/phpmyadmin).
--   3. Crea una base de datos llamada «nvision»
--      (cotejamiento: utf8mb4_general_ci).
--   4. Entra a esa base, ve a la pestaña «Importar», elige
--      este archivo y pulsa «Continuar».
-- Este archivo NO crea la base (por eso no trae CREATE
-- DATABASE): así el mismo archivo sirve en XAMPP y en el
-- hosting (InfinityFree), donde la base se crea desde el panel.
--
-- Tablas:
--   productos        inventario de la tienda (el CRUD principal)
--   ventas           compras hechas desde el carrito
--   venta_detalles   renglones de cada venta (qué se compró)
--   avisos           novedades que se muestran en el inicio
--   foro_preguntas   preguntas del foro «El Taller»
--   foro_respuestas  respuestas de cada pregunta
--   comentarios      comentarios de las páginas de aprendizaje
-- ============================================================

-- Los acentos y las ñ se guardan bien con utf8mb4.
SET NAMES utf8mb4;

-- ------------------------------------------------------------
-- 1) AVISOS — novedades del inicio (se publican desde phpMyAdmin)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS avisos (
  -- Identificador del aviso: lo genera MySQL solo, de 1 en adelante.
  id        INT AUTO_INCREMENT PRIMARY KEY,
  -- Titular corto del aviso, el que se ve en la tarjeta de Novedades.
  titulo    VARCHAR(120) NOT NULL,
  -- Texto completo del aviso (admite hasta 600 caracteres).
  contenido VARCHAR(600) NOT NULL,
  -- Momento de publicación: si no se manda, se llena con la fecha actual.
  fecha     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 2) FORO — preguntas
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS foro_preguntas (
  -- Id de la pregunta: con él se abre el detalle (foro.php?ver=ID).
  id        INT AUTO_INCREMENT PRIMARY KEY,
  -- Nombre de la persona que publica la pregunta.
  nombre    VARCHAR(60) NOT NULL,
  -- Título del problema, el texto grande de la tarjeta en la lista.
  titulo    VARCHAR(120) NOT NULL,
  -- Tema cerrado con ENUM: solo uno de estos cuatro valores;
  -- si no se indica, la pregunta queda clasificada como «Otro».
  tema      ENUM('Hardware', 'Redes', 'Mantenimiento', 'Otro')
            NOT NULL DEFAULT 'Otro',
  -- Explicación completa del problema (hasta 2000 caracteres).
  contenido VARCHAR(2000) NOT NULL,
  -- Fecha y hora en que se publicó la pregunta.
  fecha     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 3) FORO — respuestas (cada una cuelga de una pregunta)
--    Si se borra la pregunta, sus respuestas se borran solas
--    gracias a ON DELETE CASCADE.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS foro_respuestas (
  -- Id propio de cada respuesta.
  id          INT AUTO_INCREMENT PRIMARY KEY,
  -- A qué pregunta pertenece: es la llave foránea de abajo y
  -- sin ella la respuesta quedaría suelta, sin conversación.
  pregunta_id INT NOT NULL,
  -- Nombre de la persona que responde.
  nombre      VARCHAR(60) NOT NULL,
  -- Texto de la ayuda o respuesta (hasta 1000 caracteres).
  contenido   VARCHAR(1000) NOT NULL,
  -- Fecha de la respuesta: la vista las ordena de vieja a nueva.
  fecha       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- La llave foránea con nombre propio: pregunta_id debe existir
  -- en foro_preguntas y, si esa pregunta se borra, el
  -- ON DELETE CASCADE elimina sus respuestas en la misma operación.
  CONSTRAINT fk_respuestas_pregunta
    FOREIGN KEY (pregunta_id)
    REFERENCES foro_preguntas (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 4) COMENTARIOS de las páginas
--    (pagina: inicio, hardware, redes o mantenimiento)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS comentarios (
  -- Id del comentario, único en toda la tabla.
  id        INT AUTO_INCREMENT PRIMARY KEY,
  -- En qué página se escribió ('inicio', 'hardware', 'redes' o
  -- 'mantenimiento'): es el filtro de todas las consultas.
  pagina    VARCHAR(30) NOT NULL,
  -- Nombre de quien comenta.
  nombre    VARCHAR(60) NOT NULL,
  -- El comentario en sí, máximo 500 caracteres como el formulario.
  contenido VARCHAR(500) NOT NULL,
  -- Cuándo se publicó; la vista los muestra del nuevo al viejo.
  fecha     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Índice sobre «pagina»: casi siempre se busca por página,
  -- así MySQL no tiene que recorrer toda la tabla.
  INDEX idx_comentarios_pagina (pagina)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 5) PRODUCTOS — inventario de la tienda NVISION
--    Es el módulo CRUD principal del proyecto: registrar,
--    consultar, actualizar y eliminar productos desde
--    tienda.php. El precio va en pesos colombianos (sin
--    centavos) y «cantidad» es el stock disponible.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
  -- Id del producto: es el que viaja en tienda.php?editar=ID.
  id          INT AUTO_INCREMENT PRIMARY KEY,
  -- Nombre comercial del producto, el título de su tarjeta.
  nombre      VARCHAR(120) NOT NULL,
  -- Familia del producto, cerrada con ENUM para que el catálogo
  -- se pueda ordenar por categoría sin textos inventados.
  categoria   ENUM('Componentes', 'Periféricos', 'Redes', 'Accesorios')
              NOT NULL DEFAULT 'Componentes',
  -- Descripción corta; puede ir vacía (de ahí el DEFAULT '').
  descripcion VARCHAR(300) NOT NULL DEFAULT '',
  -- Precio en pesos colombianos como entero, sin centavos:
  -- 85000 significa $ 85.000 en la tienda.
  precio      INT NOT NULL DEFAULT 0,
  -- Stock disponible: cuando llega a 0 la tarjeta dice «Agotado».
  cantidad    INT NOT NULL DEFAULT 0,
  -- Foto del producto: es la RUTA local de la imagen (ej:
  -- 'frontend/img/productos/ram.jpg'), no la imagen en sí.
  -- Puede ser NULL: si un producto no tiene foto, la tienda
  -- muestra un recuadro con su emoji en vez de la imagen.
  imagen      VARCHAR(255) NULL,
  -- Fecha en que el producto entró al inventario.
  fecha       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 6) VENTAS — las compras que se finalizan en carrito.php
--    La venta guarda solo el total y la fecha; el detalle de
--    qué productos se llevaron va en venta_detalles.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ventas (
  -- Id de la venta: es el «número de venta» que se le muestra
  -- al comprador al finalizar la compra.
  id         INT AUTO_INCREMENT PRIMARY KEY,
  -- Total pagado en pesos (la suma de los renglones del detalle).
  total      INT NOT NULL,
  -- Momento en que se hizo la compra.
  creado_en  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 7) VENTA_DETALLES — un renglón por cada producto comprado
--    Se guarda el nombre y el precio DEL MOMENTO de la venta:
--    si mañana el producto se edita o se borra del inventario,
--    el historial de la venta no cambia ni se rompe.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS venta_detalles (
  -- Id propio de cada renglón.
  id          INT AUTO_INCREMENT PRIMARY KEY,
  -- A qué venta pertenece este renglón: llave foránea con
  -- cascada, si se borra la venta se borran sus renglones.
  venta_id    INT NOT NULL,
  -- Id del producto comprado. OJO: aquí NO hay llave foránea
  -- a propósito: si el producto se elimina del inventario, el
  -- renglón de la venta debe sobrevivir como historial.
  producto_id INT NOT NULL,
  -- Nombre del producto tal como estaba al venderlo.
  nombre      VARCHAR(120) NOT NULL,
  -- Precio unitario al momento de la venta, en pesos.
  precio      INT NOT NULL,
  -- Cuántas unidades de ese producto se llevaron.
  cantidad    INT NOT NULL,
  CONSTRAINT fk_detalles_venta
    FOREIGN KEY (venta_id)
    REFERENCES ventas (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- DATOS SEMILLA (los mismos con los que arranca la página;
-- se pueden borrar o cambiar desde phpMyAdmin)
-- ------------------------------------------------------------
-- Productos de ejemplo (datos ficticios) de la tienda.
-- La columna imagen trae la ruta de la foto de cada producto,
-- guardada en frontend/img/productos/.
INSERT INTO productos (nombre, categoria, descripcion, precio, cantidad, imagen) VALUES
  ('Memoria RAM DDR4 8GB', 'Componentes',
   'Módulo de memoria DDR4 de 8 GB a 3200 MHz para PC de escritorio.', 85000, 12,
   'frontend/img/productos/ram.jpg'),
  ('SSD NVMe 256GB', 'Componentes',
   'Unidad de estado sólido NVMe PCIe de 256 GB, lectura hasta 3.500 MB/s.', 145000, 8,
   'frontend/img/productos/ssd.jpg'),
  ('Mouse inalámbrico', 'Periféricos',
   'Mouse óptico inalámbrico 2.4 GHz con receptor USB y 1600 DPI.', 45000, 20,
   'frontend/img/productos/mouse.jpg'),
  ('Teclado mecánico', 'Periféricos',
   'Teclado mecánico con interruptores azules y retroiluminación LED.', 120000, 0,
   'frontend/img/productos/teclado.jpg'),
  ('Router WiFi doble banda', 'Redes',
   'Router AC1200 doble banda 2.4/5 GHz con 4 antenas externas.', 135000, 5,
   'frontend/img/productos/router.jpg'),
  ('Cable de red Cat6 (3 m)', 'Accesorios',
   'Cable UTP categoría 6 de 3 metros con conectores RJ45.', 18000, 30,
   'frontend/img/productos/cable.jpg'),
  ('Monitor LED 24 pulgadas', 'Periféricos',
   'Monitor LED Full HD de 24 pulgadas (1920×1080) con entradas HDMI y VGA.', 420000, 6,
   'frontend/img/productos/monitor.jpg'),
  ('Diadema gamer con micrófono', 'Periféricos',
   'Diadema gamer con micrófono flexible, sonido envolvente y conexión 3.5 mm.', 95000, 15,
   'frontend/img/productos/diadema.jpg'),
  ('Disco duro externo 1TB', 'Accesorios',
   'Disco duro externo de 1 TB con conexión USB 3.0, ideal para copias de seguridad.', 180000, 10,
   'frontend/img/productos/disco.jpg'),
  ('Fuente de poder 600W', 'Componentes',
   'Fuente de poder ATX de 600W con certificación 80 Plus y ventilador silencioso de 120 mm.', 160000, 7,
   'frontend/img/productos/fuente.jpg');

-- El aviso de bienvenida que se ve en «Novedades» al instalar.
INSERT INTO avisos (titulo, contenido) VALUES
  ('¡Bienvenidos a la nueva NVISION!',
   'Estrenamos página: mismo diseño, menos vueltas. Aprende en los módulos, pregunta en el foro y compra en la tienda.');

-- Una primera pregunta del equipo para que el foro no nazca vacío.
INSERT INTO foro_preguntas (nombre, titulo, tema, contenido) VALUES
  ('Equipo NVISION', '¿Dudas con un tema? Pregunta aquí', 'Otro',
   'Este es el foro El Taller: deja tu pregunta sobre hardware, redes o mantenimiento y la comunidad te responde.');
