import { createSlice } from "@reduxjs/toolkit";

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

const initialState: AuthState = {
    token: localStorage.getItem("auth-token"),
    user: JSON.parse(localStorage.getItem("user") ?? "null")
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess(
            state,
            action
        ) {
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        logout(state) {
            state.token = null;
            state.user = null;
        }
    }
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
