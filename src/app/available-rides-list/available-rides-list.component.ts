import { Component, OnInit } from '@angular/core';
import { RideService } from '../ride.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Ride } from '../Ride';

@Component({
  selector: 'app-available-rides-list',
  templateUrl: './available-rides-list.component.html',
  styleUrls: ['./available-rides-list.component.css']
})
export class AvailableRidesListComponent implements OnInit{
  rides:Ride[] | undefined = [];

  constructor(
    private rideService: RideService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  async ngOnInit(): Promise<void> {
    //API call for rides
    let res: {message: String, _rides: [Ride]} | undefined = await this.rideService.getRides();
    this.rides = res?._rides;
  }

}
