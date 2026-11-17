/* ============================================================
   NVISION — Validaciones de formularios (JavaScript)
   ------------------------------------------------------------
   Este archivo revisa los formularios de la versión PHP ANTES
   de que salgan del navegador: si falta un dato obligatorio o
   algo está muy corto, se cancela el envío y se muestra un
   mensaje claro junto al formulario.

   Ojo: esta validación es solo la primera barrera. PHP vuelve
   a validar todo en el servidor (foro.php, pqr.php y
   includes/comentarios_ctrl.php), porque la validación del
   navegador se puede saltar.

   Formularios que cuida:
     #form-producto        registrar / editar un producto
     #form-foro-publicar   publicar una pregunta del foro
     #form-foro-editar     editar una pregunta del foro
     #form-foro-responder  responder en el foro
     #form-comentario      comentarios de las páginas
     #form-pqr             radicar una PQR
     #form-pqr-consulta    consultar una PQR por radicado
     .form-confirmar       formularios de ELIMINAR: piden
                           confirmación antes de borrar
   ============================================================ */

// Modo estricto: el navegador avisa de errores que en modo
// normal pasarían en silencio (variables sin declarar, etc.).
'use strict';

/* ===== AYUDAS GENERALES ===== */

/* Muestra el mensaje de error dentro del formulario (crea el
   párrafo la primera vez) y lleva el cursor al campo malo. */
function avisarError(form, campo, mensaje) {
  // Se busca si este formulario ya tiene su párrafo de aviso creado.
  var aviso = form.querySelector('.validacion-aviso');
  // La primera vez no existe y toca fabricarlo al vuelo.
  if (!aviso) {
    aviso = document.createElement('p');
    // Esas dos clases le dan el estilo de mensaje del diseño NVISION.
    aviso.className = 'validacion-aviso mejora-msg';
    // El aviso se coloca justo antes del botón de enviar.
    var boton = form.querySelector('button[type="submit"]');
    form.insertBefore(aviso, boton);
  }
  // Se escribe (o se reemplaza) el texto del problema encontrado.
  aviso.textContent = mensaje;
  // El cursor salta al campo que falló para corregirlo de una vez.
  if (campo) {
    campo.focus();
  }
}

/* Quita espacios de los lados y mide el largo real del texto. */
function largoTexto(campo) {
  // trim() le quita los espacios de las puntas: un nombre hecho
  // solo de espacios cuenta como vacío.
  return campo.value.trim().length;
}

/* Revisa un campo obligatorio con un largo mínimo.
   Devuelve true si está bien; si no, avisa y devuelve false. */
function revisarCampo(form, campo, minimo, mensaje) {
  // Si el formulario no trae ese campo, no hay nada que revisar.
  if (!campo) {
    return true;
  }
  // Texto más corto que el mínimo pedido: se avisa y se frena.
  if (largoTexto(campo) < minimo) {
    avisarError(form, campo, mensaje);
    return false;
  }
  // Pasó la revisión.
  return true;
}

/* Conecta un formulario con su función de validación:
   al enviarlo, si la validación falla no se envía nada. */
function protegerFormulario(id, funcionValidar) {
  // Se busca el formulario por su id en la página actual.
  var form = document.getElementById(id);
  if (!form) {
    return; /* esta página no tiene ese formulario */
  }
  // Se le engancha la revisión al momento de enviar.
  form.addEventListener('submit', function (evento) {
    // Si la función de validación dice que algo está mal…
    if (!funcionValidar(form)) {
      // …se cancela el envío: nada sale hacia el servidor.
      evento.preventDefault();
    }
  });
}

/* ===== VALIDACIÓN: PRODUCTO DE LA TIENDA =====
   Nombre obligatorio; precio y cantidad deben ser números
   enteros de cero en adelante (nada de letras ni negativos). */
function validarProducto(form) {
  // El nombre del producto es obligatorio (mínimo 2 letras);
  // si falla aquí, ya no se revisa lo demás.
  if (!revisarCampo(form, form.nombre, 2,
      'Escribe el nombre del producto (mínimo 2 letras).')) {
    return false;
  }
  // Se lee el precio como texto para poder revisarlo a mano.
  var precio = form.precio.value.trim();
  // Falla si quedó vacío, si no es un número o si es negativo:
  // en la tabla «productos» el precio va en pesos, sin centavos.
  if (precio === '' || isNaN(Number(precio)) || Number(precio) < 0) {
    avisarError(form, form.precio,
      'El precio debe ser un número de cero en adelante.');
    return false;
  }
  // La cantidad es el stock del inventario y sigue la misma regla.
  var cantidad = form.cantidad.value.trim();
  if (cantidad === '' || isNaN(Number(cantidad)) || Number(cantidad) < 0) {
    avisarError(form, form.cantidad,
      'La cantidad debe ser un número de cero en adelante.');
    return false;
  }
  // Nombre, precio y cantidad están bien: el formulario puede viajar.
  return true;
}

/* ===== VALIDACIÓN: PUBLICAR UNA PREGUNTA DEL FORO ===== */
function validarPublicar(form) {
  // Quién publica la pregunta en el foro (columna «nombre»).
  if (!revisarCampo(form, form.nombre, 2,
      'Escribe tu nombre (mínimo 2 letras).')) {
    return false;
  }
  // El título es lo que se lee en la lista de preguntas: mínimo 4.
  if (!revisarCampo(form, form.titulo, 4,
      'El título del problema necesita mínimo 4 letras.')) {
    return false;
  }
  // La explicación del problema también necesita un mínimo de detalle.
  if (!revisarCampo(form, form.contenido, 4,
      'Cuéntanos qué pasa con un poco más de detalle (mínimo 4 letras).')) {
    return false;
  }
  // Los tres campos pasaron: foro.php puede recibir la pregunta.
  return true;
}

