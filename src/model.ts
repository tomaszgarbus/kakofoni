type VariableName = string;

type VariablesState = { [variable: VariableName]: number }

type VariablesToPlay = Array<VariableName>;

type History = {
  notes: Array<string>,
  states: Array<VariablesState>,
  cycleLength: number | undefined
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