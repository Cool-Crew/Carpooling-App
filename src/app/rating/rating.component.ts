import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { RideService } from "../ride.service";
import { ToastrService } from "ngx-toastr";
import { NotificationsService } from "../notifications.service";

@Component({
  selector: "app-rating",
  templateUrl: "./rating.component.html",
  styleUrls: ["./rating.component.css"],
})
export class RatingComponent {
  warning = "";
  success = false;
  loading = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rideService: RideService,
    private authService: AuthService,
    private toastr: ToastrService,
    private notificationService: NotificationsService,

  ) {}
  @Input() rideId: string = "";
  user: any;
  textFeedback: string = "";
  errorMessage: string = "";
  @Input() ratingValue: number = 0;
  @Output() ratingChange = new EventEmitter<number>();
  @Output() feedbackSubmitted = new EventEmitter<void>();
  stars: number[] = [1, 2, 3, 4, 5];
  selectedStar: number = 0;
  hoveredStar?: number;

  selectStar(star: number) {
    this.selectedStar = star;
  }

  hoverStar(star: number) {
    this.hoveredStar = star;
  }

  resetStars() {
    this.hoveredStar = undefined;
  }

  setRating(rating: number): void {
    this.ratingValue = rating;
    this.ratingChange.emit(rating);
  }
  submitFeedback(rideId: string | null): void {
    if (this.selectedStar === 0) {
      // A star rating has not been selected, show error message
      this.errorMessage = "Please select a star rating.";
      return;
    }
    this.user = this.authService.readToken();
    this.rideService
      .addFeedback(this.user._id, this.selectedStar, this.textFeedback, rideId)
      .subscribe(
        (response) => {
          //alert("✅ Your Feedback has been submitted");
          this.toastr.success("Feedback submitted!");
        const notificationData = {
          msg: `Your Feedback was submitted.`,
          dateTime: Date.now(),
          category: "General",
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
          this.feedbackSubmitted.emit();
        },
        (err) => {
          //alert("❗ There was an issue registering the feedback");
          this.toastr.error("Error submitting feedback.");
          this.feedbackSubmitted.emit();
        }
      );
    this.errorMessage = "";
  }
}
