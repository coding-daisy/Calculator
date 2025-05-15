const binaryOperatorOptions = ["+", "-", "x", "÷", "="];
const decimalPlaces = 5;
const display = document.querySelector("#display");
const buttonSection = document.querySelector("#buttonSection");
const integerButtonSettings = {
  backgroundColor: "rgb(82, 82, 82)",
  fontColor: "rgb(255, 255, 255",
};
const binaryOperatorButtonSettings = {
  backgroundColor: "rgb(230, 157, 12)",
  fontColor: "rgb(255, 255, 255)",
};
const otherButtonSettings = {
  backgroundColor: "rgb(174, 174, 174)",
  fontColor: "rgb(0, 0, 0)",
};
const buttonOptions = [
  "AC",
  "±",
  ".",
  "÷",
  "7",
  "8",
  "9",
  "x",
  "4",
  "5",
  "6",
  "-",
  "1",
  "2",
  "3",
  "+",
  "0",
  "=",
];

let currentBinaryOperatorIndex = 4;
let currentBinaryOperatorIsArithmetic = false;
// value added, so that results can ...
// be overwritten if different integers are inputted afterwards
// be used if an operator is used afterwards
let firstValueIsResult = true;
let values = {
  firstValue: "0",
  secondValue: "",
};

function addDecoration() {
  const displaySection = document.querySelector("#displaySection");
  const reflectionBox = document.createElement("div");
  const firstReflection = document.createElement("div");
  const secondReflection = document.createElement("div");
  reflectionBox.id = "reflectionBox";
  firstReflection.classList.add("reflection");
  secondReflection.classList.add("reflection");
  firstReflection.id = "firstReflection";
  secondReflection.id = "secondReflection";

  displaySection.appendChild(reflectionBox);
  reflectionBox.appendChild(firstReflection);
  reflectionBox.appendChild(secondReflection);
}

function reset() {
  values["firstValue"] = 0;
  values["secondValue"] = "";
  currentBinaryOperatorIndex = 4;
  isResult = true;
}

function initializeButtonEventListeners() {
  buttonSection.addEventListener("click", (event) => {
    if (event.target.classList.contains("button")) {
      processInput(event.target.innerText);
    }
  });
}

function createCalculator() {
  let buttonCounter = 1;
  let currentRow;
  for (let buttonName of buttonOptions) {
    // create new row after 4 'button-entities'
    if ((buttonCounter - 1) % 4 === 0) {
      currentRow = document.createElement("div");
      currentRow.classList.add("buttonRow");
      buttonSection.appendChild(currentRow);
    }

    currentButton = document.createElement("button");
    currentButton.classList.add("button");
    currentButton.innerText = buttonName;

    let currentButtonSettings;
    if (Number.isInteger(parseInt(buttonName))) {
      currentButtonSettings = integerButtonSettings;
    } else if (binaryOperatorOptions.includes(buttonName)) {
      currentButtonSettings = binaryOperatorButtonSettings;
    } else {
      currentButtonSettings = otherButtonSettings;
    }
    currentButton.style.color = currentButtonSettings.fontColor;
    currentButton.style.backgroundColor = currentButtonSettings.backgroundColor;
    if (buttonName === "0") {
      currentButton.style.width = "75%";
    } else {
      currentButton.style.width = "25%";
    }

    currentRow.appendChild(currentButton);
    buttonCounter++;
  }
}

function canBeUsedOrDisplayed(value) {
  if (value && value !== "-") {
    return true;
  }
  return false;
}

