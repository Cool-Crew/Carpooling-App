import { Component, OnInit } from '@angular/core';
import { Router,Event, NavigationStart } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'web422-a4';
  public token: any|undefined;

  constructor( private router: Router,private aservice: AuthService){this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  logout(){
    localStorage.clear()
    this.router.navigate(['/login']);
  };

  
  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.token = this.aservice.readToken();
      }
    });
  }
}
