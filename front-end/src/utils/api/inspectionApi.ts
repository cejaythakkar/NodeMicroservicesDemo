import apiClient from "./axios-client";


const inspectionApiUrl = import.meta.env.VITE_INSPECTION_API_URL;



export async function getInspectionMetadata() {
    const response = await apiClient.get(
        `${inspectionApiUrl}/api/inspections/metadata`
    );

    return response.data.data;
}

export async function createInspection(data: {
    date: string;
    machineName: string;
    defectTypeId: string;
    severity: string;
    remarks: string;
}) {
    const response = await apiClient.post(
        `${inspectionApiUrl}/api/inspections`,
        data
    );

    return response.data.data;
}



export async function getInspections(filters: {
    severity?: string;
    status?: string;
    from?: string;
    to?: string;
    sortBy?: string;
    order?: string;
}) {
    const response = await apiClient.get(
        `${inspectionApiUrl}/api/inspections`,
        {
            params: filters
        }
    );

    return response.data.data;
}

export async function resolveInspection(
    inspectionId: string,
    resolutionNotes: string
) {
    const response = await apiClient.patch(
        `${inspectionApiUrl}/api/inspections/${inspectionId}/resolve`,
        {
            resolutionNotes
        }
    );

    return response.data.data;
}

export async function getInspectionSummary() {
    const response = await apiClient.get(
        `${inspectionApiUrl}/api/inspections/summary`
    );

    return response.data.data;
}
