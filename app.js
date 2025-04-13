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
document.getElementById('logbookForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get form data
  const caseTitle = document.getElementById('caseTitle').value;
  const diagnosis = document.getElementById('diagnosis').value;
  const treatmentPlan = document.getElementById('treatmentPlan').value;
  const outcome = document.getElementById('outcome').value;
  const reflectionNotes = document.getElementById('reflectionNotes').value;
  
  // Get uploaded images
  const imageUpload = document.getElementById('imageUpload').files;

  // Display images in gallery (for now, just local display)
  const imageGallery = document.getElementById('imageGallery');
  imageGallery.innerHTML = ''; // Clear gallery before showing new images

  Array.from(imageUpload).forEach((file) => {
    const reader = new FileReader();
    reader.onload = function () {
      const img = document.createElement('img');
      img.src = reader.result;
      imageGallery.appendChild(img);
    };
    reader.readAsDataURL(file);
  });

  // You would typically send the form data to your server or Firebase here
  console.log('Clinical case saved:', { caseTitle, diagnosis, treatmentPlan, outcome, reflectionNotes, imageUpload });

  // Reset the form
  document.getElementById('logbookForm').reset();
});
