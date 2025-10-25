import { Component, Input } from '@angular/core';
import { Favorites } from '../../../services/favorites/favoritesService';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-favorite-icon',
  imports: [CommonModule],
  templateUrl: './favorite-icon.html',
  styleUrl: './favorite-icon.css'
})
export class FavoriteIcon {
  @Input() productId!: string;
  @Input() favoritesList!: string[];

  isFavorite = false;
  loading = false;

  constructor(private favoritesService: Favorites) { }
  ngOnInit() {
    this.isFavorite = this.favoritesList.includes(this.productId);
  }
    toggleFavorite() {
    this.loading = true;
    if (this.isFavorite) {
      this.favoritesService.removeProductFromFavoriteList(this.productId).subscribe({
        next: () => {
          this.isFavorite = false;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.favoritesService.addProductToFavoriteList(this.productId).subscribe({
        next: () => {
          this.isFavorite = true;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
}