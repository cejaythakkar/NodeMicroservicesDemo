import bcrypt from "bcryptjs";
import { QueryTypes } from "sequelize";
import sequelize from "../config/database.js";
import logger from "../config/logger.js";

type IdRow = {
    id: string;
};

export async function seedAuthData(): Promise<void> {
    const roles = await sequelize.query<IdRow>(
        `
      INSERT INTO roles (id, role_name)
      VALUES (gen_random_uuid(), :roleName)
    ON CONFLICT (role_name)
      DO UPDATE SET role_name = EXCLUDED.role_name
      RETURNING id;
    `,
        {
            replacements: {
                roleName: "Supervisor"
            },
            type: QueryTypes.SELECT
        }
    );

    const supervisorRoleId = roles[0].id;

    const users = [{
        name: "Jay Thakkar",
        email: "jaythakkar@mail.com",
        password: "jay@123",
        roleId: supervisorRoleId
    }, {
        name: "Tanmay Shah",
        email: "tanmayshah@mail.com",
        password: "ts@123",
        roleId: supervisorRoleId
    }, {
        name: "Charul Patel",
        email: "charulpatel@mail.com",
        password: "cp@123",
        roleId: supervisorRoleId
    }]
    for (const user of users) {
        const passwordHash = await bcrypt.hash(user.password, 12);

        await sequelize.query(
            `
        INSERT INTO users (
          id,
          name,
          email,
          password,
          role_id,
          "createdAt",
          "updatedAt"
        )
        VALUES (
          gen_random_uuid(),
          :name,
          :email,
          :passwordHash,
          :roleId,
          NOW(),
          NOW()
        )
          ON CONFLICT (email) DO NOTHING;
      `,
            {
                replacements: {
                    name: user.name,
                    email: user.email,
                    passwordHash,
                    roleId: user.roleId
                }
            }
        );
    }
    logger.info("users seed successful");

}
