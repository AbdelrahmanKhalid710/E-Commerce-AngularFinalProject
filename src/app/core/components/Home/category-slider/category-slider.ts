import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api-service';
import { Category } from '../../../../../interfaces/category';

@Component({
  selector: 'app-category-slider',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-slider.html',
  styleUrl: './category-slider.css'
})
export class CategorySlider {
  private apiService = inject(ApiService);
  
  categories = signal<Category[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.apiService.getAllCategories().subscribe({
      next: (response) => {
        this.categories.set(response.data.slice(0, 6));
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load categories');
        this.loading.set(false);
        console.error('Error loading categories:', error);
      }
    });
  }

  // CHANGE: Make this method public instead of private
  getCategoryImage(category: Category): string {
    return category.image || `https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=${encodeURIComponent(category.name)}`;
  }
}
