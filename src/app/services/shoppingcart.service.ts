import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ShoppingCart, ShoppingCartItem } from "../model/shoppingcart.model";
import { environment } from "../../environment/environment";


@Injectable({
    providedIn:'root'
})

export class ShoppingCartService{
    constructor(private http: HttpClient) {}

    getCartItem(): Observable<ShoppingCart>{
        return this.http.get<ShoppingCart>(`${environment.baseURL}/cart`)
    }

    addProductToCart(productId: number): Observable<ShoppingCart>{
        return this.http.post<ShoppingCart>(`${environment.baseURL}/cart/products/${productId}`, {})
    }
}