import { Product } from "./product.model";

export interface ShoppingCartItem {
    product: Product;
    quantity: number;
    discountPercent: number;
}

export interface ShoppingCart {
    items: { 
        [productId: number]: ShoppingCartItem
    };
    total: number;
}