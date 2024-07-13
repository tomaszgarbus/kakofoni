import type {
  History, VariableName, VariablesState,
  VariableOctaves, VariablesToPlay, StepDefinition
} from './types.js'
import { useToast } from "vue-toastification";

const fibonacciVariablesToPlay: VariablesToPlay = ['f0', 'f1']

const fibonacciStartState: VariablesState = {
  'f0': 1,
  'f1': 1
}

const fibonacciUnparsedTransforms = {
  'f0': 'f1',
  'f1': 'f0+f1'
}

const fibonacciVariables: Array<VariableName> = ['f0', 'f1']

// Meant to be used as singleton.
class UserConfig {
  public variables: Array<VariableName> = fibonacciVariables;
  public startState: VariablesState = fibonacciStartState;
  public unparsedVarTransforms: {
    [variable: VariableName]: string
  } = fibonacciUnparsedTransforms;
  public playVariable: {
    [variable: VariableName]: boolean
  } = {
    'f0': true,
    'f1': true
  };
  public variableOctaves: VariableOctaves = {
    'f0': '2',
    'f1': '4'
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
    return true;
  }
}

export default UserConfig;