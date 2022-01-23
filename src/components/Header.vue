<template>
  <header>
    <div class="title">
      AWS CLI Launcher
    </div>
    <div>
      <ReloadButton />
      <ThemeSwitch />
      <SettingsButton />
      <CloseButton />
    </div>
  </header>  
</template>

<script setup>
import ThemeSwitch from './system/ThemeSwitch.vue'
import ReloadButton from './system/ReloadButton.vue'
import CloseButton from './system/CloseButton.vue'
import SettingsButton from './system/SettingsButton.vue'
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
