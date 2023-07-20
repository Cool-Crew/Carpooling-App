import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Ride, StopLocation } from "../Ride";
import { RideService } from "../ride.service";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NotificationsService } from "../notifications.service";
import { StopLocationInfo, PlaceResult } from "../rides/rides.component";

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


        <!-- Ride card buttons -->
        <!--  -->
        <button
          *ngIf="needsDriver && userCanDrive"
          (click)="onDriverNeededClick()"
          [disabled]="userBecameDriver"
        >
          Offer To Drive
        </button>

        <!-- Button to communicate with user that they are the driver of this ride -->
        <button
          *ngIf="userIsDriver"
          disabled>
          You are already the driver of this ride
        </button>
        <button
          class="leave"
          *ngIf="userIsDriver || userBecameDriver"
          (click)="onCancelDriveOfferClick()"
          [disabled]="userLeftRide"
        >
          Cancel Drive Offer
        </button>

        <button
          *ngIf="(roomAvailable && userCanJoin && puLocation?.valid) && !userBecameRider"
          (click)="onJoinRideClick()"
          [disabled]="userBecameRider">
          Join Ride
        </button>    

        <!-- Button solely for communicating w/ user to input p/u location -->
        <div *ngIf="!puLocation?.valid && userCanJoin && roomAvailable">
          <button
            disabled
            >
            Join Ride
          </button>
          <p class="warning">Please enter a valid pickup location to join</p>
        </div>

        <button
          class="leave"
          *ngIf="(userIsRider && !userIsCreator) || userBecameRider"
          (click)="onLeaveRideClick()"
        >
          Leave Ride
        </button>

        <!-- Button for user to switch from driver to rider -->
        <button
          class="leave"
          *ngIf="userIsDriver && userCanJoin && puLocation?.valid && roomAvailable"
          (click)="onJoinRideClick()"
          [disabled]="userBecameRider">
          Cancel Drive Offer & Become Rider 
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
  userIsRider: boolean = false;
  userBecameRider: boolean = false;
  userBecameDriver: boolean = false;
  userLeftRide: boolean = false;
  userIsCreator: boolean = false;
  //for displaying information to the user
  rideDateStr: string | undefined;
  timeStr: string | undefined;

  @Input() ride: Ride | undefined;
  @Input() puLocation: StopLocationInfo | undefined;
  @Input() doLocation: StopLocationInfo | undefined;
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
          this.userIsRider = true;
        }
      }
    }

    //checks if ride has a driver
    if (this.ride?.driver) {
      this.needsDriver = false;

      if (this.ride?.driver === this.user._id) {
        this.userIsDriver = true;
      }
    }

    //checks if user is creator of ride
    if (this.ride?.creator === this.user._id) {
      this.userIsCreator = true;
    }

    this.endLocation = this.ride?.dropoffLocation;
    this.endLocationMarker = this.endLocation?.location;

  }

  reInit() {
    this.ngOnInit();
  }

  //Add a driver to the ride
  onDriverNeededClick() {
    //if user is already rider, remove them from ride before adding as driver
    if (!this.userCanJoin) {
      this.rideService.rmRiderFromRide(this.ride?._id, this.user?._id).subscribe(
        (response) => {
        },
        (error) => {
          console.error("Error removing rider from ride:", error);
        }
      );
    }

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
    this.userBecameDriver = true;
    
  }

  //Add a rider to the ride PlaceHolder for now
  onJoinRideClick() {
    const pickupLocation = this.puLocation;
    console.log(pickupLocation);

    //if user is already driver, remove them from driver before adding as rider
    if (this.userIsDriver) {
      this.rideService.rmDriverFromRide(this.ride?._id).subscribe(
        (response) => {
        },
        (error) => {
          console.error("Error removing driver from ride:", error);
        }
      );
    }
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
      this.userBecameRider = true;
      console.log('user became rider ' + this.userBecameRider)
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
    this.userLeftRide = true;
    console.log('user left ride: ' + this.userLeftRide);
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
