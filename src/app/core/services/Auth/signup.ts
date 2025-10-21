import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Signup {
  private baseUrl = 'https://ecommerce.routemisr.com';

  constructor(private http: HttpClient) {}

  /**
   * Registers a new user.
   * We map the API response to return a consistent structure:
   * message, user object, and token.
   */
  signUp(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/auth/signup`, userData).pipe(
      map((res: any) => {
        return {
          message: res.message || 'success',
          user: {
            name: res.user?.name || userData.name,
            email: res.user?.email || userData.email,
            role: res.user?.role || 'user'
          },
          token: res.token || ''
        };
      })
    );
  }
}
