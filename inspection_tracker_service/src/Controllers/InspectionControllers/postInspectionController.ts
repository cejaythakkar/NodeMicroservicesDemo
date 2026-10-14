import { AuthenticatedRequest } from "../../types/auth";
import { DefectType, Inspection, Machine } from "../../models";
import logger from "../../config/logger";
import { Response } from "express";
import { SEVERITIES } from "../../constants";


export default async (
    request: AuthenticatedRequest,
    response: Response
) => {
    try {
        const {
            date,
            machineName,
            defectTypeId,
            severity,
            remarks
        } = request.body;

        if (
            typeof date !== "string" ||
            typeof machineName !== "string" ||
            typeof defectTypeId !== "string" ||
            typeof severity !== "string" ||
            !machineName.trim()
        ) {
            return response.status(400).json({
                data: {
                    message:
                        "Date, machine/line ID, defect type, and severity are required."
                }
            });
        }

        if (!SEVERITIES.includes(severity)) {
            response.status(400).json({
                data: {
                    message: "Severity must be Critical, Major, or Minor."
                }
            });

            return;
        }

        const inspectionDate = new Date(date);

        if (Number.isNaN(inspectionDate.getTime())) {
            return response.status(400).json({
                data: {
                    message: "Date must be in DD-MM-YYYY format."
                }
            });
        }
        const today = new Date();
        if (inspectionDate > today) {
            return response.status(400).json({
                data: {
                    message: "Future Date not allowed."
                }
            });
        }

        const defectType = await DefectType.findByPk(defectTypeId);

        if (!defectType) {
            response.status(400).json({
                data: {
                    message: "Invalid defect type."
                }
            });

            return;
        }

        const [machine] = await Machine.findOrCreate({
            where: {
                machineName: machineName.trim()
            },
            defaults: {
                machineName: machineName.trim()
            }
        });

        const inspection = await Inspection.create({
            date: inspectionDate,
            machineId: machine.id,
            defectTypeId: defectType.id,
            severity,
            remarks: remarks?.trim() || null,
            loggedUserId: request.auth!.userId,
            loggedUserName: request.auth!.name
        });

        const createdInspection = await Inspection.findByPk(inspection.id, {
            include: [
                { model: Machine, as: "machine" },
                { model: DefectType, as: "defectType" }
            ]
        });

        logger.info(
            {
                inspectionId: inspection.id,
                loggedUserId: request.auth!.userId
            },
            "Inspection created."
        );

        response.status(201).json({
            data: createdInspection
        });
    } catch (error) {
        logger.error(error, "Unable to create inspection.");

        response.status(500).json({
            data: {
                message: "Unable to create inspection."
            }
        });
    }
}
