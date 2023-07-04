import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  email: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.http.post(`${environment.userAPIBase}/req-reset-password`, { email: this.email })
      .subscribe({
        next: (response) => {
          // Handle successful response
          console.log('Password reset email sent');
        },
        error: (error) => {
          // Handle error response
          console.error('Error sending password reset email:', error);
        }
      });
  }
  ngOnInit(): void {
  }

}
