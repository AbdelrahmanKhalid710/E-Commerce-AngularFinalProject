import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api-service';
import { ProductCard } from '../../../../shared/product-card/product-card';
import { Product } from '../../../../../interfaces';
import { CartService } from '../../../services/shopping-cart/cart-service/cart-service';
import { FavoriteIcon } from '../../favorites-components/favorite-icon/favorite-icon';
import { Favorites } from '../../../services/favorites/favoritesService';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './featured-products.html',
  styleUrl: './featured-products.css'
})
export class FeaturedProducts {
private apiService = inject(ApiService);
private cartService = inject(CartService);
private favoritesService = inject(Favorites);
  
  featuredProducts = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.apiService.getAllProducts().subscribe({
      next: (response) => {
        const featured = response.data
          .filter(product => product.ratingsAverage >= 4)
          .slice(0, 8);
        this.featuredProducts.set(featured);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load featured products');
        this.loading.set(false);
        console.error('Error loading products:', error);
      }
    });
  }

  onAddToCart(product: Product): void {
    console.log('Add to cart:', product);
    alert(`Added "${product.title}" to cart.`);
    this.cartService.addProductToCart(product);
  }

  onToggleFavorite(product: Product): void {
    console.log('Toggle favorite:', product);
    this.favoritesService.addProductToFavoriteList(product._id);
  }
}
