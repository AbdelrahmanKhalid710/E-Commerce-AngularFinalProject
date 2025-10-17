import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { HeroSlide } from '../../../../../../interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [ CommonModule, RouterModule],
  templateUrl: './hero-slider.html',
  styleUrl: './hero-slider.css'
})
export class HeroSlider implements OnInit, OnDestroy {
  currentSlide = signal(0);
  private autoSlideInterval: any;
  
  readonly slides: HeroSlide[] = [
    {
      id: 1,
      title: "Elegant Shawl Fashion",
      subtitle: "Women's Shawls That Every Woman Should Own",
      image: "https://embracejourneywithin.com/cdn/shop/collections/Shawl_Product_Photography_San_Diego_-_Shay_Studios-135.jpg?v=1715321404&width=2400",
      buttonText: "Shop Now",
      buttonLink: "/products"
    },
    {
      id: 2,
      title: "Home & Lifestyle",
      subtitle: "Stay warm and stylish this season with our premium collection",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=500&fit=crop&auto=format",
      buttonText: "Explore",
      buttonLink: "/products"
    },
    {
      id: 3,
      title: "Electronics & Tech",
      subtitle: "Up to 50% off on latest gadgets and tech accessories",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=500&fit=crop&auto=format",
      buttonText: "Buy Now",
      buttonLink: "/products"
    }
  ];

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  nextSlide(): void {
    this.currentSlide.update(current => (current + 1) % this.slides.length);
  }

  prevSlide(): void {
    this.currentSlide.update(current => (current - 1 + this.slides.length) % this.slides.length);
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    this.restartAutoSlide();
  }

  private startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  private stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  private restartAutoSlide(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }
}
