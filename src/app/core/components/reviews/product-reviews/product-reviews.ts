import { CommonModule } from '@angular/common';
import { Component, Input, inject, signal } from '@angular/core';
import { Review } from '../../../../shared/IModels';
import { Reviews } from '../../../services/reviews/reviews';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.css'
})
export class ProductReviews {
// @Input() productId! : string;
// reviews:Review[]= [];

// userId = localStorage.getItem('userId') || 'guest';
// userName = localStorage.getItem('userName')||'Guest User';
// rating = 5;
// comment = '';
// constructor(private reviewService: Reviews){}

// ngOnInit():void{
//   this.loadReviews();
// }
// loadReviews():void{
//   this.reviews = this.reviewService.getReviewsByProduct(this.productId);
// }
// addReview(): void{
//   if(!this.comment.trim()) return;
//   this.reviewService.addReview(
//     this.productId,
//     this.userId,
//     this.userName,
//     this.rating,
//     this.comment.trim()
//   );
//   this.comment = '';
//   this.rating = 5;
//   this.loadReviews();
// }
// deletReview(id:string):void{
//   this.reviewService.deleteReview(id,this.userId);
//   this.loadReviews();
// }
private reviewService = inject(Reviews);
  
  @Input() productId!: string;
  
  reviews = signal<Review[]>([]);
  loading = signal(true);
  
  // Form data
  rating = 5;
  comment = '';
  
  // User info from localStorage
  userId = localStorage.getItem('userId') || 'guest';
  userName = localStorage.getItem('userName') || 'Guest User';

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading.set(true);
    // Simulate loading for better UX
    setTimeout(() => {
      this.reviews.set(this.reviewService.getReviewsByProduct(this.productId));
      this.loading.set(false);
    }, 500);
  }

  addReview(): void {
    if (!this.comment.trim()) return;
    
    this.reviewService.addReview(
      this.productId,
      this.userId,
      this.userName,
      this.rating,
      this.comment.trim()
    );
    
    // Reset form
    this.comment = '';
    this.rating = 5;
    
    // Reload reviews
    this.loadReviews();
  }

  deleteReview(id: string): void {
    this.reviewService.deleteReview(id, this.userId);
    this.loadReviews();
  }

  // Helper methods for template
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

  // Calculate average rating
  getAverageRating(): number {
    const reviews = this.reviews();
    if (reviews.length === 0) return 0;
    
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round(Number((total / reviews.length).toFixed(1)));
  }

  // Get rating distribution
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

  // Check if current user can delete a review
  canDeleteReview(reviewUserId: string): boolean {
    return this.userId === reviewUserId || this.userId === 'admin';
  }
}
