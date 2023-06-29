import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { AuthService } from "./auth.service";
import { Ride } from "./Ride";


@Injectable({ providedIn: "root" })
export class RideService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  async getRides(): Promise<{message: String, _rides:[Ride]} | undefined> {
    const token = this.auth.getToken();
    if (token) {
      const headers = { Authorization: `JWT ${token}` };
      return this.http.get<{message:String, _rides:[Ride]}>(`${environment.userAPIBase}/rides`, { headers }).toPromise();
    }
    return ;
  }

  registerDriverToRide(rideId: any, driverData: any):Observable<any> {//Promise<{message: String} | undefined>{
    const token = this.auth.getToken();
    if (token) {
      const headers = {Authorization: `JWT ${token}`};
      return this.http.post<{message:String}>(`${environment.userAPIBase}/rides/:${rideId}/driver`, {ride:rideId, newDriver: driverData}, { headers });
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
}
