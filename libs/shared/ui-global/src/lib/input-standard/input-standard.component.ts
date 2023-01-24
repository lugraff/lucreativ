import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  selector: 'global-input-standard',
  templateUrl: './input-standard.component.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputStandardComponent), multi: true }],
})
export class InputStandardComponent implements ControlValueAccessor, OnInit {
  @ViewChild('InputField') inputField!: ElementRef;
  @Input() public inputType = 'text';
  @Input() public inputText = '';
  @Input() public icon = '';
  @Input() public iconStroke: string | number | undefined = undefined;
  @Input() public iconSize = '1.5rem';
  @Input() public iconColor = '';
  @Input() public placeholderText = '';
  @Input() public selectAllOnFocus = false;
  @Input() public maxLength = -1;
  @Input() public readonly = false;
  @Input() public autofocus = false;
  @Input() public disabled = false;
  @Output() public inputTextOutput = new EventEmitter<string>();
  @Output() public inputTextChange = new EventEmitter<string>();
  private availablyTypes = [
    'text',
    'password',
    'email',
    'number',
    'tel',
    'url',
    'search',
    'time',
    'date',
    'week',
    'month',
    'datetime-local',
  ];

  public ngOnInit(): void {
    if (!this.availablyTypes.includes(this.inputType)) {
      this.inputType = 'text';
    }
    if (this.autofocus) {
      setTimeout(() => {
        this.inputField.nativeElement.focus();
      }, 100);
    }
  }

  public onChange: any = () => {
    this.inputTextChange.emit(this.inputText);
  };
  public onTouched: any = () => {
    /**/
  };

  public emitInputText(): void {
    this.inputTextOutput.emit(this.inputText);
  }

  public writeValue(obj: any): void {
    this.inputText = obj;
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

  public clearInput(): void {
    this.inputText = '';
  }

  public onGetFocus(): void {
    if (this.selectAllOnFocus) {
      this.inputField?.nativeElement.select();
    }
  }
}
