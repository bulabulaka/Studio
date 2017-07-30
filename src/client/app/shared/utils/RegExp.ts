import {AbstractControl, ValidatorFn} from '@angular/forms';

export function RegExp(valueReceive: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const value = control.value;
    const no = valueReceive.test(value);
    return no ? null : {RegExp: {value}}
  }
}
