<template>
  <button class="primary with-icon" @click="onOpenConsoleClick" :disabled="disabled">
    <span class="button-label">Open web console</span> 
    <OpenInNewIcon />
  </button>
</template>

<script setup>
import OpenInNewIcon from '../icons/open-in-new.vue'

import { useAWS } from '../../composables/aws'
const { profile, region, identity } = useAWS()

import { useWindow } from '../../composables/window'
import { useConfig } from '../../composables/config'
const { openExternalLink, close } = useWindow()
const { config } = useConfig()

import { computed } from 'vue'
const disabled = computed(() => !identity.value.accountId)

const onOpenConsoleClick = async () => {

  if (identity.value.isRole) {
    await openExternalLink([
      `https://signin.aws.amazon.com/switchrole`,
      `?account=${identity.value.accountId}`,
      `&roleName=${identity.value.role}`,
      `&displayName=${profile.value}`,
      `&region=${region.value}`
    ].join(''))
  } else {
    await openExternalLink([
      `https://${region.value}.console.aws.amazon.com/console/home`,
      `?region=${region.value}#`
    ].join(''))
  }

  if (config.exitOnLaunch) {
    close()
  }
}
</script>
