# AWS CLI Launcher

A simple application that list AWS CLI's configured profiles, assuming it, list information and launch a terminal with `AWS_PROFILE` and `AWS_REGION` environment variables set.

![Application screenshot](./doc/cover.png)

## Installation and usage

Download the application setup or the portable version for the desired OS directly from the [release page](https://github.com/daaru00/aws-cli-launcher/releases).

This application requires the AWS CLI to be [installed and configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html). In particular, the credentials file `~/.aws/credentials` will be scanned for configured profiles.

## Usage

Once selected the profile the application will assume it and show information about the logged user. 

Click on the "Launch terminal" button to open a terminal window with the following environment variable set:
- AWS_PROFILE
- AWS_REGION

Click on the "Open web console" to open a new tab in your OS default browser with the correct region. If the profile use a `role_arn` it will open the [switch account form](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-console.html) with the following parameters set:
- account_id_number
- role_name
- text_to_display

Tick the "Exit on launch" in order to close the application when one of the buttons is clicked.

In the application header there are some utility buttons that toggle the theme color scheme (dark or light) or reload the application state.

## Troubleshooting

If some error occurred check for an alert icon in the bottom right corner, placing the cursor over it will show a text label with the cause of the error.

## Local development setup

Install dependencies using npm:
```
npm install
```

Compiles and hot-reloads for development
```
electron:serve
```

Build application
```
electron:build
```

Lints and fixes files
```
npm run lint
```

Resources:

- [Vue configuration reference](https://cli.vuejs.org/config/).
- [Electron Builder configuration reference](https://www.electron.build/configuration/configuration).

## Publish new application version

Change the `version` property in package.json file:
```json
{
  "version": "1.0.0"
}
```

Create a version tag with prefix `v`:
```bash
git tag v1.0.0
```

Push tag to GitHub repository:
```bash
git push --tag
```
