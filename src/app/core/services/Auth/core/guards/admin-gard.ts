import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Login } from '../../login'

export const adminGuard: CanActivateFn = (route, state) => {
  const loginService = inject(Login);
  const router = inject(Router);

  if (loginService.isAdmin()) {
    console.log('✅ Admin access granted');
    return true;
  } else {
    console.warn('❌ Access denied: Only admin allowed');
    router.navigate(['/login']);
    return false;
  }
};
