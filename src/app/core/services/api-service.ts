import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
    CategoriesResponse, 
  CategoryResponse, 
  BrandsResponse, 
  BrandResponse, 
  ProductsResponse, 
  ProductResponse
} from '../../../interfaces/api-response'

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = 'https://ecommerce.routemisr.com/api/v1';

    constructor(private http: HttpClient) { }

    getAllCategories(): Observable<CategoriesResponse> {
        return this.http.get<CategoriesResponse>(`${this.baseUrl}/categories`);
    }

    getCategoryById(id: string): Observable<CategoryResponse> {
        return this.http.get<CategoryResponse>(`${this.baseUrl}/categories/${id}`);
    }

    getAllBrands(): Observable<BrandResponse> {
        return this.http.get<BrandResponse>(`${this.baseUrl}/brands`);
    }

    getBrandById(id: string): Observable<BrandResponse> {
    return this.http.get<BrandResponse>(`${this.baseUrl}/brands/${id}`);
  }

  
  getAllProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.baseUrl}/products`);
  }

  getProductById(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/products/${id}`);
  }
}