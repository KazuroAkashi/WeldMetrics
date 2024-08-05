export abstract class NativeService {
  abstract connectDb(
    dbPath?: string
  ): Promise<{ dbName: string; path: string }>;
  abstract listTablesDb(): Promise<Record<string, Table>>;
  abstract queryDb(sql: string, params: any[]): Promise<Record<string, any>[]>;
  abstract execDb(sql: string, params: any[]): Promise<void>;
  abstract execMultiDb(sql: string, paramsList: any[][]): Promise<void>;
  abstract readExcel(): Promise<{ rows: string[][]; name: string }>;
  abstract updateApp(): Promise<void>;
  abstract fileExists(path: string): Promise<boolean>;
  abstract askApprove(opts: {
    title: string;
    message: string;
    detail: string;
    buttons: string[];
  }): Promise<number>;
  abstract askSave(): Promise<{ canceled: boolean; filePaths: string[] }>;
  abstract exportToExcel(filepath: string, data: any[][]): Promise<void>;
}
