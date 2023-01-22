import { Injectable } from '@angular/core';
import { Account } from './Account';
import { EnterUrls } from './EnterUrls';
import { TextEditorUrl } from './TextEditorUrl';

@Injectable({
  providedIn: 'root',
})
export class GlobalsService {
  namesUrl = '7e3276241191'; //irgendwo speichern wo nicht neu gebuilded erden muss... GitHub?
  account: Account = { name: '', mainCode: '', groupCode: '' };
  fileURLs: string[] = [];
  nameEnterUrls: EnterUrls = { enterUrls: [] };
  forumUrl = '';
  textEditorUrls: TextEditorUrl[] = [];

  onLogOut() {
    localStorage.clear();
    this.account.mainCode = '';
    this.account.name = '';
    this.fileURLs = [];
    this.nameEnterUrls = { enterUrls: [] };
    this.forumUrl = '';
  }
}
