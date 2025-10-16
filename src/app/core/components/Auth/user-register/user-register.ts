import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Signup } from '../../../services/Auth/signup';
import { Login } from '../../../services/Auth/login';


@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-register.html',
  styleUrls: ['./user-register.css']
})
export class UserRegister {
  signupObj: any = {
    name: '',
    email: '',
    password: '',
    rePassword: '',
    phone: ''
  };

  constructor(private signupService: Signup, 
    private loginService: Login, // Use this for token storage after signup
    private router: Router) {}

  registerUser() {
    console.log('Register button clicked! Attempting API call...');
    this.signupService.signUp(this.signupObj).subscribe({
      next: (response) => {
        console.log('Registration Successful:', response.message);
        // Assuming signup response also contains a token, save it using the LoginService
        if (response.token) {
           this.loginService.saveToken(response.token);
        }
        
        this.router.navigate(['/']); // Navigate home
      },
      error: (err) => {
        console.error('Registration Failed:', err.error.message);
        // Display error to user
      }
    });
  }
}
