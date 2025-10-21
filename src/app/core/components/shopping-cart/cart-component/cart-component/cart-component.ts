import { Component, computed, inject } from '@angular/core';
import { ICartItem } from '../../../../../../interfaces/icart-item';
import { CartService } from '../../../../services/shopping-cart/cart-service/cart-service';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../cart-item/cart-item/cart-item';

@Component({
  selector: 'app-cart-component',
  imports: [CommonModule, CartItem],
  templateUrl: './cart-component.html',
  styleUrl: './cart-component.css'
})
export class CartComponent {
  private cartService = inject(CartService);
  cartItems = this.cartService.cartItems;
  total = computed(() =>
    this.cartItems().reduce((sum, item) => {
      const price = item.product.priceAfterDiscount ?? item.product.price;
      return sum + price * item.orderQuantity;
    }, 0)
  );


  removeItem(id: string): void {
    this.cartService.removeFromCart(id);
  }

  checkout(): void {
    this.cartService.checkout();
  }

}
