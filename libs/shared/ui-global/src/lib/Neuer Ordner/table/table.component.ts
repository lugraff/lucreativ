import { Component, HostBinding, Input, OnChanges, OnDestroy, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  defaultConfig,
  emptyTable,
  errorTable,
  getTailwindColorHexCode,
  TableColumn,
  TableData,
  TooltipDirective,
} from '@shared/util-global';
import { CdkTableModule } from '@angular/cdk/table';
import { Clipboard } from '@angular/cdk/clipboard';
import { IconComponent } from '../icon/icon.component';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { ReplaySubject, Subscription } from 'rxjs';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  standalone: true,
  imports: [CommonModule, IconComponent, CdkTableModule, TooltipDirective, InfoPopupComponent, LoadingSpinnerComponent],
  selector: 'global-table',
  templateUrl: './table.component.html',
})
export class TableComponent implements OnChanges, OnDestroy {
  @Input() public ttPosition = 'top'; //'top', 'left', 'right', 'bottom'
  @Input() public ttAlign = 'center'; //'start', 'center', 'end'
  @Input() public ttAnchor = 'parent'; //'mouse', 'parent', 'screen'
  @Input() public ttOffset = 8;
  @Input() public tableData: TableData = emptyTable;
  private subscription = new Subscription();
  private tableDataCopy = new ReplaySubject<TableData>();
  public tableDataCopy$ = this.tableDataCopy.asObservable();
  public displayedCols: string[] = [];
  private dateSortTypes = ['__datetime__', '__time__', '__date__', '__splittedDateTime__'];
  private sortedByColumnIndex = -1;
  public sortedBy = '';
  public asc = true;
  public windowHeight = '100%';
  public windowWidth = '100%';
  public copyMessage = '';
  public boolTrueValues = [true, 'true', 'True', 'x', 'X', '1', 1];
  public boolFalseValues = [false, 'false', 'False', '.', '0', 0];
  public loading = false;
  private redrawFlag = false;
  @HostBinding('class') public class = 'elite_h_scrollbar';
  // private allowedWidthValues = ['fr', 'px', 'em', 'rem', '%', 'vw', 'vh', 'ex', 'ch'];
  //TODO TrackBy funktion einbauen // cdk fixedLayout? // recycleRows?
  constructor(private clipboard: Clipboard) {
    this.subscription = this.tableDataCopy.subscribe((newTableData) => this.newTableData(newTableData));
  }

  public ngOnChanges(changes: { [property: string]: SimpleChange }) {
    const newData: SimpleChange = changes['tableData'];
    if (newData.currentValue !== newData.previousValue) {
      if (newData.currentValue.columns === undefined || newData.currentValue.data === undefined) {
        this.tableDataCopy.next(errorTable);
      } else if (newData.currentValue.columns.length === 0 || newData.currentValue.data.length === 0) {
        this.tableDataCopy.next(emptyTable);
      } else {
        this.tableDataCopy.next(JSON.parse(JSON.stringify(newData.currentValue)));
      }
    }
  }

  private newTableData(newTableData: TableData): void {
    // this.loading = true;
    if (this.redrawFlag) {
      this.displayedCols = [];
    }
    setTimeout(() => {
      if (newTableData.config === undefined || newTableData.config === null) {
        newTableData.config = defaultConfig;
      } else {
        this.setConfig(newTableData);
      }
      if (this.sortedByColumnIndex >= 0) {
        newTableData.data = this.sortTableData(newTableData);
      }
      this.convertColumns(newTableData);
      this.displayedCols = newTableData.columns.map((column) => column.keyName);

      this.redrawFlag = true;
      this.loading = false;
    });
  }

