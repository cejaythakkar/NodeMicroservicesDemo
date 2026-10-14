import { Request } from "express";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthenticatedUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface LoginResponse {
    token: string;
    user: AuthenticatedUser;
}

export interface AccessTokenPayload {
    userId: string;
    name: string;
    role: string;
}

export interface AuthenticatedRequest extends Request {
    auth?: AccessTokenPayload;
}
