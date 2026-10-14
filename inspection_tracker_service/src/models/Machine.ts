import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../config/database.js";

class Machine extends Model {
    declare id: string;
    declare machineName: string;
}

Machine.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.literal("gen_random_uuid()"),
            primaryKey: true
        },
        machineName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            field: "machine_name"
        }
    },
    {
        sequelize,
        tableName: "machines",
        timestamps: false
    }
);

export default Machine;
