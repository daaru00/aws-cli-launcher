<template>
  <select v-model="selected" @change="onSelected">
    <option v-for="region in regions" :key="region" :value="region">{{ region }}</option>
  </select>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAWS } from '../../composables/aws'
const { region, regions, switchRegion } = useAWS()

const selected = ref(region.value)
const onSelected = () => {
  switchRegion(selected.value)
}

watch(region, () => selected.value = region.value)
</script>
