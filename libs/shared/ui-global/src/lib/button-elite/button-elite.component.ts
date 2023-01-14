import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[elite]',
  template: `<div class="group-hover:-skew-x-[20deg]">
    <ng-content></ng-content>
  </div>`,
})
export class ButtonEliteComponent {
  @HostBinding('class') public class =
    'disabled:grayscale disabled:pointer-events-none py-2 px-8 group hover:skew-x-[20deg] active:bg-textA bg-primary border border-textB rounded-lg font-semibold text-xl text-textB whitespace-nowrap transition-color';
}
