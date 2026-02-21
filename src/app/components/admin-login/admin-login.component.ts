import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  adminLoginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  loginError: string = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.adminLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      adminCode: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onAdminSubmit(): void {
    if (this.adminLoginForm.valid) {
      this.isLoading = true;
      this.loginError = '';
      const { email, password, adminCode } = this.adminLoginForm.value;

      // Verify admin access code (demo: '1234')
      if (adminCode !== '1234') {
        this.loginError = 'Invalid admin access code';
        this.isLoading = false;
        return;
      }

      this.auth.login(email, password).subscribe({
        next: (response) => {
          if (response.role === 'Admin') {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          } else {
            this.loginError = 'Unauthorized: Admin access required. Your account does not have admin privileges.';
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.loginError = err.message || 'Authentication failed. Please check your credentials.';
          this.isLoading = false;
        }
      });
    }
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}