function getDisplayValue(value) {
  if (value === ".") {
    return "0.";
  }
  if (`${value}`.at(-1) === ".") {
    return Math.round(value * 10 ** decimalPlaces) / 10 ** decimalPlaces + ".";
  }

  return Math.round(value * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}

function updateDisplay() {
  if (canBeUsedOrDisplayed(values["secondValue"])) {
    display.innerText = getDisplayValue(values["secondValue"]);
  } else {
    display.innerText = getDisplayValue(values["firstValue"]);
  }
}

function performCalculation() {
  // the exact values are products and therefore integers, meaning that they don't have to be converted for the addition
  let exactFirstValue = values["firstValue"] * 1;
  let exactSecondValue = values["secondValue"] * 1;
  switch (currentBinaryOperatorIndex) {
    case 0:
      values["firstValue"] = exactFirstValue + exactSecondValue;
      break;
    case 1:
      values["firstValue"] = exactFirstValue - exactSecondValue;
      break;
    case 2:
      values["firstValue"] = exactFirstValue * exactSecondValue;
      break;
    case 3:
      values["firstValue"] = exactFirstValue / exactSecondValue;
      break;
    default:
      throw new Error(
        "invalid currentBinaryOperatorIndex for performing operation"
      );
  }
  values["secondValue"] = "";
  updateDisplay();
  firstValueIsResult = false;
}

function negate(whichValue) {
  if (Number.isFinite(Number(values[whichValue]))) {
    // toggling "-" / ""
    if (`${values[whichValue]}`.includes("-")) {
      // NOT setting equal to -values[whichValue] in order to keep potential "." at end
      values[whichValue] = `${values[whichValue]}`.replace("-", "");
    } else {
      // same reasoning
      values[whichValue] = `-${values[whichValue]}`;
    }
  } else if (values[whichValue] === "") {
    values[whichValue] = "-";
  } else if (values[whichValue] === "-") {
    values[whichValue] = "";
  } else {
    throw new Error("invalid value to be negated: " + whichValue);
  }
}

function conditionallyAppend(whichValue, integerOrDotAsString) {
  //firsty check if the first result will be overwritten, since:
  // every distinction about how to append to the existing value becomes irrelevant if it is overwritten
  if (firstValueIsResult && whichValue === "firstValue") {
    values[whichValue] = integerOrDotAsString;
    firstValueIsResult = false;
    return;
  }

  if (integerOrDotAsString === ".") {
    if (`${values[whichValue]}`.includes(".")) {
      return;
    }
    values[whichValue] += ".";
    return;
  }

  if (values[whichValue] == "0") {
    // making distinction between 0 and -0
    if (1 / values[whichValue] === Infinity) {
      values[whichValue] = integerOrDotAsString;
    } else if (1 / values[whichValue] === -Infinity) {
      values[whichValue] = -integerOrDotAsString;
    }
  } else {
    values[whichValue] += integerOrDotAsString;
  }
}

function conditionallyAppendOrNegate(whichValue, string) {
  if (string === "±") {
    negate(whichValue);
  } else {
    conditionallyAppend(whichValue, string);
  }
  updateDisplay();
}

function processBinaryOperator(binaryOperatorIndex) {
  if (canBeUsedOrDisplayed(values["secondValue"])) {
    performCalculation();
  } else if (currentBinaryOperatorIndex !== 4) {
    // if the previous operator wasn't "=",  a prefix of "-" have been set for the second value.
    // In that case, when the operator is changed, this prefix has to be discarded.
    values["secondValue"] = "";
  }

  currentBinaryOperatorIndex = binaryOperatorIndex;

  if (currentBinaryOperatorIndex === 4) {
    currentBinaryOperatorIsArithmetic = false;
    firstValueIsResult = true;
  } else {
    currentBinaryOperatorIsArithmetic = true;
  }
}

function processIntegerOrDotOrUnaryOperator(input) {
  if (currentBinaryOperatorIsArithmetic) {
    conditionallyAppendOrNegate("secondValue", input);
  } else {
    conditionallyAppendOrNegate("firstValue", input);
  }
}

function returnInputType(input) {
  if (Number.isInteger(parseInt(input)) || input == "±" || input == ".") {
    return "notOperator";
  }
  if (input === "AC") {
    return "AC";
  }
  for (let i = 0; i < binaryOperatorOptions.length; i++) {
    if (binaryOperatorOptions[i] === input) {
      return i;
    }
  }
}

function processInput(input) {
  let type = returnInputType(input);
  if (Number.isInteger(type)) {
    processBinaryOperator(type);
  } else if (type == "notOperator") {
    processIntegerOrDotOrUnaryOperator(input);
  } else if (type == "AC") {
    reset();
    updateDisplay();
  } else {
    throw new Error("invalid input type");
  }
}

function initialize() {
  updateDisplay();
  createCalculator();
  initializeButtonEventListeners();
  addDecoration();
}

initialize();
