import type { NextFunction, Response } from "express";
import config from "../config";
import logger from "../config/logger";
import {
    cacheUser,
    getCachedUser
} from "../services/tokenCacheService";
import type {
    AuthenticatedRequest,
    AuthValidationResponse
} from "../types/auth";

export async function authenticateToken(
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction
): Promise<void> {
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
        const cachedUser = await getCachedUser(token);

        if (cachedUser) {
            request.auth = cachedUser;
            next();
            return;
        }

        const authResponse = await fetch(
            `${config.authServiceUrl}/api/auth/validate`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (authResponse.status === 401) {
            response.status(401).json({
                data: {
                    message: "Invalid or expired authentication token."
                }
            });

            return;
        }

        if (!authResponse.ok) {
            throw new Error(
                `Auth service responded with status ${authResponse.status}.`
            );
        }

        const validationResult =
            (await authResponse.json());

        request.auth = validationResult.data;

        await cacheUser(token, validationResult.data);

        next();
    } catch (error) {
        logger.error(error, "Unable to validate authentication token.");

        response.status(503).json({
            data: {
                message: "Authentication service is temporarily unavailable."
            }
        });
    }
}
