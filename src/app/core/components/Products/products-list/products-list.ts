import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductCard } from '../../../../shared/product-card/product-card';
import { ApiService } from '../../../services/api-service';
import { Product } from '../../../../../interfaces';


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

  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  currentCategory = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      this.currentCategory.set(category);
      this.loadProducts(category);
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

  onToggleFavorite(product: Product): void {
    console.log('Toggle favorite:', product);
    // Implement favorites functionality
  }

  clearFilters(): void {
    this.router.navigate(['/products']);
  }
}
