module.exports = {
  pluginOptions: {
    // https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/guide.html
    electronBuilder: {
      "mainProcessFile": './electron/main.js',
      "preload": "./electron/preload.js",
      "mainProcessWatch": ['./electron/**/*'],
      // https://www.electron.build/configuration/configuration
      "builderOptions": {
        "appId": "com.daaru.aws-cli-launcher",
        "copyright": "Copyright © 2021 Fabio Gollinucci",
        "win": {
          "target": ["portable", "nsis"]
        },
        "linux": {
          "target": ["deb", "rpm", "tar.gz", "appImage"],
          "category": "Office"
        },
        "mac": {
          "target": ["dmg", "pkg", "tar.gz"],
          "category": "public.app-category.productivity"
        },
        "publish": {
          "provider": "github",
          "releaseType": "release"
        }
      }
    }
  }
}
