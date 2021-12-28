<template>
  <button class="primary" @click="onLaunchClick" :disabled="disabled">
    <span class="button-label">Launch terminal</span>
  </button>
</template>

<script setup>
import { useAWS } from '../../composables/aws'
const { profile, region } = useAWS()

import { useWindow } from '../../composables/window'
import { useConfig } from '../../composables/config'
const { openTerminal, close } = useWindow()
const { config } = useConfig()

import { computed } from 'vue'
const disabled = computed(() => !profile.value)

const onLaunchClick = async () => {
  await openTerminal({
    AWS_PROFILE: profile.value,
    AWS_REGION: region.value
  })

  if (config.exitOnLaunch) {
    close()
  }
}
</script>
