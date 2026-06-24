import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { max, Observable } from "rxjs";
import { Product } from "../model/product.model";
import { environment } from "../../environment/environment";

@Injectable({
    providedIn: 'root'
})

export class ProductService{
    constructor(private http: HttpClient) {}

    getAllProduct(name?: string, categoryId?: number, minPrice?: number, maxPrice?:number): Observable<Product[]>{
        const params: any = {};

        if(name) params['name'] = name;
        if(categoryId) params['cat'] = categoryId;
        if(minPrice) params['minPrice'] = minPrice;
        if(maxPrice) params['maxPrice'] = maxPrice;

        return this.http.get<Product[]>(`${environment.baseURL}/products`, { params })
    }

    getProductById(productId: number): Observable<Product>{
        return this.http.get<Product>(`${environment.baseURL}/products/${productId}`)
    }
}