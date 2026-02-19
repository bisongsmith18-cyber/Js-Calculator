const display = document.getElementById('display')
const memory = document.getElementById('memory')
const buttons = document.querySelectorAll('button')

let current = '0'
let previous = null
let operator = null
let resetNext = false

function updateDisplay() {
  display.textContent = current
  memory.textContent = previous && operator ? `${previous} ${operator}` : ''
}

function compute() {
  const a = parseFloat(previous)
  const b = parseFloat(current)

  if (operator === '+') return a + b
  if (operator === '−') return a - b
  if (operator === '×') return a * b
  if (operator === '÷') return b === 0 ? 'Error' : a / b
}

function setNumber(num) {
  if (current === '0' || resetNext) {
    current = num
    resetNext = false
  } else {
    current += num
  }
}

function setOperator(op) {
  if (operator && !resetNext) {
    current = String(compute())
  }
  previous = current
  operator = op
  resetNext = true
}

function equals() {
  if (!operator) return
  current = String(compute())
  previous = null
  operator = null
  resetNext = true
}

function clearAll() {
  current ='0'
  previous = null
  operator = null
  resetNext = false
}

function deleteDigit() {
  if (resetNext) return
  current =
    current.length > 1 ? current.slice(0, -1) : '0'
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.number) setNumber(btn.dataset.number)
    if (btn.dataset.action === 'decimal' && !current.includes('.')) current += '.'
    if (btn.dataset.action === 'operator') setOperator(btn.textContent)
    if (btn.dataset.action === 'equals') equals()
    if (btn.dataset.action === 'clear') clearAll()
    if (btn.dataset.action === 'delete') deleteDigit()
    if (btn.dataset.action === 'sign') current = String(parseFloat(current) * -1)
    if (btn.dataset.action === 'percent') current = String(parseFloat(current) / 100)

    updateDisplay()
  })
})

/* Keyboard Support */
window.addEventListener('keydown', e => {
  if (!isNaN(e.key)) setNumber(e.key);
  if (e.key === '.') if (!current.includes('.')) current += '.'
  if (e.key === '+') setOperator('+')
  if (e.key === '-') setOperator('−')
  if (e.key === '*') setOperator('×')
  if (e.key === '/') setOperator('÷')
  if (e.key === 'Enter' || e.key === '=') equals()
  if (e.key === 'Backspace') deleteDigit()
  if (e.key === 'Escape') clearAll()

  updateDisplay()
})
