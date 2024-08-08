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
} from "~/globals";

const { $NativeService } = useNuxtApp();

const colindex = defineModel<number>("colindex");
const opindex = defineModel<number>("opindex");
const comp1 = defineModel<string>("comp1");
const comp2 = defineModel<string>("comp2");

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
</script>

<style scoped lang="scss">
.options {
  display: grid;
  justify-content: space-around;
  align-items: center;
  grid-template-columns: repeat(4, max-content);

  margin-left: 50px;
  margin-right: 50px;
  margin-top: 30px;
  column-gap: 20px;
}
</style>
