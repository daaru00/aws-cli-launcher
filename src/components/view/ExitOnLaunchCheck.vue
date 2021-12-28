<template>
  <div class="checkbox">
    <label @click="onChange">
      Exit on launch
    </label>
    <CheckBoxMarkedIcon @click="onChange" v-if="checked" />
    <CheckBoxBlackIcon @click="onChange" v-else />
  </div>
</template>

<script setup>
import CheckBoxMarkedIcon from '../icons/checkbox-marked.vue'
import CheckBoxBlackIcon from '../icons/checkbox-blank.vue'

import { computed,  } from 'vue'
import { useConfig } from '../../composables/config'
const { config, saveConfig } = useConfig()

const checked = computed(() => config.exitOnLaunch)

const onChange = () => {
  config.exitOnLaunch = !config.exitOnLaunch
  saveConfig()
}
</script>

<style scoped>
.checkbox {
  width: 100%;
  margin-top: 1em;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.checkbox > * {
  cursor: pointer;
}

.checkbox label {
  margin-right: 0.2em;
  user-select: none;
}
</style>
