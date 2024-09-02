window.onload = () => {
  dishInput = document.getElementById('dish-input');
  dishContainer = document.getElementById('dish-container');
  counterElement = document.getElementById('dish-counter');
};
let dishInput, dishContainer, counterElement;
let counter = 0;

const addDishInput = (event) => {
  if(event.key == "Enter")
    addDishButton();
};

const addDishButton = () => {
  if (dishInput.value)
    addDish(dishInput.value);

  dishInput.value = '';
};

const addDish = (dishName) => {
  let div = document.createElement('div');
  div.className = 'card dish-card p-2 m-1';
  div.innerText = dishName;

  dishContainer.appendChild(div);

  counter++;
  counterElement.innerText = `Count: ${counter}`;
};
