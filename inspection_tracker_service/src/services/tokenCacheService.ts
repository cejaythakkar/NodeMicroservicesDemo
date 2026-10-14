import { createHash } from "node:crypto";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
import type { AuthenticatedUser } from "../types/auth";

function cacheKey(token: string): string {
    const tokenHash = createHash("sha256").update(token).digest("hex");

    return `auth:token:${tokenHash}`;
}

export async function getCachedUser(
    token: string
): Promise<AuthenticatedUser | null> {
    const cachedValue = await redis.get(cacheKey(token));

    if (!cachedValue) {
        return null;
    }

    return JSON.parse(cachedValue) as AuthenticatedUser;
}

export async function cacheUser(
    token: string,
    user: AuthenticatedUser
): Promise<void> {
    const payload = jwt.decode(token);

    if (
        !payload ||
        typeof payload === "string" ||
        typeof payload.exp !== "number"
    ) {
        return;
    }

    const expiresInSeconds = Math.floor(
        payload.exp - Date.now() / 1000
    );

    if (expiresInSeconds <= 0) {
        return;
    }

    await redis.set(cacheKey(token), JSON.stringify(user), {
        EX: expiresInSeconds
    });
}
