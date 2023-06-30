import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-rating",
  templateUrl: "./rating.component.html",
  styleUrls: ["./rating.component.css"],
})
export class RatingComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  rideId: number = 0;
  rideDate: string = "";
  rideStartLocation: string = "";
  rideEndLocation: string = "";
  textFeedback: string = "";
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
    // Here, you can access the selected rating and text feedback
    console.log("Rating: ", this.selectedStar);
    console.log("Text Feedback: ", this.textFeedback);

    // Further logic for submitting the feedback can be added here
  }
}
