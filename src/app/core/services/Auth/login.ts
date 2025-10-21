
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// interface UserProfile {
//   name: string;
//   email: string;
//   role: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class Login {
//   private baseUrl = 'https://ecommerce.routemisr.com'; 

//   constructor(private http: HttpClient) {}

//   login(credentials: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/api/v1/auth/signin`, credentials);
//   }

//   saveToken(token: string): void {
//     localStorage.setItem('authToken', token);
//   }

//   saveUser(user: UserProfile): void {
//     localStorage.setItem('userProfile', JSON.stringify(user));
//   }

//   getUser(): UserProfile | null {
//     const userJson = localStorage.getItem('userProfile');
//     return userJson ? JSON.parse(userJson) as UserProfile : null;
//   }

//   getToken(): string | null {
//     return localStorage.getItem('authToken');
//   }

//   isAuthenticated(): boolean {
//     return !!this.getToken() && !!this.getUser();
//   }

//   // ✅ NEW: get role of current user
//   getUserRole(): string | null {
//     const user = this.getUser();
//     return user ? user.role : null;
//   }

//   // ✅ NEW: check if user is admin
//   isAdmin(): boolean {
//     return this.getUserRole() === 'admin';
//   }
// }

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class Login {
  private baseUrl = 'https://ecommerce.routemisr.com';

  // 🧠 Signals
  user = signal<UserProfile | null>(null);
  token = signal<string | null>(null);

  // ✅ Derived (computed) signal for authentication status
  isAuthenticated = computed(() => !!this.user() && !!this.token());

  constructor(private http: HttpClient) {}

  // --- Authentication Methods ---

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/auth/signin`, credentials);
  }

  saveUser(user: UserProfile): void {
    this.user.set(user);
  }

  saveToken(token: string): void {
    this.token.set(token);
  }

  logout(): void {
    this.user.set(null);
    this.token.set(null);
  }

  getUserRole(): string | null {
    return this.user()?.role ?? null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
}
