import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ride, StopLocation } from '../Ride';
import { RideService } from '../ride.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ride-card',
  styleUrls: ['./ride-card.component.css'],
  template: `
    <div class="card">
      <div class="card-header">
        <p><b>Ride._id:</b> {{ ride?._id }}</p>
      </div>
      <div class="card-body" (click)="onRideClick()">
        <p><b>Destination:</b> {{ ride?.dropoffLocation?.address }}</p>
        <p><b>Capacity:</b> {{ riderCount }}/3</p>

        <div class="time-date">
          <label><b>Time:</b></label>
          <p>{{ rideDate?.getHours() }}:{{ rideDate?.getMinutes() }}</p>
          <label><b>Date:</b></label>
          <p>{{ rideDate?.getDay() }}-{{ rideDate?.getMonth() }}-{{ rideDate?.getFullYear() }}</p>
        </div>
        
        <p></p>
        <button *ngIf="needsDriver" (click)="onDriverNeededClick()">Offer To Drive</button>
        <button *ngIf="roomAvailable" (click)="onJoinRideClick()" >Join Ride</button>
      </div>
    </div>
  `
})
export class RideCardComponent implements OnInit {

  user:any;

  rideDate: Date | undefined;
  riderCount: number | undefined;
  needsDriver: boolean | undefined = false;
  roomAvailable: boolean = false;
  endLocation: StopLocation | undefined;
  endLocationMarker: {lat: number, lng: number} | undefined;

  @Input() ride: Ride | undefined;
  @Output() newRideEvent = new EventEmitter<{lat: number, lng: number}>();
  emitLocation() {
    this.newRideEvent.emit(this.endLocationMarker);
  }

  constructor(
    private rideService: RideService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.readToken();

    let dateTimeStr = this.ride?.dateTime;
    if (dateTimeStr) {
      this.rideDate = new Date(dateTimeStr);
    }

    this.riderCount = this.ride?.riders?.length;
    if (this.riderCount){
      if (this.riderCount < 3){
        this.roomAvailable = true;
      }
    }

    if (!this.ride?.driver) {
      this.needsDriver = true;
    }

    this.endLocation = this.ride?.dropoffLocation;

    this.endLocationMarker = this.endLocation?.location;
  }

  onDriverNeededClick() {
    // TODO: set user as driver of the ride after confirming

    this.rideService.registerDriverToRide(this.ride?._id, this.user?._id).subscribe(
      (response) => {
        console.log('✅')
      },
      (err) => {
        console.log('❗')
      }
    )

    alert(
      `✅ You have offered to drive to:\n ${this.ride?.dropoffLocation?.address}\n` +
      ``
      );
  }

  onJoinRideClick() {
    //TODO: set user as new rider after confirming
    alert('✅ Join ride?');
  }

  onRideClick() {
    this.emitLocation();
  }
}
