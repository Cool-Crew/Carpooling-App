import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface Ride {
  _id: string;
  driver: string;
  driverStartLocation: string;
  status: string
}

@Component({
  selector: 'app-rides',
  templateUrl: './rides.component.html',
  styleUrls: ['./rides.component.css']
})
export class RidesComponent implements OnInit {
  rides: Ride[] = [];
  selectedRide: Ride | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getRides();
  }

  getRides() {
    console.log('getting rides')
    this.http.get<any>(`${environment.userAPIBase}/rides`).subscribe(
      (response) => {
        this.rides = response._rides;
        console.log('Rides Retrieved:', this.rides);
        
      },
      (error) => {
        console.error('Error retrieving rides:', error);
      }
    );
  }

  createFakeRide() {
    const fakeRide = {
      driver: 'John Doe',
      driverStartLocation: '123 Main Street',
      riders: [
        {
          riderID: 'Rider1',
          pickupLocation: [
            {
              address: '456 Elm Street',
              location: {},
              name: 'Pickup Location 1'
            }
          ]
        },
        {
          riderID: 'Rider2',
          pickupLocation: [
            {
              address: '789 Oak Street',
              location: {},
              name: 'Pickup Location 2'
            }
          ]
        }
      ],
      dropoffLocation: {
        address: '321 Maple Avenue',
        location: {},
        name: 'Dropoff Location'
      },
      dateTime: new Date(),
      chat: [],
      status: 'Not_Started'
    };
  
    // Send a POST request to register the fake ride
    this.http.post<Ride>(`${environment.userAPIBase}/register-ride`, fakeRide).subscribe(
      (response) => {
        this.selectedRide = response;
        console.log('Fake Ride Created:', this.selectedRide);
      },
      (error) => {
        console.error('Error creating fake ride:', error);
      }
    );
  }

  cancelRide(rideId: string) {
    this.http.patch<any>(`${environment.userAPIBase}/rides/${rideId}/cancel`, {}).subscribe(
      (response) => {
        console.log('Ride Cancelled:', response);
      },
      (error) => {
        console.error('Error cancelling ride:', error);
      }
    );
  }
}
