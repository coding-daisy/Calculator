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
    if (value && (value !== "-")) {
        return true;
    }
    return false;
}

function updateDisplay() {
  if (canBeUsedOrDisplayed(values["secondValue"])) {
    display.innerText =
      Math.round(
        values["secondValue"] *
          10 ** decimalPlaces
      ) /
      10 ** decimalPlaces;
  } else {
    display.innerText =
      Math.round(
        values["firstValue"] *
          10 ** decimalPlaces
      ) /
      10 ** decimalPlaces;
  }
}

function performCalculation() {
    // the exact values are products and therefore integers, meaning that they don't have to be converted for the addition
  let exactFirstValue =
    values["firstValue"] * 1;
  let exactSecondValue =
    values["secondValue"]* 1;
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
      throw new Error("invalid currentBinaryOperatorIndex for performing operation");
  }
  values["secondValue"] = "";
  updateDisplay();
  firstValueIsResult = false;
}

function negate(whichValue) {
    if (Number.isFinite(Number(values[whichValue]))) {
        values[whichValue] = -values[whichValue]
    } else if (values[whichValue] === "") {
        values[whichValue] = "-";
    } else if (values[whichValue] === "-") {
        values[whichValue] = "";
    } else {
        throw new Error("invalid value to be negated: " + whichValue);
    }
}

function conditionallyAppend(whichValue, integerAsString) {
    if (values[whichValue] == "0") {
        // making distinction between 0 and -0
        if (1/values[whichValue] === Infinity) {
            values[whichValue] = integerAsString;
        } else if (1/values[whichValue] === -Infinity) {
            values[whichValue] = -integerAsString;
        } 
      } else {
        values[whichValue] += integerAsString;
      }
}

function conditionallyAppendOrNegate(whichValue, integerAsStringOrUnaryOperator) {
if (integerAsStringOrUnaryOperator === "±") {
    negate(whichValue);
} else {
    conditionallyAppend(whichValue, integerAsStringOrUnaryOperator);
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

function processIntegerOrUnaryOperator(input) {
  if (currentBinaryOperatorIsArithmetic) {
    conditionallyAppendOrNegate("secondValue", input);
  } else {
    conditionallyAppendOrNegate("firstValue", input);
  }
}

function returnInputType(input) {
  if (Number.isInteger(parseInt(input)) || input == "±") {
    return "integer";
  }
  for (let i = 0; i < binaryOperatorOptions.length; i++) {
    if (binaryOperatorOptions[i] === input) {
      return i;
    }
  }
}

function traceValues() {
  console.log(
    `current binary operator: ${binaryOperatorOptions[currentBinaryOperatorIndex]} is arithmetic? ${currentBinaryOperatorIsArithmetic}`
  );
  console.log(
    `first value: ${values["firstValue"]}; secondValue: ${values["secondValue"]}`
  );
}

function processInput(input) {
  let type = returnInputType(input);
  if (Number.isInteger(type)) {
    processBinaryOperator(type);
  } else if (type == "integer") {
    processIntegerOrUnaryOperator(input);
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
