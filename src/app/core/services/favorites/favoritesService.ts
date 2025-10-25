import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Login } from '../Auth/login';

@Injectable({
  providedIn: 'root'
})
export class Favorites {
  private baseUrl = 'https://ecommerce.routemisr.com/api/v1/wishlist';
  private favoriteIds = signal<Set<string>>(new Set());

  constructor(private http: HttpClient, private auth: Login) { }
  
  

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    console.log(token);
    
    return new HttpHeaders({
      token: `${token}`
    });
  }
  //AddProductToFavorite
     addProductToFavoriteList(productId: string) {
    return this.http.post(this.baseUrl, { productId }, { headers: this.getAuthHeaders() }).pipe(
      tap(() => this.favoriteIds.update(ids => new Set(ids).add(productId)))
    );
  }

  removeProductFromFavoriteList(productId: string) {
    return this.http.delete(`${this.baseUrl}/${productId}`, { headers: this.getAuthHeaders() }).pipe(
      tap(() => this.favoriteIds.update(ids => {
        const newSet = new Set(ids);
        newSet.delete(productId);
        return newSet;
      }))
    );
  }

  getAllFavoriteProducts() {
    return this.http.get(this.baseUrl, { headers: this.getAuthHeaders() }).pipe(
      tap((response: any) => {
        this.favoriteIds.set(new Set(response.data.map((p: any) => p._id)));
      })
    );
  }
  //Toggle Favorite
 toggleFavorite(productId: string) {
    if (this.isFavorite(productId)) {
      return this.removeProductFromFavoriteList(productId);
    } else {
      return this.addProductToFavoriteList(productId);
    }
  }

  // check if a product is favorite
  isFavorite(productId: string): boolean {
    return this.favoriteIds().has(productId);
  }
  favoritesSignal() {
    return this.favoriteIds;
  }
}
