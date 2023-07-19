import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { RideList } from "../Ride";
import { RideService } from "../ride.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: "app-ride-list",
  templateUrl: "./ride-list.component.html",
  styleUrls: ["./ride-list.component.css"],
})
export class RideListComponent implements OnInit {
  user: any;
  color: string | undefined;
  rides: RideList[] | undefined;
  cardLoading: string = "";
  constructor(
    private rideService: RideService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
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

  cancelRide(rideId: string) {
    this.rideService.cancelRide(rideId).subscribe(
      (response) => {
        console.log("✅");
        this.reloadRideList(rideId);
      },
      (error) => {
        if (error.status === 422) {
          alert(`❗${error.error.message}`);
        }
        console.error(error);
      }
    );
  }

  onDriverNeededClick(rideId: string, dropoffLocation: String | undefined) {
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
    this.reloadRideList(rideId);
  }

  onLeaveRideClick(rideId: string, isDriver: boolean) {
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
    this.reloadRideList(rideId);
  }

  async reloadRideList(rideId: string) {
    console.log("This is ride id", rideId);
    this.cardLoading = rideId;
    await this.ngOnInit();
    this.cardLoading = "";
    this.changeDetectorRef.detectChanges(); // Trigger change detection
  }
  onChatting(rideId:string,ride:any){
    console.log(this.rides)
    const encodedRide = encodeURIComponent(JSON.stringify(ride));
    this.router.navigate(['/chat'],{ queryParams: {id:rideId,ride:encodedRide}});
  }
}
