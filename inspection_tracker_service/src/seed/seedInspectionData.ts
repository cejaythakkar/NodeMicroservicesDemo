import { randomUUID } from "node:crypto";
import sequelize from "../config/database.js";
import logger from "../config/logger.js";

const defectTypes = [
    {
        name: "Weave Defect",
        description: "Broken ends, missing picks, or irregular weave pattern."
    },
    {
        name: "Shade Variation",
        description: "Visible colour inconsistency in the fabric."
    },
    {
        name: "Hole/Tear",
        description: "Hole, tear, cut, or physical damage in the fabric."
    },
    {
        name: "Count Deviation",
        description: "Warp or weft count differs from the specification."
    },
    {
        name: "Other",
        description: "Quality issue not covered by the standard categories."
    }
];

export async function seedInspectionData(): Promise<void> {
    const machines = [
        "Machine-101",
        "Machine-102",
        "Machine-201"
    ];

    for (const machineName of machines) {
        await sequelize.query(
            `
        INSERT INTO machines (id, machine_name)
        VALUES (gen_random_uuid(), :machineName)
        ON CONFLICT (machine_name)
        DO NOTHING;
      `,
            {
                replacements: {
                    machineName
                }
            }
        );
    }

    for (const defectType of defectTypes) {
        await sequelize.query(
            `
        INSERT INTO defect_types (id, name, description)
        VALUES (:id, :name, :description)
        ON CONFLICT (name) DO NOTHING;
      `,
            {
                replacements: {
                    id: randomUUID(),
                    name: defectType.name,
                    description: defectType.description
                }
            }
        );
    }

    logger.info("Defect types are seeded.");
}
