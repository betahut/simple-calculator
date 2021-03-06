const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    history: null,
    historyList: []
};

Number.prototype.mod = function(a) {
    return this % a; 
} 

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;
  
    if (waitingForSecondOperand === true) {
      calculator.displayValue = digit;
      calculator.waitingForSecondOperand = false;
    } else {
      calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }

    calculator.displayValue = calculator.displayValue.length > 7 ? parseFloat(calculator.displayValue).toExponential(2) : calculator.displayValue;
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) return;

    // If the `displayValue` does not contain a decimal point
    if (!calculator.displayValue.includes(dot)) {
        // Append the decimal point
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand)  {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const currentValue = firstOperand || 0;
        const result = performCalculation[operator](currentValue, inputValue);

        calculator.displayValue = String(result);
        calculator.displayValue = calculator.displayValue.length > 7 ? parseFloat(calculator.displayValue).toExponential(2) : calculator.displayValue;
        calculator.firstOperand = result;
        calculator.history = `${currentValue} ${operator} ${inputValue}`;
        calculator.historyList.push(`${calculator.history}`);
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,

    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,

    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,

    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,

    '%': (firstOperand, secondOperand) => firstOperand.mod(secondOperand),

    '=': (firstOperand, secondOperand) => secondOperand
};

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    calculator.history = null;
}

function absCalculator() {
    let firstOperand = calculator.firstOperand;
    calculator.history = `ABS (${firstOperand})`;
    calculator.displayValue = Math.abs(firstOperand);
    calculator.firstOperand = Math.abs(firstOperand);
    calculator.historyList.push(calculator.history);
}

function updateDisplay() {
    const display = document.querySelector('.display');
    const history = document.querySelector('.history-item');
    display.innerHTML = calculator.displayValue;
    history.innerHTML = calculator.history;
}

updateDisplay();

const keys = document.querySelector('.input-bar');
keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (target.classList.contains('absolute')) {
        absCalculator();
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});