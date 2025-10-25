import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Review } from '../../../../shared/IModels';
import { Reviews } from '../../../services/reviews/reviews';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-product-reviews',
  imports: [CommonModule,FormsModule],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.css'
})
export class ProductReviews {
@Input() productId! : string;
reviews:Review[]= [];

userId = localStorage.getItem('userId') || 'guest';
userName = localStorage.getItem('userName')||'Guest User';
rating = 5;
comment = '';
constructor(private reviewService: Reviews){}

ngOnInit():void{
  this.loadReviews();
}
loadReviews():void{
  this.reviews = this.reviewService.getReviewsByProduct(this.productId);
}
addReview(): void{
  if(!this.comment.trim()) return;
  this.reviewService.addReview(
    this.productId,
    this.userId,
    this.userName,
    this.rating,
    this.comment.trim()
  );
  this.comment = '';
  this.rating = 5;
  this.loadReviews();
}
deletReview(id:string):void{
  this.reviewService.deleteReview(id,this.userId);
  this.loadReviews();
}

}
