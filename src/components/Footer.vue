<template>
  <footer>
    <span v-if="isLoading"><Pending /></span>
    <span v-else><Ready /></span>
  </footer>  
</template>

<script setup>
import Pending from './icons/pending.vue'
import Ready from './icons/ready.vue'

import { useWindow } from '../composables/window'
const { isLoading } = useWindow()
</script>

<style scoped>
footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 5px;
}
</style>
