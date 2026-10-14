import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../config/database.js";

export type Severity = "Critical" | "Major" | "Minor";

export type InspectionStatus = "Open" | "Resolved";

class Inspection extends Model {
    declare id: string;
    declare date: Date;
    declare machineId: string;
    declare defectTypeId: string;
    declare severity: Severity;
    declare remarks: string | null;
    declare status: InspectionStatus;
    declare resolutionNotes: string | null;
    declare loggedUserId: string;
    declare resolvedUserId: string | null;
    declare loggedUserName: string | null;
    declare resolvedUserName: string | null;
}

Inspection.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.literal("gen_random_uuid()"),
            primaryKey: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        machineId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: "machine_id"
        },
        defectTypeId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: "defect_type_id"
        },
        severity: {
            type: DataTypes.ENUM("Critical", "Major", "Minor"),
            allowNull: false
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM("Open", "Resolved"),
            allowNull: false,
            defaultValue: "Open"
        },
        resolutionNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: "resolution_notes"
        },
        loggedUserId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: "logged_user_id"
        },
        resolvedUserId: {
            type: DataTypes.UUID,
            allowNull: true,
            field: "resolved_user_id"
        },
        loggedUserName: {
            type: DataTypes.STRING,
            allowNull: true,
            field: "logged_user_name"
        },
        resolvedUserName: {
            type: DataTypes.STRING,
            allowNull: true,
            field: "resolved_user_name"
        },
    },
    {
        sequelize,
        tableName: "inspections",
        timestamps: true
    }
);

export default Inspection;
