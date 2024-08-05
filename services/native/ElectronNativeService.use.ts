import { NativeService } from "./NativeService.base";

export class ElectronNativeService extends NativeService {
  connectDb(dbPath?: string): Promise<{ dbName: string; path: string }> {
    return window.api.invoke("connect-db", dbPath);
  }
  listTablesDb(): Promise<Record<string, Table>> {
    return window.api.invoke("list-tables-db");
  }
  queryDb(sql: string, params: any[] = []): Promise<Record<string, any>[]> {
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

  fileExists(path: string): Promise<boolean> {
    return window.api.invoke("file-exists", path);
  }

  askApprove(opts: {
    title: string;
    message: string;
    detail: string;
    buttons: string[];
  }): Promise<number> {
    return window.api.invoke("ask-approve", opts);
  }

  askSave(): Promise<{ canceled: boolean; filePaths: string[] }> {
    return window.api.invoke("ask-save");
  }

  exportToExcel(filepath: string, data: any[][]): Promise<void> {
    return window.api.invoke("export-to-excel", filepath, data);
  }
}
