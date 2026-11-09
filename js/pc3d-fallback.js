// NVISION - PC3D: aviso si el visor 3D no arranca (sin WebGL).
// Antes era un script inline en pc3d.html; se movió aquí para que la
// página pueda usar CSP sin unsafe-inline (auditoría 2026-11-09).
// Si el visor 3D no arranca (sin WebGL), muestra el aviso.
setTimeout(function () {
  if (!window.__pcViewerReady) {
    var loading = document.getElementById('pc-viewer-loading');
    var error = document.getElementById('pc-viewer-error');
    if (loading) loading.hidden = true;
    if (error) error.hidden = false;
  }
}, 9000);
