import { Component, inject, OnInit } from '@angular/core';
import { Favorites } from '../../../services/favorites/favoritesService';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../../../../shared/product-card/product-card';
import { Product } from '../../../../../interfaces';
import { CartService } from '../../../services/shopping-cart/cart-service/cart-service';

@Component({
  selector: 'app-favorites-list',
  imports: [CommonModule,ProductCard],
  templateUrl: './favorites-list.html',
  styleUrl: './favorites-list.css',
  standalone: true
})
export class FavoritesList {
  favorites: any[] = [];
  loading = true;
  private cartService = inject(CartService);
  constructor(private favoritesService: Favorites) { }
  ngOnInit(): void {
    this.getFavorites();
  }
  getFavorites() {

    this.favoritesService.getAllFavoriteProducts().subscribe({
      next: (res: any) => {
        this.favorites = res?.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching favorites:', err);
        this.loading = false;
      }
    });
  }
  removeFromList(productId: string): void {
    this.favoritesService.removeProductFromFavoriteList(productId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f._id !== productId);
      },
      error: (err) => console.error('Error deleting favorite:', err)
    });
  }
   onToggleFavorite(product: Product): void {
    this.removeFromList(product._id);
  }
  
  onAddToCart(product: Product): void {
    console.log('Add to cart:', product);
    alert(`Added "${product.title}" to cart.`);
    this.cartService.addProductToCart(product);
  }
}
