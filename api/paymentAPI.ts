import type { DTO_RP_StatusZaloPay, DTO_RQ_ZaloPay } from "~/types/ZaloPayType";
import type { ApiResponse } from "./APIResponse";
// const API_GATEWAY_URL = "http://localhost:3002";
// const API_GATEWAY_URL = "https://8ace-2001-ee0-4f00-57d0-f4b5-6d0d-6d5-45c3.ngrok-free.app";
// const config = useRuntimeConfig();
// const API_GATEWAY_URL = config.public.API_GATEWAY_URL;

export const createPaymentUrl = async (
  orderId: string,
  amount: number
): Promise<ApiResponse<any>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<any>>(
      `${API_GATEWAY_URL}/v2/payment/create`,
      {
        method: "POST",
        body: {
          orderId,
          amount,
        },
      }
    );
  } catch (error) {
    console.error("Error creating payment URL:", error);
    throw error;
  }
};

export const createZaloPayPayment = async (data: DTO_RQ_ZaloPay): Promise<ApiResponse<any>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<any>>(`${API_GATEWAY_URL}/v3/zalopay/create-payment`, {
      method: "POST",
      body: data,
    });
  } catch (error) {
    console.error("Error creating ZaloPay payment:", error);
    throw error;
  }
}

export const checkZaloPayPayment = async (data: DTO_RP_StatusZaloPay): Promise<ApiResponse<any>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<any>>(`${API_GATEWAY_URL}/v3/zalopay/check-payment`, {
      method: "POST",
      body: data,
    });
  } catch (error) {
    console.error("Error checking ZaloPay payment:", error);
    throw error;
  }
}