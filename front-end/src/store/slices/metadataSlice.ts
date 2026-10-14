import { createSlice } from "@reduxjs/toolkit";
import type { InspectionMetadata } from '../../types'
import { getInspectionMetadata } from "../../utils/api/inspectionApi";

export type MetaDataState = {
    metadata: InspectionMetadata | null;
};

const initialState = {
    metadata: null
};

const metadataSlice = createSlice({
    name: "metadata",
    initialState,
    reducers: {
        setMetadataData(state, action) {
            state.metadata = action.payload;
        }
    }
});

export const fetchMetadataData = () => {
    console.log('first')
    return async (dispatch: any) => {
        try {
            const data = await getInspectionMetadata();
            console.log(data)
            dispatch(metadataSlice.actions.setMetadataData(data));
        } catch (error) {
            console.error("Unable to load metadata.", error);
        } finally {

        }
    };
};

export const { setMetadataData } = metadataSlice.actions;

export default metadataSlice.reducer;
