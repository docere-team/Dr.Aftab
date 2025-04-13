// Install Button Logic and Service Worker Registration
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

// Listen for the 'beforeinstallprompt' event
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault(); // Prevent the default install prompt
  deferredPrompt = event;
  installBtn.style.display = 'block'; // Show the custom install button
});

// When the user clicks the install button
installBtn.addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt(); // Show the native install prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null; // Reset deferredPrompt after user choice
    });
  }
});

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    }).catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
  });
}
