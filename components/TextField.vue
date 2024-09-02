<template>
  <div class="textfield-wrapper" :class="props" :title="$props.placeholder">
    <input
      :id="id"
      type="text"
      class="textfield-input"
      :placeholder="
        $props.icon || !$props.underlined ? $props.placeholder : ' '
      "
      v-model="model"
      @focusin="$emit('focusin')"
      @focusout="$emit('focusout')"
    />
    <label :for="id" class="textfield-icon">
      <!-- <i :class="$props.icon"></i> -->
      <Icon :icon="$props.icon" />
    </label>
    <div class="underline" v-if="$props.underlined"></div>
    <div class="dynplaceholder" v-if="!$props.icon && $props.underlined">
      {{ $props.placeholder }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { v4 } from "uuid";

const id = v4();

const props = defineProps({
  placeholder: String,
  icon: String,
  round: Boolean,
  underlined: Boolean,
});

const emit = defineEmits(["input", "focusin", "focusout"]);

const model = defineModel<string>();
</script>

<style scoped lang="scss">
.textfield-wrapper {
  --bg-color: var(--light-color-5);
  --fg-color: var(--foreground-color-1);
  --placeholder-color: var(--foreground-color-3);
  --hover-color: var(--light-color);

  position: relative;
  display: flex;

  &.underlined::before {
    content: "";

    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;

    background: var(--bg-color);
  }
}

.textfield-input {
  user-select: text;

  position: relative;

  flex: 1;

  font-size: 14px;

  padding: 10px 10px 10px 50px;
  border-radius: 3px;

  outline: none;
  border: none;

  background: var(--bg-color);
  color: var(--fg-color);

  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);

  .animated & {
    transition: 0.3s;
  }

  .round > & {
    border-radius: 100vmin;
  }

  .underlined & {
    background: transparent;
    box-shadow: none;
  }

  .textfield-wrapper:not(.icon) > & {
    padding-left: 5px;
  }

  &::placeholder {
    color: var(--fg-color);
    opacity: 0.7;
  }
}

.textfield-icon {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 40px;

  padding-left: 10px;

  display: flex;
  justify-content: center;
  align-items: center;

  .animated & > span {
    transition: 0.3s;
  }

  .icon {
    --icon-color: var(--fg-color);
  }

  .textfield-input:focus ~ & .icon,
  .textfield-input:not(:placeholder-shown) ~ & .icon {
    --icon-color: var(--hover-color);
    text-shadow: 0 0 10px var(--hover-color);
  }

  .underlined > & {
    padding-left: 0;
  }
}

.underline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;

  background: var(--hover-color);

  transform: scaleX(0);

  .animated & {
    transition: 0.2s;
  }

  .textfield-input:focus ~ &,
  .textfield-input:not(:placeholder-shown) ~ & {
    transform: scaleX(1);
  }
}

.dynplaceholder {
  pointer-events: none;

  position: absolute;
  left: 5px;
  bottom: 0;

  transform: translateY(-50%);
  transform-origin: -10px -100%;

  color: var(--placeholder-color);

  .animated & {
    transition: 0.15s;
  }

  .textfield-input:focus ~ &,
  .textfield-input:not(:placeholder-shown) ~ & {
    transform: translateY(-50%) scale(0.5);
    color: var(--hover-color);
  }
}
</style>
