//Access DOM elements of the caluculator
const inputBox = document.getElementById("input");
const expressionDiv = document.getElementById("expression");
const resultDiv = document.getElementById("result");


// Define expression and result variable
let expression = '';
let result = '';

//Define event handler for button clicks

function buttonClick(event) {
    //Get values from clicked button
    const target = event.target;
    const action = target.dataset.action;
    const value = target.dataset.value;
    //console.log(target, action, value);

    //Switch case to control the caluculator
    switch (action) {
        case 'number':
            addValue(value);
            break;
        case 'clear':
            clear();
            break;
        case 'backspace':
            backSpace();
            break;
        // Add the result to expression as a starting point if expression is empty
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
            if (expression === '' && result !== ''){
                startFromResult(value);
            }
            else if(expression !== '' && !isLastCharOperator()){
                addValue(value);
            }
            break;
        case 'submit':
            submit();
            break;
        case 'negate':
            negate();
            break;
        case 'mod':
            percentage();
            break;
        case 'decimal':
            decimal(value);
            break;
    }

    //Update display
    updateDisplay(expression, result);
}

inputBox.addEventListener("click", buttonClick);

function addValue(value) {
    //Add value to expresion
    if(value == '.'){
        //Find the index of last operator in the expression
        const lastOperatorIndex = expression.search(/[+\-*/]/);
        //Find the index of last decimal in the expression
        const lastDecimalIndex  = expression.lastIndexOf('.');
        //Find the index of last number in the expression
        const lastNumberIndex = Math.max(
            expression.lastIndexOf('+'),
            expression.lastIndexOf('-'),
            expression.lastIndexOf('*'),
            expression.lastIndexOf('/')
        );
        //Check if this is the first decimal is in the current number or if the expression is empty
        if(lastDecimalIndex < lastOperatorIndex || lastDecimalIndex < lastNumberIndex || lastDecimalIndex === -1 || expression === '' || expression.slice(lastNumberIndex + 1).indexOf('-') === -1){
            //Add decimal to expression
            expression += value;
        }
    } else {
        expression += value;
    }
}

function updateDisplay(expresion, result) {
    expressionDiv.textContent = expresion;
    resultDiv.textContent = result;
}

function clear() { 
    expression = '';
    result = '';
}

function backSpace() {
    expression = expression.slice(0, -1);
}

function isLastCharOperator(){
    return isNaN(parseInt(expression.slice(-1)));
}

function startFromResult(value){
    expression += result + value;
}

function submit() { 
    result = evaluateExpression();
    expression = '';
}

function evaluateExpression(){
    const evalResult = eval(expression);
    // Checks if evalResult isNaN or infinite. If it is, return a space character ' '
    return isNaN(evalResult) || !isFinite(evalResult) ? ' ' : evalResult< 1 ? parseFloat(evalResult.toFixed(10)) : parseFloat(evalResult.toFixed(2));
}

function negate(){
    //Negate the result if expression is emprt and result is present
    if(expression == ' ' && result !== ''){
        result = -result;
    } 
    //Add - sign before expression if it is not already negative and is not empty
    else if(!expression.startsWith("-") && expression !== ''){
        expression = '-' + expression;
    } 
    // Remove - sign if the expression is negative
    else if(expression.startsWith("-")){
        expression = expression.slice(1);
    }
}

function percentage(){
    //Evaluate the expression, else it will take percentage of first number
    if(expression !== ''){
        result = evaluateExpression();
        expression = '';
        if(!isNaN(result) && isFinite(result)){
            result /= 100;
        } else{
            result = '';
        }
    } else if(result !== ''){
        result = parseFloat(result) / 100;
    }
}

function decimal(value){
    if(!expression.endsWith('-') && !isNaN(expression.slice(-1))){
        addValue(value);
    }
}