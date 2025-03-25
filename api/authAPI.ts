import type {UserType} from "~/types/AccountType";
import type {ApiResponse} from "~/api/APIResponse";
// const API_BASE_URL = "https://vinahome-server.onrender.com";
const API_BASE_URL = "http://localhost:3002";
export const loginWithGoogle = async (accessToken: string): Promise<ApiResponse<UserType>> => {
    if (!accessToken) {
        throw new Error("Access token is required");
    }
    try {
        return await $fetch<ApiResponse<UserType>>(`${API_BASE_URL}/auth/google-login`, {
            method: "POST",
            body: { accessToken },
        });
    } catch (error) {
        console.error("Login failed: ", error);
        throw error;
    }
};
