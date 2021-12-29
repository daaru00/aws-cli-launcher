/**
 * Default Mac copy/paste menu
 */
export default {
  /**
   * @param {object} args
   * @param {import('electron').app} args.app
   * @param {import('electron').Menu} args.menu
   * @param {import('electron').BrowserWindow} args.window
   */
  register: ({ app, menu, window }) => {

    // Register menu
    menu.setApplicationMenu(menu.buildFromTemplate([
      {
        label: 'Application',
        submenu: [
          {
            label: 'About Application',
            selector: 'orderFrontStandardAboutPanel:'
          },
          { type: 'separator' },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: () => {
              app.quit()
            }
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { label: 'Reload', accelerator: 'CommandOrControl+R', click: () => window.reload() },
          { label: 'Open Developer Tools', accelerator: 'CommandOrControl+Shift+I', click: () => window.webContents.openDevTools({ mode:'undocked' }) }
        ]
      }
    ]))
  }
}
