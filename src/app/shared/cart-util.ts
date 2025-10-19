import { product } from './IModels';
import { ICartItem } from '../../interfaces/icart-item';

export const toCartItem = (product: product): ICartItem => ({
    productId: product._id,
    title: product.title,
    price: product.price,
    quantity: 1,
    imageCover: product.imageCover,
    priceAfterDiscount: product.priceAfterDiscount,
});