  private setConfig(newTableData: TableData): void {
    if (newTableData.config === undefined) {
      return;
    }
    for (const configKey of Object.keys(newTableData.config)) {
      if (configKey === 'tableHeight') {
        const tableHeight = newTableData.config[configKey];
        if (tableHeight !== undefined) {
          this.windowHeight = tableHeight;
        }
      } else if (configKey === 'tableWidth') {
        const tableWidth = newTableData.config[configKey];
        if (tableWidth !== undefined) {
          this.windowWidth = tableWidth;
        }
      } else if (configKey === 'sortKey') {
        const sortKey = newTableData.config[configKey];
        if (sortKey !== undefined) {
          this.sortedBy = sortKey;
          for (let index = 0; index < newTableData.columns.length; index++) {
            const columnSearch = newTableData.columns[index];
            if (columnSearch.keyName === sortKey) {
              this.sortedByColumnIndex = index;
            }
          }
        }
      } else if (configKey === 'sortASC') {
        const sortASC = newTableData.config[configKey];
        if (sortASC !== undefined) {
          this.asc = sortASC;
        }
      }
    }
  }

  private sortTableData(newTableData: TableData): any[] {
    let sortedData = [...newTableData.data];
    const keyName = newTableData.columns[this.sortedByColumnIndex].keyName;
    if (this.asc) {
      if (this.dateSortTypes.includes(newTableData.columns[this.sortedByColumnIndex].type ?? '')) {
        sortedData = [...newTableData.data].sort((a, b) =>
          a[keyName + '__timeStamp__'] > b[keyName + '__timeStamp__']
            ? 1
            : b[keyName + '__timeStamp__'] > a[keyName + '__timeStamp__']
            ? -1
            : 0
        );
      } else {
        sortedData = [...newTableData.data].sort((a, b) =>
          a[keyName] > b[keyName] ? 1 : b[keyName] > a[keyName] ? -1 : 0
        );
      }
    } else {
      // if this.dsc
      if (this.dateSortTypes.includes(newTableData.columns[this.sortedByColumnIndex].type ?? '')) {
        sortedData = [...newTableData.data].sort((b, a) =>
          a[keyName + '__timeStamp__'] > b[keyName + '__timeStamp__']
            ? 1
            : b[keyName + '__timeStamp__'] > a[keyName + '__timeStamp__']
            ? -1
            : 0
        );
      } else {
        sortedData = [...newTableData.data].sort((b, a) =>
          a[keyName] > b[keyName] ? 1 : b[keyName] > a[keyName] ? -1 : 0
        );
      }
    }
    return sortedData;
  }

