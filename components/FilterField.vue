<template>
  <div class="options">
    <OptionMenu
      class="optionmenu"
      :options="cols"
      placeholder="Sütun"
      v-model="colindex"
      :max-height="300"
    />
    <OptionMenu
      class="optionmenu"
      :options="ops"
      placeholder="İşlem"
      v-model="opindex"
      :max-height="300"
    />
    <div class="param1">
      <OptionMenu
        class="optionmenu"
        :options="suggestions"
        placeholder="1. Parametre"
        v-model="sugindex"
        v-if="suggestions.length > 0 && parameterCount >= 1"
        :max-height="300"
        :key="sugkey"
      />
      <TextField
        placeholder="1. Parametre"
        underlined
        v-model="comp1"
        v-if="suggestions.length === 0 && parameterCount >= 1"
      />
      <Button
        type="empty"
        corners="circle"
        onlyicon
        icon="add"
        v-if="isListParameter()"
        @click="addToList"
      ></Button>
      <div class="complist-items">
        <div
          v-for="(item, index) in complist"
          :key="item"
          class="complist-item"
        >
          <p>
            {{ item }}
          </p>
          <Button
            type="empty"
            corners="circle"
            onlyicon
            icon="close"
            class="delete-btn"
            @click="removeFromList(index)"
          ></Button>
        </div>
      </div>
    </div>
    <TextField
      placeholder="2. Parameter"
      underlined
      v-model="comp2"
      v-if="parameterCount >= 2"
    />
  </div>
</template>

<script setup lang="ts">
import {
  FILTER_OPERATIONS,
  FILTER_OPERATIONS_PARAMETER_COUNTS,
  FILTER_OPERATIONS_SUGGEST,
  FILTER_OPERATIONS_LIST,
} from "~/globals";

const colindex = defineModel<number>("colindex");
const opindex = defineModel<number>("opindex");
const comp1 = defineModel<string>("comp1");
const comp2 = defineModel<string>("comp2");
const complist = defineModel<string[]>("complist");

const table = useDbStore().selectedTable;

const cols = table.cols.map((val) => val.name);
const ops = ref(FILTER_OPERATIONS);

const parameterCount = ref(0);
const suggestions = ref([] as string[]);
const sugindex = ref() as Ref<number | undefined>;
const sugkey = ref(0);

let firstPass = true;

onMounted(async () => {
  await nextTick();
  await update();

  if (comp1.value && suggestions.value.length > 0) {
    sugindex.value = suggestions.value.findIndex((sug) => sug === comp1.value);
  }
});

watch([colindex, opindex], async () => {
  if (firstPass) {
    firstPass = false;
    return;
  }

  await update();
  comp1.value = "";
  comp2.value = "";
  complist.value = [];
  sugindex.value = undefined;
});

watch(sugindex, () => {
  if (sugindex.value !== undefined && suggestions.value.length > sugindex.value)
    comp1.value = suggestions.value[sugindex.value];
});

const update = async () => {
  if (colindex.value === undefined || opindex.value === undefined) {
    suggestions.value = [];
    return;
  }

  parameterCount.value =
    opindex.value !== undefined
      ? FILTER_OPERATIONS_PARAMETER_COUNTS[opindex.value!]
      : 0;

  const colname = cols[colindex.value];
  const col = table.cols.find((col) => col.name === colname);
  if (FILTER_OPERATIONS_SUGGEST[opindex.value!] && col?.type === "VARCHAR") {
    suggestions.value = col.distinct_values!;
    sugkey.value += 1;
  } else {
    suggestions.value = [];
  }
};

const isListParameter = () => {
  return (
    opindex.value !== undefined &&
    parameterCount.value >= 1 &&
    FILTER_OPERATIONS_LIST[opindex.value]
  );
};

const addToList = () => {
  if (complist.value === undefined && comp1.value) {
    complist.value = [comp1.value];
  }
  if (
    complist.value !== undefined &&
    comp1.value &&
    !complist.value.includes(comp1.value)
  )
    complist.value.push(comp1.value);

  sugkey.value += 1;
};

const removeFromList = (index: number) => {
  complist.value?.splice(index, 1);
  sugkey.value += 1;
};
</script>

<style scoped lang="scss">
.options {
  display: grid;
  justify-content: space-around;
  align-items: start;
  grid-template-columns: repeat(4, max-content);

  margin-left: 50px;
  margin-right: 50px;
  margin-top: 30px;
  column-gap: 20px;
}

.param1 {
  display: flex;
  align-items: flex-start;

  column-gap: 15px;
}

.complist-item {
  display: flex;
  justify-content: center;
  align-items: center;

  column-gap: 5px;
}

.delete-btn {
  --accent-color: var(--error-color);
  --accent-hover: var(--error-color);
  &:deep(.icon) {
    --icon-color: var(--error-color);
  }
}
</style>
