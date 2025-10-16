// src/app/core/services/auth/login.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Login {
  // Use a placeholder for your base URL. Get this from your environment file.
  private baseUrl = 'https://ecommerce.routemisr.com'; 

  constructor(private http: HttpClient) { }

  /**
   * Sends user credentials to the login API endpoint.
   * @param credentials Object containing email and password.
   * @returns Observable of the API response.
   */
  login(credentials: any): Observable<any> {
    // Uses the /auth/signin endpoint from your Postman screenshot
    return this.http.post(`${this.baseUrl}/api/v1/auth/signin`, credentials);
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