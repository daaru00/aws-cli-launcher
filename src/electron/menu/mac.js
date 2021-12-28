/**
 * Default Mac copy/paste menu
 */
export default {
  /**
   * @param {object} args
   * @param {import('electron').app} args.app
   * @param {import('electron').Menu} args.menu
   */
  register: ({ app, menu }) => {

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
          { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
          {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            selector: 'redo:'
          },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
          {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            selector: 'selectAll:'
          }
        ]
      }
    ]))
  }
}
