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

  console.log(ingredientsText);
  console.log(instructionsText);

  // create Recipe Buddy interface

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Pattaya&display=swap';
  document.head.appendChild(link);

  const box = document.createElement("div");
  box.id = "recipeBox";

  document.body.insertBefore(box, document.body.firstChild);

  const title = document.createElement("p");
  const text = document.createTextNode("Recipe Buddy");
  title.appendChild(text);
  title.style.fontFamily = "Pattaya";
  box.appendChild(title);


  // add ingredients to HTML

  // add first instruction to HTML
}

showRecipe();
