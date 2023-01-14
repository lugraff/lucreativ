import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonListComponent } from '../button-list/button-list.component';

@Component({
  standalone: true,
  imports: [CommonModule, ButtonListComponent],
  selector: 'global-chombo-box-standard',
  templateUrl: './chombo-box-standard.component.html',
})
export class ChomboBoxStandardComponent {
  @Input() public notAvailableText = '-';
  @Input() public height = 32;
  @Input() public width: string | number = 'fit';
  @Input() public data: string[] = [];
  @Output() private selectedOption = new EventEmitter<string>();
  @Output() private deleteOption = new EventEmitter<number>();

  public emitselectedOption(option: string): void {
    this.selectedOption.emit(option);
  }

  public onDelete(index: number): void {
    this.deleteOption.emit(index);
  }
}
