import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(private fb: FormBuilder) {
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
      console.log('Login form value:', this.loginForm.value);
      // Add login logic here
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    }
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
