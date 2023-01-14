import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'global-standard-icons',
  templateUrl: './standard-icons.component.html',
})
export class StandardIconsComponent {
  @Input() public icon: string | undefined = undefined;
  @Input() public text = '';
  @Input() public ownColor = false;
}
