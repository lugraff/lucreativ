import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[link]',
  template: `<div class="group-hover:">
    <ng-content></ng-content>
  </div>`,
})
export class ButtonLinkComponent {
  @HostBinding('class') public class =
    'disabled:grayscale outline-none disabled:pointer-events-none py-1 px-4 group hover:shadow-secondary ring-selection active:bg-textA bg-primary shadow shadow-textB rounded-lg font-semibold text-xl text-textB whitespace-nowrap transition-color';
}
