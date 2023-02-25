import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, IconComponent],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[list]',
  template: `<div
    class="flex gap-1 items-center"
    [ngClass]="selected ? 'text-primary underline underline-offset-4' : ''">
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
export class ButtonListComponent {
  private readonly classBase =
    'touch-none select-none group outline-none whitespace-nowrap disabled:grayscale disabled:pointer-events-none transition-all px-1';
  @HostBinding('class') public class =
    'active:brightness-75 hover:border-primary hover:text-textA border-y-2 border-transparent rounded-full text-tertiary text-xl font-normal' +
    this.classBase;
  @Input() public activeButton = false;
  @Input() public icon = '';
  @Input() public iconStroke: string | number | undefined = 1.5;
  @Input() public iconSize = '1.5rem';
  @Input() public iconColor = '';
  @Input() public selected = false;
}
