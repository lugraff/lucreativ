import { TableColumn } from './table-column';

export interface TableData {
  columns: TableColumn[];
  data: any[];
}

export const emptyTable: TableData = {
  columns: [],
  data: [],
};
