import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { emptyTable, TableColumn, TableData, TooltipDirective } from '@shared/util-global';
import { StandardIconsComponent } from '../standard-icons/standard-icons.component';
import { BehaviorSubject } from 'rxjs';
import { CdkTableModule } from '@angular/cdk/table';

@Component({
  standalone: true,
  imports: [CommonModule, StandardIconsComponent, CdkTableModule, TooltipDirective],
  selector: 'global-table',
  templateUrl: './table.component.html',
})
export class TableComponent implements OnChanges {
  public elementId = 'TABLE_ID_' + Math.floor(Math.random() * 10000000).toString();
  @Input() public maxWindowHeight = '100%';
  @Input() public maxWindowWidth = '100%';
  @Input() public tableData: TableData = emptyTable;
  public tableDataUnsorted: TableData = emptyTable;
  public data = new BehaviorSubject<any[]>([]);
  public displayedCols: string[] = [];
  public sortedBy = '';
  public asc = true;
  private copyMessageTimeout = setTimeout(() => {
    console.log;
  }, 1000);
  public copyMessage = '';
  public boolTrueValues = [true, 'true', 'True', 'x', 'X', '1', 1];
  public boolFalseValues = [false, 'false', 'False', '.', '0', 0];

  // private allowedWidthValues = ['fr', 'px', 'em', 'rem', '%', 'vw', 'vh', 'ex', 'ch'];

  @Input() public tooltipPos = 'bottom';
  @Input() public tooltipLineBreak = false;
  @Input() public tooltipWidth: string | number = 'fit';

  public ngOnChanges(changes: { [property: string]: SimpleChange }) {
    const newData: SimpleChange = changes['tableData'];
    if (newData.currentValue.data.length) {
      for (let index = 0; index < this.tableData.columns.length; index++) {
        const columnRef = this.tableData.columns[index];

        if (columnRef.type === 'dateTime') {
          this.convertDateTime(columnRef, index);
        }
        this.tableDataUnsorted = JSON.parse(JSON.stringify(this.tableData));
        this.updateData(this.tableData);
      }
    }
  }

  private convertDateTime(columnRef: TableColumn, index: number): void {
    this.tableData.columns.splice(index + 1, 0, { keyName: '__date__', displayName: 'Datum', width: columnRef.width });
    this.tableData.columns.splice(index + 2, 0, {
      keyName: '__time__',
      displayName: 'Uhrzeit',
      width: columnRef.width,
    });
    for (const entry of this.tableData.data) {
      entry['__date__'] =
        new Date(entry[columnRef.keyName]).getUTCDate().toString().padStart(2, '0') +
        '.' +
        (new Date(entry[columnRef.keyName]).getUTCMonth() + 1).toString().padStart(2, '0') +
        '.' +
        new Date(entry[columnRef.keyName]).getUTCFullYear().toString();

      entry['__time__'] =
        new Date(entry[columnRef.keyName]).getUTCHours().toString().padStart(2, '0') +
        ':' +
        new Date(entry[columnRef.keyName]).getUTCMinutes().toString().padStart(2, '0');
      // new Date(entry[column.keyName]).getUTCSeconds().toString().padStart(2, '0')
      //TODO TimeStamp for sorting
    }
    this.tableData.columns.splice(index, 1);
  }

  public onTitleClick(keyName: string): void {
    // TODO Leere Felder mit sortieren!
    if (this.sortedBy === keyName && this.asc === true) {
      this.sortedBy = '';
      this.tableData = JSON.parse(JSON.stringify(this.tableDataUnsorted));
      this.updateData(this.tableData);
      return;
    }
    if (this.sortedBy !== keyName) {
      this.asc = true;
    }
    this.sortedBy = keyName;
    if (this.asc) {
      this.tableData.data = this.tableData.data.sort((a, b) =>
        a[keyName] > b[keyName] ? 1 : b[keyName] > a[keyName] ? -1 : 0
      );
      this.asc = false;
    } else {
      this.tableData.data = this.tableData.data.sort((b, a) =>
        a[keyName] > b[keyName] ? 1 : b[keyName] > a[keyName] ? -1 : 0
      );
      this.asc = true;
    }
    this.updateData(this.tableData);
  }

  public updateData(data: TableData): void {
    this.data.next(data.data);
    this.displayedCols = data.columns.map((column) => column.keyName);
  }

  public onCellClick(rowData: any, columnData: TableColumn): void {
    if (columnData.clickAction === 'clipboard') {
      navigator.clipboard.writeText(rowData[columnData.keyName]);
      this.copyMessage = rowData[columnData.keyName] + ' kopiert.';
      clearTimeout(this.copyMessageTimeout);
      this.copyMessageTimeout = setTimeout(() => {
        this.copyMessage = '';
      }, 2000);
    } else {
      console.log(columnData.clickAction + ' ' + rowData[columnData.keyName]);
    }
  }
}
