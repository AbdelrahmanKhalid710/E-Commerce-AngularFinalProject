import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../Auth/login';

@Injectable({
  providedIn: 'root'
})
export class Favorites {
  private baseUrl = 'https://ecommerce.routemisr.com/api/v1/wishlist';
  constructor(private http: HttpClient, private auth: Login) { }
  
  

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    console.log(token);
    
    return new HttpHeaders({
      token: `${token}`
    });
  }
  //AddProductToFavorite
  addProductToFavoriteList(productId: string): Observable<any> {
    return this.http.post(this.baseUrl, { productId }, { headers: this.getAuthHeaders() });
  }

  //Remove
  removeProductFromFavoriteList(productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${productId}`, { headers: this.getAuthHeaders() });
  }
  //Get All Favorties for logged user
  getAllFavoriteProducts(): Observable<any> {
    return this.http.get(this.baseUrl, { headers: this.getAuthHeaders() });
  }
}
