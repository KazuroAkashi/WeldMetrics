<template>
  <div class="table">
    <div class="control-btns">
      <TransitionGroup name="hor-btns" appear>
        <Button type="bordered" @click="goBack" icon="chevron_left" key="1"
          >Geri</Button
        >
        <!-- <Button type="filled" href="/insert">Insert Row</Button> -->
        <Button type="bordered" href="/options" icon="settings" key="2"
          >Ayarlar</Button
        >
        <Button type="bordered" @click="exportTable" icon="ios_share" key="3"
          >Tabloyu Aktar</Button
        >
        <Button type="filled" href="/filter" icon="filter_alt" key="4"
          >Filtrele</Button
        >
        <Button type="filled" href="/order" icon="format_list_numbered" key="5"
          >Sırala</Button
        >
        <Button
          type="bordered"
          v-if="
            useDbStore().filtersExist ||
            useDbStore().selectedTableOptions.customFilter
          "
          @click="removeFilter"
          icon="close"
          key="5"
          >Filtreleri Kaldır</Button
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
          key="6"
          >Sıralamayı Kaldır</Button
        >
      </TransitionGroup>
    </div>
    <div class="table-wrapper-outer">
      <div class="table-wrapper">
        <p>
          Tablo: <span class="accent">{{ table.name }}</span>
        </p>
        <p>
          <span class="accent">{{ rowCount }}</span> satır bulundu
        </p>
        <table class="table-inner" ref="tableEl">
          <thead>
            <tr>
              <th v-for="col in table.cols" @click="orderBy(col)">
                <div class="th-inner">
                  <div>{{ col.name }}</div>
                  <Icon
                    class="asc-icon"
                    icon="arrow_drop_down"
                    v-if="getOrdering(col) === 'asc'"
                  />
                  <Icon
                    class="desc-icon"
                    icon="arrow_drop_up"
                    v-if="getOrdering(col) === 'desc'"
                  />
                </div>
              </th>
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
                :class="{
                  tablename: Object.keys(useDbStore().tables).includes(
                    cellValue(i - 1, col.name)
                  ),
                }"
                @click="tryGoToTable(cellValue(i - 1, col.name))"
              >
                {{ cellValue(i - 1, col.name) }}
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
        :disabled="currentPage === 1"
        class="page-btn"
      ></Button>
      <Button
        type="bordered"
        corners="circle"
        icon="chevron_left"
        onlyicon
        @click="prevPage"
        :disabled="currentPage === 1"
        class="page-btn"
      ></Button>
      <h3>{{ currentPage + " / " + pageCount }}</h3>
      <Button
        type="bordered"
        corners="circle"
        icon="chevron_right"
        onlyicon
        @click="nextPage"
        :disabled="currentPage === pageCount"
        class="page-btn"
      ></Button>
      <Button
        type="bordered"
        corners="circle"
        icon="keyboard_double_arrow_right"
        onlyicon
        @click="lastPage"
        :disabled="currentPage === pageCount"
        class="page-btn"
      ></Button>
      <div class="footer-logo-wrapper">
        <img src="/weldmetrics.png" class="footer-logo" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $NativeService } = useNuxtApp();

const table = useDbStore().selectedTable;

const tableEl = ref() as Ref<HTMLElement>;

const currentPage = ref(1);

const itemsPerPage = ref(useDbStore().itemsPerPage);

const rowCount = ref(0);
const pageCount = computed(() => {
  const count = Math.ceil(rowCount.value / itemsPerPage.value);
  if (count > 0) return count;
  else return 1;
});

const data = ref([] as Record<string, any>[]);

onMounted(async () => {
  fetchRowCount();
  populateData(1);
});

const cellValue = (row: number, col: string) => {
  return row < data.value.length ? data.value[row][col] : " ";
};

const fetchRowCount = async () => {
  let sql = "SELECT COUNT(*) FROM " + table.name;

  if (useDbStore().selectedTableOptions.customFilter) {
    sql += " WHERE " + useDbStore().selectedTableOptions.customFilter;
  } else if (useDbStore().filtersExist) {
    sql += " WHERE " + useDbStore().useFilterString;
  }

  const val = await $NativeService().queryDb(
    sql,
    useDbStore().selectedTableOptions.customFilter
      ? []
      : toRaw(useDbStore().useFilterParams)
  );
  rowCount.value = (val[0] as any)["COUNT(*)"];
};

