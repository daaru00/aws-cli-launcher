<template>
  <div class="checkbox">
    <label for="exit-on-launch">
      Exit on launch
    </label>
    <button id="exit-on-launch" @click="onChange()" tabindex="-1">
      <transition name="fade">
        <CheckBoxMarkedIcon v-if="checked" />
        <CheckBoxBlackIcon v-else />
      </transition>
    </button>
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

.checkbox button {
  display: flex;
  align-items: center;
  font-size: 1.1em;
}
</style>
