<script setup lang="ts">
import { notes, octaves } from './constants'
import { onMounted, reactive, ref, type Ref } from 'vue'

const noteRefs: { [note: string]: Ref } = {};

for (var note of notes) {
  noteRefs[note] = ref(null);
}

function updatePianoKeys(activeNotes: Array<string>): void {
  for (var note of notes) {
    noteRefs[note].value.classList.remove('active');
  }

  console.log(activeNotes);
  for (var note of activeNotes) {
    noteRefs[note].value.classList.add('active');
  }
}

defineExpose({
  updatePianoKeys,
})

</script>

<template>
  <p>
    <div v-for="note in notes">
      <div v-if="!note.includes('#')" class="white-key" id="{{ note }}"
          :ref="(el) => { noteRefs[note].value = el }">
        {{ note }}
      </div>
      <div v-if="note.includes('#')" class="black-key" id="{{ note }}"
          :ref="(el) => { noteRefs[note].value = el }">
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
