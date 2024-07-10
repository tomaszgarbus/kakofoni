<script setup lang="ts">
import * as Tone from 'tone'
import * as d3 from 'd3'
import { onMounted, reactive, ref, type Ref } from 'vue'
import type {
  History, VariableName, VariablesState,
  VariablesToPlay, StepDefinition
} from './types.js'
import { expressionToVarTransform  } from './step_definition_parser.js';
import { useToast } from "vue-toastification";

var history = reactive<History>({
  states: [],
});

const fibonacciVariablesToPlay: VariablesToPlay = ['f0', 'f1']

const fibonacciVariables: Array<VariableName> = ['f0', 'f1']

const notes = [
    "C2", "C#2", "D2", "D#2",
    "E2", "F2", "F#2", "G2",
    "G#2", "A2", "A#2", "B2",
    "C3"]

var newVar: string = "";

// Meant to be used as singleton.
class UserConfig {
  public variables: Array<VariableName> = reactive(fibonacciVariables);
  public startState: VariablesState = {};
  public unparsedVarTransforms: {
    [variable: VariableName]: string
  } = {};
  public playVariable: {
    [variable: VariableName]: boolean
  } = {};

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
      const toast = useToast();
      toast.error(`The variable ${name} already exists.`);
      return false;
    }
    if (name === '') {
      const toast = useToast();
      toast.error(`Name cannot be empty.`);
      return false;
    }
    this.variables.push(name);
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

var currentlyPlaying: Tone.Loop | null;

function stop() {
  currentlyPlaying?.stop();
  currentlyPlaying = null;
}

function play(
  startState: VariablesState,
  stepDefinition: StepDefinition,
   variablesToPlay: VariablesToPlay) {
  const synth = new Tone.PolySynth().toDestination();
  var state = startState;

  currentlyPlaying = new Tone.Loop(time => {
    for (var note of notes) {
      noteRefs[note].value.classList.remove('active');
    }

    for (let variable of variablesToPlay) {
      const value = state[variable];
      synth.triggerAttackRelease(notes[value], "8n", time);
      noteRefs[notes[value]].value.classList.add('active');
    }
    history.states.push(state);
    updateChart();

    state = nextStep(state, stepDefinition);
  }, "4n").start(0);
  // Start
  Tone.Transport.bpm.rampTo(160);
  Tone.Transport.start()
}

function validateAndPlay() {
  const variablesToPlay: VariablesToPlay = [];
  const stepDefinition: StepDefinition = {};
  for (let variable of userConfig.variables) {
    stepDefinition[variable] =
      expressionToVarTransform(
        userConfig.unparsedVarTransforms[variable],
        userConfig.variables);
  }
  for (let variable of userConfig.variables) {
    if (userConfig.playVariable[variable]) {
      variablesToPlay.push(variable);
    }
  }
  play(userConfig.startState,
    stepDefinition,
    variablesToPlay,
  )
}

function updateChart() {
  // Clear the graph first.
  d3.selectAll("svg > *").remove();

  const margin = {top: 10, right: 30, bottom: 30, left: 60};
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  const svg = d3.select("svg")
  svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleLinear()
    .domain([0, history.states.length])
    .range([0, width]);
  const y = d3
      .scaleLinear()
      .domain(
        [0, notes.length]
      )
      .range([0, height]);
  const colors = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'];
  
  const lines: { [varName: VariableName]: d3.Line<VariablesState> } = {};
  for (let variable of userConfig.variables) {
    const line = d3
      .line<VariablesState>()
      .x(function (_, index: number, __) {
        return x(index);
      })
      .y(function (d: VariablesState) {
      return y(d[variable]);
    });
    lines[variable] = line;
  }
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));
  svg.append("g")
    .call(d3.axisLeft(y));

  var groups = d3.group(userConfig.variables);

  svg.selectAll(".line")
    .data(groups)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", function (_, idx: number) {
      return colors[idx];
    })
    .attr("stroke-width", 1.5)
    .attr('d', function (g: VariableName) {
      return lines[g](history.states);
    });
}

onMounted(() => {
  updateChart();
})
</script>

<template>
  <div>
    <button @click="validateAndPlay">play sound</button>
    <button @click="stop">stop playing</button>
  </div>
  <br>

  <!-- Config -->
  <p>
    <div class="block">
      <div id="variables-and-init-values">
        <h2>Variables and initial values</h2>
        <p class="section-hint">
          First, list all variables you want to use and set their initial (step 0) values.
          You can add up to 10 variables.
        </p>
        <div class="variables-column">
          <span v-for="variable in userConfig.variables">
            <div class="variable-entry">
              <span class="variable-entry-name">
                {{ variable }}
              </span>
              <select name="Initial value" id="init-value" class="input" v-model="userConfig.startState[variable]">
                <option
                  v-for="note in Array(notes.length).keys()"
                  value="{{ note }}">
                  {{ note }}
                </option>
              </select>
              <img src="@/assets/icons/close.svg" class="variable-add-or-del-img"
                @click="userConfig.deleteVariable(variable)"/>
            </div>
          </span>
          <div class="variable-entry">
            <span class="variable-entry-name">
              Name:
            </span>
            <input type="text" class="input" v-model="newVar" />
            <img src="@/assets/icons/add.svg" class="variable-add-or-del-img"
              @click="userConfig.addVariable(newVar)"/>
          </div>
        </div>
      </div>
      <div id="step-transform">
        <h2>Step transform</h2>
        <p class="section-hint">
          Now define the step transformation formulas. You can use variable names (evaluated at step n-1), numerical constants, parentheses and operations + and *.
        </p>
        <div class="variables-column">
          <span v-for="variable in userConfig.variables">
            <div class="variable-entry">
              <span class="variable-entry-name">
                {{ variable }}
              </span>
              <input type="text" class="input wide" v-model="userConfig.unparsedVarTransforms[variable]" />
            </div>
          </span>
        </div>
      </div>
      <div id="what-do-you-wanna-hear">
        <h2>What do you wanna hear?</h2>
        <p class="section-hint">
          Select which variables you’d like to be played and in which octave.
        </p>
        <div class="variables-column">
          <span v-for="variable in userConfig.variables">
            <div class="variable-entry">
              <span class="variable-entry-name">
                {{ variable }}
              </span>
              <img src="@/assets/icons/on.svg" class="variable-play-on-or-off"/>
              <span class="variable-8va">8va:</span>
              <select name="{{variable}} 8va" id="{{variable}}-init-value" class="input" value="2">
                <option
                  v-for="octave in [1, 2, 3, 4, 5, 6]"
                  value="{{ octave }}">
                  {{ octave }}
                </option>
              </select>
            </div>
          </span>
        </div>
      </div>
      <div id="ready">
        <h2 style="display: inline">Ready?</h2>
        <img src="@/assets/icons/play.svg" />
      </div>
    </div>
    <h2>Variables to play</h2>
    <ul>
      <li v-for="variable in userConfig.variables">
        {{ variable }}: <input type="checkbox" v-model="userConfig.playVariable[variable]" />
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

  <!--Visualizer-->
  <svg></svg>
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
