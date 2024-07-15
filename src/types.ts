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

type VariableOctaves = { [variable: VariableName]: string }

type ActiveNote = {
  note: string,
  color: string,
}

export type {
    History,
    VariableName,
    VariablesState,
    VariablesToPlay,
    VariableOctaves,
    StepDefinition,
    VarTransform,
    ActiveNote
};