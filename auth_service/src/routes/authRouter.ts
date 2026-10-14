import { Router, Request, Response } from "express";
import { LoginRequest } from "../types/auth";
import logger from "../config/logger";
import { login } from "../services/authService";
import { authenticateToken } from "../middleware/authenticateToken";
import type { AuthenticatedRequest } from "../types/auth";

const authRouter = Router();

authRouter.get(
    "/validate",
    authenticateToken,
    (request: AuthenticatedRequest, response: Response) => {
        response.status(200).json({
            data: {
                userId: request.auth!.userId,
                name: request.auth!.name,
                role: request.auth!.role
            }
        });
    }
);

authRouter.post(
    "/login",
    async (request: Request<unknown, unknown, LoginRequest>, response: Response) => {
        const { email, password } = request.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password.trim()
        ) {
            return response.status(400).json({
                data: {
                    message: "Email and password are required."
                }
            });
        }

        try {
            const result = await login({
                email,
                password
            });

            if (!result) {
                return response.status(401).json({
                    data: {
                        message: "Invalid email or password."
                    }
                });
            }

            return response.status(200).json({
                data: result
            });
        } catch (error) {
            logger.error(error, "Login failed unexpectedly.");

            return response.status(500).json({
                data: {
                    message: "Unable to complete login."
                }
            });
        }
    }
);

export default authRouter;
