/* ============================================================
   NVISION — Validaciones de formularios (JavaScript)
   ------------------------------------------------------------
   Este archivo revisa los formularios de la versión PHP ANTES
   de que salgan del navegador: si falta un dato obligatorio o
   algo está muy corto, se cancela el envío y se muestra un
   mensaje claro junto al formulario.

   Ojo: esta validación es solo la primera barrera. PHP vuelve
   a validar todo en el servidor (foro.php e
   includes/comentarios_ctrl.php), porque la validación del
   navegador se puede saltar.

   Formularios que cuida:
     #form-producto        registrar / editar un producto
     #form-foro-publicar   publicar una pregunta del foro
     #form-foro-editar     editar una pregunta del foro
     #form-foro-responder  responder en el foro
     #form-comentario      comentarios de las páginas
     .form-carrito-cantidad  cambiar la cantidad de un ítem
                           del carrito (entero de 1 en adelante)
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
  // Nombre, precio y cantidad están bien: puede viajar.
  // (El formulario ya no trae campo de imagen: la foto no se
  // escribe a mano, así que aquí no hay nada más que revisar.)
  return true;
}

/* ===== VALIDACIÓN: CANTIDADES DEL CARRITO =====
   Cada renglón del carrito tiene su mini formulario para
   cambiar la cantidad: debe ser un número ENTERO de 1 en
   adelante (nada de 0, negativos ni decimales). El tope del
   stock lo vuelve a revisar carrito.php en el servidor. */
function validarCantidadCarrito(form) {
  // Se lee la cantidad escrita en ese renglón.
  var cantidad = form.cantidad.value.trim();
  // Number() la pasa a número y el resto % 1 detecta decimales:
  // si el resto no es 0, el número traía parte fraccionaria.
  var numero = Number(cantidad);
  if (cantidad === '' || isNaN(numero) || numero < 1 || numero % 1 !== 0) {
    avisarError(form, form.cantidad,
      'La cantidad debe ser un número entero de 1 en adelante.');
    return false;
  }
  // Cantidad buena: el formulario puede viajar a carrito.php.
  return true;
}

/* Conecta TODOS los formularios de cantidad del carrito con
   su validación (hay uno por renglón, por eso se buscan por
   clase y no por id). */
function protegerCantidadesCarrito() {
  // Se juntan los mini formularios de cantidad de la página.
  var formularios = document.querySelectorAll('.form-carrito-cantidad');
  formularios.forEach(function (form) {
    // A cada renglón se le pone su freno antes de enviar.
    form.addEventListener('submit', function (evento) {
      // Si la cantidad está mal, el envío se cancela aquí.
      if (!validarCantidadCarrito(form)) {
        evento.preventDefault();
      }
    });
  });
}

/* ===== CONFIRMACIÓN ANTES DE ELIMINAR =====
   Los formularios con class="form-confirmar" (eliminar un
   producto del inventario, vaciar el carrito) muestran su
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
  // Las cantidades del carrito (uno por ítem de carrito.php).
  protegerCantidadesCarrito();
  // Por último, el seguro de confirmación en todos los «Eliminar».
  protegerConfirmaciones();
});
