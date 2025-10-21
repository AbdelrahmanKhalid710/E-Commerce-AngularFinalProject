import { Routes } from '@angular/router';

// ✅ Components
import { UserLogin } from './core/components/Auth/user-login/user-login';
import { UserRegister } from './core/components/Auth/user-register/user-register';
import { FavoritesList } from './core/components/favorites-components/favorites-list/favorites-list';
import { Home } from './core/components/Home/home/home';
import { CartComponent } from './core/components/shopping-cart/cart-component/cart-component/cart-component';

// ✅ Guards (correct import paths)
import { authGuard } from './core/services/Auth/core/guards/auth-gard';
import { adminGuard } from './core/services/Auth/core/guards/admin-gard';

// ✅ Route Configuration
export const routes: Routes = [
  // Public routes
  { path: 'login', component: UserLogin },
  { path: 'register', component: UserRegister },

  // Protected routes
  { path: 'favorites', component: FavoritesList, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },

  // Default & home routes
  { path: '', component: Home },
  { path: 'home', redirectTo: '', pathMatch: 'full' },

  // Example admin route (optional)
  // { path: 'dashboard', component: AdminDashboard, canActivate: [adminGuard] },

  // Wildcard fallback
  { path: '**', redirectTo: 'login' }
];
