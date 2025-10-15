import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FavoritesList } from "./core/components/favorites-components/favorites-list/favorites-list";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FavoritesList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('E-Commerce-AngularFinalProject');
}
