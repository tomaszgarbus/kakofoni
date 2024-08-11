<script setup lang="ts">
import * as Tone from 'tone'
import * as d3 from 'd3'
import { onMounted, reactive, ref, useAttrs, type Ref } from 'vue'
import type {
  History, VariableName, VariablesState,
  VariableOctaves, VariablesToPlay, StepDefinition,
  ActiveNote
} from './types.js'
import { expressionToVarTransform  } from './step_definition_parser'
import { useToast } from "vue-toastification"
import Piano from './Piano.vue'
import { notes, allOctaves, colors } from './constants'
import { fibonacciUserConfig } from './predefined_configs.js'
import type UserConfig from './user_config.js'
import MidiWriter from 'midi-writer-js'
import type { Track } from 'midi-writer-js/build/types/chunks/track.js'
import PresetLoader from './PresetLoader.vue'

/* STATE */

var newVar: string = "";

var pianoRef: Ref = ref(null);

type ConfigWrapper = {
  config: UserConfig,
}

const configWrapper: ConfigWrapper = reactive({
  config: fibonacciUserConfig.copy()
});

type UIState = {
  expandAdvancedSettings: boolean;
}

var uiState: UIState = reactive({
  expandAdvancedSettings: false
})

type PlayState = {
  playing: Tone.Loop | null;
  history: History;
  config: UserConfig | null;
  midiTrack: Track | null;
  downloadMidi: boolean;
}

var playState: PlayState = reactive({
  playing: null,
  history: {states: []},
  config: null,
  midiTrack: new MidiWriter.Track(),
  downloadMidi: false,
});

/* LOGIC */

function nextStep(
    state: VariablesState, stepDefinition: StepDefinition): VariablesState {
  const newState: VariablesState = {};
  for (let key in state) {
    newState[key] = stepDefinition[key](state) % notes.length;
    while (newState[key] < 0) {
      newState[key] += notes.length;
    }
  }
  return newState;
}

