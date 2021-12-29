<template>
  <footer>
    <span class="info">{{ 'v'+info.version }}</span>
    <PendingIcon v-if="isLoading" />
    <ErrorIcon v-else-if="isInError" />
    <ReadyIcon v-else />
  </footer>  
</template>

<script setup>
import PendingIcon from './icons/pending.vue'
import ReadyIcon from './icons/ready.vue'
import ErrorIcon from './icons/error.vue'

import { onMounted, ref } from 'vue'
import { useWindow } from '../composables/window'

const { isLoading, isInError, getInfo } = useWindow()
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
