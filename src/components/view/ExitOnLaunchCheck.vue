<template>
  <div class="checkbox" @click="onChange">
    <label>
      Exit on launch
    </label>
    <CheckBoxMarkedIcon v-if="checked" />
    <CheckBoxBlackIcon v-else />
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
.checkbox label {
  margin-right: 0.2em;
}
</style>
