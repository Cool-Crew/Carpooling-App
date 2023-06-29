import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, Validators, FormControl, ValidationErrors, AbstractControl } from "@angular/forms";
import { RideService } from "../ride.service";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

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
  user: any;

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

  constructor(
    private rideService: RideService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.readToken();

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

      this.pickupLocation = result;
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
      if (ctrl.value.includes('ON')){ //Need to also ensure street numbers are present
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

    this.selectedTime = ctrl.value;

    return null;
  }

  async onSubmit() {
    let dateNoTime: string | undefined = this.selectedDate?.toISOString();
    const dateParts = dateNoTime?.split('T');
    var fullDate: Date | undefined;
    if (dateParts) {
      fullDate = new Date(`${dateParts[0]}T${this.selectedTime}`);
    }

    const rideData = {
      riders: [{riderID: this.user._id, pickupLocation: this.pickupLocation?.address?.toString()}],
      dropoffLocatiion: this.dropoffLocation?.address,
      dateTime: fullDate,
    }


    if (this.rideForm.invalid){
      alert('❗ Invalid ride requsted ❗');
      return;
    }

    this.rideService.registerRide(rideData).subscribe(
      (response) => {
        alert('✅ Your ride has been registered');
        this.router.navigate(["/rides"]);
      },
      (err) => {
        alert('❗ There was an issue registering the ride' + JSON.stringify(err));
      }
    )
    
  }
}
