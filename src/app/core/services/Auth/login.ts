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
