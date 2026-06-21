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