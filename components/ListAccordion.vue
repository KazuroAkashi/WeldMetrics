<template>
  <div
    class="accordion"
    :class="$props"
    ref="acc"
    :style="
      $props.open
        ? {
            'max-height': maxheight + 'px',
          }
        : {}
    "
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  data: () => ({
    elcount: 1,
    maxheight: 1,
  }),

  props: {
    open: Boolean,
    contract: Boolean,
    count: Number,
  },

  mounted() {
    this.elcount = this.$props.count || this.$slots.default().length;

    const style = getComputedStyle(this.$refs.acc);
    const rowgap = style.getPropertyValue('--row-gap').replace('px', '');
    const elheight = style.getPropertyValue('--el-height').replace('px', '');
    this.maxheight = elheight * this.count + rowgap * (this.count + 1);
  },
};
</script>

<style scoped lang="scss">
.accordion {
  max-height: 0;

  --el-height: 35px;
  --row-gap: 5px;
  padding-left: 50px;

  .animated & {
    transition: 0.3s;
  }

  display: flex;
  align-items: flex-start;
  flex-direction: column;
  row-gap: var(--row-gap);

  &.contract {
    padding-left: 0;
  }

  &.open {
    padding-top: var(--row-gap);
    padding-bottom: var(--row-gap);
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
</style>
