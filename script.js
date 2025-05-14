const operatorOptions = ["+", "-", "*", "/", "="];

let currentOperatorIndex = 4;
let currentOperatorIsArithmetic = false;
// value added, so that results can ... 
// be overwritten if different integers are inputted afterwards
// be used if an operator is used afterwards
let firstValueIsResult = true;
let currentValue = "";
let values = { firstValue: "0", secondValue: "" };

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
}

// the index is 0/1 if the first/second value should be changed
function conditionallyAppend(whichValue, integerToBeAddedAsString) {
  if (values[whichValue] === "0" || firstValueIsResult) {
    values[whichValue] = integerToBeAddedAsString;
    firstValueIsResult = false;
  } else {
    values[whichValue] += integerToBeAddedAsString;
  }
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
  currentValue = input;
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
    `current operator: ${operatorOptions[currentOperatorIndex]} is arithmetic? ${currentOperatorIsArithmetic}\ncurrent value: ${currentValue}\n`
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
