// analytics.service.ts
import { Injectable } from '@angular/core';
import { AdminDataService, AdminOrder, AdminUser, OrdersApiResponse, UsersApiResponse } from './admin-data.service';
import { Observable, map, forkJoin, switchMap, catchError } from 'rxjs'; // ✅ Added all necessary imports

// Simplified interface for analytics data
export interface AnalyticsData {
  // 📈 FINANCIAL METRICS
  geographic: {
    topCities: Array<{
      city: string;
      orders: number;
      revenue: number;
      users: number;
    }>;
    ordersByCity: { [key: string]: number };
    revenueByCity: { [key: string]: number };
  };

  // 📅 TEMPORAL ANALYTICS
  temporal: {
    busiestMonths: Array<{
      month: string;
      orders: number;
      revenue: number;
      growth: number;
    }>;
    userRegistrationMonths: Array<{
      month: string;
      registrations: number;
      growth: number;
    }>;
    dailyPatterns: {
      peakHours: Array<{ hour: string; orders: number }>;
      weeklyPattern: Array<{ day: string; orders: number }>;
    };
  };

  financial: {
    totalRevenue: number;
    averageOrderValue: number;
    revenueByMonth: { [key: string]: number };
    paymentMethodDistribution: {
      cash: { count: number; revenue: number };
      card: { count: number; revenue: number };
    };
  };

  // 📦 ORDER METRICS
  orders: {
    totalOrders: number;
    paidOrders: number;
    unpaidOrders: number;
    deliveredOrders: number;
    pendingDeliveryOrders: number;
  };

  // 👥 USER METRICS
  users: {
    totalUsers: number;
    usersWithOrders: number;
    conversionRate: number;
    newUsersLast7Days: number;
  };

  // 🏆 TOP PERFORMERS
  topPerformers: {
    topProducts: Array<{
      productName: string;
      sales: number;
      revenue: number;
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private adminDataService: AdminDataService) { }

  /**
 * 🌍 GEOGRAPHIC METRICS
 */
private calculateGeographicMetrics(users: AdminUser[], orders: AdminOrder[]): AnalyticsData['geographic'] {
  const ordersByCity: { [key: string]: number } = {};
  const revenueByCity: { [key: string]: number } = {};
  const usersByCity: { [key: string]: number } = {};

  // Count users by city
  

  // Count orders and revenue by city
  orders.forEach(order => {
    const city = order.shippingAddress?.city || 'Unknown';
    
    // Orders count
    ordersByCity[city] = (ordersByCity[city] || 0) + 1;
    
    // Revenue
    if (order.isPaid) {
      revenueByCity[city] = (revenueByCity[city] || 0) + order.totalOrderPrice;
    }
  });

  // Create top cities array
  const allCities = new Set([
    ...Object.keys(ordersByCity),
    ...Object.keys(revenueByCity),
    ...Object.keys(usersByCity)
  ]);

  const topCities = Array.from(allCities)
    .map(city => ({
      city,
      orders: ordersByCity[city] || 0,
      revenue: revenueByCity[city] || 0,
      users: usersByCity[city] || 0
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10); // Top 10 cities by revenue

  return {
    topCities,
    ordersByCity,
    revenueByCity
  };
}

/**
 * 📅 TEMPORAL METRICS
 */
private calculateTemporalMetrics(users: AdminUser[], orders: AdminOrder[]): AnalyticsData['temporal'] {
  // Monthly metrics for orders
  const monthlyOrders: { [key: string]: { orders: number; revenue: number } } = {};
  const monthlyRegistrations: { [key: string]: number } = {};
  
  // Process orders by month
  orders.forEach(order => {
    const orderDate = new Date(order.createdAt);
    const monthKey = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!monthlyOrders[monthKey]) {
      monthlyOrders[monthKey] = { orders: 0, revenue: 0 };
    }
    
    monthlyOrders[monthKey].orders++;
    if (order.isPaid) {
      monthlyOrders[monthKey].revenue += order.totalOrderPrice;
    }
  });

  // Process user registrations by month
  users.forEach(user => {
    const regDate = new Date(user.createdAt);
    const monthKey = `${regDate.getFullYear()}-${(regDate.getMonth() + 1).toString().padStart(2, '0')}`;
    monthlyRegistrations[monthKey] = (monthlyRegistrations[monthKey] || 0) + 1;
  });

  // Calculate busiest months with growth
  const busiestMonths = Object.keys(monthlyOrders)
    .map(monthKey => {
      const previousMonth = this.getPreviousMonth(monthKey);
      const previousRevenue = monthlyOrders[previousMonth]?.revenue || 0;
      const currentRevenue = monthlyOrders[monthKey].revenue;
      const growth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      return {
        month: monthKey,
        orders: monthlyOrders[monthKey].orders,
        revenue: currentRevenue,
        growth
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 12); // Last 12 months

  // Calculate user registration growth
  const userRegistrationMonths = Object.keys(monthlyRegistrations)
    .map(monthKey => {
      const previousMonth = this.getPreviousMonth(monthKey);
      const previousRegistrations = monthlyRegistrations[previousMonth] || 0;
      const currentRegistrations = monthlyRegistrations[monthKey];
      const growth = previousRegistrations > 0 ? 
        ((currentRegistrations - previousRegistrations) / previousRegistrations) * 100 : 0;

      return {
        month: monthKey,
        registrations: currentRegistrations,
        growth
      };
    })
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12); // Last 12 months

  // Daily patterns
  const hourlyOrders: { [key: string]: number } = {};
  const dailyOrders: { [key: string]: number } = {};
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  orders.forEach(order => {
    const orderDate = new Date(order.createdAt);
    
    // Hourly pattern
    const hour = `${orderDate.getHours().toString().padStart(2, '0')}:00`;
    hourlyOrders[hour] = (hourlyOrders[hour] || 0) + 1;
    
    // Weekly pattern
    const dayName = daysOfWeek[orderDate.getDay()];
    dailyOrders[dayName] = (dailyOrders[dayName] || 0) + 1;
  });

  return {
    busiestMonths,
    userRegistrationMonths,
    dailyPatterns: {
      peakHours: Object.keys(hourlyOrders)
        .map(hour => ({ hour, orders: hourlyOrders[hour] }))
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 8), // Top 8 hours
      weeklyPattern: daysOfWeek.map(day => ({
        day,
        orders: dailyOrders[day] || 0
      }))
    }
  };
}

/**
 * 🔙 HELPER: GET PREVIOUS MONTH
 */
private getPreviousMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  let prevMonth = month - 1;
  let prevYear = year;
  
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear = year - 1;
  }
  
  return `${prevYear}-${prevMonth.toString().padStart(2, '0')}`;
}

