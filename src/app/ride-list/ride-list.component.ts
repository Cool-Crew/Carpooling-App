import { Component } from "@angular/core";

interface Ride {
  id: number;
  date: string;
  startLocation: string;
  endLocation: string;
}

@Component({
  selector: "app-ride-list",
  templateUrl: "./ride-list.component.html",
  styleUrls: ["./ride-list.component.css"],
})
export class RideListComponent {
  rides: Ride[] = [
    {
      id: 1,
      date: "2023-06-30",
      startLocation: "Location A",
      endLocation: "Location B",
    },
    {
      id: 2,
      date: "2023-07-01",
      startLocation: "Location C",
      endLocation: "Location D",
    },
    // Add more rides as needed
  ];
}
