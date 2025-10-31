import {ICartItem} from './icart-item';

export interface Order {
    id: string;
    userEmail: string;
    items: ICartItem[];
    total: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    shippingAddress: string;
    paymentMethod: 'cash' | 'card';
}