<template>
  <button @click="close()" tabindex="-1">
    <CloseIcon />
  </button>
</template>

<script setup>
import CloseIcon from '../icons/close.vue'
import { useWindow } from '../../composables/window'
const { close } = useWindow()
</script>
