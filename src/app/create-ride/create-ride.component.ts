import { Component } from "@angular/core";

@Component({
  selector: "app-create-ride",
  templateUrl: "./create-ride.component.html",
  styleUrls: ["./create-ride.component.css"],
})
export class CreateRideComponent {
  startLocation = "";
  dropOffLocation = "";
  dateTime = "";

  submitForm() {
    // Perform any necessary processing with the submitted data
    console.log(
      "Submitted data:",
      this.startLocation,
      this.dropOffLocation,
      this.dateTime
    );
    // You can also make API calls or perform other actions here
  }
}