// https://stackoverflow.com/questions/36903527/how-do-you-automatically-download-a-file-in-javascript
function downloadFile(uri: string) {
  const element = document.createElement('a');
  element.setAttribute('href', uri);
  element.setAttribute('download', 'export.mid');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function stop() {
  if (playState.downloadMidi) {
    const track = playState.midiTrack;
    useToast().info('MIDI download will start in a second.')
    setTimeout(() => {
      const write = new MidiWriter.Writer(track);
      
      useToast().info('Exporting MIDI download. Check your downloads folder.')
      downloadFile(write.dataUri());
    }, 1000)
  }

  playState.playing?.stop();
  playState.playing = null;
  playState.config = null;
  playState.midiTrack = null;
  playState.downloadMidi = false;
}

function play(
  startState: VariablesState,
  stepDefinition: StepDefinition,
  variablesToPlay: VariablesToPlay,
  variableOctaves: VariableOctaves,
  bpm: number,
  downloadMidi: boolean,
  userConfigCopy: UserConfig) {
  // Reset play state history.
  playState.history = {states: []};
  playState.config = userConfigCopy;
  playState.midiTrack = new MidiWriter.Track();
  playState.downloadMidi = downloadMidi;

  const synth = new Tone.PolySynth({
    maxPolyphony: 80
  }).toDestination();
  synth.set({
    	envelope: {
        attack: '32n',
        decay: '32n',
   		  sustain: 0.5,
        release: '16n'
      }
 	})
  var state = startState;

  playState.playing = new Tone.Loop(time => {
    const newActiveNotes: Array<ActiveNote> = [];
    const midiNotes: Array<string> = [];
    for (let variable of variablesToPlay) {
      const value = state[variable];
      var noteToPlay = notes[value] + variableOctaves[variable];
      midiNotes.push(noteToPlay);
      newActiveNotes.push({
        note: noteToPlay,
        color: configWrapper.config.getColorForVariable(variable)
      });
    }
    synth.triggerAttackRelease(midiNotes, "8n", time);

    Tone.Draw.schedule(function(){
      pianoRef.value.updatePianoKeys(newActiveNotes);
		  updateChart();
      const midiNoteEvent = new MidiWriter.NoteEvent({
        pitch: midiNotes,
        duration: '8n'
      });
      playState.midiTrack?.addEvent(midiNoteEvent);
    }, time)
    playState.history.states.push(state);

    state = nextStep(state, stepDefinition);
  }, "8n").start(0);
  // Start
  Tone.Transport.bpm.rampTo(bpm);
  Tone.Transport.start()
}

function validateAndPlay(): void {
  const variablesToPlay: VariablesToPlay = [];
  const stepDefinition: StepDefinition = {};
  // Validate transforms.
  for (let variable of configWrapper.config.variables) {
    try {
      stepDefinition[variable] =
        expressionToVarTransform(
          configWrapper.config.unparsedVarTransforms[variable],
          configWrapper.config.variables);
    } catch (e) {
      useToast().error(`Failed to parse transform for variable ${variable}.
Error: ${(e as Error).message}.`);
      return;
    }
  }

  // Validate octaves.
  for (let variable of configWrapper.config.variables) {
    if (configWrapper.config.variableOctaves[variable] === null) {
      useToast().error(`Select octave for variable ${variable}.`);
      return;
    }
  }

  // Validate initial values.
  for (let variable of configWrapper.config.variables) {
    if (configWrapper.config.startState[variable] === undefined) {
      useToast().error(`Select initial value for variable ${variable}.`);
      return;
    }
  }

  // Play.
  for (let variable of configWrapper.config.variables) {
    if (configWrapper.config.playVariable[variable]) {
      variablesToPlay.push(variable);
    }
  }
  play({ ...configWrapper.config.startState },
    stepDefinition,
    variablesToPlay,
    { ...configWrapper.config.variableOctaves },
    configWrapper.config.bpm,
    configWrapper.config.downloadMidi,
    configWrapper.config.copy()
  )
}

function lastN<T>(arr: Array<T>, n: number): Array<T> {
  return arr.slice(-n);
}

function updateChart() {
  // Clear the graph first.
  d3.selectAll("#visualiser > *").remove();

  const margin = {top: 10, right: 10, bottom: 40, left: 60};
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  const svg = d3.select("#visualiser")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const statesToPlot = lastN(playState.history.states, 100);
  const x = d3
    .scaleLinear()
    .domain([0, statesToPlot.length])
    .range([0, width]);
  const y = d3
      .scaleLinear()
      .domain(
        [0, notes.length - 1]
      )
      .range([0, height]);
  svg.append("g").call(
    d3.axisLeft(y).tickFormat(
      (_, index) => `${index} (${notes[index]})`
    )
  ).style("font", "14px times")
  
  const lines: { [varName: VariableName]: d3.Line<VariablesState> } = {};
  for (let variable of configWrapper.config.variables) {
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

  var groups = d3.group(configWrapper.config.variables);

  svg.selectAll(".line")
    .data(groups)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", function (g: VariableName) {
      return configWrapper.config.getColorForVariable(g);
    })
    .attr("stroke-width", 1.5)
    .attr('d', function (g: VariableName) {
      return lines[g](statesToPlot);
    });
}

onMounted(() => {
  updateChart();
})

function setUnion<T>(set1: Set<T>, set2: Set<T> | undefined): Set<T> {
  var result = new Set<T>();
  for (let e of set1) {
    result.add(e);
  }
  if (set2) {
    for (let e of set2) {
      result.add(e);
    }
  }
  return result;
}
</script>

