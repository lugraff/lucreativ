import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonStandardComponent,
  IconComponent,
  InfoPopupComponent,
  InputCheckboxComponent,
  InputStandardComponent,
  ListComponent,
  PopupComponent,
} from '@shared/ui-global';
import {
  CanComponentDeactivate,
  ConnectorService,
  ECFile,
  ECLocalFile,
  ECOnlineFile,
  emptyECF,
} from '@shared/util-global';
import { Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
// TODO Wenn security key kann nur der ihn kennt online löschen. sonst alle
// TODO wenn nur noch 500 requests -> nur noch lesen dürfen
// TODO API KEY -> security key read spezial idFile give api key
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
    IconComponent,
    PopupComponent,
  ],
  templateUrl: './extends-class-editor.component.html',
})
export class ExtendsClassEditorComponent implements CanComponentDeactivate {
  public localECFList: ECLocalFile[] = [];
  public onlineECFList: ECOnlineFile[] = [];
  public actualFileData: ECFile = emptyECF;
  public actualFileDataReflection: ECFile = emptyECF;
  public fileIDlist: string[] = [];
  public actualFileID = '';
  public disableAllButton = false;
  public errorMessage = ''; //TODO Show
  public apiCounter = 10000;
  public securityKey = '';
  public showSavePopup = false;
  public showSavePopupBeforeNav = false;
  public differentiator = 13; // OnlineFile <-> LocalFile
  private onlineECFListID = '43a6db6c6f07';
  private fileIDBlackList = ['28f3961ccff3', this.onlineECFListID];
  private desiredRoute = '';

  constructor(private connector: ConnectorService, private router: Router) {
    this.apiCounter = JSON.parse(localStorage.getItem('apiCounter') ?? '10000');
    this.reloadStorage();
  }

  public myCanDeactivate(nextState: RouterStateSnapshot | undefined): boolean | Observable<boolean> | Promise<boolean> {
    console.log(this.actualFileDataReflection);
    console.log(this.actualFileData);
    if (
      this.actualFileID.length > this.differentiator &&
      JSON.stringify(this.actualFileDataReflection) !== JSON.stringify(this.actualFileData)
    ) {
      console.log('STOP');
      // 'Aktuelle Änderungen der Prüfungszeiten wurden noch nicht übernommen. Wollen Sie die Änderungen verwerfen?';
      if (nextState !== undefined) {
        this.desiredRoute = nextState.url;
        this.showSavePopupBeforeNav = true;
      }
      return false;
    }
    return true;
  }
  public ChangeRoute(saveFile: boolean): void {
    if (saveFile) {
      this.autoSave();
    } else {
      this.actualFileDataReflection = this.actualFileData;
    }
    this.showSavePopupBeforeNav = false;
    this.router.navigate([this.desiredRoute]);
  }

  private reloadStorage(): void {
    this.localECFList = [];
    this.fileIDlist = JSON.parse(localStorage.getItem('fileIDList') ?? '[]');
    this.onlineECFList = JSON.parse(localStorage.getItem('fileCompleteList') ?? '[]');
    for (const fileID of this.fileIDlist) {
      if (fileID.length > this.differentiator) {
        let pushIt = true;
        for (const localFile of this.localECFList) {
          if (localFile.id === fileID) {
            pushIt = false;
          }
        }
        if (pushIt) {
          const localFile: ECFile = JSON.parse(localStorage.getItem(fileID) ?? '');
          if (localFile) {
            this.localECFList.push({
              id: localFile.id,
              category: localFile.category,
              name: localFile.name,
              created: localFile.created,
              edited: localFile.edited,
            });
          }
        }
      }
    }
  }

