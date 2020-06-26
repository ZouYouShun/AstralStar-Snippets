import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'st-setting-checkbox',
  templateUrl: './setting-checkbox.component.html',
  styleUrls: ['./setting-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SettingCheckboxComponent),
      multi: true,
    },
  ],
})
export class SettingCheckboxComponent implements ControlValueAccessor, OnInit {
  @Input() checked = false;
  @Input() disabled: boolean;
  @Input() title = '';

  private onChange = (_: any) => {};
  private onTouched = () => {};

  constructor() {}

  ngOnInit(): void {}

  toggle() {
    this.checked = !this.checked;
    this.onChange(this.checked);
  }

  writeValue(value: boolean) {
    this.checked = value;
  }
  registerOnChange(fn: (value: any) => any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => any) {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}
