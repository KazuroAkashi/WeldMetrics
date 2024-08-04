export abstract class NativeService {
  abstract connectDb(path: string): Promise<string>;
  abstract listTablesDb(): Promise<Record<string, Table>>;
  abstract queryDb(sql: string, params: any[]): Promise<object[]>;
  abstract execDb(sql: string, params: any[]): Promise<void>;
  abstract readExcel(): Promise<{ rows: string[][]; name: string }>;
}
