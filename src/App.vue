<script setup lang="ts">
import * as Tone from 'tone'
import * as d3 from 'd3'
import { onMounted, reactive, ref, type Ref } from 'vue'
import type {
  History, VariableName, VariablesState,
  VariableOctaves, VariablesToPlay, StepDefinition
} from './types.js'
import { expressionToVarTransform  } from './step_definition_parser'
import { useToast } from "vue-toastification"
import UserConfig from './user_config'
import Piano from './Piano.vue'
import { notes, octaves } from './constants'

/* STATE */

var newVar: string = "";

var pianoRef: Ref = ref(null);

var activeOctaves = reactive([1, 2, 3, 4, 5, 6])

const userConfig = reactive(new UserConfig());

type PlayState = {
  playing: Tone.Loop | null;
  history: History;
}

var playState: PlayState = reactive({
  playing: null,
  history: {states: []}
});

/* LOGIC */

function nextStep(
    state: VariablesState, stepDefinition: StepDefinition): VariablesState {
  const newState: VariablesState = {};
  for (let key in state) {
    newState[key] = stepDefinition[key](state) % notes.length;
  }
  return newState;
}

function stop() {
  playState.playing?.stop();
  playState.playing = null;
}

function play(
  startState: VariablesState,
  stepDefinition: StepDefinition,
  variablesToPlay: VariablesToPlay,
  variableOctaves: VariableOctaves) {
  const synth = new Tone.PolySynth().toDestination();
  var state = startState;

  playState.playing = new Tone.Loop(time => {
    const newActiveNotes: Array<string> = [];
    for (let variable of variablesToPlay) {
      const value = state[variable];
      var noteToPlay = notes[value] + variableOctaves[variable];
      synth.triggerAttackRelease(noteToPlay, "8n", time);
      newActiveNotes.push(noteToPlay);
    }
    pianoRef.value.updatePianoKeys(newActiveNotes);
    playState.history.states.push(state);
    updateChart();

    state = nextStep(state, stepDefinition);
  }, "8n").start(0);
  // Start
  Tone.Transport.bpm.rampTo(160);
  Tone.Transport.start()
}

function validateAndPlay(): void {
  const variablesToPlay: VariablesToPlay = [];
  const stepDefinition: StepDefinition = {};
  for (let variable of userConfig.variables) {
    try {
      stepDefinition[variable] =
        expressionToVarTransform(
          userConfig.unparsedVarTransforms[variable],
          userConfig.variables);
    } catch (e) {
      useToast().error(`Failed to parse transform for variable ${variable}.
Error: ${(e as Error).message}.`);
      return;
    }
  }
  for (let variable of userConfig.variables) {
    if (userConfig.playVariable[variable]) {
      variablesToPlay.push(variable);
    }
  }
  play(userConfig.startState,
    stepDefinition,
    variablesToPlay,
    userConfig.variableOctaves
  )
}

function updateChart() {
  // Clear the graph first.
  d3.selectAll("#visualiser > *").remove();

  const margin = {top: 10, right: 30, bottom: 30, left: 60};
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  const svg = d3.select("#visualiser")
  svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleLinear()
    .domain([0, playState.history.states.length])
    .range([0, width]);
  const y = d3
      .scaleLinear()
      .domain(
        [0, notes.length]
      )
      .range([0, height]);
  const colors = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33',
                  '#a65628','#f781bf','#999999'];
  
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
      return lines[g](playState.history.states);
    });
}

onMounted(() => {
  updateChart();
})
</script>

<template>
  <div>
    TODO:
    <ul>
      <li>Choice of factory presets</li>
      <li>Play the second C an octave higher</li>
      <li>Loading and downloading presets</li>
      <li>Nicer piano</li>
      <li>Matching colors between piano and plot</li>
      <li>Better plot</li>
      <li>For each variable, instead of "play/no play",
        give a choice from preprogrammed rhythms (only 1s, only 0s,
        fibonacci word, thue morse word etc.)</li>
      <li>Split up the code.</li>
    </ul>
  </div>
  <br>

  <!-- Config -->
  <div id="main-frame">
    <div class="block" id="config-block">
      <div id="variables-and-init-values">
        <h2>Variables and initial values</h2>
        <p class="section-hint">
          First, list all variables you want to use and set their initial
          (step 0) values. You can add up to 10 variables.
        </p>
        <div class="variables-column">
          <span v-for="variable in userConfig.variables">
            <div class="variable-entry">
              <span class="variable-entry-name">
                {{ variable }}
              </span>
              <select name="Initial value" id="init-value"
                  class="input"
                  v-model="userConfig.startState[variable]">
                <option
                  v-for="note in Array(notes.length).keys()"
                  :value="note"
                  >
                  {{ note }}
                </option>
              </select>
              <img src="@/assets/icons/close.svg"
                class="variable-add-or-del-img"
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
          Now define the step transformation formulas. You can use variable
          names (evaluated at step n-1), numerical constants, parentheses and
          operations + and *.
        </p>
        <div class="variables-column">
          <span v-for="variable in userConfig.variables">
            <div class="variable-entry">
              <span class="variable-entry-name">
                {{ variable }}
              </span>
              <input type="text" class="input wide"
                v-model="userConfig.unparsedVarTransforms[variable]" />
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
              <img src="@/assets/icons/on.svg"
                class="variable-play-on-or-off"
                @click="userConfig.playVariable[variable] = false"
                v-if="userConfig.playVariable[variable]" />
              <img src="@/assets/icons/off.svg"
                class="variable-play-on-or-off"
                @click="userConfig.playVariable[variable] = true"
                v-if="!userConfig.playVariable[variable]" />
              <span class="variable-8va">8va:</span>
              <select name="{{variable}} 8va" id="variable-octave"
                  class="input" v-model="userConfig.variableOctaves[variable]"
                  :disabled="!userConfig.playVariable[variable]">
                <option
                  v-for="octave in octaves"
                  :value="octave">
                  {{ octave }}
                </option>
              </select>
            </div>
          </span>
        </div>
      </div>
      <div id="ready">
        <h2 style="display: inline">Ready?</h2>
        <img @click="validateAndPlay" src="@/assets/icons/play.svg"
          style="cursor: pointer" v-if="playState.playing == null" />
        <img @click="stop" src="@/assets/icons/stop.svg"
          style="cursor: pointer" v-if="playState.playing != null" />
      </div>
    </div>

    <!-- Piano -->
    <Piano
      :ref="(el) => { pianoRef = el }"
      :octaves="activeOctaves" />
  </div>

  <!--Visualizer-->
  <svg id="visualiser"></svg>
</template>
