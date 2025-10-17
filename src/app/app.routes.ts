import { Routes } from '@angular/router';
import { UserLogin } from './core/components/Auth/user-login/user-login';
import { UserRegister } from './core/components/Auth/user-register/user-register';
import { FavoritesList } from './core/components/favorites-components/favorites-list/favorites-list';
import { authGuard } from './core/services/Auth/core/guards/auth-guard';
import { CanActivate } from '@angular/router';
import { Home } from './core/components/Home/home/home';






export const routes: Routes = [
  { path: 'login', component: UserLogin },
  { path: 'register', component: UserRegister },
  { path: 'favorites', component: FavoritesList ,canActivate: [authGuard]},
  { path: '', component: Home }, // Default page
  { path: 'home', redirectTo: '', pathMatch: 'full'},
  //{ path: '**', redirectTo: 'login' } // Handle invalid routes
];
