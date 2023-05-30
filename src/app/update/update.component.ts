import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent {
  user: any;
  updateForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
    // Add additional form controls here
  });

  warning = '';
  success = false;
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.readToken();
    this.updateForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      phone: this.user.phone,
    });
  }
  onSubmit() {
    if (this.updateForm.valid) {
      this.loading = true;
      this.authService.update(this.updateForm.value).subscribe(
        success => {
          this.success = true;
          this.warning = '';
          this.loading = false;
          this.router.navigate(['/acc-info']);
        },
        err => {
          this.success = false;
          this.warning = err.error.message;
          this.loading = false;
        }
      );
    }
  }
}