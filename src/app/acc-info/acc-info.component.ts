import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-acc-info",
  templateUrl: "./acc-info.component.html",
  styleUrls: ["./acc-info.component.css"],
})
export class AccInfoComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.readToken();
  }
}
