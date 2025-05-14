const operatorOptions = ["+", "-", "*", "/", "="];

let currentOperator = "";
let currentOperatorIsArithmetic = false;
let currentValue = "";
let values = {firstValue: "0", secondValue: "0"}

// the index is 0/1 if the first/second value should be changed
function conditionallyAdd(whichValue, integerToBeAddedAsString) {
    if (values[whichValue] === "0") {
        values[whichValue] = integerToBeAddedAsString;
    } else {
        values[whichValue] += integerToBeAddedAsString;
    }
}

function processOperator(operatorOptionsIndex) {
  if (operatorOptionsIndex === 4) {
    currentOperatorIsArithmetic = false;
  } else {
    currentOperatorIsArithmetic = true;
  }

  currentOperator = operatorOptions[operatorOptionsIndex];
}

function processInteger(input) {
  currentValue = input;
  if (currentOperatorIsArithmetic) {
    conditionallyAdd("secondValue", input);
  } else {
    conditionallyAdd("firstValue", input);
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
      `current operator: ${currentOperator} is arithmetic? ${currentOperatorIsArithmetic}\ncurrent value: ${currentValue}\n`
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
