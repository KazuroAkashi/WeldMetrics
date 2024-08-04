import { defineStore } from "pinia";
import { FILTER_OPERATIONS, FILTER_OPERATIONS_TEMPLATES } from "~/globals";

export const useDbStore = defineStore("dbstore", {
  state: () => ({
    connectedTo: "",
    tables: {} as Record<string, Table>,
    selectedTableName: "",
    useFilter: [] as Filter[],
    useFilterAny: false,
    orderBy: [] as Order[],
    customFilter: undefined as string | undefined,
    itemsPerPage: parseInt(window.localStorage.getItem("itemsPerPage") ?? "10"),
  }),

  actions: {
    async refreshTables() {
      const { $NativeService } = useNuxtApp();

      this.tables = await $NativeService().listTablesDb();
    },
  },

  getters: {
    ordersExist(state) {
      return state.orderBy.length > 0;
    },
    filtersExist(state) {
      return state.useFilter.length > 0;
    },

    selectedTable(state) {
      return state.tables[state.selectedTableName];
    },

    useFilterParams(state): any[] {
      const ret = [];

      for (let filter of state.useFilter) {
        for (let comp of filter.comp) {
          if (filter.op === "IN" || filter.op === "NOT IN") {
            continue;
          } else
            ret.push(
              useNuxtApp()
                .$UtilService()
                .parseValue(
                  comp,
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

      for (let filter of state.useFilter) {
        for (let comp of filter.comp) {
          if (filter.op === "IN" || filter.op === "NOT IN") {
            ret.push(comp);
          } else
            ret.push(
              useNuxtApp()
                .$UtilService()
                .parseValue(
                  comp,
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

      for (let filter of state.useFilter) {
        const index = FILTER_OPERATIONS.findIndex((val) => val === filter.op);
        const temp = FILTER_OPERATIONS_TEMPLATES[index];
        if (filter.op !== "IN" && filter.op !== "NOT IN")
          ret.push('"' + filter.colname + '" ' + temp);
        else {
          const list = useNuxtApp()
            .$UtilService()
            .parseValue(
              filter.comp[0],
              this.selectedTable.cols.find(
                (col) => col.name === filter.colname
              )!,
              null,
              true
            );

          const str = JSON.stringify(list);

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

      return state.useFilterAny ? ret.join(" OR ") : ret.join(" AND ");
    },
  },
});
