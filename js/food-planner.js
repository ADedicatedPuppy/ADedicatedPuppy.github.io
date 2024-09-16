//TODO: Chose multiple meals at the same time (weekly/daily/custom)
/* Contants */ 
const ANIMATION_DURATION = 2500; // in ms
const TARGET_ANIMATION_FRAMERATE = 60; // in fps
const TIME_BETWEEN_FRAMES = 1000 / TARGET_ANIMATION_FRAMERATE; //in ms
const DELAY_BETWEEN_ANIMATION_AND_RESULTS = 1000; // in ms

/* Initialization */
let recipeRoulette, fadeTimeout;
let rouletteElements = [];
let weekRecipeElements = [];

let recipeList = [];

const reader = new FileReader();

const recipeInput = document.getElementById('recipe-input');
const recipeContainer = document.getElementById('recipe-container');
const counterElement = document.getElementById('recipe-counter');

for (let i = 0; i < 5; i++)
  rouletteElements.push(document.getElementById(`roulette-recipe-${i}`));

for (let i = 0; i < 14; i++)
  weekRecipeElements.push(document.getElementById(`week-recipe-${i}`));

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
    displayError('Invalid file format', 'The application only supports files with the .json extension.');
};

reader.onload = (event) => {
  try {
    const importedRecipeList = JSON.parse(event.target.result);

    importedRecipeList.forEach((recipe) => {
      if (recipe.name && recipe.id) 
        addRecipe(recipe.name, recipe.id);
      else 
      displayError('Invalid file content', 'The JSON data in this file doesn\'t match this application requirements.');
    });
  } catch (error) {
    displayError('Invalid file content', 'The file couldn\'t get parsed as a JSON file, please make sure the content is not corrupted and follows a JSON schema.');
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
  if (recipeList.length === 0) {
    displayError('Empty recipe list', 'The recipe list is empty, please add/import recipes before rolling for a recipe.');
    return;
  }

  document.getElementById('recipe-picker').classList.add('hidden');
  document.getElementById('recipe-roulette-results').classList.add('hidden');
  document.getElementById('recipe-roulette').classList.remove('hidden');
  let shuffledRecipeList = structuredClone(recipeList);
  shuffle(shuffledRecipeList);

  rollAnimation(0, Math.floor(Math.random() * recipeList.length), shuffledRecipeList);

  setTimeout(() => updateRouletteResult(), ANIMATION_DURATION + DELAY_BETWEEN_ANIMATION_AND_RESULTS);
}

const rollAnimation = (currentTime, currentRecipeIndex, shuffledRecipeList) => {
  // Animation
  for (let i = 0; i < rouletteElements.length; i++)
    rouletteElements[i].innerHTML = shuffledRecipeList[(currentRecipeIndex + i) % shuffledRecipeList.length].name;

  // Set when we should call the function next
  delayUntilNextFrame = TIME_BETWEEN_FRAMES / invertedEaseOutQuad(currentTime / ANIMATION_DURATION); // Only takes value in ]0; ANIMATION_DURATION[

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

const updateRouletteResult = () => {
  document.getElementById('recipe-roulette').classList.add('hidden');
  document.getElementById('recipe-roulette-results').classList.remove('hidden');

  // Copying the result from the middle roulette element <h2> to the roulette's result <h2>
  document.getElementById('roulette-result').innerHTML = rouletteElements[2].innerHTML;
}

/* Weekly Planning */
const createPlanning = () => {
  if (recipeList.length === 0) {
    displayError('Empty recipe list', 'The recipe list is empty, please add/import recipes before creating a planning.');
    return;
  }

  for (let i = 0; i < weekRecipeElements.length; i++)
    weekRecipeElements[i].innerHTML = recipeList[Math.floor(Math.random() * recipeList.length)].name;

  document.getElementById('create-planning-button').innerHTML = "<h3>Make another planning!</h3>";
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
