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

  addNotification(userId: any, notificationData: any): Observable<any> {
    const token = this.auth.getToken();
    if (token) {
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

  notifications: string[] = [];

  clearNotifications() {
    this.notifications = [];
  }
}
