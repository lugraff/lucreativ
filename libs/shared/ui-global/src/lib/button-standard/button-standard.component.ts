import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, IconComponent],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[standard]',
  template: `<div class="flex gap-1 items-center">
    <global-icon
      [icon]="icon"
      strokeWidth="1.2"></global-icon>
    <ng-content></ng-content>
  </div>`,
})
export class ButtonStandardComponent {
  private readonly classBase =
    ' group outline-none whitespace-nowrap disabled:grayscale disabled:pointer-events-none transition-all px-1';
  @HostBinding('class') public class =
    'active:brightness-75 hover:brightness-125 border from-bgB to-selection bg-gradient-to-tl rounded-sm text-textB text-xl font-normal' +
    this.classBase;
  @Input() public icon = '';
}
