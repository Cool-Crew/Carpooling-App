import { Component } from "@angular/core";
import { RideService } from "../ride.service";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { NotificationsService } from "../notifications.service";
import { ToastrService } from "ngx-toastr";

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

  warning = "";
  success = false;
  loading = false;

  constructor(
    private rideService: RideService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationsService,
    private toastr: ToastrService
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
    
    const notificationData = {
      msg: `Ride to ${this.dropOffLocation} Created`,
      dateTime: Date.now(),
      category: "Ride",
    };
    this.notificationService
              .addNotification(this.user._id, notificationData)
              .subscribe(
                () => {
                  this.warning = "";
                  this.loading = false;
                  this.toastr.success("Ride Created");
                  this.authService.refreshToken().subscribe(
                    (refreshSuccess) => {
                      this.authService.setToken(refreshSuccess.token);                      
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
