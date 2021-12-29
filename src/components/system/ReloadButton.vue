<template>
  <button @click="loadConfig()" tabindex="-1">
    <ReloadIcon />
  </button>
</template>

<script setup>
import ReloadIcon from '../icons/reload.vue'

import { useConfig } from '../../composables/config'
const { loadConfig } = useConfig()
</script>
