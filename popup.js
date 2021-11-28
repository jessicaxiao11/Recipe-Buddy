var currInstruction = 0;
var ingredientsText = []
var instructionsText = []

function showRecipe() {
  // check if recipe view was already created
  var box = document.getElementById("recipeBox");
  if (box !== null) {
    box.setAttribute('style', 'display: block !important');
    return;
  }

  // parse for ingredients
  const ingredients = Array.from(document.querySelectorAll('.ingredients>ul>li'));
  for (var i = 0; i < ingredients.length; i++) {
    ingredientsText.push(ingredients[i].textContent);
  }

  // parse for instructions
  const instructions = Array.from(document.querySelectorAll('.instructions>ol>li'));
  for (var i = 0; i < instructions.length; i++) {
    instructionsText.push(instructions[i].textContent);
  }

  // create Recipe Buddy interface

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Pattaya&family=Ubuntu&display=swap';
  document.head.appendChild(link);

  // create recipe buddy overlay
  box = document.createElement("div");
  box.id = "recipeBox";
  document.body.insertBefore(box, document.body.firstChild);

  // add recipe buddy title
  const title = document.createElement("p");
  const text = document.createTextNode("Recipe Buddy");
  title.id = "title";
  title.appendChild(text);
  box.appendChild(title);

  // add switch option
  const switchToPlanner = document.createElement("p");
  switchToPlanner.innerHTML = "switch to planner view";
  switchToPlanner.id = "switchToPlanner";
  switchToPlanner.addEventListener("click", switchPlanner);
  box.appendChild(switchToPlanner);

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
  back.addEventListener("click", function(){changeInstruction(-1)});
  instructionsBox.appendChild(back);

  const next = document.createElement("img");
  next.src = arrow
  next.id = "next";
  next.addEventListener("click", function(){changeInstruction(1)});
  instructionsBox.appendChild(next);

  const instruction = document.createElement("div");
  instruction.id = "instruction";
  instructionsBox.appendChild(instruction);

  const instructionNum = document.createElement("p");
  instructionNum.id = "instructionNum";
  instructionNum.innerHTML = "1.";
  instruction.appendChild(instructionNum);

  const instructionText = document.createElement("p");
  instructionText.id = "instructionText";
  instructionText.innerHTML = instructionsText[0];
  instruction.appendChild(instructionText);

  // add Add to Planner button
  const addToPlanner = document.createElement("div");
  const addToPlannerP = document.createElement("p");
  addToPlannerP.id = "addToPlannerP";
  addToPlannerP.innerHTML = "Add to Planner";
  addToPlanner.id = "addToPlanner";
  addToPlanner.appendChild(addToPlannerP);
  addToPlanner.addEventListener('click', addPlanner);
  box.appendChild(addToPlanner);
}

function switchPlanner() {
  // hide recipe box
  var recipeBox = document.getElementById("recipeBox");
  recipeBox.setAttribute('style', 'display: none !important');

  // show planner view, with switch option
  showPlanner(true);
}

function switchRecipe() {
  // hide planner box
  var plannerBox = document.getElementById("plannerBox");
  plannerBox.setAttribute('style', 'display: none !important');

  // show recipe view
  showRecipe();
}

var numWeek = 1;

function showPlanner(switchOption) {
  // check if planner view was already created
  var box = document.getElementById("plannerBox");
  if (box !== null) {
    box.setAttribute('style', 'display: block !important');
    return;
  }

  // create planner box overlay
  box = document.createElement("div");
  box.id = "plannerBox";
  document.body.insertBefore(box, document.body.firstChild);

  // add recipe buddy title
  const title = document.createElement("p");
  const text = document.createTextNode("Recipe Buddy");
  title.id = "plannerTitle";
  title.appendChild(text);
  box.appendChild(title);


  // if switchOption, add switch to recipe view
  if (switchOption) {
    const switchToRecipe = document.createElement("p");
    switchToRecipe.innerHTML = "switch to recipe view";
    switchToRecipe.id = "switchToRecipe";
    switchToRecipe.addEventListener("click", switchRecipe);
    box.appendChild(switchToRecipe);
  }

  // add week, and ability to switch weeks
  const weekBox = document.createElement("div");
  weekBox.id = "weekBox";
  box.appendChild(weekBox);

  const prev = document.createElement("img");
  const arrow = chrome.runtime.getURL(`images/arrow.png`);
  prev.src = arrow;
  prev.id = "prevWeek";
  prev.addEventListener("click", function(){changeWeek(-1)});
  weekBox.appendChild(prev);

  const next = document.createElement("img");
  next.src = arrow
  next.id = "nextWeek";
  next.addEventListener("click", function(){changeWeek(1)});
  weekBox.appendChild(next);

  const week = document.createElement("p");
  week.id = "weekPlanner";
  week.innerHTML = weeks[numWeek];
  weekBox.appendChild(week);

  // display weekdays
  const weekdaysBox = document.createElement("div");
  weekdaysBox.id = "weekdays";
  box.appendChild(weekdaysBox);
  console.log("here");

  for (var i = 1; i < weekdays.length; i++) {
    console.log("blah");
    const weekday = document.createElement("div");
    weekday.className = "weekday";
    weekdaysBox.appendChild(weekday);
  }
}

