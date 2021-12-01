// Reference for google extension usage: https://github.com/sean-public/RecipeFilter/tree/master/src/js

/* Inject css/font stylesheets */
if (!document.getElementById("cssStylesheet")) {
  var link = document.createElement("link");
  link.href = chrome.runtime.getURL(`popup.css`);
  link.type = "text/css";
  link.id = "cssStylesheet";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
}

if (!document.getElementById("fontStylesheet")) {
  var font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Montserrat&family=Pattaya&family=Ubuntu&display=swap';
  font.id = "fontStylesheet";
  document.head.appendChild(font);
}

/* Data Initialization */
var currInstruction = 0;
var ingredientsText = []
var instructionsText = []
var numWeek = 1;

// plannerDict: stores recipes added to planner
// format: nested dictionary, first level is by week and next level is by weekday
chrome.storage.sync.get(['plannerDict'], function(result) {
  if (result['plannerDict'] === undefined) {
    chrome.storage.sync.set({'plannerDict': {}})
  }
});

// populate weekdays and next few weeks
var weekdays = ["Select Weekday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var weeks = ["Select Week"];

// source: https://stackoverflow.com/questions/1025693/how-to-get-next-week-date-in-javascript
Date.prototype.getNextStart = function() {
  var next = this;
  next.setDate(this.getDate() - this.getDay() + 7 + 1);
  return next;
}

Date.prototype.startOfWeek = function() {
  var next = this;
  next.setDate(this.getDate() - this.getDay() + 1);
  return next;
}

var now = new Date();
var date = now.startOfWeek();
var dateString = "Week of " + date.toLocaleString('default', { month: 'short' }) + " " + date.getDate();
weeks.push(dateString);

for (var i=0; i < 9; i++) {
  date = new Date(date).getNextStart();
  dateString = "Week of " + date.toLocaleString('default', { month: 'short' }) + " " + date.getDate();
  weeks.push(dateString);
}




/* Show extension popup */
showRecipe();

/* Show the recipe popup. If page has no recipe, we default to showing the
 * planner view. */
function showRecipe() {
  // If recipe view already created, then just reveal it
  var box = document.getElementById("recipeBox");
  if (box !== null) {
    box.setAttribute('style', 'display: block !important');
    return;
  }

  // Parse ingredients/instructions
  const ingredients = Array.from(document.querySelectorAll('.ingredients>ul>li, .wprm-recipe-ingredient-group>ul>li'));
  // If no recipe found, show planner view
  if (ingredients.length === 0) {
    showPlanner(false);
    return;
  }
  for (var i = 0; i < ingredients.length; i++) {
    ingredientsText.push(ingredients[i].textContent);
  }

  const instructions = Array.from(document.querySelectorAll('.instructions>ol>li, .wprm-recipe-instruction-group>ul>li'));
  for (var i = 0; i < instructions.length; i++) {
    instructionsText.push(instructions[i].textContent);
  }


  // Create Recipe Buddy HTML interface
  box = document.createElement("div");
  box.id = "recipeBox";
  document.body.insertBefore(box, document.body.firstChild);

  // Add recipe buddy title
  const title = document.createElement("h1");
  const text = document.createTextNode("Recipe Buddy");
  title.id = "title";
  title.appendChild(text);
  box.appendChild(title);

  // Add switch option
  const switchToPlanner = document.createElement("h3");
  switchToPlanner.innerHTML = "switch to planner view";
  switchToPlanner.id = "switchToPlanner";
  switchToPlanner.addEventListener("click", switchPlanner);
  box.appendChild(switchToPlanner);

  // Add close option
  const close = document.createElement("p");
  close.innerHTML = "&#x2715";
  close.id = "closeRecipe";
  close.addEventListener("click", closeRecipe);
  box.appendChild(close);

  // Add ingredients to HTML
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

  // Add first instruction to HTML
  const instructionsBox = document.createElement("div");
  instructionsBox.id = "instructionsBox";
  box.appendChild(instructionsBox);

  const back = document.createElement("img");
  const arrow = chrome.runtime.getURL(`images/arrow.png`);
  back.alt = "back arrow for instructions";
  back.src = arrow;
  back.id = "back";
  back.addEventListener("click", function(){changeInstruction(-1)});
  instructionsBox.appendChild(back);

  const next = document.createElement("img");
  next.alt = "next arrow for instructions";
  next.src = arrow
  next.id = "next";
  next.addEventListener("click", function(){changeInstruction(1)});
  instructionsBox.appendChild(next);

  const instructionNum = document.createElement("h2");
  instructionNum.id = "instructionNum";
  instructionNum.innerHTML = "1.";
  instructionsBox.appendChild(instructionNum);

  const instructionText = document.createElement("p");
  instructionText.id = "instructionText";
  instructionText.innerHTML = instructionsText[0];
  instructionsBox.appendChild(instructionText);

  // Add Add to Planner button
  const addToPlanner = document.createElement("div");
  const addToPlannerHeading = document.createElement("h3");
  addToPlannerHeading.id = "addToPlannerHeading";
  addToPlannerHeading.innerHTML = "Add to Planner";
  addToPlanner.id = "addToPlanner";
  addToPlanner.appendChild(addToPlannerHeading);
  addToPlanner.addEventListener('click', addPlanner);
  box.appendChild(addToPlanner);
}

/* Hide recipe box if user chooses to close out of the popup */
function closeRecipe() {
  var recipeBox = document.getElementById("recipeBox");
  recipeBox.setAttribute('style', 'display: none !important');
}

/* Hide planner box if user chooses to close out of the popup */
function closePlanner() {
  var plannerBox = document.getElementById("plannerBox");
  plannerBox.setAttribute('style', 'display: none !important');
  numWeek = 1;
}

/* Switch from recipe view to planner view */
function switchPlanner() {
  // hide recipe box
  closeRecipe();

  // show planner view, with switch option
  showPlanner(true);
}

/* Switch from planner view to recipe view */
function switchRecipe() {
  // hide planner box
  closePlanner();

  // show recipe view
  showRecipe();
}

/* Show planner popup. If switchOption == true, user will have access to a 
 * button to switch back a recipe view. */
function showPlanner(switchOption) {
  // If planner view already created, delete the box. We want to reproduce this
  // the view, since planner could have changed.
  var box = document.getElementById("plannerBox");
  if (box !== null) {
    if (box.parentNode) {
      box.parentNode.removeChild(box);
    }
  }

  // Create planner box overlay
  box = document.createElement("div");
  box.id = "plannerBox";
  document.body.insertBefore(box, document.body.firstChild);

  // Add recipe buddy title
  const title = document.createElement("h1");
  const text = document.createTextNode("Recipe Buddy");
  title.id = "plannerTitle";
  title.appendChild(text);
  box.appendChild(title);


  // If switchOption, add switch to recipe view
  if (switchOption) {
    const switchToRecipe = document.createElement("h3");
    switchToRecipe.innerHTML = "switch to recipe view";
    switchToRecipe.id = "switchToRecipe";
    switchToRecipe.addEventListener("click", switchRecipe);
    box.appendChild(switchToRecipe);
  }

  // Add close option
  const close = document.createElement("p");
  close.innerHTML = "&#x2715";
  close.id = "closePlanner";
  close.addEventListener("click", closePlanner);
  box.appendChild(close);

  // Add week, and ability to switch weeks
  const weekBox = document.createElement("div");
  weekBox.id = "weekBox";
  box.appendChild(weekBox);

  const prev = document.createElement("img");
  const arrow = chrome.runtime.getURL(`images/arrow.png`);
  prev.alt = "back arrow for week in planner";
  prev.src = arrow;
  prev.id = "prevWeek";
  prev.addEventListener("click", function(){changeWeek(-1)});
  weekBox.appendChild(prev);

  const next = document.createElement("img");
  next.alt = "next arrow for week in planner";
  next.src = arrow
  next.id = "nextWeek";
  next.addEventListener("click", function(){changeWeek(1)});
  weekBox.appendChild(next);

  const week = document.createElement("h4");
  week.id = "weekPlanner";
  week.innerHTML = weeks[numWeek];
  weekBox.appendChild(week);

  // add weekdays and recipes for each day
  drawWeekdays();
}

/* Change the week that is displayed in the planner. delta represents how much
 * to change (i.e. delta = -1 would mean we go back one week) */
function changeWeek(delta) {
  // Out of bounds check
  if (numWeek + delta < 1 || numWeek + delta >= weeks.length) {
    return;
  }
  // Modify data and displayed HTML
  numWeek += delta;
  const week = document.getElementById("weekPlanner");
  week.innerHTML = weeks[numWeek];

  // Set correct opacity for prev/next arrows
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

  // redraw recipes for each day
  drawWeekdays();
}

/* Draw HTML that displays recipes for each day of the week in the planner */
function drawWeekdays() {
  // Remove old weekdays if one existed
  var weekdaysBox = document.getElementById("weekdays");
  if (weekdaysBox) {
    if (weekdaysBox.parentNode) {
      weekdaysBox.parentNode.removeChild(weekdaysBox);
    }
  }

  // Display weekdays
  weekdaysBox = document.createElement("div");
  weekdaysBox.id = "weekdays";
  const box = document.getElementById("plannerBox");
  box.appendChild(weekdaysBox);

  // Retrieve plannerDict data
  chrome.storage.sync.get(['plannerDict'], function(result) {
    var plannerDict = result["plannerDict"];
    if (plannerDict === undefined) {
      plannerDict = {};
    }

    // Populate each day
    for (var i = 1; i < weekdays.length; i++) {
      const weekday = document.createElement("div");
      weekday.className = "weekday";
      if (i === weekdays.length - 1) {
        weekday.id = "lastWeekday";
      }
      weekdaysBox.appendChild(weekday);
  
      // Create p element for weekday
      const weekdayHeading = document.createElement("h3");
      weekdayHeading.innerHTML = weekdays[i];
      weekdayHeading.className = "weekdayHeading";
      weekday.appendChild(weekdayHeading);

      var weekString = weeks[numWeek];
      
      // Add recipes if there are any for that day
      if (weekString in plannerDict && i in plannerDict[weekString]) {
        var currRecipes = plannerDict[weekString][i];
        for (var j = 0; j < currRecipes.length; j++) {
          var recipeName = currRecipes[j][0];
          const recipeURL = currRecipes[j][1];
  
          const recipeDiv = document.createElement("div");
          recipeDiv.className = "recipeDiv";
          recipeDiv.addEventListener('click', function() {window.location.href=recipeURL;});
          const recipeDivP = document.createElement("p");
          recipeDivP.className = "recipeDivP";
          recipeDivP.innerHTML = recipeName;
          weekday.appendChild(recipeDiv);
          recipeDiv.appendChild(recipeDivP);
        }
      }
    }
  });
}

/* Change the instruction that is displayed in the recipe view. delta represents how much
 * to change (i.e. delta = -1 would mean we go back one week) */
function changeInstruction(delta) {
  // Out of bounds check
  if (currInstruction + delta < 0 || currInstruction + delta >= instructionsText.length) {
    return;
  }

  // Modify data and HTML
  currInstruction += delta;
  const instructionNum = document.getElementById("instructionNum");
  const instructionText = document.getElementById("instructionText");
  instructionNum.innerHTML = (currInstruction + 1).toString() + ".";
  instructionText.innerHTML = instructionsText[currInstruction];

  // Set correct opacity for back/next arrows
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

/* Modify interface so user can add recipe to planner after they click 
 * "Add To Planner" */
function addPlanner() {
  // Hide add to planner button
  const addToPlanner = document.getElementById("addToPlanner");
  addToPlanner.style.display = "none";

  // Check if dropdowns already created, return if so
  var dropdowns = document.getElementById("dropdowns");
  var add = document.getElementById("add");
  if (dropdowns !== null) {
    dropdowns.style.display = "block";
    add.style.display = "block"
    return;
  }

  // Add dropdowns
  const box = document.getElementById("recipeBox");
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
    option.value = weeks[i];
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

  // Add "Add!" button
  add = document.createElement("div");
  const addHeading = document.createElement("h3");
  addHeading.innerHTML = "Add!";
  add.id = "add";
  add.appendChild(addHeading);
  add.addEventListener('click', submitToPlanner);
  box.appendChild(add);
}

/* Persist recipe to plannerDict after user clicks "Add!", and revert to 
 * original recipe interface */
function submitToPlanner() {
  // Add recipe to planner storage
  var selectWeek = document.getElementById("selectWeek");
  var week = selectWeek.options[selectWeek.selectedIndex].value;
  selectWeek.selectedIndex = 0;

  var selectWeekday = document.getElementById("selectWeekday");
  var weekday = selectWeekday.options[selectWeekday.selectedIndex].value;
  selectWeekday.selectedIndex = 0;

  var recipeName = (document.getElementsByClassName("post-title"))[0].innerHTML;
  var recipeURL = window.location.toString();

  chrome.storage.sync.get(['plannerDict'], function(result) {
    var plannerDict = result['plannerDict'];
    if (plannerDict === undefined) {
      plannerDict = {};
    }

    if (week in plannerDict) {
      var weekRecipes = plannerDict[week];
      if (weekday in weekRecipes) {
        var weekdayRecipes = weekRecipes[weekday];
        weekdayRecipes.push([recipeName, recipeURL]);
      } else {
        var weekdayRecipes = [[recipeName, recipeURL]];
      }
  
      weekRecipes[weekday] = weekdayRecipes;
      plannerDict[week] = weekRecipes;
    } else {
      var weekRecipes = {};
      weekRecipes[weekday] = [[recipeName, recipeURL]];
      plannerDict[week] = weekRecipes;
    }
  
    chrome.storage.sync.set({"plannerDict": plannerDict});    
  });

  // Show add to planner button
  const addToPlanner = document.getElementById("addToPlanner");
  addToPlanner.style.display = "block";

  // Hide dropdowns
  const dropdowns = document.getElementById("dropdowns");
  dropdowns.style.display = "none";

  // Hide "Add!" button
  const add = document.getElementById("add");
  add.style.display = "none";
}
