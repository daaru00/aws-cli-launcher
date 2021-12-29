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
  display: none;
  margin-right: 0.1em;
  font-size: 0.75em;
  opacity: .7;
}

.tooltip:hover .tooltip-content {
  display: block;
}
</style>

