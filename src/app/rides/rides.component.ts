import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, Validators, FormControl, ValidationErrors, ValidatorFn, AbstractControl } from "@angular/forms";

interface PlaceResult {
  address?: string;
  location?: google.maps.LatLng;
  name?: string;
}

@Component({
  selector: "app-rides",
  templateUrl: "./rides.component.html",
  styleUrls: ["./rides.component.css"],
  // imports: [],
})

export class RidesComponent implements OnInit{

  rideForm: FormGroup | any;
  pickupLocation: PlaceResult | undefined;
  dropoffLocation: PlaceResult | undefined;
  selectedDate: Date | null = null;
  selectedTime: string = "";
  riderDriver: string = "";
  searchRange: string = "";
  
  autocomplete: google.maps.places.Autocomplete | undefined;
  autocomplete2: google.maps.places.Autocomplete | undefined;

  @ViewChild('puLocation', {static: false})
  puLocation!: ElementRef;
  @ViewChild('doLocation', {static: false})
  doLocation!: ElementRef;

  constructor() {}

  ngOnInit() {
    this.rideForm = new FormGroup({
      pickupLocation: new FormControl(null, [Validators.required, this.validatePlace]),
      dropoffLocation: new FormControl(null, [Validators.required, this.validatePlace]),
      selectedDate: new FormControl(null, [Validators.required, this.validateDate]),
      selectedTime: new FormControl(null, [Validators.required, this.validateTime]),
      riderDriver: new FormControl(null), //need a way to search all users and validate
      searchRange: new FormControl(null),
    });
  }

  ngAfterViewInit() {
    this.autocomplete = new google.maps.places.Autocomplete(this.puLocation.nativeElement);
    this.autocomplete2 = new google.maps.places.Autocomplete(this.doLocation.nativeElement)

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();

      const result: PlaceResult = {
        address: this.puLocation.nativeElement.value,
        name: place?.name,
        location: place?.geometry?.location,
      };

      this.rideForm.pickupLocation = result;
      this.rideForm.controls.pickupLocation.patchValue(result.address);
    });

    this.autocomplete2.addListener('place_changed', () => {
      const place = this.autocomplete2?.getPlace();

      const result: PlaceResult = {
        address: this.doLocation.nativeElement.value,
        name: place?.name,
        location: place?.geometry?.location,
      };

      this.dropoffLocation = result;
      this.rideForm.controls.dropoffLocation.patchValue(result.address);

    });
  }

  validatePlace = (ctrl: AbstractControl): {[key: string]:any} | null => {
    if (ctrl.value){
      if (ctrl.value.includes('ON')){
        return null;
      }
      else {
        return {'invalidPlace': true};
      }
    }
    return null;
  }

  validateDate = (ctrl:AbstractControl): ValidationErrors | null => {
    if (ctrl.value){
      const input:Date = new Date(ctrl.value);
      const todayChk:Date = new Date();

      if (todayChk > input){
        return {'dateInvalid':true};
      } 
      else {
        this.selectedDate = input;
        return null;
      }
    }

    return null;
  }

  validateTime = (ctrl:AbstractControl):ValidationErrors | null => {

    if (ctrl.value){}

    return null;
  }

  async onSubmit() {

    if (this.rideForm.invalid){
      alert('❗ Bad form!\n'+ JSON.stringify(this.rideForm.value));
      return;
    }
    else {

      alert('✅ SUCCESS\n' + JSON.stringify(this.rideForm.value, null, 4));
    }
    
  }
}
