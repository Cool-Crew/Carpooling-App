import { Component, Input } from '@angular/core';
import { Feedback } from '../Ride';

@Component({
  selector: 'app-admin-feedback-for-ride-details',
  templateUrl: './admin-feedback-for-ride-details.component.html',
  styleUrls: ['./admin-feedback-for-ride-details.component.css']
})
export class AdminFeedbackForRideDetailsComponent {
  @Input() feedback: Feedback | undefined;
  message: string | undefined = "There is no feedback for this ride."

}
