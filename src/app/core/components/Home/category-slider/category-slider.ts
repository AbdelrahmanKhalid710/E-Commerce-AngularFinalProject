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
        // Ensure we have proper category names and images
        const processedCategories = response.data.slice(0, 6).map(category => ({
          ...category,
          name: this.formatCategoryName(category.name),
          image: this.getCategoryImage(category)
        }));
        this.categories.set(processedCategories);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load categories');
        this.loading.set(false);
        console.error('Error loading categories:', error);
      }
    });
  }

  private formatCategoryName(name: string): string {
    // Fix abbreviated names
    const nameMap: { [key: string]: string } = {
      'Cooking S.': 'Cooking Supplies',
      'Appliance': 'Home Appliances',
      'SuperMarket': 'Supermarket',
      'Baby & Toys': 'Baby & Toys'
      // Add more mappings as needed
    };
    
    return nameMap[name] || name;
  }

  private getCategoryImage(category: Category): string {
    // Use category image if available, otherwise use a relevant placeholder
    if (category.image) return category.image;
    
    const imageMap: { [key: string]: string } = {
      'Cooking Supplies': 'https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=Cooking',
      'Diapers': 'https://via.placeholder.com/200x200/4ECDC4/FFFFFF?text=Diapers',
      'Home Appliances': 'https://via.placeholder.com/200x200/45B7D1/FFFFFF?text=Appliances',
      'Supermarket': 'https://via.placeholder.com/200x200/96CEB4/FFFFFF?text=Grocery',
      'Baby & Toys': 'https://via.placeholder.com/200x200/FECA57/FFFFFF?text=Baby+Toys'
    };
    
    return imageMap[category.name] || `https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=${encodeURIComponent(category.name)}`;
  }
}
