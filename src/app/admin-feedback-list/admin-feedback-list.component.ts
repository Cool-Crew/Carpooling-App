import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { RideList } from "../Ride";
import { RideService } from "../ride.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: 'app-admin-feedback-list',
  templateUrl: './admin-feedback-list.component.html',
  styleUrls: ['./admin-feedback-list.component.css']
})
export class AdminFeedbackListComponent implements OnInit {
  feedbacks: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5; 
  totalItems: number = 0;
  totalPages: number = 0;
  displayedFeedbacks: any[] = [];

  constructor(private rideService: RideService) { }

  ngOnInit(): void {
    this.rideService.getFeedback().subscribe(
      (response: any) => {
        this.feedbacks = response._feedback;
        console.log(this.feedbacks);
        this.totalItems = this.feedbacks.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updateDisplayedFeedbacks();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  //pagination methods
  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.updateDisplayedFeedbacks();
  }

  updateDisplayedFeedbacks(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedFeedbacks = this.feedbacks.slice(startIndex, endIndex);
    console.log(this.displayedFeedbacks);
  }

  getPageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((_, index) => index + 1);
  }

  updateItemsPerPage(): void { 
    this.currentPage = 1;
    this.updateDisplayedFeedbacks();
  }
}
