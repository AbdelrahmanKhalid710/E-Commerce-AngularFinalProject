// // analytics.component.ts
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-analytics',
//   standalone: true,
//   imports: [
//     CommonModule,
    
//   ],
//   templateUrl: './Admin-Analysis-Comonent.html',
//   styleUrls: ['./Admin-Analysis-Comonent.css']
// })
// export class AnalyticsComponent {
 
// }

// analytics.component.ts
import { Component, OnInit } from '@angular/core';
import { AnalyticsService, AnalyticsData } from '../../../services/AdminDashBoard/admin-analysis.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
    imports: [CommonModule],
  templateUrl: './Admin-Analysis-Comonent.html',
  styleUrls: ['./Admin-Analysis-Comonent.css']
})
export class AnalyticsComponent implements OnInit {
  analytics?: AnalyticsData;
  isLoading = true;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.analyticsService.getOptimizedAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        this.isLoading = false;
        console.log('Analytics Data Loaded:', data);
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
        this.isLoading = false;
        // You can set default data here for error state
      }
    });
  }

   getTotalRevenue(): number { return this.analytics?.financial?.totalRevenue || 0; }
  getTotalOrders(): number { return this.analytics?.orders?.totalOrders || 0; }
  getPaidOrders(): number { return this.analytics?.orders?.paidOrders || 0; }
  getUnpaidOrders(): number { return this.analytics?.orders?.unpaidOrders || 0; }
  getTotalUsers(): number { return this.analytics?.users?.totalUsers || 0; }
  getConversionRate(): number { return this.analytics?.users?.conversionRate || 0; }
  getAverageOrderValue(): number { return this.analytics?.financial?.averageOrderValue || 0; }
  getDeliveredOrders(): number { return this.analytics?.orders?.deliveredOrders || 0; }
  getPendingDeliveryOrders(): number { return this.analytics?.orders?.pendingDeliveryOrders || 0; }

  getCashOrders(): number { return this.analytics?.financial?.paymentMethodDistribution?.cash?.count || 0; }
  getCashRevenue(): number { return this.analytics?.financial?.paymentMethodDistribution?.cash?.revenue || 0; }
  getCardOrders(): number { return this.analytics?.financial?.paymentMethodDistribution?.card?.count || 0; }
  getCardRevenue(): number { return this.analytics?.financial?.paymentMethodDistribution?.card?.revenue || 0; }

  getTopProducts() { return this.analytics?.topPerformers?.topProducts?.slice(0, 5) || []; }

  getPaymentPercentage(method: 'cash' | 'card'): number {
    const total = this.getCashOrders() + this.getCardOrders();
    if (total === 0) return 0;
    return method === 'cash' ? (this.getCashOrders() / total) * 100 : (this.getCardOrders() / total) * 100;
  }

  getProductPercentage(revenue: number): number {
    const total = this.getTotalRevenue();
    return total > 0 ? (revenue / total) * 100 : 0;
  }

  refreshData() {
    this.isLoading = true;
    this.loadAnalytics();
  }
 getTopCities() { return this.analytics?.geographic?.topCities?.slice(0, 5) || []; }
  getCityWithMostOrders() { return this.analytics?.geographic?.topCities[0] || null; }
  getTotalCities() { return this.analytics?.geographic?.topCities?.length || 0; }

  // 📅 Temporal Helper Methods
  getBusiestMonth() { return this.analytics?.temporal?.busiestMonths[0] || null; }
  getPeakRegistrationMonth() { return this.analytics?.temporal?.userRegistrationMonths[0] || null; }
  getPeakHours() { return this.analytics?.temporal?.dailyPatterns?.peakHours?.slice(0, 3) || []; }
  getWeeklyPattern() { return this.analytics?.temporal?.dailyPatterns?.weeklyPattern || []; }

  // Format growth with arrow indicator
  getGrowthIndicator(growth: number): string {
    if (growth > 0) return `📈 +${growth}%`;
    if (growth < 0) return `📉 ${growth}%`;
    return `➡️ ${growth}%`;
  }

  getGrowthClass(growth: number): string {
    if (growth > 0) return 'growth-positive';
    if (growth < 0) return 'growth-negative';
    return 'growth-neutral';
  }
}