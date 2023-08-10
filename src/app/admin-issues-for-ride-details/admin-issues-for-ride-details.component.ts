import { Component, Input } from '@angular/core';
import { Issue } from '../Ride';

@Component({
  selector: 'app-admin-issues-for-ride-details',
  templateUrl: './admin-issues-for-ride-details.component.html',
  styleUrls: ['./admin-issues-for-ride-details.component.css']
})
export class AdminIssuesForRideDetailsComponent{
  @Input() issue: Issue | undefined;

}
