<script setup lang="ts">
import { ref, type Ref } from 'vue'
import OneOctavePiano from './OneOctavePiano.vue'
import type { ActiveNote } from './types';
import { allOctaves } from './constants';
import PianoOctaveSeparator from './PianoOctaveSeparator.vue';

/* CONFIG */

const props = defineProps(['octaves']);

/* STATE */

const octavePianoRefs: { [octave: number]: Ref } = {};
for (let octave of allOctaves) {
  octavePianoRefs[octave] = ref(null);
}

/* LOGIC */

function updatePianoKeys(activeNotes: Array<ActiveNote>): void {
  const activeNotesPerOctave: { [octave: number]: Array<ActiveNote> } = {};
  for (let octave of props.octaves) {
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
  for (let octave of props.octaves) {
    octavePianoRefs[octave].value.updatePianoKeys(
      activeNotesPerOctave[octave]);
  }
}

function sortedOctaves(): Array<number> {
  var result: Array<number> = Array.from(props.octaves);
  result.sort();
  return result;
}

function sortedOctavesWithGaps(): Array<number | null> {
  var sorted = sortedOctaves();
  var withGaps: Array<number | null> = [];
  for (let idx in sorted) {
    const octave = sorted[idx];
    if (withGaps.length > 0) {
      const last = withGaps[withGaps.length - 1];
      if (last != null && octave - last > 1) {
        withGaps.push(null);
      }
    }
    withGaps.push(octave);
  }
  return withGaps;
}

defineExpose({
  updatePianoKeys,
})

</script>

<template>
  <div id="piano-block">
    <span v-for="octave in sortedOctavesWithGaps()" style="height: fit-content">
      <span v-if="octave">
        <OneOctavePiano
          :octave="octave"
          :ref="(el) => {
            if (el != null) {
              octavePianoRefs[octave].value = el;
            }
          }" />  
      </span>
      <span v-if="!octave">
        <PianoOctaveSeparator />
      </span>
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
