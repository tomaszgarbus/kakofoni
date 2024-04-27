<script setup lang="ts">
import * as Tone from 'tone'
import { reactive, ref, type Ref } from 'vue'
import type {
  History, VariableName, VariablesState,
  VariablesToPlay, StepDefinition
} from './model.ts'

var history = reactive<History>({
  notes: [],
  states: [],
  cycleLength: undefined,
});

const fibonacciStartState: VariablesState = {
  'f0': 1,
  'f1': 1,
}

const fibonacciStepDefinition: StepDefinition = {
  'f0': (state) => state['f1'],
  'f1': (state) => state['f0'] + state['f1']
}

const fibonacciVariablesToPlay: VariablesToPlay = ['f0', 'f1']

const fibonacciVariables: Array<VariableName> = ['f0', 'f1']

const notes = [
    "C2", "C#2", "D2", "D#2",
    "E2", "F2", "F#2", "G2",
    "G#2", "A2", "A#2", "B2",
    "C3"]

// Meant to be used as singleton.
class UserConfig {
  public variables: Array<VariableName> = reactive(fibonacciVariables);

  public deleteVariable(name: VariableName): boolean {
    const idx = this.variables.indexOf(name);
    if (idx == -1) {
      return false;
    }
    this.variables.splice(idx, 1);
    return true;
  }
}

const userConfig = new UserConfig();

function nextStep(state: VariablesState, stepDefinition: StepDefinition): VariablesState {
  const newState: VariablesState = {};
  for (let key in state) {
    newState[key] = stepDefinition[key](state) % notes.length;
  }
  return newState;
}

const noteRefs: { [note: string]: Ref } = {};

for (var note of notes) {
  noteRefs[note] = ref(null);
}

function play(startState: VariablesState, stepDefinition: StepDefinition, variablesToPlay: VariablesToPlay) {
  const synth = new Tone.PolySynth().toDestination();
  var state = startState;

  const loop = new Tone.Loop(time => {
    for (var note of notes) {
      noteRefs[note].value.classList.remove('active');
    }
    console.log(state);

    for (let variable of variablesToPlay) {
      console.log(variable);
      const value = state[variable];
      console.log(value);
      synth.triggerAttackRelease(notes[value], "8n", time);
      noteRefs[notes[value]].value.classList.add('active');
    }

    state = nextStep(state, stepDefinition);
  }, "4n").start(0);
  // Start
  Tone.Transport.start()
}

function playFibonacci() {
  play(fibonacciStartState, fibonacciStepDefinition, fibonacciVariablesToPlay)
}
</script>

<template>
  <div>
    <button @click="playFibonacci">play sound</button>
  </div>
  <br>
  <p>
    <div>{{ history.notes }}</div>
    <div>{{ history.cycleLength }}</div>
  </p>

  <!-- Config -->
  <p>
    <h1>User Config:</h1>
    <h2>Variables</h2>
    <ul>
      <li v-for="variable in userConfig.variables">
        {{ variable }}
        <button @click="userConfig.deleteVariable(variable)">Delete</button>
      </li>  
    </ul>
    <h2>Step definition</h2>
    <ul>
      <li v-for="variable in userConfig.variables">
        {{ variable }}:
        <input type="text" />
      </li>
    </ul>
  </p>

  <!-- Piano -->
  <p>
    <div v-for="note in notes">
      <div v-if="!note.includes('#')" class="white-key" id="{{ note }}" :ref="(el) => { noteRefs[note].value = el}">
        {{ note }}
      </div>
      <div v-if="note.includes('#')" class="black-key" id="{{ note }}" :ref="(el) => { noteRefs[note].value = el}">
        {{ note }}
      </div>
    </div>
  </p>
</template>

<style scoped>
.white-key {
  color: black;
  background-color: white;
}
.black-key {
  color: white;
  background-color: black;
}
.active {
  background-color: red;
}
</style>
