import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { EncryptionServiceService } from './encryption-service.service';

@Injectable({
  providedIn: 'root'
})
export class PublicationserviceService {
  data: any;
  token: any;
  constructor(private encryptionService: EncryptionServiceService, private http: HttpClient) {
  
  }
  public Search(Data: any) {
    return this.http.post(environment.userAPIBase + '/api/publications/search', Data);
  }

  public Add(Data: any) {
    this.data = this.encryptionService.decrypt(localStorage.getItem('data')!);
    this.token = this.data["token"];

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'responseType': 'json',
      'id': this.token!,

    });
    return this.http.post(environment.userAPIBase + '/api/publications/', Data, { headers: headers });
  }

  public latest() {
    return this.http.get(environment.userAPIBase + '/api/publications/latest');
  }
  public getpub(data: any) {
    return this.http.get(environment.userAPIBase + `/api/publications/${data}`);
  }
  public delete(data: any) {
    this.data = this.encryptionService.decrypt(localStorage.getItem('data')!);
    this.token = this.data["token"];
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'responseType': 'json',
      'id': this.token!,

    });
    return this.http.delete(environment.userAPIBase + `/api/publications/${data}`, { headers: headers });
  }
  public update(id: any, data: any) {
    this.data = this.encryptionService.decrypt(localStorage.getItem('data')!);
    this.token = this.data["token"];
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'responseType': 'json',
      'id': this.token!,

    });
    return this.http.put(environment.userAPIBase + `/api/publications/${id}`, data, { headers: headers });
  }


}
