import { Component, OnInit } from "@angular/core";
import { NotificationService } from "../notification.service";

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
export class RideListComponent implements OnInit {
  rides: Ride[] = [
    {
      id: 1,
      date: "2023-06-30",
      startLocation: "137, Redwater Drive",
      endLocation: "1750, Finch Avenue East",
    },
    {
      id: 2,
      date: "2023-07-01",
      startLocation: "390, Sentinel Road",
      endLocation: "70, The Pond Road",
    },
    // Add more rides as needed
  ];
  notificationMessage: string = "";

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notification$.subscribe((message) => {
      this.notificationMessage = message;

      //Hide the notification after 2 seconds
      setTimeout(() => {
        this.notificationMessage = "";
      }, 2000);
    });
  }
}
