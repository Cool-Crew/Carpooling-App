import { Component, Input, OnInit } from '@angular/core';
import { Ride } from '../Ride';

@Component({
  selector: 'app-ride-card',
  styleUrls: ['./ride-card.component.css'],
  template: `
    <div class="card">
      <div class="card-header">
        <p>Ride._id: {{ ride?._id }}</p>
      </div>
      <div class="card-body">
        <p>Time: {{ rideDate?.getHours() }}:{{ rideDate?.getMinutes() }}</p>
        <p>Date: {{ rideDate?.getDay() }}-{{ rideDate?.getMonth() }}-{{ rideDate?.getFullYear() }}</p>
        <p>Capacity: {{ riderCount }}/3</p>
        <p>Destination: {{ ride?.dropoffLocation?.address }}</p>
        <p></p>
        <button *ngIf="needsDriver" (click)="onDriverNeededClick()">Driver Needed!</button>
        <button *ngIf="roomAvailable" (click)="onJoinRideClick()" >Join Ride</button>
      </div>
    </div>
  `
})
export class RideCardComponent implements OnInit {

  rideDate: Date | undefined;
  riderCount: number | undefined;
  needsDriver: boolean | undefined = false;
  roomAvailable: boolean = false;

  @Input() ride: Ride | undefined;

  ngOnInit(): void {
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

    if (!this.ride?.dropoffLocation) {
      this.needsDriver = true;
    }
  }

  onDriverNeededClick() {
    // TODO: set user as driver of the ride after confirming
    alert('✅ Driver offered?');
  }

  onJoinRideClick() {
    //TODO: set user as new rider after confirming
    alert('✅ Join ride?');
  }
}
