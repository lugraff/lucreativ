import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectorService, TableColumn, TableConfig, TableData } from '@shared/util-global';
import { TableComponent } from '@shared/ui-global';

@Component({
  selector: 'lucreativ-file-manager',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './file-manager.component.html',
})
export class FileManagerComponent {
  data: TableData = { columns: [], data: [] };

  constructor(connector: ConnectorService) {
    connector
      .get('https://json.extendsclass.com/bins', '49f8f2a5-e8c2-11ec-b943-0242ac110002')
      .subscribe((response) => this.newData(response));
  }

  newData(newData: any): void {
    console.log(newData);
    const config: TableConfig = { tableWidth: '30vw', tableHeight: '30vh' };
    const column: TableColumn = { keyName: 'id', displayName: 'ID' };
    const newDat: object[] = [];
    for (const dat of newData) {
      newDat.push({ id: dat });
    }
    this.data = { config: config, columns: [column], data: newDat };
  }
}
