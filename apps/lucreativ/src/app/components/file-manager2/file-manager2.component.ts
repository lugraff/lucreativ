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
  selector: 'lucreativ-file-manager2',
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
  templateUrl: './file-manager2.component.html',
})
export class FileManager2Component {
  public fileIDlist: string[] = [];
  public securityKey = '';
  public actualFileID = '';
  public actualFileData: ECFile = emptyECF;
  public disableAllButton = false;
  public errorMessage = '';

  public objectKeys = Object.keys;
  public objectValues = Object.values;
  public stringify = JSON.stringify;

  constructor(private connector: ConnectorService) {
    const fileIDlistStorage = JSON.parse(localStorage.getItem('fileIDlist') ?? '[]');
    console.log(fileIDlistStorage);
    if (fileIDlistStorage !== null && fileIDlistStorage !== undefined) {
      this.fileIDlist = fileIDlistStorage;
    } //Nur fetchen wenn keine Änderungen vorhanden sind //Constructor: abbild laden
  } //TODO Fetch -> alle ids laden -> alle files lesen und in localstorage schupfen. -> ECF Files check andere auschließen -> abbild speichern
  // Push -> alle neuen files speichern, alle veränderten files mergen, abbild speichern
  // Veränderte Files highlighten

  private getStorageFiles(): void {
    for (const fileID of this.fileIDlist) {
      const newFile: ECFile = JSON.parse(localStorage.getItem(fileID) ?? '');
      console.log('getStorageFile: ' + JSON.stringify(newFile));
    }
  }

  public onLoadAllFiles(): void {
    this.disableAllButton = true;
    this.connector //TODO key kommt weg!
      .getAll('49f8f2a5-e8c2-11ec-b943-0242ac110002')
      .subscribe((response) => this.fetchedData(response));
  }
  private fetchedData(newData: any): void {
    this.fileIDlist = newData;
    localStorage.setItem('filelist', JSON.stringify(newData));
    this.disableAllButton = false;
  }

  public onLoadFile(id: string): void {
    this.actualFileID = id;
    const observer = {
      next: (response: any) => this.onFileLoaded(response),
      error: (error: any) => (this.errorMessage = error.message),
    };
    this.connector.getFile(id, this.securityKey).subscribe(observer);
  }
  // (response) => this.onFileLoaded(response)
  private onFileLoaded(response: any): void {
    console.log('Loaded RESPONSE: ' + response);
    const decodedFile: ECFile = response;
    console.log(decodedFile);
    this.actualFileData = decodedFile;
  }

  public onDeleteFile(index: number): void {
    this.disableAllButton = true;
    this.connector
      .delete(this.fileIDlist[index], this.securityKey)
      .subscribe((response) => this.onFileDeleted(response, index));
  }
  private onFileDeleted(response: any, index: number): void {
    if (response.status === 0) {
      this.fileIDlist.splice(index, 1);
      this.actualFileID = '';
      this.actualFileData = emptyECF;
      console.log(this.actualFileData.data);
    }
    this.disableAllButton = false;
  }

  public onNewFile(): void {
    this.actualFileID = '';
    const newFile = emptyECF;
    newFile.timestamp = Date.now();
    this.actualFileData = newFile;
  }

  public onSaveFile(): void {
    //TODO Private
    //Check if actualFileID === filetext ID -> ask and merge

    this.connector
      .create('49f8f2a5-e8c2-11ec-b943-0242ac110002', JSON.stringify(this.actualFileData), this.securityKey)
      .subscribe((response) => this.onSaveFileFinished(response));
  }
  private onSaveFileFinished(response: any): void {
    console.log('RESPONSE:');
    console.log(response.id);
    this.actualFileID = response.id;
    this.fileIDlist.push(response.id);
    // push new file in storageData
  }
}
