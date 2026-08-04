const display = document.getElementById("display");
const expression = document.getElementById("expression");
const buttons = document.querySelectorAll(".btn");
const backspaceButton = document.querySelector('.btn-backspace');
const equalsButton = document.querySelector('.btn-equals');

let currentInput = "0";
let previousValue = null;
let operator = null;
let shouldResetDisplay = false;
let expressionText = "0";
let hasError = false;

function updateDisplay() {
  display.textContent = currentInput;
  expression.textContent = expressionText;
  updateBackspaceState();
}

function updateBackspaceState() {
  const canBackspace = !hasError && currentInput !== "" && currentInput !== "0";
  backspaceButton.disabled = !canBackspace;
}

function flashEqualsButton() {
  equalsButton.classList.add("is-pressed");
  window.setTimeout(() => {
    equalsButton.classList.remove("is-pressed");
  }, 180);
}

function resetCalculator() {
  currentInput = "0";
  previousValue = null;
  operator = null;
  shouldResetDisplay = false;
  expressionText = "0";
  hasError = false;
  updateDisplay();
}

function appendDigit(digit) {
  if (hasError) {
    currentInput = "0";
    hasError = false;
  }

  if (shouldResetDisplay) {
    currentInput = "";
    shouldResetDisplay = false;
  }

  if (digit === ".") {
    if (currentInput.includes(".")) return;
    if (currentInput === "") currentInput = "0";
  }

  if (currentInput === "0" && digit !== ".") {
    currentInput = digit;
  } else {
    currentInput += digit;
  }

  updateDisplay();
}

function handleOperator(nextOperator) {
  if (hasError) return;

  const inputValue = Number(currentInput);

  if (previousValue === null) {
    previousValue = inputValue;
  } else if (operator) {
    const result = calculate(previousValue, inputValue, operator);
    if (result === "error") return;
    previousValue = result;
    currentInput = String(result);
  }

  operator = nextOperator;
  shouldResetDisplay = true;
  expressionText = `${previousValue} ${getOperatorSymbol(operator)}`;
  updateDisplay();
}

function calculate(first, second, operation) {
  switch (operation) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "*":
      return first * second;
    case "/":
      if (second === 0) {
        currentInput = "Error";
        previousValue = null;
        operator = null;
        shouldResetDisplay = true;
        expressionText = "Cannot divide by zero";
        hasError = true;
        updateDisplay();
        return "error";
      }
      return first / second;
    default:
      return second;
  }
}

function evaluate() {
  if (hasError || operator === null || previousValue === null) return;

  flashEqualsButton();
  const inputValue = Number(currentInput);
  const result = calculate(previousValue, inputValue, operator);

  if (result === "error") return;

  currentInput = String(result);
  expressionText = `${previousValue} ${getOperatorSymbol(operator)} ${inputValue} =`;
  previousValue = null;
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function backspace() {
  if (hasError) {
    resetCalculator();
    return;
  }

  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = "0";
  }

  updateDisplay();
}

function getOperatorSymbol(nextOperator) {
  switch (nextOperator) {
    case "+":
      return "+";
    case "-":
      return "−";
    case "*":
      return "×";
    case "/":
      return "÷";
    default:
      return "";
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;

    if (action === "number") {
      appendDigit(button.dataset.value);
    } else if (action === "decimal") {
      appendDigit(".");
    } else if (action === "operator") {
      handleOperator(button.dataset.operator);
    } else if (action === "equals") {
      evaluate();
    } else if (action === "backspace") {
      backspace();
    } else if (action === "clear") {
      resetCalculator();
    }
  });
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    appendDigit(key);
  } else if (key === ".") {
    appendDigit(".");
  } else if (["+", "-", "*", "/"].includes(key)) {
    const operatorMap = { "+": "+", "-": "-", "*": "*", "/": "/" };
    handleOperator(operatorMap[key]);
  } else if (key === "Enter" || key === "=") {
    evaluate();
  } else if (key === "Backspace") {
    backspace();
  } else if (key.toLowerCase() === "c") {
    resetCalculator();
  }
});

updateDisplay();