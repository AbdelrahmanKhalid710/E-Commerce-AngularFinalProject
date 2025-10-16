import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Login } from '../../../services/Auth/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './user-login.html',
  styleUrls: ['./user-login.css']
})
export class UserLogin { 
  
  loginObj:any={
    email:'',
    password:'',
  };
  constructor
  (private loginService: Login, // Inject the new LoginService
    private router: Router){}

loginUser() {
  console.log('Login button clicked! Attempting API call...');
    this.loginService.login(this.loginObj).subscribe({
      next: (response) => {
        console.log('Login Successful:', response.message);
        // Save the token upon successful login
        this.loginService.saveToken(response.token);

        this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error('Login Failed:', err.error.message);
        // Display error to user
      }
    });
  }
}
