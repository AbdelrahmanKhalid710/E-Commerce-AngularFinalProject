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
  favoriteIds: Set<string> = new Set();
  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadFavorites();
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
  loadFavorites() {
    this.favoritesService.getAllFavoriteProducts().subscribe({
      next: (res) => {
        const favs = res.data || [];
        this.favoriteIds = new Set(favs.map((f: any) => f._id));
      },
      error: (err) => console.error(err)
    });
  }

  onAddToCart(product: Product): void {
    console.log('Add to cart:', product);
    alert(`Added "${product.title}" to cart.`);
    this.cartService.addProductToCart(product);
  }

 onToggleFavorite(product: any) {
    const productId = product._id;

    if (this.favoriteIds.has(productId)) {
      // Remove from favorites
      this.favoritesService.removeProductFromFavoriteList(productId).subscribe({
        next: () => {
          this.favoriteIds.delete(productId);
        },
        error: (err) => console.error(err)
      });
    } else {
      // Add to favorites
      this.favoritesService.addProductToFavoriteList(productId).subscribe({
        next: () => {
          this.favoriteIds.add(productId);
        },
        error: (err) => console.error(err)
      });
    }
  }

  isFavorite(productId: string): boolean {
    return this.favoriteIds.has(productId);
  }
}
