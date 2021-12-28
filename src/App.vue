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
