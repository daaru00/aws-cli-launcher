import path from 'path'
import fs from 'fs'

class FileChannel {
  /**
   * @param {object} args
   * @param {string} args.path
   */
  constructor ({path}) {
    this.path = path
    this.config = {}
    this.autoSave = false
  }

  /**
   * Load configuration form file
   */
  async loadHandler(event) {
    const dir = path.dirname(this.path)
    if (fs.existsSync(dir) === false) {
      fs.mkdirSync(dir, {
        recursive: true
      })
    }

    if (this.exist() === false) {
      this.saveHandler(event, {})
      return {}
    }

    const config = JSON.parse(fs.readFileSync(this.path).toString('utf8'))
    return config || {}
  }

  /**
   * Save configuration to file
   */
  async saveHandler(event, config) {
    fs.writeFileSync(this.path, JSON.stringify(config || {}))
  }

  /**
   * Check if config file exist
   * 
   * @returns {boolean}
   */
  exist() {
    return fs.existsSync(this.path)
  }

  /**
   * Check if config is empty
   * 
   * @returns {boolean}
   */
  isEmpty() {
    return Object.keys(this.config).length === 0
  }
}

export default {
  /**
   * @param {object} args 
   * @param {import('electron').app} args.app 
   * @param {import('electron').ipcMain} args.ipcMain
   * @param {string} fileName the name of the file (without extension)
   */
  register: ({ app, ipcMain }, fileName = "db") => {
    // Bootstrap provider
    const filePath = path.join(app.getPath("appData"), app.name, fileName + '.json')
    const channel = new FileChannel({
      path: filePath
    })
    console.debug(`[${fileName}] File channel ready, using path ${filePath}`);

    // Register handlers
    ipcMain.handle('file-' + fileName + '-load', channel.loadHandler.bind(channel))
    ipcMain.handle('file-' + fileName + '-save', channel.saveHandler.bind(channel))
  }
}
