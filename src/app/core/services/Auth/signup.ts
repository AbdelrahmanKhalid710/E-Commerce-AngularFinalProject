// src/app/core/services/auth/signup.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Signup {
  private baseUrl = 'https://ecommerce.routemisr.com';

  constructor(private http: HttpClient) { }

  /**
   * Sends user data to the signup API endpoint.
   * @param userData Object containing name, email, password, etc.
   * @returns Observable of the API response.
   */
  signUp(userData: any): Observable<any> {
    // Uses the /auth/signup endpoint from your Postman screenshot
    return this.http.post(`${this.baseUrl}/api/v1/auth/signup`, userData);
  }
}