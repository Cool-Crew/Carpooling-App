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
        <p *ngIf="userIsCreator"><b>Your Ride</b></p>
        <p><b>Ride to:</b> {{ ride?.dropoffLocation?.name }}</p>
        <!-- <p class="info" *ngIf="userIsDriver"><b>Driver:</b> You</p>
        <p class="info" *ngIf="userIsRider"><b>You are a rider</b></p> -->
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
        
        <div *ngIf="useMatching" class="ic-container">
          <label *ngIf="interests.length < 1 && classes.length < 1">No matching interests or classes</label>
          <div  class="interests">
            <label *ngIf="interests.length > 0"><b>Matching Interests:</b></label>
            <p *ngFor="let interest of interests">{{ interest }}</p>
          </div>
          <div *ngIf="classes.length > 0" class="classes">
            <label><b>Matching Classes:</b></label>
            <p *ngFor="let class of classes">{{ class }}</p>
          </div>
        </div>


        <!-- Ride card buttons -->

        <!-- Offer to Drive -->
        <div *ngIf="!userBecameDriver && !userIsDriver && needsDriver">
          <button
            *ngIf="needsDriver && userCanDrive"
            (click)="onDriverNeededClick()"
            [disabled]="userBecameDriver"
          >
            Offer To Drive
          </button>
          <p class="warning" *ngIf="userIsRider"> This will switch you from rider to driver</p>
        </div>
        
        <!-- Cancel Drive Offer -->
        <button
          class="leave"
          *ngIf="(userIsDriver || userBecameDriver) && !userCancelledDriveOffer && !userIsCreator"
          (click)="onCancelDriveOfferClick()"
          [disabled]="userCancelledDriveOffer || userIsCreator"
        >
          Cancel Drive Offer
        </button>

        <!-- Join Ride -->
        <div *ngIf='userCanJoin && roomAvailable && !userBecameRider'>

          <button
            *ngIf="!userIsDriver"
            (click)="onJoinRideClick()"
            [disabled]="userBecameRider || userIsRider || (!puLocation?.valid && userCanJoin && roomAvailable)">
            Join Ride
          </button>

          <!-- Button for if user is driver -->
          <button
            *ngIf="userIsDriver"
            (click)="onJoinRideClick()"
            [disabled]="userBecameRider || userIsRider || (!puLocation?.valid && userCanJoin && roomAvailable)">
            Switch to Rider
          </button>

          <p *ngIf="!puLocation?.valid && userCanJoin && roomAvailable" class="warning">Please enter a valid pickup location to join</p>
          <p *ngIf="userIsRider || userBecameRider" class="warning">You are already a rider</p>
          <!-- <p *ngIf="userIsDriver" class="warning">Swap from driver to rider</p>     -->
        </div>

        <!-- Leave Ride -->
        <button
          class="leave"
          *ngIf="(userIsRider && !userIsCreator && !userLeftRide) || userBecameRider && !userLeftRide && !userIsCreator"
          (click)="onLeaveRideClick()"
        >
          Leave Ride
        </button>

      </div>

      <!-- Ouputs ride and buttonVars to console on press -->
      <!-- Switch *nfIf='true' to use -->
      <button class="dev-only"
        *ngIf='false'
        (click)="outputButtonVars()">
        check ride & btn vars
      </button>
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

  //for determining button availability
  userCanJoin: boolean = true;
  userCanDrive: boolean = true;
  userIsDriver: boolean = false;
  userIsRider: boolean = false;
  userBecameRider: boolean = false;
  userBecameDriver: boolean = false;
  userLeftRide: boolean = false;
  userIsCreator: boolean = false;
  userCancelledDriveOffer: boolean = false;

  //for displaying information to the user
  rideDateStr: string | undefined;
  timeStr: string | undefined;

  //for holding rider/driver interests/classes
  interests: string[] = [];
  classes: string[] = [];

  @Input() ride: Ride | undefined;
  @Input() puLocation: StopLocationInfo | undefined;
  @Input() doLocation: StopLocationInfo | undefined;
  @Input() useMatching: boolean | undefined;
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

    this.setMatchValues();
  }

  setMatchValues() {
    if (this.ride?.riderInterests){
      this.interests = this.ride?.riderInterests;
      //sort this.interests alphabetically
      this.interests.sort();
    }
    if (this.ride?.riderClasses){
      this.classes = this.ride?.riderClasses;
      //sort this.classes alphabetically
      this.classes.sort();
    }

  }

  //For refreshing a ride card after a user action
  reInit() {
    this.ngOnInit();
  }

  //dev function to check button variables
  outputButtonVars() {

    console.log("userCanJoin: " + this.userCanJoin);
    console.log("userCanDrive: " + this.userCanDrive);
    console.log("userIsDriver: " + this.userIsDriver);
    console.log("userIsRider: " + this.userIsRider);
    console.log("userBecameRider: " + this.userBecameRider);
    console.log("userBecameDriver: " + this.userBecameDriver);
    console.log("userLeftRide: " + this.userLeftRide);
    console.log("userIsCreator: " + this.userIsCreator);
    console.log("userCancelledDriveOffer: " + this.userCancelledDriveOffer);
    console.log("needsDriver: " + this.needsDriver);

    //have above also appear in an aler
    alert(
      "userCanJoin: " +
        this.userCanJoin +
        "\nuserCanDrive: " +
        this.userCanDrive +
        "\nuserIsDriver: " +
        this.userIsDriver +
        "\nuserIsRider: " +
        this.userIsRider +
        "\nuserBecameRider: " +
        this.userBecameRider +
        "\nuserBecameDriver: " +
        this.userBecameDriver +
        "\nuserLeftRide: " +
        this.userLeftRide +
        "\nuserIsCreator: " +
        this.userIsCreator +
        "\nuserCancelledDriveOffer: " +
        this.userCancelledDriveOffer +
        "\nneedsDriver: " +
        this.needsDriver
    );
  }

  onRideClick() {
    this.emitLocation();
  }

  //Add a rider to the ride
  onJoinRideClick() {
    const pickupLocation = this.puLocation;

    //if user is already driver, remove them from driver before adding as rider
    if (this.userIsDriver) {
      this.rideService.rmDriverFromRide(this.ride?._id).subscribe(
        (response) => {
          this.userIsDriver = false;
          this.userBecameDriver = false;
          this.needsDriver = true;
          this.userCanDrive = true;

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
          //update button availability values
          this.userBecameRider = true;
          this.userIsRider = true;
          this.userCanJoin = false;
          this.userLeftRide = false;

          //update rider count
          this.riderCount = this.ride?.riders?.length;
        },
        (err) => {
          console.log("❗");
        }
      );
      
    this.reInit();
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

        //update button availability values
        this.userLeftRide = true;
        this.userIsRider = false;
        this.userBecameRider = false;
        this.userCanJoin = true;
  
      },
      (err) => {
        console.log("❗");
      }
    );
    this.reInit();
  }

  //Add a driver to the ride
  onDriverNeededClick() {
    //if user is already rider, remove them from ride before adding as driver
    if (!this.userCanJoin) {
      this.rideService.rmRiderFromRide(this.ride?._id, this.user?._id).subscribe(
        (response) => {
          this.userIsRider = false;
          this.userBecameRider = false;
          this.userCanJoin = true;
          
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
          
          //update button availability values
          this.userBecameDriver = true;
          this.needsDriver = false;
          this.userIsDriver = true;
          this.userCancelledDriveOffer = false;

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

  //Remove driver from ride (Cancel Drive Offer)
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
        //reset button availability values
        this.userCancelledDriveOffer = true;
        this.needsDriver = true;
        this.userIsDriver = false;
        this.userBecameDriver = false;

        //if user is creator, add them to the riders
        if (this.userIsCreator) {
          this.rideService
            .registerRidertoRide(this.ride?._id, this.user?._id, this.puLocation)
            .subscribe(
              (response) => {
                this.userBecameRider = true;
                this.userIsRider = true;
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
        }    
      },
      (err) => {
        console.log("❗");
      }
    );

    this.reInit();
  }

}
