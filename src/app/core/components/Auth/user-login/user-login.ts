// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { HttpErrorResponse } from '@angular/common/http';
// import { Login } from '../../../services/Auth/login';

// @Component({
//   selector: 'app-user-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './user-login.html',
//   styleUrls: ['./user-login.css']
// })
// export class UserLogin {

//   // ✅ Reactive FormGroup (no getters)
//   loginForm = new FormGroup({
//     email: new FormControl('', [Validators.required, Validators.email]),
//     password: new FormControl('', [Validators.required, Validators.minLength(6)])
//   });

//   errorMessage: string = '';

//   constructor(
//     private loginService: Login,
//     private router: Router
//   ) {}

//   // ✅ Handle Login Form Submission
//   loginUser() {
//     if (this.loginForm.invalid) {
//       this.loginForm.markAllAsTouched(); // highlight invalid inputs
//       return;
//     }

//     const credentials = this.loginForm.value;

//     console.log('📤 Sending login data:', credentials);

//     // Call the login service
//     this.loginService.login(credentials).subscribe({
//       next: (response) => {
//         console.log('✅ Login Successful:', response);

//         // Save token and user
//         if (response.token) {
//           this.loginService.saveToken(response.token);
//         }
//         if (response.user) {
//           this.loginService.saveUser(response.user);
//           console.log('👤 Logged in user:', response.user.name);
//         }

//         // Navigate to home or dashboard
//         this.router.navigate(['/']);
//       },
//       error: (err: HttpErrorResponse) => {
//         console.error('❌ Login Failed:', err);
//         if (err.error?.message) {
//           this.errorMessage = err.error.message;
//         } else if (err.status === 0) {
//           this.errorMessage = 'Cannot connect to the API.';
//         } else {
//           this.errorMessage = 'Invalid credentials.';
//         }
//       }
//     });
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Login } from '../../../services/Auth/login';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-login.html',
  styleUrls: ['./user-login.css']
})
export class UserLogin {

  // ✅ Reactive Form
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  errorMessage: string = '';

  constructor(
    private loginService: Login,
    private router: Router
  ) {}

  ngOnInit() {
  if (this.loginService.isAuthenticated()) {
    this.router.navigate(['/profile']);
  }
}
  // ✅ Handle Login Form Submission
  loginUser() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.value;
    console.log('📤 Sending login data:', credentials);

    this.loginService.login(credentials).subscribe({
      next: (response) => {
        console.log('✅ Login Successful:', response);


        // ⚙️ Save user and token in memory (signals)
        if (response.token) this.loginService.saveToken(response.token);
        if (response.user) this.loginService.saveUser(response.user);
        console.log('👤 Logged in user:', response.user?.email);
        // ✅ Navigate to homepage or favorites
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('❌ Login Failed:', err);

        // More user-friendly error messages
        if (err.error?.message) this.errorMessage = err.error.message;
        else if (err.status === 0) this.errorMessage = 'Cannot connect to the server.';
        else this.errorMessage = 'Invalid email or password.';
      }
    });
  }

  // Optional helper for debugging signals
  get currentUser() {
    return this.loginService.user();
  }
}
