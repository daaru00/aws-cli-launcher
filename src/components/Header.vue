<template>
  <header>
    <div class="title">
      AWS CLI Launcher
    </div>
    <div>
      <ThemeSwitch />
      <button @click="close()" tabindex="-1">
        <Close />
      </button>
    </div>
  </header>  
</template>

<script setup>
import ThemeSwitch from './system/ThemeSwitch.vue'
import Close from './icons/close.vue'

import { useWindow } from '../composables/window'
const { close } = useWindow()
</script>

<style>
header {
  -webkit-app-region: drag;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  
  padding: 5px;
  cursor: move;
}

header button {
  -webkit-app-region: no-drag;
}
</style>
