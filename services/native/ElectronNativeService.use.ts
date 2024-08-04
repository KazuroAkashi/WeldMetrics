import { NativeService } from "./NativeService.base";

export class ElectronNativeService extends NativeService {
  connectDb(): Promise<string> {
    return window.api.invoke("connect-db");
  }
  listTablesDb(): Promise<Record<string, Table>> {
    return window.api.invoke("list-tables-db");
  }
  queryDb(sql: string, params: any[] = []): Promise<object[]> {
    return window.api.invoke("query-db", sql, params);
  }

  execDb(sql: string, params: any[]): Promise<void> {
    return window.api.invoke("exec-db", sql, params);
  }

  execMultiDb(sql: string, paramsList: any[][]): Promise<void> {
    return window.api.invoke("exec-multi-db", sql, paramsList);
  }

  readExcel(): Promise<{ rows: string[][]; name: string }> {
    return window.api.invoke("read-excel");
  }

  updateApp(): Promise<void> {
    return window.api.invoke("update-app");
  }
}
