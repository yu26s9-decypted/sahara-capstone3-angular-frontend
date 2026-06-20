export interface SignInRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}