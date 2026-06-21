import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../model/product.model";
import { environment } from "../../environment/environment";

@Injectable({
    providedIn: 'root'
})

export class ProductService{
    constructor(private http: HttpClient) {}

    getAllProduct(name?: string): Observable<Product[]>{
        const params: any = {};
        if(name) params['name'] = name;
        return this.http.get<Product[]>(`${environment.baseURL}/products`, { params })
    }

    getProductById(productId: number): Observable<Product>{
        return this.http.get<Product>(`${environment.baseURL}/products/${productId}`)
    }
}