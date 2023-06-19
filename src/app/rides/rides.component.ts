import { Component } from "@angular/core";
@Component({
  selector: "app-rides",
  templateUrl: "./rides.component.html",
  styleUrls: ["./rides.component.css"],
})
export class RidesComponent {
  pickupLocation: string = "";
  dropoffLocation: string = "";
  selectedDate: string = "";
  selectedTime: string = "";
  riderDriver: string = "";
  searchRange: string = "";

  constructor() {}

  onSubmit() {}
}
