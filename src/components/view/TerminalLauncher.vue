<template>
  <button @click="onLaunchClick">
    Launch
  </button>
</template>

<script setup>
import { useAWS } from '../../composables/aws'
const { profile, region } = useAWS()

import { useWindow } from '../../composables/window'
const { openTerminal } = useWindow()

const onLaunchClick = async () => {
  await openTerminal({
    AWS_PROFILE: profile.value,
    AWS_REGION: region.value
  })
}
</script>

<style scoped>
button {
  font-size: 1em;
  padding: 0.5em;
  border: 0;
  background-color: var(--primary-color);
  text-align: center;
  width: 100%;
  font-weight: bold;
}
</style>
