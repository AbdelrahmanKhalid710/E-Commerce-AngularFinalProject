// src/app/core/services/auth/login.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../../interfaces/iuser';
import { signal } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Login {
  // Use a placeholder for your base URL. Get this from your environment file.
  private baseUrl = 'https://ecommerce.routemisr.com';
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) { }

  /**
   * Sends user credentials to the login API endpoint.
   * @param credentials Object containing email and password.
   * @returns Observable of the API response.
   */
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/auth/signin`, credentials).pipe(
      tap((response: any) => {
        this.saveToken(response.token);
        this.currentUser.set(response.user); // assuming response.user exists
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.currentUser.set(null);
  }

  // --- Token Management Helpers ---

  /**
   * Stores the JWT token in localStorage upon successful login.
   * @param token The JWT string received from the API.
   */
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  /**
   * Retrieves the stored JWT token. Essential for authenticated requests.
   * @returns The JWT string or null if not found.
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Checks if a user is currently authenticated (used for Route Guards).
   * @returns boolean true if a token exists, false otherwise.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

}