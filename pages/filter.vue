<template>
  <div class="filter">
    <div class="control-btns">
      <Button type="filled" @click="filter">Apply Filter</Button>
      <Button type="bordered" href="/customfilter">Custom Filter</Button>
      <Button type="bordered" href="/table">Cancel</Button>
    </div>
    <div class="filters">
      <div class="all-any">
        <h5>All</h5>
        <Checkbox v-model="allany" />
        <h5>Any</h5>
      </div>
      <FilterField
        v-for="i in filterCount"
        v-model:colindex="colindex[i - 1]"
        v-model:opindex="opindex[i - 1]"
        v-model:comp1="comp1[i - 1]"
        v-model:comp2="comp2[i - 1]"
      />
      <div class="btns-wrapper">
        <Button
          class="removebtn"
          type="bordered"
          corners="circle"
          icon="remove"
          onlyicon
          @click="filterCount--"
          v-if="filterCount > 0"
        ></Button>
        <Button
          class="addbtn"
          type="bordered"
          corners="circle"
          icon="add"
          onlyicon
          @click="filterCount++"
        ></Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  FILTER_OPERATIONS,
  FILTER_OPERATIONS_PARAMETER_COUNTS,
} from "~/globals";

const { $navigateTo } = useNuxtApp();

const filterCount = ref(useDbStore().useFilter.length);

const table = useDbStore().selectedTable;

const colindex_start = useDbStore().useFilter.map((filter) => {
  const col = useDbStore().selectedTable.cols.find(
    (col) => col.name === filter.colname
  );
  return col?.cid;
});

const opindex_start = useDbStore().useFilter.map((filter) => {
  return FILTER_OPERATIONS.findIndex((op) => op === filter.op);
});

const comp1_start = [];
const comp2_start = [];

const filterParams = useDbStore().useFilterParamsFull;

let cursor = 0;
for (const filter of useDbStore().useFilter) {
  const index = FILTER_OPERATIONS.findIndex((op) => op === filter.op);
  const parameterCount = FILTER_OPERATIONS_PARAMETER_COUNTS[index];

  let c1push = "";
  let c2push = "";

  if (parameterCount >= 1) {
    c1push = filterParams[cursor];
    cursor++;
    if (parameterCount >= 2) {
      c2push = filterParams[cursor];
      cursor++;
    }
  }

  comp1_start.push(c1push);
  comp2_start.push(c2push);
}

const colindex = ref(colindex_start);
const opindex = ref(opindex_start);
const comp1 = ref(comp1_start);
const comp2 = ref(comp2_start);

const allany = ref(useDbStore().useFilterAny);

watch(allany, (val) => {
  useDbStore().useFilterAny = val;
});

const filter = () => {
  useDbStore().useFilter = [];

  for (let i = 0; i < filterCount.value; i++) {
    if (colindex.value[i] === undefined || opindex.value[i] === undefined) {
      continue;
    }
    const parameterCount =
      FILTER_OPERATIONS_PARAMETER_COUNTS[opindex.value[i]!];

    if (
      (parameterCount >= 1 && !comp1.value[i]) ||
      (parameterCount >= 2 && !comp2.value[i])
    ) {
      useNotificationStore().send(
        "Do not leave empty parameters!",
        NotificationType.ERROR
      );
      return;
    }

    const col = table.cols[colindex.value[i]!];

    const comparr = [];
    if (FILTER_OPERATIONS_PARAMETER_COUNTS[opindex.value[i]!] >= 1) {
      comparr.push(comp1.value[i]);
      if (FILTER_OPERATIONS_PARAMETER_COUNTS[opindex.value[i]!] >= 2) {
        comparr.push(comp2.value[i]);
      }
    }

    useDbStore().useFilter.push({
      colname: col.name,
      op: FILTER_OPERATIONS[opindex.value[i]!],
      comp: comparr,
    });
  }

  useNotificationStore().send("Applied filter", NotificationType.SUCCESS);

  $navigateTo("/table");
};
</script>

<style scoped lang="scss">
.filter {
  height: 100vh;
  overflow-y: scroll;
}
.control-btns {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;
  column-gap: 20px;
}

.all-any {
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
}

.btns-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.addbtn {
  margin: 20px;
}
</style>
