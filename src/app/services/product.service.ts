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

    getAllProduct(): Observable<Product[]>{
        return this.http.get<Product[]>(`${environment.baseURL}/products`)
    }
}