<template>
  <div class="filter">
    <div class="control-btns">
      <Button type="filled" @click="filter">Filtrele</Button>
      <Button type="bordered" href="/customfilter">Özel Filtre</Button>
      <Button type="bordered" href="/table">İptal</Button>
    </div>
    <div class="filters">
      <div class="all-any">
        <h5>Hepsi</h5>
        <Checkbox v-model="allany" />
        <h5>Herhangi Biri</h5>
      </div>
      <div class="filter-field" v-for="i in colindex.length">
        <Button
          type="empty"
          corners="circle"
          onlyicon
          icon="delete"
          class="delete-btn"
          @click="deleteFilter(i - 1)"
        ></Button>

        <FilterField
          v-model:colindex="colindex[i - 1]"
          v-model:opindex="opindex[i - 1]"
          v-model:comp1="comp1[i - 1]"
          v-model:comp2="comp2[i - 1]"
          v-model:complist="complist[i - 1]"
        />
      </div>
      <div class="btns-wrapper">
        <Button
          class="addbtn"
          type="bordered"
          corners="circle"
          icon="add"
          onlyicon
          @click="addFilter"
        ></Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  FILTER_OPERATIONS,
  FILTER_OPERATIONS_PARAMETER_COUNTS,
  FILTER_OPERATIONS_LIST,
} from "~/globals";

const { $navigateTo } = useNuxtApp();

const table = useDbStore().selectedTable;

onMounted(() => {
  const colindex_start = useDbStore().selectedTableOptions.useFilter.map(
    (filter) => {
      const col = useDbStore().selectedTable.cols.find(
        (col) => col.name === filter.colname
      );
      return col?.cid;
    }
  );

  const opindex_start = useDbStore().selectedTableOptions.useFilter.map(
    (filter) => {
      return FILTER_OPERATIONS.findIndex((op) => op === filter.op);
    }
  );

  const comp1_start = [];
  const comp2_start = [];
  const complist_start = [];

  const filterParams = useDbStore().useFilterParamsFull;

  let cursor = 0;
  for (const filter of useDbStore().selectedTableOptions.useFilter) {
    const index = FILTER_OPERATIONS.findIndex((op) => op === filter.op);

    let c1push = "";
    let c2push = "";
    let clpush = [] as any[];

    if (FILTER_OPERATIONS_LIST[index]) {
      clpush = (filterParams[cursor] as any[]).map((param) => param + "");
      cursor++;
    } else {
      const parameterCount = FILTER_OPERATIONS_PARAMETER_COUNTS[index];

      if (parameterCount >= 1) {
        c1push = filterParams[cursor] + "";
        cursor++;
        if (parameterCount >= 2) {
          c2push = filterParams[cursor] + "";
          cursor++;
        }
      }
    }
    comp1_start.push(c1push);
    comp2_start.push(c2push);
    complist_start.push(clpush);
  }

  colindex.value = colindex_start;
  opindex.value = opindex_start;
  comp1.value = comp1_start;
  comp2.value = comp2_start;
  complist.value = complist_start;
});

const colindex = ref([]) as Ref<(number | undefined)[]>;
const opindex = ref([]) as Ref<(number | undefined)[]>;
const comp1 = ref([]) as Ref<string[]>;
const comp2 = ref([]) as Ref<string[]>;
const complist = ref([]) as Ref<string[][]>;

const allany = ref(useDbStore().selectedTableOptions.useFilterAny);

watch(allany, (val) => {
  useDbStore().selectedTableOptions.useFilterAny = val;
});

const filter = () => {
  useDbStore().selectedTableOptions.useFilter = [];

  for (let i = 0; i < colindex.value.length; i++) {
    if (colindex.value[i] === undefined || opindex.value[i] === undefined) {
      continue;
    }
    const index = opindex.value[i]!;
    const parameterCount = FILTER_OPERATIONS_PARAMETER_COUNTS[index];
    const isList = FILTER_OPERATIONS_LIST[index];

    if (
      (isList && complist.value[i].length === 0) ||
      (!isList && parameterCount >= 1 && !comp1.value[i]) ||
      (!isList && parameterCount >= 2 && !comp2.value[i])
    ) {
      useNotificationStore().send(
        "Boş parametre bırakılamaz.",
        NotificationType.ERROR
      );
      return;
    }

    const col = table.cols[colindex.value[i]!];

    let comparr = [];
    if (isList) {
      comparr = [complist.value[i]];
    } else {
      if (parameterCount >= 1) {
        comparr.push(comp1.value[i]);
        if (parameterCount >= 2) {
          comparr.push(comp2.value[i]);
        }
      }
    }

    useDbStore().selectedTableOptions.useFilter.push({
      colname: col.name,
      op: FILTER_OPERATIONS[opindex.value[i]!],
      comp: comparr,
    });
  }

  useNotificationStore().send("Tablo filtrelendi.", NotificationType.SUCCESS);

  $navigateTo("/table");
};

const addFilter = () => {
  colindex.value.push(-1);
  opindex.value.push(-1);
  comp1.value.push("");
  comp2.value.push("");
  complist.value.push([]);
};

const deleteFilter = (index: number) => {
  colindex.value.splice(index, 1);
  opindex.value.splice(index, 1);
  comp1.value.splice(index, 1);
  comp2.value.splice(index, 1);
  complist.value.splice(index, 1);
};
</script>

<style scoped lang="scss">
.filter {
  height: 100vh;
  overflow-y: scroll;

  background: #184496;
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

.filter-field {
  position: relative;

  .delete-btn {
    position: absolute;
    left: 20px;

    --accent-color: var(--error-color);
    --accent-hover: var(--error-color);
    &:deep(.icon) {
      --icon-color: var(--error-color);
    }
  }
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
