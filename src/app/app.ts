import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartBadge } from './core/components/shopping-cart/cart-badge/cart-badge';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, CartBadge],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}
