import { Injectable } from '@angular/core';
import { Review } from '../../../shared/IModels';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Reviews {
  private baseUrl = 'http://localhost:3000/reviews';
  constructor(private http: HttpClient) {}
  
  //Get All Reviews For A product
    getReviewsByProduct(productId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}?productId=${productId}`);
  }
    addReview(
    productId: string,
    userEmail: string,
    userName: string,
    rating: number,
    comment: string
  ): Observable<Review> {
    const newReview: Review = {
      id: crypto.randomUUID(),
      productId,
      userEmail: userEmail,
      userName,
      rating,
      comment,
      createdAt: new Date()
    };

    return this.http.post<Review>(this.baseUrl, newReview);
  }
  //delete 
 deleteReview(reviewId: string, userEmail: string): Observable<void> {
    // In JSON Server delete by ID
    return this.http.delete<void>(`${this.baseUrl}/${reviewId}`);
  }
}
