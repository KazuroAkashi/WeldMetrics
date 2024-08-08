<template>
  <div
    class="btn-wrapper"
    :class="btnclasses"
    @mouseover="hovered = true"
    @mouseout="hovered = false"
    @click="clicked"
    @auxclick="middleclicked"
  >
    <a
      class="btn"
      :class="btnclasses"
      @touchstart.passive="touching = true"
      @touchend.passive="touchend"
      @contextmenu="touchend"
      :href="href"
      :title="content ? content.innerText : ''"
      @click.prevent
    >
      <Icon class="icon" :icon="$props.icon" />
      <Transition name="fade" :css="useAnimatedStore().animated">
        <span
          class="content"
          ref="content"
          :style="{ '--max-width': width + 'px' }"
          v-show="!$props.onlyicon"
        >
          <slot></slot>
        </span>
      </Transition>
      <Icon class="icon righticon" :icon="$props.righticon" />
      <ClientOnly>
        <slot name="submenu" :hovered="hovered"></slot>
      </ClientOnly>
    </a>
  </div>
</template>

<script setup lang="ts">
const { $navigateTo, $navlock } = useNuxtApp();

const emit = defineEmits(["click", "selected"]);

const props = withDefaults(
  defineProps<{
    type: "filled" | "bordered" | "empty" | "link" | "none" | "listitem";
    corners?: "hard" | "round" | "circle";
    icon?: string;
    righticon?: string;
    href?: string;

    disabled?: boolean;
    selected?: boolean;
    clickableWhenSelected?: boolean;

    onlyicon?: boolean;
    leftalign?: boolean;
    hoverUnderline?: boolean;
    hoverExpand?: boolean;
    hrefSelected?: boolean | string[];
  }>(),
  {
    corners: "round",
  }
);

const selected = computed(
  () =>
    props.selected ||
    (props.hrefSelected === true &&
      props.href &&
      useRoute().path === props.href) ||
    (Array.isArray(props.hrefSelected) &&
      props.hrefSelected.includes(useRoute().path))
);

watch(selected, () => {
  emit("selected", selected.value);
});

const hovered = ref(false);
const touching = ref(false);

const btnclasses = computed(() => ({
  "type-filled": props.type === "filled",
  "type-bordered": props.type === "bordered",
  "type-empty": props.type === "empty",
  "type-link": props.type === "link",
  "type-none": props.type === "none",
  "type-listitem": props.type === "listitem",

  "corners-hard": props.corners === "hard",
  "corners-round": props.corners === "round",
  "corners-circle": props.corners === "circle",

  disabled: props.disabled,
  selected: selected.value,
  "clickable-when-selected": props.clickableWhenSelected,

  icon: !!props.icon,
  righticon: !!props.righticon,
  onlyicon: props.onlyicon,
  leftalign: props.leftalign,
  "hover-underline": props.hoverUnderline,

  touching: touching.value,
}));

const clicked = () => {
  if (
    props.disabled ||
    (selected.value && !props.clickableWhenSelected) ||
    (props.href && $navlock.value)
  )
    return;

  emit("click");
  if (props.href) $navigateTo(props.href);
};

const middleclicked = () => {
  if (props.disabled || (selected.value && !props.clickableWhenSelected))
    return;

  // open in new tab
  if (props.href && window) window.open(props.href, "_blank");
};

const touchend = () => {
  setTimeout(() => {
    touching.value = false;
  }, 100);
};

const content = ref() as Ref<HTMLElement>;

let width: Ref<number>;

onMounted(async () => {
  width = computed(() =>
    useCanvas().getTextWidth(content.value.innerText, content.value)
  );
});
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  max-width: 0 !important;
  overflow: hidden;
}

/* .animated is a global selector and everything else I tried
    had some annoying bugs. Maybe try to fix again in the future. */
.btn {
  .animated & {
    transition: 0.3s, 0.15s opacity;
  }
}

.content {
  color: inherit;
  overflow: hidden;
  white-space: nowrap;

  max-width: var(--max-width);
  box-sizing: content-box;

  .btn.type-link & {
    padding: 5px;
  }

  .animated &:after {
    transition: 0.2s;
  }
}

.btn-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  --border-radius: 8px;
  --padding-vert: 10px;
  --padding-hor: 50px;
  --icon-size: 24px;

  --accent-hover: var(--light-color);
  --accent-hover-contrast: var(--dark-color);

  --accent-color: var(--light-color-2);
  --accent-contrast: var(--dark-color-2);

  --disabled-fg: var(--background-color-4);
  --disabled-bg: var(--foreground-color-6);

  --bg-hover: var(--light-color-2);
}

.btn {
  position: relative;

  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  column-gap: 8px;

  user-select: none;

  padding: var(--padding-vert) var(--padding-hor);

  .icon {
    left: 20px;
  }
}

.btn.type-filled {
  background-color: var(--accent-color);
  color: var(--accent-contrast);
  .icon {
    --icon-color: var(--accent-contrast);
  }
  &:not(.onlyicon) {
    flex: 1;
  }

  .touchscreen &.touching,
  body:not(.touchscreen) &:hover {
    background-color: var(--accent-hover);
    color: var(--accent-hover-contrast);
    box-shadow: 0 0 15px var(--accent-hover);

    .icon {
      --icon-color: var(--accent-hover-contrast);
    }
  }

  &.disabled {
    background-color: var(--disabled-bg);
    color: var(--disabled-fg);

    .icon {
      --icon-color: var(--disabled-fg);
    }
  }

  &.selected {
    background-color: var(--accent-hover);
    color: var(--accent-hover-contrast);

    .icon {
      --icon-color: var(--accent-contrast);
    }
  }
}