<template>
  <div id="logo-div">
    <img src="@/assets/logo.svg" id="logo" />
  </div>

  <!-- Config -->
  <div id="main-frame">
    <div class="block" id="config-block">
      <span style="position: relative">
        <span
          id="edit-blocker"
          :hidden="!playState.playing"
          @click="useToast().info('Pause playback before updating the config.')">
        </span>
        <PresetLoader :onSelect=" 
          (preset: UserConfig) => { configWrapper.config = preset }" />
        <div id="variables-and-init-values">
          <h2>Variables and initial values</h2>
          <p class="section-hint">
            First, list all variables you want to use and set their initial
            (step 0) values. You can add up to 5 variables.
          </p>
          <div class="variables-column">
            <span v-for="variable in configWrapper.config.variables">
              <div class="variable-entry">
                <span class="variable-entry-name">
                  {{ variable }}
                </span>
                <select name="Initial value" id="init-value"
                    class="input wide"
                    v-model="configWrapper.config.startState[variable]">
                  <option
                    v-for="note in Array(notes.length).keys()"
                    :value="note"
                    >
                    {{ note }} ({{ notes[note] }})
                  </option>
                </select>
                <img src="@/assets/icons/close.svg"
                  class="variable-add-or-del-img"
                  @click="configWrapper.config.deleteVariable(variable)"/>
              </div>
            </span>
            <div class="variable-entry" v-if="configWrapper.config.variables.length < 5">
              <span class="variable-entry-name">
                Name:
              </span>
              <input type="text" class="input wide" v-model="newVar" />
              <img src="@/assets/icons/add.svg" class="variable-add-or-del-img"
                @click="configWrapper.config.addVariable(newVar)"/>
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
          <p class="section-hint">
            All transforms will be applied in modular arithmetic modulo
            {{ notes.length }}.
          </p>
          <div class="variables-column">
            <span v-for="variable in configWrapper.config.variables">
              <div class="variable-entry">
                <span class="variable-entry-name">
                  {{ variable }}
                </span>
                <input type="text" class="input wide"
                  v-model="configWrapper.config.unparsedVarTransforms[variable]" />
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
            <span v-for="variable in configWrapper.config.variables">
              <div class="variable-entry">
                <span class="variable-entry-name">
                  {{ variable }}
                </span>
                <img src="@/assets/icons/on.svg"
                  class="toggle"
                  @click="configWrapper.config.playVariable[variable] = false"
                  v-if="configWrapper.config.playVariable[variable]" />
                <img src="@/assets/icons/off.svg"
                  class="toggle"
                  @click="configWrapper.config.playVariable[variable] = true"
                  v-if="!configWrapper.config.playVariable[variable]" />
                <span class="variable-8va">8va:</span>
                <select name="{{variable}} 8va" id="variable-octave"
                    class="input" v-model="configWrapper.config.variableOctaves[variable]"
                    @change="configWrapper.config.recomputeActiveOctaves()"
                    :disabled="!configWrapper.config.playVariable[variable]">
                  <option
                    v-for="octave in allOctaves"
                    :value="octave"> 
                    {{ octave }}
                  </option>
                </select>
              </div>
            </span>
          </div>
        </div>
        <div id="more-settings">
          <h2 class="spread-horizontally">
            More settings?
            <img src="@/assets/icons/expand.svg"
              @click="uiState.expandAdvancedSettings = true"
              v-if="!uiState.expandAdvancedSettings"
              class="clickable" />
            <img src="@/assets/icons/collapse.svg"
              @click="uiState.expandAdvancedSettings = false"
              v-if="uiState.expandAdvancedSettings"
              class="clickable" />
          </h2>
          <div
            id="more-settings-collapsible"
            v-if="uiState.expandAdvancedSettings">
            <div id="bpm">
              <h3>BPM: {{ configWrapper.config.bpm }}</h3>
              <div class="slidecontainer">
                <input type="range" min="120" max="300" value="180"
                  class="slider" v-model="configWrapper.config.bpm">
              </div>
            </div>
            <div id="download-midi">
              <div class="spread-horizontally">
                <h3 style="display: inline;">Download MIDI?</h3>
                <img src="@/assets/icons/on.svg"
                    class="toggle"
                    @click="configWrapper.config.downloadMidi = false"
                    v-if="configWrapper.config.downloadMidi" />
                <img src="@/assets/icons/off.svg"
                  class="toggle"
                  @click="configWrapper.config.downloadMidi = true"
                  v-if="!configWrapper.config.downloadMidi" />
              </div>
                <p class="section-hint">
                  If enabled, all notes played so far will be
                  exported to MIDI when you pause the track.
                </p>
            </div>
          </div>
        </div>
      </span>
      <div id="ready">
        <h2 style="display: inline">Ready?</h2>
        <img @click="validateAndPlay" src="@/assets/icons/play.svg"
          class="clickable" v-if="playState.playing == null" />
        <img @click="stop" src="@/assets/icons/stop.svg"
        class="clickable" v-if="playState.playing != null" />
      </div>
    </div>

    <div class="block">
      <!-- Piano -->
      <Piano
        :ref="(el) => { pianoRef = el }"
        :octaves="setUnion(
          configWrapper.config.activeOctaves,
          playState.config?.activeOctaves)" />
      
      <!--Visualizer-->
      <div id="plot-wrapper">
        <svg id="visualiser"></svg>
      </div>
    </div>
  </div>


  <!--TODO-->
  <div hidden=true>
    TODO:
    <ul>
      <li>Generating MIDI takes too long</li>
      <li>Background - red and blue przerywane linie</li>
      <li>More factory presets</li>
      <li>Play the second C an octave higher</li>
      <li>Loading and downloading presets</li>
      <li>Consider making 0 (or 12) a mute note</li>
    </ul>
  </div>
  <br>
</template>
