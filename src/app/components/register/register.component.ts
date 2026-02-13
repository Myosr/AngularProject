import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
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
      console.log('Register form value:', this.registerForm.value);
      // Add registration logic here
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    }
  }

  registerWithGoogle(): void {
    this.isLoading = true;
    console.log('Google signup initiated');
    // Initialize Google OAuth flow
    // window.location.href = 'YOUR_GOOGLE_OAUTH_URL';
    // Or use a service to handle OAuth
    setTimeout(() => {
      console.log('Connecting to Google...');
      this.isLoading = false;
    }, 1500);
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
