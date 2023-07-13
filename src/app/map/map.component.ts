import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnChanges{

  map: any //google.maps.Map |undefined;
  @Input() pinLocation:{lat:number,lng:number} | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['pinLocation']){
      this.reInit();
    }
  }
  

  //called when a user selects a ride to add pin
  async reInit(){

    const mapOptions = {
      center: this.pinLocation,
      zoom: 14 // Set the initial zoom level
    };

    this.initMap(new google.maps.Marker({map: this.map, position: this.pinLocation}));
  }

  async initMap(pin:google.maps.Marker | null = null): Promise<void> {

    const senecaNewnham = { lat: 43.79597128985944, lng: -79.34858107406576 };

    // Create a new map. If pin is null, then the map will be centered on Seneca Newnham, if not then it will be centered on the pin. 
    // If the pin is not null, then it will be added to the map.
    this.map = await new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: pin == null ? senecaNewnham : pin.getPosition(),
      zoom: 14,
    });

    if(pin != null){
      pin.setMap(this.map);
    }
  }
}