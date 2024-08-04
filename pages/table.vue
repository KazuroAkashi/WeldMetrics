<template>
  <div class="table">
    <div class="control-btns">
      <Button type="bordered" href="/" icon="chevron_left">Back</Button>
      <!-- <Button type="filled" href="/insert">Insert Row</Button> -->
      <Button type="bordered" href="/options" icon="settings">Options</Button>
      <Button type="filled" href="/filter" icon="filter_alt"
        >Apply Filter</Button
      >
      <Button type="filled" href="/order" icon="format_list_numbered"
        >Apply Order</Button
      >
      <Button
        type="bordered"
        v-if="useDbStore().filtersExist || useDbStore().customFilter"
        @click="removeFilter"
        icon="close"
        >Remove Filter</Button
      >
      <!-- <Button
        type="bordered"
        v-if="useDbStore().filtersExist || useDbStore().customFilter"
        @click="deleteCurrent"
        >Delete Current Items</Button
      > -->
      <Button
        type="bordered"
        v-if="useDbStore().ordersExist"
        @click="removeOrder"
        icon="close"
        >Remove Order</Button
      >
    </div>
    <div class="table-wrapper-outer">
      <div class="table-wrapper">
        <p>
          Showing <span class="accent">{{ rowCount }}</span> rows
        </p>
        <table class="table-inner">
          <thead>
            <tr>
              <th v-for="col in table.cols">{{ col.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="i in itemsPerPage"
              :style="{
                height: 'calc(100% / ' + itemsPerPage + ')',
              }"
            >
              <td
                v-for="col in table.cols"
                :style="{
                  width: 'calc(100% / ' + table.cols.length + ')',
                }"
              >
                {{ i - 1 < data.length ? data[i - 1][col.name] : " " }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="page-btns">
      <Button
        type="bordered"
        corners="circle"
        icon="keyboard_double_arrow_left"
        onlyicon
        @click="firstPage"
      ></Button>
      <Button
        type="bordered"
        corners="circle"
        icon="chevron_left"
        onlyicon
        @click="prevPage"
      ></Button>
      <h3>{{ currentPage + " / " + pageCount }}</h3>
      <Button
        type="bordered"
        corners="circle"
        icon="chevron_right"
        onlyicon
        @click="nextPage"
      ></Button>
      <Button
        type="bordered"
        corners="circle"
        icon="keyboard_double_arrow_right"
        onlyicon
        @click="lastPage"
      ></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $NativeService } = useNuxtApp();

const table = useDbStore().selectedTable;

const currentPage = ref(1);

const itemsPerPage = ref(useDbStore().itemsPerPage);

const rowCount = ref(0);
const pageCount = computed(() =>
  Math.ceil(rowCount.value / itemsPerPage.value)
);

const data = ref([] as Record<string, any>[]);

onMounted(async () => {
  await fetchRowCount();
  await populateData(currentPage.value);
});

const fetchRowCount = async () => {
  let sql = "SELECT COUNT(*) FROM " + table.name;

  if (useDbStore().customFilter) {
    sql += " WHERE " + useDbStore().customFilter;
  } else if (useDbStore().filtersExist) {
    sql += " WHERE " + useDbStore().useFilterString;
  }

  const val = await $NativeService().queryDb(
    sql,
    useDbStore().customFilter ? [] : toRaw(useDbStore().useFilterParams)
  );
  rowCount.value = (val[0] as any)["COUNT(*)"];
};

const populateData = async (page: number) => {
  currentPage.value = page;

  let sql = "SELECT * FROM " + table.name;

  if (useDbStore().customFilter) {
    sql += " WHERE " + useDbStore().customFilter;
  } else if (useDbStore().filtersExist) {
    sql += " WHERE " + useDbStore().useFilterString;
  }

  if (useDbStore().ordersExist) {
    const orderlist = useDbStore().orderBy.map((order) => {
      return '"' + order.colname + '"' + (order.desc ? " DESC" : "");
    });

    sql += " ORDER BY " + orderlist.join(", ");
  }

  sql +=
    " LIMIT " +
    itemsPerPage.value +
    " OFFSET " +
    (page - 1) * itemsPerPage.value;

  data.value = await $NativeService().queryDb(
    sql,
    useDbStore().customFilter ? [] : toRaw(useDbStore().useFilterParams)
  );
};

const removeFilter = () => {
  useDbStore().useFilter = [];
  useDbStore().customFilter = undefined;
  currentPage.value = 1;
  fetchRowCount();
  populateData(currentPage.value);
};

const removeOrder = () => {
  useDbStore().orderBy = [];
  currentPage.value = 1;
  fetchRowCount();
  populateData(currentPage.value);
};

const deleteCurrent = async () => {
  if (useDbStore().customFilter) {
    await $NativeService().execDb(
      "DELETE FROM " + table.name + " WHERE " + useDbStore().customFilter,
      []
    );
  } else if (useDbStore().filtersExist) {
    await $NativeService().execDb(
      "DELETE FROM " + table.name + " WHERE " + useDbStore().useFilterString,
      toRaw(useDbStore().useFilterParams)
    );
  }

  useNotificationStore().send("Deleted items!", NotificationType.SUCCESS);

  removeFilter();
};

const firstPage = () => {
  populateData(1);
};

const prevPage = () => {
  const newpage = Math.max(currentPage.value - 1, 1);
  populateData(newpage);
};

const nextPage = () => {
  const newpage = Math.min(currentPage.value + 1, pageCount.value);
  populateData(newpage);
};

const lastPage = () => {
  const newpage = pageCount.value;
  populateData(newpage);
};
</script>

<style scoped lang="scss">
.table {
  display: grid;
  grid-template-rows: auto 1fr auto;

  height: 100vh;

  overflow: hidden;
}

.order-row {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  column-gap: 50px;
}

.control-btns {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  column-gap: 10px;
  row-gap: 10px;
  flex-wrap: wrap;
}

.accent {
  color: var(--primary-color);
  font-weight: bold;
}

.table-wrapper-outer {
  position: relative;
  display: flex;

  overflow: hidden;
}

.table-wrapper-outer:after {
  content: "";
  box-shadow: inset 0 0 10px 3px black;
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.table-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 5px;

  padding: 30px 80px;

  overflow-y: scroll;

  background-color: var(--background-color-1);
}

.table-inner {
  border-collapse: collapse;
  flex-grow: 1;

  font-size: 0.8rem;

  border-radius: 10px;
  overflow: hidden;

  table-layout: fixed;

  box-shadow: 0 0 8px 5px rgba(0, 0, 0, 0.4);

  thead {
    background-color: var(--background-color-3);
  }

  tbody tr:nth-child(odd) {
    background-color: var(--background-color-1);
  }
  tbody tr:nth-child(even) {
    background-color: var(--background-color-2);
  }

  th,
  td {
    padding: 5px 10px;
  }

  th {
    border-bottom: 3px solid var(--background-color-r2);
    box-shadow: 0 2px 8px 5px rgab(0, 0, 0, 0.4);
  }

  tbody tr:not(:last-child) {
    border-bottom: 1px solid var(--background-color-r1);
  }

  th:not(:last-child),
  td:not(:last-child) {
    border-right: 1px solid var(--background-color-r1);
  }
}

.page-btns {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  column-gap: 20px;
}
</style>
