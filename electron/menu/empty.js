/**
 * Empty menu
 */
 export default {
  /**
   * @param {object} args
   * @param {import('electron').Menu} args.menu
   */
  register: ({ menu }) => {
    menu.setApplicationMenu(null)
  }
}
