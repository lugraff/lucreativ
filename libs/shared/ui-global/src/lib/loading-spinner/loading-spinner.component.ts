import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'global-loading-spinner',
  standalone: true,
  template: `
    <div
      data-cy="loading-spinner"
      *ngIf="timeOutExpired || showInstantly"
      class="w-32 animate-theChosenOne">
      <div></div>
    </div>
  `,
  imports: [CommonModule],
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
