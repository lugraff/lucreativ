import { TableColumn } from './table-column';

export interface TableData {
  config?: TableConfig;
  columns: TableColumn[];
  data: any[];
}

export interface TableConfig {
  tableHeight?: string;
  tableWidth?: string;
}

export const emptyTable: TableData = {
  columns: [],
  data: [],
};
