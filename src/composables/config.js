import { useIPC } from "./ipc"
import { useEvents, EVENT_CONFIG_LOADED } from "./events"
import { reactive, computed } from 'vue'

const state = reactive({
  config: {},
  loaded: false
})

export function useConfig() {
  const { ipc, cloneObj } = useIPC()
  const { emit, on } = useEvents()

  const loadConfig = async () => {
    Object.assign(state.config, await ipc.invoke('file-db-load'))
    state.loaded = true

    emit(EVENT_CONFIG_LOADED)
  }

  const saveConfig = async () => {
    await ipc.invoke('file-db-save', cloneObj(state.config))
  }

  const onConfigLoad = (callback) => {
    if (state.loaded) {
      callback()
    }

    on(EVENT_CONFIG_LOADED, callback)
  }

  return {
    config: state.config,
    isLoaded: computed(() => state.loaded),
    loadConfig,
    saveConfig,
    onConfigLoad
  }
}
