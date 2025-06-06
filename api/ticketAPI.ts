import type { DTO_RP_TicketSearch, DTO_RQ_TicketSearch, DTO_RQ_UpdateTicketOnPlatform } from "~/types/TicketType";
import type { ApiResponse } from "./APIResponse";
// const API_GATEWAY_URL = "http://localhost:3002";
// const API_GATEWAY_URL = "https://8ace-2001-ee0-4f00-57d0-f4b5-6d0d-6d5-45c3.ngrok-free.app";
// const config = useRuntimeConfig();
// const API_GATEWAY_URL = config.public.API_GATEWAY_URL;
// const API_GATEWAY_URL = "http://localhost:3002";

export const changeTicketBookedAPI = async (
  data: any
): Promise<ApiResponse<void>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
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
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
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
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
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

export const searchTicketOnPlatformAPI = async (
  data: DTO_RQ_TicketSearch
): Promise<ApiResponse<DTO_RP_TicketSearch>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<DTO_RP_TicketSearch>>(
      `${API_GATEWAY_URL}/v2/ticket/search-ticket-on-platform`,
      {
        method: "POST",
        body: data,
      }
    );
  } catch (error) {
    console.error("Error searching ticket on platform:", error);
    throw error;
  }
} 
export const getTicketByAccountIdAPI = async (
  id: string
): Promise<ApiResponse<DTO_RP_TicketSearch[]>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<DTO_RP_TicketSearch[]>>(
      `${API_GATEWAY_URL}/v2/ticket/get-ticket-by-account-id/${id}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Error getting ticket by account ID:", error);
    throw error;
  }
}

export const abortTicketOnPlatformAPI = async (
  id: number
): Promise<ApiResponse<void>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<void>>(
      `${API_GATEWAY_URL}/v2/ticket/abort-ticket-on-platform/${id}`,
      {
        method: "PUT",
      }
    );
  } catch (error) {
    console.error("Error aborting ticket:", error);
    throw error;
  }
}

