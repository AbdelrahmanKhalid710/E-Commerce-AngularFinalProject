import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Favorites {
  private baseUrl = 'https://ecommerce.routemisr.com';
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('userToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
  //AddProductToFavorite
  addProductToFavoriteList(productId: string): Observable<any> {
    return this.http.post(this.baseUrl, { productId }, { headers: this.getAuthHeaders() });
  }

  //Remove
  removeProductFromFavoriteList(productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/v1/favorites/${productId}`, { headers: this.getAuthHeaders() });
  }
  //Get All Favorties for logged user
  getAllFavoriteProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/v1/favorites`, { headers: this.getAuthHeaders() });
  }
}
