export function useIPC() {
  return {
    ipc: window.ipc, // exposed by electron preload script (electron/preload.js)
    cloneObj: (obj) => {
      return JSON.parse(JSON.stringify(obj))
    }
  }
}
