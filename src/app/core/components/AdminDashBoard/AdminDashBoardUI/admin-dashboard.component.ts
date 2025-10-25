import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminAuthService } from '../../../services/AdminDashBoard/admin-auth.service';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-dashboard-component.html',
  styleUrls: ['./admin-dashboard-component.css']
})
export class AdminDashboardComponent implements OnInit {
  currentAdmin: any = null;

  constructor(private adminAuthService: AdminAuthService) {}

  ngOnInit(): void {
    this.currentAdmin = this.adminAuthService.getCurrentAdmin();
  }

  adminLogout(): void {
    this.adminAuthService.adminLogout();
  }
}