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
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' }
        ]
      }
    ]))
  }
}
