<template>
  <SystemBar />
  <main v-if="isLoaded">
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
import { onMounted, ref } from 'vue'

const { loadConfig, onConfigLoad, config } = useConfig()
const { loadProfiles, assumeProfile, switchRegion, isProfileExist } = useAWS()
const { setTheme } = useTheme()

onMounted(loadConfig)

const isLoaded = ref(false)
onConfigLoad(async () => {
  await loadProfiles()

  if (config.profile && isProfileExist(config.profile)) {
    await assumeProfile(config.profile)
  } else if (isProfileExist('default')) {
    await assumeProfile('default')
  }

  if (config.region) {
    await switchRegion(config.region)
  }

  isLoaded.value = true
})

onConfigLoad(() => {
  if (!config.theme) {
    return
  }
  setTheme(config.theme)
})
</script>
