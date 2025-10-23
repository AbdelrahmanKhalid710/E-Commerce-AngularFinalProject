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

export const routes: Routes = [
  { path: 'login', component: UserLogin },
  { path: 'register', component: UserRegister },
  { path: 'favorites', component: FavoritesList,  }, //canActivate: [authGuard]
  { path: 'cart', component: CartComponent },
  { path: 'products', component: ProductsList},
  { path: 'products/:id', component: ProductDetails},
  { path: 'home', component: Home },
  {
    path: 'profile', component: UserProfile, canActivate: [authGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];
