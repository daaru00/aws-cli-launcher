module.exports = {
  pluginOptions: {
    // https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/guide.html
    electronBuilder: {
      "mainProcessFile": 'src/electron/main.js',
      "preload": "src/electron/preload.js",
      "mainProcessWatch": ['src/electron/**/*'],
      // https://www.electron.build/configuration/configuration
      "builderOptions": {
        "appId": "com.daaru.aws-cli-launcher",
        "productName": "AWS CLI Launcher",
        "executableName": "aws-cli-launcher",
        "icon": "./src/assets/icons/512x512.png",
        "win": {
          "target": ["portable", "nsis"]
        },
        "linux": {
          "target": ["deb", "rpm", "tar.gz", "appImage"],
          "category": "Office",
          "icon": "./src/assets/icons/"
        },
        "mac": {
          "target": ["dmg", "pkg", "tar.gz"],
          "category": "public.app-category.productivity",
          "icon": "./src/assets/icons/icon.icns"
        },
        "publish": {
          "provider": "github",
          "releaseType": "release"
        }
      }
    }
  }
}
