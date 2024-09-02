<template>
  <div
    class="optionmenu-wrapper"
    :class="{ ...$props, open: listopen }"
    :style="{
      width: width + 'px',
    }"
    v-click-outside="clickOutside"
  >
    <TextField
      :placeholder="$props.placeholder"
      v-model="optionText"
      class="optionmenu-typer"
      underlined
      @focusin="focusin"
    />
    <Accordion
      class="optionmenu-list"
      :open="listopen"
      :max-height="maxHeight"
      :key="acckey"
    >
      <Button
        v-for="(opt, i) in filteredOptions"
        type="none"
        leftalign
        class="optionmenu-option"
        @click="click(i)"
      >
        {{ opt }}
      </Button>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  placeholder: string;
  round?: boolean;

  starter?: string;

  maxHeight?: number;
  maxItems?: number;

  options: string[];

  searchFunc?: (input: string) => Promise<string[]>;
}>();

const acckey = ref(0);

const listopen = ref(false);
const optionText = defineModel<string>({
  default: "",
});

const filteredOptions = ref([] as string[]);

watch(optionText, async () => {
  await focusin();
});

const textEl = ref() as Ref<HTMLElement>;

const width = ref(1);

const focusDontOpenList = ref(false);

onMounted(() => {
  const list = [props.placeholder, ...props.options];
  let maxwidth = 0;
  for (const text of list) {
    const w = useCanvas().getTextWidth(text, textEl.value);
    if (w > maxwidth) maxwidth = w;
  }
  width.value = maxwidth + 80;

  if (props.starter) {
    focusDontOpenList.value = true;
    optionText.value = props.starter;
  }
});

const updateOptions = async () => {
  if (props.searchFunc) {
    filteredOptions.value = await props.searchFunc(optionText.value.toString());
  } else {
    filteredOptions.value = props.options.filter((str) =>
      str?.toString().toLowerCase().includes(optionText.value.toLowerCase())
    );
  }
  acckey.value += 1;
};

const clickOutside = (ev: Event) => {
  listopen.value = false;
};

const click = (index: number) => {
  focusDontOpenList.value = true;
  optionText.value = filteredOptions.value[index];
  listopen.value = false;
};

const focusin = async () => {
  await updateOptions();
  if (filteredOptions.value.length !== 0 && !focusDontOpenList.value) {
    listopen.value = true;
  }
  if (focusDontOpenList.value) focusDontOpenList.value = false;
};
</script>

<style scoped lang="scss">
.optionmenu-wrapper {
  --bg-color: var(--light-color);
  --bg-hover: var(--light-color-2);
  --fg-color: #184496;
  --placeholder-color: #184496;
  --hover-color: #184496;

  --option-padding-lr: 12px;
  --option-padding-tb: 8px;

  position: relative;

  &:not(.increase) {
    margin: 0;
  }
}

.optionmenu-inner {
  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;

  user-select: none;

  background: var(--bg-color);

  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);

  padding: 8px 64px 8px 15px;
  border-radius: 7px;

  cursor: pointer;

  .animated & {
    transition: 0.3s box-shadow;
  }

  .round & {
    border-radius: 100vmin;
  }

  body:not(.touchscreen) &:hover,
  .optionmenu-wrapper.open & {
    box-shadow: 0 0 5px var(--hover-color);
  }
}

.optionmenu-content {
  flex: 1;

  font-size: 12px;
  p {
    color: var(--placeholder-color);
  }
  .optionmenu-wrapper.active & p {
    color: var(--fg-color);
    font-weight: bold;
  }
}

.optionmenu-icon {
  position: absolute;
  right: 5px;
  top: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background: var(--bg-color);

  .animated & > span {
    transition: 0.2s;
  }

  .icon {
    --icon-color: #184496;
  }

  body:not(.touchscreen) .optionmenu-wrapper:hover & .icon,
  .optionmenu-wrapper.open & .icon {
    --icon-color: var(--hover-color);
    text-shadow: 0 0 10px var(--hover-color);
  }

  .optionmenu-wrapper:active & span {
    text-shadow: 0 0 !important;
  }
}

.optionmenu-list {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;

  border-radius: 5px;

  background: var(--bg-color);

  z-index: 20;

  .animated & {
    transition: 0.3s;
  }

  &.open {
    box-shadow: 0 2px 6px 3px rgba(0, 0, 0, 0.6);
    z-index: 21;
  }
}

.optionmenu-option {
  --padding-vert: var(--option-padding-tb);
  --padding-hor: var(--option-padding-lr);

  color: #184496 !important;
}
</style>
