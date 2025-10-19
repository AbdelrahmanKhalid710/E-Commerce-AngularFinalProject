export interface ICartItem {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    imageCover?: string;
    priceAfterDiscount?: number;
}