  /**
   * 🎯 OPTIMIZED ANALYTICS FUNCTION
   * Uses limited data for performance
   */
  getOptimizedAnalytics(): Observable<AnalyticsData> {
    return forkJoin({
      users: this.getLimitedUsers(10),    // Only 10 pages of users (400 users)
      orders: this.getLimitedOrders(20)   // Only 20 pages of orders (800 orders)
    }).pipe(
      map(({ users, orders }) => {
        return this.calculateAllMetrics(users, orders);
      }),
      catchError(error => {
        console.error('Analytics Error:', error);
        throw error;
      })
    );
  }

  /**
   * 🔄 LIMITED USERS FETCHER (Performance Optimized)
   * Fetches only first 10 pages instead of 3,452 pages
   */
  private getLimitedUsers(maxPages: number = 10): Observable<AdminUser[]> {
    return this.adminDataService.getAllUsers(1).pipe(
      switchMap(firstPage => {
        const pagesToFetch = Math.min(firstPage.metadata.numberOfPages, maxPages);
        const requests: Observable<UsersApiResponse>[] = [];

        for (let page = 1; page <= pagesToFetch; page++) {
          requests.push(this.adminDataService.getAllUsers(page));
        }

        return forkJoin(requests).pipe(
          map(responses => {
            const allUsers: AdminUser[] = [];
            responses.forEach(response => {
              allUsers.push(...response.users);
            });
            return allUsers;
          })
        );
      })
    );
  }

  /**
   * 🔄 LIMITED ORDERS FETCHER (Performance Optimized)
   * Fetches only first 20 pages instead of 1,773 pages
   */
  private getLimitedOrders(maxPages: number = 20): Observable<AdminOrder[]> {
    return this.adminDataService.getAllOrders(1).pipe(
      switchMap(firstPage => {
        const pagesToFetch = Math.min(firstPage.metadata.numberOfPages, maxPages);
        const requests: Observable<OrdersApiResponse>[] = [];

        for (let page = 1; page <= pagesToFetch; page++) {
          requests.push(this.adminDataService.getAllOrders(page));
        }

        return forkJoin(requests).pipe(
          map(responses => {
            const allOrders: AdminOrder[] = [];
            responses.forEach(response => {
              allOrders.push(...response.data);
            });
            return allOrders;
          })
        );
      })
    );
  }

