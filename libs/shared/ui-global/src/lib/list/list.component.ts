import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { ButtonListComponent } from '../button-list/button-list.component';
import { ButtonStandardComponent } from '../button-standard/button-standard.component';

@Component({
  standalone: true,
  imports: [CommonModule, ButtonListComponent, ButtonStandardComponent],
  selector: 'global-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  @Input() public notAvailableText = '-';
  @Input() public height = '25vh';
  @Input() public width = 'fit';
  @Input() public data: string[] = [];
  @Input() public deleteButton = false;
  @Input() public disabledDeleteButtons = false;
  @Output() public selectedOption = new EventEmitter<string>();
  @Output() public deleteOption = new EventEmitter<number>();
  @HostBinding('class') public class = 'flex flex-col p-2 bg-textB rounded-md border-2 border-bgB';

  constructor(private elRef: ElementRef) {}

  ngOnInit(): void {
    this.elRef.nativeElement.style.width = this.width;
    this.elRef.nativeElement.style.height = this.height;
  }

  public emitselectedOption(option: string): void {
    this.selectedOption.emit(option);
  }

  public onDelete(index: number): void {
    this.deleteOption.emit(index);
  }
}
