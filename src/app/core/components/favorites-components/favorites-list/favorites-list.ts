import { Component, OnInit } from '@angular/core';
import { Favorites } from '../../../services/favorites/favoritesService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites-list',
  imports: [CommonModule],
  templateUrl: './favorites-list.html',
  styleUrl: './favorites-list.css',
  standalone: true
})
export class FavoritesList {
  favorites: any[] = [];
  loading = true;
  constructor(private favoritesService: Favorites) { }
  ngOnInit(): void {
    this.getFavorites();
  }
  getFavorites() {
    this.favoritesService.getAllFavoriteProducts().subscribe({
      next: (res: any) => {
        this.favorites = res?.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching favorites:', err);
        this.loading = false;
      }
    });
  }
  removeFromList(productId: string): void {
    this.favoritesService.removeProductFromFavoriteList(productId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f._id !== productId);
      },
      error: (err) => console.error('Error deleting favorite:', err)
    });
  }
}