const populateData = async (page: number) => {
  currentPage.value = page;

  let sql = "SELECT * FROM " + table.name;

  if (useDbStore().selectedTableOptions.customFilter) {
    sql += " WHERE " + useDbStore().selectedTableOptions.customFilter;
  } else if (useDbStore().filtersExist) {
    sql += " WHERE " + useDbStore().useFilterString;
  }

  if (useDbStore().ordersExist) {
    const orderlist = useDbStore().selectedTableOptions.orderBy.map((order) => {
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
    useDbStore().selectedTableOptions.customFilter
      ? []
      : toRaw(useDbStore().useFilterParams)
  );
};

const removeFilter = () => {
  useDbStore().selectedTableOptions.useFilter = [];
  useDbStore().selectedTableOptions.customFilter = undefined;
  currentPage.value = 1;
  fetchRowCount();
  populateData(currentPage.value);
};

const removeOrder = () => {
  useDbStore().selectedTableOptions.orderBy = [];
  currentPage.value = 1;
  fetchRowCount();
  populateData(currentPage.value);
};

const deleteCurrent = async () => {
  if (useDbStore().selectedTableOptions.customFilter) {
    await $NativeService().execDb(
      "DELETE FROM " +
        table.name +
        " WHERE " +
        useDbStore().selectedTableOptions.customFilter,
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

const orderBy = (col: Column) => {
  const orderingBy = useDbStore().selectedTableOptions.orderBy;
  let desc = false;
  if (orderingBy.length === 1 && orderingBy[0].colname === col.name) {
    desc = !orderingBy[0].desc;
  }

  useDbStore().selectedTableOptions.orderBy = [{ colname: col.name, desc }];
  populateData(1);
};

const getOrdering = (col: Column) => {
  const orderingBy = useDbStore().selectedTableOptions.orderBy;

  if (orderingBy.length !== 1 || orderingBy[0].colname !== col.name) {
    return "none";
  }

  return orderingBy[0].desc ? "desc" : "asc";
};

const exportTable = async () => {
  const { canceled, filePaths } = await $NativeService().askSave();
  if (canceled) return;

  const firstrow = [];
  for (const col of table.cols) {
    firstrow.push(col.name);
  }

  const rows = await $NativeService().queryDb("SELECT * FROM " + table.name);
  const rowsFormatted = rows.map((row) => {
    return Object.values(row);
  });

  const aoa = [firstrow, ...rowsFormatted];

  await $NativeService().exportToExcel(
    filePaths[0] + "/" + table.name + ".xlsx",
    aoa
  );

  useNotificationStore().send(
    "Tablo dışarıya aktarıldı: " + table.name + ".xlsx",
    NotificationType.SUCCESS
  );
};

const vibrateTable = () => {
  tableEl.value.animate(
    [
      {
        transform: "translateY(0)",
        opacity: 1,
      },
      {
        transform: "translateY(15px)",
        opacity: 0.6,
      },
      {
        transform: "translateY(0)",
        opacity: 1,
      },
    ],
    {
      duration: 300,
      easing: "ease-in-out",
    }
  );
};

const firstPage = () => {
  populateData(1);
  vibrateTable();
};

const prevPage = () => {
  const newpage = Math.max(currentPage.value - 1, 1);
  populateData(newpage);
  vibrateTable();
};

const nextPage = () => {
  const newpage = Math.min(currentPage.value + 1, pageCount.value);
  populateData(newpage);
  vibrateTable();
};

const lastPage = async () => {
  const newpage = pageCount.value;
  populateData(newpage);
  vibrateTable();
};

const goBack = async () => {
  const last = useDbStore().tableHistory.pop();

  if (!last || !(await tryGoToTable(last, true))) {
    useNuxtApp().$navigateTo("/");
  }
};

const tryGoToTable = async (name: string, nohistory?: boolean) => {
  if (!Object.keys(useDbStore().tables).includes(name)) return false;

  useDbStore().selectedTableName = name;
  if (!nohistory) useDbStore().tableHistory.push(table.name);
  await useNuxtApp().$router.push("/");
  await useNuxtApp().$router.push("/table");
  return true;
};
</script>

<style scoped lang="scss">
.table {
  display: grid;
  grid-template-rows: auto 1fr auto;

  height: 100vh;

  overflow: hidden;

  background: #184496;
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

  * {
    --accent-color: var(--light-color);
    --accent-hover: var(--light-color-2);
  }
}

.accent {
  color: #184496;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  row-gap: 5px;

  padding: 30px 80px;

  overflow-y: scroll;

  background-color: rgb(153, 153, 153);
  p {
    color: #184496;
  }
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
    background-color: #184496;
  }

  tbody tr:nth-child(odd) {
    background-color: var(--foreground-color-1);
  }
  tbody tr:nth-child(even) {
    background-color: var(--foreground-color-3);
  }

  th,
  td {
    padding: 5px 10px;
    color: #184496;
  }

  td {
    font-weight: 800;
  }

  th {
    border-bottom: 3px solid var(--background-color-r2);
    box-shadow: 0 2px 8px 5px rgab(0, 0, 0, 0.4);

    cursor: pointer;
    user-select: none;

    .th-inner {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  tbody tr:not(:last-child) {
    border-bottom: 1px solid var(--background-color-r1);
  }

  th:not(:last-child),
  td:not(:last-child) {
    border-right: 1px solid var(--background-color-r1);
  }

  td.tablename {
    text-decoration: underline;
    cursor: pointer;
  }
}

.page-btns {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  column-gap: 20px;
}

.footer-logo-wrapper {
  position: absolute;
  right: 20px;
  top: 0;
  bottom: 0;
  aspect-ratio: 1;

  display: flex;
  justify-content: center;
  align-items: center;

  .footer-logo {
    width: 64px;
    height: 64px;
  }
}
</style>
