import { contextBridge, ipcRenderer } from "electron"

export const ipc = {
  /**
   * Invoke remote method
   * 
   * @param {string} channel 
   * @param  {...any} args 
   * @returns 
   */
  invoke: (channel, ...args) => {
    console.debug("[IPC] Invoked remote method", channel)
    return ipcRenderer.invoke(channel, ...args)
  }
}

// Expose IPC to web context
contextBridge.exposeInMainWorld("ipc", ipc);
