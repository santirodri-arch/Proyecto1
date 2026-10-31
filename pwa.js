(() => {
 'use strict';
 const panel = document.getElementById('pwa-instalacion');
 const button = document.getElementById('pwa-instalar');
 const status = document.getElementById('pwa-estado');
 if (!panel || !button || !status) return;
 let installPrompt = null;
 const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
 function updateDisplay() { panel.hidden = standalone(); }
 updateDisplay();
 window.matchMedia('(display-mode: standalone)').addEventListener('change', updateDisplay);
 window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  button.hidden = standalone();
 });
 button.addEventListener('click', async () => {
  if (!installPrompt) return;
  button.disabled = true;
  const prompt = installPrompt;
  installPrompt = null;
  try {
   await prompt.prompt();
   const result = await prompt.userChoice;
   status.textContent = result.outcome === 'accepted'
    ? 'Solicitud aceptada. Sigue las indicaciones del navegador para completar la instalación.'
    : 'Puedes instalarla después desde el menú del navegador.';
  } catch {
   status.textContent = 'No se pudo abrir la instalación. Usa las instrucciones de tu navegador.';
  } finally { button.hidden = true; button.disabled = false; }
 });
 window.addEventListener('appinstalled', () => {
  installPrompt = null; button.hidden = true;
  status.textContent = 'Aplicación instalada. Ya puedes abrirla desde su icono.';
  updateDisplay();
 });
 if ('serviceWorker' in navigator && window.isSecureContext) {
  navigator.serviceWorker.register(new URL('sw.js', document.baseURI), { scope: './', updateViaCache: 'none' })
   .catch(() => { status.textContent = 'No se pudo preparar la instalación. Comprueba la conexión y vuelve a abrir el sitio.'; });
 }
 window.addEventListener('offline', () => {
  status.textContent = 'Sin conexión. Los datos escritos aún no guardados permanecen solo en esta página; no la cierres ni recargues.';
 });
 window.addEventListener('online', () => {
  status.textContent = 'Conexión de red recuperada. Comprueba la confirmación del servidor al guardar.';
 });
})();
