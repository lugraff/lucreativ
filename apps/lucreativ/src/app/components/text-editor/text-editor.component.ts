import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chapter } from './Chapter';
import { NewFileResponse } from './NewFileResponse';
import { GlobalsService } from './globals.service';
import { JsonAPIService } from './jsonAPI.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lucreativ-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-editor.component.html',
})
export class TexteditorComponent implements OnInit {
  selectedFileNumber = -1;
  selectedChapter = -1;
  book: Chapter[] = [];
  titel = '';
  text = '';
  constructor(private jsonApi: JsonAPIService, public globals: GlobalsService) {}

  ngOnInit(): void {
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'GET',
      '/0da38f98ecd3',
      this.globals.account.groupCode
    );
    result.then((value) => {
      console.log(value);
      if (value.status === 200) {
        this.globals.textEditorUrls = JSON.parse(value.responseText);
      }
    });
  }

  onSelectFile(index: number): void {
    this.selectedFileNumber = index;
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'GET',
      '/' + this.globals.textEditorUrls[index].url,
      this.globals.account.groupCode
    );
    result.then((value) => {
      if (value.status === 200) {
        this.book = JSON.parse(value.responseText);
      } else {
        alert(value.status);
      }
    });
  }

  onSelectChapter(index: number) {
    if (this.selectedChapter >= 0) {
      this.book[this.selectedChapter].text = this.text;
      this.book[this.selectedChapter].titel = this.titel;
    }
    if (index >= 0) {
      this.titel = this.book[index].titel;
      this.text = this.book[index].text;
    }
    this.selectedChapter = index;
  }

  onDeleteChapter(index: number) {
    if (index === this.selectedChapter) {
      this.titel = '';
      this.text = '';
      this.selectedChapter = -1;
    }
    this.book.splice(index, 1);
  }

  onNewChapter() {
    this.book.push({ titel: 'Neu', text: '' });
    this.onSelectChapter(this.book.length);
  }

  onUpdateFile() {
    this.onSelectChapter(-1);
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'PUT',
      '/' + this.globals.textEditorUrls[this.selectedFileNumber].url,
      this.globals.account.groupCode,
      '',
      '',
      '',
      '',
      '',
      '',
      JSON.stringify(this.book)
    );
    result.then((value) => {
      if (value.status === 200) {
        alert('Datei gespeichert.');
      } else if (value.status === 401) {
        alert('Falscher Security Code!');
      } else if (value.status === 429) {
        alert('Abruflimit überschritten!');
      } else if (value.status === 413) {
        alert('Datei zu groß!');
      } else {
        alert(value.status);
      }
    });
  }

  onDeleteFile() {
    if (this.selectedFileNumber < 0) {
      alert('Wähle zuerst eine Datei!');
    }
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'DELETE',
      '/' + this.globals.textEditorUrls[this.selectedFileNumber].url,
      this.globals.account.groupCode
    );
    result.then((value) => {
      if (value.status === 200) {
        setTimeout(() => this.deleteFileURL(), 333);
      } else {
        alert(value.status);
      }
    });
  }
  deleteFileURL() {
    let fileIndex = -1;
    for (let index = 0; index < this.globals.textEditorUrls.length; index++) {
      if (this.globals.textEditorUrls[index].url === this.globals.textEditorUrls[this.selectedFileNumber].url) {
        fileIndex = index;
        break;
      }
    }
    if (fileIndex === -1) {
      alert('Pfad nicht gefunden.');
      return;
    }
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'PATCH',
      '/0da38f98ecd3',
      this.globals.account.groupCode,
      '',
      'json-patch+json',
      'remove',
      '/',
      fileIndex.toString()
    );
    result.then((value) => {
      if (value.status === 200) {
        this.globals.textEditorUrls.splice(this.selectedFileNumber, 1);
        this.selectedFileNumber = -1;
        this.text = '';
        this.titel = '';
        alert('Datei gelöscht.');
      } else {
        alert(value.status);
      }
    });
  }

  onNewFile() {
    if (this.titel === '') {
      alert('Wähle einen Dateinamen im Titel-Eingabefeld.');
      return;
    }
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'POST',
      '',
      this.globals.account.groupCode,
      this.globals.account.mainCode,
      '',
      '',
      '',
      '',
      'true',
      JSON.stringify([])
    );
    result.then((value) => {
      if (value.status === 201) {
        const responseObj: NewFileResponse = JSON.parse(value.responseText);
        this.globals.textEditorUrls.push({
          name: this.titel,
          url: responseObj.id,
        });
        this.selectedFileNumber = this.globals.textEditorUrls.length - 1;
        setTimeout(() => this.addFileUrl(), 333);
      } else {
        alert(value.status);
      }
    });
  }
  addFileUrl() {
    this.titel = '';
    const result: Promise<XMLHttpRequest> = this.jsonApi.newRequest(
      'PUT',
      '/0da38f98ecd3',
      this.globals.account.groupCode,
      '',
      '',
      '',
      '',
      '',
      '',
      JSON.stringify(this.globals.textEditorUrls)
    );
    result.then((value) => {
      if (value.status === 200) {
        alert('Neue Datei erstellt.');
      } else if (value.status === 401) {
        alert('Falscher Security Code!');
      } else if (value.status === 429) {
        alert('Abruflimit überschritten!');
      } else if (value.status === 413) {
        alert('Datei zu groß!');
      } else {
        alert(value.status);
      }
    });
  }
}
