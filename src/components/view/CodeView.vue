<template>
  <div class="code-block">
    <textarea readonly v-text="content"></textarea>
    <button :class="{ copied: copied }" @click="onCopyClick">{{ copied ? 'Copied!' : 'Copy' }}</button>
  </div>
</template>

<script setup>
import { computed, defineProps, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const content = computed(() => JSON.stringify(props.modelValue || {}, null, 2))

import { useClipboard } from '../../composables/clipboard'
const { writeToClipboard } = useClipboard()

let labelTimeout = null
const copied = ref(false)

const onCopyClick = () => {
  writeToClipboard(content.value)
  copied.value = true

  if (labelTimeout) clearTimeout(labelTimeout)
  labelTimeout = setTimeout(() => copied.value = false, 1000)
}
</script>

<style scoped>
.code-block {
  background-color: var(--background-color);
  position: relative;
  padding: 0.5em;
  margin-top: 1em;
  border: 1px solid var(--border-color);
}

textarea {
  overflow: auto;
  resize: none;
  width: 100%;
  height: 10em;
  background-color: var(--background-color);
  color: var(--font-color);
  border: 0;
}

textarea:focus {
  outline: none;
}

button {
  position: absolute;
  right: 0;
  bottom: 0;
  border-top: 1px solid var(--border-color);
  border-left: 1px solid var(--border-color);
}

button.copied {
  color: var(--primary-color);
}
</style>
