import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { RideService } from "../ride.service";

@Component({
  selector: "app-rating",
  templateUrl: "./rating.component.html",
  styleUrls: ["./rating.component.css"],
})
export class RatingComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rideService: RideService,
    private authService: AuthService
  ) {}
  rideId: string | null = "";
  rideDate: string = "";
  user: any;
  rideStartLocation: string = "";
  rideEndLocation: string = "";
  textFeedback: string = "";
  errorMessage: string = "";
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.rideId = this.route.snapshot.paramMap.get("id");
      this.rideDate = params["date"];
      this.rideStartLocation = params["startLocation"];
      this.rideEndLocation = params["endLocation"];
    });
  }
  @Input() ratingValue: number = 0;
  @Output() ratingChange = new EventEmitter<number>();
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
          alert("✅ Your Feedback has been submitted");
        },
        (err) => {
          alert("❗ There was an issue registering the feedback");
        }
      );
    this.router.navigate(["/myRides"]);
  }
}
