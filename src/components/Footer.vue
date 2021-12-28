<template>
  <footer>
    <span class="info">{{ 'v'+info.version }}</span>
    <Pending v-if="isLoading" />
    <Ready v-else />
  </footer>  
</template>

<script setup>
import Pending from './icons/pending.vue'
import Ready from './icons/ready.vue'

import { onMounted, ref } from 'vue'
import { useWindow } from '../composables/window'

const { isLoading, getInfo } = useWindow()
const info = ref({})
onMounted(async () => {
  info.value = await getInfo()
})
</script>

<style scoped>
footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
}
footer .info {
  font-size: 0.75em;
  margin-left: 0.5em;
}
</style>
