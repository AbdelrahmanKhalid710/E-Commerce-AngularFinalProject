import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api-service';
import { Product } from '../../../../../interfaces';
import { ProductReviews } from '../../reviews/product-reviews/product-reviews';
import { CartService } from '../../../services/shopping-cart/cart-service/cart-service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductReviews],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  selectedImageIndex = signal(0);
  activeTab = signal('details'); // Add tab state

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.loadProductDetails(productId);
      }
    });
  }

  loadProductDetails(productId: string): void {
    this.apiService.getProductById(productId).subscribe({
      next: (response) => {
        this.product.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load product details');
        this.loading.set(false);
        console.error('Error loading product:', error);
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  addToCart(): void {
    const product = this.product();
    if (product) {
      console.log('Add to cart:', product);
      alert(`Added "${product.title}" to cart.`);
      this.cartService.addProductToCart(product);
    }
  }

  // Helper methods to safely access product properties
  hasDiscount(): boolean {
    const product = this.product();
    return !!product?.priceAfterDiscount && product.priceAfterDiscount < product.price;
  }

  getDiscountPercentage(): number {
    const product = this.product();
    if (!product || !this.hasDiscount()) return 0;
    return Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100);
  }

  getProductTitle(): string {
    return this.product()?.title || '';
  }

  getProductDescription(): string {
    return this.product()?.description || '';
  }

  getProductCategory(): string {
    return this.product()?.category?.name || '';
  }

  getProductBrand(): string {
    return this.product()?.brand?.name || '';
  }

  getProductPrice(): number {
    return this.product()?.price || 0;
  }

  getProductPriceAfterDiscount(): number | undefined {
    return this.product()?.priceAfterDiscount;
  }

  getProductQuantity(): number {
    return this.product()?.quantity || 0;
  }

  getProductSold(): number {
    return this.product()?.sold || 0;
  }

  getProductRating(): number {
    return this.product()?.ratingsAverage || 0;
  }

  getProductRatingCount(): number {
    return this.product()?.ratingsQuantity || 0;
  }

  getProductImages(): string[] {
    return this.product()?.images || [];
  }

  get mainImage(): string {
    const product = this.product();
    if (!product) return '';

    const selectedIndex = this.selectedImageIndex();
    if (product.images && product.images.length > 0 && selectedIndex < product.images.length) {
      return product.images[selectedIndex];
    }
    return product.imageCover || 'https://via.placeholder.com/500x500/CCCCCC/FFFFFF?text=No+Image';
  }

  // Add tab switching method
  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }
}
