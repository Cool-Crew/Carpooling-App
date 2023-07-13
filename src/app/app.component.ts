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
  user: any;
  

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

  removeNotification(notificationId: string) {
    console.log("Remove Notification Function from app.component.ts was accessed.")
    const userId = this.token._id;
    this.notificationsService
      .removeNotification(userId, notificationId)
      .subscribe(
        (response) => {
          console.log("notification should be removed now.")
          // Notification removed successfully
          const index = this.fnotifs.indexOf(notificationId);
          console.log(index);
           if (index !== -1) {
           this.fnotifs.splice(index, 1);
          }          
          console.log("checking"+this.fnotifs);
        },
        (error) => {
          // Error occurred while removing notification
          console.error('Error removing notification:', error);
        }
      );
  }

  clearNotifications() {
    const userId = this.token._id;
    this.notificationsService.clearNotifications(userId).subscribe(
      (response) => {
        // Notifications cleared successfully
        this.fnotifs = [];
      },
      (error) => {
        // Error occurred while clearing notifications
        console.error('Error clearing notifications:', error);
      }
    );
  }
  
  
/*
  clearNotifications() {
    this.notificationsService.clearNotifications();
  }
*/

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

        //this.user = this.aservice.readToken();
        //this.token = this.aservice.readToken();
        // for (const notification of this.user.notifications) {
        //   this.fnotifs.push(notification.msg);          
        // }

        this.token = this.aservice.readToken();
        if (this.token) {
          this.fnotifs = this.token.notifications.map(
            (notification: any) => notification.msg
          );
        } else {
          this.fnotifs = [];
        }

      }
    });
  }
}
