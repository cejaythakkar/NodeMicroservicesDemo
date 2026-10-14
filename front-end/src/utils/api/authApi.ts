import axios from "axios";
import { type LoggedInUser } from "../../store/slices/authSlice";
import apiClient from "./axios-client";

type LoginResponse = {
    token: string;
    user: LoggedInUser;
};

export async function login(
    email: string,
    password: string
): Promise<LoginResponse> {
    try {
        const response = await apiClient.post(
            `${import.meta.env.VITE_AUTH_API_URL}/api/auth/login`,
            {
                email,
                password
            }
        );

        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.data?.message ?? "Unable to sign in."
            );
        }

        throw new Error("Unable to sign in.");
    }
}
