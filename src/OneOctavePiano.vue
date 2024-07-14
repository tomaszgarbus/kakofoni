<script setup lang="ts">
import { notes, octaves } from './constants'
import { onMounted, reactive, ref, type Ref } from 'vue'
import * as d3 from 'd3'

const props = defineProps(['octave'])
const octave: number = props.octave
var svgRef: Ref = ref(null);

function updatePianoKeys(activeNotes: Array<string>): void {
  for (var note of notes) {
    const fill = note.endsWith('#') ? 'black' : 'white';
    svgRef.value.getElementById(note).setAttribute('fill', fill);
  }

  for (var note of activeNotes) {
    // TODO: Reuse --primary-color from CSS.
    svgRef.value.getElementById(note).setAttribute('fill', '#EB3D47');
  }
}

defineExpose({
  updatePianoKeys,
})

</script>

<template>
  <div>
    <h2 style="margin-bottom: 20px">8va: {{ octave }}</h2>
    <svg :ref="(el) => { svgRef = el }" width="400" height="227" viewBox="0 0 400 227" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="Keyboard">
        <g id="c">
        <path id="C" fill-rule="evenodd" clip-rule="evenodd" d="M16.4575 0C7.36827 0 0 7.36827 0 16.4575V210.263C0 219.352 7.36828 226.721 16.4575 226.721H36.9838C46.073 226.721 53.4413 219.352 53.4413 210.263V151.041C52.8235 151.111 52.1954 151.147 51.5587 151.147H48.8462C39.757 151.147 32.3887 143.779 32.3887 134.69V0H16.4575Z" fill="white"/>
        </g>
        <g id="d">
        <path id="D" fill-rule="evenodd" clip-rule="evenodd" d="M57.7598 210.263V149.939C63.7755 147.49 68.0162 141.585 68.0162 134.69V1.20826C69.93 0.42922 72.0235 0 74.2173 0H94.7436C96.7328 0 98.6397 0.352938 100.405 0.999611V134.69C100.405 141.79 104.901 147.839 111.201 150.148V210.263C111.201 219.352 103.833 226.721 94.7436 226.721H74.2173C65.128 226.721 57.7598 219.352 57.7598 210.263Z" fill="white"/>
        </g>
        <g id="e">
        <path id="E" fill-rule="evenodd" clip-rule="evenodd" d="M136.572 0H168.961V210.263C168.961 219.352 161.593 226.721 152.503 226.721H131.977C122.888 226.721 115.52 219.352 115.52 210.263V151.041C116.137 151.111 116.766 151.147 117.402 151.147H120.115C129.204 151.147 136.572 143.779 136.572 134.69V0Z" fill="white"/>
        </g>
        <g id="f">
        <path id="F" fill-rule="evenodd" clip-rule="evenodd" d="M205.668 0H173.279V210.263C173.279 219.352 180.648 226.721 189.737 226.721H210.263C219.352 226.721 226.721 219.352 226.721 210.263V151.041C226.103 151.111 225.475 151.147 224.838 151.147H222.126C213.036 151.147 205.668 143.779 205.668 134.69V0Z" fill="white"/>
        </g>
        <g id="g">
        <path id="G" fill-rule="evenodd" clip-rule="evenodd" d="M231.039 210.263V149.939C237.055 147.49 241.296 141.585 241.296 134.69V1.20826C243.209 0.42922 245.303 0 247.497 0H268.023C268.475 0 268.923 0.0182292 269.366 0.0539928V134.69C269.366 143.327 276.019 150.41 284.48 151.093V210.263C284.48 219.352 277.112 226.721 268.023 226.721H247.497C238.407 226.721 231.039 219.352 231.039 210.263Z" fill="white"/>
        </g>
        <g id="a">
        <path id="A" fill-rule="evenodd" clip-rule="evenodd" d="M342.78 210.263V149.939C336.764 147.49 332.524 141.585 332.524 134.69V1.20826C330.61 0.42922 328.516 0 326.323 0H305.796C305.344 0 304.896 0.0182292 304.453 0.0539928V134.69C304.453 143.327 297.8 150.41 289.339 151.093V210.263C289.339 219.352 296.707 226.721 305.796 226.721H326.323C335.412 226.721 342.78 219.352 342.78 210.263Z" fill="white"/>
        </g>
        <g id="b">
        <path id="B" fill-rule="evenodd" clip-rule="evenodd" d="M383.543 0C392.632 0 400 7.36827 400 16.4575V210.263C400 219.352 392.632 226.721 383.543 226.721H363.016C353.927 226.721 346.559 219.352 346.559 210.263V151.041C347.176 151.111 347.805 151.147 348.441 151.147H351.154C360.243 151.147 367.611 143.779 367.611 134.69V0H383.543Z" fill="white"/>
        </g>
        <g id="c#">
        <path id="C#" d="M35.0877 0H65.3171V133.333C65.3171 141.681 58.55 148.448 50.2024 148.448V148.448C41.8548 148.448 35.0877 141.681 35.0877 133.333V0Z" fill="black"/>
        </g>
        <g id="d#">
        <path id="D#" d="M103.104 0H133.333V133.333C133.333 141.681 126.566 148.448 118.219 148.448V148.448C109.871 148.448 103.104 141.681 103.104 133.333V0Z" fill="black"/>
        </g>
        <g id="f#">
        <path id="F#" d="M208.367 0H238.596V133.333C238.596 141.681 231.829 148.448 223.482 148.448V148.448C215.134 148.448 208.367 141.681 208.367 133.333V0Z" fill="black"/>
        </g>
        <g id="g#">
        <path id="G#" d="M271.525 0H301.754V133.333C301.754 141.681 294.987 148.448 286.64 148.448V148.448C278.292 148.448 271.525 141.681 271.525 133.333V0Z" fill="black"/>
        </g>
        <g id="a#">
        <rect width="30.2294" height="148.448" transform="translate(335.223)" fill="url(#paint0_linear_37_6030)"/>
        <path id="A#" d="M335.223 0H365.452V133.333C365.452 141.681 358.685 148.448 350.337 148.448V148.448C341.99 148.448 335.223 141.681 335.223 133.333V0Z" fill="black"/>
        </g>
      </g>
    </svg>
  </div>
</template>
