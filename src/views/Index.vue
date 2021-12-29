<template>
  <div class="details">
    <div class="details-row">
      <h1>Profile</h1>
      <ProfileSwitch />
    </div>
    <div class="details-row">
      <h2>Region</h2>
      <RegionSwitch />
    </div>
    
    <div class="row-separator"></div>

    <div class="details-row" v-if="identity.accountId">
      <h3>Account</h3>
      <strong>{{ identity.accountId }}</strong>
    </div>
    <div class="details-row" v-if="identity.arn && identity.isRole">
      <h3>Role</h3>
      <strong>{{ identity.role }}</strong>
    </div>
    <div class="details-row" v-else-if="identity.arn && identity.isUser">
      <h3>User</h3>
      <strong>{{ identity.username }}</strong>
    </div>
    <div class="details-row" v-else-if="identity.arn && identity.isRoot">
      <h3>User</h3>
      <strong class="alert">ROOT</strong>
    </div>
    <div class="details-row loading-placeholder" v-else></div>
  </div>

  <div class="buttons-containers" v-if="identity.accountId">
    <div class="row-separator"></div>

    <TerminalLauncher />
    <ConsoleLauncher />
    <ExitOnLaunchCheck />
  </div>
</template>

<script setup>
import ProfileSwitch from '../components/aws/ProfileSwitch.vue'
import RegionSwitch from '../components/aws/RegionSwitch.vue'
import TerminalLauncher from '../components/view/TerminalLauncher.vue'
import ConsoleLauncher from '../components/view/ConsoleLauncher.vue'
import ExitOnLaunchCheck from '../components/view/ExitOnLaunchCheck.vue'

import { ref } from 'vue'
import { useAWS } from '../composables/aws'
const { onAuthChanged, getCredentials, identity } = useAWS()

const credentials = ref({})
onAuthChanged(async () => {
  credentials.value = await getCredentials()
})
</script>

<style scoped>
pre {
  overflow: auto;
  width: 100%;
  background-color: var(--font-color);
  color: var(--background-color);
}

strong {
  user-select: all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

strong.alert {
  color: var(--error-color);
}

.details-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

.row-separator {
  height: 5px;
  border-bottom: 1px solid var(--border-color);
  margin: 1em 0;
  opacity: 0.2;
}

.buttons-containers {
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;
}

.loading-placeholder {
  justify-content: center;
  min-height: 5em;
}

.error-container {
  text-align: center;
  font-size: 1.5em;
}
</style>
