import type { ApiResponse } from "./APIResponse";
const API_GATEWAY_URL = "http://localhost:3002";

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
