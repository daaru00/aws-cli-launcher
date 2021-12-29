<template>
  <select :class="{error: noProfilesFound}" v-model="selected" @change="onSelected">
    <option disabled v-if="noProfilesFound">No profiles found</option>
    <option v-for="profile in profiles" :key="profile" :value="profile.name">{{ profile.name }}</option>
  </select>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useAWS } from '../../composables/aws'
const { profile, profiles, assumeProfile } = useAWS()

const noProfilesFound = computed(() => profiles.length === 0)

const selected = ref(profile.value)
const onSelected = () => {
  assumeProfile(selected.value)
}

watch(profile, () => selected.value = profile.value)
</script>
