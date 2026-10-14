
import type { Response, Request } from "express";
import { DefectType, Inspection, Machine } from "../../models";
import logger from "../../config/logger";
import { AuthenticatedRequest } from "../../types/auth";
import getValidDate from "../../utils/files/getValidDate";

import type { FileInspectionRow } from '../../types'
import { SEVERITIES } from "../../constants";
import checkFileValidity from "../../utils/files/checkFileValidity";



export default async (request: AuthenticatedRequest, response: Response) => {
    try {

        const fileValidity = checkFileValidity(request.file)

        if (!fileValidity.isValid) {
            return response.status(400).json({
                data: {
                    message: fileValidity.message || "File Not Valid."
                }
            });
        }
        const rows = fileValidity.rows;

        let addedCount = 0;
        let skippedCount = 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const row of rows) {
            const date = row.date || ""
            const inspectionDate = getValidDate(date);

            const machineName = row.machineName?.trim();
            const defectTypeName = row.defectType?.trim();
            const severity = row.severity?.trim();

            const validSeverity = SEVERITIES.includes(severity ?? "");

            if (
                !inspectionDate ||
                inspectionDate > today ||
                !machineName ||
                !defectTypeName ||
                !validSeverity
            ) {
                skippedCount++;
                continue;
            }

            const machine = await Machine.findOne({
                where: {
                    machineName
                }
            });

            const defectType = await DefectType.findOne({
                where: {
                    name: defectTypeName
                }
            });

            if (!machine || !defectType) {
                skippedCount++;
                continue;
            }

            try {
                await Inspection.create({
                    date: inspectionDate,
                    machineId: machine.id,
                    defectTypeId: defectType.id,
                    severity,
                    remarks: row.remarks?.trim() || null,
                    status: "Open",
                    loggedUserId: request.auth!.userId,
                    loggedUserName: request.auth!.name
                });

                addedCount++;
            } catch (error) {
                logger.warn(error, "Unable to add one inspection from imported file.");

                skippedCount++;
            }
        }

        response.status(201).json({
            data: {
                message: "File import successful.",
                addedCount,
                skippedCount
            }
        });
    } catch (error) {
        logger.error(error, "Unable to import inspection file.");

        response.status(500).json({
            data: {
                message: "Unable to import inspection file."
            }
        });
    }
}
