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
    port: Number(process.env.PORT ?? 3002),
    databaseUrl: getEnvironmentVariable("DATABASE_URL"),
    redisUrl: getEnvironmentVariable("REDIS_URL"),
    authServiceUrl: getEnvironmentVariable("AUTH_SERVICE_URL"),
    nodeEnv: process.env.NODE_ENV ?? "development",
    logLevel: process.env.LOG_LEVEL ?? "info"
};

export default config;
