import cors from "cors";
import express from "express";
import config from "./config";
import logger from "./config/logger";
import redis from "./config/redis";
import sequelize from "./config/database";
import { establishRelationships } from "./models";
import { seedInspectionData } from "./seed/seedInspectionData";
import inspectionRouter from "./routes/inspectionRouter";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/inspections", inspectionRouter);

app.get("/health", (_request, response) => {
    response.status(200).json({
        data: {
            service: "inspection-tracker-service",
            status: "ok"
        }
    });
});

async function startServer(): Promise<void> {
    try {

        await sequelize.authenticate();
        logger.info("PostgreSQL connection established.");
        await sequelize.query(
            "CREATE EXTENSION IF NOT EXISTS pgcrypto"
        );
        establishRelationships();
        await sequelize.sync();
        logger.info("Inspection tables are ready.");
        await seedInspectionData();
        await redis.connect();
        logger.info("Redis connection established.");

        app.listen(config.port, () => {
            logger.info(
                `Inspection tracker service is running on port ${config.port}`
            );
        });
    } catch (error) {
        logger.error(error, "Unable to start inspection tracker service.");
        process.exit(1);
    }
}

startServer();
