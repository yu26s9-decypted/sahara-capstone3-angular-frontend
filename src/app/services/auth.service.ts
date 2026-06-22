import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { AuthResponse, RegisterRequest, SignInRequest } from "../model/auth.model";
import { Observable } from "rxjs";
import { environment } from "../../environment/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService{
    private http = inject(HttpClient);
    isAuthenticated = signal(this.getToken() !== null);

    private get storage(): Storage | null {
        return typeof localStorage === 'undefined' ? null : localStorage;
    }

    login(request: SignInRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.baseURL}/login`, request)
    }

    signUp(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.baseURL}/register`, request)
    }

    saveToken(token: string): void {
        this.storage?.setItem('session_token', token)
        this.isAuthenticated.set(true)
    }

    getToken(): string | null {
        return this.storage?.getItem('session_token') ?? null
    }

    isLoggedIn(): boolean {
        return this.getToken() !== null;
    }

    logout(){
        this.storage?.removeItem('session_token')
        this.storage?.removeItem('username')
        this.isAuthenticated.set(false)
    }

    saveUsername(username: string): void {
        this.storage?.setItem('username', username);
    }

    getUsername(): string | null {
        return this.storage?.getItem('username') ?? null;
    }
}
