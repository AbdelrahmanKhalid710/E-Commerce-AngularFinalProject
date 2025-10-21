import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { Signup } from '../../../services/Auth/signup';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './user-register.html',
  styleUrls: ['./user-register.css']
})
export class UserRegister {

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    rePassword: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required])
  });

  constructor(private signupService: Signup, private router: Router) {}

  registerUser() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = this.registerForm.value;

    this.signupService.signUp(formData).subscribe({
      next: (res) => {
        console.log('✅ Registration success:', res);


        this.router.navigate(['/']); // redirect to home
      },
      error: (err: HttpErrorResponse) => {
        console.error('❌ Registration failed:', err.error?.message || 'Unknown error');
      }
    });
  }
}
