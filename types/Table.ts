interface Table {
  type: string;
  name: string;
  tbl_name: string;
  rootpage: number;
  sql: string;
  cols: Array<Column>;
}

interface Column {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: any;
  pk: number;
}
