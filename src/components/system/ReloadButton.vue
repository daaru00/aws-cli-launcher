<template>
  <button @click="reload()" tabindex="-1">
    <ReloadIcon />
  </button>
</template>

<script setup>
import ReloadIcon from '../icons/reload.vue'
import { useConfig } from '../../composables/config'
import { useAWS } from '../../composables/aws'

const { loadConfig } = useConfig()
const { loadProfiles } = useAWS()

const reload = async () => {
  await loadConfig()
  await loadProfiles()
}
</script>
