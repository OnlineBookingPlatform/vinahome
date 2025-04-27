import type { Province } from "~/types/LocationType";
import type { ApiResponse } from "./APIResponse";

// const API_GATEWAY_URL = "http://localhost:3002";
const API_GATEWAY_URL = "https://8172-2001-ee0-4f00-57d0-a516-9578-1651-ef25.ngrok-free.app";

export const getProvinces = async (): Promise<ApiResponse<Province[]>> => {
  try {
    return await $fetch<ApiResponse<Province[]>>(
      `${API_GATEWAY_URL}/v2/location/provinces`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};
