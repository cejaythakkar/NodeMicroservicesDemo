import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../config/database.js";

class Role extends Model {
    declare id: string;
    declare roleName: string;
}

Role.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.literal("gen_random_uuid()"),
            primaryKey: true
        },
        roleName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            field: "role_name"
        }
    },
    {
        sequelize,
        tableName: "roles",
        timestamps: false
    }
);

export default Role;
