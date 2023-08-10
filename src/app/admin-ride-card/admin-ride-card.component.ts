import { Component, Input, OnInit } from '@angular/core';
import { Ride } from '../Ride';
import { StopLocationInfo } from '../rides/rides.component';

@Component({
  selector: 'app-admin-ride-card',
  templateUrl: './admin-ride-card.component.html',
  styleUrls: ['./admin-ride-card.component.css']
})
export class AdminRideCardComponent implements OnInit{
  @Input() ride: Ride | undefined;
  @Input() dateStr: string | undefined;
  @Input() timeStr: string | undefined;
  @Input() riderCount: number | undefined;

  
  
  constructor() { }

  async ngOnInit(): Promise<void> {
        
  }
}
// 