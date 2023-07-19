import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { RideList } from "../Ride";
import { RideService } from "../ride.service";
import { Ride } from '../Ride';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

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
    console.log(res?._rides)
  }
  
  cancelRide(rideId: string): void {
    this.rideService.cancelRide(rideId).subscribe((response: any) => {
      // Handle cancellation success or display a notification to the user
    }, (error: any) => {
      // Handle cancellation error or display an error message to the user
    });
  }
}
