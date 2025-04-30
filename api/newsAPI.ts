import type { DTO_RQ_NewsType, NewsType } from "~/types/NewsType";
import type { ApiResponse } from "./APIResponse";

export const registerReceiveNewsAPI = async (
    data: DTO_RQ_NewsType
): Promise<ApiResponse<void>> => {
    const config = useRuntimeConfig();
    const API_GATEWAY_URL = config.public.apiGatewayUrl;
    try {
        return await $fetch<ApiResponse<void>>(
            `${API_GATEWAY_URL}/v1/news/register-receive-news`,
            {
                method: "POST",
                body: data,
            }
        );
    } catch (error) {
        console.error("Register Receive News failed: ", error);
        throw error;
    }
}
export const getListReceiveNewsAPI = async (): Promise<ApiResponse<NewsType[]>> => {
    const config = useRuntimeConfig();
    const API_GATEWAY_URL = config.public.apiGatewayUrl;
    try {
        return await $fetch<ApiResponse<NewsType[]>>(
            `${API_GATEWAY_URL}/v1/news/get-list-receive-news`,
            {
                method: "GET",
            }
        );
    } catch (error) {
        console.error("Get List Receive News failed: ", error);
        throw error;
    }
}