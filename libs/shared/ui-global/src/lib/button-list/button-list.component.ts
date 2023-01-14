import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { StandardIconsComponent } from '../standard-icons/standard-icons.component';

@Component({
  standalone: true,
  imports: [CommonModule, StandardIconsComponent],
  selector: 'global-button-list',
  templateUrl: './button-list.component.html',
})
export class ButtonListComponent {
  @Input() public height = 'small';
  @Input() public width = '';
  @Input() public icon = '';
  @Input() public ownColor = false;
  @Input() public disabled = false;
  @Input() public activeLink = false;
}
