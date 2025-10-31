import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductCard } from '../../../../shared/product-card/product-card';
import { ApiService } from '../../../services/api-service';

import { Product, Category, Brand } from '../../../../../interfaces';
import { Favorites } from '../../../services/favorites/favoritesService';
import { ProductsFilter } from '../../../../shared/products-filter/products-filter';
import { CartService } from '../../../services/shopping-cart/cart-service/cart-service';
@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard, ProductsFilter],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css'
})
export class ProductsList implements OnInit {
private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private favoritesService = inject(Favorites);
  private cartService = inject(CartService);
 
  // Data signals
  //products = signal<Product[]>([]);
  allProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  brands = signal<Brand[]>([]); 
  
  loading = signal(true);
  error = signal<string | null>(null);
  favoriteIds: Set<string> = new Set();
   // Filter signals
  searchTerm = signal('');
  selectedCategoryId = signal<string>('');
  selectedBrandId = signal<string>('');
  priceRange = signal({ min: 0, max: 10000 });
  sortBy = signal('name');
  showFilters = signal(false);

  // Computed filtered products
  filteredProducts = computed(() => {
    let products = this.allProducts();

    // Apply search filter
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      products = products.filter(product =>
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.name.toLowerCase().includes(term) ||
        product.brand.name.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (this.selectedCategoryId()) {
      products = products.filter(product =>
        product.category._id === this.selectedCategoryId()
      );
    }

    // Apply brand filter
    if (this.selectedBrandId()) {
      products = products.filter(product =>
        product.brand._id === this.selectedBrandId()
      );
    }

    // Apply price range filter
    products = products.filter(product =>
      product.price >= this.priceRange().min &&
      product.price <= this.priceRange().max
    );

    // Apply sorting
    products = this.sortProducts(products);

    return products;
  });
  
  ngOnInit(): void {
    this.loadInitialData();
    
    // Handle URL query parameters
    this.route.queryParams.subscribe(params => {
      const categoryId = params['categoryId'];
      const search = params['search'];
      
      if (categoryId) {
        this.selectedCategoryId.set(categoryId);
      }
      
      if (search) {
        this.searchTerm.set(search);
      }
      
      this.loadProducts();
    });
     this.favoritesService.getAllFavoriteProducts().subscribe({
    next: (res) => {
      this.favoriteIds = new Set(res.data.map((p: any) => p._id));
    }
  });
  }
  loadInitialData(): void {
    this.loading.set(true);
    
    // Load products
    this.apiService.getAllProducts().subscribe({
      next: (response) => {
        this.allProducts.set(response.data);
        this.extractCategoriesAndBrands(); // Extract from products
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load products');
        this.loading.set(false);
      }
    });

    // Also load separate categories and brands from API
    this.apiService.getAllCategories().subscribe({
      next: (response) => {
        this.categories.set(response.data);
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
      }
    });

    // In products-list.component.ts - temporary fix
this.apiService.getAllBrands().subscribe({
  next: (response: any) => {
    console.log('Brands Response:', response);
    
    // Try different possible structures
    if (Array.isArray(response)) {
      this.brands.set(response);
    } else if (response.data) {
      this.brands.set(response.data);
    } else {
      this.brands.set([]);
    }
  },
  error: (error) => {
    console.error('Brands API Error:', error);
    this.brands.set([]);
  }
});
  }

  // Extract unique categories and brands from products
  private extractCategoriesAndBrands(): void {
    const products = this.allProducts();
    
    // Extract unique categories
    const uniqueCategories = new Map();
    products.forEach(product => {
      if (!uniqueCategories.has(product.category._id)) {
        uniqueCategories.set(product.category._id, product.category);
      }
    });
    this.categories.update(current => [...current, ...Array.from(uniqueCategories.values())]);

    // Extract unique brands
    const uniqueBrands = new Map();
    products.forEach(product => {
      if (!uniqueBrands.has(product.brand._id)) {
        uniqueBrands.set(product.brand._id, product.brand);
      }
    });
    this.brands.update(current => [...current, ...Array.from(uniqueBrands.values())]);
  }

  loadProducts(): void {
    // Products are already loaded, filtering happens in computed property
  }

  // Filter handlers
  onSearchChange(search: string): void {
    this.searchTerm.set(search);
    this.updateUrlParams();
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategoryId.set(categoryId);
    this.updateUrlParams();
  }

  onBrandChange(brandId: string): void {
    this.selectedBrandId.set(brandId);
    this.updateUrlParams();
  }

  onPriceRangeChange(range: { min: number; max: number }): void {
    this.priceRange.set(range);
  }

  onSortChange(sort: string): void {
    this.sortBy.set(sort);
  }

  onClearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategoryId.set('');
    this.selectedBrandId.set('');
    this.priceRange.set({ min: 0, max: 10000 });
    this.sortBy.set('name');
    
    // Clear URL parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }

  // Update URL with current filters
  private updateUrlParams(): void {
    const queryParams: any = {};
    
    if (this.searchTerm()) {
      queryParams.search = this.searchTerm();
    }
    
    if (this.selectedCategoryId()) {
      queryParams.categoryId = this.selectedCategoryId();
    }
    
    if (this.selectedBrandId()) {
      queryParams.brandId = this.selectedBrandId();
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  // Sorting logic
  private sortProducts(products: Product[]): Product[] {
    const sorted = [...products];
    
    switch (this.sortBy()) {
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'price':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return sorted;
    }
  }

  toggleFilters(): void {
    this.showFilters.update(show => !show);
  }

  getDisplayName(): string {
    if (this.selectedCategoryId()) {
      const category = this.categories().find(c => c._id === this.selectedCategoryId());
      return category ? category.name : 'All Products';
    }
    return 'All Products';
  }

  getBrandName(brandId: string): string {
    const brand = this.brands().find(b => b._id === brandId);
    return brand ? brand.name : '';
  }

  onAddToCart(product: Product): void {
    console.log('Add to cart:', product);
    alert(`Added "${product.title}" to cart.`);
    this.cartService.addProductToCart(product);
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
