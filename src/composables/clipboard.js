import { useIPC } from "./ipc"

export function useClipboard() {
  const { ipc } = useIPC()

  return {
    writeToClipboard: (text) => { ipc.invoke('clipboard-write', text) },
    readFromClipboard: () => { ipc.invoke('clipboard-read') }
  }
}
