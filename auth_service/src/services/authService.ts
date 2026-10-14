import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import logger from "../config/logger.js";
import config from "../config";
import { Role, User } from "../models/index.js";
import type {
    AccessTokenPayload,
    LoginRequest,
    LoginResponse
} from "../types/auth";

export async function login(
    credentials: LoginRequest
): Promise<LoginResponse | null> {
    const user = await User.findOne({
        where: {
            email: credentials.email.trim().toLowerCase()
        },
        include: [
            {
                model: Role,
                as: "role",
                attributes: ["id", "roleName"]
            }
        ]
    });

    if (!user || !user.role) {
        return null;
    }

    const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.password
    );

    if (!isPasswordValid) {
        return null;
    }

    const payload: AccessTokenPayload = {
        userId: user.id,
        name: user.name,
        role: user.role.roleName
    };

    const token = jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"]
    });

    logger.info(
        { userId: user.id, email: user.email },
        "User signed in."
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.roleName
        }
    };
}
