/* ============================================================
   NVISION — Configuración de la base de datos (backend)
   ------------------------------------------------------------
   Esta página ya viene conectada al proyecto de Supabase
   «nvision-nuevo». Si el equipo crea otro proyecto, basta con
   cambiar estos dos datos por los de Settings → API Keys de
   ese proyecto (Project URL y llave "anon public").
   La llave anon es pública por diseño: la seguridad la ponen
   las políticas RLS de la base de datos (ver base-de-datos/).
   ============================================================ */

window.NVISION_CONFIG = {
  SUPABASE_URL: "https://wnthvprfkujvxpfwijke.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndudGh2cHJma3VqdnhwZndpamtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ4Mzg5MzcsImV4cCI6MjExMDQxNDkzN30.gJNHXIkRkC6uQIvr-_psHbMFr7RVazSA-qj6XAgGryM"
};

window.bdConfigurada = function () {
  var c = window.NVISION_CONFIG;
  return !!(c.SUPABASE_URL && c.SUPABASE_ANON_KEY);
};
