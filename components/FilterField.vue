<template>
  <div class="options">
    <OptionMenu
      class="optionmenu"
      :options="cols"
      placeholder="Select Column"
      v-model="colindex"
      :max-height="300"
    />
    <OptionMenu
      class="optionmenu"
      :options="ops"
      placeholder="Select Operation"
      v-model="opindex"
      :max-height="300"
    />
    <TextField
      placeholder="Parameter 1"
      underlined
      v-model="comp1"
      v-if="parameterCount >= 1"
    />
    <TextField
      placeholder="Parameter 2"
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
} from "~/globals";

const colindex = defineModel<number>("colindex");
const opindex = defineModel<number>("opindex");
const comp1 = defineModel<string>("comp1");
const comp2 = defineModel<string>("comp2");

const table = useDbStore().selectedTable;

const cols = table.cols.map((val) => val.name);
const ops = FILTER_OPERATIONS;

const parameterCount = ref(0);

watch(
  opindex,
  () => {
    parameterCount.value =
      opindex.value !== undefined
        ? FILTER_OPERATIONS_PARAMETER_COUNTS[opindex.value]
        : 0;
  },
  { immediate: true }
);
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
