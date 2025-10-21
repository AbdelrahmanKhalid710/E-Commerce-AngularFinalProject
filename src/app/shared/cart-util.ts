import { Product } from '../../interfaces/product';
import { ICartItem } from '../../interfaces/icart-item';

export const toCartItem = (product: Product): ICartItem => ({
    product: product,
    orderQuantity: 1,
});