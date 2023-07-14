import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
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


  @Input() searchParams: {date: Date | undefined} | undefined;
  @Output() passLocation = new EventEmitter<{lat: number, lng: number}>
  

  constructor(
    private rideService: RideService,
  ) {}

  async refreshRides(){
    this.ngOnInit();
  }
  
  async ngOnInit(): Promise<void> {
    //API call for rides
    let res: {message: String, _rides: [Ride]} | undefined = await this.rideService.getRides(); 
    this.rides = res?._rides;
    //filter this.rides by ride.status === "Not_Started"
    this.rides = this.rides?.filter(ride => ride.status === "Not_Started");

    //filter this.rides by date in searchParams, but not the time portion of the date
    if(this.searchParams?.date){
      this.rides = this.rides?.filter(ride => {
        let rideDateStr = ride?.dateTime;
        var rideDate: Date | undefined;
        if (typeof rideDateStr === 'string') {
          rideDate = new Date(rideDateStr);
        }

        //filter the rides by date and within 2hr before or 1hr after the search datetime
        if (rideDate && this.searchParams?.date) {
          return rideDate?.getFullYear() === this.searchParams?.date?.getFullYear() &&
          rideDate?.getMonth() === this.searchParams?.date?.getMonth() &&
          rideDate?.getDate() === this.searchParams?.date?.getDate() &&
          rideDate?.getHours() >= this.searchParams?.date?.getHours() - 2 &&
          rideDate?.getHours() <= this.searchParams?.date?.getHours() + 1;
        }
        //possible fail-point, no issues in testing so far
        return false;

      });
    }
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
