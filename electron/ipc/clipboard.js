import { clipboard } from 'electron'

class ClipboardChannel {

  /**
   * Write clipboard
   */
  async writeHandler(event, text) {
    clipboard.writeText(text)
  }

  /**
   * Read clipboard
   */
  async readHandler() {
    clipboard.readText()
  }
}

export default {
  /**
   * @param {object} args 
   * @param {import('electron').ipcMain} args.ipcMain
   */
  register: ({ ipcMain }) => {
    // Bootstrap provider
    const channel = new ClipboardChannel()

    // Register handlers
    ipcMain.handle('clipboard-write', channel.writeHandler.bind(channel))
    ipcMain.handle('clipboard-read', channel.readHandler.bind(channel))
  }
}
