import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardAuthService } from './guard-auth.service';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { RidesComponent } from './rides/rides.component';
import { RoutesComponent } from './routes/routes.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent, canActivate: [GuardAuthService] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'rides', component: RidesComponent, canActivate: [GuardAuthService] },
  { path: 'routes', component: RoutesComponent, canActivate: [GuardAuthService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
