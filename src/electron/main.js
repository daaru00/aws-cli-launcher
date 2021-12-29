import path from 'path'
import { app, protocol, BrowserWindow, Menu, ipcMain, globalShortcut } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// Applications menus
import MacMenu from './menu/mac'
import EmptyMenu from './menu/empty'

// IPC channels
import ArgvChannel from './ipc/argv'
import FileChannel from './ipc/file'
import WindowChannel from './ipc/window'
import AwsChannel from './ipc/aws'
import ClipboardChannel from './ipc/clipboard'

class Main {

  /**
   * Main application constructor
   */
  constructor() {
    this.components = []
    this.mainWindow = null
  }

  /**
   * Return true in development environment
   * @returns {boolean}
   */
  isDevelopment() {
    return process.env.NODE_ENV !== 'production'
  }

  /**
   * Init entry point
   */
  init() {
    // Disable hardware acceleration
    app.disableHardwareAcceleration()

    // Register hooks
    app.on('ready', this.onReady.bind(this));
    app.on('window-all-closed', this.onWindowAllClosed.bind(this));
    app.on('activate', this.onActivate.bind(this));

    app.on('browser-window-focus', this.registerShortcut.bind(this));
    app.on('browser-window-blur', this.unregisterShortcut.bind(this));

    // Register exit process hooks
    if (process.platform === 'win32') {
      process.on('message', (data) => {
        if (data === 'graceful-exit') {
          app.quit()
        }
      })
    } else {
      process.on('SIGTERM', () => {
        app.quit()
      })
    }
  }

  /**
   * Register IPC channels
   */
  registerIpcChannels() {
    const context = { app, ipcMain, window: this.mainWindow }

    FileChannel.register(context)
    WindowChannel.register(context)
    ArgvChannel.register(context)
    AwsChannel.register(context)
    ClipboardChannel.register(context)
  }

  /**
   * Triggered when application is ready
   */
  onReady() {
    if (this.isDevelopment() && !process.env.IS_TEST) {
      // Install Vue Devtools
      try {
        installExtension(VUEJS_DEVTOOLS).then(this.createWindow())
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString())
      }
    } else {
      this.createWindow()
    }
  }

  /**
   * Triggered when application is activated
   */
  onActivate() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) this.createWindow()
  }

  /**
   * Triggered when all window are closed
   */
  onWindowAllClosed() {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }

  /**
   * Create window
   */
  createWindow() {
    if (this.mainWindow != null) {
      this.mainWindow.close()
    }

    // Create browser window
    this.mainWindow = new BrowserWindow({
      height: 600,
      maxHeight: 700,
      minHeight: 550,
      width: 350,
      maxWidth: 450,
      minWidth: 350,
      resizable: true,
      frame: false,
      backgroundColor: '#FFFFFF',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(app.getAppPath(), "preload.js")
      },
      icon: this.isDevelopment() ? 'public/icon.png' : './icon.png'
    })

    // Register IPC channels
    this.registerIpcChannels()

    // Mac need a base menu for copy/past features
    if (process.platform === 'darwin') {
      MacMenu.register({ app, menu: Menu })
    } else {
      EmptyMenu.register({ app, menu: Menu })
    }

    // Check webpack dev server config
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      this.mainWindow
        .loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        .then(() => {
          // If in development environment
          if (!process.env.IS_TEST) {
            this.mainWindow.webContents.openDevTools({mode:'undocked'})
          }
        })
    } else {
      // Register protocol for file assets
      createProtocol('app')

      // Load the index.html when not in development
      this.mainWindow.loadURL('app://./index.html')
    }
  }

  registerShortcut() {
    // register ctrl/cmd+r shortcut
    globalShortcut.register('CommandOrControl+R', () => {
      this.mainWindow.reload()
    })

    // register ctrl/cmd+i shortcut
    globalShortcut.register('CommandOrControl+Shift+I', () => {
      this.mainWindow.webContents.openDevTools({mode:'undocked'})
    })
  }

  unregisterShortcut() {
    globalShortcut.unregisterAll()
  }
}

// Initialize application
(new Main()).init()
