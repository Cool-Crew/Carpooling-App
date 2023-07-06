import { Component, OnInit, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormControl,
  ValidationErrors,
  AbstractControl,
} from "@angular/forms";
import { Location } from "@angular/common";
import { RideService } from "../ride.service";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

import { MapComponent } from "../map/map.component";

interface PlaceResult {
  address?: string;
  location?: google.maps.LatLng;
  name?: string;
}
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface Ride {
  _id: string;
  driver: string;
  driverStartLocation: string;
  status: string
}

@Component({
  selector: "app-rides",
  templateUrl: "./rides.component.html",
  styleUrls: ["./rides.component.css"],
})
export class RidesComponent {
  ride = {

  }
}
