import { colors } from './constants.js';
import type {
  History, VariableName, VariablesState,
  VariableOctaves, VariablesToPlay, StepDefinition
} from './types.js'
import { useToast } from "vue-toastification";

class UserConfig {
  public variables: Array<VariableName>;
  public startState: VariablesState;
  public unparsedVarTransforms: {
    [variable: VariableName]: string
  };
  public playVariable: {
    [variable: VariableName]: boolean
  };
  public variableOctaves: VariableOctaves;

  constructor(
    variables: Array<VariableName>,
    startState: VariablesState,
    unparsedVarTransforms: {
      [variable: VariableName]: string
    },
    playVariable: {
      [variable: VariableName]: boolean
    },
    variableOctaves: VariableOctaves) {
    this.variables = variables;
    this.startState = startState;
    this.unparsedVarTransforms = unparsedVarTransforms;
    this.playVariable = playVariable;
    this.variableOctaves = variableOctaves;
  }

  public deleteVariable(name: VariableName): boolean {
    const idx = this.variables.indexOf(name);
    if (idx == -1) {
      return false;
    }
    this.variables.splice(idx, 1);
    return true;
  }

  public addVariable(name: VariableName): boolean {
    if (this.variables.includes(name)) {
      useToast().error(`The variable ${name} already exists.`);
      return false;
    }
    if (name === '') {
      useToast().error(`Name cannot be empty.`);
      return false;
    }
    this.variables.push(name);
    this.variableOctaves[name] = 3;
    this.playVariable[name] = true;
    return true;
  }

  public getColorForVariable(name: VariableName): string {
    for (let idx in this.variables) {
      if (this.variables[idx] == name) {
        return colors[idx]; 
      }
    }
    return '';
  }
}

export default UserConfig;