import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductCard } from '../../../../shared/product-card/product-card';
import { ApiService } from '../../../services/api-service';
import { Product } from '../../../../../interfaces';
import { Favorites } from '../../../services/favorites/favoritesService';
@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css'
})
export class ProductsList implements OnInit {
private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private favoritesService = inject(Favorites);
 
  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  currentCategory = signal<string | null>(null);
  favoriteIds: Set<string> = new Set();

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      this.currentCategory.set(category);
      this.loadProducts(category);
    });
     this.favoritesService.getAllFavoriteProducts().subscribe({
    next: (res) => {
      this.favoriteIds = new Set(res.data.map((p: any) => p._id));
    }
  });
  }

  loadProducts(category?: string): void {
    this.loading.set(true);
    this.apiService.getAllProducts().subscribe({
      next: (response) => {
        let filteredProducts = response.data;
        
        // Filter by category if provided
        if (category) {
          filteredProducts = response.data.filter(product => 
            product.category.slug.toLowerCase().includes(category.toLowerCase()) ||
            product.category.name.toLowerCase().includes(category.toLowerCase())
          );
        }
        
        this.products.set(filteredProducts);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load products');
        this.loading.set(false);
        console.error('Error loading products:', error);
      }
    });
  }

  onAddToCart(product: Product): void {
    console.log('Add to cart:', product);
    // Implement cart functionality
  }

onToggleFavorite(product: any) {
  const productId = product._id;
  this.favoritesService.toggleFavorite(productId).subscribe({
    next: () => {
      if (this.favoriteIds.has(productId)) {
        this.favoriteIds.delete(productId);
      } else {
        this.favoriteIds.add(productId);
      }
    }
  });
}
isFavorite(productId: string) {
  return this.favoriteIds.has(productId);
}
  clearFilters(): void {
    this.router.navigate(['/products']);
  }
}
