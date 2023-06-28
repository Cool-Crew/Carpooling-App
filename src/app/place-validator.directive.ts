import { Directive } from '@angular/core';
import {AbstractControl, Validator, NG_VALIDATORS, ValidationErrors} from '@angular/forms';

@Directive({
  selector: '[appPlaceValidator]',
  providers:[{
    provide: NG_VALIDATORS,
    useExisting: PlaceValidatorDirective,
    multi: true,
  }]
})
export class PlaceValidatorDirective implements Validator{
  validate(ctrl: AbstractControl<any, any>): {[key: string]:any;} | null {
    if (ctrl.value && ctrl.value.location) {
      return {'placeInvalid':true};
    }
    return null;
  }

  // registerOnValidatorChange?(fn: () => void): void {
  //   throw new Error('Method not implemented.');
  // }


}
