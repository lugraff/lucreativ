import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectorService, ECFile, emptyECF } from '@shared/util-global';
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
  public fileList: string[] = [];
  public securityKey = '';
  public actualFileID = '';
  public fileText = '';
  public disableAllButton = false;
  public errorMessage = '';
  public apiCounter = 10000;

  public objectKeys = Object.keys;
  public objectValues = Object.values;
  public stringify = JSON.stringify;

  constructor(private connector: ConnectorService) {
    this.apiCounter = JSON.parse(localStorage.getItem('apiCounter') ?? '10000');
    this.fileList = JSON.parse(localStorage.getItem('file-manager-file-list') ?? '[]');
  }
  //TODO bei fetch New* Anzeige
  public onLoadAllFiles(): void {
    this.disableAllButton = true;
    this.connector //TODO key kommt weg!
      .getAll('49f8f2a5-e8c2-11ec-b943-0242ac110002')
      .subscribe((response) => this.fetchedData(response));
  }
  private fetchedData(newData: any): void {
    this.setApiCounter(Number(newData.headers.get('x-counter')));
    this.fileList = newData.body;
    localStorage.setItem('file-manager-file-list', JSON.stringify(this.fileList));
    this.disableAllButton = false;
  }
  private setApiCounter(count: number): void {
    this.apiCounter = count;
    localStorage.setItem('apiCounter', JSON.stringify(this.apiCounter));
  }

  public onLoadFile(id: string): void {
    this.actualFileID = id;
    const observer = {
      next: (response: any) => this.onFileLoaded(response),
      error: (error: any) => {
        this.errorMessage = error.message;
        console.log(error);
      },
    };
    this.connector.getFile(id, this.securityKey).subscribe(observer);
  }
  private onFileLoaded(response: any): void {
    console.log(response);
    this.fileText = JSON.stringify(response);
  }

  public onDeleteFile(index: number): void {
    this.disableAllButton = true;
    const observer = {
      next: (response: any) => this.onFileDeleted(response, index),
      error: (error: any) => {
        this.errorMessage = error.error.message;
        this.disableAllButton = false;
      },
    };
    this.connector.delete(this.fileList[index], this.securityKey).subscribe(observer);
  }
  private onFileDeleted(response: any, index: number): void {
    if (response.status === 0) {
      this.fileList.splice(index, 1);
      this.actualFileID = '';
      this.fileText = '';
      localStorage.setItem('file-manager-file-list', JSON.stringify(this.fileList));
    }
    this.disableAllButton = false;
  }

  public onSaveFile(): void {
    this.disableAllButton = true;
    //TODO Private
    //TODO Checken ob file JSON valid ist!
    //Check if actualFileID === filetext ID -> ask and merge
    this.connector
      .create('49f8f2a5-e8c2-11ec-b943-0242ac110002', this.fileText, this.securityKey)
      .subscribe((response) => this.onSaveFileFinished(response));
  }
  private onSaveFileFinished(response: any): void {
    this.actualFileID = response.id;
    this.fileList.push(response.id);
    localStorage.setItem('file-manager-file-list', JSON.stringify(this.fileList));
    this.disableAllButton = false;
  }

  public onUpdateFile(): void {
    this.disableAllButton = true;
    const observer = {
      next: (response: any) => this.onUpdateFileFinished(response),
      error: (error: any) => {
        this.errorMessage = error.error.message;
        this.disableAllButton = false;
      },
    };
    this.connector.overwrite(this.actualFileID, this.fileText, this.securityKey).subscribe(observer);
  }
  private onUpdateFileFinished(response: any): void {
    this.disableAllButton = false;
  }
}
