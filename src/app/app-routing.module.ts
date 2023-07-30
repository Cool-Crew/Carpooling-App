import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GuardAuthService } from "./guard-auth.service";
import { AboutComponent } from "./about/about.component";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { RidesComponent } from "./rides/rides.component";
import { RoutesComponent } from "./routes/routes.component";
import { RatingComponent } from "./rating/rating.component";
import { RideListComponent } from "./ride-list/ride-list.component";
import { AccInfoComponent } from "./acc-info/acc-info.component";
import { UpdateComponent } from "./update/update.component";
import { HomeComponent } from "./home/home.component";
import { PreferenceMgmtComponent } from "./preference-mgmt/preference-mgmt.component";

import { CreateRideComponent } from "./create-ride/create-ride.component";
import { ChatComponent } from "./chat/chat.component";
import { DmComponent } from "./dm/dm.component";
import { AdminFeedbackListComponent } from "./admin-feedback-list/admin-feedback-list.component";
import { AdminRideListComponent } from "./admin-ride-list/admin-ride-list.component";

const routes: Routes = [
  { path: "about", component: AboutComponent, canActivate: [GuardAuthService] },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "rides", component: RidesComponent, canActivate: [GuardAuthService] },
  {
    path: "routes",
    component: RoutesComponent,
    canActivate: [GuardAuthService],
  },
  {
    path: "acc-info",
    component: AccInfoComponent,
    canActivate: [GuardAuthService],
  },
  {
    path: "update",
    component: UpdateComponent,
    canActivate: [GuardAuthService],
  },
  { path: "home", component: HomeComponent, canActivate: [GuardAuthService] },
  {
    path: "create-ride",
    component: CreateRideComponent,
    canActivate: [GuardAuthService],
  },
  {
    path: "preference-mgmt",
    component: PreferenceMgmtComponent,
    canActivate: [GuardAuthService],
  },
  {
    path: "myRides",
    component: RideListComponent,
    canActivate: [GuardAuthService],
  },
  {
    path: "rating/:id",
    component: RatingComponent,
    canActivate: [GuardAuthService],
  },
  {
    path: "dm",
    component: DmComponent,
  },
  {
    path: "chat",
    component: ChatComponent
  }
  {
    path: "admin/feedbacks",
    component: AdminFeedbackListComponent,
    canActivate: [GuardAuthService],
  },
  {
    path: "admin/rides",
    component: AdminRideListComponent,
    canActivate: [GuardAuthService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
