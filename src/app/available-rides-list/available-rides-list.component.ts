import { Component, EventEmitter, OnInit, Output, } from '@angular/core';
import { RideService } from '../ride.service';
import { Ride } from '../Ride';


@Component({
  selector: 'app-available-rides-list',
  templateUrl: './available-rides-list.component.html',
  styleUrls: ['./available-rides-list.component.css']
})
export class AvailableRidesListComponent implements OnInit{
  rides:Ride[] | undefined = [];
  selectedRide: Ride | undefined;
  selectedRideEnd: {lat: number, lng: number} | undefined;

  @Output() passLocation = new EventEmitter<{lat: number, lng: number}>

  constructor(
    private rideService: RideService,
  ) {}
  
  async ngOnInit(): Promise<void> {
    //API call for rides
    let res: {message: String, _rides: [Ride]} | undefined = await this.rideService.getRides();
    this.rides = res?._rides;
  }

  //gets location from ride-card, which is used in putting a pinpoint on map for the dropoff location of the ride
  rideSelected(location: {lat: number, lng: number}){
    this.passLocationUp(location);
  }

  //passes the location up to rides
  passLocationUp(location: {lat: number, lng: number}){
    this.passLocation.emit(location);
  }

}
