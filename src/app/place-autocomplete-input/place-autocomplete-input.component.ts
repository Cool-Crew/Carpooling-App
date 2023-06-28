import { Component, ElementRef, Input, OnInit, ViewChild, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface PlaceResult {
  address?: string;
  location?: google.maps.LatLng;
  name?: string;
}

@Component({
  standalone: true,
  selector: 'app-place-autocomplete-input',
  styleUrls: ['./place-autocomplete-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PlaceAutocompleteInputComponent),
      multi: true
    }
  ],
  template: `
    <input
      #inputField
      type="text"
      class="place-autocomplete"
      required="true"
      [placeholder]="placeholder"
      (input)="onInputChange($event.target)"
    />
  `
})
export class PlaceAutocompleteInputComponent implements OnInit, ControlValueAccessor {

  @ViewChild('inputField') inputField!: ElementRef;

  @Input() placeholder = '';

  value: PlaceResult | undefined;
  onChange: any = () => {};
  onTouched: any = () => {};

  autocomplete: google.maps.places.Autocomplete | undefined;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.autocomplete = new google.maps.places.Autocomplete(this.inputField.nativeElement);

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();

      const result: PlaceResult = {
        address: this.inputField.nativeElement.value,
        name: place?.name,
        location: place?.geometry?.location,
      };

      this.onChange(result);
    });
  }

  onInputChange(value: any) {
    this.value = value;
    this.onChange(value);
  }

  // ControlValueAccessor methods

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Implement this method if needed
  }

  
}
