import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Product } from '../../../interfaces';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
product = input.required<Product>();
  addToCart = output<Product>();
  toggleFavorite = output<Product>();

  get mainImage(): string {
    const product = this.product();
    return product.imageCover || product.images[0] || 'https://via.placeholder.com/300x300/CCCCCC/FFFFFF?text=No+Image';
  }

  get hasDiscount(): boolean {
    const product = this.product();
    return !!product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  }

  get discountPercentage(): number {
    if (!this.hasDiscount) return 0;
    const product = this.product();
    return Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100);
  }

  onAddToCart(event: Event): void {
    event.stopPropagation(); // Prevent navigation when clicking add to cart
    this.addToCart.emit(this.product());
  }

  onToggleFavorite(event: Event): void {
    event.stopPropagation(); // Prevent navigation when clicking favorite
    this.toggleFavorite.emit(this.product());
  }
}
