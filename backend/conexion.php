<?php
/* ============================================================
   NVISION — Conexión a la base de datos MySQL (backend PHP)
   ------------------------------------------------------------
   Este archivo es el ÚNICO lugar donde se dice a qué base de
   datos se conecta la página. Uso PDO (la forma recomendada de
   hablar con MySQL desde PHP) y todas las consultas del proyecto
   se hacen con sentencias preparadas desde backend/bd.php.

   En XAMPP (mi computador) la base se llama «nvision», el usuario
   es «root» y no tiene clave: son los valores que trae XAMPP.

   >>> EN EL HOSTING (InfinityFree) SOLO SE CAMBIAN LOS 4 DATOS
   >>> DE ABAJO por los que muestra el panel (servidor, nombre de
   >>> la base, usuario y clave). Nada más se toca. Esos datos
   >>> son privados: NO se suben al repositorio.
   ============================================================ */

// ===== CONFIGURACIÓN DE LA CONEXIÓN =====
// Servidor donde está MySQL (en XAMPP es el mismo computador).
define('BD_SERVIDOR', 'localhost');
// Nombre de la base de datos (se crea en phpMyAdmin).
define('BD_NOMBRE', 'nvision');
// Usuario de la base de datos.
define('BD_USUARIO', 'root');
// Clave del usuario (en XAMPP, root no tiene clave).
define('BD_CLAVE', '');

// ===== CONEXIÓN PDO =====
/* Devuelve la conexión PDO ya lista para usar.
   La conexión se crea una sola vez y se reutiliza en toda la
   página (por eso se guarda en una variable estática). Si la
   base no responde, se muestra un mensaje sencillo en vez de
   dejar la página en blanco. */
function conectar() {
    static $pdo = null;
    if ($pdo === null) {
        // DSN: la «dirección» completa de la base, con utf8mb4
        // para que los acentos y las ñ se guarden bien.
        $dsn = 'mysql:host=' . BD_SERVIDOR
             . ';dbname=' . BD_NOMBRE
             . ';charset=utf8mb4';
        try {
            $pdo = new PDO($dsn, BD_USUARIO, BD_CLAVE, array(
                // Los errores de la base se lanzan como excepción
                // (así no pasan en silencio).
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                // Las filas llegan como arreglo asociativo:
                // $fila['titulo'] en vez de $fila[1].
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ));
        } catch (PDOException $e) {
            // Sin base de datos la página no puede funcionar:
            // se avisa y se detiene todo.
            die('Error de conexión con la base de datos. '
              . 'Revisa que MySQL esté encendido y que los datos '
              . 'de backend/conexion.php sean correctos.');
        }
    }
    return $pdo;
}
