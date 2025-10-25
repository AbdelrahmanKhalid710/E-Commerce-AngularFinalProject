import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Signup } from '../../../services/Auth/signup';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-register.html',
  styleUrls: ['./user-register.css'],
})
export class UserRegister {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private signupService = inject(Signup);

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rePassword: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
  });

  // ✅ Signals for UI feedback
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isSubmitting = signal<boolean>(false);

  // ✅ Computed property for password match
  passwordsMatch = computed(() => {
    const pass = this.registerForm.get('password')?.value;
    const rePass = this.registerForm.get('rePassword')?.value;
    return pass === rePass;
  });

  // ------------------------------
  // ✅ Utility methods for HTML checks
  // ------------------------------
  getControl(controlName: string): AbstractControl | null {
    return this.registerForm.get(controlName);
  }

  isTouched(controlName: string): boolean {
    const c = this.getControl(controlName);
    return !!c?.touched;
  }

  isValid(controlName: string): boolean {
    const c = this.getControl(controlName);
    return !!c && c.valid;
  }

  hasError(controlName: string, errorCode: string): boolean {
    const c = this.getControl(controlName);
    return !!c?.errors?.[errorCode];
  }

  // ------------------------------
  // ✅ Form submission
  // ------------------------------
  registerUser(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage.set('Please fill all fields correctly.');
      return;
    }

    if (!this.passwordsMatch()) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    const formData = this.registerForm.getRawValue();
    this.isSubmitting.set(true);

    this.signupService.signUp(formData).subscribe({
      next: (res) => {
        console.log('✅ Registration success:', res);
        this.successMessage.set('Registration successful! Redirecting...');
        setTimeout(() => {
          this.router.navigate(['/login']);
          this.isSubmitting.set(false);
        }, 1500);
      },
      error: (err: HttpErrorResponse) => {
        console.error('❌ Registration failed:', err);
        this.errorMessage.set(err.error?.message || 'Registration failed. Try again.');
        this.isSubmitting.set(false);
      },
    });
  }
}
