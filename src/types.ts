type VariableName = string;

type VariablesState = { [variable: VariableName]: number }

type VariablesToPlay = Array<VariableName>;

type History = {
  states: Array<VariablesState>,
};

type VarTransform = (state: VariablesState) => number;

type StepDefinition = {
    [variable: VariableName]: VarTransform
};

export type {
    History,
    VariableName,
    VariablesState,
    VariablesToPlay,
    StepDefinition,
    VarTransform
};