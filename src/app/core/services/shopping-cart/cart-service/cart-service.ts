import { Injectable, signal, effect, inject } from '@angular/core';
import { ICartItem } from '../../../../../interfaces/icart-item';
import { toCartItem } from '../../../../../app/shared/cart-util';
import { Product } from '../../../../../interfaces';
import { Login } from '../../Auth/login';

const getCartKey = (userEmail: string) => `cart-${userEmail}`;

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _cartItems = signal<ICartItem[]>([]);
  readonly cartItems = this._cartItems;
  private auth = inject(Login);

  constructor() {

    // EFFECT 1: Load the cart whenever the user changes.
    // This effect runs immediately and re-runs when auth.currentUser() changes.
    effect(() => {
      const user = this.auth.currentUser();
      const userEmail = user ? user.email : 'guest';
      console.log(`User state changed. Loading cart for: ${userEmail}`);
      this.loadCartForUser(userEmail);
    });

    // EFFECT 2: Save the cart whenever the cart data OR the user changes.
    // This ensures the cart is saved to the correct key.
    effect(() => {
      const user = this.auth.currentUser();
      const key = user ? getCartKey(user.email) : 'cart-guest';
      const currentCart = this._cartItems();

      console.log(`Saving cart to ${key}`, currentCart);
      localStorage.setItem(key, JSON.stringify(currentCart));
    });

  }

  loadCartForUser(userEmail: string): void {
    const key = getCartKey(userEmail);
    const stored = localStorage.getItem(key);
    console.log('Attempting to load cart from key:', key);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this._cartItems.set(parsed);
        console.log('Loaded cart from localStorage:', parsed);
      } catch {
        console.warn(`Failed to parse cart for key ${key}`);
        this._cartItems.set([]);
      }
    } else {
      // No cart found, start with an empty one
      this._cartItems.set([]);
    }

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
    console.log('Cart cleared.');
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
