const errorCard = document.getElementById('error-card');

errorCard.addEventListener('mouseover', () => {
  clearTimeout(fadeTimeout); // Stop the timeout if hovered
  errorCard.classList.add('fade-in'); // Ensure the div remains visible
});

errorCard.addEventListener('mouseleave', () => {
  // Restart the fade-out process when mouse leaves
  fadeTimeout = setTimeout(fadeOut, 1000);
});

const fadeOut = () => {
  errorCard.classList.remove('fade-in');
  errorCard.classList.add('fade-out');
  
  fadeTimeout = setTimeout(() => {
    errorCard.classList.remove('fade-out');
    errorCard.classList.add('hidden');
  }, 5000);
}

const displayError = (title, description) => {
  errorCard.classList.remove('hidden');
  errorCard.children[0].innerHTML = `Error: ${title}`;
  errorCard.children[1].innerHTML = description;

  fadeTimeout = setTimeout(fadeOut, 5000);
}