//TODO: Error handling instead of console.warn()
//TODO: Confirmation popup when importing over something unsaved
//TODO: Chose multiple meals at the same time (weekly/daily)
/* Contants */ 
const ANIMATION_DURATION = 2500; // in ms
const TARGET_ANIMATION_FRAMERATE = 60; // in fps
const TIME_BETWEEN_FRAMES = 1000 / TARGET_ANIMATION_FRAMERATE; //in ms
const DELAY_BETWEEN_ANIMATION_AND_RESULTS = 1000; // in ms

/* Initialization */
window.onload = () => {
  recipeInput = document.getElementById('recipe-input');
  recipeContainer = document.getElementById('recipe-container');
  counterElement = document.getElementById('recipe-counter');

  for (let i = 0; i < 5; i++)
    rouletteElements.push(document.getElementById(`roulette-recipe-${i}`));
};
let recipeInput, recipeContainer, counterElement, recipeRoulette;
let rouletteElements = [];

let recipeList = [];

const reader = new FileReader();

/* Adding a recipe by pressing enter in the input */
const addRecipeInput = (event) => {
  if(event.key == 'Enter')
    addRecipeButton();
};

/* Adding a recipe by clicking the Add button next to the input */
const addRecipeButton = () => {
  if (recipeInput.value)
    addRecipe(recipeInput.value);
  
  recipeInput.value = '';
};

/* Importing a list of recipes */
const importJson = (event) => {
  const file = event.target.files[0];
  
  if (file && file.type === 'application/json')
    reader.readAsText(file); // This calls reader.onload(event)
  else
    console.warn('File must be a .json');
};

reader.onload = (event) => {
  try {
    const importedRecipeList = JSON.parse(event.target.result);
    removeAllRecipes();

    importedRecipeList.forEach((recipe) => {
      if (recipe.name && recipe.id) 
        addRecipe(recipe.name, recipe.id);
      else 
        console.warn('Invalid JSON Data');
    });
  } catch (error) {
    console.warn('Unable to parse file content');
  }
};

/* Exporting a list of recipes */
const exportJSON = (filename = 'recipe-list.json') => {
  const jsonStr = JSON.stringify(recipeList, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  
  // Creates a <a> element with the link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  
  // add it to the document clicks it, and removes it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* Picking a random recipe */
const rollForRecipe = () => {
  document.getElementById('recipe-picker').classList.add('hidden');
  document.getElementById('recipe-roulette-results').classList.add('hidden');
  document.getElementById('recipe-roulette').classList.remove('hidden');
  let shuffledRecipeList = structuredClone(recipeList);
  shuffle(shuffledRecipeList);

  rollAnimation(0, Math.floor(Math.random() * recipeList.length), shuffledRecipeList);

  setTimeout(() => rollResult(), ANIMATION_DURATION + DELAY_BETWEEN_ANIMATION_AND_RESULTS);
}

const rollAnimation = (currentTime, currentRecipeIndex, shuffledRecipeList) => {
  // Animation
  for (let i = 0; i < rouletteElements.length; i++)
    rouletteElements[i].innerHTML = shuffledRecipeList[(currentRecipeIndex + i) % shuffledRecipeList.length].name;

  // Set when we should call the function next
  delayUntilNextFrame = TIME_BETWEEN_FRAMES / invertedEaseOutQuad(currentTime / ANIMATION_DURATION) // Only takes value in ]0; ANIMATION_DURATION[

  // Stop condition: the next call would exceed animation duration
  if(currentTime + delayUntilNextFrame >= ANIMATION_DURATION)
    return;

  setTimeout(() => rollAnimation(currentTime+delayUntilNextFrame,
                                  (currentRecipeIndex + 1) % recipeList.length, 
                                  shuffledRecipeList),
              delayUntilNextFrame);
}

/* Ease out quad function to end the roulette on a slower note */
const invertedEaseOutQuad = (x) => {
  return (1 - x) * (1 - x);
}

const rollResult = () =>{
  document.getElementById('recipe-roulette').classList.add('hidden');
  document.getElementById('recipe-roulette-results').classList.remove('hidden');

  // Copying the result from the middle roulette element <h2> to the roulette's result <h2>
  document.getElementById('roulette-result').innerHTML = rouletteElements[2].innerHTML;
}

/* Recipe List CRUD */
const addRecipe = (recipeName, recipeID = crypto.randomUUID()) => {
  let div = document.createElement('div');
  div.className = 'card recipe-card p-2 m-1';
  div.innerText = recipeName;
  div.id = recipeID;
  recipeList.push({
    id: recipeID,
    name: recipeName
  });
  
  recipeContainer.appendChild(div);
  
  counterElement.innerText = `Count: ${recipeList.length}`;
};

const removeRecipe = (recipeID) => {
  const index = recipeList.findi((recipe) => recipe.id === recipeID);
  if(index > -1)
    recipeList.splice(index, 1);
  
  recipeContainer.removeChild(document.getElementById(recipeID));
}

const removeAllRecipes = () => {
  recipeList = [];
  recipeContainer.innerHTML = '';
}

/* utilities */ 

/* Shuffle an array */
const shuffle = (array) => {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
} 
