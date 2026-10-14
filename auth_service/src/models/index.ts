import Role from "./Role";
import User from "./User";

export function establishRelationship(): void {
    Role.hasMany(User, {
        foreignKey: "roleId",
        as: "users"
    });

    User.belongsTo(Role, {
        foreignKey: "roleId",
        as: "role"
    });
}


export { Role, User };
