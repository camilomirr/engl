<?php
/* ============================================================
   NVISION — Vista de comentarios (se incluye en las páginas)
   ------------------------------------------------------------
   Muestra el formulario para comentar y la lista de comentarios
   de la página. Usa $listaComentarios, que prepara el
   controlador (includes/comentarios_ctrl.php). Cada comentario
   trae su botón «Eliminar», que manda la orden de borrado al
   mismo controlador por POST (con confirmación en JavaScript,
   ver frontend/js/validaciones.js). Mismo diseño que el foro.
   ============================================================ */
?>
  <section class="container" id="comentarios" aria-label="Comentarios">
    <div class="mejora-card">
      <h2>Comentarios</h2>
      <!-- CREAR: formulario de comentario nuevo -->
      <!-- Sin action: el POST vuelve a la misma página, donde el controlador ya está esperando -->
      <form method="post" id="form-comentario">
        <!-- La acción «comentar» es la que comentarios_ctrl.php reconoce para guardar -->
        <input type="hidden" name="accion" value="comentar">
        <label class="mejora-label" for="com-nombre">Tu nombre</label>
        <!-- Nombre de quien comenta: 60 es el tamaño de la columna «nombre» -->
        <input class="mejora-input" id="com-nombre" name="nombre" type="text" maxlength="60" required>
        <label class="mejora-label" for="com-mensaje">Tu comentario</label>
        <!-- El texto del comentario admite hasta 500 caracteres, como la columna «contenido» -->
        <textarea class="mejora-textarea" id="com-mensaje" name="contenido" maxlength="500" required></textarea>
        <button type="submit" class="tool-btn">Publicar comentario</button>
      </form>
      <!-- CONSULTAR: lista de comentarios de la página -->
      <div class="comentarios-lista">
<?php if (!$listaComentarios): ?>
        <!-- Esta página todavía no tiene filas en la tabla comentarios -->
        <p>Sé la primera persona en comentar esta página.</p>
<?php else: ?>
<?php foreach ($listaComentarios as $c): ?>
        <!-- Tarjeta de UN comentario: nombre, fecha corta y texto, todo escapado con e() -->
        <article class="foro-item">
          <h3 class="foro-q-title"><?php echo e($c['nombre']); ?></h3>
          <p class="foro-meta"><?php echo e(fecha_corta($c['fecha'])); ?></p>
          <p><?php echo e($c['contenido']); ?></p>
          <!-- ELIMINAR este comentario -->
          <!-- Mini formulario propio por comentario: la clase form-confirmar activa el «¿Seguro?» de validaciones.js -->
          <form method="post" class="form-confirmar" data-confirm="¿Seguro que quieres eliminar este comentario?">
            <input type="hidden" name="accion" value="eliminar_comentario">
            <!-- El id oculto es el que el controlador convierte a entero para borrar justo esta fila -->
            <input type="hidden" name="comentario_id" value="<?php echo e($c['id']); ?>">
            <button type="submit" class="tool-btn tool-btn-ghost">Eliminar</button>
          </form>
        </article>
<?php endforeach; ?>
<?php endif; ?>
      </div>
    </div>
  </section>
