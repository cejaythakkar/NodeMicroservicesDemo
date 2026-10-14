import type { Response } from "express";
import { Op } from "sequelize";
import { DefectType, Machine, Inspection } from "../../models";
import { AuthenticatedRequest } from '../../types/auth';
import * as Constants from "../../constants";
import logger from "../../config/logger";

export default async (request: AuthenticatedRequest, response: Response) => {
    try {
        const machineId = request.query.machine?.toString();
        const severity = request.query.severity?.toString();
        const status = request.query.status?.toString();
        const from = request.query.from?.toString();
        const to = request.query.toString?.toString();
        const sortBy = request.query.sortBy?.toString();
        const order = request.query.order?.toString();

        if (
            severity &&
            !Constants.SEVERITIES.includes(severity)
        ) {
            return response.status(400).json({
                data: { message: "Invalid severity filter." }
            });
        }

        if (status && !Constants.STATUSES.includes(status)) {
            return response.status(400).json({
                data: { message: "Invalid status filter." }
            });
        }

        const where: any = {};

        if (machineId) {
            where.machineId = machineId;
        }

        if (severity) {
            where.severity = severity;
        }

        if (status) {
            where.status = status;
        }

        if (from || to) {
            where.date = {};

            if (from) {
                where.date[Op.gte] = new Date(from);
            }

            if (to) {
                where.date[Op.lte] = new Date(`${to}T23:59:59.999Z`);
            }
        }

        let selectedSortField = "date";

        if (
            sortBy &&
            ["date", "severity", "status", "createdAt"].includes(sortBy)
        ) {
            selectedSortField = sortBy;
        }

        const selectedOrder =
            order?.toUpperCase() === "ASC" ? "ASC" : "DESC";

        const inspections = await Inspection.findAll({
            where,
            include: [
                { model: Machine, as: "machine" },
                { model: DefectType, as: "defectType" }
            ],
            order: [[selectedSortField, selectedOrder]]
        });

        return response.status(200).json({
            data: inspections
        });
    } catch (error) {
        logger.error(error, "Unable to retrieve inspections.");

        return response.status(500).json({
            data: {
                message: "Unable to retrieve inspections."
            }
        });
    }
}
