import { CommonModule } from '@angular/common';
import { Component, computed, inject, HostListener } from '@angular/core';
import { RouterLink, RouterModule, Router, NavigationEnd } from '@angular/router';
import { CartBadge } from '../../shopping-cart/cart-badge/cart-badge';
import { FavoriteIcon } from '../../favorites-components/favorite-icon/favorite-icon';
import { Login } from '../../../services/Auth/login';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, CartBadge, FavoriteIcon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
private loginService = inject(Login);
  private router = inject(Router);
  currentRoute: string = '';
  isScrolled = false;

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  isAdminRoute(): boolean {
    return this.currentRoute.includes('/admin');
  }

  user = this.loginService.user;
  token = this.loginService.token;

  isLoggedIn = computed(() => !!this.user() && !!this.token());

  onLoginClick(): void {
    if (this.isLoggedIn()) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  searchProducts(searchTerm: string): void {
    if (searchTerm.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: searchTerm.trim() }
      });
    }
  }
}
