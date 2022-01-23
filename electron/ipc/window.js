import { dialog, app, shell } from 'electron'
import fs from 'fs'
import { exec } from 'child_process'

class WindowChannel {

  /**
   * @param {object} args
   * @param {import('electron').BrowserWindow} args.window
   * @param {string[]} args.allowedExternalHosts
   */
  constructor ({ window, allowedExternalHosts }) {
    this.window = window
    this.allowedExternalHosts = allowedExternalHosts || []
  }

  /**
   * Return application infos
   */
  async infoHandler() {
    return {
      version: app.getVersion()
    }
  }

  /**
   * Close window
   */
  async closeHandler() {
    if (!this.window.isClosable()) {
      return
    }
    this.window.close()
  }

  /**
   * Minimize window
   */
  async minimizeHandler() {
    if (!this.window.isMinimizable() || this.window.isMinimized()) {
      return
    }
    this.window.minimize()
  }

  /**
   * Maximize window
   */
  async maximizeHandler() {
    if (!this.window.isMaximizable() || this.window.isMaximized()) {
      return
    }
    this.window.maximize()
  }

  /**
   * Focus window
   */
  async focusHandler() {
    if (this.window.isFocused()) {
      return
    }
    this.window.focus()
  }

  /**
   * Focus window
   */
  async reloadHandler() {
    this.window.reload()
  }

  /**
   * Open file dialog
   */
   async openFileDialogHandler(event, extensions = ['*']) {
    const files = dialog.showOpenDialogSync(this.window, {
      properties: ['openFile'],
      filters: [
        { name: extensions.map(ext => `*.${ext}`).join(', '), extensions }
      ]
    })

    if (!files) {
      return []
    }

    return files.map(filePath => {
      const slashIndex = filePath.lastIndexOf('/');
      const name = (slashIndex !== -1) ? filePath.substring(slashIndex + 1) : filePath;

      const file = {
        path: filePath,
        name,
        content: fs.readFileSync(filePath).toString('utf8')
      }

      return file
    })
  }

  /**
   * Open directory dialog
   */
  async openDirectoryDialogHandler() {
    const dirs = dialog.showOpenDialogSync(this.window, {
      properties: ['openDirectory']
    })

    return dirs || []
  }

  /**
   * Execute command
   */
  async openTerminalHandler(event, cmd = '', env = {}, cwd = '') {
    exec(cmd, {
      cwd: cwd || app.getPath('home'),
      env: {...process.env, ...env}
    })
  }

  /**
   * Open external link in default browser
   */
  async openExternalLinkHandler(event, url) {
    if (this.allowedExternalHosts.length > 0) {
      const parsedUrl = new URL(url)

      const allowed = this.allowedExternalHosts.findIndex(allowedHost => parsedUrl.hostname.endsWith(allowedHost)) !== -1
      if (!allowed) {
        return
      }
    }

    shell.openExternal(url)
  }
}

export default {
  /**
   * @param {object} args 
   * @param {import('electron').ipcMain} args.ipcMain
   * @param {import('electron').BrowserWindow} args.window
   */
  register: ({ window, ipcMain }) => {
    // Bootstrap provider
    const channel = new WindowChannel({
      window,
      allowedExternalHosts: ['.aws.amazon.com']
    })

    // Register handlers
    ipcMain.handle('window-info', channel.infoHandler.bind(channel))
    ipcMain.handle('window-close', channel.closeHandler.bind(channel))
    ipcMain.handle('window-minimize', channel.minimizeHandler.bind(channel))
    ipcMain.handle('window-maximize', channel.maximizeHandler.bind(channel))
    ipcMain.handle('window-focus', channel.focusHandler.bind(channel))
    ipcMain.handle('window-reload', channel.reloadHandler.bind(channel))
    ipcMain.handle('window-open-file', channel.openFileDialogHandler.bind(channel))
    ipcMain.handle('window-open-directory', channel.openDirectoryDialogHandler.bind(channel))
    ipcMain.handle('window-open-terminal', channel.openTerminalHandler.bind(channel))
    ipcMain.handle('window-open-link', channel.openExternalLinkHandler.bind(channel))
  }
}
