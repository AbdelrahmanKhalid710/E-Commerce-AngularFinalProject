import { Component, OnInit } from '@angular/core';
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
export class UserLogin implements OnInit {

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
  //  Handle Login Form Submission
  loginUser() {
      // const credentials = this.loginForm.value;
    if(this.loginForm.value.email==="admin@estore.com" && this.loginForm.value.password==="Admin123!")
          this.router.navigate(['/admin/dashboard']);
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.value;
    console.log(' Sending login data:', credentials);

    this.loginService.login(credentials).subscribe({
      next: (response) => {
        console.log(' Login Successful:', response);


        // //  Save user and token in memory (signals)
        // if (response.token) this.loginService.saveToken(response.token);
        // if (response.user) this.loginService.saveUser(response.user);
        //   this.loginService.saveEmailInLocalStorage(credentials.email!);
        // this.loginService.savePasswordInLocalStorage(credentials.password!);
        console.log(' Logged in user:', response.user?.email);
        //  Navigate to homepage or favorites
        
        
      },
      complete: () => {
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        console.error(' Login Failed:', err);

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

  loginWithGoogle() {
    this.loginService.loginWithGoogle();

  }


}
