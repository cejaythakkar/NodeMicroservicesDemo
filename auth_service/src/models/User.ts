import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../config/database.js";
import Role from "./Role";

class User extends Model {
    declare id: string;
    declare name: string;
    declare email: string;
    declare password: string;
    declare role?: Role;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.literal("gen_random_uuid()"),
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        roleId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: "role_id"
        }
    },
    {
        sequelize,
        tableName: "users",
        timestamps: true
    }
);

export default User;
