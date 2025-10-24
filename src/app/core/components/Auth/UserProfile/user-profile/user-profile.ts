import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Login } from '../../../../services/Auth/login';
import { OrderComponent } from '../../../order-component/order-component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, OrderComponent],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfile {
  loginService = inject(Login);
  router = inject(Router);

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
