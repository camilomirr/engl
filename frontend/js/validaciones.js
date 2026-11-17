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

'use strict';

/* ===== AYUDAS GENERALES ===== */

/* Muestra el mensaje de error dentro del formulario (crea el
   párrafo la primera vez) y lleva el cursor al campo malo. */
function avisarError(form, campo, mensaje) {
  var aviso = form.querySelector('.validacion-aviso');
  if (!aviso) {
    aviso = document.createElement('p');
    aviso.className = 'validacion-aviso mejora-msg';
    var boton = form.querySelector('button[type="submit"]');
    form.insertBefore(aviso, boton);
  }
  aviso.textContent = mensaje;
  if (campo) {
    campo.focus();
  }
}

/* Quita espacios de los lados y mide el largo real del texto. */
function largoTexto(campo) {
  return campo.value.trim().length;
}

/* Revisa un campo obligatorio con un largo mínimo.
   Devuelve true si está bien; si no, avisa y devuelve false. */
function revisarCampo(form, campo, minimo, mensaje) {
  if (!campo) {
    return true;
  }
  if (largoTexto(campo) < minimo) {
    avisarError(form, campo, mensaje);
    return false;
  }
  return true;
}

/* Conecta un formulario con su función de validación:
   al enviarlo, si la validación falla no se envía nada. */
function protegerFormulario(id, funcionValidar) {
  var form = document.getElementById(id);
  if (!form) {
    return; /* esta página no tiene ese formulario */
  }
  form.addEventListener('submit', function (evento) {
    if (!funcionValidar(form)) {
      evento.preventDefault();
    }
  });
}

/* ===== VALIDACIÓN: PRODUCTO DE LA TIENDA =====
   Nombre obligatorio; precio y cantidad deben ser números
   enteros de cero en adelante (nada de letras ni negativos). */
function validarProducto(form) {
  if (!revisarCampo(form, form.nombre, 2,
      'Escribe el nombre del producto (mínimo 2 letras).')) {
    return false;
  }
  var precio = form.precio.value.trim();
  if (precio === '' || isNaN(Number(precio)) || Number(precio) < 0) {
    avisarError(form, form.precio,
      'El precio debe ser un número de cero en adelante.');
    return false;
  }
  var cantidad = form.cantidad.value.trim();
  if (cantidad === '' || isNaN(Number(cantidad)) || Number(cantidad) < 0) {
    avisarError(form, form.cantidad,
      'La cantidad debe ser un número de cero en adelante.');
    return false;
  }
  return true;
}

/* ===== VALIDACIÓN: PUBLICAR UNA PREGUNTA DEL FORO ===== */
function validarPublicar(form) {
  if (!revisarCampo(form, form.nombre, 2,
      'Escribe tu nombre (mínimo 2 letras).')) {
    return false;
  }
  if (!revisarCampo(form, form.titulo, 4,
      'El título del problema necesita mínimo 4 letras.')) {
    return false;
  }
  if (!revisarCampo(form, form.contenido, 4,
      'Cuéntanos qué pasa con un poco más de detalle (mínimo 4 letras).')) {
    return false;
  }
  return true;
}

/* ===== VALIDACIÓN: EDITAR UNA PREGUNTA DEL FORO ===== */
function validarEditar(form) {
  if (!revisarCampo(form, form.titulo, 4,
      'El título del problema necesita mínimo 4 letras.')) {
    return false;
  }
  if (!revisarCampo(form, form.contenido, 4,
      'El contenido necesita mínimo 4 letras.')) {
    return false;
  }
  return true;
}

/* ===== VALIDACIÓN: RESPONDER EN EL FORO ===== */
function validarResponder(form) {
  if (!revisarCampo(form, form.nombre, 2,
      'Escribe tu nombre (mínimo 2 letras).')) {
    return false;
  }
  if (!revisarCampo(form, form.contenido, 2,
      'Escribe tu respuesta antes de enviarla.')) {
    return false;
  }
  return true;
}

/* ===== VALIDACIÓN: COMENTARIOS DE LAS PÁGINAS ===== */
function validarComentario(form) {
  if (!revisarCampo(form, form.nombre, 2,
      'Escribe tu nombre (mínimo 2 letras).')) {
    return false;
  }
  if (!revisarCampo(form, form.contenido, 2,
      'Escribe tu comentario antes de publicarlo.')) {
    return false;
  }
  return true;
}

/* ===== VALIDACIÓN: RADICAR UNA PQR ===== */
function validarPqr(form) {
  if (!revisarCampo(form, form.nombre, 2,
      'Escribe tu nombre (mínimo 2 letras).')) {
    return false;
  }
  /* El correo debe tener forma de correo: algo@algo.algo */
  var correo = form.correo.value.trim();
  var correoOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  if (!correoOk) {
    avisarError(form, form.correo,
      'Escribe un correo válido, por ejemplo nombre@correo.com.');
    return false;
  }
  if (!revisarCampo(form, form.mensaje, 10,
      'El mensaje necesita mínimo 10 letras para poder atenderlo.')) {
    return false;
  }
  return true;
}

/* ===== VALIDACIÓN: CONSULTAR UNA PQR ===== */
function validarConsultaPqr(form) {
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
  var formularios = document.querySelectorAll('.form-confirmar');
  formularios.forEach(function (form) {
    form.addEventListener('submit', function (evento) {
      var mensaje = form.getAttribute('data-confirm') ||
        '¿Seguro que quieres eliminar esto?';
      if (!window.confirm(mensaje)) {
        evento.preventDefault();
      }
    });
  });
}

/* ===== ARRANQUE: conectar cada formulario con su validación ===== */
document.addEventListener('DOMContentLoaded', function () {
  protegerFormulario('form-producto', validarProducto);
  protegerFormulario('form-foro-publicar', validarPublicar);
  protegerFormulario('form-foro-editar', validarEditar);
  protegerFormulario('form-foro-responder', validarResponder);
  protegerFormulario('form-comentario', validarComentario);
  protegerFormulario('form-pqr', validarPqr);
  protegerFormulario('form-pqr-consulta', validarConsultaPqr);
  protegerConfirmaciones();
});
