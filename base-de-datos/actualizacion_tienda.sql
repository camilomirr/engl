-- ============================================================
-- NVISION — Actualización de la tienda (fotos, productos
-- nuevos y tablas de ventas)
-- ------------------------------------------------------------
-- ¿PARA QUÉ ES ESTE ARCHIVO?
-- La base que ya está creada (en el hosting o en un XAMPP con
-- la versión anterior) NO hay que borrarla: este archivo solo
-- AGREGA lo nuevo sobre la base semilla que ya existe:
--   1. La columna «imagen» en la tabla productos.
--   2. La foto de los 6 productos semilla (UPDATE por nombre).
--   3. Cuatro productos nuevos (monitor, diadema, disco
--      duro externo y fuente de poder).
--   4. Las tablas ventas y venta_detalles del carrito.
--
-- CÓMO USARLO: entrar a la base «nvision» en phpMyAdmin,
-- pestaña «Importar», elegir este archivo y «Continuar».
-- Se puede correr una vez sobre la base actual sin errores
-- y sin borrar ningún dato.
-- ============================================================

-- Los acentos y las ñ se guardan bien con utf8mb4.
SET NAMES utf8mb4;

-- ------------------------------------------------------------
-- 1) COLUMNA IMAGEN EN PRODUCTOS
--    Guarda la ruta local de la foto (ej:
--    'frontend/img/productos/ram.jpg'). Es NULL por si algún
--    producto no tiene foto: la tienda muestra un emoji.
-- ------------------------------------------------------------
ALTER TABLE productos
  ADD COLUMN imagen VARCHAR(255) NULL;

-- ------------------------------------------------------------
-- 2) FOTO DE LOS 6 PRODUCTOS SEMILLA
--    Se busca cada producto POR SU NOMBRE (el WHERE), porque
--    en la base ya creada no se debe asumir su id.
-- ------------------------------------------------------------
-- Foto de la memoria RAM DDR4.
UPDATE productos SET imagen = 'frontend/img/productos/ram.jpg'
 WHERE nombre = 'Memoria RAM DDR4 8GB';
-- Foto del SSD NVMe.
UPDATE productos SET imagen = 'frontend/img/productos/ssd.jpg'
 WHERE nombre = 'SSD NVMe 256GB';
-- Foto del mouse inalámbrico.
UPDATE productos SET imagen = 'frontend/img/productos/mouse.jpg'
 WHERE nombre = 'Mouse inalámbrico';
-- Foto del teclado mecánico.
UPDATE productos SET imagen = 'frontend/img/productos/teclado.jpg'
 WHERE nombre = 'Teclado mecánico';
-- Foto del router WiFi.
UPDATE productos SET imagen = 'frontend/img/productos/router.jpg'
 WHERE nombre = 'Router WiFi doble banda';
-- Foto del cable de red Cat6.
UPDATE productos SET imagen = 'frontend/img/productos/cable.jpg'
 WHERE nombre = 'Cable de red Cat6 (3 m)';

-- ------------------------------------------------------------
-- 3) CUATRO PRODUCTOS NUEVOS DE LA VITRINA
-- ------------------------------------------------------------
INSERT INTO productos (nombre, categoria, descripcion, precio, cantidad, imagen) VALUES
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

-- ------------------------------------------------------------
-- 4) VENTAS — las compras que se finalizan en carrito.php
--    La venta guarda el total y la fecha; el detalle de qué
--    se compró va en venta_detalles.
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
-- 5) VENTA_DETALLES — un renglón por producto comprado.
--    Se guarda nombre y precio DEL MOMENTO de la venta, por
--    si el producto se edita o se borra después. Por eso
--    producto_id NO lleva llave foránea: el renglón es un
--    historial y debe sobrevivir al producto.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS venta_detalles (
  -- Id propio de cada renglón.
  id          INT AUTO_INCREMENT PRIMARY KEY,
  -- A qué venta pertenece: con cascada, si se borra la venta
  -- se borran también sus renglones.
  venta_id    INT NOT NULL,
  -- Id del producto comprado (sin FK, a propósito).
  producto_id INT NOT NULL,
  -- Nombre del producto tal como estaba al venderlo.
  nombre      VARCHAR(120) NOT NULL,
  -- Precio unitario al momento de la venta, en pesos.
  precio      INT NOT NULL,
  -- Cuántas unidades se llevaron.
  cantidad    INT NOT NULL,
  CONSTRAINT fk_detalles_venta
    FOREIGN KEY (venta_id)
    REFERENCES ventas (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
