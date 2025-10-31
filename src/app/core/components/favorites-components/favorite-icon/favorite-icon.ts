import { Component, computed, effect, inject, Input } from '@angular/core';
import { Favorites } from '../../../services/favorites/favoritesService';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-favorite-icon',
  imports: [CommonModule],
  templateUrl: './favorite-icon.html',
  styleUrl: './favorite-icon.css'
})
export class FavoriteIcon {
count = 0;
private favoritesService = inject(Favorites); 
private router = inject(Router);
constructor() {
  effect(() => {
    this.count = this.favoritesService.favoriteCount();
  });
}
navigateToFavorites() {
    this.router.navigate(['/favorites']);
  }
  get iconClass(): string {
    return this.count > 0 ? 'bi bi-heart-fill text-danger' : 'bi bi-heart text-white';
  }
}