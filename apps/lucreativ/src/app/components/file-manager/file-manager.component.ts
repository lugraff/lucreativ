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
import {
  ButtonLinkComponent,
  ButtonStandardComponent,
  InfoPopupComponent,
  InputCheckboxComponent,
  InputStandardComponent,
  ListComponent,
  TableComponent,
} from '@shared/ui-global';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lucreativ-file-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    ButtonLinkComponent,
    ButtonStandardComponent,
    InputStandardComponent,
    ListComponent,
    InputCheckboxComponent,
    InfoPopupComponent,
  ],
  templateUrl: './file-manager.component.html',
})
export class FileManagerComponent {
  public data: string[] = [];
  public securityKey = '';
  public filetext = '';
  public actualFileID = '';
  public disableAllButton = false;
  public errorMessage = '';

  constructor(private connector: ConnectorService) {
    const savedData = JSON.parse(localStorage.getItem('filelist') ?? '[]');
    console.log(savedData);
    if (savedData !== null && savedData !== undefined) {
      this.data = savedData;
    }
  } //TODO ERROR MESSAGES

  public onLoadAllFiles(): void {
    this.disableAllButton = true;
    this.connector //TODO key kommt weg!
      .getAll('49f8f2a5-e8c2-11ec-b943-0242ac110002')
      .subscribe((response) => this.fetchedData(response));
  }
  private fetchedData(newData: any): void {
    this.data = newData;
    localStorage.setItem('filelist', JSON.stringify(newData));
    this.disableAllButton = false;
  }

  public onLoadFile(id: string): void {
    this.actualFileID = id;
    const observer = {
      next: (response: any) => this.onFileLoaded(response),
      error: (error: any) => (this.filetext = error.message),
    };
    this.connector.getFile(id, this.securityKey).subscribe(observer);
  }
  // (response) => this.onFileLoaded(response)
  private onFileLoaded(response: any): void {
    console.log('Loaded RESPONSE: ' + response);
    const decodedFile: ECFile = response;
    console.log(decodedFile);
    this.filetext = JSON.stringify(response);
  }

  public onDeleteFile(index: number): void {
    this.disableAllButton = true;
    this.connector
      .delete(this.data[index], this.securityKey)
      .subscribe((response) => this.onFileDeleted(response, index));
  }
  private onFileDeleted(response: any, index: number): void {
    if (response.status === 0) {
      this.data.splice(index, 1);
    }
    this.disableAllButton = false;
  }

  public onNewFile(): void {
    const newFile = emptyECF;
    newFile.timestamp = Date.now();
    this.filetext = JSON.stringify(newFile);
  }

  public onSaveFile(): void {
    //TODO Private
    try {
      JSON.parse(this.filetext);
    } catch {
      this.errorMessage = 'Invalid JSON Format!';
      return;
    }
    this.connector
      .create('49f8f2a5-e8c2-11ec-b943-0242ac110002', this.filetext, this.securityKey)
      .subscribe((response) => this.onSaveFileFinished(response));
  }
  private onSaveFileFinished(response: any): void {
    console.log('RESPONSE:');
    console.log(response.id);
    // push new file in storageData
  }
}
