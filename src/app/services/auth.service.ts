import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AuthResponse, SignInRequest } from "../model/auth.model";
import { Observable } from "rxjs";
import { environment } from "../../environment/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    private http = inject(HttpClient);

    login(request: SignInRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.baseURL}/login`, request)
    }

    saveToken(token: string): void {
        localStorage.setItem('session_token', token)
    }

    getToken(): string | null {
        return localStorage.getItem('session_token')
    }

    isLoggedIn(): boolean {
        return this.getToken() !== null;
    }

    logout(){
        localStorage.removeItem('session_token')
    }

    saveUsername(username: string): void {
        localStorage.setItem('username', username);
    }

    getUsername(): string | null {
        return localStorage.getItem('username');
    }
}