/* ===== VALIDACIÓN: EDITAR UNA PREGUNTA DEL FORO ===== */
function validarEditar(form) {
  // Al editar no se pide el nombre: el autor de la pregunta no cambia.
  // El nuevo título debe seguir cumpliendo el mínimo de 4 letras.
  if (!revisarCampo(form, form.titulo, 4,
      'El título del problema necesita mínimo 4 letras.')) {
    return false;
  }
  // Y el contenido editado tampoco puede quedar casi vacío.
  if (!revisarCampo(form, form.contenido, 4,
      'El contenido necesita mínimo 4 letras.')) {
    return false;
  }
  return true;
}

/* ===== VALIDACIÓN: RESPONDER EN EL FORO ===== */
function validarResponder(form) {
  // Nombre de quien responde dentro del detalle de la pregunta.
  if (!revisarCampo(form, form.nombre, 2,
      'Escribe tu nombre (mínimo 2 letras).')) {
    return false;
  }
  // La respuesta no puede viajar vacía a foro_respuestas.
  if (!revisarCampo(form, form.contenido, 2,
      'Escribe tu respuesta antes de enviarla.')) {
    return false;
  }
  return true;
}

/* ===== VALIDACIÓN: COMENTARIOS DE LAS PÁGINAS ===== */
function validarComentario(form) {
  // Nombre de quien comenta en las páginas de aprendizaje.
  if (!revisarCampo(form, form.nombre, 2,
      'Escribe tu nombre (mínimo 2 letras).')) {
    return false;
  }
  // El texto del comentario es el otro campo obligatorio.
  if (!revisarCampo(form, form.contenido, 2,
      'Escribe tu comentario antes de publicarlo.')) {
    return false;
  }
  return true;
}

/* ===== VALIDACIÓN: RADICAR UNA PQR ===== */
function validarPqr(form) {
  // Nombre de la persona que radica la PQR.
  if (!revisarCampo(form, form.nombre, 2,
      'Escribe tu nombre (mínimo 2 letras).')) {
    return false;
  }
  /* El correo debe tener forma de correo: algo@algo.algo */
  // Se toma el correo escrito, sin espacios de las puntas.
  var correo = form.correo.value.trim();
  // La expresión regular pide: algo, una @, algo, un punto y algo;
  // es la misma idea que PHP refuerza con FILTER_VALIDATE_EMAIL.
  var correoOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  // Sin correo válido no se radica: es donde se avisa la respuesta.
  if (!correoOk) {
    avisarError(form, form.correo,
      'Escribe un correo válido, por ejemplo nombre@correo.com.');
    return false;
  }
  // El mensaje de la PQR necesita al menos 10 letras de explicación.
  if (!revisarCampo(form, form.mensaje, 10,
      'El mensaje necesita mínimo 10 letras para poder atenderlo.')) {
    return false;
  }
  return true;
}

/* ===== VALIDACIÓN: CONSULTAR UNA PQR ===== */
function validarConsultaPqr(form) {
  // El radicado que genera bd_pqr_crear() siempre tiene 8
  // caracteres: si trae menos, ni vale la pena consultar.
  if (!revisarCampo(form, form.consultar, 8,
      'Escribe el radicado completo (8 caracteres).')) {
    return false;
  }
  return true;
}

/* ===== CONFIRMACIÓN ANTES DE ELIMINAR =====
   Los formularios con class="form-confirmar" (borrar preguntas,
   respuestas y comentarios) muestran su mensaje de
   data-confirm y solo se envían si la persona acepta. */
function protegerConfirmaciones() {
  // Se juntan todos los formularios de eliminar de la página.
  var formularios = document.querySelectorAll('.form-confirmar');
  formularios.forEach(function (form) {
    // A cada uno se le pone su freno antes de enviar.
    form.addEventListener('submit', function (evento) {
      // El texto de la pregunta sale del data-confirm de ese
      // formulario; si no trae, se usa el genérico de respaldo.
      var mensaje = form.getAttribute('data-confirm') ||
        '¿Seguro que quieres eliminar esto?';
      // Si la persona cancela el diálogo, el borrado no viaja.
      if (!window.confirm(mensaje)) {
        evento.preventDefault();
      }
    });
  });
}

/* ===== ARRANQUE: conectar cada formulario con su validación ===== */
// Cuando el HTML terminó de cargar se conecta todo; cada
// protegerFormulario ignora en silencio los formularios que
// no existan en la página que se está viendo.
document.addEventListener('DOMContentLoaded', function () {
  // La tienda: registrar y editar productos comparten validación.
  protegerFormulario('form-producto', validarProducto);
  // El foro tiene tres formularios distintos y tres revisiones.
  protegerFormulario('form-foro-publicar', validarPublicar);
  protegerFormulario('form-foro-editar', validarEditar);
  protegerFormulario('form-foro-responder', validarResponder);
  // Los comentarios de inicio, hardware, redes y mantenimiento.
  protegerFormulario('form-comentario', validarComentario);
  // Radicar una PQR y consultar una PQR son formularios aparte.
  protegerFormulario('form-pqr', validarPqr);
  protegerFormulario('form-pqr-consulta', validarConsultaPqr);
  // Por último, el seguro de confirmación en todos los «Eliminar».
  protegerConfirmaciones();
});
