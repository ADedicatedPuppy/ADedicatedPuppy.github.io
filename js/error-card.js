const errorCard = document.getElementById('error-card');

const FADE_OUT_DELAY = 5000; // Delay between apparition and disappearance of an error card (If not hovered)
const FADE_OUT_AFTER_HOVER_DELAY = 1000; // Delay between mouseleave and disappearance of the error card 

errorCard.addEventListener('mouseover', () => {
  // Stop the fade-out process
  clearTimeout(fadeTimeout); 
  errorCard.classList.add('fade-in');
});

errorCard.addEventListener('mouseleave', () => {
  // Restart the fade-out process when mouse leaves
  fadeTimeout = setTimeout(fadeOut, FADE_OUT_AFTER_HOVER_DELAY);
});

const fadeOut = () => {
  errorCard.classList.remove('fade-in');
  errorCard.classList.add('fade-out');
  
  fadeTimeout = setTimeout(() => {
    errorCard.classList.remove('fade-out');
    errorCard.classList.add('hidden');
  }, FADE_OUT_DELAY);
}

const displayError = (title, description) => {
  errorCard.classList.remove('hidden');
  errorCard.children[0].innerHTML = `Error: ${title}`;
  errorCard.children[1].innerHTML = description;

  fadeTimeout = setTimeout(fadeOut, FADE_OUT_DELAY);
}
