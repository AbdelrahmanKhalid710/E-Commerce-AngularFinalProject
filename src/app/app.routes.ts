 import { Routes } from '@angular/router';
import { authGuard } from './core/services/Auth/core/guards/auth-gard'; // fix path as needed
import { UserLogin } from './core/components/Auth/user-login/user-login';
import { UserRegister } from './core/components/Auth/user-register/user-register';
import { FavoritesList } from './core/components/favorites-components/favorites-list/favorites-list';
import { Home } from './core/components/Home/home/home';
import { CartComponent } from './core/components/shopping-cart/cart-component/cart-component/cart-component';
import { UserProfile } from './core/components/Auth/UserProfile/user-profile/user-profile';
import { ProductsList } from './core/components/Products/products-list/products-list';
import { ProductDetails } from './core/components/Products/product-details/product-details';
import { AdminLoginComponent } from './core/components/AdminDashBoard/AdminLogin/admin-login.component';
import { AdminDashboardComponent } from './core/components/AdminDashBoard/AdminDashBoardUI/admin-dashboard.component';
import { AdminUsersComponent } from './core/components/AdminDashBoard/AdminUsers/admin-users.component';
import { AdminOrdersComponent } from './core/components/AdminDashBoard/AdminOrders/admin-orders.component';
import { AdminAuthGuard } from './core/services/AdminDashBoard/admin-auth.guard'; 
import {AnalyticsComponent} from './core/components/AdminDashBoard/AdminAnalysis/Admin-Analysis-Comonent'
export const routes: Routes = [
  { path: 'login', component: UserLogin },
  { path: 'register', component: UserRegister },
  { path: 'favorites', component: FavoritesList, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent },
  { path: 'products', component: ProductsList},
  { path: 'products/:id', component: ProductDetails},
  { path: 'home', component: Home },
    // ADMIN ROUTES (without lazy loading)
  { path: 'admin/login', component: AdminLoginComponent },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AdminAuthGuard],
    children: [
      { path: 'users', component: AdminUsersComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },
  { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' }

  // YOUR EXISTING DEFAULT ROUTES...
  ,

  {path: 'profile', component: UserProfile, canActivate: [authGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];