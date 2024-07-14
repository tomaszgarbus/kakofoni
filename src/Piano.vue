<script setup lang="ts">
import { notes } from './constants'
import { onMounted, reactive, ref, type Ref } from 'vue'
import * as d3 from 'd3'
import OneOctavePiano from './OneOctavePiano.vue'

/* CONFIG */

const props = defineProps(['octaves']);
const octaves: Array<number> = props.octaves;

/* STATE */

const octavePianoRefs: { [octave: number]: Ref } = {};
for (let octave of octaves) {
  octavePianoRefs[octave] = ref(null);
}
console.log(octavePianoRefs);

/* LOGIC */

function updatePianoKeys(activeNotes: Array<string>): void {
  const activeNotesPerOctave: { [octave: number]: Array<string> } = {};
  for (let octave of octaves) {
    activeNotesPerOctave[octave] = [];
  }
  for (let note of activeNotes) {
    const octave: number = +note.charAt(note.length-1);
    const noteValue: string = note.substring(0, note.length-1);
    activeNotesPerOctave[octave].push(noteValue);
  }
  for (let octave of octaves) {
    octavePianoRefs[octave].value.updatePianoKeys(activeNotesPerOctave[octave]);
  }
}

defineExpose({
  updatePianoKeys,
})

</script>

<template>
  <div class="block" id="piano-block">
    <span v-for="octave in octaves" style="height: fit-content">
      <OneOctavePiano
        :octave="octave"
        :ref="(el) => { octavePianoRefs[octave].value = el}" />
    </span>
  </div>
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
  /* color: red; */
}
</style>
