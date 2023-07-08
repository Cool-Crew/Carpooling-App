import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NotificationsService } from "../notifications.service";

@Component({
  selector: "app-update",
  templateUrl: "./update.component.html",
  styleUrls: ["./update.component.css"],
})
export class UpdateComponent {
  user: any;
  updateForm = new FormGroup({
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    phone: new FormControl("", [
      Validators.required,
      Validators.pattern("[0-9]{10}"),
    ]),
    // Add additional form controls here
  });

  warning = "";
  success = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.readToken();
    this.updateForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      phone: this.user.phone,
    });
  }
  onSubmit() {
    if (this.updateForm.valid) {
      const enteredEmail = this.updateForm.value.email;
      const currentUserEmail = this.user.email;

      if (enteredEmail === currentUserEmail) {
        this.loading = true;
        this.authService.update(this.updateForm.value).subscribe(
          (success) => {
            this.success = true;
            this.toastr.success("Account Updated");

            // Add a notification for updating account information
            const notificationData = {
              msg: "Account information updated",
              category: "Account_Update",
            };
            this.notificationsService
              .addNotification(this.user._id, notificationData)
              .subscribe(
                () => {
                  this.warning = "";
                  this.loading = false;

                  this.authService.refreshToken().subscribe(
                    (refreshSuccess) => {
                      this.authService.setToken(refreshSuccess.token);
                      this.router.navigate(["/acc-info"]);
                    },
                    (refreshError) => {
                      console.error("Error refreshing token:", refreshError);
                    }
                  );

                  // Redirect to home page after 2 seconds
                  setTimeout(() => {
                    this.router.navigate(["/home"]);
                  }, 1500);
                },
                (notificationError) => {
                  console.error(
                    "Error adding notification:",
                    notificationError
                  );
                  this.warning = "Error adding notification";
                  this.loading = false;
                }
              );
          },
          (err) => {
            this.success = false;
            this.warning = err.error.message;
            this.loading = false;
          }
        );
      } else {
        this.success = false;
        this.warning = "Email does not match the current user's email.";
      }
    }
  }
}
