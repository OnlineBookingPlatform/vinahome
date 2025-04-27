import type { DTO_RQ_ZaloPay } from "~/types/ZaloPayType";
import type { ApiResponse } from "./APIResponse";
// const API_GATEWAY_URL = "http://localhost:3002";
const API_GATEWAY_URL = "https://8172-2001-ee0-4f00-57d0-a516-9578-1651-ef25.ngrok-free.app";

export const createPaymentUrl = async (
  orderId: string,
  amount: number
): Promise<ApiResponse<any>> => {
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
