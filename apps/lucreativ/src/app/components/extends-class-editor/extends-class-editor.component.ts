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
import { ECFile, emptyECF } from '@shared/util-global';

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

  constructor() {
    this.reloadStorage();
  }

  private reloadStorage(): void {
    this.fileIDlist = JSON.parse(localStorage.getItem('fileIDList') ?? '[]');
  }

  public onLoadFile(selectedID: string) {
    this.autoSave();
    this.actualFileID = selectedID;
    this.actualFileData = JSON.parse(localStorage.getItem(selectedID) ?? JSON.stringify(emptyECF));
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
    if (localStorage.getItem(this.actualFileID) !== newData) {
      //TODO OK Box...
      this.actualFileData.edited = Date.now();
      localStorage.setItem(this.actualFileID, JSON.stringify(this.actualFileData));
    }
  }

  public onDeleteFile(index: number) {
    localStorage.removeItem(this.fileIDlist[index]);
    this.fileIDlist.splice(index, 1);
    localStorage.setItem('fileIDList', JSON.stringify(this.fileIDlist));
    this.actualFileID = '';
    this.actualFileData.text = '';
    this.actualFileData = emptyECF;
  }
}
