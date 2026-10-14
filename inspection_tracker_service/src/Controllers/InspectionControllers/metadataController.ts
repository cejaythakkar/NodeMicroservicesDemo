import type { Response, Request } from "express";
import logger from "../../config/logger";
import { DefectType, Machine } from "../../models";
import * as Constants from '../../constants';

export default async (request: Request, response: Response) => {
    try {
        const defectTypes = await DefectType.findAll({
            attributes: ["id", "name", "description"],
            order: [["name", "ASC"]]
        });

        const machines = await Machine.findAll({
            attributes: ["id", "machineName"],
            order: [["machineName", "ASC"]]
        });

        response.status(200).json({
            data: {
                defectTypes,
                machines,
                severities: Constants.SEVERITIES,
                statuses: Constants.STATUSES
            }
        });
    } catch (error) {
        logger.error(error, "Something went wrong while retriving metadata.");

        response.status(500).json({
            data: {
                message: "Something went wrong while retriving metadata. Contact Admin and please try again."
            }
        });
    }
}
