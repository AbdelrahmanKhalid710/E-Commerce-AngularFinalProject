import { CommonModule } from '@angular/common';
import { Component, Input, inject, signal } from '@angular/core';
import { Review } from '../../../../shared/IModels';
import { Reviews } from '../../../services/reviews/reviews';
import { FormsModule } from '@angular/forms';
import { Login } from '../../../services/Auth/login';
@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.css'
})
export class ProductReviews { 
  private reviewService = inject(Reviews);
  private loginservice = inject(Login);
  @Input() productId!: string;
  
  reviews = signal<Review[]>([]);
  loading = signal(true);
  
  rating = 5;
  comment = '';

  //  userId = localStorage.getItem('userId') || 'guest';
  get userEmail(): string {
    return this.loginservice.user()?.email || 'guest@example.com';
  }
  // 👇 derive username automatically
  get userName(): string {  
    if (!this.userEmail) return 'Guest';
    return this.userEmail.split('@')[0];
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading.set(true);
    setTimeout(() => {
      const allReviews = this.reviewService.getReviewsByProduct(this.productId);
      this.reviews.set(allReviews);
      this.loading.set(false);
    }, 300);
  }

  addReview(): void {
     if (!this.comment.trim()) return;

    this.reviewService.addReview(
      this.productId,
      this.userEmail,
      this.userName,
      this.rating,
      this.comment.trim()
    );

    this.comment = '';
    this.rating = 5;
    this.loadReviews();
  }

  deleteReview(email: string): void {
    this.reviewService.deleteReview(this.productId, email);
    this.loadReviews();
  }

  getStarRating(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getAverageRating(): number {
    const reviews = this.reviews();
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round(Number((total / reviews.length).toFixed(1)));
  }

  getRatingDistribution(): { [key: number]: number } {
    const reviews = this.reviews();
    const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  }

  getRatingPercentage(rating: number): number {
    const distribution = this.getRatingDistribution();
    const totalReviews = this.reviews().length;
    if (totalReviews === 0) return 0;
    return (distribution[rating] / totalReviews) * 100;
  }

 canDeleteReview(reviewEmail: string): boolean {
    return this.userEmail === reviewEmail || this.userEmail === 'admin@example.com';
  }
}
