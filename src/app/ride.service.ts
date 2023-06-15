import { Injectable } from "@angular/core";
import {HttpClient} from '@angular/common/http'
import { Observable } from "rxjs";
import {environment} from "../environments/environment";

import {Ride} from './Ride';

@Injectable({providedIn: 'root',})
export class RideService {
    constructor(private http: HttpClient) {}

    public createNewRide = (ride:Ride):Observable<any> => {
        return this.http.post<any>(`${environment.userAPIBase}/register-ride`, ride);
    }
}