import { Product } from "./product.model";

export interface Order {
    orderId: number;
    userId: number;
    date: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    shippingAmount: number;
}

export interface OrderLineItem {
    orderLineItemId: number;
    orderId: number;
    productId: number;
    salesPrice: number;
    quantity: number;
    discount: number;
    product: Product;
}