import path from 'path'
import fs from 'fs'
import os from 'os'
import {
  STSClient,
  AssumeRoleCommand,
  GetCallerIdentityCommand
} from '@aws-sdk/client-sts'

/**
 * Return current timestamp
 *
 * @returns {int}
 */
function getCurrentTimestamp () {
  return parseInt(new Date().getTime() / 1000)
}

/**
 * AWS Provider class
 */
class AwsChannel {
  /**
   * @param {object} args
   * @param {string} args.credentialsPath
   */
  constructor ({ credentialsPath }) {
    this.credentialsPath = credentialsPath
    this.profiles = []
    this.profile = null
    this.credentials = null
    this.credentialsExpiresAt = null
    this.timer = null
  }

  /**
   * Load profiles from credentials file
   *
   * @returns {string[]}
   */
  async loadProfilesHandler () {
    // Check if credentials file exist
    if (fs.existsSync(this.credentialsPath) === false) {
      throw 'Cannot find credentials file'
    }

    // Load credentials file content
    const content = fs.readFileSync(this.credentialsPath).toString('utf8')

    // Split by rows
    const rows = content.split(os.EOL)

    // Loop for each row
    const profiles = []
    let profileIteration = null
    for (const row of rows) {
      // Check if row is an header
      let headerMatch = row.match('^\\[(.*)\\]$')
      if (headerMatch !== null && headerMatch[1]) {
        // Check if profile creation is in progress
        if (profileIteration != null) {
          // Store profile and clean iteration variable
          profiles.push(profileIteration)
          profileIteration = null
        }

        // Create new profile and jump to new row
        profileIteration = {
          name: headerMatch[1].trim()
        }
        continue
      }

      // Check if row is a property
      let valueMatch = row.match('(.*)=(.*)')
      if (valueMatch !== null && valueMatch[1] && valueMatch[2]) {
        profileIteration[valueMatch[1].trim()] = valueMatch[2].trim()
        continue
      }

      // If row does not match header or value skip it
    }

    // Store all founded profiles
    this.profiles = profiles

    // Return only profiles names
    return profiles.map(profile => profile.name)
  }

  /**
   * Assume profile
   *
   * @param {import('electron/main').IpcMainEvent} event
   * @param {string} name
   * @param {string} sessionName
   * @param {string} sessionDuration default 1h
   * @returns {object} AWS credentials
   */
  async assumeProfilesHandler (event, name, sessionName = '', sessionDuration = 3600) {
    // Search for profile
    const matchProfile = this.getProfileByName(name)
    if (!matchProfile) {
      throw 'Profile not found'
    }

    // Set credentials if profile use keys
    if (matchProfile.aws_access_key_id && matchProfile.aws_secret_access_key) {
      this.setCredentials({
        accessKeyId: matchProfile.aws_access_key_id,
        secretAccessKey: matchProfile.aws_secret_access_key
      })
    }

    // Check if profile is set with role
    if (matchProfile.source_profile && matchProfile.role_arn) {
      const sourceProfile = this.getProfileByName(matchProfile.source_profile)
      if (!sourceProfile) {
        throw 'Source profile not found'
      }

      // Is session name is empty elaborate it
      if (!sessionName) {
        sessionName = 'electron'
      }
      const timestamp = new Date().getTime()
      sessionName = `${sessionName}-${timestamp}`

      // Bootstrap sts client with source profile credentials
      const sts = new STSClient({
        credentials: {
          accessKeyId: sourceProfile.aws_access_key_id,
          secretAccessKey: sourceProfile.aws_secret_access_key
        }
      })

      // Assume profile role and retrieve credentials
      const stsResponse = await sts.send(
        new AssumeRoleCommand({
          RoleArn: matchProfile.role_arn,
          RoleSessionName: sessionName,
          DurationSeconds: sessionDuration
        })
      )

      // Set credentials
      this.setCredentials(
        {
          accessKeyId: stsResponse.Credentials.AccessKeyId,
          secretAccessKey: stsResponse.Credentials.SecretAccessKey,
          sessionToken: stsResponse.Credentials.SessionToken
        },
        sessionDuration
      )
    }

    // Raise an error if no credentials are loaded
    if (this.areCredentialsValid() === false) {
      throw 'Invalid profile configurations'
    }

    // Set current profile
    this.setCurrentProfile(matchProfile.name)
  }

  /**
   * Set current profile
   *
   * @param {string} name
   */
  setCurrentProfile (name) {
    this.profile = name
  }

  /**
   * Get current profile
   *
   * @returns {string|null}
   */
  getCurrentProfile () {
    return this.profile
  }

  /**
   * Set credentials
   *
   * @param {object} credentials
   * @param {number|null} expires
   */
  setCredentials (credentials, expires = null) {
    this.credentials = credentials
    if (expires) {
      this.credentialsExpiresAt = getCurrentTimestamp() + expires
    } else {
      this.credentialsExpiresAt = null
    }
  }

  /**
   * Get current credentials handler
   *
   * @returns {object}
   */
  async getCredentialsHandler () {
    const currentProfile = this.getCurrentProfile()
    if (!currentProfile) {
      return null
    }

    if (currentProfile && this.areCredentialsValid() === false) {
      await this.assumeProfilesHandler(currentProfile)
    }

    return this.credentials
  }

  /**
   * Check if credentials are valid and not expired
   *
   * @returns {boolean}
   */
  areCredentialsValid () {
    if (!this.credentials) {
      return false
    }

    if (!this.credentialsExpiresAt) {
      return true
    }

    return getCurrentTimestamp() < parseInt(this.credentialsExpiresAt)
  }

  /**
   * Get project by name
   *
   * @param {string} name
   * @returns {object}
   */
  getProfileByName (name) {
    return this.profiles.find(profile => profile.name == name)
  }

  /**
   * Get identity handler
   *
   * @returns {object}
   */
  async getIdentityHandler () {
    const credentials = await this.getCredentialsHandler()
    if (!credentials) {
      return null
    }

    // bootstrap sts client with source profile credentials
    const sts = new STSClient({
      credentials
    })

    // assume profile role and retrieve credentials
    const stsResponse = await sts.send(new GetCallerIdentityCommand())

    // Return identity
    return {
      accountId: stsResponse.Account,
      userId: stsResponse.UserId,
      arn: stsResponse.Arn
    }
  }
}

export default {
  /**
   * @param {object} args
   * @param {import('electron').app} args.app
   * @param {import('electron').ipcMain} args.ipcMain
   */
  register: ({ app, ipcMain }) => {
    // Bootstrap provider
    const credentialsPath = path.join(
      app.getPath('home'),
      '.aws',
      'credentials'
    )
    const aws = new AwsChannel({
      credentialsPath: credentialsPath
    })
    console.debug('[aws] using credentials path', credentialsPath)

    // Register handlers
    ipcMain.handle('aws-profiles-load', aws.loadProfilesHandler.bind(aws))
    ipcMain.handle('aws-profile-assume', aws.assumeProfilesHandler.bind(aws))
    ipcMain.handle('aws-credentials', aws.getCredentialsHandler.bind(aws))
    ipcMain.handle('aws-identity', aws.getIdentityHandler.bind(aws))
  }
}
