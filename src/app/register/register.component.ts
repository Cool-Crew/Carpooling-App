import { Component, OnInit } from "@angular/core";
import { first } from "rxjs";
import { AuthService } from "../auth.service";
import RegisterUser from "../RegisterUser";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  registerUser: RegisterUser = new RegisterUser();
  warning = "";
  success = false;
  loading = false;

  constructor(private aservice: AuthService) {}

  onSubmit() {
    if (
      this.registerUser.email != "" &&
      this.registerUser.password != "" &&
      this.registerUser.username != "" &&
      this.registerUser.firstName != "" &&
      this.registerUser.lastName != ""
    ) {
      console.log("In Submit");
      this.loading = true;
      console.log(this.registerUser);
      this.aservice.register(this.registerUser).subscribe(
        (data) => {
          this.success = true;
          this.warning = "";
          this.loading = false;
          console.log(data);
        },
        (err) => {
          this.success = false;
          this.warning = err.error.message;
          this.loading = false;
        }
      );
    }
  }

  ngOnInit(): void {}
}
