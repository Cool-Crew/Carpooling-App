import { Component } from "@angular/core";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NotificationsService } from "../notifications.service";

@Component({
  selector: "app-preference-mgmt",
  templateUrl: "./preference-mgmt.component.html",
  styleUrls: ["./preference-mgmt.component.css"],
})
export class PreferenceMgmtComponent {
  user: any;
  selectedClass: string = "";
  selectedInterest: string = "";
  isClassFieldEmpty: boolean = false;
  isInterestFieldEmpty: boolean = false;
  updateStatus: string = "";

  availableClasses: string[] = [
    "MAP526",
    "CSE301",
    "ENG202",
    "PHY123",
    "MATH405",
    "BIO301",
    "CHEM201",
    "ART101",
    "HIS202",
    "PSY301",
    "SOC401",
    "ECON202",
  ];
  availableInterests: string[] = [
    "Painting",
    "Playing Musical Instruments",
    "Cooking and Baking",
    "Gardening",
    "Reading Books",
    "Writing and Journaling",
    "Photography",
    "Hiking and Nature Walks",
    "Swimming",
    "Dancing",
    "Collecting",
    "DIY Crafts",
    "Watching Movies and TV Shows",
    "Playing Video Games",
    "Traveling",
    "Yoga and Meditation",
    "Playing Sports",
    "Knitting or Crocheting",
    "Volunteering",
    "Puzzle Solving",
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private notificationsService: NotificationsService
  ) {}

  addClass() {
    if (this.selectedClass) {
      this.user.classes.push(this.selectedClass);
      this.isClassFieldEmpty = false;
      this.selectedClass = "";
    } else {
      this.isClassFieldEmpty = true;
    }
  }

  removeClass(index: number) {
    this.user.classes.splice(index, 1);
  }

  addInterest() {
    if (this.selectedInterest) {
      this.user.interests.push(this.selectedInterest);
      this.isInterestFieldEmpty = false;
      this.selectedInterest = "";
    } else {
      this.isInterestFieldEmpty = true;
    }
  }

  removeInterest(index: number) {
    this.user.interests.splice(index, 1);
  }

  ngOnInit(): void {
    this.user = this.authService.readToken();
  }

  onSubmit() {
    this.authService.update(this.user).subscribe(
      (response) => {
        console.log("User data updated successfully:", response);
        this.updateStatus = "Data updated successfully.";
        this.toastr.success("Preferences saved");

        // Add a notification for updating hobbies
        const notificationData = {
          msg: "Hobbies updated",
          dateTime: Date.now(),
          category: "Account_Update",
        };
        this.notificationsService
          .addNotification(this.user._id, notificationData)
          .subscribe(
            () => {
              // Refresh token
              this.authService.refreshToken().subscribe(
                (refreshResponse) => {
                  console.log("Token refreshed successfully:", refreshResponse);
                },
                (error) => {
                  console.error("Error refreshing token:", error);
                }
              );

              // Redirect to home page after 2 seconds
              setTimeout(() => {
                this.router.navigate(["/home"]);
              }, 1500);
            },
            (notificationError) => {
              console.error("Error adding notification:", notificationError);
            }
          );
      },
      (error) => {
        console.error("Error updating user data:", error);
        this.updateStatus = "Error updating user data.";
        // Handle error case for user data update
      }
    );
  }
}
