<template>
  <span
    v-if="$props.icon && useShowIcons().value"
    class="icon"
    :class="{ fill: icon.fill }"
    aria-hidden="true"
  >
    <span class="material-icon material-symbols-outlined" v-if="!icon.fa">
      {{ icon.icon }}
    </span>
    <ClientOnly v-else>
      <font-awesome-icon :icon="['fa-brands', icon.icon]" class="fa-icon"
    /></ClientOnly>
  </span>
  <!-- <svg
    style="width: 0; height: 0; position: absolute"
    aria-hidden="true"
    focusable="false"
  >
    <linearGradient id="mygrad" x2="1" y2="1">
      <stop offset="0%" stop-color="#447799" />
      <stop offset="50%" stop-color="#224488" />
      <stop offset="100%" stop-color="#112266" />
    </linearGradient>
  </svg> -->
</template>

<script setup lang="ts">
const props = defineProps<{
  icon?: string;
}>();

const icon = computed(() => {
  const spl = props.icon?.split(" ");
  return {
    icon: spl?.[0],
    fill: spl?.[1] === "fill",
    fa: spl?.[0].startsWith("fa-"),
  };
});
</script>

<style scoped lang="scss">
.fa-icon {
  width: var(--icon-size);
  height: var(--icon-size);
  line-height: 0;
}

.material-icon {
  font-size: var(--icon-size);
}

.icon {
  --icon-size: 24px;
  --icon-color: var(--foreground-color);
  --icon-shadow: none;
  text-shadow: none;
  filter: drop-shadow(var(--icon-shadow));
  line-height: 0;

  .animated & {
    transition: 0.3s filter;
  }

  .material-icon,
  .fa-icon :deep(*) {
    // color: transparent;
    // background-clip: text;
    // background-image: linear-gradient(45deg, red, yellow, purple);
    // fill: url(#mygrad);
    color: var(--icon-color);
    transform-origin: center;

    .animated & {
      transition: 0.3s;
    }
  }
}

.icon:not(.fill) .material-icon {
  font-variation-settings: "FILL" 0;
}

.icon.fill .material-icon {
  font-variation-settings: "FILL" 1;
}
</style>
