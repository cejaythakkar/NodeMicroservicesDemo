import { createClient } from "redis";
import config from "./";
import logger from "./logger";

const redis = createClient({
    url: config.redisUrl
});

redis.on("error", (error) => {
    logger.error(error, "Redis connection error.");
});

export default redis;
