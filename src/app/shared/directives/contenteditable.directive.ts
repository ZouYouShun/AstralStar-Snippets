import { DOCUMENT } from '@angular/common';
import {
  Attribute,
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Inject,
  Input,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[contenteditable]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContenteditableDirective),
      multi: true,
    },
  ],
})
export class ContenteditableDirective
  implements ControlValueAccessor, AfterViewInit {
  @Input() propValueAccessor = 'textContent';
  @Input() autofocus = false;

  @Input()
  get contenteditable() {
    return this._contenteditable;
  }
  set contenteditable(value) {
    if (value !== false) {
      this.renderer.addClass(this.elementRef.nativeElement, this.editableClass);
    } else {
      this.renderer.removeClass(
        this.elementRef.nativeElement,
        this.editableClass
      );
    }
    this._contenteditable = value;
  }

  @Input() editableClass = 'editable';
  @Input() focusClass = 'focus';

  private _contenteditable = false;
  private onChange: (value: string) => void;
  private onTouched: () => void;
  private removeDisabledState: () => void;

  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    @Attribute('type') private type: string
  ) {}

  ngAfterViewInit(): void {
    if (this.autofocus !== false) {
      this.elementRef.nativeElement.focus();
    }
  }

  @HostListener('input')
  callOnChange(): void {
    if (typeof this.onChange === 'function') {
      let outputValue = this.elementRef.nativeElement[this.propValueAccessor];
      if (this.type !== 'textarea') {
        outputValue = this.elementRef.nativeElement[
          this.propValueAccessor
        ] = outputValue.replace(/\r*\n/gm, '');
        this.setEndOfContentEditable();
      }

      switch (this.type) {
        case 'number':
          const numbers = (outputValue as string).match(/\d+/);
          if (numbers && numbers.length > 0) {
            outputValue = this.elementRef.nativeElement[
              this.propValueAccessor
            ] = outputValue.match(/\d+/)[0];
            this.setEndOfContentEditable();
            outputValue = +outputValue;
          } else {
            outputValue = this.elementRef.nativeElement[
              this.propValueAccessor
            ] = null;
            outputValue = null;
          }
          break;
        case 'text':
          break;
        default:
          break;
      }
      this.onChange(outputValue);
    }
  }

  @HostListener('focus')
  callOnFocus(): void {
    this.renderer.addClass(this.elementRef.nativeElement, this.focusClass);
  }

  @HostListener('blur')
  callOnTouched(): void {
    if (typeof this.onTouched === 'function') {
      this.onTouched();
    }
    this.renderer.removeClass(this.elementRef.nativeElement, this.focusClass);
  }

  /**
   * Writes a new value to the element.
   * This method will be called by the forms API to write
   * to the view when programmatic (model -> view) changes are requested.
   *
   * See: [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor#members)
   */
  writeValue(value: any): void {
    const normalizedValue = value == null ? '' : value;
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      this.propValueAccessor,
      normalizedValue
    );
  }
  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'disabled',
        'true'
      );
      this.removeDisabledState = this.renderer.listen(
        this.elementRef.nativeElement,
        'keydown',
        this.listenerDisabledState
      );
    } else {
      if (this.removeDisabledState) {
        this.renderer.removeAttribute(
          this.elementRef.nativeElement,
          'disabled'
        );
        this.removeDisabledState();
      }
    }
  }

  private listenerDisabledState(e: KeyboardEvent): void {
    e.preventDefault();
  }

  private setEndOfContentEditable(): void {
    if (this.document.createRange) {
      const range = this.document.createRange(); // Create a range (a range is a like the selection but invisible)
      range.selectNodeContents(this.elementRef.nativeElement); // Select the entire contents of the element with the range
      range.collapse(false); // collapse the range to the end point. false means collapse to end rather than the start
      const selection = window.getSelection(); // get the selection object (allows you to change selection)
      selection.removeAllRanges(); // remove any selections already made
      selection.addRange(range); // make the range you have just created the visible selection
    }
  }
}
// https://code.i-harness.com/en/q/112bac
// function setEndOfContenteditable(contentEditableElement)
// {
//     var range,selection;
//     if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
//     {
//         range = document.createRange();//Create a range (a range is a like the selection but invisible)
//         range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
//         range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
//         selection = window.getSelection();//get the selection object (allows you to change selection)
//         selection.removeAllRanges();//remove any selections already made
//         selection.addRange(range);//make the range you have just created the visible selection
//     }
//     else if(document.selection)//IE 8 and lower
//     {
//         range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
//         range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
//         range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
//         range.select();//Select the range (make it the visible selection
//     }
// }
