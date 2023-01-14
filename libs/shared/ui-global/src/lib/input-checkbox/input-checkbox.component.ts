import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { StandardIconsComponent } from '../standard-icons/standard-icons.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, StandardIconsComponent],
  selector: 'global-input-checkbox',
  templateUrl: './input-checkbox.component.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputCheckboxComponent), multi: true }],
})
export class InputCheckboxComponent implements ControlValueAccessor, OnInit {
  @ViewChild('InputField') inputField!: ElementRef;
  @Input() public elementId: string | null = null;
  @Input() public icon = '';
  @Input() public ownColor = false;
  @Input() public height = 'small'; // small / medium / large
  @Input() public autofocus = false;
  @Input() public checked = false;
  @Output() private inputCheckedChange = new EventEmitter<boolean>();
  private disabled = false;

  public ngOnInit(): void {
    if (this.autofocus) {
      setTimeout(() => {
        this.inputField.nativeElement.focus();
      }, 100);
    }
  }

  public onChange: any = () => {
    this.inputCheckedChange.emit(this.checked);
  };
  public onTouched: any = () => {
    /**/
  };

  public writeValue(obj: any): void {
    this.checked = obj;
  }
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onGetFocus(): void {
    this.inputField?.nativeElement.select();
  }
}
