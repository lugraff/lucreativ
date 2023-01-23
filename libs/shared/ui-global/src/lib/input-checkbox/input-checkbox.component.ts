import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  selector: 'global-input-checkbox',
  templateUrl: './input-checkbox.component.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputCheckboxComponent), multi: true }],
})
export class InputCheckboxComponent implements ControlValueAccessor, OnInit {
  @ViewChild('InputField') inputField!: ElementRef;
  @Input() public icon = '';
  @Input() public iconStroke: string | number | undefined = undefined;
  @Input() public iconSize = '1.5rem';
  @Input() public iconColor = '';
  @Input() public height = 'small'; // small / medium / large
  @Input() public autofocus = false;
  @Input() public checked = false;
  @Input() public disabled = false;
  @Output() public inputCheckedChange = new EventEmitter<boolean>();

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
    console.log('Checkbox Touched');
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
