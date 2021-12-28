import { computed, reactive } from "vue"
import { useIPC } from "./ipc"
import { useEvents, EVENT_AWS_AUTH_CHANGED } from "./events"
import { useConfig } from "./config"
import { useWindow } from "./window"

const state = reactive({
  profiles: [],
  profile: null,
  regions: [
    'us-east-2',
    'us-east-1',
    'us-west-1',
    'us-west-2',
    'af-south-1',
    'ap-east-1',
    'ap-south-1',
    'ap-northeast-3',
    'ap-northeast-2',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-northeast-1',
    'ca-central-1',
    'eu-central-1',
    'eu-west-1',
    'eu-west-2',
    'eu-south-1',
    'eu-west-3',
    'eu-north-1',
    'me-south-1',
    'sa-east-1'
  ],
  region: 'us-east-1',
  identity: {}
})

export function useAWS() {
  const { ipc } = useIPC()
  const { emit, on } = useEvents()
  const { config, saveConfig } = useConfig()
  const { setLoading } = useWindow()

  const loadProfiles = async () => {
    state.profiles = await ipc.invoke('aws-profiles-load')
  }

  const assumeProfile = async (profile) => {
    state.identity = {}
    state.profile = null

    setLoading(true)

    try {
      await ipc.invoke('aws-profile-assume', profile)
      state.profile = profile
      await loadIdentity() 
    } catch (error) {
      console.error(error)
      return
    } finally {
      setLoading(false)
    }

    emit(EVENT_AWS_AUTH_CHANGED)

    config.profile = profile
    await saveConfig()
  }

  const switchRegion = async (region) => {
    state.region = region

    emit(EVENT_AWS_AUTH_CHANGED)

    config.region = region
    await saveConfig()
  }

  const getCredentials = async () => {
    return await ipc.invoke('aws-credentials')
  }

  const loadIdentity = async () => {
    const identity = await ipc.invoke('aws-identity')

    const isRole = identity.arn.includes(':assumed-role/')
    const isUser = identity.arn.includes(':user/')
    const isRoot = identity.arn.endsWith(':root')

    state.identity = Object.assign(identity, {
      isRole,
      isUser,
      isRoot
    })

    if (state.identity.isRole) {
      state.identity = Object.assign(identity, {
        role: identity.arn.split(':assumed-role/').pop().split('/').shift()
      })
    } else if (state.identity.isUser) {
      state.identity = Object.assign(identity, {
        username: identity.arn.split(':user/').pop()
      })
    }
  }

  const onAuthChanged = (callback) => {
    on(EVENT_AWS_AUTH_CHANGED, callback)
  }

  return {
    profile: computed(() => state.profile),
    profiles: computed(() => state.profiles),
    region: computed(() => state.region),
    regions: computed(() => state.regions),
    identity: computed(() => state.identity),
    loadProfiles,
    assumeProfile,
    switchRegion,
    getCredentials,
    loadIdentity,
    onAuthChanged
  }
}
