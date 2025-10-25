import { Category } from './category';
import { Brand } from './brand';

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  category: Category;
  brand: Brand;
  quantity: number;
  sold: number;
  images: string[];
  imageCover: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  createdAt: string;
  updatedAt: string;
}