import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, IconComponent],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[game]',
  template: `<div class="flex justify-center items-center gap-2 overflow-clip">
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
export class ButtonGameComponent {
  private readonly classBase =
    'select-none outline-none whitespace-nowrap disabled:grayscale disabled:pointer-events-none grow';
  @HostBinding('class') public class =
    'active:brightness-125 border-2 bg-warning rounded-full min-w-[2.5rem] min-h-[2.5rem] text-textB text-xl font-semibold' +
    this.classBase;
  @Input() public icon = '';
  @Input() public iconStroke: string | number | undefined = 1.5;
  @Input() public iconSize = '1.5rem';
  @Input() public iconColor = '';
}
