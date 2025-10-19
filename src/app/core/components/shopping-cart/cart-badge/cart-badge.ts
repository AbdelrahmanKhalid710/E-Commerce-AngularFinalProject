import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/shopping-cart/cart-service/cart-service';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-cart-badge',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-badge.html',
  styleUrl: './cart-badge.css'
})
export class CartBadge {
  private cartService = inject(CartService);
  cartItems = this.cartService.cartItems;

  itemCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.orderQuantity, 0)
  );

}
