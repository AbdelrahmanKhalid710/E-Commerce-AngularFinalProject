import { Injectable } from '@angular/core';
import { Review } from '../../../shared/IModels';

@Injectable({
  providedIn: 'root'
})
export class Reviews {
  private storageKey = 'productReviews';
  private loadAllReviews():Review[]{
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }
  private saveAllReviews(reviews:Review[]): void{
    localStorage.setItem(this.storageKey,JSON.stringify(reviews));
  }

  //Get All Reviews For A product
  getReviewsByProduct(productId: string):Review[]{
    return this.loadAllReviews().filter(r => r.productId === productId);
  }
  //Add Review
  addReview(productId : string , userId:string , userName: string , rating: number, comment: string):void{
    const allReviews = this.loadAllReviews();
    const newReview:Review ={
      id: crypto.randomUUID(),
      productId,
      userId,
      userName,
      rating,
      comment,
      createdAt: new Date()
    };
    allReviews.push(newReview);
    this.saveAllReviews(allReviews);
  }
  //delete 
  deleteReview(reviewId:string, userId:string):void{
    const allReviews = this.loadAllReviews();
    const reviewsAfterDeletion = allReviews.filter(r =>!(r.id === reviewId && r.userId === userId));
    this.saveAllReviews( reviewsAfterDeletion);
  }
}
