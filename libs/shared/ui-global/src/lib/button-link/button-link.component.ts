import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, IconComponent],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[link]',
  template: `<div
    class="flex items-center gap-2 pl-2"
    [ngClass]="activeButton ? 'underline' : 'text-textB'">
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
export class ButtonLinkComponent {
  @HostBinding('class') public class =
    'touch-none select-none disabled:grayscale outline-none disabled:pointer-events-none pr-2 group hover:shadow-selection hover:scale-125 transition-all ring-selection active:bg-textA bg-primary shadow shadow-transparent rounded-full font-semibold text-xl text-textB whitespace-nowrap border-b-2 border-bgB';
  @Input() public activeButton = false;
  @Input() public icon = '';
  @Input() public iconStroke: string | number | undefined = 1.5;
  @Input() public iconSize = '1.5rem';
  @Input() public iconColor = '';
}
