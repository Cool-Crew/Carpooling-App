import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { AuthService } from "./auth.service";
import { Ride, RideList } from "./Ride";

@Injectable({ providedIn: "root" })
export class RideService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  async getRides(): Promise<{ message: String; _rides: [Ride] } | undefined> {
    const token = this.auth.getToken();
    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      return this.http
        .get<{ message: String; _rides: [Ride] }>(
          `${environment.userAPIBase}/rides`,
          { headers }
        )
        .toPromise();
    }
    return;
  }

  async getUserRides(
    riderId: any
  ): Promise<{ message: String; _rides: [RideList] } | undefined> {
    const token = this.auth.getToken();
    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      return this.http
        .get<{ message: String; _rides: [RideList] }>(
          `${environment.userAPIBase}/userRides/:${riderId}`,
          { headers }
        )
        .toPromise();
    }
    return;
  }

  async getUsernames(userIds:string): Promise<{ message: String; _users: [String] } | undefined> {
    const token = this.auth.getToken();
    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      return this.http
        .get<{ message: String; _users: [String] }>(
          `${environment.userAPIBase}/username/userIds`,
          { headers }
        )
        .toPromise();
    }
    return;
  }

  rmRiderFromRide(rideId: any, riderId: any): Observable<any> {
    const token = this.auth.getToken();

    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      return this.http.delete<{ message: String }>(
        `${environment.userAPIBase}/rides/${rideId}/riders/${riderId}`,
        { headers }
      );
    }

    return new Observable();
  }

  registerDriverToRide(rideId: any, driverData: any): Observable<any> {
    const token = this.auth.getToken();
    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      return this.http.post<{ message: String }>(
        `${environment.userAPIBase}/rides/${rideId}/driver`,
        { ride: rideId, newDriver: driverData },
        { headers }
      );
    }
    return new Observable();
  }

  rmDriverFromRide(rideId: any): Observable<any> {
    const token = this.auth.getToken();
    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      return this.http.delete<{ message: String }>(
        `${environment.userAPIBase}/rides/${rideId}/driver`,
        { headers }
      );
    }

    return new Observable();
  }

  registerRidertoRide(
    rideId: any,
    riderId: any,
    pickupLocation: any
  ): Observable<any> {
    const token = this.auth.getToken();
    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      const riderData = {
        riderID: riderId,
        pickupLocation: pickupLocation,
      };
      console.log("This is the riderData", riderData);
      return this.http.post<{ message: string }>(
        `${environment.userAPIBase}/rides/${rideId}/riders`,
        { ride: rideId, newRider: riderData },
        { headers }
      );
    }
    return new Observable();
  }

  registerRide(rideData: any): Observable<any> {
    const token = this.auth.getToken();
    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      return this.http.post<any>(
        `${environment.userAPIBase}/register-ride`,
        rideData,
        {
          headers,
        }
      );
    }
    return new Observable();
  }

  cancelRide(rideId: any): Observable<any> {
    const token = this.auth.getToken();
    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      return this.http.patch<{ message: String }>(
        `${environment.userAPIBase}/rides/${rideId}/cancel`,
        {},
        { headers }
      );
    }
    return new Observable();
  }

  completeRide(rideId: any): Observable<any> {
    const token = this.auth.getToken();
    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      return this.http.patch<{ message: String }>(
        `${environment.userAPIBase}/rides/${rideId}/markAsCompleted`,
        {},
        { headers }
      );
    }
    return new Observable();
  }

  updateRide(rideId: any, updatedData: any): Observable<any> {
    const token = this.auth.getToken();
    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      return this.http.put<any>(
        `${environment.userAPIBase}/api/ride-update`,
        { rideId, updatedData },
        { headers }
      );
    }
    return new Observable();
  }

  addFeedback(
    id: String,
    rating: Number,
    feedback: String,
    rideId: String | null,
    category: String
  ): Observable<any> {
    const token = this.auth.getToken();
    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      return this.http.post<any>(
        `${environment.userAPIBase}/addFeedback/${rideId}`,
        {
          riderId: id,
          rideRating: rating,
          rideFeedback: feedback,
          feedbackCategory: category,
        },
        {
          headers,
        }
      );
    }
    return new Observable();
  }

  reportIssue(rideId: string, issue: any): Observable<any> {    
    const token = this.auth.getToken();
    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      const url = `${environment.userAPIBase}/rides/${rideId}/report-issue`;
      return this.http.post<any>(url, issue, { headers });
    }
    return new Observable();
  }

}
