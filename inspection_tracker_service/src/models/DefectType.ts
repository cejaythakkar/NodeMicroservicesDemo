import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../config/database.js";

class DefectType extends Model {
    declare id: string;
    declare name: string;
    declare description: string | null;
}

DefectType.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.literal("gen_random_uuid()"),
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: "defect_types",
        timestamps: false
    }
);

export default DefectType;
