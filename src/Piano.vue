<script setup lang="ts">
import { notes } from './constants'
import { onMounted, reactive, ref, type Ref } from 'vue'
import * as d3 from 'd3'
import OneOctavePiano from './OneOctavePiano.vue'
import type { ActiveNote } from './types';

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

function updatePianoKeys(activeNotes: Array<ActiveNote>): void {
  const activeNotesPerOctave: { [octave: number]: Array<ActiveNote> } = {};
  for (let octave of octaves) {
    activeNotesPerOctave[octave] = [];
  }
  for (let note of activeNotes) {
    const octave: number = +note.note.charAt(note.note.length-1);
    const noteValue: string = note.note.substring(0, note.note.length-1);
    activeNotesPerOctave[octave].push({
      note: noteValue,
      color: note.color
    });
  }
  for (let octave of octaves) {
    octavePianoRefs[octave].value.updatePianoKeys(
      activeNotesPerOctave[octave]);
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
