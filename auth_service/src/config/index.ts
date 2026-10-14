import dotenv from "dotenv";

dotenv.config();

function getEnvironmentVariable(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is not defined in the environment variables`);
    }

    return value;
}

const config = {
    port: Number(process.env.PORT ?? 3001),
    databaseUrl: getEnvironmentVariable("DATABASE_URL"),
    jwtSecret: getEnvironmentVariable("JWT_SECRET"),
    jwtExpiresIn: getEnvironmentVariable("JWT_EXPIRES_IN"),
    nodeEnv: process.env.NODE_ENV ?? "development",
    logLevel: process.env.LOG_LEVEL ?? "info",
};

export default config;
