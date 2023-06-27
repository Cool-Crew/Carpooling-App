import { Component, OnInit } from "@angular/core";
import { PlaceAutocompleteInputComponent } from "../place-autocomplete-input/place-autocomplete-input.component";
@Component({
  selector: "app-rides",
  templateUrl: "./rides.component.html",
  styleUrls: ["./rides.component.css"],
  // imports: [],
})
export class RidesComponent implements OnInit{
  pickupLocation: string = "";
  dropoffLocation: string = "";
  selectedDate: string = "";
  selectedTime: string = "";
  riderDriver: string = "";
  searchRange: string = "";

  constructor() {}

  ngOnInit(): void {
      
  }

  onSubmit() {}
}
