import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GlobalUISettingsService } from '@shared/util-settings';
import { StandardIconsComponent } from '../standard-icons/standard-icons.component';

@Component({
  standalone: true,
  imports: [CommonModule, StandardIconsComponent],
  selector: 'global-notification-card',
  templateUrl: './notification-card.component.html',
})
export class NotificationCardComponent {
  @Input() public icon = '';
  @Input() public ownColor = false;
  @Input() public animate = false;

  constructor(public globalUISettings: GlobalUISettingsService) {}
}
