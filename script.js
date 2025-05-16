const binaryOperatorOptions = ["+", "-", "x", "÷", "="];
const decimalPlaces = 7;
const maxShowableLength = 10;
const maxDecimalPlaces = 4;
const display = document.querySelector("#display");
const buttonSection = document.querySelector("#buttonSection");
const integerButtonSettings = {
  backgroundColor: "rgb(82, 82, 82)",
  fontColor: "rgb(255, 255, 255)",
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

function addAttribution() {
  const calculatorSection = document.querySelector("#calculatorSection");
  const attributionText = document.createElement("div");
  attributionText.innerText = "Font of Calculator Display: Digital-7 by Style-7\nLicense: Freeware, Non-Commercial (via FONTSPACE)";
  attributionText.id = "attributionText";
  calculatorSection.appendChild(attributionText);
}

function addDisplayReflection() {
  const displaySection = document.querySelector("#displaySection");
  const reflectionBox = document.createElement("div");
  const firstDisplayReflection = document.createElement("div");
  const secondDisplayReflection = document.createElement("div");
  reflectionBox.classList.add("reflectionBox");
  firstDisplayReflection.classList.add("reflection");
  secondDisplayReflection.classList.add("reflection");
  firstDisplayReflection.id = "firstDisplayReflection";
  secondDisplayReflection.id = "secondDisplayReflection";

  displaySection.appendChild(reflectionBox);
  reflectionBox.appendChild(firstDisplayReflection);
  reflectionBox.appendChild(secondDisplayReflection);
}

function reset() {
  values["firstValue"] = 0;
  values["secondValue"] = "";
  currentBinaryOperatorIndex = 4;
  firstValueIsResult = true;
  updateDisplay(false);
}

function initializeButtonEventListeners() {
  buttonSection.addEventListener("click", (event) => {
    if (event.target.classList.contains("button")) {
      processInput(event.target.innerText);
    }
  });
}

function addButtonReflection(button) {
  const buttonReflectionBox = document.createElement("div");
  const buttonReflection = document.createElement("div");

  buttonReflectionBox.classList.add("reflectionBox");
  buttonReflection.classList.add("reflection", "buttonReflection");

  button.appendChild(buttonReflectionBox);
  buttonReflectionBox.appendChild(buttonReflection);
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

    let currentButton = document.createElement("button");
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

    addButtonReflection(currentButton);

    currentRow.appendChild(currentButton);
    buttonCounter++;
  }
  addDisplayReflection();
}

function canBeUsedOrDisplayed(value) {
  if (value !== "" && value !== "-") {
    return true;
  }
  return false;
}

function getTruncatedValue(value) {
  if (value === "ERROR" || value === "TOO LONG") {
    return value;
  }
  if (value === ".") {
    return "0.";
  }
  if (`${value}`.at(-1) === ".") {
    return (
      Math.round(value * 10 ** maxDecimalPlaces) / 10 ** maxDecimalPlaces + "."
    );
  }
  return Math.round(value * 10 ** maxDecimalPlaces) / 10 ** maxDecimalPlaces;
}

function turnIntoDisplayableValue(whichValue) {
  let truncatedValue = getTruncatedValue(values[whichValue]);
  if (Math.abs(Number(truncatedValue)).toString().length > maxShowableLength) {
    values["firstValue"] = "TOO LONG";
    return;
    // This value is only returned as the result of a calculation, since manually inputting too long numbers is not possible
  } else {
    values[whichValue] = truncatedValue;
    return;
  }
}

// hasToBeConverted is true iff the value to be displayed is a result of a calculation (and therefore might have to be truncated / be too long)
function updateDisplay(hasToBeConverted) {
  if (canBeUsedOrDisplayed(values["secondValue"])) {
    if (hasToBeConverted) {turnIntoDisplayableValue("secondValue");};
    display.innerText = values["secondValue"];
  } else {
    if (hasToBeConverted) {turnIntoDisplayableValue("firstValue");}
    display.innerText = values["firstValue"];
  }
}

function performCalculation() {
  if (values["firstValue"] === "ERROR" || values["firstValue"] === "TOO LONG") {
    values["firstValue"] = "ERROR";
    values["secondValue"] = "";
    return;
  }

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
      if (exactSecondValue === 0) {
        values["firstValue"] = "ERROR";
        values["secondValue"] = "";
        return;
      }
      values["firstValue"] = exactFirstValue / exactSecondValue;
      break;
    default:
      throw new Error(
        "invalid currentBinaryOperatorIndex for performing operation"
      );
  }
  values["secondValue"] = "";
  firstValueIsResult = false;
}

function negate(whichValue) {
  // toggling "-" / ""
  if (`${values[whichValue]}`.includes("-")) {
    // NOT setting equal to -values[whichValue] in order to keep potential "." at end
    values[whichValue] = `${values[whichValue]}`.replace("-", "");
  } else {
    // same reasoning
    values[whichValue] = `-${values[whichValue]}`;
  }
}

function appendingIsPossible(whichValue) {
  let absoluteStringValue = Math.abs(values[whichValue]).toString();
  if (absoluteStringValue.length >= maxShowableLength) {
    return false;
  }
  if (
    absoluteStringValue.includes(".") &&
    absoluteStringValue.indexOf(".") <= absoluteStringValue.length - 6
  ) {
    return false;
  }
  return true;
}

function conditionallyAppend(whichValue, integerOrDotAsString) {
  // firsty check if the first result will be overwritten, since:
  // every distinction about how to append to the existing value becomes irrelevant if it is overwritten
  if (firstValueIsResult && whichValue === "firstValue") {
    values[whichValue] = integerOrDotAsString;
    firstValueIsResult = false;
    return;
  }

  if (!appendingIsPossible(whichValue)) {
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
  updateDisplay(false);
}

function processBinaryOperator(binaryOperatorIndex) {
  if (canBeUsedOrDisplayed(values["secondValue"])) {
    performCalculation();
    updateDisplay(true);
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
    updateDisplay(false);
  } else {
    throw new Error("invalid input type");
  }
}

function initialize() {
  updateDisplay(false);
  createCalculator();
  initializeButtonEventListeners();
  addAttribution();
}

initialize();