  private convertColumns(newTableData: TableData): void {
    for (const column of newTableData.columns) {
      if (column.type === 'dateTime') {
        this.convertDateTime(column, newTableData);
      } else if (column.type === 'date') {
        this.convertDate(column, newTableData);
      } else if (column.type === 'time') {
        this.convertTime(column, newTableData);
      } else if (column.type === 'splittedDateTime') {
        this.convertsplittedDateTime(column, newTableData);
      }
    }
  }
  private convertDateTime(column: TableColumn, newTableData: TableData): void {
    for (const entry of newTableData.data) {
      if (entry[column.keyName] === null) {
        entry[column.keyName] = '';
        continue;
      }
      entry[column.keyName + '__timeStamp__'] = new Date(entry[column.keyName]).getTime();
      entry[column.keyName] =
        new Date(entry[column.keyName]).getUTCDate().toString().padStart(2, '0') +
        '.' +
        (new Date(entry[column.keyName]).getUTCMonth() + 1).toString().padStart(2, '0') +
        '.' +
        new Date(entry[column.keyName]).getUTCFullYear().toString() +
        '   ' +
        new Date(entry[column.keyName]).getUTCHours().toString().padStart(2, '0') +
        ':' +
        new Date(entry[column.keyName]).getUTCMinutes().toString().padStart(2, '0');
    }
  }
  private convertDate(column: TableColumn, newTableData: TableData): void {
    for (const entry of newTableData.data) {
      if (entry[column.keyName] === null) {
        entry[column.keyName] = '';
        continue;
      }
      entry[column.keyName + '__timeStamp__'] = new Date(entry[column.keyName]).getTime();
      entry[column.keyName] =
        new Date(entry[column.keyName]).getUTCDate().toString().padStart(2, '0') +
        '.' +
        (new Date(entry[column.keyName]).getUTCMonth() + 1).toString().padStart(2, '0') +
        '.' +
        new Date(entry[column.keyName]).getUTCFullYear().toString();
    }
  }
  private convertTime(column: TableColumn, newTableData: TableData): void {
    for (const entry of newTableData.data) {
      if (entry[column.keyName] === null) {
        entry[column.keyName] = '';
        continue;
      }
      entry[column.keyName + '__timeStamp__'] = new Date(entry[column.keyName]).getTime();
      entry[column.keyName] =
        new Date(entry[column.keyName]).getUTCHours().toString().padStart(2, '0') +
        ':' +
        new Date(entry[column.keyName]).getUTCMinutes().toString().padStart(2, '0');
    }
  }
  private convertsplittedDateTime(column: TableColumn, newTableData: TableData): void {
    const newColumns: TableColumn[] = [
      {
        keyName: column.keyName + '__date',
        displayName: column.displayName + ' Datum',
        width: column.width,
        type: '__splittedDateTime__',
        colored: column.colored,
        clickAction: column.clickAction,
      },
      {
        keyName: column.keyName + '__time',
        displayName: column.displayName + ' Uhrzeit',
        width: column.width,
        type: '__splittedDateTime__',
        colored: column.colored,
        clickAction: column.clickAction,
      },
    ];
    for (let index = 0; index < newTableData.columns.length; index++) {
      const columnSearch = newTableData.columns[index];
      if (columnSearch.keyName === column.keyName) {
        newTableData.columns.splice(index, 1, ...newColumns);
      }
    }
    for (const entry of newTableData.data) {
      if (entry[column.keyName] === null) {
        entry[column.keyName] = '';
        continue;
      }
      entry[column.keyName + '__timeStamp__'] = new Date(entry[column.keyName]).getTime();
      entry[column.keyName + '__date'] =
        new Date(entry[column.keyName]).getUTCDate().toString().padStart(2, '0') +
        '.' +
        (new Date(entry[column.keyName]).getUTCMonth() + 1).toString().padStart(2, '0') +
        '.' +
        new Date(entry[column.keyName]).getUTCFullYear().toString();
      entry[column.keyName + '__time'] =
        new Date(entry[column.keyName]).getUTCHours().toString().padStart(2, '0') +
        ':' +
        new Date(entry[column.keyName]).getUTCMinutes().toString().padStart(2, '0');
    }
  }

  public thisGetTailwindColorHexCode(colorName: string): string {
    return getTailwindColorHexCode(colorName);
  }

  public onTitleClick(columnKeyName: string, index: number): void {
    if (this.sortedBy !== columnKeyName) {
      this.asc = false;
    }
    if (this.sortedBy === columnKeyName && this.asc === false) {
      this.sortedBy = '';
      this.sortedByColumnIndex = -1;
    } else {
      this.sortedBy = columnKeyName;
      this.sortedByColumnIndex = index;
    }
    const tableDataWithnewConfig: TableData = {
      config: { tableHeight: this.windowHeight },
      data: this.tableData.data,
      columns: this.tableData.columns,
    };
    this.asc = !this.asc;
    this.redrawFlag = false;
    this.tableDataCopy.next(JSON.parse(JSON.stringify(tableDataWithnewConfig)));
  }

  public onCellClick(rowData: any, columnData: TableColumn): void {
    if (columnData.clickAction === 'clipboard') {
      if (this.clipboard.copy(rowData[columnData.keyName])) {
        this.copyMessage = rowData[columnData.keyName] + ' kopiert.';
      } else {
        this.copyMessage = 'Kopieren fehlgeschlagen!';
      }
    } else {
      console.log(rowData[columnData.keyName]);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
