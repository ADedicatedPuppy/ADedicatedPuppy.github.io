//TODO: Rename dish -> recipe 
//TODO: Error handling instead of console.warn()
//TODO: Confirmation popup when importing over something unsaved
window.onload = () => {
  dishInput = document.getElementById('dish-input');
  dishContainer = document.getElementById('dish-container');
  counterElement = document.getElementById('dish-counter');
};
let dishInput, dishContainer, counterElement;
let dishList = [];

const reader = new FileReader();

/* Adding a dish by pressing enter in the input */
const addDishInput = (event) => {
  if(event.key == 'Enter')
    addDishButton();
};

/* Adding a dish by clicking the Add button next to the input */
const addDishButton = () => {
  if (dishInput.value)
    addDish(dishInput.value);
  
  dishInput.value = '';
};

/* Importing a list of dishs */
const importJson = (event) => {
  const file = event.target.files[0];
  
  if (file && file.type === 'application/json')
    reader.readAsText(file); // This calls reader.onload(event) 
  else
    console.warn('File must be a .json');
};

reader.onload = (event) => {
  try {
    const importedDishList = JSON.parse(event.target.result);
    removeAllDishes();

    importedDishList.forEach((dish) => {
      if (dish.name && dish.id) 
        addDish(dish.name, dish.id);
      else 
        console.warn('Invalid JSON Data');
    });
  } catch (error) {
    console.warn('Unable to parse file content');
  }
};

/* Exporting a list of dishs */
function exportJSON(filename = 'dish-list.json') {
  const jsonStr = JSON.stringify(dishList, null, 2);
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

// Dish List CRUD
const addDish = (dishName, dishID = crypto.randomUUID()) => {
  let div = document.createElement('div');
  div.className = 'card dish-card p-2 m-1';
  div.innerText = dishName;
  div.id = dishID;
  dishList.push({
    id: dishID,
    name: dishName
  });
  
  dishContainer.appendChild(div);
  
  counterElement.innerText = `Count: ${dishList.length}`;
};

const removeDish = (dishID) => {
  const index = dishList.findIndex((dish) => dish.id === dishID);
  if(index > -1)
    dishList.splice(index, 1);
  
  dishContainer.removeChild(document.getElementById(dishID));
}

const removeAllDishes = () => {
  dishList = [];
  dishContainer.innerHTML = '';
}