import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { StandardIconsComponent } from '../standard-icons/standard-icons.component';

@Component({
  standalone: true,
  imports: [CommonModule, StandardIconsComponent],
  selector: 'global-button-standard',
  templateUrl: './button-standard.component.html',
})
export class ButtonStandardComponent implements OnInit {
  @ViewChild('StandardButton') standardButton!: ElementRef;
  @Input() public height = 'small'; // small / medium / large
  @Input() public width = ''; // small / medium / large
  @Input() public icon = '';
  @Input() public ownColor = false;
  @Input() public autofocus = false;
  @Input() public disabled = false;

  public ngOnInit(): void {
    if (this.autofocus) {
      setTimeout(() => {
        this.standardButton.nativeElement.focus();
      }, 100);
    }
  }
}
