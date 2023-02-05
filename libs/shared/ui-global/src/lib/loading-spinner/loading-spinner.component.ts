import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'global-loading-spinner',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div
      *ngIf="timeOutExpired || showInstantly"
      class="fixed top-1/2 left-1/2 animate-theChosenOne opacity-80">
      <div class="fixed left-1/2 top-1/2 origin-top-left animate-spin">
        <global-icon
          icon="featherCodesandbox"
          color="textA"
          stroke="1"
          size="5vh">
        </global-icon>
      </div><div class="fixed left-1/2 top-1/2 origin-top-right animate-spin">
        <global-icon
          icon="featherCodesandbox"
          color="textA"
          stroke="1"
          size="5vh">
        </global-icon>
      </div>
      <div class="fixed left-1/2 top-1/2 origin-bottom-right animate-spin">
        <global-icon
          icon="featherCodesandbox"
          color="textA"
          stroke="1"
          size="5vh">
        </global-icon>
      </div>
      <div class="fixed left-1/2 top-1/2 origin-bottom-left animate-spin">
        <global-icon
          icon="featherCodesandbox"
          color="textA"
          stroke="1"
          size="5vh">
        </global-icon>
      </div>
      
    </div>
  `,
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
