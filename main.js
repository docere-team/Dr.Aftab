// Funny Quotes
const quotes = [
  "Med school: where sleep goes to die!",
  "Stethoscope on my neck, chaos in my brain.",
  "Eat. Sleep. Save lives. Repeat.",
  "My hobbies include surviving viva attacks.",
  "Coffee: because adulting as a med student is hard.",
  "Diagnosing my own symptoms since 1st year.",
  "Who needs therapy when you have case logbooks?"
];

document.addEventListener('DOMContentLoaded', () => {
  const quoteElement = document.getElementById("quote");
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteElement.textContent = randomQuote;

  // Install PWA Prompt
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    setTimeout(() => {
      if (confirm("Want to install PMCH Pulse on your home screen? It helps with your clinical karma!")) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choiceResult => {
          if (choiceResult.outcome === 'accepted') {
            alert("Awesome! App is now on your screen.");
          } else {
            alert("No worries, it’s always here for you.");
          }
        });
      }
    }, 2000); // delay popup a bit
  });
});
