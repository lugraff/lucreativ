import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectorService } from '@shared/util-global';
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
  templateUrl: './json-file-manager.component.html',
})
export class JSONFileManagerComponent {
  @ViewChild('inputField') inputField2!: ElementRef;
  public fileList: string[] = [];
  public securityKey = '';
  public actualFileID = '';
  public fileData: any = undefined;
  public disableAllButton = false;
  public errorMessage = '';
  public apiCounter = 10000;
  public validJSON = false;
  public refreshInputField = false;
  private checkTimeout = setTimeout(() => {
    console.log;
  }, 100);

  public objectKeys = Object.keys;
  public objectValues = Object.values;
  public stringify = JSON.stringify;

  constructor(private connector: ConnectorService) {
    this.apiCounter = JSON.parse(localStorage.getItem('apiCounter') ?? '10000');
    this.fileList = JSON.parse(localStorage.getItem('file-manager-file-list') ?? '[]');
  }

  //TODO bei fetch New* Anzeige
  //TODO JSON Format Button
  //TODO Login und API Key raus!

  public onNewFileText(event: Event): void {
    this.checkValidJSON();
  }
  private checkValidJSON(): void {
    clearTimeout(this.checkTimeout);
    this.checkTimeout = setTimeout(() => {
      try {
        JSON.parse(this.inputField2.nativeElement.textContent);
        this.validJSON = true;
        return true;
      } catch {
        this.validJSON = false;
        return false;
      }
    }, 400);
  }

  public onLoadAllFiles(): void {
    this.disableAllButton = true;
    this.connector.getAll('49f8f2a5-e8c2-11ec-b943-0242ac110002').subscribe((response) => this.fetchedData(response));
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
    this.refreshInputField = true;
    const observer = {
      next: (response: any) => {
        this.refreshInputField = false;
        this.fileData = response;
        this.validJSON = true;
      },
      error: (error: any) => {
        this.refreshInputField = false;
        this.validJSON = false;
        setTimeout(() => {
          this.inputField2.nativeElement.textContent = error.error.text;
        }, 0);
      },
    };
    this.connector.getFile(id, this.securityKey).subscribe(observer);
    this.apiCounter += 1;
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
    this.apiCounter += 1;
  }
  private onFileDeleted(response: any, index: number): void {
    if (response.status === 0) {
      this.fileList.splice(index, 1);
      this.actualFileID = '';
      this.fileData = undefined;
      localStorage.setItem('file-manager-file-list', JSON.stringify(this.fileList));
    }
    this.disableAllButton = false;
  }

  public onSaveFile(): void {
    this.disableAllButton = true;
    //TODO Private
    this.connector
      .create(
        '49f8f2a5-e8c2-11ec-b943-0242ac110002',
        JSON.stringify(this.fileData) ?? this.inputField2.nativeElement.textContent,
        this.securityKey
      )
      .subscribe((response) => this.onSaveFileFinished(response));
    this.apiCounter += 1;
  }
  private onSaveFileFinished(response: any): void {
    this.actualFileID = response.id;
    this.fileList.push(response.id);
    localStorage.setItem('file-manager-file-list', JSON.stringify(this.fileList));
    this.disableAllButton = false;
  }

  public onUpdateFile(): void {
    //TODO Checken ob sich file inhaltlich verädert hat -> speichern oder abbrechen
    this.disableAllButton = true;
    const observer = {
      next: (response: any) => {
        try {
          JSON.parse(this.inputField2.nativeElement.textContent);
          this.fileData = JSON.parse(this.inputField2.nativeElement.textContent);
        } catch {
          this.inputField2.nativeElement.textContent = response.data;
        }
        this.disableAllButton = false;
      },
      error: (error: any) => {
        this.errorMessage = error.error.message;
        this.disableAllButton = false;
      },
    };
    this.connector
      .overwrite(this.actualFileID, this.inputField2.nativeElement.textContent, this.securityKey)
      .subscribe(observer);
    this.apiCounter += 1;
  }
}