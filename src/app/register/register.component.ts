import { Component, OnInit } from "@angular/core";
import { first } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import RegisterUser from "../RegisterUser";
import { ToastrService } from "ngx-toastr";
import { NotificationsService } from "../notifications.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  user: any;
  registerUser: RegisterUser = new RegisterUser();
  warning = "";
  success = false;
  loading = false;

  constructor(
    private aservice: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private notificationsService: NotificationsService
  ) {}

  onSubmit() {
    if (
      this.registerUser.email !== "" &&
      this.registerUser.password !== "" &&
      this.registerUser.username !== "" &&
      this.registerUser.firstName !== "" &&
      this.registerUser.lastName !== ""
    ) {
      console.log("In Submit");
      this.loading = true;
      console.log(this.registerUser);
      this.aservice.register(this.registerUser).subscribe(
        (data) => {
          this.success = true;
          this.toastr.success("Account created successfully!");

          // Add a welcome notification
          const notificationData = {
            msg: "Welcome aboard!",
            dateTime: Date.now(),
            category: "General",
          };
          this.notificationsService
            .addNotification(this.user._id, notificationData)
            .subscribe(
              () => {
                this.warning = "";
                this.loading = false;
                console.log(data);
              },
              (notificationError) => {
                console.error("Error adding notification:", notificationError);
              }
            );
        },
        (err) => {
          this.success = false;
          this.warning = err.error.message;
          this.loading = false;
        }
      );
    }
  }

  ngOnInit(): void {
    if (this.aservice.readToken()) {
      this.router.navigate(["/home"]);
    }
  }
}
