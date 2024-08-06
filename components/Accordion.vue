<template>
  <div
    class="accordion-outer"
    :class="classes"
    :style="{ '--max-height': elMaxHeight + 'px' }"
  >
    <Transition name="fade" appear>
      <div class="downarrow" v-if="notScrolled && $props.open">
        <Icon icon="arrow_downward" class="downarrow-icon" />
      </div>
    </Transition>
    <div class="accordion" :class="classes" ref="acc">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  open?: boolean;
  maxHeight?: number;
}>();

const notScrolled = ref(true);

const forceOpen = ref(true);

const classes = computed(() => ({
  open: props.open || forceOpen.value,
  testing: forceOpen.value,
}));

const acc = ref() as Ref<HTMLElement>;
const elMaxHeight = ref(1);

onMounted(() => {
  elMaxHeight.value = acc.value.scrollHeight;
  if (props.maxHeight && elMaxHeight.value > props.maxHeight)
    elMaxHeight.value = props.maxHeight;

  forceOpen.value = false;

  acc.value.addEventListener("scroll", () => {
    notScrolled.value = acc.value.scrollTop === 0;
  });
});
</script>

<style scoped lang="scss">
.accordion-outer {
  justify-content: stretch;
  align-items: stretch;
  overflow: hidden;
  &.open {
    max-height: var(--max-height);
  }
}

.accordion {
  --padding: 5px 5px;
  --row-gap: 5px;

  display: flex;
  align-items: stretch;
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

.downarrow {
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  pointer-events: none;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;

  padding: 10px;

  opacity: 0.7;

  .downarrow-icon {
    position: relative;

    animation: updown 0.8s ease infinite;

    --icon-size: 20px;
    --icon-color: var(--primary-color);
    --icon-shadow: 0 0 2px var(--primary-color);
  }
}

@keyframes updown {
  0% {
    transform: translateY(-3px);
  }
  50% {
    transform: translateY(3px);
  }
  100% {
    transform: translateY(-3px);
  }
}
</style>
