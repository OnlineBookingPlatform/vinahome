import type { DTO_RQ_UpdateTicketOnPlatform } from "~/types/TicketType";
import type { ApiResponse } from "./APIResponse";
// const API_GATEWAY_URL = "http://localhost:3002";
// const API_GATEWAY_URL = "https://8ace-2001-ee0-4f00-57d0-f4b5-6d0d-6d5-45c3.ngrok-free.app";
const config = useRuntimeConfig();
const API_GATEWAY_URL = config.public.API_GATEWAY_URL;

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

export const updateTicketOnPlatformAPI = async (
  data: DTO_RQ_UpdateTicketOnPlatform[]
): Promise<ApiResponse<void>> => {
  try {
    return await $fetch<ApiResponse<void>>(
      `${API_GATEWAY_URL}/v2/ticket/update-ticket-on-platform`,
      {
        method: "POST",
        body: data,
      }
    );
  } catch (error) {
    console.error("Error updating ticket on platform:", error);
    throw error;
  }
}


