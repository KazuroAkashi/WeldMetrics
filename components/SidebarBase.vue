<template>
  <div class="sidebar-wrapper" :class="{ ...$props, open }">
    <div class="sidebar">
      <div class="header">
        <slot name="header" :toggle="toggle" :open="open"></slot>
      </div>
      <div class="body">
        <slot
          name="body"
          :select="select"
          :open="open"
          :isSelected="isSelected"
          :toggle="toggle"
        ></slot>
      </div>
      <div class="footer">
        <slot name="footer" :open="open"></slot>
      </div>
      <div class="submenu">
        <slot name="submenu" :isSelected="isSelected"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  open?: boolean;
  submenu?: boolean;
  push?: boolean;
}>();

const open = ref(props.open);
const selected = ref(0);

const isSelected = (index: number) => {
  return selected.value === index;
};

const select = (index: number, callback: (() => void) | undefined) => {
  selected.value = index;
  // open.value = false;
  callback?.();
};

const toggle = () => {
  open.value = !open.value;
};

watch(
  () => props.open,
  (to) => {
    open.value = to;
  },
);
</script>

<style scoped lang="scss">
.sidebar-wrapper {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;

  display: flex;
  justify-content: stretch;
  align-items: stretch;

  &.push {
    position: relative;
    height: 100vh;
  }

  z-index: 100;
}

.sidebar {
  flex: 1;

  background: var(--background-color);

  // padding: 10px;

  display: grid;
  grid-template-rows: auto 1fr auto;

  box-shadow: 0 0 15px 2px rgba(0, 0, 0, 0.7);

  .animated & {
    transition: 0.3s;
  }

  > .submenu {
    position: absolute;
    left: 100%;
    bottom: 0;
    top: 0;
  }

  .open > & {
    // padding-top: 25px;
    // padding-bottom: 25px;
    // padding: 20px;
  }

  .submenu > & {
    opacity: 0;
    transform: translateX(-40px);

    background: var(--background-color-2);
  }

  .submenu.open > & {
    opacity: 1;
    transform: translateX(0);
  }
}

:slotted(.header) {
  .animated & {
    transition: 0.3s;
  }

  padding: 10px;
  padding-top: 20px;

  .open > .sidebar > .header > & {
    padding-inline: 20px;
  }
}

.body {
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  min-width: min-content;

  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}

:slotted(.body) {
  .animated & {
    transition: 0.3s;
  }

  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;

  padding: 10px;

  .open > .sidebar > .body > & {
    padding-inline: 20px;
  }
}

:slotted(.footer) {
  .animated & {
    transition: 0.3s;
  }

  padding: 10px;

  .open > .sidebar > .footer > & {
    padding-inline: 20px;
  }
}

.sidebar > .submenu:deep(.sidebar-wrapper) {
  position: absolute;
  left: 100%;
  top: 0;
  bottom: 0;
  z-index: -1;

  &:not(.open) {
    pointer-events: none;
  }
}
</style>
