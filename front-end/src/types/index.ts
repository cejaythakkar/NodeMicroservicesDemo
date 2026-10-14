export type DefectType = {
    id: string;
    name: string;
    description: string | null;
};

export type Machine = {
    id: string;
    machineName: string;
};

export type InspectionMetadata = {
    defectTypes: DefectType[];
    machines: Machine[];
    severities: string[];
    statuses: string[]
};

export type Inspection = {
    id: string;
    date: string;
    severity: string;
    status: string;
    remarks: string | null;
    resolutionNotes: string | null;
    loggedUserId: string;
    loggedUserName: string | null;
    resolvedUserId: string | null;
    resolvedUserName: string | null;
    machine: {
        machineName: string;
    };
    defectType: {
        name: string;
    };
};

export type LoggedInUser = {
    id: string;
    name: string;
    email: string;
    role: string;
};

export type AuthState = {
    token: string | null;
    user: LoggedInUser | null;
};
