import { Routes } from '@angular/router';

// ✅ Components
import { UserLogin } from './core/components/Auth/user-login/user-login';
import { UserRegister } from './core/components/Auth/user-register/user-register';
import { FavoritesList } from './core/components/favorites-components/favorites-list/favorites-list';

// ✅ Guards (correct import paths)
import { authGuard } from './core/services/Auth/core/guards/auth-gard';
import { adminGuard } from './core/services/Auth/core/guards/admin-gard';

// ✅ Route Configuration
export const routes: Routes = [
  // Public routes
  { path: 'login', component: UserLogin },
  { path: 'register', component: UserRegister },

  // Protected route — only logged-in users can see Favorites
  { path: 'favorites', component: FavoritesList, canActivate: [authGuard] },
  // 🔥🔥🔥🔥🔥🔥🔥🔥donet forget it 
  // Example: admin-only route (optional, add your admin dashboard component later)
  // { path: 'dashboard', component: AdminDashboard, canActivate: [adminGuard] },

  // Default redirect
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Wildcard fallback
  { path: '**', redirectTo: 'login' }
];
