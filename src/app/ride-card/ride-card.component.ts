import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Ride, StopLocation } from "../Ride";
import { RideService } from "../ride.service";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NotificationsService } from "../notifications.service";
import { PickupLocationInfo, PlaceResult } from "../rides/rides.component";

@Component({
  selector: "app-ride-card",
  styleUrls: ["./ride-card.component.css"],
  template: `
    <div class="card">
      <div class="card-header">
        <p><b>Ride to:</b> {{ ride?.dropoffLocation?.name }}</p>
      </div>

      <div class="card-body" (click)="onRideClick()">
        <p><b>Destination:</b> {{ ride?.dropoffLocation?.address }}</p>
        <p><b>Capacity:</b> {{ riderCount }}/3</p>

        <div class="time-date">
          <label><b>Arrival Time:</b></label>
          <p>{{ this.timeStr }}</p>
          <label><b>Date:</b></label>
          <p>
            {{ rideDateStr }}
          </p>
        </div>

        <p></p>
        <button
          *ngIf="needsDriver && userCanDrive"
          (click)="onDriverNeededClick()"
        >
          Offer To Drive
        </button>
        <button
          *ngIf="roomAvailable && userCanJoin && puLocation?.valid"
          (click)="onJoinRideClick()"
        >
          Join Ride
        </button>
        <!-- button that is disabled and says Join Ride if puLocation.valid is false -->
        <button
          *ngIf="!puLocation?.valid"
          disabled
          >
          Enter a valid pickup location to join ride
        </button>
        <button
          class="leave"
          *ngIf="!userCanJoin && !userCanDrive"
          (click)="onLeaveRideClick()"
        >
          Leave Ride
        </button>
        <button
          class="leave"
          *ngIf="userIsDriver"
          (click)="onCancelDriveOfferClick()"
        >
          Cancel Drive Offer
        </button>
      </div>
    </div>
  `,
})
export class RideCardComponent implements OnInit {
  user: any;

  rideDate: Date | undefined;
  riderCount: number | undefined;
  needsDriver: boolean | undefined = true;
  roomAvailable: boolean = true;
  endLocation: StopLocation | undefined;
  endLocationMarker: { lat: number; lng: number } | undefined;
  userCanJoin: boolean = true;
  userCanDrive: boolean = true;
  userIsDriver: boolean = false;
  //for displaying information to the user
  rideDateStr: string | undefined;
  timeStr: string | undefined;

  @Input() ride: Ride | undefined;
  @Input() puLocation: PickupLocationInfo | undefined;
  @Output() newRideEvent = new EventEmitter<{ lat: number; lng: number }>();
  emitLocation() {
    this.newRideEvent.emit(this.endLocationMarker);
  }

  warning = "";
  success = false;
  loading = false;

  constructor(
    private rideService: RideService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private notificationService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.readToken();

    let dateTimeStr = this.ride?.dateTime;
    if (dateTimeStr) {
      this.rideDate = new Date(dateTimeStr);
    }
    //setting date string for display
    var monthName: string | undefined;
    switch (this.rideDate?.getMonth()) {
      case 0:
        monthName = 'January';
        break;
      case 1:
        monthName = 'February';
        break;
      case 2:
        monthName = 'March';
        break;
      case 3:
        monthName = 'April';
        break;
      case 4:
        monthName = 'May';
        break;
      case 5:
        monthName = 'June';
        break;
      case 6:
        monthName = 'July';
        break;
      case 7:
        monthName = 'August';
        break;
      case 8:
        monthName = 'September';
        break;
      case 9:
        monthName = 'October';
        break;
      case 10:
        monthName = 'November';
        break;
      case 11:
        monthName = 'December';
        break;
      default:
        monthName = '';
        break;
    }
    this.rideDateStr = `${this.rideDate?.getDate()} ${monthName}, ${this.rideDate?.getFullYear()}`;

    //setting time string for display
    if (this.rideDate){
      let hour = this.rideDate?.getHours();
      let minute = this.rideDate?.getMinutes();
      let ampm = hour >= 12 ? 'pm' : 'am';
      hour = hour % 12;
      hour = hour ? hour : 12;

      //formatting for 12hr clock
      if (hour < 10){
        this.timeStr = `0${hour}:`;
      } else {
        this.timeStr = `${hour}:`;
      }
      if (minute < 10){
        this.timeStr += `0${minute} ${ampm}`;
      }else {
        this.timeStr += `${minute} ${ampm}`;
      }
    }

    //check if room is available to join, remove join button if not
    this.riderCount = this.ride?.riders?.length;
    if (this.riderCount) {
      if (this.riderCount >= 3) {
        this.roomAvailable = false;
      }
    }

    //check if user is already involved in ride, no buttons if so
    if (this.ride?.riders) {
      for (const rider of this.ride?.riders) {
        if (rider.riderID === this.user._id) {
          this.userCanJoin = false;
          this.userCanDrive = false;
        }
      }
    }

    //checks if ride has a driver
    if (this.ride?.driver) {
      this.needsDriver = false;

      if (this.ride?.driver === this.user._id) {
        this.userCanDrive = false;
        this.userIsDriver = true;
      }
    }

    this.endLocation = this.ride?.dropoffLocation;
    this.endLocationMarker = this.endLocation?.location;

  }

  reInit() {
    this.ngOnInit();
  }

  //Add a driver to the ride
  onDriverNeededClick() {
    this.rideService
      .registerDriverToRide(this.ride?._id, this.user?._id)
      .subscribe(
        (response) => {
          this.toastr.success("Get Ready to Drive");
          const notificationData = {
            msg: `You offered to drive to: ${this.ride?.dropoffLocation?.address}`,
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
                      this.router.navigate(["/router"]);
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
          console.log("❗");
        }
      );

    this.reInit();
  }

  //Add a rider to the ride PlaceHolder for now
  onJoinRideClick() {
    const pickupLocation = this.puLocation;
    console.log(pickupLocation);

    this.rideService
      .registerRidertoRide(this.ride?._id, this.user?._id, pickupLocation)
      .subscribe(
        (response) => {
          this.toastr.success("Ride Joined");
          const notificationData = {
            msg: `You have joined the ride to ${this.ride?.dropoffLocation?.address}`,
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
                      this.router.navigate(["/router"]);
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
          console.log("❗");
        }
      );
    /*
    alert(
      `✅ You have joined the ride to '${this.ride?.dropoffLocation?.address}'`
    );
    */
    this.reInit();
  }

  onRideClick() {
    this.emitLocation();
  }

  //Remove a rider from the ride (if they are a driver, they can't leave)
  onLeaveRideClick() {
    this.rideService.rmRiderFromRide(this.ride?._id, this.user?._id).subscribe(
      (response) => {
        this.toastr.error("Ride Abandoned");
        const notificationData = {
          msg: `You left the ride to ${this.ride?.dropoffLocation?.address}`,
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
                    this.router.navigate(["/router"]);
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
        console.log("❗");
      }
    );

    this.reInit();
  }

  onCancelDriveOfferClick() {
    this.rideService.rmDriverFromRide(this.ride?._id).subscribe(
      (response) => {
        this.toastr.error("Drive Offer Cancelled");
          const notificationData = {
            msg: `You decided to withdraw your drive offer`,
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
                      this.router.navigate(["/router"]);
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
        console.log("❗");
      }
    );

    this.reInit();
  }

}
