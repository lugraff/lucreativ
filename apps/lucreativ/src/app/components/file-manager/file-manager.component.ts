import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectorService } from '@shared/util-global';
import {
  ButtonLinkComponent,
  ButtonStandardComponent,
  InfoPopupComponent,
  InputCheckboxComponent,
  InputStandardComponent,
  ListComponent,
  PopupComponent,
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
    PopupComponent,
  ],
  templateUrl: './file-manager.component.html',
})
export class FileManagerComponent implements OnInit {
  @ViewChild('inputField') inputField!: ElementRef;
  public username = '';
  public password = '';
  public showLogin = false;
  public fileList: string[] = [];
  public securityKey = '';
  public apiKey = '';
  public isPrivate = false;
  public actualFileID = '';
  public fileData: any = undefined;
  public disableAllButton = false;
  public errorMessage = '';
  public apiCounter = 10000;
  public validJSON = false;
  public refreshInputField = false;
  private deepCopy = '';
  private checkTimeout = setTimeout(() => {
    console.log;
  }, 100);

  public objectKeys = Object.keys;
  public objectValues = Object.values;
  public stringify = JSON.stringify;

  private users = [{ name: 'Lucas', fileId: '674f0292242a' }];

  constructor(private connector: ConnectorService) {
    this.setApiCounter(JSON.parse(localStorage.getItem('apiCounter') ?? '9500'));
    this.fileList = JSON.parse(localStorage.getItem('file-list') ?? '[]');
    this.username = localStorage.getItem('user-name') ?? '';
  }

  ngOnInit(): void {
    this.inputField.nativeElement.textContent = '';
  }

  //TODO bei fetch New* Anzeige
  //TODO Better Requst Bar
  //TODO OpenOnlineFileList
  //TODO Blacklist
  //TODO am Anfang leere Zeilen im Editor löschen.

  public onLogin(): void {
    if (this.username.length < 2 || this.password.length < 2) {
      return;
    }
    if (this.apiCounter >= 10000) {
      this.showLogin = false;
      this.errorMessage = 'Sorry, no requests left!';
      return;
    }
    for (let index = 0; index < this.users.length; index++) {
      if (this.users[index].name === this.username) {
        const observer = {
          next: (response: any) => {
            this.apiKey = response.key;
            this.securityKey = this.password;
            localStorage.setItem('user-name', this.username);
            this.showLogin = false;
          },
          error: (error: any) => {
            this.errorMessage = 'Login failed!';
          },
        };
        this.connector.getFile(this.users[index].fileId, this.password).subscribe(observer);
        this.apiCounter += 1;
        return;
      }
    }
    this.errorMessage = 'Sorry, user not found!';
  }
  public onLogout(): void {
    this.securityKey = '';
    this.apiKey = '';
  }

  public onNewFileText(event: Event): void {
    this.checkValidJSON();
  }
  private checkValidJSON(): void {
    clearTimeout(this.checkTimeout);
    this.checkTimeout = setTimeout(() => {
      try {
        JSON.parse(this.inputField.nativeElement.textContent);
        this.validJSON = true;
        return true;
      } catch {
        this.validJSON = false;
        return false;
      }
    }, 400);
  }

  public formatJSON(): void {
    const saveContent = this.inputField.nativeElement.textContent;
    this.fileData = null;
    setTimeout(() => {
      this.fileData = JSON.parse(saveContent);
    });
  }

  public onLoadAllFiles(): void {
    this.disableAllButton = true;
    this.connector.getAll(this.apiKey).subscribe((response) => this.fetchedData(response));
  }
  private fetchedData(newData: any): void {
    this.setApiCounter(Number(newData.headers.get('x-counter')));
    this.fileList = newData.body;
    localStorage.setItem('file-list', JSON.stringify(this.fileList));
    this.disableAllButton = false;
  }
  private setApiCounter(count: number): void {
    this.apiCounter = count;
    localStorage.setItem('apiCounter', JSON.stringify(this.apiCounter));
  }

  public onLoadFile(id: string): void {
    if (this.apiCounter >= 10000) {
      this.errorMessage = 'Sorry, no requests left!';
      return;
    }
    this.actualFileID = id;
    this.refreshInputField = true;
    const observer = {
      next: (response: any) => {
        this.refreshInputField = false;
        this.fileData = response;
        this.deepCopy = JSON.stringify(response);
        this.validJSON = true;
      },
      error: (error: any) => {
        this.refreshInputField = false;
        this.validJSON = false;
        setTimeout(() => {
          this.inputField.nativeElement.textContent = error.error.text;
          this.deepCopy = error.error.text;
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
      this.fileData = null;
      localStorage.setItem('file-list', JSON.stringify(this.fileList));
    }
    this.disableAllButton = false;
  }

  public onCreateFile(): void {
    this.disableAllButton = true;
    console.log(this.isPrivate);
    this.connector
      .create(
        this.apiKey,
        JSON.stringify(this.fileData) ?? this.inputField.nativeElement.textContent,
        this.securityKey,
        this.isPrivate
      )
      .subscribe((response) => this.onSaveFileFinished(response));
    this.apiCounter += 1;
  }
  private onSaveFileFinished(response: any): void {
    this.actualFileID = response.id;
    this.fileList.push(response.id);
    localStorage.setItem('file-list', JSON.stringify(this.fileList));
    this.disableAllButton = false;
  }

  public onUpdateFile(): void {
    if (
      (this.validJSON && this.deepCopy === JSON.stringify(JSON.parse(this.inputField.nativeElement.textContent))) ||
      this.deepCopy === this.inputField.nativeElement.textContent
    ) {
      this.errorMessage = 'No file changes to save!';
      return;
    } else if (this.actualFileID === '') {
      this.errorMessage = 'No file selected!';
      return;
    }
    this.disableAllButton = true;
    const observer = {
      next: (response: any) => {
        try {
          JSON.parse(this.inputField.nativeElement.textContent);
          this.fileData = JSON.parse(this.inputField.nativeElement.textContent);
        } catch {
          this.inputField.nativeElement.textContent = response.data;
        }
        this.disableAllButton = false;
      },
      error: (error: any) => {
        this.errorMessage = error.error.message;
        this.disableAllButton = false;
      },
    };
    this.connector
      .overwrite(this.actualFileID, this.inputField.nativeElement.textContent, this.securityKey)
      .subscribe(observer);
    this.apiCounter += 1;
  }
}
