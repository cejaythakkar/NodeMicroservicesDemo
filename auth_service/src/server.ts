import "dotenv/config";
import cors from "cors";
import express from "express";
import logger from "./config/logger";
import authRouter from "./routes/authRouter";
import sequelize from "./config/database";
import { establishRelationship } from "./models";
import { seedAuthData } from './seed/seed_data'

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);

app.get("/health", (_request, response) => {
    response.status(200).json({
        data: {
            service: "auth-service",
            status: "ok"
        }
    });
});

async function startServer(): Promise<void> {
    try {
        await sequelize.authenticate();
        logger.info("Database Connected");

        await sequelize.query(
            "CREATE EXTENSION IF NOT EXISTS pgcrypto"
        );
        establishRelationship();
        await sequelize.sync();
        logger.info("Tables craete and in sync.");
        await seedAuthData();
        app.listen(port, () => {
            logger.info(`Auth service is running on port ${port}`);
        });


    } catch (error) {
        logger.error(error, "Unable to start auth service:");
        process.exit(1);
    }
}

startServer();
