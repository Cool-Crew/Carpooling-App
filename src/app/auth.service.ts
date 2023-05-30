import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';
import jwt_decode from 'jwt-decode';

import User from './User';
import RegisterUser from './RegisterUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor( private http: HttpClient) { }

  public getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  public setToken(token: string): void{
    localStorage.setItem('access_token', token);
  }

  public readToken(): User | null {
    const token = localStorage.getItem('access_token');

    if (token) {
      return jwt_decode(token);
    } else {
      return null;
    }
  }
   
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  login(user: User): Observable<any> {
    return this.http.post<any>(`${environment.userAPIBase}/login`, user);
  }

  public logout() {
    localStorage.removeItem('access_token');
  }

  register(registerUser: RegisterUser): Observable<any> {
    return this.http.post<any>(`${environment.userAPIBase}/register`, registerUser);
  }

  getAccountInfo(): Observable<any> {
    const token = this.getToken();
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };
      return this.http.get<any>(`${environment.userAPIBase}/account`, {
        headers
      });
    }
    return new Observable();
  }

  update(userData: any): Observable<any> {
  const token = this.getToken();
  if (token) {
    const headers = { Authorization: `JWT ${token}` };
    console.log('Sending update request with data:', userData);
    return this.http.put<any>(`${environment.userAPIBase}/update`, userData, {
      headers
    });
  }
  return new Observable();
}
}