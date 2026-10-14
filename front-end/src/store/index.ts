import { configureStore } from "@reduxjs/toolkit";
import type { AuthState } from '../types'
import authReducer from "./slices/authSlice";
import metadataReducer, { type MetaDataState } from "./slices/metadataSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        metadata: metadataReducer
    }
});

export type AppDispatch = typeof store.dispatch;

export type RootState = {
    auth: AuthState;
    metadata: MetaDataState
};
