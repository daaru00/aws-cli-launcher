<template>
  <button @click="nextTheme()">
    <Light v-if="theme === 'dark'" />
    <Dark v-if="theme === 'light'" />
  </button>
</template>

<script setup>
import Light from '../icons/light.vue'
import Dark from '../icons/dark.vue'
import { useTheme } from '../../composables/theme'

const { themes, theme, setTheme } = useTheme()

const nextTheme = () => {
  const curIndex = themes.value.indexOf(theme.value)
  let newTheme = ''
  if (curIndex === themes.value.length - 1) {
    newTheme = themes.value[0]
  } else {
    newTheme = themes.value[curIndex + 1]
  }
  setTheme(newTheme)
}
</script>
