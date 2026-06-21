import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environment/environment";

@Injectable({
    providedIn:'root'
})

export class PaymentService{
    private http = inject(HttpClient)

    createPaymentIntent(amount: number): Observable<{ clientSecret: string }>{
        return this.http.post<{ clientSecret: string}>(`${environment.baseURL}/payment/create-intent`, {amount})
    }

}