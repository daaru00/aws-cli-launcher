<template>
  <h1>Profile: <ProfileSwitch /> </h1>
  <h2>Region: <RegionSwitch /> </h2>

  <div class="details">
    <h2 v-if="identity.accountId">Account: <strong>{{ identity.accountId }}</strong></h2>
    <h3 v-if="identity.arn && identity.isRole">Role: <strong>{{ identity.arn.split(':assumed-role/').pop().split('/').shift() }}</strong></h3>
    <h3 v-if="identity.arn && identity.isUser">User: <strong>{{ identity.arn.split(':user/').pop() }}</strong></h3>
    <h3 v-if="identity.arn && identity.isRoot">User: <strong class="alert">ROOT</strong></h3>
  </div>

  <TerminalLauncher />
  <ExitOnLaunchCheck />
</template>

<script setup>
import ProfileSwitch from '../components/aws/ProfileSwitch.vue'
import RegionSwitch from '../components/aws/RegionSwitch.vue'
import TerminalLauncher from '../components/view/TerminalLauncher.vue'
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

h1,h2,h3 {
  user-select: none;
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

select {
  font-size: 0.75em;
}

.details {
  min-height: 10em;
}
</style>
