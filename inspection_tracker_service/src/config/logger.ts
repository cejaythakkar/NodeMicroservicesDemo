import pino from "pino";
import config from "./";

const logger = pino({
    level: config.logLevel,
    transport:
        config.nodeEnv === "development"
            ? {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    singleLine: true
                }
            }
            : undefined
});

export default logger;
