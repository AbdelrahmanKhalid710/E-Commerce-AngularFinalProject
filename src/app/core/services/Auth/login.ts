import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../../../interfaces/iuser';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class Login {
  private baseUrl = 'https://ecommerce.routemisr.com';

  // 🧠 Signals to store user and token in memory
  user = signal<User | null>(null);
  token = signal<string | null>(null);

  // 🧩 Reactive computed property
  isAuthenticated = computed(() => !!this.user() && !!this.token());

  private auth = inject(Auth);
  private router = inject(Router);

  constructor(private http: HttpClient) {}

  // --- NORMAL LOGIN (API) ---
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/auth/signin`, credentials).pipe(
      tap((response: any) => {
        if (response.token) this.saveToken(response.token);
        if (response.user) this.saveUser(response.user);
        if (response.token) this.saveTokenInLocalStorage(response.token);
        if (credentials.email) this.saveEmailInLocalStorage(credentials.email);
        if (credentials.password) this.savePasswordInLocalStorage(credentials.password);
      })
    );
  }

  // --- SAVE USER & TOKEN IN MEMORY ---
  saveUser(user: User): void {
    this.user.set(user);
    localStorage.setItem('userEmail', user.email);
  }

  saveToken(token: string): void {
    this.token.set(token);
  }

  // --- SAVE TO LOCAL STORAGE ---
  saveEmailInLocalStorage(email: string): void {
    localStorage.setItem('email', email);
  }

  savePasswordInLocalStorage(password: string): void {
    localStorage.setItem('password', password);
  }

  saveTokenInLocalStorage(token: string): void {
    localStorage.setItem('token', token);
  }

  // --- LOGOUT ---
  logout(): void {
    this.user.set(null);
    this.token.set(null);
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('token');
  }

  // --- ROLE HELPERS ---
  getUserRole(): string | null {
    return this.user()?.role ?? null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  // --- GOOGLE LOGIN ---
  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      console.log('✅ Google Login Success:', user);

      const token = await user.getIdToken();
      this.saveToken(token);
      this.saveUser({
        name: user.displayName || '',
        email: user.email || '',
        role: 'user'
      });

      // Save for persistence
      this.saveEmailInLocalStorage(user.email!);
      localStorage.removeItem('password'); // Google users have no password
      this.saveTokenInLocalStorage(token);

      await this.router.navigate(['/home']);
    } catch (error) {
      console.error('❌ Google login error:', error);
    }
  }

  // --- AUTO LOGIN ON APP START ---
  autoLogin(): void {
    const email = localStorage.getItem('userEmail');
    const password = localStorage.getItem('password');
    const token = localStorage.getItem('token');

    // ✅ 1️⃣ Google login case: email + token (no password)
    if (email && token && !password) {
      console.log('🔁 Auto-login → Google user');
      this.saveUser({
        name: email.split('@')[0],
        email,
        role: 'user'
      });
      this.saveToken(token);
      return;
    }

    // ✅ 2️⃣ API login case: email + password
    if (email && password) {
      console.log('🔁 Auto-login → API user');

      // If we already have token → just restore
      if (token) {
        this.saveUser({
          name: email.split('@')[0],
          email,
          role: 'user'
        });
        this.saveToken(token);
        return;
      }
      console.log('🔄 Auto-login');
      // Else revalidate with backend
      const credentials = { email, password };
      this.login(credentials).subscribe({
        next: (res) => {
          if (res.token) this.saveToken(res.token);
          if (res.token) this.saveTokenInLocalStorage(res.token);
          if (res.user) this.saveUser(res.user);
          console.log('✅ Auto-login success for API user');
        },
        error: (err) => {
          console.error('❌ Auto-login failed:', err);
          this.logout(); // clear bad data
        }
      });
    }
  }
}
