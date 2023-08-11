import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectorRef,
} from "@angular/core";
import { RideService } from "../ride.service";
import { Ride } from "../Ride";
import { StopLocationInfo, PlaceResult } from "../rides/rides.component";

@Component({
  selector: "app-available-rides-list",
  templateUrl: "./available-rides-list.component.html",
  styleUrls: ["./available-rides-list.component.css"],
})
export class AvailableRidesListComponent implements OnInit {
  rides: Ride[] | undefined = [];
  ridesForCards: Ride[] | undefined = [];
  loading: boolean = true;
  selectedRide: Ride | undefined;
  selectedRideEnd: { lat: number; lng: number } | undefined;

  @Input() user: any;
  @Input() useMatching: boolean | undefined;
  @Input() searchParams:
    | {
        date: Date | undefined;
        doLocation: PlaceResult | undefined;
      }
    | undefined;
  @Input() puLocation: StopLocationInfo | undefined;
  @Input() doLocation: StopLocationInfo | undefined;
  @Output() passLocation = new EventEmitter<{ lat: number; lng: number }>();

  constructor(
    private rideService: RideService,
    private cdr: ChangeDetectorRef
  ) {}

  async refreshRides() {
    this.ngOnInit();
  }

  async ngOnInit(): Promise<void> {
    //API call for rides
    let res: { message: String; _rides: [Ride] } | undefined =
      await this.rideService.getRides();
    this.rides = res?._rides;
    //filter this.rides by ride.status === "Not_Started"
    this.rides = this.rides?.filter((ride) => ride.status === "Not_Started");

    //filter this.rides to remove any rides that are full
    this.rides = this.rides?.filter((ride) => ride.riders.length < 3);

    //filter this.rides by date so that only future rides are shown
    this.rides = this.rides?.filter((ride) => {
      let rideDateStr = ride?.dateTime;
      var rideDate: Date | undefined;
      if (typeof rideDateStr === "string") {
        rideDate = new Date(rideDateStr);
      }
      if (rideDate) {
        return rideDate?.getTime() > Date.now();
      }
      //possible fail-point, no issues in testing so far
      return false;
    });

    //filter this.rides by date in searchParams, but not the time portion of the date
    if (this.searchParams?.date) {
      this.rides = this.rides?.filter((ride) => {
        let rideDateStr = ride?.dateTime;
        var rideDate: Date | undefined;
        if (typeof rideDateStr === "string") {
          rideDate = new Date(rideDateStr);
        }

        //filter the rides by date and within 2hr before or 1hr after the search datetime, but only if the search time is not null
        //if the search time is null, then the search is for all rides on the search date
        if (rideDate && this.searchParams?.date) {
          return (
            rideDate?.getFullYear() ===
              this.searchParams?.date?.getFullYear() &&
            rideDate?.getMonth() === this.searchParams?.date?.getMonth() &&
            rideDate?.getDate() === this.searchParams?.date?.getDate()
          );
        }
        if (
          rideDate &&
          this.searchParams?.date &&
          this.searchParams?.date?.getHours() !== null
        ) {
          rideDate?.getHours() >= this.searchParams?.date?.getHours() - 2 &&
            rideDate?.getHours() <= this.searchParams?.date?.getHours() + 1;
        }

        return false;
      });
    }

    if (this.searchParams?.doLocation) {
      //filter this.rides by doLocation
      this.rides = this.rides?.filter((ride) => {
        let rideDoLocation = ride?.dropoffLocation;
        if (rideDoLocation) {
          //would prefere to do this by lat/lng but was unable to make it work
          let result =
            rideDoLocation?.name == this.searchParams?.doLocation?.name;

          return result;
        }
        //possible fail-point, no issues in testing so far
        return false;
      });
    }

    if (this.rides) {
      for (let ride of this.rides) {
        ride.riderInterests = [];
        ride.riderClasses = [];
        await this.getAllMatchingValues(ride);
      }
    }

    //sort this.rides by date
    if (!this.useMatching) {
      this.rides = this.rides?.sort((a, b) => {
        let aDateStr = a?.dateTime;
        let bDateStr = b?.dateTime;
        var aDate: Date | undefined;
        var bDate: Date | undefined;
        if (typeof aDateStr === "string") {
          aDate = new Date(aDateStr);
        }
        if (typeof bDateStr === "string") {
          bDate = new Date(bDateStr);
        }
        if (aDate && bDate) {
          return aDate?.getTime() - bDate?.getTime();
        }
        return 0;
      });
    } else {
      //sort this.rides by the size of ride.riderInterests and ride.riderClasses
      this.rides = this.rides?.sort((a, b) => {
        return (
          b.riderInterests.length +
          b.riderClasses.length -
          a.riderInterests.length -
          a.riderClasses.length
        );
      });
    }

    this.ridesForCards = this.rides;
    this.loading = false;
  }

  //gets location from ride-card, which is used in putting a pinpoint on map for the dropoff location of the ride
  rideSelected(location: { lat: number; lng: number }) {
    this.passLocationUp(location);
  }

  //passes the location up to rides
  passLocationUp(location: { lat: number; lng: number }) {
    this.passLocation.emit(location);
  }

  async getAllMatchingValues(ride: Ride) {
    if (ride?.riders) {
      // Get the riders' matching info
      for (const rider of ride?.riders) {
        try {
          const matchingInfo = await this.rideService.getMatchingValues(
            rider.riderID
          );

          for (const interest of matchingInfo._matchingInfo.interests) {
            if (this.user.interests.includes(interest)) {
              ride.riderInterests.push(interest);
            }
          }

          for (const _class of matchingInfo._matchingInfo.classes) {
            if (this.user.classes.includes(_class)) {
              ride.riderClasses.push(_class);
            }
          }

          // Clean up any duplicates in the arrays
          ride.riderInterests = ride.riderInterests.filter(
            (v, i, a) => a.indexOf(v) === i
          );
          ride.riderClasses = ride.riderClasses.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        } catch (error) {
          console.error("Error fetching matching info:", error);
        }
      }
    }

    if (ride.driver) {
      // Get the driver's matching info
      try {
        const matchingInfo = await this.rideService.getMatchingValues(
          ride.driver
        );

        for (const interest of matchingInfo._matchingInfo.interests) {
          if (this.user.interests.includes(interest)) {
            ride.riderInterests.push(interest);
          }
        }

        for (const _class of matchingInfo._matchingInfo.classes) {
          if (this.user.classes.includes(_class)) {
            ride.riderClasses.push(_class);
          }
        }

        // Clean up any duplicates in the arrays
        ride.riderInterests = ride.riderInterests.filter(
          (v, i, a) => a.indexOf(v) === i
        );
        ride.riderClasses = ride.riderClasses.filter(
          (v, i, a) => a.indexOf(v) === i
        );
      } catch (error) {
        console.error("Error fetching matching info:", error);
      }
    }
  }
}
