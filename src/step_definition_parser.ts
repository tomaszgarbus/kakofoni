import type {
    History, VariableName, VariablesState,
    VariablesToPlay, StepDefinition, VarTransform
  } from './types.js'

/*
Step definition grammar:

<letter_or_digit> ::= <letter> | <digit>
<variable_name_tail> ::= "" | <letter> <variable_name_tail> | <digit> <variable_name_tail>
<variable_name> ::= <letter> <variable_name_tail>
<number> ::= <digit> | <digit> <number>
<expression> ::=
  <variable_name> | <number> | "(" <expression> ")" |
  <expression> "+" <expression> | <expression> "*" <expression> |
  <expression> "-" <expression>
*/

function isLetter(str: string): boolean {
  return str.length == 1 && str.toLowerCase() != str.toUpperCase();
}

function isDigit(str: string): boolean {
  return str.match('\\d') != null;
}

function isLetterOrDigit(str: string): boolean {
  return isLetter(str) || isDigit(str);
}

function isVariableNameTail(str: string): boolean {
  for (let char of str) {
    if (!isLetterOrDigit(char)) {
      return false;
    }
  }
  return true;
}

function isVariableName(str: string): boolean {
  return str.length > 0 && isLetter(str[0]) && isVariableNameTail(str.slice(1))
}

function isNumber(str: string): boolean {
  if (!str.match('^\\d+$')) {
    return false;
  }
  return !Number.isNaN(parseInt(str));
}

function indexOfNotInParentheses(
  expr: string, matchChar: string): number {
  var parDepth = 0;
  var idx = 0;
  for (let char of expr) {
    if (char == '(') {
      parDepth++;
    }
    if (char == ')') {
      parDepth--;
    }
    if (char == matchChar && parDepth == 0) {
      return idx;
    }
    idx++;
  }
  return -1;
}

function expressionToVarTransform(
  expr: string,
  variableNames: Array<VariableName>,
): VarTransform {
  expr = expr.trim();
  if (isVariableName(expr)) {
    if (!variableNames.includes(expr)) {
      throw Error(`Variable ${expr} not declared.`)
    }
    return (state: VariablesState) => state[expr];
  }
  if (isNumber(expr)) {
    return (_: VariablesState) => parseInt(expr);
  }
  if (expr[0] == '(' && expr[expr.length - 1] == ')') {
    return expressionToVarTransform(
      expr.slice(1, -1),
      variableNames
    );
  }
  const indexOfAdd = indexOfNotInParentheses(expr, '+');
  if (indexOfAdd != -1) {
    const leftTransform = expressionToVarTransform(
      expr.slice(0, indexOfAdd),
      variableNames
    )
    const rightTransform = expressionToVarTransform(
      expr.slice(indexOfAdd + 1),
      variableNames
    )
    return (state: VariablesState) => leftTransform(state) + rightTransform(state);
  }
  const indexOfSub = indexOfNotInParentheses(expr, '-');
  if (indexOfSub != -1) {
    const leftTransform = expressionToVarTransform(
      expr.slice(0, indexOfSub),
      variableNames
    )
    const rightTransform = expressionToVarTransform(
      expr.slice(indexOfSub + 1),
      variableNames
    )
    return (state: VariablesState) => leftTransform(state) - rightTransform(state);
  }
  const indexOfMult = indexOfNotInParentheses(expr, '*');
  if (indexOfMult != -1) {
    const leftTransform = expressionToVarTransform(
      expr.slice(0, indexOfMult),
      variableNames
    )
    const rightTransform = expressionToVarTransform(
      expr.slice(indexOfMult + 1),
      variableNames
    )
    return (state: VariablesState) => leftTransform(state) * rightTransform(state);
  }
  throw Error(`Could not parse expression ${expr}.`)
}

export {expressionToVarTransform};