import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, IconComponent],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[list]',
  template: `<div class="flex gap-1 items-center">
    <global-icon
      [icon]="icon"
      strokeWidth="1.2"></global-icon>
    <ng-content></ng-content>
  </div>`,
})
export class ButtonListComponent {
  private readonly classBase =
    ' group outline-none whitespace-nowrap disabled:grayscale disabled:pointer-events-none transition-all px-1';
  @HostBinding('class') public class =
    'active:brightness-75 hover:border-primary hover:text-textA hover:from-bgB to-transparent bg-gradient-to-r border-y-2 border-transparent rounded-full text-tertiary text-xl font-normal' +
    this.classBase;
  @Input() public icon = '';
}
