
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
  errorMessage: string = '';

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
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;

      this.auth.login(email, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Redirect to dashboard (admin and users)
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Login failed. Please try again.';
        }
      });
    }
  }

  // Demo login for easy access to dashboard in dev/demo mode
  demoLogin(): void {
    const email = 'user@example.com';
    const password = 'password123';
    // auto-fill form (visual feedback)
    this.loginForm.patchValue({ email, password });
    this.isLoading = true;
    this.errorMessage = '';

    this.auth.login(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Demo login failed.';
      }
    });
  }

  loginWithGoogle(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.auth.signInWithGoogle().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Google sign-in failed. Please try again.';
      }
    });
  }

  loginWithLinkedIn(): void {
    this.isLoading = true;
    console.log('LinkedIn login initiated');
    // TODO: Implement LinkedIn OAuth with Firebase
    setTimeout(() => {
      console.log('Connecting to LinkedIn...');
      this.isLoading = false;
    }, 1500);
  }
}
