import { TableColumn } from './table-column';

export interface TableData {
  config?: TableConfig;
  columns: TableColumn[];
  data: any[];
}

export interface TableConfig {
  tableHeight?: string;
  tableWidth?: string;
  sortKey?: string;
  sortASC?: boolean;
}

const emptyTableREF: TableData = {
  config: {
    tableHeight: '4.1rem',
    tableWidth: '50vw',
  },
  columns: [
    {
      keyName: 'icon',
      displayName: '',
      type: 'icon',
      width: '32px',
      colored: true,
    },
    {
      keyName: 'error',
      displayName: 'Information',
    },
  ],
  data: [
    {
      icon: 'featherAlertTriangle',
      error: 'Die Tabelle beinhaltet keine Daten bzw. Spalteninformationen!',
      ColorCode: '#ffcc00',
    },
  ],
};
export const emptyTable: TableData = JSON.parse(JSON.stringify(emptyTableREF));

const errorTableREF: TableData = {
  config: {
    tableHeight: '4.1rem',
    tableWidth: '50vw',
  },
  columns: [
    {
      keyName: 'icon',
      displayName: '',
      type: 'icon',
      width: '32px',
      colored: true,
    },
    {
      keyName: 'error',
      displayName: 'Information',
    },
  ],
  data: [
    {
      icon: 'featherAlertCircle',
      error: 'Die Tabelle hat ein fehlerhaftes JSON-Format und konnte deshalb nicht geladen werden!',
      ColorCode: '#f54b4c',
    },
  ],
};
export const errorTable: TableData = JSON.parse(JSON.stringify(errorTableREF));

const defaultConfigREF: TableConfig = {
  tableHeight: '100%',
  tableWidth: '100%',
};
export const defaultConfig: TableConfig = JSON.parse(JSON.stringify(defaultConfigREF));
