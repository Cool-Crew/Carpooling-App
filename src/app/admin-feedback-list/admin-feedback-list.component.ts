import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { RideList } from "../Ride";
import { RideService } from "../ride.service";

@Component({
  selector: 'app-admin-feedback-list',
  templateUrl: './admin-feedback-list.component.html',
  styleUrls: ['./admin-feedback-list.component.css']
})
export class AdminFeedbackListComponent implements OnInit {
  feedbacks: any[] = [];
  displayedFeedbacks: any[] = [];
  range: number = 666;
  currentPage: number = 1;
  itemsPerPage: number = 5; 
  totalItems: number = 0;
  totalPages: number = 0;
  submitterFilter: string = "";
  creatorFilter: string = "";
  driverFilter: string = "";
  categoryOptions: string[] = [
    "All",
    "General Feedback",
    "Ride Feedback",
    "Driver Feedback",
    "Issue During Ride",
    "Riders Feedback",
  ];
  selectedCategory: string = "All"

  constructor(private rideService: RideService) { }

  async getFeedbacks(): Promise<void>{
    this.rideService.getFeedback().subscribe(
      (response: any) => {
        this.feedbacks = response._feedback;
        this.displayedFeedbacks = this.feedbacks
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  async ngOnInit(): Promise<void> {
    await this.getFeedbacks();
  }

  async updateFilters(): Promise<void> {
    await this.getFeedbacks();
    if (this.driverFilter != ""){
      this.updateDriver();
    }

    if (this.creatorFilter != ""){
      this.updateCreator();
    }

    if (this.submitterFilter != ""){
      this.updateSubmitter();
    }

    if (this.range != 666){
      this.updateRange();
    }
  }

  async updateRange(): Promise<void> {
    if (this.range == 0){
      let now = new Date();
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
      this.displayedFeedbacks = this.feedbacks?.filter(feedback => feedback.dateTime && (feedback.dateTime >= today) && (feedback.dateTime < tomorrow));
    }

    if (this.range == 666)
    {
      await this.getFeedbacks();
    }

    //if range = 7, show feedbacks from the last 7 days
    if (this.range == 7){
      let now = new Date();
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate()-7);
      this.displayedFeedbacks = this.feedbacks?.filter(feedback => feedback.dateTime && (feedback.dateTime >= lastWeek) && (feedback.dateTime < today));
    }

    //if range = 30, show feedbacks from the last 30 days
    if (this.range == 30){
      let now = new Date();
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let lastMonth = new Date(now.getFullYear(), now.getMonth()-1, now.getDate());
      this.displayedFeedbacks = this.feedbacks?.filter(feedback => feedback.dateTime && (feedback.dateTime >= lastMonth) && (feedback.dateTime < today));
    }

    //if range = 180, show feedbacks from the last 180 days
    if (this.range == 180){
      let now = new Date();
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let lastMonth = new Date(now.getFullYear(), now.getMonth()-6, now.getDate());
      this.displayedFeedbacks = this.feedbacks?.filter(feedback => feedback.dateTime && (feedback.dateTime >= lastMonth) && (feedback.dateTime < today));
    }

    //if range = 365, show feedbacks from the last 365 days
    if (this.range == 365){
      let now = new Date();
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let lastMonth = new Date(now.getFullYear()-1, now.getMonth(), now.getDate());
      this.displayedFeedbacks = this.feedbacks?.filter(feedback => feedback.dateTime && (feedback.dateTime >= lastMonth) && (feedback.dateTime < today));
    }
  }
  async updateDriver(): Promise<void> {
    console.log('updateDriver');
    //regex matching this.driverFilter
    if (this.driverFilter != ""){
      let regex = new RegExp(this.driverFilter, 'i');

      this.displayedFeedbacks = this.feedbacks?.filter(feedback => feedback.driver && feedback.driver.match(regex));
    }
    else {
      this.updateFilters();
    }  
  }

  async updateSubmitter(): Promise<void> {
    console.log('updateSubmitter');
   if (this.submitterFilter != ""){
      //filter this.feedbacks submitter in the ride
      //regex matching this.submitterFilter
      let regex = new RegExp(this.submitterFilter, 'i');

      //filter this.feedback riders by this.submitterFilter
      this.displayedFeedbacks = this.feedbacks?.filter(feedback => feedback.rider.match(regex));
    }
    else {
      this.updateFilters();
    }
  }

  async updateCreator(): Promise<void> {
    console.log('updateCreator');
    //regex matching this.creatorFilter
    if (this.creatorFilter != ""){
      let regex = new RegExp(this.creatorFilter, 'i');

      //filter this.feedbacks by this.creatorFilter
      this.displayedFeedbacks = this.feedbacks?.filter(feedback => feedback.creator.match(regex));
    }
    else {
      //get all feedbacks back when no regex
      this.updateFilters();
    }
  }

  async updateCategoryFilter(): Promise<void> {
    if (this.selectedCategory == "All") {
      await this.getFeedbacks()
    }
    else{
      this.displayedFeedbacks = this.feedbacks?.filter(
        (feedback) => feedback.category ==  this.selectedCategory
      );
    }
  }
}
