import { Component } from '@angular/core';
import { RideService } from '../ride.service'
import {Ride} from '../Ride';

@Component({
  selector: 'app-rides',
  templateUrl: './rides.component.html',
  styleUrls: ['./rides.component.css']
})
export class RidesComponent{
  pickupLocation: string = '';
  dropoffLocation: string = '';
  selectedDate: string = '';
  selectedTime: string = '';
  riderDriver: string = '';
  searchRange: string = '';

  constructor(private rserv: RideService) {}

  onSubmit() {

    if (this.pickupLocation && 
      this.dropoffLocation && 
      this.selectedDate && 
      this.selectedTime
    ) {

      let nr = new Ride();
      nr.riders = [{riderID: 'rider1', pickupLocation: this.pickupLocation}];
      nr.dropoffLocation = this.dropoffLocation;
      nr.dateTime = new Date(`${this.selectedDate}T${this.selectedTime}`);


      this.rserv.createNewRide(nr).subscribe(
        (success) => {
          console.log('✅ - new ride registered! Huzzah!');
        },
        (err) => {
          console.log('❗ - unable to create new ride\n' + err)
        }
      )
    }
    
  }

}


