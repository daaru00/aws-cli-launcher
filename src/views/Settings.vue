<template>
  <h1 class="settings-title">
    Settings
  </h1>

  <div class="settings">
    <p>
      <label for="terminal-command">Open terminal command</label>
      <input id="terminal-command" type="text" v-model="changes.command" required />
    </p>
  </div>

  <div class="settings-actions">
    <button class="cancel" @click="onCancelClick">Cancel</button>
    <button class="save" :disabled="isLoading" @click="onSaveClick">Save</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useConfig } from "../composables/config";
import { useWindow } from "../composables/window";

const { config, saveConfig } = useConfig();
const { setLoading, isLoading } = useWindow();

const changes = ref({})
onMounted(() => {
  Object.assign(changes.value, config)
})

const router = useRouter();
const onSaveClick = async () => {
  Object.assign(config, changes.value)

  setLoading(true)
  await saveConfig()
  setLoading(false)

  onCancelClick()
};

const onCancelClick = () => {
  Object.assign(changes.value, config)
  router.push({ name: "index" });
}
</script>

<style>
.settings-title {
  margin: 0;
}

.settings {
  max-height: 70vh;
  overflow-y: auto;
  flex-grow: 1;
}

.settings h3 {
  border-bottom: 1px groove var(--border-color);
}

.settings p {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
}

.settings p input[type="number"] {
  width: 5em;
  text-align: center;
}

.settings p input[type="time"] {
  width: 6.5em;
  text-align: center;
}

.settings input[type="text"], .settings input[type="email"] {
  max-width: 20em;
}

.settings input[type="checkbox"] {
  margin: 0 2.5em;
}

.settings-actions {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.settings-actions button {
  font-size: 1.2em;
  text-transform: uppercase;
  border-radius: 5px;
  border: 1px solid transparent;
  transition: border-color 300ms;
}

.settings-actions button.cancel {
  color: var(--error-color);
}

.settings-actions button.save:hover:not(:disabled) {
  border-color: var(--border-color)
}

.settings-actions button.cancel:hover:not(:disabled) {
  border-color: var(--error-color)
}
</style>
