import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService, AdminOrder, OrdersApiResponse } from '../../../services/AdminDashBoard/admin-data.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders-component.html',
  styleUrls: ['./admin-orders-component.css']
})
export class AdminOrdersComponent implements OnInit {
  adminOrders: AdminOrder[] = [];
  adminLoading = false;
  adminError = '';
  totalOrders = 0;
  currentPage = 1;
  totalPages = 1;

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit(): void {
    this.loadAdminOrders();
  }

  loadAdminOrders(page: number = 1): void {
    console.log(page);
    this.adminLoading = true;
    this.adminError = '';
    
    this.adminDataService.getAllOrders(page).subscribe({
      next: (response: OrdersApiResponse) => {
        console.log("This is order response");
        console.log(response);
        
        this.adminOrders = response.data;
        this.totalOrders = response.results;
        this.currentPage = response.metadata.currentPage;
        this.totalPages = response.metadata.numberOfPages;
        this.adminLoading = false;
      },
      error: (error) => {
        this.adminError = 'Failed to load orders';
        this.adminLoading = false;
        console.error('Admin orders error:', error);
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadAdminOrders(page);
      console.log(page);
    }
  }

  getOrderStatus(order: AdminOrder): string {
    if (order.isDelivered) return 'delivered';
    if (order.isPaid) return 'processing';
    return 'pending';
  }

  getTotalRevenue(): number {
    return this.adminOrders
      .filter(order => order.isPaid)
      .reduce((sum, order) => sum + order.totalOrderPrice, 0);
  }
}