import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroSlider } from '../hero-slider/hero-slider/hero-slider';
import { CategorySlider } from '../category-slider/category-slider';
import { FeaturedProducts } from '../featured-products/featured-products';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeroSlider,
    CategorySlider,
    FeaturedProducts
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
