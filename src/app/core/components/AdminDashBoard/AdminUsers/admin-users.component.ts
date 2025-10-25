import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService, AdminUser, UsersApiResponse } from '../../../services/AdminDashBoard/admin-data.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users-component.html',
  styleUrls: ['admin-users-component.css']
})
export class AdminUsersComponent implements OnInit {
  adminUsers: AdminUser[] = [];
  adminLoading = false;
  adminError = '';
  totalUsers = 0;
  currentPage = 1;
  totalPages = 1;

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit(): void {
    this.loadAdminUsers();
  }

  loadAdminUsers(page: number = 1): void {
    this.adminLoading = true;
    this.adminError = '';
    
    this.adminDataService.getAllUsers(page).subscribe({
      next: (response: UsersApiResponse) => {
        console.log("This is user response");
        console.log(response);
        
        this.adminUsers = response.users;
        this.totalUsers = response.totalUsers;
        this.currentPage = response.metadata.currentPage;
        this.totalPages = response.metadata.numberOfPages;
        this.adminLoading = false;
      },
      error: (error) => {
        this.adminError = 'Failed to load users';
        this.adminLoading = false;
        console.error('Admin users error:', error);
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadAdminUsers(page);
    }
  }

  getUserStatus(user: AdminUser): string {
    const registrationDate = new Date(user.createdAt);
    const daysSinceRegistration = (Date.now() - registrationDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceRegistration < 7) return 'new';
    if (daysSinceRegistration < 30) return 'active';
    return 'active';
  }

  getActiveUsersCount(): number {
    return this.adminUsers.length;
  }
}