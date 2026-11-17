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
--   avisos           novedades que se muestran en el inicio
--   foro_preguntas   preguntas del foro «El Taller»
--   foro_respuestas  respuestas de cada pregunta
--   comentarios      comentarios de las páginas de aprendizaje
--   pqr              peticiones, quejas, reclamos y sugerencias
-- ============================================================

-- Los acentos y las ñ se guardan bien con utf8mb4.
SET NAMES utf8mb4;

-- ------------------------------------------------------------
-- 1) AVISOS — novedades del inicio (se publican desde phpMyAdmin)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS avisos (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  titulo    VARCHAR(120) NOT NULL,
  contenido VARCHAR(600) NOT NULL,
  fecha     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 2) FORO — preguntas
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS foro_preguntas (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(60) NOT NULL,
  titulo    VARCHAR(120) NOT NULL,
  tema      ENUM('Hardware', 'Redes', 'Mantenimiento', 'Otro')
            NOT NULL DEFAULT 'Otro',
  contenido VARCHAR(2000) NOT NULL,
  fecha     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 3) FORO — respuestas (cada una cuelga de una pregunta)
--    Si se borra la pregunta, sus respuestas se borran solas
--    gracias a ON DELETE CASCADE.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS foro_respuestas (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  pregunta_id INT NOT NULL,
  nombre      VARCHAR(60) NOT NULL,
  contenido   VARCHAR(1000) NOT NULL,
  fecha       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
  id        INT AUTO_INCREMENT PRIMARY KEY,
  pagina    VARCHAR(30) NOT NULL,
  nombre    VARCHAR(60) NOT NULL,
  contenido VARCHAR(500) NOT NULL,
  fecha     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_comentarios_pagina (pagina)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 5) PQR — peticiones, quejas, reclamos y sugerencias
--    El radicado es único: es el código que el visitante usa
--    para consultar el estado de su caso. El estado arranca
--    en «Pendiente» y el equipo lo cambia desde phpMyAdmin.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pqr (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  radicado VARCHAR(8) NOT NULL UNIQUE,
  nombre   VARCHAR(80) NOT NULL,
  correo   VARCHAR(120) NOT NULL,
  tipo     ENUM('Petición', 'Queja', 'Reclamo', 'Sugerencia')
           NOT NULL DEFAULT 'Petición',
  mensaje  VARCHAR(2000) NOT NULL,
  estado   VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
  fecha    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 6) PRODUCTOS — inventario de la tienda NVISION
--    Es el módulo CRUD principal del proyecto: registrar,
--    consultar, actualizar y eliminar productos desde
--    tienda.php. El precio va en pesos colombianos (sin
--    centavos) y «cantidad» es el stock disponible.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL,
  categoria   ENUM('Componentes', 'Periféricos', 'Redes', 'Accesorios')
              NOT NULL DEFAULT 'Componentes',
  descripcion VARCHAR(300) NOT NULL DEFAULT '',
  precio      INT NOT NULL DEFAULT 0,
  cantidad    INT NOT NULL DEFAULT 0,
  fecha       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- DATOS SEMILLA (los mismos con los que arranca la página;
-- se pueden borrar o cambiar desde phpMyAdmin)
-- ------------------------------------------------------------
-- Productos de ejemplo (datos ficticios) de la tienda.
INSERT INTO productos (nombre, categoria, descripcion, precio, cantidad) VALUES
  ('Memoria RAM DDR4 8GB', 'Componentes',
   'Módulo de memoria DDR4 de 8 GB a 3200 MHz para PC de escritorio.', 85000, 12),
  ('SSD NVMe 256GB', 'Componentes',
   'Unidad de estado sólido NVMe PCIe de 256 GB, lectura hasta 3.500 MB/s.', 145000, 8),
  ('Mouse inalámbrico', 'Periféricos',
   'Mouse óptico inalámbrico 2.4 GHz con receptor USB y 1600 DPI.', 45000, 20),
  ('Teclado mecánico', 'Periféricos',
   'Teclado mecánico con interruptores azules y retroiluminación LED.', 120000, 0),
  ('Router WiFi doble banda', 'Redes',
   'Router AC1200 doble banda 2.4/5 GHz con 4 antenas externas.', 135000, 5),
  ('Cable de red Cat6 (3 m)', 'Accesorios',
   'Cable UTP categoría 6 de 3 metros con conectores RJ45.', 18000, 30);

INSERT INTO avisos (titulo, contenido) VALUES
  ('¡Bienvenidos a la nueva NVISION!',
   'Estrenamos página: mismo diseño, menos vueltas. Aprende en los módulos, pregunta en el foro y envía tus PQR desde la sección de contacto.');

INSERT INTO foro_preguntas (nombre, titulo, tema, contenido) VALUES
  ('Equipo NVISION', '¿Dudas con un tema? Pregunta aquí', 'Otro',
   'Este es el foro El Taller: deja tu pregunta sobre hardware, redes o mantenimiento y la comunidad te responde.');
