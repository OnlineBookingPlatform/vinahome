import type { DTO_RQ_SuperAdminLogin, SuperAdminType, UserType } from "~/types/AccountType";
import type { ApiResponse } from "~/api/APIResponse";
// const API_BASE_URL = "https://vinahome-server.onrender.com";
// const API_GATEWAY_URL = "http://localhost:3002";
// const config = useRuntimeConfig();
// const API_GATEWAY_URL = config.public.API_GATEWAY_URL;
export const loginWithGoogle = async (accessToken: string): Promise<ApiResponse<UserType>> => {
    const config = useRuntimeConfig();
    const API_GATEWAY_URL = config.public.apiGatewayUrl;
    if (!accessToken) {
        throw new Error("Access token is required");
    }
    try {
        return await $fetch<ApiResponse<UserType>>(`${API_GATEWAY_URL}/v1/auth/google-login`, {
            method: "POST",
            body: { accessToken },
        });
    } catch (error) {
        console.error("Login failed: ", error);
        throw error;
    }
};

export const loginWithFacebook = async (accessToken: string): Promise<ApiResponse<UserType>> => {
    const config = useRuntimeConfig();
    const API_GATEWAY_URL = config.public.apiGatewayUrl;
    if (!accessToken) {
        throw new Error("Access token is required");
    }

    try {
        return await $fetch<ApiResponse<UserType>>(`${API_GATEWAY_URL}/v1/auth/facebook-login`, {
            method: "POST",
            body: { accessToken },
        });
    } catch (error) {
        console.error("Login failed: ", error);
        throw error;
    }
};

export const loginSuperAdminAPI = async (data: DTO_RQ_SuperAdminLogin): Promise<ApiResponse<SuperAdminType>> => {
    const config = useRuntimeConfig();
    const API_GATEWAY_URL = config.public.apiGatewayUrl;
    try {
        return await $fetch<ApiResponse<SuperAdminType>>(`${API_GATEWAY_URL}/v1/auth/super-admin-login`, {
            method: "POST",
            body: data,
        });
    } catch (error) {
        console.error("Login failed: ", error);
        throw error;
    }
}