<template>
  <div class="tooltip">
    <div class="tooltip-content">
      <slot name="content" />
    </div>
    <slot />
  </div>
</template>

<style scoped>
.tooltip {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tooltip-content {
  margin-right: 0.3em;
  font-size: 0.75em;
  opacity: 0;
  transition: opacity ease .5s;
}

.tooltip:hover .tooltip-content {
  opacity: .7;
}
</style>

