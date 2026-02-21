import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup): any {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { email, password, firstName, lastName } = this.registerForm.value;
      const displayName = `${firstName} ${lastName}`;

      this.auth.registerUser(email, password, displayName, 'User').subscribe({
        next: (user) => {
          this.isLoading = false;
          this.successMessage = 'Registration successful! Please log in with your credentials.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Registration failed. Please try again.';
        }
      });
    }
  }

  registerWithGoogle(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.auth.signInWithGoogle().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Google sign-up successful! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Google sign-up failed. Please try again.';
      }
    });
  }

  registerWithLinkedIn(): void {
    this.isLoading = true;
    console.log('LinkedIn signup initiated');
    // Initialize LinkedIn OAuth flow
    // window.location.href = 'YOUR_LINKEDIN_OAUTH_URL';
    // Or use a service to handle OAuth
    setTimeout(() => {
      console.log('Connecting to LinkedIn...');
      this.isLoading = false;
    }, 1500);
  }
}
