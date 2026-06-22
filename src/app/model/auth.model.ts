export interface SignInRequest {
    username: string;
    password: string;
}

export interface RegisterRequest{
    username: string;
    password: string;
    confirmPassword: string;
    role: 'ROLE_USER'
}
export interface AuthResponse {
    token: string;
}

