import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { RideList } from "../Ride";
import { RideService } from "../ride.service";
import { Ride, Status } from '../Ride';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

interface Usernames {
  [key: string]: string;
}

enum ActionSelector {
  Cancel = "Cancel",
  View = "View",
}

@Component({
  selector: 'app-admin-ride-list',
  templateUrl: './admin-ride-list.component.html',
  styleUrls: ['./admin-ride-list.component.css']
})

export class AdminRideListComponent {
  rides:Ride[] | undefined = [];
  action: ActionSelector = ActionSelector.View;
  range: number = 7; //-1 = all future rides, 0 = today, 7 = last 7 days, 30 = last 30 days, 180 = last 180 days, 365 = last 365 days
  status: string = "All";
  riderFilter: string = "";
  creatorFilter: string = "";
  driverFilter: string = "";
  dateSortDirection: number = 0; // 0 = ascending, 1 = descending
  doFilter: string = "";
  ratingFilter: number = -1;
  issueFilter: string = "All";

  filteredRides: Ride[] | undefined = [];

  initialized: boolean = false;

  constructor(private rideService: RideService) { }

  async ngOnInit(): Promise<void> {
    await this.updateFilters();
    this.initialized = true;
  }

  updateDateSort(): void {
    if (this.dateSortDirection === 0) {
      this.dateSortDirection = 1;
    } else {
      this.dateSortDirection = 0;
    }
    
    if (this.dateSortDirection === 0) {
      this.rides?.sort((a, b) => {
        const aDateTime = a.dateTime ?? ""; // Provide a default value if a.dateTime is undefined
        const bDateTime = b.dateTime ?? ""; // Provide a default value if b.dateTime is undefined
        
        if (aDateTime < bDateTime) {
          return -1;
        } else if (aDateTime > bDateTime) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      this.rides?.sort((a, b) => {
        const aDateTime = a.dateTime ?? ""; // Provide a default value if a.dateTime is undefined
        const bDateTime = b.dateTime ?? ""; // Provide a default value if b.dateTime is undefined

        if (aDateTime < bDateTime) {
          return 1;
        } else if (aDateTime > bDateTime) {
          return -1;
        } else {
          return 0;
        }
      });
    }
  }

  async getRides(): Promise<void> {
    let res: {message: String, _rides: [Ride]} | undefined = await this.rideService.getRides(); 
    // this.rides = res?._rides;
    let ridesHolder = res?._rides;
    // replaced ids with usernames
    if (ridesHolder) {
        // Sort rides by date
        ridesHolder.sort((a, b) => {
          const aDateTime = a.dateTime ?? ""; // Provide a default value if a.dateTime is undefined
          const bDateTime = b.dateTime ?? ""; // Provide a default value if b.dateTime is undefined

          if (aDateTime < bDateTime) {
            return -1;
          } else if (aDateTime > bDateTime) {
            return 1;
          } else {
            return 0;
          }
      });

      for (let ride of ridesHolder){
        //convert dateTime to actual date object
        if (ride.dateTime){
          ride.dateTime = new Date(ride.dateTime);
        }

        //get avg rating
        this.setAvgRating(ride);

        ride = await this.rideService.replaceIdsWithUsernames(ride);

      }

      this.rides = ridesHolder;
    }
  } 

  setAvgRating(ride: Ride): void {
    let sum = 0;
    let count = 0;
    if (ride.feedback) {
      for (let feedback of ride.feedback) {
        sum += feedback.rating;
        count++;
      }
    }

    if (count > 0) {
      ride.avgFeedbackRating = sum / count;
    }
    
    return;
  }


  async updateFilters(): Promise<void> {
    await this.getRides();

    if (this.range != 333){
      await this.updateRange();
    }

    if (this.driverFilter != ""){
      console.log("updating driver from updateFilters()")
      await this.updateDriver();
    }

    if (this.creatorFilter != ""){
      console.log("updating creator from updateFilters()")
      await this.updateCreator();
    }

    if (this.riderFilter != ""){
      console.log("updating rider from updateFilters()")
      await this.updateRiders();
    }

    if (this.status != "All"){
      console.log("updating status from updateFilters()")
      await this.updateStatus();
    }

    if (this.doFilter != ""){
      console.log("updating dropoff from updateFilters()")
      await this.updateDropoffFilter();
    }

    if (this.issueFilter != "All"){
      console.log("updating issues from updateFilters()")
      await this.updateIssues();
    }

    if (this.ratingFilter != -1){
      console.log("updating rating from updateFilters()")
      await this.updateRating();
    }

    this.filteredRides = this.rides;
  }

  async updateIssues(): Promise<void> {
    //filter this.rides by this.issueFilter
    //if ride.issue contains an issue with a category matching this.issueFilter, keep it
    //else, remove it
    if (this.issueFilter != "All"){
      let regex = new RegExp(this.issueFilter, 'i');
      this.rides = this.rides?.filter(ride => ride.issue?.some(issue => issue.category.match(regex)));
      this.filteredRides= this.rides;
    }
    else {
      this.updateFilters();
    }
  }

  async updateDropoffFilter(): Promise<void> {
    //regex matching this.doFilter
    if (this.doFilter != ""){
      let regex = new RegExp(this.doFilter, 'i');
      
      //filter this.rides by this.doFilter
      this.rides = this.rides?.filter(ride => ride.dropoffLocation?.name && ride.dropoffLocation?.name.match(regex));
      this.filteredRides= this.rides;
    }
    else if (this.initialized){
      this.updateFilters();
    }

    return;
  }

  async updateDriver(): Promise<void> {
    //regex matching this.driverFilter
    if (this.driverFilter != ""){
      let regex = new RegExp(this.driverFilter, 'i');

      //filter this.rides by this.driverFilter
      this.rides = this.rides?.filter(ride => ride.driver && ride.driver.match(regex));
      this.filteredRides= this.rides;
    }
    else if (this.initialized){
      this.updateFilters();
    }
  }

  async updateRiders(): Promise<void> {
   if (this.riderFilter != ""){
      //filter this.rides riders in the ride
      this.rides = this.rides?.filter(ride => ride.riders && ride.riders.length > 0);
      //regex matching this.riderFilter
      let regex = new RegExp(this.riderFilter, 'i');

      //filter this.rides riders by this.riderFilter
      this.rides = this.rides?.filter(ride => {
        if (ride.riders){
          for (const rider of ride.riders){
            if (rider.riderID.match(regex)){
              return true;
            }
          }
        }
        return false;
      });

      this.filteredRides= this.rides;
    } else if (this.initialized){
      this.updateFilters();
    }
  }

  async updateCreator(): Promise<void> {
    //regex matching this.creatorFilter

    if (this.creatorFilter != ""){
      let regex = new RegExp(this.creatorFilter, 'i');

      //filter this.rides by this.creatorFilter
      this.rides = this.rides?.filter(ride => ride.creator.match(regex));
      this.filteredRides= this.rides;
    }
    else if (this.initialized){
      this.updateFilters();
    }

  }

  async updateStatus(): Promise<void> {

    if (this.status == "All" && !this.initialized){
      this.updateFilters();
    }
    else {
      this.rides = this.rides?.filter(ride => ride.status == this.status);
      this.filteredRides= this.rides;
    }

  }

  async updateRating(): Promise<void> {
    if (this.ratingFilter != -1){
      this.updateFilters();
      //filter this.rides by this.rating
      //if ride.avgFeedbackRating has the same first digit as this.rating, keep it
      //else, remove it
      this.rides = this.rides?.filter(ride => {
        if (ride.avgFeedbackRating){
          let firstDigit = Math.floor(ride.avgFeedbackRating);
          return firstDigit == this.ratingFilter;
        }
        return false;
      });
      this.filteredRides= this.rides;
    } else {
      this.updateFilters();
    }
  }

  async updateRange(): Promise<void> {

    await this.getRides();

    //if range = -1, show all future rides
    if (this.range == -1){
      let now = new Date();
      this.rides = this.rides?.filter(ride => {
        
        return ride.dateTime && ride.dateTime > now
        
      });
    }

    //if range = 333, show all rides
    if (this.range == 333){
      //no filter
    }

    //if range = 1, show rides today
    if (this.range == 0){
      let now = new Date();
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
      this.rides = this.rides?.filter(ride => ride.dateTime && (ride.dateTime >= today) && (ride.dateTime < tomorrow));
    }

    //if range = 7, show rides from the last 7 days
    if (this.range == 7){
      let now = new Date();
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate()-7);
      this.rides = this.rides?.filter(ride => ride.dateTime && (ride.dateTime >= lastWeek) && (ride.dateTime < today));
    }

    //if range = 30, show rides from the last 30 days
    if (this.range == 30){
      let now = new Date();
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let lastMonth = new Date(now.getFullYear(), now.getMonth()-1, now.getDate());
      this.rides = this.rides?.filter(ride => ride.dateTime && (ride.dateTime >= lastMonth) && (ride.dateTime < today));
    }

    //if range = 180, show rides from the last 180 days
    if (this.range == 180){
      let now = new Date();
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let lastMonth = new Date(now.getFullYear(), now.getMonth()-6, now.getDate());
      this.rides = this.rides?.filter(ride => ride.dateTime && (ride.dateTime >= lastMonth) && (ride.dateTime < today));
    }

    //if range = 365, show rides from the last 365 days
    if (this.range == 365){
      let now = new Date();
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let lastMonth = new Date(now.getFullYear()-1, now.getMonth(), now.getDate());
      this.rides = this.rides?.filter(ride => ride.dateTime && (ride.dateTime >= lastMonth) && (ride.dateTime < today));
    }
    this.filteredRides= this.rides;
  }
  
  cancelRide(rideId: string): void {

    //check if ride is already cancelled
    let ride = this.rides?.find(ride => ride._id == rideId);
    if (ride?.status == "Cancelled"){
      alert("Ride is already cancelled");
      return;
    }

    this.rideService.cancelRide(rideId).subscribe((response: any) => {
    }, (error: any) => {
    });

    //update ride status in this.rides
    if (this.rides){
      for (const ride of this.rides){
        if (ride._id == rideId){
          ride.status = Status.Cancelled;
        }
      }
    }
  }
}
