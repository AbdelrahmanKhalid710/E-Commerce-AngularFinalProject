// src/app/core/guards/auth.guard.ts

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Login } from './login';
export const authGuard: CanActivateFn = (route, state) => {
  // Inject the service that contains the authentication check
  const loginService = inject(Login);
  const router = inject(Router);

  if (loginService.isAuthenticated()) {
    return true; // User is logged in, allow navigation
  } else {
    // User is NOT logged in, redirect to the login page
    router.navigate(['/login']); 
    return false;
  }
};