import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environment/environment";
import { Profile } from "../model/userprofile.model";

@Injectable({
    providedIn: 'root'
})

export class UserService{
    profile = signal<Profile | null>(null);

    constructor(private http: HttpClient) {}

    getUserProfile(): Observable<Profile>{
        return this.http.get<Profile>(`${environment.baseURL}/profile`)
    }

    loadUserProfile(): void {
        this.getUserProfile().subscribe({
            next: (profile) => this.profile.set(profile),
            error: (err) => console.error(err)
        })
    }

    editUserProfile(profile: Profile): Observable<Profile>{
        return this.http.put<Profile>(`${environment.baseURL}/profile`, profile)
    }

    clearProfile(): void {
        this.profile.set(null);
    }
}
