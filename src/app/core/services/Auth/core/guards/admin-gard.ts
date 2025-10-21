import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Login } from '../../login'

export const adminGuard: CanActivateFn = (route, state) => {
  const loginService = inject(Login);
  const router = inject(Router);

  // ✅ only allow if authenticated AND has admin role
  if (loginService.isAuthenticated() && loginService.isAdmin()) {
    return true;
  } else {
    console.warn('🚫 Access denied: Admins only.');
    router.navigate(['/']); // redirect to home or error page
    return false;
  }
};
