type VariableName = string;

type VariablesState = { [variable: VariableName]: number }

type VariablesToPlay = Array<VariableName>;

type History = {
  notes: Array<string>,
  states: Array<VariablesState>,
  cycleLength: number | undefined
};

type StepDefinition = {
    [variable: VariableName]: (state: VariablesState) => number
}

export type {
    History,
    VariableName,
    VariablesState,
    VariablesToPlay,
    StepDefinition
};