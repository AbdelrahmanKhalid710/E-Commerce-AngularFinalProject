import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Login } from '../../login';

export const authGuard: CanActivateFn = () => {
  const loginService = inject(Login);
  const router = inject(Router);

  if (loginService.isAuthenticated()) return true;

  router.navigate(['/login']);
  return false;
};
