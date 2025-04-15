import type { ApiResponse } from "./APIResponse";
const API_GATEWAY_URL = "http://localhost:3002";

export const changeTicketBookedAPI = async (
  data: any
): Promise<ApiResponse<void>> => {
  try {
    return await $fetch<ApiResponse<void>>(
      `${API_GATEWAY_URL}/v2/ticket/change-ticket-booked`,
      {
        method: "POST",
        body: data,
      }
    );
  } catch (error) {
    console.error("Error changing ticket booked:", error);
    throw error;
  }
};

export const changeTicketAvailableAPI = async (
  data: any
): Promise<ApiResponse<void>> => {
  try {
    return await $fetch<ApiResponse<void>>(
      `${API_GATEWAY_URL}/v2/ticket/change-ticket-available`,
      {
        method: "POST",
        body: data,
      }
    );
  } catch (error) {
    console.error("Error changing ticket available:", error);
    throw error;
  }
};
