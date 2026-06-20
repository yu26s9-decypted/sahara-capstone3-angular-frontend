import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../model/user.model";
import { environment } from "../../environment/environment";
import { Profile } from "../model/userprofile.model";

@Injectable({
    providedIn: 'root'
})

export class UserService{
    constructor(private http: HttpClient) {}

    getUserProfile(): Observable<Profile>{
        return this.http.get<Profile>(`${environment.baseURL}/profile`)
    }
}