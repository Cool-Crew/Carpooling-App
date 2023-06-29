import { Component } from "@angular/core";
import { RideService } from "../ride.service";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-create-ride",
  templateUrl: "./create-ride.component.html",
  styleUrls: ["./create-ride.component.css"],
})
export class CreateRideComponent {
  user: any;
  startLocation = "";
  dropOffLocation = "";
  dateTime = "";

  constructor(
    private rideService: RideService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.readToken();
  }

  submitForm() {
    const rideData = {
      driver: this.user._id,
      driverStartLocation: this.startLocation,
      dropoffLocation: this.dropOffLocation,
      dateTime: new Date(this.dateTime),
    };

    this.rideService.registerRide(rideData).subscribe(
      (response) => {
        console.log("Ride registered successfully:", response);
        this.router.navigate(["/rides"]);
      },
      (error) => {
        console.error("Error registering ride:", error);
      }
    );
  }
}
