import jwt from "jsonwebtoken";
import config from "../config";
import type { NextFunction, Response } from "express";
import type {
    AccessTokenPayload,
    AuthenticatedRequest
} from "../types/auth";

export function authenticateToken(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction
): void {
    const authorizationHeader = request.header("Authorization");

    if (!authorizationHeader?.startsWith("Bearer ")) {
        response.status(401).json({
            data: {
                message: "Authentication token is required."
            }
        });

        return;
    }

    const token = authorizationHeader.slice("Bearer ".length);

    try {
        const decoded = jwt.verify(token, config.jwtSecret);

        if (typeof decoded === "string") {
            throw new Error("Unexpected token payload.");
        }

        request.auth = decoded as AccessTokenPayload;
        next();
    } catch {
        response.status(401).json({
            data: {
                message: "Invalid or expired authentication token."
            }
        });
    }
}
