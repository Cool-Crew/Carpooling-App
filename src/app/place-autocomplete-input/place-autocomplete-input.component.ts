import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-place-autocomplete-input',
  standalone: true,
  styleUrls: ['./place-autocomplete-input.component.css'],
  template: `
    <input
      #inputField
      type='text'
      class='place-autocomplete'
      required
      [placeholder]="placeholder"
      />
  `
})
export class PlaceAutocompleteInputComponent implements OnInit{

  @ViewChild('inputField') inputField!:ElementRef
  @Input() placeholder = ''
  autocomplete: google.maps.places.Autocomplete | undefined;

  constructor () {}
  ngOnInit(): void {

  }

  ngAfterViewInit(){
    this.autocomplete = new google.maps.places.Autocomplete(this.inputField.nativeElement);

    this.autocomplete.addListener("place_changed", () => {
      const place = this.autocomplete?.getPlace();
      console.log(place);
    });
  }
}
