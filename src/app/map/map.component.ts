import { Component, Input, OnInit } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map: any;
  @Input() pinLocation:{lat:number,lng:number} | undefined;

  ngOnInit() {

    this.initMap();
  }

  //called when a user selects a ride to add pin
  async reInit(){

    const mapOptions = {
      center: this.pinLocation,
      zoom: 14 // Set the initial zoom level
    };

    this.map = await new google.maps.Map(document.getElementById('map'), mapOptions);

    const pin = new google.maps.Marker({map: this.map, position: this.pinLocation})
  }

  initMap() {
    const mapOptions = {
      center: { lat: 43.79597128985944, lng: -79.34858107406576 }, // Set the initial center coordinates
      zoom: 16 // Set the initial zoom level
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
}