  public onLoadFile(selectedID: string) {
    this.autoSave();
    this.reloadStorage();
    this.actualFileID = selectedID;
    if (selectedID.length > this.differentiator || localStorage.getItem(selectedID)) {
      this.actualFileData = JSON.parse(localStorage.getItem(selectedID) ?? JSON.stringify(emptyECF));
      this.actualFileDataReflection = JSON.parse(JSON.stringify(this.actualFileData));
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
    this.apiCounter += 1;
    const decodedFile: ECFile = response;
    this.actualFileData = decodedFile;
    this.autoSave();
    this.disableAllButton = false;
  }

  public onCreateNewFile(): void {
    this.autoSave();
    this.actualFileData = emptyECF;
    while (this.actualFileData.id.length <= this.differentiator) {
      this.actualFileData.id = Math.floor(Math.random() * 1000000000000000).toString();
    }
    this.actualFileData.created = Date.now();
    this.actualFileData.edited = Date.now();
    this.fileIDlist.push(this.actualFileData.id);
    localStorage.setItem('fileIDList', JSON.stringify(this.fileIDlist));
    localStorage.setItem(this.actualFileData.id, JSON.stringify(this.actualFileData));
    this.actualFileID = this.actualFileData.id;
    this.actualFileDataReflection = JSON.parse(JSON.stringify(this.actualFileData));
  }

  public autoSave(): void {
    if (this.actualFileID === '') {
      return;
    }
    const newData = JSON.stringify(this.actualFileData);
    const spyFile = localStorage.getItem(this.actualFileID);
    if (spyFile !== newData) {
      if (spyFile !== null) {
        this.actualFileData.edited = Date.now();
      }
      this.showSavePopup = true;
    }
  }
  public doAutoSave(): void {
    localStorage.setItem(this.actualFileID, JSON.stringify(this.actualFileData));
    this.actualFileDataReflection = JSON.parse(JSON.stringify(this.actualFileData));
    this.showSavePopup = false;
  }

  public onDeleteFile(index: number): void {
    this.disableAllButton = true;
    if (this.fileIDlist[index].length < this.differentiator) {
      for (let i = 0; i < this.onlineECFList.length; i++) {
        if (this.onlineECFList[i].id === this.fileIDlist[index]) {
          this.onlineECFList.splice(i, 1);
          localStorage.setItem('fileCompleteList', JSON.stringify(this.onlineECFList));
          this.connector
            .patch(this.onlineECFListID, 'remove', '/', i.toString())
            .subscribe((response) => this.onRemovedFromOnlineECFListID(response));
          break;
        }
      }
      this.connector.delete(this.fileIDlist[index]).subscribe((response) => this.onDeleteLocalFile(response, index));
    } else {
      this.onDeleteLocalFile('local', index);
    }
  }
  private onRemovedFromOnlineECFListID(response: any): void {
    this.apiCounter += 1;
    this.reloadStorage();
  }
  private onDeleteLocalFile(response: any, index: number, reset: boolean = true): void {
    if (response === 'local' || response.status === 0) {
      if (response.status === 0) {
        this.apiCounter += 1;
      }
      localStorage.removeItem(this.fileIDlist[index]);
      this.fileIDlist.splice(index, 1);
      localStorage.setItem('fileIDList', JSON.stringify(this.fileIDlist));
      if (reset) {
        this.actualFileID = '';
        this.actualFileData.id = '';
        this.actualFileData.text = '';
        this.actualFileData.name = '';
        this.actualFileData.data = undefined;
        this.actualFileData.category = '';
        this.actualFileData.created = 0;
        this.actualFileData.edited = 0;
        this.reloadStorage();
        this.disableAllButton = false;
      }
    }
  }

  public onFetchDatabase(): void {
    this.disableAllButton = true;
    this.connector //TODO key kommt weg!
      .getAll('api-key')
      .subscribe((response) => this.fetchedData(response));
  }
  private fetchedData(newData: any): void {
    this.apiCounter = Number(newData.headers.get('x-counter'));
    localStorage.setItem('apiCounter', JSON.stringify(this.apiCounter));
    const fetchedFileIDs: string[] = newData.body;
    for (const fileID of fetchedFileIDs) {
      if (!this.fileIDBlackList.includes(fileID)) {
        if (!this.fileIDlist.includes(fileID)) {
          this.fileIDlist.push(fileID);
        }
      }
    }
    localStorage.setItem('fileIDList', JSON.stringify(this.fileIDlist));
    this.disableAllButton = false;
    this.fetchOnlineECFileList();
  }

  private fetchOnlineECFileList(): void {
    this.disableAllButton = true;
    const observer = {
      next: (response: any) => this.onOnlineFileListFetched(response),
      error: (error: any) => (this.errorMessage = error.message),
    };
    this.connector.getFile(this.onlineECFListID, '').subscribe(observer); //this.securityKey
  }
  private onOnlineFileListFetched(response: any): void {
    this.apiCounter += 1;
    const decodedList: ECOnlineFile[] = response;
    this.onlineECFList = decodedList;
    localStorage.setItem('fileCompleteList', JSON.stringify(decodedList));
    this.disableAllButton = false;
  }

  public onUpload(): void {
    this.fetchOnlineECFileList();
    this.disableAllButton = true;
    if (this.actualFileID.length > this.differentiator) {
      this.autoSave();
      this.connector
        .create('api-key', JSON.stringify(this.actualFileData))
        .subscribe((response) => this.onSaveFileFinished(response));
    } else {
      //File Merge
      this.disableAllButton = false;
    }
  }
  private onSaveFileFinished(response: any): void {
    this.apiCounter += 1;
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
    this.pushToOnlineECFList();
  }
  private pushToOnlineECFList(): void {
    const newECOnlineFile: ECOnlineFile = {
      id: this.actualFileID,
      category: this.actualFileData.category,
      name: this.actualFileData.name,
      uploaded: Date.now(),
    };
    this.onlineECFList.push(newECOnlineFile);
    localStorage.setItem('fileCompleteList', JSON.stringify(this.onlineECFList));
    this.connector
      .overwrite(this.onlineECFListID, JSON.stringify(this.onlineECFList))
      .subscribe((response) => this.onModifiedOnlineECFListFinished(response));
  }
  private onModifiedOnlineECFListFinished(response: any): void {
    this.apiCounter += 1;
    this.reloadStorage();
    this.disableAllButton = false;
  }
}
