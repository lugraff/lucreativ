import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, IconComponent],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[standard]',
  template: `<div class="flex items-center gap-2 pl-1 overflow-clip">
    <global-icon
      *ngIf="icon.length"
      [icon]="icon"
      [strokeWidth]="iconStroke"
      [size]="iconSize"
      [color]="iconColor">
    </global-icon>
    <ng-content></ng-content>
  </div>`,
})
export class ButtonStandardComponent {
  private readonly classBase =
    ' group outline-none whitespace-nowrap disabled:grayscale disabled:pointer-events-none pr-1 grow';
  @HostBinding('class') public class =
    'active:brightness-75 hover:brightness-125 border from-bgB to-selection bg-gradient-to-tl rounded-sm text-textB text-xl font-normal' +
    this.classBase;
  @Input() public icon = '';
  @Input() public iconStroke: string | number | undefined = 1.5;
  @Input() public iconSize = '1.5rem';
  @Input() public iconColor = '';
}
