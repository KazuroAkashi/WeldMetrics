<template>
  <div
    class="cards"
    :style="{ 'grid-template-columns': 'repeat(' + count + ', 1fr)' }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  data: () => ({
    count: 1,
  }),

  mounted() {
    this.count = this.$slots.default().length;
  },
};
</script>

<style scoped lang="scss">
.cards {
  margin-top: 30px;

  display: grid;
  justify-content: stretch;
  align-items: stretch;

  column-gap: 20px;
}

@media (max-width: 1240px) {
  .cards {
    grid-template-columns: 1fr !important;
    row-gap: 20px;
  }
}
</style>
