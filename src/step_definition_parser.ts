import type {
    History, VariableName, VariablesState,
    VariablesToPlay, StepDefinition
  } from './model.ts'

/*
Step definition grammar:

<letter_or_digit> ::= <letter> | <digit>
<variable_name_tail> ::= "" | <letter> <variable_name_tail> | <digit> <variable_name_tail>
<variable_name> ::= <letter> <variable_name_tail>
<number> ::= <digit> | <digit> <number>
<expression> ::=
  <variable_name> | <number> | "(" <expression> ")" |
  <expression> "+" <expression> | <expression> "*" <expression>
*/

function 

export {};