import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { AuthService } from "./auth.service";
import { Ride, RideList } from "./Ride";

interface Usernames {
  [key: string]: string;
}

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

  async getRide(rideId: any): Promise<{message: String; _ride: Ride} | undefined> {
    const token = this.auth.getToken();
    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      return this.http
        .get<{message:String; _ride:Ride}>(
          `${environment.userAPIBase}/ridedetails/${rideId}`,
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

  async getUsernames(userIds:string): Promise<{ message: string; _usernames: Usernames } | undefined> {
    const token = this.auth.getToken();
    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      return this.http
        .get<{ message: string; _usernames: Usernames }>(
          `${environment.userAPIBase}/username/${userIds}`,
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

  getFeedback(): Observable<{ message: string; feedbacks: any[] }> {
    const token = this.auth.getToken();
    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      return this.http.get<{ message: string; feedbacks: any[] }>(
        `${environment.userAPIBase}/feedbacks`,
        { headers }
      );
    }
    return new Observable();
  }

  async replaceIdsWithUsernames(ride:Ride): Promise<Ride> {

    // get username for creator
    let res: {message: string, _usernames: Usernames} | undefined = await this.getUsernames(ride.creator);
    if (res){
      ride.creator = res._usernames[ride.creator];
    }

    //get username for driver
    if (ride.driver){
      let res: {message: string, _usernames: Usernames} | undefined = await this.getUsernames(ride.driver);
      if (res){
        ride.driver = res._usernames[ride.driver];
      }
    }

    //get username for riders
    if (ride.riders){
      for (const rider of ride.riders){
        let res: {message: string, _usernames: Usernames} | undefined = await this.getUsernames(rider.riderID);
        if (res){
          rider.riderID = res._usernames[rider.riderID];
        }
      }
    }

    //get username for feedbacks
    if (ride.feedback){
      for (const feedback of ride.feedback){
        let res: {message: string, _usernames: Usernames} | undefined = await this.getUsernames(feedback.riderId);
        if (res){
          feedback.riderId = res._usernames[feedback.riderId];
        }
      }
    }


    return ride;
  }
}
