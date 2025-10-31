import { Login } from './../Auth/login';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private currentAdminSubject = new BehaviorSubject<AdminUser | null>(null);
  public currentAdmin$ = this.currentAdminSubject.asObservable();

  private adminCredentials = {
    username: 'admin',
    password: 'Admin123!'
  };

  private adminData: AdminUser = {
    id: 1,
    username: 'admin',
    email: 'admin@estore.com',
    role: 'super-admin'
  };

  
  constructor(private router: Router,private loginService: Login) {
    
    const savedAdmin = localStorage.getItem('currentAdmin');
    if (savedAdmin) {
      this.currentAdminSubject.next(JSON.parse(savedAdmin));
    }
  }

  adminLogin(username: string, password: string): boolean {
    if (username === this.adminCredentials.username && 
        password === this.adminCredentials.password) {
      
      this.currentAdminSubject.next(this.adminData);
      localStorage.setItem('currentAdmin', JSON.stringify(this.adminData));
      return true;
    }
    return false;
  }

  adminLogout(): void {
    this.currentAdminSubject.next(null);
    localStorage.removeItem('currentAdmin');
    this.loginService.logout();

    this.router.navigate(['/login']);
  }

  isAdminAuthenticated(): boolean {
    return this.currentAdminSubject.value !== null;
  }

  getCurrentAdmin(): AdminUser | null {
    return this.currentAdminSubject.value;
  }
}