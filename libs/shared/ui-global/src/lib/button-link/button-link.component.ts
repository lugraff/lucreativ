import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, IconComponent],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[link]',
  template: `<div class="flex gap-1 items-center px-1">
    <global-icon [icon]="icon" class=pt-1></global-icon>
    <ng-content></ng-content>
  </div>`,
})
export class ButtonLinkComponent {
  @HostBinding('class') public class =
    'disabled:grayscale outline-none disabled:pointer-events-none px-4 group hover:shadow-secondary ring-selection active:bg-textA bg-primary shadow shadow-textB rounded-md font-semibold text-xl text-textB whitespace-nowrap transition-color';
  @Input() public icon = '';
}
