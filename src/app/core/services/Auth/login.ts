import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../../../../interfaces/iuser';

@Injectable({
  providedIn: 'root'
})
export class Login {
  private baseUrl = 'https://ecommerce.routemisr.com';

  // 🧠 Signals to store data in memory (not in localStorage)
  user = signal<User | null>(null);
  token = signal<string | null>(null);

  // ✅ Computed signal: automatically updates when user or token changes
  isAuthenticated = computed(() => !!this.user() && !!this.token());

  constructor(private http: HttpClient) {}

  // --- 🟢 LOGIN ---
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/auth/signin`, credentials).pipe(
      tap((response: any) => {
        // Save user and token in memory using signals
        if (response.token) this.saveToken(response.token);
        if (response.user) this.saveUser(response.user);
      })
    );
  }

  // --- 🟢 SAVE USER & TOKEN IN MEMORY ---
  saveUser(user: User): void {
    this.user.set(user);
  }

  saveToken(token: string): void {
    this.token.set(token);
  }

  // --- 🔴 LOGOUT ---
  logout(): void {
    this.user.set(null);
    this.token.set(null);
  }

  // --- ⚙️ ROLE HELPERS ---
  getUserRole(): string | null {
    return this.user()?.role ?? null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
}
