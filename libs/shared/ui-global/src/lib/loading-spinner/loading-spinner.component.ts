import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EliteLogoComponent } from '../elite-logo/elite-logo.component';

@Component({
  selector: 'global-loading-spinner',
  standalone: true,
  template: `
    <div
      *ngIf="timeOutExpired || showInstantly"
      class="w-32 animate-theChosenOne">
      <global-elite-logo
        [showLogoText]="false"
        presetName="Default"
        [playingAnimation]="false"></global-elite-logo>
    </div>
  `,
  imports: [CommonModule, EliteLogoComponent],
})
export class LoadingSpinnerComponent {
  @Input() showInstantly = false;
  timeOutExpired = false;
  constructor() {
    setTimeout(() => {
      this.timeOutExpired = true;
    }, 300);
  }
}
