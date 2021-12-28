import { computed, reactive } from "vue"
import { useIPC } from "./ipc"

const state = reactive({
  loading: false
})

export function useWindow() {
  const { ipc } = useIPC()

  const setLoading = (loading) => {
    state.loading = loading
  }

  return {
    setLoading,
    isLoading: computed(() => state.loading),
    close: () => { ipc.invoke('window-close') },
    minimize: () => { ipc.invoke('window-minimize') },
    maximize: () => { ipc.invoke('window-maximize') },
    focus: () => { ipc.invoke('window-focus') },
    reload: () => { ipc.invoke('window-reload') },
    openFileDialog: () => { return ipc.invoke('window-open-file', ['json']) },
    openDirectoryDialog: () => { return ipc.invoke('window-open-directory') },
    openTerminal: (env = {}) => { ipc.invoke('window-open-terminal', env) },
  }
}
