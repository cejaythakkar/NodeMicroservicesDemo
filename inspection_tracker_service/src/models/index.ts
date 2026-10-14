import DefectType from "./DefectType";
import Inspection from "./Inspection";
import Machine from "./Machine";

export function establishRelationships(): void {
    Machine.hasMany(Inspection, {
        foreignKey: "machineId",
        as: "inspections"
    });

    Inspection.belongsTo(Machine, {
        foreignKey: "machineId",
        as: "machine"
    });

    DefectType.hasMany(Inspection, {
        foreignKey: "defectTypeId",
        as: "inspections"
    });

    Inspection.belongsTo(DefectType, {
        foreignKey: "defectTypeId",
        as: "defectType"
    });
}

export { DefectType, Inspection, Machine };
