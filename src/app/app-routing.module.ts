import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardAuthService } from './guard-auth.service';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { RidesComponent } from './rides/rides.component';
import { RoutesComponent } from './routes/routes.component';
import { AccInfoComponent } from './acc-info/acc-info.component';
import { UpdateComponent } from './update/update.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


const routes: Routes = [
  { path: 'about', component: AboutComponent, canActivate: [GuardAuthService] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'rides', component: RidesComponent, canActivate: [GuardAuthService] },
  { path: 'routes', component: RoutesComponent, canActivate: [GuardAuthService] },
  { path: 'acc-info', component: AccInfoComponent, canActivate: [GuardAuthService] },
  { path: 'update', component: UpdateComponent, canActivate: [GuardAuthService] },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'response-reset-password/:token', component: ResetPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
