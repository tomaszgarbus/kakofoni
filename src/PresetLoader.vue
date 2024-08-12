<script setup lang="ts">
import { reactive } from 'vue';
import { predefinedConfigs } from './predefined_configs';
import type UserConfig from './user_config';

type UIState = {
  showDropdown: boolean,
}

const uiState: UIState = reactive({
  showDropdown: false,
})

const props = defineProps(['onSelect', 'downloadConfig', 'uploadConfig']);
const onSelect: (preset: UserConfig) => (void) =
  props['onSelect'];
const downloadConfig: () => (void) = props['downloadConfig'];
const uploadConfig: () => (void) = props['uploadConfig'];

</script>

<template>
  <div id="dropdown-wrapper">
    <span id="preset-dropdown-button-wrapper">
      <button
        @click="uiState.showDropdown = !uiState.showDropdown"
        id="preset-dropdown-button">
        Load preset
        <img v-if="!uiState.showDropdown" src="@/assets/icons/dropdown-open.svg" />
        <img v-if="uiState.showDropdown" src="@/assets/icons/dropdown-close.svg" />
      </button>
      <img
        src="@/assets/icons/download.svg"
        style="cursor: pointer"
        title="Download current config as file."
        @click="downloadConfig()" />
      <img src="@/assets/icons/upload.svg"
        title="Upload config as file."
        style="cursor: pointer"
        @click="uploadConfig()" />
    </span>
    <div id="preset-dropdown-list" v-if="uiState.showDropdown">
      <span v-for="[name, preset] of Object.entries(predefinedConfigs)">
        <button
          class="preset-button"
          @click="onSelect(preset.copy()); uiState.showDropdown = false;">
          {{ name }}
        </button>
      </span>
    </div>
  </div>
</template>

<style scoped>
#preset-dropdown-button-wrapper {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

#preset-dropdown-button {
  background-image: var(--primary-gradient);
  border: none;
  border-radius: 20px;
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  font-family: 'Solway';
  font-size: 20px;
  padding: 10px;
}

#dropdown-wrapper {
  position: relative;
  display: inline-block;
}

#preset-dropdown-list {
  border-radius: 20px;
  background-color: white;
  box-shadow: 2px 2px 5px lightgray;
  font-family: 'Solway';
  font-size: 20px;
  padding: 10px;
  position: absolute;
  width: fit-content;
  z-index: 1;
}

.preset-button {
  background-color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  display: block;
  font-family: 'Solway';
  font-size: 20px;
  padding: 10px;
  width: 100%;
}
</style>