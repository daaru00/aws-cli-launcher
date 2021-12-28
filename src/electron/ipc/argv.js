class ArgvChannel {

  /**
   * @param {object} args
   * @param {import('electron').BrowserWindow} args.window
   */
  constructor ({ argv }) {
    this.argv = argv
  }

  /**
   * Get args
   */
  async getArgsHandler() {
    return this.argv
  }

}

export default {
  /**
   * @param {object} args 
   * @param {import('electron').ipcMain} args.ipcMain
   */
  register: ({ ipcMain }) => {
    // Bootstrap provider
    const channel = new ArgvChannel({
      argv: process.argv
    })

    // Register handlers
    ipcMain.handle('argv-get', channel.getArgsHandler.bind(channel))
  }
}
