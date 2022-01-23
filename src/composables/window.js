import { computed, reactive } from "vue"
import { useConfig } from "./config"
import { useIPC } from "./ipc"

const state = reactive({
  loading: false,
  error: null
})

export function useWindow() {
  const { ipc } = useIPC()
  const { config } = useConfig()

  const setLoading = (loading) => {
    state.loading = loading
  }

  const setError = (message) => {
    state.error = message
  }

  return {
    setLoading,
    setError,
    isLoading: computed(() => state.loading),
    isInError: computed(() => !!state.error),
    errorMessage: computed(() => state.error || ''),
    getInfo: () => { return ipc.invoke('window-info') },
    close: () => { ipc.invoke('window-close') },
    minimize: () => { ipc.invoke('window-minimize') },
    maximize: () => { ipc.invoke('window-maximize') },
    focus: () => { ipc.invoke('window-focus') },
    reload: () => { ipc.invoke('window-reload') },
    openFileDialog: () => { return ipc.invoke('window-open-file', ['json']) },
    openDirectoryDialog: () => { return ipc.invoke('window-open-directory') },
    openTerminal: (env = {}) => { ipc.invoke('window-open-terminal', config.command, env) },
    openExternalLink: (env = {}) => { ipc.invoke('window-open-link', env) },
  }
}
