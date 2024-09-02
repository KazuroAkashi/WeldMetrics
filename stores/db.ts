import { defineStore } from "pinia";
import {
  FILTER_OPERATIONS,
  FILTER_OPERATIONS_LIST,
  FILTER_OPERATIONS_TEMPLATES,
} from "~/globals";

export const useDbStore = defineStore("dbstore", {
  state: () => ({
    checkedLastDb: false,

    connectedTo: "",
    tables: {} as Record<string, Table>,
    tableHistory: [] as string[],
    selectedTableName: "",

    tableOptions: {} as Record<string, TableOptions>,

    itemsPerPage: parseInt(window.localStorage.getItem("itemsPerPage") ?? "10"),
  }),

  actions: {
    resetTableOptions(name: string) {
      this.tableOptions[name].useFilter = [];
      this.tableOptions[name].useFilterAny = false;
      this.tableOptions[name].orderBy = [];
      this.tableOptions[name].customFilter = undefined;
    },

    async refreshTables() {
      const { $NativeService } = useNuxtApp();

      this.tables = await $NativeService().listTablesDb();

      // for (const table of Object.values(this.tables)) {
      //   for (const col of table.cols) {
      //     if (col.type !== "VARCHAR") continue;

      //     const items = await $NativeService().queryDb(
      //       'SELECT DISTINCT "' + col.name + '" FROM ' + table.name
      //     );

      //     col.distinct_values = items.map((item) => item[col.name]);
      //   }
      // }
    },
  },

  getters: {
    selectedTableOptions(state): TableOptions {
      const opts = state.tableOptions[this.selectedTableName];
      if (opts) return opts;

      return (state.tableOptions[this.selectedTableName] = {
        useFilter: [],
        useFilterAny: false,
        customFilter: undefined,
        orderBy: [],
      });
    },

    ordersExist(state): boolean {
      return this.selectedTableOptions.orderBy.length > 0;
    },
    filtersExist(state): boolean {
      return this.selectedTableOptions.useFilter.length > 0;
    },

    selectedTable(state) {
      return state.tables[state.selectedTableName];
    },

    useFilterParams(state): any[] {
      const ret = [];

      for (let filter of this.selectedTableOptions.useFilter) {
        const index = FILTER_OPERATIONS.findIndex((val) => val === filter.op);
        for (let comp of filter.comp) {
          if (FILTER_OPERATIONS_LIST[index]) {
            continue;
          } else
            ret.push(
              useNuxtApp()
                .$UtilService()
                .parseValue(
                  comp as string,
                  this.selectedTable.cols.find(
                    (col) => col.name === filter.colname
                  )!,
                  null
                )
            );
        }
      }

      return ret;
    },

    useFilterParamsFull(state): any[] {
      const ret = [];

      for (let filter of this.selectedTableOptions.useFilter) {
        const index = FILTER_OPERATIONS.findIndex((val) => val === filter.op);
        for (let comp of filter.comp) {
          if (FILTER_OPERATIONS_LIST[index]) {
            ret.push(comp);
          } else
            ret.push(
              useNuxtApp()
                .$UtilService()
                .parseValue(
                  comp as string,
                  this.selectedTable.cols.find(
                    (col) => col.name === filter.colname
                  )!,
                  null
                )
            );
        }
      }

      return ret;
    },

    useFilterString(state): string {
      if (!this.filtersExist) return "";

      const ret = [];

      for (let filter of this.selectedTableOptions.useFilter) {
        const index = FILTER_OPERATIONS.findIndex((val) => val === filter.op);
        const temp = FILTER_OPERATIONS_TEMPLATES[index];
        if (!FILTER_OPERATIONS_LIST[index])
          ret.push('"' + filter.colname + '" ' + temp);
        else {
          const str = JSON.stringify(filter.comp[0]);

          ret.push(
            '"' +
              filter.colname +
              '" ' +
              temp +
              " (" +
              str.substring(1, str.length - 1) +
              ")"
          );
        }
      }

      return this.selectedTableOptions.useFilterAny
        ? ret.join(" OR ")
        : ret.join(" AND ");
    },
  },
});
