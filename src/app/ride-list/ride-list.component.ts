import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { RideList } from "../Ride";
import { RideService } from "../ride.service";

@Component({
  selector: "app-ride-list",
  templateUrl: "./ride-list.component.html",
  styleUrls: ["./ride-list.component.css"],
})
export class RideListComponent implements OnInit {
  user: any;
  color: string | undefined;
  rides: RideList[] | undefined;
  constructor(
    private rideService: RideService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.authService.readToken();
    console.log("This is the id", this.user._id);
    let res: { message: String; _rides: [RideList] } | undefined =
      await this.rideService.getUserRides(this.user._id);
    this.rides = res?._rides;
    this.rides?.forEach((r) => {
      r.statusString = r.status.replace(/_/g, " ");
      r.dateTime = r?.dateTime?.split("T")[0];
      switch (r.statusString) {
        case "Not Started":
          r.color = "yellow";
          break;
        case "Complete":
          r.color = "green";
          break;
        case "In Progress":
          r.color = "orange";
          break;
        case "Cancelled":
          r.color = "red";
          break;
        default:
          r.color = "yellow";
          break;
      }
    });
  }
  onDriverNeededClick(rideId: String, dropoffLocation: String | undefined) {
    this.user = this.authService.readToken();
    this.rideService.registerDriverToRide(rideId, this.user?._id).subscribe(
      (response) => {
        console.log("✅");
      },
      (err) => {
        console.log("❗");
      }
    );

    alert(`✅ You have offered to drive to:\n ${dropoffLocation}\n` + ``);
    this.ngOnInit();
  }

  onLeaveRideClick(rideId: String, isDriver: boolean) {
    console.log("👋");
    this.rideService.rmRiderFromRide(rideId, this.user?._id).subscribe(
      (response) => {
        console.log("✅");
      },
      (err) => {
        console.log("❗");
      }
    );
    if (isDriver) {
      this.rideService.rmDriverFromRide(rideId).subscribe(
        (response) => {
          console.log("✅");
        },
        (err) => {
          console.log("❗");
        }
      );
    }

    this.ngOnInit();
  }
}
