import { Component, OnInit, HostListener } from '@angular/core';
import { Router,Event, NavigationStart } from '@angular/router';
import { AuthService } from './auth.service';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { NotificationsService } from "./notifications.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'web422-a4';
  public token: any|undefined;

  faBell = faBell;
  faTimes = faTimes;
  fnotifs: string[] = this.notificationsService.notifications; // Array to store notifications
  //fnotifs: string[] = [];
  showNotifications = false;

  constructor( private router: Router,private aservice: AuthService, private notificationsService: NotificationsService){this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  logout(){
    localStorage.clear()
    this.router.navigate(['/login']);
  };

  toggleNotifications() {
    //this.notificationsService.toggleNotifications();
    this.showNotifications = !this.showNotifications;
  }

  // fnotifs = this.notificationsService.notifications
  // generateNotification() {
  //   this.fnotifs = this.notificationsService.notifications;    
  // }

  removeNotification(rnot: string) {
    const index = this.fnotifs.indexOf(rnot);
    if (index !== -1) {
      this.fnotifs.splice(index, 1);
    }
  }
  

  clearNotifications() {
    this.notificationsService.clearNotifications();
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".notification-icon")) {
      this.showNotifications = false;
    }
  }
  
  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.token = this.aservice.readToken();
      }
    });
  }
}
