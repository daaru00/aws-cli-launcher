<template>
  <button @click="goToSettings()" tabindex="-1">
    <SettingsIcon />
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import SettingsIcon from '../icons/settings.vue'

const router = useRouter()
const goToSettings = () => {
  router.push({ name: 'settings' })
}
</script>
