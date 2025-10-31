
import { Component, computed, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Login } from './core/services/Auth/login';
import { CartBadge } from './core/components/shopping-cart/cart-badge/cart-badge';
import { FavoriteIcon } from "./core/components/favorites-components/favorite-icon/favorite-icon";
import { Navbar } from './core/components/layout/navbar/navbar';
import { Footer } from './core/components/layout/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, CartBadge, RouterModule, FavoriteIcon, Navbar, Footer],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styleUrls: ['./app.css']
})
export class App {
  private loginService = inject(Login);
  private router = inject(Router);
  currentRoute: string = '';
  isScrolled = false; // Add this

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