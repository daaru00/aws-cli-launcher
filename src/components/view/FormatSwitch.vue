<template>
  <select v-model="selected" @change="onSelected">
    <option v-for="format in formats" :key="format" :value="format">{{ format }}</option>
  </select>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useFormatter } from '../../composables/formatter'
const { format, formats, changeFormat } = useFormatter()

const selected = ref(format.value)
const onSelected = () => {
  changeFormat(selected.value)
}

watch(format, () => selected.value = format.value)
</script>
