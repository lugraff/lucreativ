import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'global-card',
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input() public myTitle = '';
}
