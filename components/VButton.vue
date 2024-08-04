<template>
  <a class="btn" :class="$props" @click="clicked">
    <span class="material-icons icon" v-if="$props.icon" aria-hidden="true">{{
      $props.icon
    }}</span>
    <span
      class="material-icons righticon"
      v-if="$props.righticon"
      aria-hidden="true"
      >{{ $props.righticon }}</span
    >
    <span
      class="content"
      ref="content"
      :style="$props.listitem ? { 'max-width': width + 'px' } : {}"
    >
      <slot></slot>
    </span>
  </a>
</template>

<script setup lang="ts">
import { type useCanvasReturn } from '@/composables/useCanvas';
import { type useRefReturn } from '@/composables/useRef';

const { $navigateTo, $navlock } = useNuxtApp();

const emit = defineEmits(['click']);

const props = defineProps({
  full: Boolean,
  hoverfill: Boolean,
  borderfill: Boolean,
  link: Boolean,
  round: Boolean,
  disabled: Boolean,
  href: String,
  icon: String,
  onlyicon: Boolean,
  bg: Boolean,
  selected: Boolean,
  clickable: Boolean,
  listitem: Boolean,
  righticon: String,
  textleft: Boolean,
});

const clicked = () => {
  if (props.disabled || (props.href && $navlock.value)) return;

  emit('click');
  if (props.href) $navigateTo(props.href);
};

const content = ref(null);

let canvas: useCanvasReturn;
let width: useRefReturn;

if (props.listitem) {
  canvas = useCanvas();
  width = useRef(
    content,
    10000,
    (el) => canvas.getTextWidth(el.innerText, el),
    (thing) => {
      if (!props.onlyicon) {
        return thing.value;
      } else {
        return 0;
      }
    },
  );
}
</script>

<style scoped lang="scss">
.content {
  .animated & {
    transition: 0.3s;
  }
  color: inherit;
  overflow: hidden;
  white-space: nowrap;

  .link & {
    padding: 5px;
  }
}

.btn {
  position: relative;

  cursor: pointer;

  --border-radius: 5px;
  --padding-vert: 10px;
  --padding-hor: 50px;
  --icon-size: 24px;

  --bg: url('https://www.creativefabrica.com/wp-content/uploads/2020/05/14/3D-Cube-Pattern-Background-Graphics-4115767-1.jpg');

  --selected-link-fg: var(--primary-color);

  --bgcolor-hover: var(--primary-accent);
  --fgcolor-hover: var(--primary-accent-contrast);

  --bgcolor: var(--primary-color);
  --fgcolor: var(--primary-color-contrast);

  --bordercolor: var(--primary-color);

  --disabledcolor: var(--background-color-4);
  --bgcolor-disabled: var(--foreground-color-6);

  --bgcolor-full: rgba(var(--primary-accent), 0.2);
  --fgcolor-full: var(--primary-accent);
  --bgcolor-full-hover: var(--bgcolor-hover);
  --fgcolor-full-hover: var(--fgcolor-hover);

  .animated & {
    transition: 0.3s, 0.15s opacity;
  }

  display: flex;
  justify-content: center;
  align-items: center;

  column-gap: 12px;

  user-select: none;

  // max-width: 100%;

  & > .material-icons {
    .animated & {
      transition: 0.3s;
    }
    font-size: var(--icon-size);
  }

  &.icon:not(.onlyicon):not(.listitem),
  &.textleft {
    padding-left: calc(var(--padding-hor) - 8px) !important;
  }

  &.icon.listitem,
  &.textleft {
    justify-content: flex-start;
    padding-left: var(--padding-vert);

    column-gap: 0;

    &:not(.onlyicon) {
      padding-right: calc(2 * var(--padding-hor));
      column-gap: 18px;
    }
  }

  &.onlyicon {
    padding: var(--padding-vert) !important;
    column-gap: 0;
  }

  &:active,
  &.listitem {
    box-shadow: none !important;
    text-shadow: none !important;
  }

  &.disabled {
    pointer-events: none;
  }

  &.selected {
    &:not(.clickable) {
      pointer-events: none;
    }

    &:not(.link) {
      background-color: var(--bgcolor-hover);
      color: var(--fgcolor-hover);
    }

    &.link {
      color: var(--selected-link-fg);
    }

    & > .material-icons {
      color: var(--selected-fg);
    }
  }

  &.borderfill {
    border: 1px solid var(--bordercolor);
    padding: var(--padding-vert) var(--padding-hor);
    border-radius: var(--border-radius);

    &:hover:not(.disabled, .selected) {
      background-color: var(--bgcolor-hover);
      color: var(--fgcolor-hover);
      border-color: var(--bgcolor-hover);
      box-shadow: 0 0 15px var(--bgcolor-hover);

      & > .material-icons {
        color: var(--fgcolor-hover);
      }
    }

    &.disabled {
      border-color: var(--disabledcolor);
      color: var(--disabledcolor);

      & > .material-icons {
        color: var(--disabledcolor);
      }
    }
  }
  &.hoverfill {
    padding: var(--padding-vert) var(--padding-hor);
    border-radius: var(--border-radius);

    &:hover:not(.disabled, .selected, .fullcolored) {
      background-color: var(--bgcolor-hover);
      color: var(--fgcolor-hover);
      box-shadow: 0 0 15px var(--bgcolor-hover);

      & > .material-icons {
        color: var(--fgcolor-hover);
      }
    }

    &.disabled {
      border-color: var(--disabledcolor);
      color: var(--disabledcolor);

      & > .material-icons {
        color: var(--disabledcolor);
      }
    }
  }

  &.full {
    background-color: var(--bgcolor);
    color: var(--fgcolor);
    padding: var(--padding-vert) var(--padding-hor);
    border-radius: var(--border-radius);

    &:hover:not(.disabled, .selected) {
      background-color: var(--bgcolor-hover);
      color: var(--fgcolor-hover);
      box-shadow: 0 0 15px var(--bgcolor-hover);

      & > .material-icons {
        color: var(--fgcolor-hover);
      }
    }
    &.disabled {
      background-color: var(--bgcolor-disabled);
      color: var(--disabledcolor);

      & > .material-icons {
        color: var(--disabledcolor);
      }
    }
    & > .material-icons {
      color: var(--fgcolor);
    }
  }

  &.link {
    font-weight: 600;

    // animation: breathe-end 1s forwards linear;

    color: var(--foreground-color);

    &:hover:not(.disabled, .selected) {
      color: var(--selected-link-fg);
      // animation: breathe 1s alternate infinite linear;
      text-shadow: 0 0 10px var(--selected-link-fg);
    }
    &.disabled {
      color: var(--disabledcolor);
    }
  }

  &.round {
    border-radius: 100vmin !important;
  }

  &.bg {
    // fully tranparent png image
    background-image: url('../assets/transparent.png');
    background-size: cover;
    &:hover {
      background-color: rgba(0, 0, 0, 0);
      background-image: var(--bg);
    }
  }

  .righticon {
    position: absolute;
    right: var(--padding-vert);
  }

  &.listitem.onlyicon .righticon {
    opacity: 0;
  }
}
</style>
