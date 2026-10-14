export type FileInspectionRow = {
    date?: string;
    machineName?: string;
    defectType?: string;
    severity?: string;
    remarks?: string;
};

export type FileValidity = { isValid: boolean, message?: string, rows?: any }
