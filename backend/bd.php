<?php
/* ============================================================
   NVISION — Cliente de la base de datos (backend PHP)
   Habla con Supabase por su API REST usando cURL, sin librerías
   externas. Dos operaciones:
     bd_listar($tabla, $opciones)  → leer filas (array)
     bd_crear($tabla, $fila, $sinRetorno) → insertar una fila
   Y dos ayudas para las vistas: e() escapa texto del usuario y
   fecha_corta() formatea las fechas.
   ============================================================ */

require_once __DIR__ . '/config.php';

/* Petición genérica a la API REST de Supabase. */
function bd_peticion($metodo, $ruta, $cuerpo = null, $sinRetorno = false) {
    $ch = curl_init(SUPABASE_URL . '/rest/v1/' . $ruta);
    $cabeceras = array(
        'apikey: ' . SUPABASE_ANON_KEY,
        'Authorization: Bearer ' . SUPABASE_ANON_KEY,
        'Content-Type: application/json'
    );
    if ($metodo === 'POST' && !$sinRetorno) {
        $cabeceras[] = 'Prefer: return=representation';
    }
    curl_setopt_array($ch, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $metodo,
        CURLOPT_HTTPHEADER => $cabeceras,
        CURLOPT_TIMEOUT => 15
    ));
    if ($cuerpo !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($cuerpo));
    }
    $respuesta = curl_exec($ch);
    $codigo = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($respuesta === false || $codigo >= 400) {
        return null; /* error de conexión o de la base */
    }
    $datos = json_decode($respuesta, true);
    return is_array($datos) ? $datos : array();
}

/* Leer filas de una tabla.
   $opciones: 'orden' (ej. 'created_at.desc'), 'limite',
   'igual' (array columna => valor para filtrar con eq.) */
function bd_listar($tabla, $opciones = array()) {
    $params = array('select' => '*');
    if (isset($opciones['orden']))  $params['order'] = $opciones['orden'];
    if (isset($opciones['limite'])) $params['limit'] = $opciones['limite'];
    if (isset($opciones['igual'])) {
        foreach ($opciones['igual'] as $columna => $valor) {
            $params[$columna] = 'eq.' . $valor;
        }
    }
    $r = bd_peticion('GET', $tabla . '?' . http_build_query($params));
    return $r === null ? array() : $r;
}

/* Insertar una fila. Con $sinRetorno = true no pide la fila de
   vuelta (necesario en tablas privadas como pqr, donde la página
   puede crear pero no leer). */
function bd_crear($tabla, $fila, $sinRetorno = false) {
    $r = bd_peticion('POST', $tabla, $fila, $sinRetorno);
    if ($r === null) return null;
    return $sinRetorno ? $fila : (isset($r[0]) ? $r[0] : null);
}

/* Escapa texto del usuario antes de imprimirlo en el HTML. */
function e($texto) {
    return htmlspecialchars((string)($texto ?? ''), ENT_QUOTES, 'UTF-8');
}

/* '2026-11-16T...' → '16 nov 2026' */
function fecha_corta($iso) {
    $t = strtotime((string)$iso);
    if ($t === false) return '';
    $meses = array(1 => 'ene', 'feb', 'mar', 'abr', 'may', 'jun',
                   'jul', 'ago', 'sep', 'oct', 'nov', 'dic');
    return date('j', $t) . ' ' . $meses[(int)date('n', $t)] . ' ' . date('Y', $t);
}

/* Genera un UUID v4 (para el radicado de los PQR). */
function generar_uuid() {
    $b = random_bytes(16);
    $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
    $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($b), 4));
}
