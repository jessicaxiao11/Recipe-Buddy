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

  // add ingredients to HTML

  // add first instruction to HTML
}

showRecipe();