  /**
   * 🧮 CALCULATE ALL METRICS
   */
  private calculateAllMetrics(users: AdminUser[], orders: AdminOrder[]): AnalyticsData {
    return {
      financial: this.calculateFinancialMetrics(orders),
      orders: this.calculateOrderMetrics(orders),
      users: this.calculateUserMetrics(users, orders),
      topPerformers: this.calculateTopPerformers(orders),
      geographic: this.calculateGeographicMetrics(users, orders),
      temporal: this.calculateTemporalMetrics(users, orders)
    };
  }

  /**
   * 💰 FINANCIAL METRICS
   */
  private calculateFinancialMetrics(orders: AdminOrder[]): AnalyticsData['financial'] {
    let totalRevenue = 0;
    let paidOrdersCount = 0;
    const revenueByMonth: { [key: string]: number } = {};
    const paymentMethodDistribution = {
      cash: { count: 0, revenue: 0 },
      card: { count: 0, revenue: 0 }
    };

    orders.forEach(order => {
      if (order.isPaid) {
        totalRevenue += order.totalOrderPrice;
        paidOrdersCount++;

        // Monthly revenue
        const orderDate = new Date(order.createdAt);
        const monthKey = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}`;
        revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + order.totalOrderPrice;

        // Payment methods
        if (order.paymentMethodType === 'cash') {
          paymentMethodDistribution.cash.count++;
          paymentMethodDistribution.cash.revenue += order.totalOrderPrice;
        } else if (order.paymentMethodType === 'card') {
          paymentMethodDistribution.card.count++;
          paymentMethodDistribution.card.revenue += order.totalOrderPrice;
        }
      }
    });

    return {
      totalRevenue,
      averageOrderValue: paidOrdersCount > 0 ? totalRevenue / paidOrdersCount : 0,
      revenueByMonth,
      paymentMethodDistribution
    };
  }

  /**
   * 📦 ORDER METRICS
   */
  private calculateOrderMetrics(orders: AdminOrder[]): AnalyticsData['orders'] {
    let paidOrders = 0;
    let unpaidOrders = 0;
    let deliveredOrders = 0;
    let pendingDeliveryOrders = 0;

    orders.forEach(order => {
      if (order.isPaid) {
        paidOrders++;
        if (order.isDelivered) {
          deliveredOrders++;
        } else {
          pendingDeliveryOrders++;
        }
      } else {
        unpaidOrders++;
        pendingDeliveryOrders++;
      }
    });

    return {
      totalOrders: orders.length,
      paidOrders,
      unpaidOrders,
      deliveredOrders,
      pendingDeliveryOrders
    };
  }

  /**
   * 👥 USER METRICS
   */
  private calculateUserMetrics(users: AdminUser[], orders: AdminOrder[]): AnalyticsData['users'] {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let newUsersLast7Days = 0;

    // User growth
    users.forEach(user => {
      const registrationDate = new Date(user.createdAt);
      if (registrationDate >= sevenDaysAgo) {
        newUsersLast7Days++;
      }
    });

    // Conversion rate
    const usersWithOrders = new Set();
    orders.forEach(order => {
      if (order.user && order.user._id) {
        usersWithOrders.add(order.user._id);
      }
    });

    const conversionRate = users.length > 0 ? (usersWithOrders.size / users.length) * 100 : 0;

    return {
      totalUsers: users.length,
      usersWithOrders: usersWithOrders.size,
      conversionRate,
      newUsersLast7Days
    };
  }

  /**
   * 🏆 TOP PERFORMERS
   */
  private calculateTopPerformers(orders: AdminOrder[]): AnalyticsData['topPerformers'] {
    const productSales: { [key: string]: { sales: number; revenue: number } } = {};

    orders.forEach(order => {
      if (order.isPaid && order.cartItems) {
        order.cartItems.forEach(item => {
          const productName = item.product.title;
          
          if (!productSales[productName]) {
            productSales[productName] = { sales: 0, revenue: 0 };
          }
          
          // Handle both 'quantity' and 'count' properties
          const quantity = (item as any).quantity || (item as any).count || 1;
          productSales[productName].sales += quantity;
          productSales[productName].revenue += item.price * quantity;
        });
      }
    });

    const topProducts = Object.keys(productSales)
      .map(productName => ({
        productName,
        sales: productSales[productName].sales,
        revenue: productSales[productName].revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return { topProducts };
  }

  /**
   * 📊 QUICK DASHBOARD STATS
   */
  getDashboardStats(): Observable<{
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    conversionRate: number;
  }> {
    return this.getOptimizedAnalytics().pipe(
      map(analytics => ({
        totalRevenue: analytics.financial.totalRevenue,
        totalOrders: analytics.orders.totalOrders,
        totalUsers: analytics.users.totalUsers,
        conversionRate: analytics.users.conversionRate
      }))
    );
  }
}