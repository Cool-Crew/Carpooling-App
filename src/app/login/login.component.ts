import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import User from "../User";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  user: User = new User();
  warning = "";
  loading = false;

  constructor(private aservice: AuthService, private router: Router) {}

  onSubmit() {
    if (this.user.email != "" && this.user.password != "") {
      this.loading = true;
      this.aservice.login(this.user).subscribe(
        (success) => {
          this.loading = false;
          this.aservice.setToken(success.token);
          this.router.navigate(["/home"]);
        },
        (err) => {
          this.warning = err.error.message;
          this.loading = false;
        }
      );
    }
  }

  ngOnInit(): void {}
}
