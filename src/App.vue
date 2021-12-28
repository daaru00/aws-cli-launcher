<template>
  <SystemBar />
  <main>
    <router-view/>
  </main>
  <StatusBar />
</template>

<script setup>
import SystemBar from './components/Header.vue'
import StatusBar from './components/Footer.vue'

import { useConfig } from './composables/config'
import { useAWS } from './composables/aws'
import { useTheme } from './composables/theme'
import { onMounted } from 'vue'

const { loadConfig, onConfigLoad, config } = useConfig()
const { loadProfiles, assumeProfile, switchRegion } = useAWS()
const { setTheme } = useTheme()

// execute application loading
onMounted(() => Promise.all([loadConfig(), loadProfiles()]))

onConfigLoad(async () => {
  if (config.profile) {
    // assume profile is called event if profiles are not already loaded
    await assumeProfile(config.profile)
  }
  if (config.region) {
    await switchRegion(config.region)
  }
})

onConfigLoad(() => {
  if (!config.theme) {
    return
  }
  setTheme(config.theme)
})
</script>

<style>
body {
  margin: 0;

  background-color: var(--background-color);
  color: var(--font-color);
}

#app {
  min-height: calc(100vh);

  display: grid;
  gap: 0;
  grid-template-columns: 100%;
  grid-template-rows: calc(1em + 10px) auto calc(1em + 10px);
  grid-template-areas:
    "header"
    "main"
    "footer";
}

header {
  grid-area: header;
  border-bottom: 1px solid var(--font-color);
}

main {
  grid-area: main;
  padding: 1em;
}

footer {
  grid-area: footer;
}

svg {
  height: 1em;
  width: 1em;
}

* {
  transition: color,background 200ms linear;
}

*::selection {
  background-color: var(--font-color);
  color: var(--background-color);
}

select {
  background-color: var(--background-color);
  color: var(--font-color);
  margin: 0 0.5em;
  border: 0;
}

select:focus{
  outline: none;
}

button {
  background-color: transparent;
  color: var(--font-color);
  border: 0;
  cursor: pointer;
}

*::-webkit-scrollbar {
  width: 5px;
}

*::-webkit-scrollbar-corner {
  background: var(--background-color);
}

*::-webkit-scrollbar-thumb {
  background-color: var(--font-color);
  background-clip: content-box;
}

*::-webkit-scrollbar-track {
  background-color: var(--background-color);
}
</style>
