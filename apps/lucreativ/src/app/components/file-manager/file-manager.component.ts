import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ConnectorService,
  ECFile,
  emptyECF,
  emptyTable,
  TableColumn,
  TableConfig,
  TableData,
} from '@shared/util-global';
import { ButtonLinkComponent, InputStandardComponent, TableComponent } from '@shared/ui-global';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lucreativ-file-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent, ButtonLinkComponent, InputStandardComponent],
  templateUrl: './file-manager.component.html',
})
export class FileManagerComponent {
  public data: TableData = emptyTable;
  public securityKey = '';
  public filetext = '';
  public actualFileID = '';
  public disableAllButton = false;

  constructor(private connector: ConnectorService) {
    const savedData = JSON.parse(localStorage.getItem('filelist') ?? JSON.stringify(emptyTable));
    if (savedData !== null && savedData !== undefined) {
      this.data = savedData;
    }
  } //TODO ERROR MESSAGES

  public onLoadAllFiles(): void {
    this.disableAllButton = true;
    this.connector //TODO key kommt weg!
      .getAll('49f8f2a5-e8c2-11ec-b943-0242ac110002')
      .subscribe((response) => this.newData(response));
  }
  private newData(newData: any): void {
    const config: TableConfig = { tableWidth: '30vw', tableHeight: '30vh' };
    const column: TableColumn = { keyName: 'id', displayName: 'File ID', clickAction: 'loadcell' };
    const newDat: object[] = [];
    for (const dat of newData) {
      newDat.push({ id: dat });
    }
    this.data = { config: config, columns: [column], data: newDat };
    localStorage.setItem('filelist', JSON.stringify(this.data));
    this.disableAllButton = false;
  }

  public onLoadFile(id: string): void {
    this.actualFileID = id;
    this.connector.getFile(id, this.securityKey).subscribe((response) => this.onFileLoaded(response));
  }
  private onFileLoaded(response: any): void {
    console.log('Loaded RESPONSE: ' + response);
    this.filetext = JSON.stringify(response);
  }

  public onDeleteFile(): void {
    this.connector.delete(this.actualFileID, this.securityKey).subscribe((response) => this.onFileDeleted(response));
  }
  private onFileDeleted(response: any): void {
    console.log('Delete RESPONSE: ' + JSON.stringify(response));
  }

  public onNewFile(): void {
    const newFile = emptyECF;
    newFile.timestamp = Date.now();
    this.filetext = JSON.stringify(newFile);
  }

  public onSaveFile(): void {
    //TODO Private
    this.connector
      .create('49f8f2a5-e8c2-11ec-b943-0242ac110002', this.filetext, this.securityKey)
      .subscribe((response) => this.onSaveFileFinished(response));
  }
  private onSaveFileFinished(response: any): void {
    console.log('RESPONSE:');
    console.log(response);
  }
}
