import { Injectable, signal } from '@angular/core';
import { ICartItem } from '../../../../../interfaces/icart-item';
import { toCartItem } from '../../../../../app/shared/cart-util';
import { Product } from '../../../../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _cartItems = signal<ICartItem[]>([]);
  readonly cartItems = this._cartItems;

  addToCart(item: ICartItem): void {
    const items = this._cartItems();
    const existing = items.find(p => p.product._id === item.product._id);

    if (existing) {
      existing.orderQuantity += item.orderQuantity;
    } else {
      items.push(item);
    }
    this._cartItems.set([...items]);
  }

  addProductToCart(product: Product): void {
    const item = toCartItem(product);
    this.addToCart(item);
  }

  removeFromCart(productId: string): void {
    const updated = this._cartItems().filter(p => p.product._id !== productId);
    this._cartItems.set(updated);
  }

  clearCart(): void {
    this._cartItems.set([]);
  }

  getTotal(): number {
    return this._cartItems().reduce((sum, item) => {
      const price = item.product.priceAfterDiscount ?? item.product.price;
      return sum + price * item.orderQuantity;
    }, 0);
  }

  checkout(): void {
    if (this.cartItems().length > 0) {
      console.log('Proceeding to checkout with:', {
        items: this.cartItems(),
        total: this.getTotal(),
      });
      // In a real app, you would typically navigate to another route or open a payment modal.
      alert('Checkout process started! Check the console for details.');
    }
  }

  // constructor() {
  //   // --- MOCK DATA ---
  //   // In a real app, this data would come from your API or be loaded from storage.
  //   this.cartItems.set([
  //     {
  //       productId: 'prod_001',
  //       title: 'Classic Crewneck T-Shirt',
  //       price: 24.99,
  //       quantity: 2,
  //       imageCover: 'https://placehold.co/400x400/f1f5f9/334155?text=T-Shirt',
  //     },
  //     {
  //       productId: 'prod_002',
  //       title: 'Slim-Fit Denim Jeans',
  //       price: 89.50,
  //       quantity: 1,
  //       imageCover: 'https://placehold.co/400x400/e0e7ff/4338ca?text=Jeans',
  //     },
  //     {
  //       productId: 'prod_003',
  //       title: 'Leather Ankle Boots',
  //       price: 145.00,
  //       quantity: 1,
  //       imageCover: 'https://placehold.co/400x400/d1d5db/1f2937?text=Boots',
  //     },
  //   ]);
  // }
}
