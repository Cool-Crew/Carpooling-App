import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";

import { TranslateModule } from "@ngx-translate/core";

import { NotificationsService } from "./notifications.service";

import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";

import { AboutComponent } from "./about/about.component";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { RidesComponent } from "./rides/rides.component";
import { RoutesComponent } from "./routes/routes.component";
import { AccInfoComponent } from "./acc-info/acc-info.component";
import { UpdateComponent } from "./update/update.component";
import { HomeComponent } from "./home/home.component";
import { MapComponent } from "./map/map.component";
import { PreferenceMgmtComponent } from "./preference-mgmt/preference-mgmt.component";
import { CreateRideComponent } from "./create-ride/create-ride.component";
import { PlaceValidatorDirective } from "./place-validator.directive";
import { AvailableRidesListComponent } from "./available-rides-list/available-rides-list.component";
import { RideCardComponent } from "./ride-card/ride-card.component";

import { RideListComponent } from "./ride-list/ride-list.component";
import { RatingComponent } from "./rating/rating.component";
import { ChatComponent } from "./chat/chat.component";
import { AdminRideListComponent } from './admin-ride-list/admin-ride-list.component';
import { AdminFeedbackListComponent } from './admin-feedback-list/admin-feedback-list.component';
import { DmComponent } from './dm/dm.component';
import { AdminRideDetailsComponent } from './admin-ride-details/admin-ride-details.component';
import { AdminRideCardComponent } from './admin-ride-card/admin-ride-card.component';
import { AdminFeedbackForRideDetailsComponent } from './admin-feedback-for-ride-details/admin-feedback-for-ride-details.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminIssuesForRideDetailsComponent } from './admin-issues-for-ride-details/admin-issues-for-ride-details.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    RegisterComponent,
    LoginComponent,
    RidesComponent,
    RoutesComponent,
    AccInfoComponent,
    UpdateComponent,
    HomeComponent,
    MapComponent,
    PreferenceMgmtComponent,

    CreateRideComponent,
    PlaceValidatorDirective,
    AvailableRidesListComponent,
    RideCardComponent,

    RatingComponent,
    RideListComponent,
    ChatComponent,
    AdminRideListComponent,
    AdminFeedbackListComponent,
    DmComponent,
    AdminRideDetailsComponent,
    AdminRideCardComponent,
    AdminFeedbackForRideDetailsComponent,
    AdminDashboardComponent,
    AdminIssuesForRideDetailsComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatIconModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatMenuModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatChipsModule,
    HttpClientModule,
    FormsModule,
    MatSnackBarModule,
    BrowserModule,
    TranslateModule.forRoot(),
  ],
  providers: [NotificationsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
