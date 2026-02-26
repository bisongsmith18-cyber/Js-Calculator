const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let expression = "";

/* ========= HELPERS ========= */

function isOperator(char) {
  return ["+", "-", "*", "/"].includes(char);
}

function formatExpression(expr) {
  return expr
    .replace(/÷/g, "/")
    .replace(/×/g, "*")
    .replace(/−/g, "-");
}

/* ========= SAFE EVALUATION ========= */

function safeCalculate(expr) {
  try {
    return Function("return " + expr)();
  } catch {
    return null;
  }
}

/* ========= DISPLAY ========= */

function updateDisplay() {
  display.value = expression || "0";
}

/* ========= MAIN CLICK HANDLER ========= */

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value === "AC") {
      expression = "";
      updateDisplay();
      return;
    }

    if (value === "⌫") {
      expression = expression.slice(0, -1);
      updateDisplay();
      return;
    }

    if (value === "=") {
      const formatted = formatExpression(expression);
      const result = safeCalculate(formatted);

      if (result === null || result === Infinity || isNaN(result)) {
        expression = "";
        display.value = "Error";
      } else {
        expression = result.toString();
        updateDisplay();
      }
      return;
    }

    if (value === "+/-") {
      if (!expression) return;
      expression = (-parseFloat(expression)).toString();
      updateDisplay();
      return;
    }

    if (value === "%") {
      if (!expression) return;
      expression = (parseFloat(expression) / 100).toString();
      updateDisplay();
      return;
    }

    // Prevent double operators
    const lastChar = expression.slice(-1);

    if (isOperator(value)) {
      if (expression === "" && value !== "-") return;

      if (isOperator(lastChar)) {
        expression = expression.slice(0, -1) + value;
      } else {
        expression += value;
      }
    } else {
      expression += value;
    }

    updateDisplay();
  });
});