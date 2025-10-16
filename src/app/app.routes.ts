import { Routes } from '@angular/router';
import { UserLogin } from './core/components/Auth/user-login/user-login';
import { UserRegister } from './core/components/Auth/user-register/user-register';
import { FavoritesList } from './core/components/favorites-components/favorites-list/favorites-list';
import { authGuard } from './core/services/Auth/core/guards/auth-guard';
import { CanActivate } from '@angular/router';






export const routes: Routes = [
  { path: 'login', component: UserLogin },
  { path: 'register', component: UserRegister },
  { path: 'favorites', component: FavoritesList ,canActivate: [authGuard]},
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default page
  { path: '**', redirectTo: 'login' } // Handle invalid routes
];
