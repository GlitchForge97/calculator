let currentInput = '0';
let previousInput = '';
let operator = '';
let waitingForOperand = false;
let memory = 0;
let history = [];
let currentMode = 'standard';
let currentBase = 'dec';

const mainDisplay = document.getElementById('mainDisplay');
const secondaryDisplay = document.getElementById('secondaryDisplay');
const memoryIndicator = document.getElementById('memoryIndicator');
const historyElement = document.getElementById('history');

function updateDisplay() {
mainDisplay.textContent = currentInput;
updateMemoryIndicator();
}

function updateMemoryIndicator() {
memoryIndicator.textContent = memory !== 0 ? 'M' : '';
}

function updateSecondaryDisplay(text) {
secondaryDisplay.textContent = text;
}

function inputNumber(num) {
if (waitingForOperand) {
  currentInput = num;
  waitingForOperand = false;
} else {
  currentInput = currentInput === '0' ? num : currentInput + num;
}
updateDisplay();
if (currentMode === 'programmer') {
  updateBaseConversions();
}
}

function inputDecimal() {
if (waitingForOperand) {
  currentInput = '0.';
  waitingForOperand = false;
} else if (currentInput.indexOf('.') === -1) {
  currentInput += '.';
}
updateDisplay();
}

function inputOperator(nextOperator) {
const inputValue = parseFloat(currentInput);

if (previousInput === '') {
  previousInput = inputValue;
} else if (operator) {
  const currentValue = previousInput || 0;
  const newValue = performCalculation(currentValue, inputValue, operator);

  currentInput = String(newValue);
  previousInput = newValue;
  updateDisplay();
  addToHistory(`${currentValue} ${operator} ${inputValue} = ${newValue}`);
}

waitingForOperand = true;
operator = nextOperator;
updateSecondaryDisplay(`${previousInput} ${operator}`);
}

function calculate() {
const inputValue = parseFloat(currentInput);

if (previousInput !== '' && operator) {
  const currentValue = previousInput;
  const newValue = performCalculation(currentValue, inputValue, operator);

  currentInput = String(newValue);
  addToHistory(`${currentValue} ${operator} ${inputValue} = ${newValue}`);

  previousInput = '';
  operator = '';
  waitingForOperand = true;
  updateDisplay();
  updateSecondaryDisplay('');
}
}

function performCalculation(firstOperand, secondOperand, operator) {
switch (operator) {
  case '+':
    return firstOperand + secondOperand;
  case '-':
    return firstOperand - secondOperand;
  case '*':
    return firstOperand * secondOperand;
  case '/':
    return secondOperand !== 0 ? firstOperand / secondOperand : 0;
  default:
    return secondOperand;
}
}

function clearAll() {
currentInput = '0';
previousInput = '';
operator = '';
waitingForOperand = false;
updateDisplay();
updateSecondaryDisplay('');
}

function clearEntry() {
currentInput = '0';
updateDisplay();
}

function backspace() {
if (currentInput.length > 1) {
  currentInput = currentInput.slice(0, -1);
} else {
  currentInput = '0';
}
updateDisplay();
}

function scientificFunction(func) {
const value = parseFloat(currentInput);
let result;

switch (func) {
  case 'sin':
    result = Math.sin(value * Math.PI / 180);
    break;
  case 'cos':
    result = Math.cos(value * Math.PI / 180);
    break;
  case 'tan':
    result = Math.tan(value * Math.PI / 180);
    break;
  case 'asin':
    result = Math.asin(value) * 180 / Math.PI;
    break;
  case 'acos':
    result = Math.acos(value) * 180 / Math.PI;
    break;
  case 'atan':
    result = Math.atan(value) * 180 / Math.PI;
    break;
  case 'log':
    result = Math.log10(value);
    break;
  case 'ln':
    result = Math.log(value);
    break;
  case 'sqrt':
    result = Math.sqrt(value);
    break;
  case 'cbrt':
    result = Math.cbrt(value);
    break;
  case 'exp':
    result = Math.exp(value);
    break;
  case 'factorial':
    result = factorial(Math.floor(value));
    break;
  case 'pow':
    if (operator === '') {
      previousInput = value;
      operator = '^';
      waitingForOperand = true;
      updateSecondaryDisplay(`${value} ^`);
      return;
    }
    break;
}

if (result !== undefined) {
  addToHistory(`${func}(${value}) = ${result}`);
  currentInput = String(result);
  updateDisplay();
}
}

function factorial(n) {
if (n < 0) return NaN;
if (n === 0 || n === 1) return 1;
let result = 1;
for (let i = 2; i <= n; i++) {
  result *= i;
}
return result;
}

function memoryStore() {
memory = parseFloat(currentInput);
updateMemoryIndicator();
addToHistory(`Stored ${currentInput} in memory`);
}

function memoryRecall() {
currentInput = String(memory);
updateDisplay();
}

