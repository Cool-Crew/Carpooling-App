import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  token: string | null = null;
  confirmNewPassword: string = '';
  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  resetPassword(){
    this.http.post(`${environment.userAPIBase}/new-password`, { token: this.token, password: this.newPassword })
      .subscribe({
        next: (response) => {
          // Handle successful response
          console.log('Password updated successfully');
        },
        error: (error) => {

          console.error('Error updating password:', error);
        }
      });
  }
  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
    // Now you have the token, you can send it back to the server to validate it and reset the password
  }
}