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

  constructor(private rideService: RideService) { }

  async getRides(): Promise<void> {
    let res: {message: String, _rides: [Ride]} | undefined = await this.rideService.getRides(); 
    this.rides = res?._rides;
    // replaced ids with usernames
    if (this.rides) {
        // Sort rides by date
        this.rides.sort((a, b) => {
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

      for (const ride of this.rides){
        //convert dateTime to actual date object
        if (ride.dateTime){
          ride.dateTime = new Date(ride.dateTime);
        }

        // get username for creator
        let res: {message: string, _usernames: Usernames} | undefined = await this.rideService.getUsernames(ride.creator);
        if (res){
          ride.creator = res._usernames[ride.creator];
        }

        //get username for driver
        if (ride.driver){
          let res: {message: string, _usernames: Usernames} | undefined = await this.rideService.getUsernames(ride.driver);
          if (res){
            ride.driver = res._usernames[ride.driver];
          }
        }

        //get username for riders
        if (ride.riders){
          for (const rider of ride.riders){
            let res: {message: string, _usernames: Usernames} | undefined = await this.rideService.getUsernames(rider.riderID);
            if (res){
              rider.riderID = res._usernames[rider.riderID];
            }
          }
        }
      }
    }
  }  

  async ngOnInit(): Promise<void> {
    await this.getRides();
  }

  async updateStatus(): Promise<void> {
    await this.getRides();

    if (this.status == "All"){
      //no filter
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
