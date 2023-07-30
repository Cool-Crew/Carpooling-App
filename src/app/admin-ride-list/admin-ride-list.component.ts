import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { RideList } from "../Ride";
import { RideService } from "../ride.service";
import { Ride } from '../Ride';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

interface Usernames {
  [key: string]: string;
}

@Component({
  selector: 'app-admin-ride-list',
  templateUrl: './admin-ride-list.component.html',
  styleUrls: ['./admin-ride-list.component.css']
})

export class AdminRideListComponent {
  rides:Ride[] | undefined = [];

  constructor(private rideService: RideService) { }

  async ngOnInit(): Promise<void> {
    let res: {message: String, _rides: [Ride]} | undefined = await this.rideService.getRides(); 
    this.rides = res?._rides;
    // replaced ids with usernames
    if (this.rides) {
      for (const ride of this.rides){

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

    

    console.log(res?._rides)
  }
  
  cancelRide(rideId: string): void {
    this.rideService.cancelRide(rideId).subscribe((response: any) => {
    }, (error: any) => {
    });
  }
}
