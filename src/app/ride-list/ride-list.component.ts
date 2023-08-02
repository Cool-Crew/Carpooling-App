import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { RideList } from "../Ride";
import { RideService } from "../ride.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NotificationsService } from "../notifications.service";

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
  warning = "";
  success = false;
  loading = false;

  constructor(
    private rideService: RideService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private notificationService: NotificationsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.authService.readToken();
    let res: { message: String; _rides: [RideList] } | undefined =
      await this.rideService.getUserRides(this.user._id);
    this.rides = res?._rides;
    this.rides?.forEach((r) => {
      r.statusString = r.status.replace(/_/g, " ");
      r.exactTime = r?.dateTime
        ? new Date(r.dateTime).toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
        : undefined;
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
        case "Not Completed":
          r.color = "blue";
          break;
        default:
          break;
      }
    });
  }

  cancelRide(rideId: string) {
    this.rideService.cancelRide(rideId).subscribe(
      (response) => {
        this.toastr.error("Ride Cancelled");
        const notificationData = {
          msg: `You have cancelled your ride.`,
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
              console.error("Error adding notification:", notificationError);
              this.warning = "Error adding notification";
              this.loading = false;
            }
          );
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
        this.toastr.success("Drive Offered!");
        const notificationData = {
          msg: `You have offered to drive to:\n ${dropoffLocation}\n`,
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
              console.error("Error adding notification:", notificationError);
              this.warning = "Error adding notification";
              this.loading = false;
            }
          );
      },
      (err) => {
        console.log("❗");
      }
    );

    //alert(`✅ You have offered to drive to:\n ${dropoffLocation}\n` + ``);
    this.reloadRideList(rideId);
  }

  onLeaveRideClick(rideId: string, isDriver: boolean) {
    console.log("👋");
    this.rideService.rmRiderFromRide(rideId, this.user?._id).subscribe(
      (response) => {
        this.toastr.error("Ride left");
        const notificationData = {
          msg: `You left the ride.`,
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
              console.error("Error adding notification:", notificationError);
              this.warning = "Error adding notification";
              this.loading = false;
            }
          );
        this.reloadRideList(rideId);
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
  completeRide(rideId: string) {
    this.rideService.completeRide(rideId).subscribe(
      (response) => {
        this.toastr.success("Ride Completed");
        const notificationData = {
          msg: `This ride has been marked as completed`,
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
              console.error("Error adding notification:", notificationError);
              this.warning = "Error adding notification";
              this.loading = false;
            }
          );
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

  async reloadRideList(rideId: string) {
    console.log("This is ride id", rideId);
    this.cardLoading = rideId;
    await this.ngOnInit();
    this.cardLoading = "";
    this.changeDetectorRef.detectChanges(); // Trigger change detection
  }
  onChatting(rideId: string, ride: any) {
    console.log(this.rides);
    const encodedRide = encodeURIComponent(JSON.stringify(ride));
    this.router.navigate(["/chat"], {
      queryParams: { id: rideId, ride: encodedRide },
    });
  }
}
