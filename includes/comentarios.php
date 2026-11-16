<?php
/* Vista de comentarios: usa $listaComentarios del controlador
   (includes/comentarios_ctrl.php). Mismo diseño que el foro. */
?>
  <section class="container" id="comentarios" aria-label="Comentarios">
    <div class="mejora-card">
      <h2>Comentarios</h2>
      <form method="post">
        <input type="hidden" name="accion" value="comentar">
        <label class="mejora-label" for="com-nombre">Tu nombre</label>
        <input class="mejora-input" id="com-nombre" name="nombre" type="text" maxlength="60" required>
        <label class="mejora-label" for="com-mensaje">Tu comentario</label>
        <textarea class="mejora-textarea" id="com-mensaje" name="mensaje" maxlength="500" required></textarea>
        <button type="submit" class="tool-btn">Publicar comentario</button>
      </form>
      <div class="comentarios-lista">
<?php if (!$listaComentarios): ?>
        <p>Sé la primera persona en comentar esta página.</p>
<?php else: ?>
<?php foreach ($listaComentarios as $c): ?>
        <article class="foro-item">
          <h3 class="foro-q-title"><?php echo e($c['nombre']); ?></h3>
          <p class="foro-meta"><?php echo e(fecha_corta($c['created_at'])); ?></p>
          <p><?php echo e($c['mensaje']); ?></p>
        </article>
<?php endforeach; ?>
<?php endif; ?>
      </div>
    </div>
  </section>
