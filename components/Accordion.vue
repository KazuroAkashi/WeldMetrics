<template>
  <div
    class="accordion"
    :class="classes"
    ref="acc"
    :style="{ '--max-height': elMaxHeight + 'px' }"
  >
    <div
      class="scrollbar"
      :style="{ top: scrollTop + 'px', height: scrollbarHeight + 'px' }"
      ref="scrollbar"
    ></div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  open?: boolean;
  maxHeight?: number;
}>();

const forceOpen = ref(true);

const classes = computed(() => ({
  open: props.open || forceOpen.value,
  testing: forceOpen.value,
}));

const acc = ref() as Ref<HTMLElement>;
const elMaxHeight = ref(1);

const scrollbarHeight = ref(0);
const scrollTop = ref(0);

onMounted(() => {
  elMaxHeight.value = acc.value.scrollHeight;
  if (props.maxHeight && elMaxHeight.value > props.maxHeight)
    elMaxHeight.value = props.maxHeight;

  forceOpen.value = false;
});
</script>

<style scoped lang="scss">
.accordion {
  --padding: 5px 5px;
  --row-gap: 5px;
  box-sizing: content-box;

  position: relative;

  display: flex;
  align-items: flex-start;
  flex-direction: column;
  row-gap: var(--row-gap);

  overflow-x: hidden;
  overflow-y: scroll;

  .animated & {
    transition: 0.3s;
  }

  &:not(.testing) {
    max-height: 0;
    padding: var(--padding);
    padding-bottom: 0;
    padding-top: 0;
    &.open {
      max-height: var(--max-height);
      padding: var(--padding);
    }
  }
}

.accordion.open:deep(.btn) {
  transform: translateY(0);
  opacity: 1;
  pointer-events: initial;
  max-width: 1000px;
}

.accordion:deep(.btn) {
  transform: translateY(-20px);
  opacity: 0;
  pointer-events: none;
  max-width: 0;
}

.scrollbar {
  position: absolute;

  right: 1px;
  width: 2px;

  background: red;
}
</style>
