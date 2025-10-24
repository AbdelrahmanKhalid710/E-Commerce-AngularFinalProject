import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../../../interfaces/iorder';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:3000/orders'; // JSON Server endpoint
  //To run the server: json-server --watch db.json --port 3000

  constructor(private http: HttpClient) { }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, order);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  /** Get a single order by ID */
  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  /** Delete an order */
  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
