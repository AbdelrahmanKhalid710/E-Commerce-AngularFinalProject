import { Component, inject, OnInit } from '@angular/core';
import { Login } from '../../services/Auth/login';
import { Order } from '../../../../interfaces/iorder';
import { OrderService } from '../../services/order/order-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-component',
  imports: [CommonModule],
  templateUrl: './order-component.html',
  styleUrl: './order-component.css'
})
export class OrderComponent implements OnInit {
  private auth = inject(Login);
  private orderService = inject(OrderService);

  orders: Order[] = [];

  ngOnInit(): void {
    const userEmail = this.auth.currentUser()?.email;
    if (userEmail) {
      this.orderService.getOrders().subscribe(allOrders => {
        this.orders = allOrders.filter(o => o.userEmail === userEmail);
      });
    }
  }

}