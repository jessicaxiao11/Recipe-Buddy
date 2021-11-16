function showRecipe() {
  // parse for ingredients
  const ingredients = Array.from(document.querySelectorAll('.ingredients>ul>li'));
  var ingredientsText = []
  for (var i = 0; i < ingredients.length; i++) {
    ingredientsText.push(ingredients[i].textContent);
  }

  // parse for instructions
  const instructions = Array.from(document.querySelectorAll('.instructions>ol>li'));
  var instructionsText = []
  for (var i = 0; i < instructions.length; i++) {
    instructionsText.push(instructions[i].textContent);
  }

  // create Recipe Buddy interface

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Pattaya&display=swap';
  document.head.appendChild(link);

  // create recipe buddy overlay
  const box = document.createElement("div");
  box.id = "recipeBox";
  document.body.insertBefore(box, document.body.firstChild);

  // add recipe buddy title
  const title = document.createElement("p");
  const text = document.createTextNode("Recipe Buddy");
  title.id = "title";
  title.appendChild(text);
  box.appendChild(title);

  // add ingredients to HTML
  const ingredientsBox = document.createElement("div");
  ingredientsBox.id = "ingredientsBox";
  box.appendChild(ingredientsBox);

  // add first instruction to HTML
  const instructionsBox = document.createElement("div");
  instructionsBox.id = "instructionsBox";
  box.appendChild(instructionsBox);

  // add Add to Planner button
  const addToPlanner = document.createElement("div");
  const addToPlannerP = document.createElement("p");
  const addToPlannerText = document.createTextNode("Add to Planner");
  addToPlanner.id = "addToPlanner";
  addToPlannerP.appendChild(addToPlannerText);
  addToPlanner.appendChild(addToPlannerP);
  // addToPlanner.addEventListener('click', )
  box.appendChild(addToPlanner);
}

showRecipe();
