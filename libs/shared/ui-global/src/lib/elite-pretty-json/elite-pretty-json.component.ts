import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrettyJsonModule } from 'angular2-prettyjson';

@Component({
  selector: 'global-elite-pretty-json',
  standalone: true,
  imports: [CommonModule, PrettyJsonModule],
  template: `<prettyjson [obj]="json"></prettyjson>`,
  styles: [
    `
      :host ::ng-deep .key {
        color: white !important;
      }
      :host ::ng-deep .string {
        color: #9de04b !important;
      }
      :host ::ng-deep .boolean {
        color: #8adafe !important;
      }
      :host ::ng-deep .number {
        color: #ec7100 !important;
      }
    `,
  ],
})
export class ElitePrettyJsonComponent {
  @Input() json: any;
}
