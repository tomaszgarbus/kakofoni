<script setup lang="ts">
import { ref, type Ref } from 'vue'
import OneOctavePiano from './OneOctavePiano.vue'
import type { ActiveNote } from './types';
import { extendedOctaves } from './constants';
import PianoOctaveSeparator from './PianoOctaveSeparator.vue';

/* CONFIG */

const props = defineProps(['octaves']);

/* STATE */

const octavePianoRefs: { [octave: number]: Ref } = {};
for (let octave of extendedOctaves) {
  octavePianoRefs[octave] = ref(null);
}

/* LOGIC */

function updatePianoKeys(activeNotes: Array<ActiveNote>): void {
  const activeNotesPerOctave: { [octave: number]: Array<ActiveNote> } = {};
  for (let octave of listPlayedOctaves()) {
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
  for (let octave of listPlayedOctaves()) {
    octavePianoRefs[octave].value.updatePianoKeys(
      activeNotesPerOctave[octave]);
  }
}

function sortedOctaves(): Array<number> {
  var result: Array<number> = Array.from(props.octaves);
  result.sort();
  return result;
}

function sortedOctavesWithGaps(): Array<[number, boolean] | null> {
  var sorted = sortedOctaves();
  var withGaps: Array<[number, boolean] | null> = [];
  for (let idx in sorted) {
    const octave = sorted[idx];
    if (withGaps.length > 0) {
      const last = withGaps[withGaps.length - 1];
      if (last != null && octave - last[0] > 1) {
        withGaps.push([last[0] + 1, false]);
        withGaps.push(null);
      }
    }
    withGaps.push([octave, true]);
  }
  withGaps.push([withGaps[withGaps.length - 1]!![0] + 1, false]);
  return withGaps;
}

function listPlayedOctaves(): Array<number> {
  const octaves: Array<number> = []
  for (const desc of sortedOctavesWithGaps()) {
    if (desc != null) {
      octaves.push(desc[0])
    }
  }
  return octaves
}

defineExpose({
  updatePianoKeys,
})

</script>

<template>
  <div id="piano-block">
    <span v-for="desc in sortedOctavesWithGaps()" style="height: fit-content">
      <span v-if="desc">
        <OneOctavePiano
          :octave="desc[0]"
          :full="desc[1]"
          :ref="(el) => {
            if (el != null) {
              octavePianoRefs[desc[0]].value = el;
            }
          }" />  
      </span>
      <span v-if="!desc">
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
