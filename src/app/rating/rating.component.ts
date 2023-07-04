import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SubmissionService } from "../submission.service";

@Component({
  selector: "app-rating",
  templateUrl: "./rating.component.html",
  styleUrls: ["./rating.component.css"],
})
export class RatingComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: SubmissionService
  ) {}
  rideId: number = 0;
  rideDate: string = "";
  rideStartLocation: string = "";
  rideEndLocation: string = "";
  textFeedback: string = "";
  errorMessage: string = "";
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.rideId = +params["id"];
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
  submitFeedback(): void {
    if (this.selectedStar === 0) {
      // A star rating has not been selected, show error message
      this.errorMessage = "Please select a star rating.";
      return;
    }
    console.log("Rating: ", this.selectedStar);
    console.log("Text Feedback: ", this.textFeedback);
    this.router.navigate(["/rideFeedback"]);
    this.notificationService.showNotification(
      "Feedback submitted successfully."
    );
    // Further logic for submitting the feedback can be added here
  }
}