function changeWeek(delta) {
  if (numWeek + delta < 1 || numWeek + delta >= weeks.length) {
    return;
  }
  numWeek += delta;
  const week = document.getElementById("weekPlanner");
  week.innerHTML = weeks[numWeek];

  const prev = document.getElementById("prevWeek");
  const next = document.getElementById("nextWeek");
  prev.style.opacity = "0.6";
  next.style.opacity = "0.6";

  if (numWeek === 1) {
    prev.style.opacity = "0.2";
  }

  if (numWeek === (weeks.length-1)) {
    next.style.opacity = "0.2";
  }
}

function changeInstruction(delta) {
  if (currInstruction + delta < 0 || currInstruction + delta >= instructionsText.length) {
    return;
  }
  currInstruction += delta;
  const instructionNum = document.getElementById("instructionNum");
  const instructionText = document.getElementById("instructionText");
  instructionNum.innerHTML = (currInstruction + 1).toString() + ".";
  instructionText.innerHTML = instructionsText[currInstruction];

  const back = document.getElementById("back");
  const next = document.getElementById("next");
  back.style.opacity = "0.6";
  next.style.opacity = "0.6";

  if (currInstruction === 0) {
    back.style.opacity = "0.2";
  }

  if (currInstruction === (instructionsText.length-1)) {
    next.style.opacity = "0.2";
  }
}

// source: https://stackoverflow.com/questions/1025693/how-to-get-next-week-date-in-javascript
Date.prototype.getNextWeekDay = function(d) {
  if (d) {
    var next = this;
    next.setDate(this.getDate() - this.getDay() + 7 + d);
    return next;
  }
}

const weeks = ["Select Week", "This Week", "Next Week"];
const weekdays = ["Select Weekday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// generate next few weeks
var now = new Date();
var nextDate = now.getNextWeekDay(1);
var nextNextDate = new Date(nextDate).getNextWeekDay(1);

for (var i=0; i < 8; i++) {
  var date = new Date(nextNextDate).getNextWeekDay(1);
  var dateString = "Week of " + date.toLocaleString('default', { month: 'short' }) + " " + date.getDate();
  weeks.push(dateString);
  nextNextDate = date;
}
console.log(weeks);

function addPlanner() {
  // hide add to planner button
  const addToPlanner = document.getElementById("addToPlanner");
  addToPlanner.style.display = "none";

  // extend size of instruction box
  const box = document.getElementById("recipeBox");
  box.setAttribute('style', 'height: 800px !important');

  // check if dropdowns already created
  var dropdowns = document.getElementById("dropdowns");
  var add = document.getElementById("add");
  if (dropdowns !== null) {
    dropdowns.style.display = "block";
    add.style.display = "block"
    return;
  }

  // add dropdowns
  dropdowns = document.createElement("div");
  dropdowns.id = "dropdowns";
  box.appendChild(dropdowns);

  const dropdownWeek = document.createElement("div");
  dropdownWeek.id = "dropdownWeek";
  dropdownWeek.className = "shortColumn";
  dropdowns.appendChild(dropdownWeek);

  const selectWeek = document.createElement("select");
  selectWeek.id = "selectWeek";
  dropdownWeek.append(selectWeek);

  for (var i=0; i < weeks.length; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.innerHTML = weeks[i];
    selectWeek.append(option);
  }

  const dropdownWeekday = document.createElement("div");
  dropdownWeekday.id = "dropdownWeekday";
  dropdownWeekday.className = "shortColumn";
  dropdowns.appendChild(dropdownWeekday);

  const selectWeekday = document.createElement("select");
  selectWeekday.id = "selectWeekday";
  dropdownWeekday.append(selectWeekday);
  for (var i=0; i < weekdays.length; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.innerHTML = weekdays[i];
    selectWeekday.append(option);
  }

  // add "Add!" button
  add = document.createElement("div");
  const addP = document.createElement("p");
  addP.innerHTML = "Add!";
  add.id = "add";
  add.appendChild(addP);
  add.addEventListener('click', submitToPlanner);
  box.appendChild(add);
}

// nested dictionary, first level is by week and next level is by weekday
var plannerDict = {};

function submitToPlanner() {
  // add recipe to planner storage
  var selectWeek = document.getElementById("selectWeek");
  var week = selectWeek.options[selectWeek.selectedIndex].value - 1;

  var selectWeekday = document.getElementById("selectWeekday");
  var weekday = selectWeekday.options[selectWeekday.selectedIndex].value - 1;

  var recipeName = (document.getElementsByClassName("post-title"))[0].innerHTML;

  if (week in plannerDict) {
    var weekRecipes = plannerDict[week];
    if (weekday in weekRecipes) {
      var weekdayRecipes = weekRecipes[weekday];
      weekdayRecipes.push(recipeName);
    } else {
      var weekdayRecipes = [recipeName];
    }

    weekRecipes[weekday] = weekdayRecipes;
    plannerDict[week] = weekRecipes;
  } else {
    var weekRecipes = {}
    weekRecipes[weekday] = [recipeName];
    plannerDict[week] = weekRecipes;
  }

  // show add to planner button
  const addToPlanner = document.getElementById("addToPlanner");
  addToPlanner.style.display = "block";

  // reset size of instruction box
  const box = document.getElementById("recipeBox");
  box.setAttribute('style', 'height: 775px !important');

  // hide dropdowns
  const dropdowns = document.getElementById("dropdowns");
  dropdowns.style.display = "none";

  // hide "Add!" button
  const add = document.getElementById("add");
  add.style.display = "none";
}

function hideBox() {
  const box = document.getElementById("recipeBox");
  box.setAttribute('style', 'display: none !important');
}


if (document.location.hostname === 'damndelicious.net') {
  showRecipe();
}