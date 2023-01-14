import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input } from '@angular/core';
import { StandardIconsComponent } from '../standard-icons/standard-icons.component';

@Component({
  standalone: true,
  imports: [CommonModule, StandardIconsComponent],
  selector: 'global-button-link',
  templateUrl: './button-link.component.html',
})
export class ButtonLinkComponent {
  @Input() public height = 'medium'; // small / medium / large
  @Input() public width = ''; // small / medium / large
  @Input() public icon = '';
  @Input() public ownColor = false;
  @Input() public disabled = false;
  @Input() public activLink = false;

  constructor(elRef: ElementRef) {
    elRef.nativeElement.innerContent = 'HALLO';
  }
}
