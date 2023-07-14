import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormControl,
  ValidationErrors,
  AbstractControl,
} from "@angular/forms";
import { RideService } from "../ride.service";
import { AuthService } from "../auth.service";
import { ToastrService } from "ngx-toastr";
import { NotificationsService } from "../notifications.service";
import { Router } from "@angular/router";

import { MapComponent } from "../map/map.component";
import { AvailableRidesListComponent } from "../available-rides-list/available-rides-list.component";

interface PlaceResult {
  address?: string;
  location?: google.maps.LatLng;
  name?: string;
}



@Component({
  selector: "app-rides",
  templateUrl: "./rides.component.html",
  styleUrls: ["./rides.component.css"],
})
export class RidesComponent implements OnInit {
  user: any;
  rideForm: FormGroup | any;
  pickupLocation: PlaceResult | undefined;
  dropoffLocation: PlaceResult | undefined;
  selectedDate: Date | null = null;
  selectedTime: string = "";
  riderDriver: string = "";
  searchRange: string = "";
  currPinLocation: { lat: number; lng: number } | undefined;

  //searchParams are passed to the available-rides-list component
  searchParams: { 
    date: Date | undefined, 
    } 
  | undefined;


  @ViewChild("puLocation", { static: false })
  puLocation!: ElementRef;
  @ViewChild("doLocation", { static: false })
  doLocation!: ElementRef;
  @ViewChild("map", { static: false })
  map!: MapComponent;
  @ViewChild('ridesListComponent', {static: false})
  ridesListComponent!: AvailableRidesListComponent;

  autocomplete: google.maps.places.Autocomplete | undefined;
  autocomplete2: google.maps.places.Autocomplete | undefined;

  warning = "";
  success = false;
  loading = false;

  constructor(
    private rideService: RideService,
    private authService: AuthService,
    private toastr: ToastrService,
    private notificationService: NotificationsService,
    private router: Router
  ) {}

  recvLocation(location: { lat: number; lng: number }) {
    this.currPinLocation = location;
    this.map.reInit();
  }

  ngOnInit() {
    this.user = this.authService.readToken();

    this.rideForm = new FormGroup({
      pickupLocation: new FormControl(null, [
        Validators.required,
        this.validatePlace,
      ]),
      dropoffLocation: new FormControl(null, [
        Validators.required,
        this.validatePlace,
      ]),
      selectedDate: new FormControl(null, [
        Validators.required,
        this.validateDate,
      ]),
      selectedTime: new FormControl(null, [
        Validators.required,
        this.validateTime,
      ]),
      riderDriver: new FormControl(null),
      searchRange: new FormControl(null),
    });
  }

  ngAfterViewInit() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.puLocation.nativeElement
    );
    this.autocomplete2 = new google.maps.places.Autocomplete(
      this.doLocation.nativeElement
    );

    this.autocomplete.addListener("place_changed", () => {
      const place = this.autocomplete?.getPlace();
      const result: PlaceResult = {
        address: this.puLocation.nativeElement.value,
        name: place?.name,
        location: place?.geometry?.location,
      };
      this.pickupLocation = result;
      this.rideForm.controls.pickupLocation.patchValue(result.address);
    });

    this.autocomplete2?.addListener("place_changed", () => {
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

  validatePlace = (ctrl: AbstractControl): { [key: string]: any } | null => {
    if (ctrl.value) {
      if (ctrl.value.includes("ON")) {
        return null;
      } else {
        return { invalidPlace: true };
      }
    }
    return null;
  };

  validateDate = (ctrl: AbstractControl): ValidationErrors | null => {
    if (ctrl.value) {
      const input: Date = new Date(ctrl.value);
      const todayChk: Date = new Date();

      if (todayChk > input) {
        return { dateInvalid: true };
      } else {
        this.selectedDate = input;
        return null;
      }
    }
    return null;
  };

  validateTime = (ctrl: AbstractControl): ValidationErrors | null => {
    this.selectedTime = ctrl.value;
    return null;
  };



  // searching for a ride
  //Pass the date to the available-rides-list component
  async onSearch() {
    console.log("🚗");
    const dateNoTime: string | undefined = this.selectedDate?.toISOString();
    const dateParts = dateNoTime?.split("T");
    let fullDate: Date | undefined;

    if (dateParts) {
      fullDate = new Date(`${dateParts[0]}T${this.selectedTime}`);
    }

    //send the date to the available-rides-list component
    //this.searchParams = {date: fullDate, dropLocation: this.dropoffLocation?.location};
    this.searchParams = { date: fullDate };
    console.log(this.searchParams);

    //re initioalize the available-rides-list component
    await this.ridesListComponent.refreshRides();
  }

  // creating a new ride
  async onSubmit() {
    const dateNoTime: string | undefined = this.selectedDate?.toISOString();
    const dateParts = dateNoTime?.split("T");
    let fullDate: Date | undefined;
    if (dateParts) {
      fullDate = new Date(`${dateParts[0]}T${this.selectedTime}`);
    }

    const rideData = {
      creator: this.user._id,
      riders: [
        {
          riderID: this.user._id,
          pickupLocation: {
            address: this.pickupLocation?.address,
            location: this.pickupLocation?.location,
            name: this.pickupLocation?.name,
          },
        },
      ],
      dropoffLocation: {
        address: this.dropoffLocation?.address,
        location: this.dropoffLocation?.location,
        name: this.dropoffLocation?.name,
      },
      dateTime: fullDate,
    };

    if (this.rideForm.invalid) {
      this.toastr.error("❗ Invalid ride requested ❗");
      return;
    }

    this.rideService.registerRide(rideData).subscribe(
      (response) => {
        this.toastr.success("Ride Registered!");

        const notificationData = {
          msg: "New ride has been registered",
          dateTime: Date.now(),
          category: "Ride",
        };
        this.notificationService
          .addNotification(this.user._id, notificationData)
          .subscribe(
            () => {
              this.warning = "";
              this.loading = false;

              this.authService.refreshToken().subscribe(
                (refreshSuccess) => {
                  this.authService.setToken(refreshSuccess.token);
                  this.router.navigate(['/router']);
                },
                (refreshError) => {
                  console.error("Error refreshing token:", refreshError);
                }
              );
            },
            (notificationError) => {
              console.error(
                "Error adding notification:",
                notificationError
              );
              this.warning = "Error adding notification";
              this.loading = false;
            }
          );
      },
      (err) => {
        this.toastr.error("Issue Registering Ride")
        
      }
    );
  }
}
