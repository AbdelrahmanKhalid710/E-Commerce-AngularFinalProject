import { Product } from './product';
import { Category } from './category';
import { Brand } from './brand';

export interface ApiResponse<T> {
  data: T;
  status: string;
  results?: number;
}

export interface ProductsResponse extends ApiResponse<Product[]> {}
export interface ProductResponse extends ApiResponse<Product> {}
export interface CategoriesResponse extends ApiResponse<Category[]> {}
export interface CategoryResponse extends ApiResponse<Category> {}
export interface BrandsResponse extends ApiResponse<Brand[]> {}
export interface BrandResponse extends ApiResponse<Brand> {}