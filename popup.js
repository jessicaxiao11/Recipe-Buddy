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
  link.href = 'https://fonts.googleapis.com/css2?family=Pattaya&family=Ubuntu&display=swap';
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

  const ingredientsLeft = document.createElement("div");
  ingredientsLeft.id = "ingredientsLeft";
  ingredientsLeft.className = "column";
  ingredientsBox.appendChild(ingredientsLeft);

  const ingredientsRight = document.createElement("div");
  ingredientsRight.id = "ingredientsRight";
  ingredientsRight.className = "column";
  ingredientsBox.appendChild(ingredientsRight);

  const mid = Math.ceil(ingredientsText.length / 2);
  console.log(ingredientsText);
  console.log(mid);
  for (var i = 0; i < mid; i++) {
    const label = document.createElement("label");
    label.className = "ingredientsLabel";
    const input = document.createElement("input");
    input.type = "checkbox";
    const text = document.createTextNode(ingredientsText[i]);
    ingredientsLeft.appendChild(label);
    label.appendChild(input);
    label.appendChild(text);
    const br = document.createElement("br");
    ingredientsLeft.appendChild(br);
  }

  for (var i = mid; i < ingredientsText.length; i++) {
    const label = document.createElement("label");
    label.className = "ingredientsLabel";
    const input = document.createElement("input");
    input.type = "checkbox";
    const text = document.createTextNode(ingredientsText[i]);
    ingredientsRight.appendChild(label);
    label.appendChild(input);
    label.appendChild(text);
    const br = document.createElement("br");
    ingredientsRight.appendChild(br);
  }

  // add first instruction to HTML
  const instructionsBox = document.createElement("div");
  instructionsBox.id = "instructionsBox";
  box.appendChild(instructionsBox);

  const back = document.createElement("img");
  const arrow = chrome.runtime.getURL(`images/arrow.png`);
  back.src = arrow;
  back.id = "back";
  instructionsBox.appendChild(back);

  const next = document.createElement("img");
  next.src = arrow
  next.id = "next";
  instructionsBox.appendChild(next);

  const instruction = document.createElement("div");
  instruction.id = "instruction";
  instructionsBox.appendChild(instruction);

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

if (document.location.hostname === 'damndelicious.net') {
  showRecipe();
}