import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}
export interface UsersApiResponse {
  totalUsers: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
  };
  users: AdminUser[];
}

export interface AdminOrder {
  _id?: string;
  id?: number;
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
    postalCode?: string;
  };
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: 'cash' | 'card';
  isPaid: boolean;
  isDelivered?: boolean;
  createdAt: string;
  updatedAt?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  cartItems?: Array<{
    _id: string;
    product: {
      _id: string;
      title: string;
      imageCover: string;
    };
    price: number;
    quantity: number;
  }>;
}

export interface OrdersApiResponse {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
  };
  data: AdminOrder[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  private baseUrl = 'https://ecommerce.routemisr.com'; // Replace with your actual base URL

  constructor(private http: HttpClient) {}

  getAllUsers(page: number = 1): Observable<UsersApiResponse> {
  return this.http.get<UsersApiResponse>(`${this.baseUrl}/api/v1/users?page=${page}`);
}

   getAllOrders(page: number = 1): Observable<OrdersApiResponse> {
    return this.http.get<OrdersApiResponse>(`${this.baseUrl}/api/v1/orders/?page=${page}`);
  }

}