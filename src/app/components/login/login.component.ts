
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      this.auth.login(email, password).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: () => { this.isLoading = false; }
      });
    }
  }

  // Demo login for easy access to dashboard in dev/demo mode
  demoLogin(): void {
    const email = 'admin@example.com';
    const password = 'demopassword';
    // auto-fill form (visual feedback)
    this.loginForm.patchValue({ email, password });
    this.isLoading = true;
    this.auth.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => { this.isLoading = false; }
    });
  }

  loginWithGoogle(): void {
    this.isLoading = true;
    console.log('Google login initiated');
    // Initialize Google OAuth flow
    // window.location.href = 'YOUR_GOOGLE_OAUTH_URL';
    // Or use a service to handle OAuth
    setTimeout(() => {
      console.log('Connecting to Google...');
      this.isLoading = false;
    }, 1500);
  }

  loginWithLinkedIn(): void {
    this.isLoading = true;
    console.log('LinkedIn login initiated');
    // Initialize LinkedIn OAuth flow
    // window.location.href = 'YOUR_LINKEDIN_OAUTH_URL';
    // Or use a service to handle OAuth
    setTimeout(() => {
      console.log('Connecting to LinkedIn...');
      this.isLoading = false;
    }, 1500);
  }
}
