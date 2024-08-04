<template>
  <div class="layout">
    <Notifications />
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.layout {
  overflow: hidden;
  height: 100vh;
}
</style>
