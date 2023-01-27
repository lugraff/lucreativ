import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonStandardComponent,
  InfoPopupComponent,
  InputCheckboxComponent,
  InputStandardComponent,
  ListComponent,
} from '@shared/ui-global';
import { ConnectorService, ECFile, emptyECF } from '@shared/util-global';
//TODO restliche request anzahl anzeige
@Component({
  selector: 'lucreativ-extends-class-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonStandardComponent,
    InputStandardComponent,
    ListComponent,
    InputCheckboxComponent,
    InfoPopupComponent,
  ],
  templateUrl: './extends-class-editor.component.html',
})
export class ExtendsClassEditorComponent {
  public actualFileData: ECFile = emptyECF;
  public fileIDlist: string[] = [];
  public actualFileID = '';
  public disableAllButton = false;
  public errorMessage = ''; //TODO Show
  private differentiator = 14; // OnlineFile <-> LocalFile
  private fileIDBlackList = ['28f3961ccff3'];

  constructor(private connector: ConnectorService) {
    this.reloadStorage();
  }

  private reloadStorage(): void {
    this.fileIDlist = JSON.parse(localStorage.getItem('fileIDList') ?? '[]');
  }

  public onLoadFile(selectedID: string) {
    this.autoSave();
    this.actualFileID = selectedID;

    if (selectedID.length > this.differentiator || localStorage.getItem(selectedID)) {
      this.actualFileData = JSON.parse(localStorage.getItem(selectedID) ?? JSON.stringify(emptyECF));
    } else {
      this.onFetchFile();
    }
  }

  public onFetchFile(): void {
    this.disableAllButton = true;
    const observer = {
      next: (response: any) => this.onFileFetched(response),
      error: (error: any) => (this.errorMessage = error.message),
    };
    this.connector.getFile(this.actualFileID, '').subscribe(observer); //this.securityKey
  }
  private onFileFetched(response: any): void {
    console.log('Loaded RESPONSE: ' + response);
    const decodedFile: ECFile = response;
    console.log(decodedFile);
    this.actualFileData = decodedFile;
    this.autoSave();
    this.disableAllButton = false;
  }

  public onCreateNewFile() {
    this.autoSave();
    this.actualFileData = emptyECF;
    this.actualFileData.id = Math.floor(Math.random() * 1000000000000000).toString();
    this.actualFileData.created = Date.now();
    this.actualFileData.edited = Date.now();
    this.fileIDlist.push(this.actualFileData.id);
    localStorage.setItem('fileIDList', JSON.stringify(this.fileIDlist));
    localStorage.setItem(this.actualFileData.id, JSON.stringify(this.actualFileData));
    this.actualFileID = this.actualFileData.id;
  }

  private autoSave() {
    //TODO can Deactivate Guard
    if (this.actualFileID === '') {
      return;
    }
    const newData = JSON.stringify(this.actualFileData);
    const spyFile = localStorage.getItem(this.actualFileID);
    if (spyFile !== newData) {
      //TODO OK Box...
      if (spyFile !== null) {
        this.actualFileData.edited = Date.now();
      }
      localStorage.setItem(this.actualFileID, JSON.stringify(this.actualFileData));
    }
  }

  public onDeleteFile(index: number) {
    this.disableAllButton = true;
    if (this.fileIDlist[index].length < this.differentiator) {
      this.connector.delete(this.fileIDlist[index]).subscribe((response) => this.onDeleteLocalFile(response, index));
    } else {
      this.onDeleteLocalFile('local', index);
    }
  }
  private onDeleteLocalFile(response: any, index: number, reset: boolean = true): void {
    if (response === 'local' || response.status === 0) {
      localStorage.removeItem(this.fileIDlist[index]);
      this.fileIDlist.splice(index, 1);
      localStorage.setItem('fileIDList', JSON.stringify(this.fileIDlist));
      if (reset) {
        this.actualFileID = '';
        this.actualFileData = emptyECF;
        this.disableAllButton = false;
        console.log('RESET');
      }
    }
  }

  public onFetchDatabase(): void {
    this.disableAllButton = true;
    this.connector //TODO key kommt weg!
      .getAll('49f8f2a5-e8c2-11ec-b943-0242ac110002')
      .subscribe((response) => this.fetchedData(response));
  }
  private fetchedData(newData: any): void {
    const fetchedFileIDs: string[] = newData;
    for (const fileID of fetchedFileIDs) {
      if (!this.fileIDBlackList.includes(fileID)) {
        if (!this.fileIDlist.includes(fileID)) {
          this.fileIDlist.push(fileID);
        }
      }
    }
    localStorage.setItem('fileIDList', JSON.stringify(this.fileIDlist));
    this.disableAllButton = false;
  }

  public onUpload(): void {
    this.disableAllButton = true;
    if (this.actualFileID.length > this.differentiator) {
      this.autoSave();
      this.connector
        .create('49f8f2a5-e8c2-11ec-b943-0242ac110002', JSON.stringify(this.actualFileData))
        .subscribe((response) => this.onSaveFileFinished(response));
    } else {
      //File Merge
      this.disableAllButton = false;
    }
  }
  private onSaveFileFinished(response: any): void {
    console.log('RESPONSE:');
    console.log(response.id);
    for (let index = 0; index < this.fileIDlist.length; index++) {
      if (this.fileIDlist[index] === this.actualFileID) {
        this.onDeleteLocalFile('local', index, false);
        break;
      }
    }
    this.actualFileID = response.id;
    this.fileIDlist.push(response.id);
    this.actualFileData.id = response.id;
    this.autoSave();
    localStorage.setItem('fileIDList', JSON.stringify(this.fileIDlist));
    this.disableAllButton = false;
  }
}
