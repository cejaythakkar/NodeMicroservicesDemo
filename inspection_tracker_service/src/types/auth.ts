import { Request } from "express";

export interface AuthenticatedUser {
    userId: string;
    name: string;
    role: string;
}

export interface AuthValidationResponse {
    data: AuthenticatedUser;
}

export interface AuthenticatedRequest extends Request {
    auth?: AuthenticatedUser;
    file?: any;
}
