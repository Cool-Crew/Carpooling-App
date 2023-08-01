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
  range: number = -1;
  status: string = "All";
  riderFilter: string = "";
  creatorFilter: string = "";
  driverFilter: string = "";
  dateSortDirection: number = 0; // 0 = ascending, 1 = descending
  doFilter: string = "";

  constructor(private rideService: RideService) { }

  async ngOnInit(): Promise<void> {
    await this.getRides();
  }

  updateDateSort(): void {
    console.log(this.dateSortDirection)
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

        ride = await this.rideService.replaceIdsWithUsernames(ride);

      }

      this.rides = ridesHolder;
    }
  } 

  async updateFilters(): Promise<void> {
    await this.getRides();
    if (this.driverFilter != ""){
      this.updateDriver();
    }

    if (this.creatorFilter != ""){
      this.updateCreator();
    }

    if (this.riderFilter != ""){
      this.updateRiders();
    }

    if (this.status != "All"){
      this.updateStatus();
    }

    if (this.range != 333){
      this.updateRange();
    }

    if (this.doFilter != ""){
      this.updateDropoffFilter();
    }
  }

  async updateDropoffFilter(): Promise<void> {
    console.log('updateDo');
    //regex matching this.doFilter
    if (this.doFilter != ""){
      let regex = new RegExp(this.doFilter, 'i');
      
      //filter this.rides by this.doFilter
      this.rides = this.rides?.filter(ride => ride.dropoffLocation?.name && ride.dropoffLocation?.name.match(regex));
    }
    else {
      this.updateFilters();
    }
  }



  async updateDriver(): Promise<void> {
    console.log('updateDriver');
    //regex matching this.driverFilter
    if (this.driverFilter != ""){
      let regex = new RegExp(this.driverFilter, 'i');

      //filter this.rides by this.driverFilter
      this.rides = this.rides?.filter(ride => ride.driver && ride.driver.match(regex));
    }
    else {
      this.updateFilters();
    }
  }

  async updateRiders(): Promise<void> {
    console.log('updateRiders');
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
    } else {
      this.updateFilters();
    }
  }

  async updateCreator(): Promise<void> {
    console.log('updateCreator');
    //regex matching this.creatorFilter

    if (this.creatorFilter != ""){
      let regex = new RegExp(this.creatorFilter, 'i');

      //filter this.rides by this.creatorFilter
      this.rides = this.rides?.filter(ride => ride.creator.match(regex));
    }
    else {
      this.updateFilters();
    }

  }



  async updateStatus(): Promise<void> {

    if (this.status == "All"){
      this.getRides();
      this.updateFilters();
    }
    else {
      this.rides = this.rides?.filter(ride => ride.status == this.status);
    }

  }

  async updateRange(): Promise<void> {

    await this.getRides();
    console.log(this.range);

    //if range = -1, show all future rides
    if (this.range == -1){
      let now = new Date();
      this.rides = this.rides?.filter(ride => {
        
        return ride.dateTime && ride.dateTime > now
        
      });

      console.log(this.rides);
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
