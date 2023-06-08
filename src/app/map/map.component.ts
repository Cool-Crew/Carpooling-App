import { Component, OnInit } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: any;

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    const mapOptions = {
      center: { lat: 43.79597128985944, lng: -79.34858107406576 }, // Set the initial center coordinates
      zoom: 16 // Set the initial zoom level
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
}