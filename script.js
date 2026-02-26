const display = document.getElementById('display')
const buttons = document.querySelectorAll('button')

let expression = ''

function isOperator (char) {
  return ['+', '-', '*', '/'].includes(char)
}

function formatExpression (expr) {
  return expr
    .replace(/÷/g, '/')
    .replace(/×/g, '*')
    .replace(/−/g, '-')
}

function tokenize (expr) {
  const tokens = []
  let number = ''

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i]

    if (!isNaN(char) || char === '.') {
      number += char
    } else if (isOperator(char)) {
      if (char === '-' && (i === 0 || isOperator(expr[i - 1]))) {
        number += char
      } else {
        if (number !== '') {
          tokens.push(number)
          number = ''
        }
        tokens.push(char)
      }
    }
  }

  if (number !== '') tokens.push(number)

  return tokens
}

function calculate (expr) {
  const tokens = tokenize(expr)
  if (!tokens || tokens.length === 0) return null

  const numbers = []
  const operators = []

  tokens.forEach(token => {
    if (!isNaN(token)) {
      numbers.push(Number(token))
    } else {
      operators.push(token)
    }
  })

  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === '*' || operators[i] === '/') {
      const a = numbers[i]
      const b = numbers[i + 1]

      if (operators[i] === '/' && b === 0) return null

      const result =
        operators[i] === '*'
          ? a * b
          : a / b

      numbers.splice(i, 2, result)
      operators.splice(i, 1)
      i--
    }
  }

  let result = numbers[0]

  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === '+') {
      result += numbers[i + 1]
    } else {
      result -= numbers[i + 1]
    }
  }

  return result
}

function updateDisplay () {
  display.value = expression || '0'
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent

    if (value === 'AC') {
      expression = ''
      updateDisplay()
      return
    }

    if (value === '⌫') {
      expression = expression.slice(0, -1)
      updateDisplay()
      return
    }

    if (value === '=') {
      const formatted = formatExpression(expression)
      const result = calculate(formatted)

      if (result === null || isNaN(result)) {
        expression = ''
        display.value = 'Error'
      } else {
        expression = result.toString()
        updateDisplay()
      }

      return
    }

    if (value === '+/-') {
      if (!expression) return
      expression = (-parseFloat(expression)).toString()
      updateDisplay()
      return
    }

    if (value === '%') {
      if (!expression) return
      expression = (parseFloat(expression) / 100).toString()
      updateDisplay()
      return
    }

    const lastChar = expression.slice(-1)

    if (isOperator(value)) {
      if (expression === '' && value !== '-') return

      if (isOperator(lastChar)) {
        expression = expression.slice(0, -1) + value
      } else {
        expression += value
      }
    } else {
      expression += value
    }

    updateDisplay()
  })
})
