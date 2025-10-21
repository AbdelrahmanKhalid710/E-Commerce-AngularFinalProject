// src/app/core/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Login } from '../../login';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(Login);
  const router = inject(Router);

  if (loginService.isAuthenticated()) {
    return true; // ✅ logged-in user (any role)
  } else {
    // 🚫 not logged in
    router.navigate(['/login']);
    return false;
  }
};
