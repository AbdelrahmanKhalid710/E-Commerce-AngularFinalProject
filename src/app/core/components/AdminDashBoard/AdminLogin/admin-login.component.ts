import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminAuthService } from '../../../services/AdminDashBoard/admin-auth.service';
import { AdminLoginForm } from './interfaces/admin-login.interface';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login-component.html',
  styleUrls: ['./admin-login-component.css']
})
export class AdminLoginComponent {
  loginForm: AdminLoginForm = {
    adminUsername: '',
    adminPassword: ''
  };
  
  error = '';
  isLoading = false;

  constructor(
    private adminAuthService: AdminAuthService, 
    private router: Router
  ) {}

  onAdminLogin(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.isLoading = true;
    this.error = '';

    // Simulate API call delay
    setTimeout(() => {
      if (this.adminAuthService.adminLogin(this.loginForm.adminUsername, this.loginForm.adminPassword)) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.error = 'Invalid admin credentials';
        this.loginForm.adminPassword = '';
      }
      this.isLoading = false;
    }, 500);
  }

  private isFormValid(): boolean {
    return !!(this.loginForm.adminUsername?.trim() && this.loginForm.adminPassword?.trim());
  }
}