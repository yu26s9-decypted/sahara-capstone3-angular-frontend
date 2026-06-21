import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Order, OrderLineItem } from "../model/order.model";
import { environment } from "../../environment/environment";

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private http = inject(HttpClient);

    createOrder(): Observable<Order> {
        return this.http.post<Order>(`${environment.baseURL}/orders`, {});
    }

    getOrder(): Observable<Order[]>{
        return this.http.get<Order[]>(`${environment.baseURL}/orders`)
    }

    getOrderItems(orderId: number): Observable<OrderLineItem[]>{
        return this.http.get<OrderLineItem[]>(`${environment.baseURL}/orders/${orderId}`)
    }
}