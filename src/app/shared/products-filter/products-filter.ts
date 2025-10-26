import { CommonModule } from '@angular/common';
import { Component, output, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category, Brand } from '../../../interfaces';



@Component({
  selector: 'app-products-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-filter.html',
  styleUrl: './products-filter.css',
})
export class ProductsFilter {
// Inputs - expecting arrays of Category and Brand objects
  categories = input<Category[]>([]);
  brands = input<Brand[]>([]);
  
  // Outputs
  searchChange = output<string>();
  categoryChange = output<string>();
  brandChange = output<string>();
  priceRangeChange = output<{ min: number; max: number }>();
  sortChange = output<string>();
  clearFilters = output<void>();

  // Local state
  searchTerm = signal('');
  selectedCategory = signal('all');
  selectedBrand = signal('all');
  priceRange = signal({ min: 0, max: 1000 });
  sortBy = signal('name');

  // Price range options
  priceRanges = [
    { label: 'All Prices', min: 0, max: 10000 },
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200, max: 10000 }
  ];

  // Sort options
  sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price', label: 'Price Low to High' },
    { value: 'price-desc', label: 'Price High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  onSearchChange(): void {
    this.searchChange.emit(this.searchTerm());
  }

  onCategoryChange(): void {
    this.categoryChange.emit(this.selectedCategory() === 'all' ? '' : this.selectedCategory());
  }

  onBrandChange(): void {
    this.brandChange.emit(this.selectedBrand() === 'all' ? '' : this.selectedBrand());
  }

  onPriceRangeChange(min: number, max: number): void {
    this.priceRange.set({ min, max });
    this.priceRangeChange.emit({ min, max });
  }

  onSortChange(): void {
    this.sortChange.emit(this.sortBy());
  }

  onClearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('all');
    this.selectedBrand.set('all');
    this.priceRange.set({ min: 0, max: 1000 });
    this.sortBy.set('name');
    
    this.clearFilters.emit();
  }
}