function memoryClear() {
memory = 0;
updateMemoryIndicator();
addToHistory('Memory cleared');
}

function memoryAdd() {
memory += parseFloat(currentInput);
updateMemoryIndicator();
addToHistory(`Added ${currentInput} to memory`);
}

function memorySubtract() {
memory -= parseFloat(currentInput);
updateMemoryIndicator();
addToHistory(`Subtracted ${currentInput} from memory`);
}

function inputHex(hex) {
if (currentBase === 'hex' || currentBase === 'dec') {
  inputNumber(hex);
}
}

function convertBase(base) {
currentBase = base;
const decValue = parseInt(currentInput, getBaseNumber(currentBase));

switch (base) {
  case 'bin':
    currentInput = decValue.toString(2);
    break;
  case 'oct':
    currentInput = decValue.toString(8);
    break;
  case 'dec':
    currentInput = decValue.toString(10);
    break;
  case 'hex':
    currentInput = decValue.toString(16).toUpperCase();
    break;
}

updateDisplay();
updateBaseConversions();
}

function getBaseNumber(base) {
switch (base) {
  case 'bin': return 2;
  case 'oct': return 8;
  case 'dec': return 10;
  case 'hex': return 16;
  default: return 10;
}
}

function updateBaseConversions() {
const decValue = parseInt(currentInput, getBaseNumber(currentBase));

document.getElementById('binValue').textContent = decValue.toString(2);
document.getElementById('octValue').textContent = decValue.toString(8);
document.getElementById('decValue').textContent = decValue.toString(10);
document.getElementById('hexValue').textContent = decValue.toString(16).toUpperCase();
}

function bitwiseOperation(op) {
// Placeholder for bitwise operations
addToHistory(`Bitwise ${op} operation (Demo)`);
}

function financialFunction(func) {
// Placeholder for financial functions
const value = parseFloat(currentInput);
let result = 0;

switch (func) {
  case 'pmt':
    result = value * 0.05; // Demo calculation
    addToHistory(`PMT calculation: ${result}`);
    break;
  case 'pv':
    result = value * 0.95; // Demo calculation
    addToHistory(`Present Value: ${result}`);
    break;
  case 'fv':
    result = value * 1.05; // Demo calculation
    addToHistory(`Future Value: ${result}`);
    break;
  case 'tax':
    result = value * 0.15; // Demo 15% tax
    addToHistory(`Tax (15%): ${result}`);
    break;
  case 'tip':
    result = value * 0.18; // Demo 18% tip
    addToHistory(`Tip (18%): ${result}`);
    break;
  case 'discount':
    result = value * 0.10; // Demo 10% discount
    addToHistory(`Discount (10%): ${result}`);
    break;
  default:
    addToHistory(`${func.toUpperCase()} function (Demo)`);
    return;
}

currentInput = String(result);
updateDisplay();
}

function addToHistory(entry) {
history.unshift(entry);
if (history.length > 10) {
  history.pop();
}
updateHistoryDisplay();
}

function updateHistoryDisplay() {
const historyItems = history.map(item => 
                                 `<div class="history-item" onclick="useHistoryValue('${item}')">${item}</div>`
                                ).join('');

historyElement.innerHTML = `
              <div style="color: rgba(255, 255, 255, 0.6); font-size: 12px; margin-bottom: 10px;">History</div>
              ${historyItems}
          `;
}

function useHistoryValue(entry) {
const match = entry.match(/= ([\d.-]+)$/);
if (match) {
  currentInput = match[1];
  updateDisplay();
}
}

// Mode switching
document.querySelectorAll('.mode-btn').forEach(btn => {
btn.addEventListener('click', () => {
  const mode = btn.dataset.mode;
  switchMode(mode);

  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
});
});

function switchMode(mode) {
currentMode = mode;

// Hide all mode grids
document.querySelectorAll('.button-grid').forEach(grid => {
  grid.classList.add('hidden');
});

// Show selected mode grid
document.getElementById(mode + 'Mode').classList.remove('hidden');

// Show/hide conversion display for programmer mode
const conversionDisplay = document.getElementById('conversionDisplay');
if (mode === 'programmer') {
  conversionDisplay.style.display = 'block';
  updateBaseConversions();
} else {
  conversionDisplay.style.display = 'none';
}

// Reset calculator state when switching modes
clearAll();
}

// Keyboard support
document.addEventListener('keydown', (event) => {
const key = event.key;

if (key >= '0' && key <= '9') {
  inputNumber(key);
} else if (key === '.') {
  inputDecimal();
} else if (key === '+' || key === '-' || key === '*' || key === '/') {
  inputOperator(key);
} else if (key === 'Enter' || key === '=') {
  calculate();
} else if (key === 'Escape') {
  clearAll();
} else if (key === 'Backspace') {
  backspace();
}
});

// Initialize
updateDisplay();
updateHistoryDisplay();
