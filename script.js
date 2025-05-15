const operatorOptions = ["+", "-", "x", "÷", "="];
const decimalPlaces = 5;
const display = document.querySelector("#display");
const buttonSection = document.querySelector("#buttonSection");
const integerButtonSettings = {
  backgroundColor: "rgb(82, 82, 82)",
  fontColor: "rgb(255, 255, 255",
};
const operatorButtonSettings = {
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

let currentOperatorIndex = 4;
let currentOperatorIsArithmetic = false;
// value added, so that results can ...
// be overwritten if different integers are inputted afterwards
// be used if an operator is used afterwards
let firstValueIsResult = true;
let values = { firstValue: "0", secondValue: "" };

function initializeButtonEventListeners() {
    buttonSection.addEventListener('click', (event) => {
        if (event.target.classList.contains("button")) {
            processInput(event.target.innerText);
        }
    })
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
        currentButtonSettings =  integerButtonSettings;
    } else if (operatorOptions.includes(buttonName)) {
        currentButtonSettings = operatorButtonSettings;
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

function updateDisplay() {
  if (values["secondValue"] !== "") {
    display.innerText =
      Math.round(values["secondValue"] * 10 ** decimalPlaces) /
      10 ** decimalPlaces;
  } else {
    display.innerText =
      Math.round(values["firstValue"] * 10 ** decimalPlaces) /
      10 ** decimalPlaces;
  }
}

function performCalculation() {
  switch (currentOperatorIndex) {
    case 0:
      values["firstValue"] = +values["firstValue"] + +values["secondValue"];
      break;
    case 1:
      values["firstValue"] = values["firstValue"] - values["secondValue"];
      break;
    case 2:
      values["firstValue"] = values["firstValue"] * values["secondValue"];
      break;
    case 3:
      values["firstValue"] = values["firstValue"] / values["secondValue"];
      break;
    default:
      throw new Error("invalid operatorOptionsIndex for performing ");
  }
  values["secondValue"] = "";
  updateDisplay();
}

// the index is 0/1 if the first/second value should be changed
function conditionallyAppend(whichValue, integerToBeAddedAsString) {
  if (values[whichValue] === "0" || firstValueIsResult) {
    values[whichValue] = integerToBeAddedAsString;
    firstValueIsResult = false;
  } else {
    values[whichValue] += integerToBeAddedAsString;
  }
  updateDisplay();
}

function processOperator(operatorOptionsIndex) {
  if (values["secondValue"]) {
    performCalculation();
  }

  if (operatorOptionsIndex === 4) {
    currentOperatorIsArithmetic = false;
    firstValueIsResult = true;
  } else {
    currentOperatorIsArithmetic = true;
    firstValueIsResult = false;
  }

  currentOperatorIndex = operatorOptionsIndex;
}

function processInteger(input) {
  if (currentOperatorIsArithmetic) {
    conditionallyAppend("secondValue", input);
  } else {
    conditionallyAppend("firstValue", input);
  }
}

function returnInputType(input) {
  if (Number.isInteger(parseInt(input))) {
    return "integer";
  }
  for (let i = 0; i < operatorOptions.length; i++) {
    if (operatorOptions[i] === input) {
      return i;
    }
  }
}

function traceValues() {
  console.log(
    `current operator: ${operatorOptions[currentOperatorIndex]} is arithmetic? ${currentOperatorIsArithmetic}`
  );
  console.log(
    `first value: ${values["firstValue"]}; secondValue: ${values["secondValue"]}`
  );
}

function processInput(input) {
  let type = returnInputType(input);
  if (Number.isInteger(type)) {
    processOperator(type);
  } else if (type == "integer") {
    processInteger(input);
  } else {
    throw new Error("invalid input");
  }

  traceValues();
}

function initialize() {
  updateDisplay();
  createCalculator();
  initializeButtonEventListeners();
}

initialize();
