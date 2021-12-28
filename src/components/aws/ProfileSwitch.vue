<template>
  <select v-model="selected" @change="onSelected">
    <option v-for="profile in profiles" :key="profile" :value="profile">{{ profile }}</option>
  </select>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAWS } from '../../composables/aws'
const { profile, profiles, assumeProfile } = useAWS()

const selected = ref(profile.value)
const onSelected = () => {
  assumeProfile(selected.value)
}

watch(profile, () => selected.value = profile.value)
</script>
