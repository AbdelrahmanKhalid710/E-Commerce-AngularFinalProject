import { Injectable, signal, effect } from '@angular/core';
import { ICartItem } from '../../../../../interfaces/icart-item';
import { toCartItem } from '../../../../../app/shared/cart-util';
import { Product } from '../../../../../interfaces';
const CART_STORAGE_KEY = 'my-cart-items';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _cartItems = signal<ICartItem[]>([]);
  readonly cartItems = this._cartItems;

  constructor() {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this._cartItems.set(parsed);
      } catch {
        console.warn('Failed to parse cart from localStorage');
      }
    }

    // Save to localStorage on change
    effect(() => {
      const current = this._cartItems();
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(current));
    });

  }

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
    localStorage.removeItem(CART_STORAGE_KEY);
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

}