.btn.type-bordered {
  border: 1px solid var(--accent-color);

  &:not(.onlyicon) {
    flex: 1;
  }

  .touchscreen &.touching,
  body:not(.touchscreen) &:hover {
    background-color: var(--accent-hover);
    color: var(--accent-hover-contrast);
    border-color: var(--accent-hover);
    box-shadow: 0 0 15px var(--accent-hover);

    .icon {
      --icon-color: var(--accent-hover-contrast);
    }
  }

  &.disabled {
    border-color: var(--disabled-fg);
    color: var(--disabled-fg);

    .icon {
      --icon-color: var(--disabled-fg);
    }
  }

  &.selected {
    background-color: var(--accent-hover);
    color: var(--accent-hover-contrast);

    .icon {
      --icon-color: var(--accent-contrast);
    }
  }
}

.btn.type-empty {
  &:not(.onlyicon) {
    flex: 1;
  }

  .touchscreen &.touching,
  body:not(.touchscreen) &:hover {
    background-color: var(--accent-hover);
    color: var(--accent-hover-contrast);
    box-shadow: 0 0 15px var(--accent-hover);

    .icon {
      --icon-color: var(--accent-hover-contrast);
    }
  }

  &.disabled {
    border-color: var(--disabled-fg);
    color: var(--disabled-fg);

    .icon {
      --icon-color: var(--disabled-fg);
    }
  }

  &.selected {
    background-color: var(--accent-hover);
    color: var(--accent-hover-contrast);

    .icon {
      --icon-color: var(--accent-contrast);
    }
  }
}

.btn.type-link {
  padding: initial;
  font-weight: 700;
  column-gap: 3px;

  // color: transparent;
  // background-clip: text;
  // background-image: linear-gradient(45deg, red, yellow, purple);

  // animation: breathe-end 1s forwards linear;

  // color: var(--foreground-color);

  /* HACK: Couldn't come up with a better way for now.
             This is for nav buttons with submenus */
  &:deep(.accordion) {
    text-shadow: none;
  }

  .touchscreen &.touching,
  body:not(.touchscreen) &:hover {
    color: var(--accent-hover);
    // animation: breathe 1s alternate infinite linear;
    text-shadow: 0 0 10px var(--accent-hover);

    .icon {
      --icon-color: var(--accent-hover);
      --icon-shadow: 0 0 8px var(--accent-hover);
    }
  }

  &.disabled {
    color: var(--disabled-fg);
  }

  &.selected {
    color: var(--accent-hover);

    .icon {
      --icon-color: var(--accent-hover);
    }
  }
}

.btn.type-none {
  flex: 1;
  justify-content: flex-start;
  color: var(--accent-color-contrast);
  .touchscreen &.touching,
  body:not(.touchscreen) &:hover {
    background: var(--bg-hover);
  }
}

.btn.type-listitem {
  flex: 1;
  justify-content: flex-start;
  column-gap: 18px;

  padding-left: var(--padding-vert);
  padding-right: calc(5 * var(--padding-vert));

  .touchscreen &.touching,
  body:not(.touchscreen) &:hover {
    background-color: var(--accent-hover);
    color: var(--accent-hover-contrast);

    .icon {
      --icon-color: var(--accent-hover-contrast);
    }
  }

  &.disabled {
    border-color: var(--disabled-fg);
    color: var(--disabled-fg);

    .icon {
      color: var(--disabled-fg);
    }
  }

  &.selected {
    background-color: var(--accent-hover);
    color: var(--accent-hover-contrast);

    .icon {
      --icon-color: var(--accent-contrast);
    }
  }
}

.btn.corners-hard {
  border-radius: 0;
}

.btn.corners-round {
  border-radius: var(--border-radius);
}

.btn.corners-circle {
  /* There's probably a better way of doing this but... */
  border-radius: 200px;
}

.btn.leftalign:not(.type-link):not(.type-none):not(.onlyicon) {
  justify-content: stretch;

  padding-left: calc(var(--padding-hor) - 8px);
  padding-right: calc(2 * var(--padding-hor));

  column-gap: 18px;
}

.btn-wrapper.leftalign {
  justify-content: flex-start;
}

.btn.icon:not(.type-link):not(.type-listitem):not(.onlyicon) {
  padding-left: calc(var(--padding-hor) - 8px);
}

.btn.onlyicon {
  column-gap: 0;
  padding: var(--padding-vert);

  &.righticon .righticon {
    opacity: 0;
  }
}

.btn:active {
  box-shadow: none !important;
  text-shadow: none !important;
  .icon {
    --icon-shadow: none !important;
  }
}

.btn.disabled,
.btn.selected:not(.clickable-when-selected) {
  pointer-events: none !important;
}

.btn.righticon:not(.type-link) .righticon {
  position: absolute;
  right: var(--padding-vert);
}

.btn.hover-underline .content:after {
  content: "";
  position: absolute;
  right: 2px;
  left: 2px;
  bottom: 2px;
  height: 1px;

  background: var(--foreground-color);

  transform-origin: center;
  transform: scaleX(0);
}

.btn.hover-underline {
  &.selected .content:after,
  body:not(.touchscreen) &:hover .content:after,
  .touchscreen &.touching .content:after {
    transform: scaleX(1);
  }
}
</style>
