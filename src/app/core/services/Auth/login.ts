import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../../../../interfaces/iuser';
import { inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  
  signInWithPopup
} from '@angular/fire/auth';
import { Router } from '@angular/router';
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

  constructor(private http: HttpClient) { }

  // --- 🟢 LOGIN ---
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/auth/signin`, credentials).pipe(
      tap((response: any) => {
        // Save user and token in memory using signals
        if (response.token) this.saveToken(response.token);
        if (response.user) this.saveUser(response.user);
        if (response.token) this.SaveTokenInLocalStorage(response.token);
      })
    );
  }

  // --- 🟢 SAVE USER & TOKEN IN MEMORY ---
  saveUser(user: User): void {
    this.user.set(user);
    localStorage.setItem('userId', user._id);
    localStorage.setItem('userEmail', user.email);
  }

  saveToken(token: string): void {
    this.token.set(token);
  }

  // --- 🔴 LOGOUT ---
  logout(): void {
    this.user.set(null);
    this.token.set(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('token'); 
  }

  // --- ⚙️ ROLE HELPERS ---
  getUserRole(): string | null {
    return this.user()?.role ?? null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  SaveTokenInLocalStorage(token: string): void {
    localStorage.setItem('token', token);
  }
  private auth = inject(Auth);
private router = inject(Router);

async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      console.log('Google Login Success:', user);


      // Save token for session persistence
      const token = await user.getIdToken();
      this.saveToken(token);
      //save User for session persistence
      this.saveUser({
        name: user.displayName || '',
        email: user.email || '',
        role: 'user'
      });
      // Redirect after login
      await this.router.navigate(['/home']);
    } catch (error) {
      console.error(' Google login error:', error);
    }
  }
}