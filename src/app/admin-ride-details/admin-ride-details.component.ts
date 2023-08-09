import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { RideService } from '../ride.service';
import { Feedback, Issue, Ride } from '../Ride';

@Component({
  selector: 'app-admin-ride-details',
  templateUrl: './admin-ride-details.component.html',
  styleUrls: ['./admin-ride-details.component.css']
})
export class AdminRideDetailsComponent implements OnInit {
  rideId = this.route.snapshot.paramMap.get('id');
  ride: Ride | undefined;
  rideDate: Date | undefined;
  dateStr: string | undefined;
  timeStr: string | undefined;
  riderCount: number = 0;
  rideFeedbacks: Feedback[] | undefined;
  rideIssues: Issue[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private rideService: RideService,
    ) {}

  async ngOnInit(): Promise<void> {
    //get ride with rideId
    await this.getRide();
    //set feedback
    await this.setFeedback();
    await this.setIssues();

    console.log(this.ride);
  }

  async getRide(): Promise<void> {
    let holder = await this.rideService.getRide(this.rideId);
    if (holder) {
      this.ride = await this.rideService.replaceIdsWithUsernames(holder._ride);
    }

    //cleaning date and time
    await this.cleanDateTime();
    
  }

  async cleanDateTime(): Promise<void> {
    let dateTimeStr = this.ride?.dateTime;

    if (dateTimeStr) {
      this.rideDate = new Date(dateTimeStr);
    }
    //setting date string for display
    var monthName: string | undefined;
    switch (this.rideDate?.getMonth()) {
      case 0:
        monthName = 'January';
        break;
      case 1:
        monthName = 'February';
        break;
      case 2:
        monthName = 'March';
        break;
      case 3:
        monthName = 'April';
        break;
      case 4:
        monthName = 'May';
        break;
      case 5:
        monthName = 'June';
        break;
      case 6:
        monthName = 'July';
        break;
      case 7:
        monthName = 'August';
        break;
      case 8:
        monthName = 'September';
        break;
      case 9:
        monthName = 'October';
        break;
      case 10:
        monthName = 'November';
        break;
      case 11:
        monthName = 'December';
        break;
      default:
        monthName = '';
        break;
    }
    this.dateStr = `${this.rideDate?.getDate()} ${monthName}, ${this.rideDate?.getFullYear()}`;

    //setting time string for display
    if (this.rideDate){
      let hour = this.rideDate?.getHours();
      let minute = this.rideDate?.getMinutes();
      let ampm = hour >= 12 ? 'pm' : 'am';
      hour = hour % 12;
      hour = hour ? hour : 12;

      //formatting for 12hr clock
      if (hour < 10){
        this.timeStr = `0${hour}:`;
      } else {
        this.timeStr = `${hour}:`;
      }
      if (minute < 10){
        this.timeStr += `0${minute} ${ampm}`;
      }else {
        this.timeStr += `${minute} ${ampm}`;
      }
    }

    //count number of riders
    this.ride?.riders.forEach(rider => {
      this.riderCount++;
    });

    //swap rider, driver, and creator IDs for usernames
    
  }

  async setFeedback(): Promise<void> {
    // for (let fb of this.ride?.feedback ?? []) {
    //   if (fb.feedback) this.rideFeedbacks?.push(fb);
    // }
    this.rideFeedbacks = this.ride?.feedback;
  }

  async setIssues(): Promise<void> {
    this.rideIssues = this.ride?.issue;
  }

}
