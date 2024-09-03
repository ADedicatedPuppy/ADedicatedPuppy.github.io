//TODO: Error handling instead of console.warn()
//TODO: Confirmation popup when importing over something unsaved
window.onload = () => {
  recipeInput = document.getElementById('recipe-input');
  recipeContainer = document.getElementById('recipe-container');
  counterElement = document.getElementById('recipe-counter');
};
let recipeInput, recipeContainer, counterElement;
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
function exportJSON(filename = 'recipe-list.json') {
  const jsonStr = JSON.stringify(recipeList, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  
  // Creates a <a> element with the link
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  
  // add it to the document clicks it, and removes it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Recipe List CRUD
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
  const index = recipeList.findIndex((recipe) => recipe.id === recipeID);
  if(index > -1)
    recipeList.splice(index, 1);
  
  recipeContainer.removeChild(document.getElementById(recipeID));
}

const removeAllRecipes = () => {
  recipeList = [];
  recipeContainer.innerHTML = '';
}