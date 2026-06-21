import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
import { ShoppingCart, ShoppingCartItem } from "../model/shoppingcart.model";
import { environment } from "../../environment/environment";
import { tap } from "rxjs";

@Injectable({
    providedIn:'root'
})

export class ShoppingCartService{
    constructor(private http: HttpClient) {}
    cartCount = signal(0)

    getCartItem(): Observable<ShoppingCart>{
        return this.http.get<ShoppingCart>(`${environment.baseURL}/cart`)
    }

    loadCart(): void {
        this.getCartItem().subscribe({
            next: (data) => this.cartCount.set(Object.keys(data.items).length),
            error: (err) => console.error(err)
        })
    }

    addProductToCart(productId: number): Observable<ShoppingCart>{
        return this.http.post<ShoppingCart>(`${environment.baseURL}/cart/products/${productId}`, {}).pipe(
            tap(cart => this.cartCount.set(Object.keys(cart.items).length))
        )
    }

    incrementProductQuantity(productId: number, quantity: number): Observable<ShoppingCart>{
        return this.http.put<ShoppingCart>(`${environment.baseURL}/cart/products/${productId}`, {quantity})
    }
}