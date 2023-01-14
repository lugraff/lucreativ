import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SearchElement } from '@shared/util-global';
import { fuzzySearchElements } from '@shared/util-strings';
import { ButtonListComponent } from '../button-list/button-list.component';
import { InputStandardComponent } from '../input-standard/input-standard.component';

@Component({
  standalone: true,
  imports: [CommonModule, InputStandardComponent, ButtonListComponent],
  selector: 'global-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements AfterViewInit {
  @Input() public searchStrings: SearchElement[] = [];
  @Output() private closeSearch = new EventEmitter();
  public searchResults: SearchElement[] = [];
  private searchTimeout = setTimeout(() => {
    console.log;
  }, 100);
  public lastNeedles = '';
  public activeElement = 0;

  @HostListener('window:keydown', ['$event'])
  keyEvent(keyEvent: KeyboardEvent): void {
    if (keyEvent.key === 'ArrowUp' && this.activeElement > 0) {
      this.activeElement--;
    }
    if (keyEvent.key === 'ArrowDown' && this.activeElement < this.searchResults.length - 1) {
      this.activeElement++;
    }
    if (keyEvent.key === 'Enter' && this.searchResults.length > 0) {
      this.onSearchEnter(
        this.searchResults[this.activeElement].meta[1],
        this.searchResults[this.activeElement].meta[2]
      );
    }
    // else if (keyEvent.key === 'Escape') {
    //   const searchFieldInputElement = document.getElementById('searchField');
    //   if (searchFieldInputElement !== null) {
    //     if (document.activeElement === searchFieldInputElement) {
    //       this.onClose();
    //     }
    //     searchFieldInputElement.focus();
    //   }
    // }
  }

  constructor(public router: Router) {}

  public ngAfterViewInit(): void {
    const searchFieldInputElement = document.getElementById('searchField');
    if (searchFieldInputElement !== null) {
      searchFieldInputElement.focus();
      searchFieldInputElement.addEventListener('keydown', function (keyEvent) {
        if (keyEvent.key === 'ArrowUp' || keyEvent.key === 'ArrowDown') {
          keyEvent.preventDefault();
        }
      });
    }
  }

  public onSearchEnter(route: string, fetchurl: string): void {
    this.router.navigate([route, fetchurl]);
    this.searchResults = [];
    this.closeSearch.emit();
  }

  public onSearching(needles: string): void {
    clearTimeout(this.searchTimeout);

    if (needles.length < 1) {
      this.searchResults = [];
      this.lastNeedles = '';
      return;
    }
    this.searchTimeout = setTimeout(() => {
      this.searchResults = [];
      this.activeElement = 0;
      this.lastNeedles = needles;
      this.searchResults = fuzzySearchElements(needles, this.searchStrings);
    }, 200);
  }

  public onClose(): void {
    this.closeSearch.emit();
  }
}
