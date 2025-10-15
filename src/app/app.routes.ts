import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'favorites',
    loadComponent: () =>
      import('./core/components/favorites-components/favorites-list/favorites-list').then(m => m.FavoritesList)
  }
];
