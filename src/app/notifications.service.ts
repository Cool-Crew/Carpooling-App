import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  constructor(private http: HttpClient, private auth: AuthService) {}
  notifications: string[] = [];

  addNotification(userId: any, notificationData: any): Observable<any> {
    const token = this.auth.getToken();
    if (token) {
      console.log(notificationData.msg);
      const message = notificationData.msg;
      this.notifications.push(message);
      console.log(this.notifications);
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      });
      return this.http.post<{ message: string }>(
        `${environment.userAPIBase}/notifications/${userId}`,
        notificationData,
        { headers }
      );   
    }      
    return new Observable();
  }

  removeNotification(userId: any, notificationId: any): Observable<any> {
    const token = this.auth.getToken();
    if (token) {      
      const headers = new HttpHeaders({
        Authorization: `JWT ${token}`,
      });
      console.log("We are trying to remove notification from the back-end server now.")
      return this.http.delete<any>(
        `${environment.userAPIBase}/notifications/${userId}/${notificationId}`,
        { headers }
      );
    }
    const index = this.notifications.indexOf(notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
    }
    return new Observable();
  }

  clearNotifications(userId: any): Observable<any> {
    const token = this.auth.getToken();
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `JWT ${token}`,
      });
      return this.http.delete<any>(
        `${environment.userAPIBase}/notifications/${userId}`,
        { headers }
      );
    }
    this.notifications = [];
    return new Observable();
  }
   

}
