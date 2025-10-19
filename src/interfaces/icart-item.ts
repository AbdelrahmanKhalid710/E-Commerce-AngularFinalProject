import { Product } from "./product";

export interface ICartItem {
    product: Product;
    orderQuantity: number;
}