import type { DiscountType } from "~/types/DiscountType";
import type { ApiResponse } from "./APIResponse";

export const getDiscountsByUserPurchase = async (userId: string): Promise<ApiResponse<DiscountType[]>> => {
    const config = useRuntimeConfig();
    const API_GATEWAY_URL = config.public.apiGatewayUrl;
    try {
        return await $fetch<ApiResponse<DiscountType[]>>(
            `${API_GATEWAY_URL}/v2/discount/get-discounts-by-user-purchase/${userId}`,
            {
                method: "GET",
            }
        );
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}