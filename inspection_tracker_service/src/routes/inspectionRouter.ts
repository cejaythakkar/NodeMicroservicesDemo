import type { Response } from "express";
import { Op } from "sequelize";
import { Router } from "express";
import logger from "../config/logger";
import { authenticateToken } from "../middleware/authenticateToken";
import metadataController from "../Controllers/InspectionControllers/metadataController";
import getInspectionsController from "../Controllers/InspectionControllers/getInspectionsController";
import multer from "multer";
import importDefectsController from "../Controllers/InspectionControllers/importDefectsController";
import { DefectType, Machine, Inspection } from "../models";
import { AuthenticatedRequest } from "../types/auth";
import postInspectionController from "../Controllers/InspectionControllers/postInspectionController";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

type CreateInspectionRequest = {
    date?: string;
    machineName?: string;
    defectTypeId?: string;
    severity?: string;
    remarks?: string;
};

const inspectionRouter = Router();

inspectionRouter.get(
    "/metadata",
    authenticateToken,
    metadataController
);

inspectionRouter.get(
    "/",
    authenticateToken,
    getInspectionsController
);

inspectionRouter.post(
    "/importDefects",
    authenticateToken,
    upload.single("file"),
    importDefectsController
);

inspectionRouter.post(
    "/",
    authenticateToken,
    postInspectionController
);

inspectionRouter.patch(
    "/:id/resolve",
    authenticateToken,
    async (request: AuthenticatedRequest, response: Response) => {
        try {
            const id = request.params.id;
            const inspectionId = Array.isArray(id) ? id[0] : id;
            const resolutionNotes = request.body.resolutionNotes?.toString().trim();

            if (!resolutionNotes) {
                return response.status(400).json({
                    data: {
                        message: "A resolution note is required."
                    }
                });
            }

            const inspection = await Inspection.findByPk(inspectionId);

            if (!inspection) {
                return response.status(404).json({
                    data: {
                        message: "Inspection not found."
                    }
                });
            }

            if (inspection.status === "Resolved") {
                return response.status(409).json({
                    data: {
                        message: "Inspection is already resolved."
                    }
                });
            }

            await inspection.update({
                status: "Resolved",
                resolutionNotes,
                resolvedUserId: request.auth!.userId,
                loggedUserId: request.auth!.userId,
                resolvedUserName: request.auth!.name
            });

            const resolvedInspection = await Inspection.findByPk(inspection.id, {
                include: [
                    { model: Machine, as: "machine" },
                    { model: DefectType, as: "defectType" }
                ]
            });

            logger.info(
                {
                    inspectionId: inspection.id,
                    resolvedUserId: request.auth!.userId
                },
                "Inspection resolved."
            );

            return response.status(200).json({
                data: resolvedInspection
            });
        } catch (error) {
            logger.error(error, "Unable to resolve inspection.");

            return response.status(500).json({
                data: {
                    message: "Unable to resolve inspection."
                }
            });
        }
    }
);

inspectionRouter.get(
    "/summary",
    authenticateToken,
    async (request, response) => {
        try {
            const summary = [];

            for (const severity of ["Critical", "Major", "Minor"]) {
                const open = await Inspection.count({
                    where: {
                        severity,
                        status: "Open"
                    }
                });

                const resolved = await Inspection.count({
                    where: {
                        severity,
                        status: "Resolved"
                    }
                });

                summary.push({
                    severity,
                    open,
                    resolved
                });
            }

            return response.status(200).json({
                data: summary
            });
        } catch (error) {
            logger.error(error, "Unable to retrieve inspection summary.");

            return response.status(500).json({
                data: {
                    message: "Unable to retrieve inspection summary."
                }
            });
        }
    }
);

export default inspectionRouter;
